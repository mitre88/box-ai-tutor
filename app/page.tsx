import { redirect } from 'next/navigation';
import { defaultLocale } from './i18n/messages';

export default function Root() {
  redirect(`/${defaultLocale}`);
}
