'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '../i18n/messages';
import { locales } from '../i18n/messages';
import { useI18n } from '../i18n/I18nProvider';

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export default function Nav({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const { messages } = useI18n();

  const base = `/${locale}`;
  const items = [
    { href: `${base}/setup`, label: messages.nav.setup },
    { href: `${base}/camera`, label: messages.nav.camera },
    { href: `${base}/session`, label: messages.nav.session },
    { href: `${base}/summary`, label: messages.nav.summary },
  ];

  return (
    <header className="sticky top-0 z-10 backdrop-blur border-b border-white/10 bg-black/20">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href={`${base}`} className="font-semibold tracking-wide">
          {messages.appName}
        </Link>

        <nav className="flex items-center gap-2">
          {items.map((it) => {
            const active = pathname === it.href;
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cx(
                  'text-sm px-3 py-1.5 rounded-lg border transition-colors',
                  active
                    ? 'border-boxing-red bg-boxing-red/15'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                )}
              >
                {it.label}
              </Link>
            );
          })}

          <div className="ml-2 flex items-center gap-1 border border-white/10 rounded-lg p-1">
            {locales.map((l) => {
              const next = pathname ? pathname.replace(/^\/(en|es|fr)/, `/${l}`) : `/${l}`;
              return (
                <Link
                  key={l}
                  href={next}
                  className={cx(
                    'text-xs px-2 py-1 rounded-md',
                    l === locale ? 'bg-white/10' : 'hover:bg-white/5'
                  )}
                  aria-label={`Switch language to ${l}`}
                >
                  {l.toUpperCase()}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
