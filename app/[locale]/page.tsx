import Link from 'next/link';
import type { Locale } from '../i18n/messages';
import { isLocale } from '../i18n/messages';
import { messages } from '../i18n/messages';

export default function Home({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return null;
  const locale = params.locale as Locale;
  const m = messages[locale];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{m.appName}</h1>
      <p className="text-gray-300">
        Vercel-ready Next.js skeleton: key setup, camera preview, session start/stop, summary stub.
      </p>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/${locale}/setup`}
          className="px-4 py-2 rounded-lg bg-boxing-red hover:bg-red-600 font-semibold"
        >
          {m.nav.setup}
        </Link>
        <Link
          href={`/${locale}/camera`}
          className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5"
        >
          {m.nav.camera}
        </Link>
        <Link
          href={`/${locale}/session`}
          className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5"
        >
          {m.nav.session}
        </Link>
        <Link
          href={`/${locale}/summary`}
          className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5"
        >
          {m.nav.summary}
        </Link>
      </div>
    </div>
  );
}
