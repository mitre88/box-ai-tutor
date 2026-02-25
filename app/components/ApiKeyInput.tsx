'use client';

import { useEffect, useState } from 'react';
import { Key, Mic, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { loadKeys } from '../lib/storage';

interface ApiKeys {
  mistralKey: string;
  elevenLabsKey: string;
}

interface ApiKeyInputProps {
  onSubmit: (keys: ApiKeys) => void;
}

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
  return true;
}

export default function ApiKeyInput({ onSubmit }: ApiKeyInputProps) {
  const [mistralKey, setMistralKey] = useState('');
  const [elevenLabsKey, setElevenLabsKey] = useState('');
  const [showMistral, setShowMistral] = useState(false);
  const [showElevenLabs, setShowElevenLabs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    const existing = loadKeys();
    if (existing) {
      setMistralKey(existing.mistralKey);
      setElevenLabsKey(existing.elevenLabsKey);
    }
  }, []);

  const handleTest = async () => {
    setIsLoading(true);
    setStatus(null);
    try {
      // Format validation first
      const isMistralValid = mistralKey.startsWith('sk-') && mistralKey.length > 20;
      const isElevenLabsValid = elevenLabsKey.length > 20;
      if (!isMistralValid) throw new Error('Invalid Mistral key format');
      if (!isElevenLabsValid) throw new Error('Invalid ElevenLabs key format');

      await Promise.all([
        testKey('/api/mistral/test', mistralKey.trim()),
        testKey('/api/elevenlabs/test', elevenLabsKey.trim()),
      ]);

      setStatus({ type: 'ok', text: 'Keys look valid.' });
    } catch (e: any) {
      setStatus({ type: 'err', text: e?.message || 'Could not validate the keys.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mistralKey.trim() || !elevenLabsKey.trim()) return;
    onSubmit({ mistralKey: mistralKey.trim(), elevenLabsKey: elevenLabsKey.trim() });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-boxing-red/20 flex items-center justify-center">
            <Key className="w-8 h-8 text-boxing-red" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">Fight Corner Coach</h1>
          <p className="text-[color:var(--muted)] text-sm">
            AI-powered voice boxing coach. Enter your API keys to start.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Mistral API Key */}
          <div>
            <label className="block text-sm font-medium mb-2 text-[color:var(--muted)] flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              Mistral API Key
            </label>
            <div className="relative">
              <input
                type={showMistral ? 'text' : 'password'}
                value={mistralKey}
                onChange={(e) => setMistralKey(e.target.value)}
                placeholder="sk-xxxxxxxxxxxx"
                className="w-full px-4 py-3 pr-12 rounded-lg bg-[color:var(--card)] border border-[color:var(--border)]
                           focus:border-boxing-red focus:outline-none transition-all
                           text-[color:var(--text)] placeholder:text-[color:var(--muted)]"
              />
              <button
                type="button"
                onClick={() => setShowMistral(!showMistral)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors"
              >
                {showMistral ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-[color:var(--muted)]">
              For AI posture and style analysis
            </p>
          </div>

          {/* ElevenLabs API Key */}
          <div>
            <label className="block text-sm font-medium mb-2 text-[color:var(--muted)] flex items-center gap-2">
              <Mic className="w-4 h-4" />
              ElevenLabs API Key
            </label>
            <div className="relative">
              <input
                type={showElevenLabs ? 'text' : 'password'}
                value={elevenLabsKey}
                onChange={(e) => setElevenLabsKey(e.target.value)}
                placeholder="xxxxxxxxxxxx"
                className="w-full px-4 py-3 pr-12 rounded-lg bg-[color:var(--card)] border border-[color:var(--border)]
                           focus:border-boxing-red focus:outline-none transition-all
                           text-[color:var(--text)] placeholder:text-[color:var(--muted)]"
              />
              <button
                type="button"
                onClick={() => setShowElevenLabs(!showElevenLabs)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors"
              >
                {showElevenLabs ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-[color:var(--muted)]">
              For real-time voice coaching feedback
            </p>
          </div>

          <div className="grid gap-3">
            <button
              type="button"
              onClick={handleTest}
              disabled={isLoading || !mistralKey.trim() || !elevenLabsKey.trim()}
              className="w-full py-3 px-4 rounded-lg border border-[color:var(--border)] hover:bg-black/5
                         font-medium flex items-center justify-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Testing...' : 'Test keys'}
              <ShieldCheck className="w-4 h-4" />
            </button>

            <button
              type="submit"
              disabled={isLoading || !mistralKey.trim() || !elevenLabsKey.trim()}
              className="w-full py-3 px-4 bg-boxing-red hover:bg-red-600 rounded-lg
                         font-semibold flex items-center justify-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all"
            >
              Start Training Session
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {status && (
            <div
              className={`rounded-lg border px-4 py-3 text-xs font-medium transition-all ${
                status.type === 'ok'
                  ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
                  : 'border-red-400/40 bg-red-500/10 text-red-200'
              }`}
            >
              {status.text}
            </div>
          )}
        </form>

        <div className="mt-6 space-y-2">
          <p className="text-xs text-[color:var(--muted)] text-center">
            Your API keys are stored in localStorage on this device
          </p>
          <p className="text-xs text-[color:var(--muted)] text-center">
            Never shared with our servers • Used directly from your browser
          </p>
        </div>

        {/* Feature highlights */}
        <div className="mt-6 pt-6 border-t border-[color:var(--border)]">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl mb-1">🥊</div>
              <div className="text-xs text-[color:var(--muted)]">Real-time posture correction</div>
            </div>
            <div>
              <div className="text-2xl mb-1">🎙️</div>
              <div className="text-xs text-[color:var(--muted)]">Professional voice coach</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
