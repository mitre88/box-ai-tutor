'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { loadKeys } from '../../lib/storage';
import VoiceCoach from '../../components/VoiceCoach';

export default function SessionPage() {
  const { locale, messages } = useI18n();

  const [keys, setKeys] = useState<{ mistralKey: string; elevenLabsKey: string } | null>(null);
  const [hasKeys, setHasKeys] = useState<boolean | null>(null);

  useEffect(() => {
    const existing = loadKeys();
    setKeys(existing);
    setHasKeys(!!existing);
  }, []);

  if (hasKeys && keys) {
    return <VoiceCoach mistralKey={keys.mistralKey} elevenLabsKey={keys.elevenLabsKey} />;
  }

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
    </div>
  );
}
