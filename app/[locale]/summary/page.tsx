'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';

export default function SummaryPage() {
  const { locale, messages } = useI18n();
  const [seconds, setSeconds] = useState<number | null>(null);
  const [summary, setSummary] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const s = sessionStorage.getItem('lastSessionSeconds');
    const txt = sessionStorage.getItem('lastSessionSummary');
    setSeconds(s ? Number(s) : null);
    setSummary(txt || '');
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{messages.summary.title}</h1>
        <p className="text-gray-300">{messages.summary.subtitle}</p>
      </div>

      <div className="glass-card rounded-xl p-5 space-y-3">
        <div className="text-sm text-gray-400">Duration</div>
        <div className="text-xl font-semibold">
          {seconds === null ? '—' : `${Math.floor(seconds / 60)}m ${seconds % 60}s`}
        </div>

        <div className="text-sm text-gray-400">Notes</div>
        <pre className="whitespace-pre-wrap text-sm text-gray-200 bg-black/20 p-3 rounded-lg border border-white/10">
          {summary || '—'}
        </pre>
      </div>

      <Link
        href={`/${locale}/setup`}
        className="inline-block px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5"
      >
        {messages.summary.backToSetup}
      </Link>
    </div>
  );
}
