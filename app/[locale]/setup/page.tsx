'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';
import { saveKeys } from '../../lib/storage';

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
  const [elevenLabsKey, setElevenLabsKey] = useState('');
  const [showMistral, setShowMistral] = useState(false);
  const [showElevenLabs, setShowElevenLabs] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const canSubmit = mistralKey.trim().length > 0 && elevenLabsKey.trim().length > 0;

  const onTest = async () => {
    setBusy(true);
    setStatus(null);
    try {
      await Promise.all([
        testKey('/api/mistral/test', mistralKey.trim()),
        testKey('/api/elevenlabs/test', elevenLabsKey.trim()),
      ]);
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
    saveKeys({ mistralKey: mistralKey.trim(), elevenLabsKey: elevenLabsKey.trim() });
    router.push(`/${locale}/camera`);
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-2">{messages.setup.title}</h1>
      <p className="text-gray-300 mb-8">{messages.setup.subtitle}</p>

      <form onSubmit={onSave} className="space-y-5">
        <div className="glass-card rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">{messages.setup.mistralLabel}</label>
            <div className="relative">
              <input
                type={showMistral ? 'text' : 'password'}
                value={mistralKey}
                onChange={(e) => setMistralKey(e.target.value)}
                placeholder={messages.setup.mistralHint}
                className="w-full px-4 py-3 pr-12 rounded-lg bg-dark-card border border-white/10 focus:border-boxing-red focus:outline-none transition-colors text-white placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowMistral((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showMistral ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">{messages.setup.elevenLabel}</label>
            <div className="relative">
              <input
                type={showElevenLabs ? 'text' : 'password'}
                value={elevenLabsKey}
                onChange={(e) => setElevenLabsKey(e.target.value)}
                placeholder={messages.setup.elevenHint}
                className="w-full px-4 py-3 pr-12 rounded-lg bg-dark-card border border-white/10 focus:border-boxing-red focus:outline-none transition-colors text-white placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowElevenLabs((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showElevenLabs ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {status && (
            <div
              className={
                status.type === 'ok'
                  ? 'text-sm text-green-300'
                  : 'text-sm text-red-300'
              }
            >
              {status.text}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onTest}
              disabled={busy || !canSubmit}
              className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? messages.setup.testing : messages.setup.testKeys}
            </button>

            <button
              type="submit"
              disabled={busy || !canSubmit}
              className="px-4 py-2 rounded-lg bg-boxing-red hover:bg-red-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {messages.setup.saveAndContinue}
            </button>
          </div>

          <p className="text-xs text-gray-500">
            Keys are stored in <code className="text-gray-300">sessionStorage</code> only. This app does not persist keys server-side.
          </p>
        </div>
      </form>
    </div>
  );
}
