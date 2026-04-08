'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';
import { loadKeys, saveKeys, loadDifficulty, saveDifficulty, AI_PROVIDERS } from '../../lib/storage';
import type { Difficulty, AiProvider } from '../../lib/storage';

async function testKey(key: string, provider: AiProvider): Promise<{ format: string }> {
  const r = await fetch('/api/ai/test', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ key, provider }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    throw new Error(data?.error || `Request failed (${r.status})`);
  }
  return { format: data?.format || 'standard' };
}

export default function SetupPage() {
  const { locale, messages } = useI18n();
  const router = useRouter();

  const [provider, setProvider] = useState<AiProvider>('openai');
  const [aiKey, setAiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');

  useEffect(() => {
    const existing = loadKeys();
    if (existing) {
      setAiKey(existing.aiKey);
      setProvider(existing.aiProvider);
    }
    setDifficulty(loadDifficulty());
  }, []);

  const currentProvider = AI_PROVIDERS.find(p => p.id === provider)!;
  const canSubmit = aiKey.trim().length > 0;

  const onTest = async () => {
    setBusy(true);
    setStatus(null);
    try {
      const result = await testKey(aiKey.trim(), provider);
      const label = result.format === 'hackathon'
        ? (locale === 'es' ? 'Clave de hackathon detectada.' : locale === 'fr' ? 'Clé hackathon détectée.' : 'Hackathon key detected.')
        : (locale === 'es' ? `Clave de ${currentProvider.label} válida.` : locale === 'fr' ? `Clé ${currentProvider.label} valide.` : `${currentProvider.label} key is valid.`);
      setStatus({ type: 'ok', text: label });
    } catch (e: any) {
      setStatus({ type: 'err', text: e?.message || messages.setup.error });
    } finally {
      setBusy(false);
    }
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    saveKeys({ aiKey: aiKey.trim(), aiProvider: provider });
    saveDifficulty(difficulty);
    router.push(`/${locale}/session`);
  };

  const t = (en: string, es: string, fr: string) =>
    locale === 'es' ? es : locale === 'fr' ? fr : en;

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">{messages.setup.title}</h1>
      <p className="text-[color:var(--muted)] mb-8 leading-relaxed">{messages.setup.subtitle}</p>

      <form onSubmit={onSave} className="space-y-5">
        <div className="glass-card rounded-xl p-5 space-y-4">

          {/* Provider selector */}
          <div>
            <label className="block text-sm font-medium mb-2 text-[color:var(--muted)]">
              {t('AI Provider', 'Proveedor de IA', 'Fournisseur IA')}
            </label>
            <div className="relative">
              <select
                value={provider}
                onChange={(e) => {
                  setProvider(e.target.value as AiProvider);
                  setAiKey('');
                  setStatus(null);
                }}
                className="w-full px-4 py-3 pr-10 rounded-lg bg-[color:var(--card)] border border-[color:var(--border)] focus:border-boxing-red focus:outline-none transition-all text-[color:var(--text)] appearance-none cursor-pointer"
              >
                {AI_PROVIDERS.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--muted)] pointer-events-none" />
            </div>
          </div>

          {/* API Key input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-[color:var(--muted)]">
              {currentProvider.label} {t('API Key', 'Clave API', 'Clé API')}
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={aiKey}
                onChange={(e) => setAiKey(e.target.value)}
                placeholder={currentProvider.hint}
                className="w-full px-4 py-3 pr-12 rounded-lg bg-[color:var(--card)] border border-[color:var(--border)] focus:border-boxing-red focus:outline-none transition-all text-[color:var(--text)] placeholder:text-[color:var(--muted)]"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors"
              >
                {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-[color:var(--muted)] mt-1.5">
              {t(`Example: ${currentProvider.example}`, `Ejemplo: ${currentProvider.example}`, `Exemple: ${currentProvider.example}`)}
            </p>
          </div>

          {/* Difficulty selector */}
          <div>
            <label className="block text-sm font-medium mb-2 text-[color:var(--muted)]">
              {t('Difficulty Level', 'Nivel de dificultad', 'Niveau de difficulté')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { key: 'beginner' as Difficulty, en: 'Beginner', es: 'Principiante', fr: 'Débutant', icon: '🥊' },
                { key: 'intermediate' as Difficulty, en: 'Intermediate', es: 'Intermedio', fr: 'Intermédiaire', icon: '🔥' },
                { key: 'advanced' as Difficulty, en: 'Advanced', es: 'Avanzado', fr: 'Avancé', icon: '🏆' },
              ]).map((lvl) => (
                <button
                  key={lvl.key}
                  type="button"
                  onClick={() => setDifficulty(lvl.key)}
                  className={`px-3 py-3 rounded-lg border text-center text-sm font-medium transition-all ${
                    difficulty === lvl.key
                      ? 'border-boxing-red bg-boxing-red/15 text-[color:var(--text)]'
                      : 'border-[color:var(--border)] hover:border-boxing-red/40 text-[color:var(--muted)]'
                  }`}
                >
                  <span className="block text-lg mb-1">{lvl.icon}</span>
                  {lvl[locale as keyof typeof lvl] || lvl.en}
                </button>
              ))}
            </div>
          </div>

          {status && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm font-medium flex items-start gap-2 transition-all ${
                status.type === 'ok'
                  ? 'border-emerald-400/40 bg-emerald-500/10'
                  : 'border-red-400/40 bg-red-500/10'
              }`}
              style={{ color: status.type === 'ok' ? 'var(--success-text)' : 'var(--error-text, #fca5a5)' }}
            >
              {status.text}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onTest}
              disabled={busy || !canSubmit}
              className="px-4 py-2 rounded-lg border border-[color:var(--border)] hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {busy ? messages.setup.testing : messages.setup.testKeys}
            </button>

            <button
              type="submit"
              disabled={busy || !canSubmit}
              className="px-4 py-2 rounded-lg bg-boxing-red hover:bg-red-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {messages.setup.saveAndContinue}
            </button>
          </div>

          <p className="text-xs text-[color:var(--muted)]">
            {t(
              'Your API key is stored in localStorage on this device only.',
              'Tu clave API se guarda en localStorage solo en este dispositivo.',
              'Votre clé API est stockée en localStorage sur cet appareil uniquement.'
            )}
          </p>
        </div>
      </form>
    </div>
  );
}
