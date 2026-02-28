'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import type { Locale } from '../i18n/messages';
import { locales } from '../i18n/messages';
import { useI18n } from '../i18n/I18nProvider';

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export default function Nav({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const { messages } = useI18n();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const next = saved || preferred;
    setTheme(next);
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', next);
      document.documentElement.dataset.theme = next;
      document.documentElement.style.colorScheme = next;
    }
  };

  const base = `/${locale}`;
  const items = [
    { href: `${base}/setup`, label: messages.nav.setup },
    { href: `${base}/camera`, label: messages.nav.camera },
    { href: `${base}/session`, label: messages.nav.session },
    { href: `${base}/summary`, label: messages.nav.summary },
  ];

  return (
    <header className="sticky top-0 z-10 backdrop-blur border-b border-[color:var(--border)] bg-black/10">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href={`${base}`} className="flex items-center gap-2.5 group">
          {/* Boxing glove logo */}
          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-boxing-red to-red-700 flex items-center justify-center shadow-lg shadow-boxing-red/20 group-hover:shadow-boxing-red/40 transition-shadow">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-5 h-5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Glove body */}
              <path d="M18 11c0-3.87-3.13-7-7-7a7 7 0 0 0-5 2.1V4a2 2 0 0 0-2 2v6a7 7 0 0 0 7 7h0a7 7 0 0 0 7-7z" fill="rgba(255,255,255,0.2)" />
              {/* Fist line */}
              <path d="M7 11h10" />
              {/* Wrist wrap */}
              <path d="M8 15h8" strokeWidth="1.5" />
              <path d="M9 18h6" strokeWidth="1.5" />
            </svg>
            {/* Pulse dot */}
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400 border border-black/30" />
          </div>
          {/* App name */}
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-black tracking-tight">
              <span className="gradient-text">BOX</span>
              <span className="text-[color:var(--text)] ml-0.5">AI</span>
            </span>
            <span className="text-[10px] font-medium tracking-[0.15em] text-[color:var(--muted)] uppercase">
              Tutor
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          {items.map((it) => {
            const active = pathname === it.href;
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cx(
                  'text-sm px-3 py-1.5 rounded-lg border transition-all',
                  active
                    ? 'border-boxing-red bg-boxing-red/15 text-[color:var(--text)]'
                    : 'border-[color:var(--border)] hover:border-boxing-red/40 hover:bg-black/5'
                )}
              >
                {it.label}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={toggleTheme}
            className="ml-2 inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[color:var(--border)] hover:bg-black/5 transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-1 border border-[color:var(--border)] rounded-lg p-1">
            {locales.map((l) => {
              const next = pathname ? pathname.replace(/^\/(en|es|fr)/, `/${l}`) : `/${l}`;
              return (
                <Link
                  key={l}
                  href={next}
                  className={cx(
                    'text-xs px-2 py-1 rounded-md',
                    l === locale ? 'bg-black/10' : 'hover:bg-black/5'
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
