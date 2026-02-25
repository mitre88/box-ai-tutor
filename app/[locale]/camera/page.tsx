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
        <h1 className="text-3xl font-bold mb-2">{messages.camera.title}</h1>
        <p className="text-gray-300">{messages.camera.subtitle}</p>
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

      <CameraFeed />

      <div>
        <Link
          href={`/${locale}/session`}
          className="inline-block px-4 py-2 rounded-lg bg-boxing-red hover:bg-red-600 font-semibold"
        >
          {messages.camera.startSession}
        </Link>
      </div>
    </div>
  );
}
