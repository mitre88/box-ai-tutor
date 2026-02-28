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

      {/* Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: '📏', text: locale === 'es' ? 'Distancia: 1.5–2m de la cámara' : locale === 'fr' ? 'Distance : 1,5–2m de la caméra' : 'Stand 1.5–2m from the camera' },
          { icon: '💡', text: locale === 'es' ? 'Buena iluminación frontal' : locale === 'fr' ? 'Bon éclairage frontal' : 'Good front-facing lighting' },
          { icon: '🥊', text: locale === 'es' ? 'Cuerpo superior visible' : locale === 'fr' ? 'Haut du corps visible' : 'Full upper body in frame' },
        ].map((tip) => (
          <div key={tip.icon} className="glass-card rounded-lg px-4 py-3 flex items-center gap-3 text-sm text-[color:var(--muted)]">
            <span className="text-lg">{tip.icon}</span>
            {tip.text}
          </div>
        ))}
      </div>

      <div>
        <Link
          href={`/${locale}/session`}
          className="inline-block px-5 py-2.5 rounded-lg bg-boxing-red hover:bg-red-600 font-semibold text-white transition-all"
        >
          {messages.camera.startSession}
        </Link>
      </div>
    </div>
  );
}
