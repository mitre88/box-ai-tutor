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
        <h1 className="text-3xl font-bold mb-2">{messages.session.title}</h1>
        <p className="text-gray-300">{messages.session.subtitle}</p>
      </div>

      {hasKeys === false && (
        <div className="glass-card rounded-xl p-5">
          <p className="text-red-200 mb-3">{messages.common.missingKeys}</p>
          <Link
            href={`/${locale}/setup`}
            className="inline-block px-4 py-2 rounded-lg bg-boxing-red hover:bg-red-600 font-semibold"
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
              className="px-4 py-2 rounded-lg bg-boxing-red hover:bg-red-600 font-semibold"
            >
              {messages.session.start}
            </button>
          ) : (
            <button
              onClick={stop}
              className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5"
            >
              {messages.session.stop}
            </button>
          )}

          <button
            onClick={endAndSummary}
            className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5"
          >
            {messages.session.endAndSummary}
          </button>
        </div>
      </div>

      <CameraFeed isAnalyzing={running} />
    </div>
  );
}
