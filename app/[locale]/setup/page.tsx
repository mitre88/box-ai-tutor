'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';
import { loadKeys, saveKeys, loadDifficulty, saveDifficulty } from '../../lib/storage';
import type { Difficulty } from '../../lib/storage';

async function testKey(url: string, key: string) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ key }),
  });
  if (!r.ok) {
    const data = await r.json().catch(() => ({}));
    throw new Error(data?.error || `Request failed (${r.status})`);
  }
}

export default function SetupPage({ params }: { params: { locale: string } }) {
  const { locale, messages } = useI18n();
  const router = useRouter();

  const [mistralKey, setMistralKey] = useState('');
  const [showMistral, setShowMistral] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');

  useEffect(() => {
    const existing = loadKeys();
    if (existing) {
      setMistralKey(existing.mistralKey);
    }
    setDifficulty(loadDifficulty());
  }, []);

  const canSubmit = mistralKey.trim().length > 0;

  const onTest = async () => {
    setBusy(true);
    setStatus(null);
    try {
      await testKey('/api/mistral/test', mistralKey.trim());
      setStatus({ type: 'ok', text: messages.setup.success });
    } catch (e: any) {
      setStatus({ type: 'err', text: e?.message || messages.setup.error });
    } finally {
      setBusy(false);
    }
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    saveKeys({ mistralKey: mistralKey.trim() });
    saveDifficulty(difficulty);
    router.push(`/${locale}/session`);
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">{messages.setup.title}</h1>
      <p className="text-[color:var(--muted)] mb-8 leading-relaxed">{messages.setup.subtitle}</p>

      <form onSubmit={onSave} className="space-y-5">
        <div className="glass-card rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-[color:var(--muted)]">{messages.setup.mistralLabel}</label>
            <div className="relative">
              <input
                type={showMistral ? 'text' : 'password'}
                value={mistralKey}
                onChange={(e) => setMistralKey(e.target.value)}
                placeholder={messages.setup.mistralHint}
                className="w-full px-4 py-3 pr-12 rounded-lg bg-[color:var(--card)] border border-[color:var(--border)] focus:border-boxing-red focus:outline-none transition-all text-[color:var(--text)] placeholder:text-[color:var(--muted)]"
              />
              <button
                type="button"
                onClick={() => setShowMistral((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors"
              >
                {showMistral ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* ElevenLabs pre-configured indicator */}
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-400/30">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-sm text-emerald-200">{messages.setup.elevenLabel} — {messages.setup.elevenPreConfigured}</span>
          </div>

          {/* Difficulty selector */}
          <div>
            <label className="block text-sm font-medium mb-2 text-[color:var(--muted)]">
              {locale === 'es' ? 'Nivel de dificultad' : locale === 'fr' ? 'Niveau de difficulté' : 'Difficulty Level'}
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
                  {lvl[locale] || lvl.en}
                </button>
              ))}
            </div>
          </div>

          {status && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm font-medium flex items-start gap-2 transition-all ${
                status.type === 'ok'
                  ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
                  : 'border-red-400/40 bg-red-500/10 text-red-200'
              }`}
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
            Your Mistral key is stored in <code className="text-[color:var(--text)]">localStorage</code> on this device only.
          </p>
        </div>
      </form>
    </div>
  );
}
