import { notFound } from 'next/navigation';
import type { Locale } from '../i18n/messages';
import { I18nProvider } from '../i18n/I18nProvider';
import { isLocale } from '../i18n/messages';
import Nav from '../components/Nav';

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  return (
    <I18nProvider locale={locale}>
      <div className="min-h-screen">
        <Nav locale={locale} />
        <div className="max-w-5xl mx-auto px-6 py-10">{children}</div>
      </div>
    </I18nProvider>
  );
}
