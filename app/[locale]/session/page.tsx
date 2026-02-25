'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '../../i18n/I18nProvider';
import { loadKeys } from '../../lib/storage';
import SessionTimer from '../../components/SessionTimer';
import CameraFeed from '../../components/CameraFeed';

export default function SessionPage() {
  const { locale, messages } = useI18n();
  const router = useRouter();

  const [hasKeys, setHasKeys] = useState<boolean | null>(null);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    setHasKeys(!!loadKeys());
  }, []);

  useEffect(() => {
    if (!running) {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = null;
      return;
    }

    tickRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);

    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = null;
    };
  }, [running]);

  const stop = () => setRunning(false);

  const endAndSummary = () => {
    stop();
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('lastSessionSeconds', String(seconds));
      sessionStorage.setItem('lastSessionSummary', 'TODO: generate summary via Mistral.');
    }
    router.push(`/${locale}/summary`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">{messages.session.title}</h1>
        <p className="text-[color:var(--muted)]">{messages.session.subtitle}</p>
      </div>

      {hasKeys === false && (
        <div className="rounded-xl border border-red-400/40 bg-red-500/10 p-5 space-y-3 transition-all">
          <p className="text-red-200 text-sm font-medium">{messages.common.missingKeys}</p>
          <Link
            href={`/${locale}/setup`}
            className="inline-block px-4 py-2 rounded-lg bg-boxing-red hover:bg-red-600 font-semibold transition-all"
          >
            {messages.nav.setup}
          </Link>
        </div>
      )}

      <div className="glass-card rounded-xl p-5 space-y-4">
        <SessionTimer seconds={seconds} />
        <div className="flex flex-wrap gap-3 justify-center">
          {!running ? (
            <button
              onClick={() => setRunning(true)}
              className="px-4 py-2 rounded-lg bg-boxing-red hover:bg-red-600 font-semibold transition-all"
            >
              {messages.session.start}
            </button>
          ) : (
            <button
              onClick={stop}
              className="px-4 py-2 rounded-lg border border-[color:var(--border)] hover:bg-black/5 transition-all"
            >
              {messages.session.stop}
            </button>
          )}

          <button
            onClick={endAndSummary}
            className="px-4 py-2 rounded-lg border border-[color:var(--border)] hover:bg-black/5 transition-all"
          >
            {messages.session.endAndSummary}
          </button>
        </div>
      </div>

      <CameraFeed isAnalyzing={running} />
    </div>
  );
}
