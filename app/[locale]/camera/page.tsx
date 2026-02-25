'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import CameraFeed from '../../components/CameraFeed';
import { loadKeys } from '../../lib/storage';

export default function CameraPage() {
  const { locale, messages } = useI18n();
  const [hasKeys, setHasKeys] = useState<boolean | null>(null);

  useEffect(() => {
    setHasKeys(!!loadKeys());
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">{messages.camera.title}</h1>
        <p className="text-[color:var(--muted)]">{messages.camera.subtitle}</p>
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

      <CameraFeed />

      <div>
        <Link
          href={`/${locale}/session`}
          className="inline-block px-4 py-2 rounded-lg bg-boxing-red hover:bg-red-600 font-semibold transition-all"
        >
          {messages.camera.startSession}
        </Link>
      </div>
    </div>
  );
}
