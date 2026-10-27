import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCALES, SITE_URL, OG_LOCALE, HTML_LANG, alternatesFor, localizePath, getLang, isLocale } from '../../lib/i18n';
import '../globals.css';
import { ThemeProvider } from '../../context/ThemeContext';
import { AdminProvider } from '../../context/AdminContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdminBar from '../../components/AdminBar';

import { InlineScript } from '../../components/InlineScript';
import ModalsContainer from '../../components/modals/ModalsContainer';

const siteUrl = SITE_URL;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

const SITE_META = {
  ua: {
    title: 'MAP — Асоціація розвитку та соціальної інтеграції молоді',
    description: 'Офіційна веб-платформа ГО MAP. Розвиток молодіжного лідерства, неформальна освіта, соціальна інтеграція, волонтерські ініціативи та міжнародні молодіжні проєкти в Україні.',
    ogDescription: 'Створюємо можливості для нового покоління через неформальну освіту, лідерські тренінги та волонтерські проєкти в 14 містах України.',
    keywords: ['MAP', 'громадська організація', 'молодіжний розвиток', 'соціальна інтеграція', 'волонтерство', 'неформальна освіта', 'тренінги для молоді', 'молодіжне лідерство', 'Erasmus+', 'благодійність', 'Україна', 'молодіжні ініціативи'],
  },
  en: {
    title: 'MAP — Association for Youth Development and Social Integration',
    description: 'Official website of the Ukrainian NGO MAP: youth leadership, non-formal education, social integration of young people, volunteering and international youth projects (Erasmus+) across Ukraine.',
    ogDescription: 'Creating opportunities for a new generation of Ukrainians through non-formal education, leadership trainings and volunteer projects in 14 cities.',
    keywords: ['MAP', 'Ukrainian NGO', 'youth development', 'social integration', 'volunteering in Ukraine', 'non-formal education', 'youth leadership', 'Erasmus+', 'support Ukraine', 'donate to Ukraine', 'Ukrainian youth', 'IDP youth'],
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = await getLang(params);
  const m = SITE_META[lang];
  return {
    metadataBase: new URL(siteUrl),
    title: { default: m.title, template: '%s | MAP NGO' },
    description: m.description,
    keywords: [...m.keywords],
    authors: [{ name: 'MAP NGO', url: siteUrl }],
    creator: 'MAP Association for Youth Development and Social Integration',
    publisher: 'MAP NGO',
    alternates: alternatesFor('/', lang),
    openGraph: {
      type: 'website',
      locale: OG_LOCALE[lang],
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      url: localizePath('/', lang),
      title: m.title,
      description: m.ogDescription,
      siteName: 'MAP NGO',
      images: [{ url: '/logo.png', width: 800, height: 600, alt: 'MAP Logo' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.ogDescription,
      images: ['/logo.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    icons: { icon: '/logo.png', apple: '/logo.png' },
  };
}

const buildJsonLd = (lang: 'ua' | 'en') => ({
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: SITE_META[lang].title,
  alternateName: lang === 'en' ? SITE_META.ua.title : SITE_META.en.title,
  inLanguage: HTML_LANG[lang],
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  image: `${siteUrl}/logo.png`,
  description: lang === 'en'
    ? 'A Ukrainian NGO running educational, leadership and integration programmes for young people across Ukraine.'
    : 'Громадська організація, що реалізує освітні, лідерські та інтеграційні програми для молоді по всій Україні.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: lang === 'en' ? 'Kyiv' : 'Київ',
    addressCountry: 'UA',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+380441234567',
    contactType: 'customer service',
    availableLanguage: ['Ukrainian', 'English'],
  },
  sameAs: [
    'https://instagram.com',
    'https://t.me',
    'https://facebook.com',
    'https://linkedin.com',
  ],
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const jsonLdOrg = buildJsonLd(lang);

  return (
    <html lang={HTML_LANG[lang]} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <InlineScript
          id="theme-initializer"
          html={`
              (function() {
                try {
                  var saved = localStorage.getItem('map_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = saved === 'light' ? 'light' : (saved === 'dark' ? 'dark' : (prefersDark ? 'dark' : 'light'));
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(theme);
                  document.documentElement.style.colorScheme = theme;
                } catch (e) {}
              })();
            `}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased selection:bg-[#3b7da5] selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <AdminProvider initialLanguage={lang}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <AdminBar />
            <ModalsContainer />
          </AdminProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
