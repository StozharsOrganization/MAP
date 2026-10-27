import type { Metadata } from 'next';

export const LOCALES = ['ua', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ua';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://map.org.ua';

export const HTML_LANG: Record<Locale, string> = { ua: 'uk', en: 'en' };
export const OG_LOCALE: Record<Locale, string> = { ua: 'uk_UA', en: 'en_US' };

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Remove a leading /en (or /ua) prefix: "/en/news" -> "/news" */
export function stripLocale(pathname: string): string {
  const m = pathname.match(/^\/(ua|en)(?=\/|$)/);
  const rest = m ? pathname.slice(m[0].length) : pathname;
  return rest || '/';
}

/** Build a public URL path for a locale. Ukrainian lives at the root, English under /en. */
export function localizePath(path: string, lang: Locale): string {
  const clean = stripLocale(path.startsWith('/') ? path : `/${path}`);
  if (lang === DEFAULT_LOCALE) return clean;
  return clean === '/' ? `/${lang}` : `/${lang}${clean}`;
}

/** hreflang alternates + canonical for a page path (without locale prefix). */
export function alternatesFor(path: string, lang: Locale): Metadata['alternates'] {
  return {
    canonical: localizePath(path, lang),
    languages: {
      'uk-UA': localizePath(path, 'ua'),
      en: localizePath(path, 'en'),
      'x-default': localizePath(path, 'ua'),
    },
  };
}

interface PageMetaInput {
  path: string;
  title: { ua: string; en: string };
  description: { ua: string; en: string };
  image?: string;
}

/** Full per-page metadata in the requested language. */
export function pageMetadata(lang: Locale, { path, title, description, image }: PageMetaInput): Metadata {
  const t = title[lang];
  const d = description[lang];
  return {
    title: t,
    description: d,
    alternates: alternatesFor(path, lang),
    openGraph: {
      title: t,
      description: d,
      url: localizePath(path, lang),
      locale: OG_LOCALE[lang],
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      ...(image ? { images: [image] } : {}),
    },
    twitter: { title: t, description: d, ...(image ? { images: [image] } : {}) },
  };
}

export async function getLang(params: Promise<{ lang: string }>): Promise<Locale> {
  const { lang } = await params;
  return isLocale(lang) ? lang : DEFAULT_LOCALE;
}
