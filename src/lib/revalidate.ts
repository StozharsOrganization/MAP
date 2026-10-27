import { revalidatePath } from 'next/cache';
import { LOCALES } from './i18n';

/** Revalidate a public path in every language (routes live under /[lang]). */
export function revalidateLocalized(path: string) {
  for (const lang of LOCALES) {
    revalidatePath(path === '/' ? `/${lang}` : `/${lang}${path}`);
  }
}
