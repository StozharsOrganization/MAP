import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { AdminProvider } from '../context/AdminContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdminBar from '../components/AdminBar';
import CreateNewsModal from '../components/modals/CreateNewsModal';
import ProjectModal from '../components/modals/ProjectModal';
import TeamModal from '../components/modals/TeamModal';
import DonationModal from '../components/modals/DonationModal';
import VolunteerModal from '../components/modals/VolunteerModal';
import AdminLoginModal from '../components/modals/AdminLoginModal';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://map.org.ua';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MAP — Асоціація розвитку та соціальної інтеграції молоді',
    template: '%s | MAP NGO',
  },
  description: 'Офіційна веб-платформа ГО MAP. Розвиток молодіжного лідерства, неформальна освіта, соціальна інтеграція, волонтерські ініціативи та міжнародні молодіжні проєкти в Україні.',
  keywords: [
    'MAP',
    'громадська організація',
    'молодіжний розвиток',
    'соціальна інтеграція',
    'волонтерство',
    'неформальна освіта',
    'тренінги для молоді',
    'молодіжне лідерство',
    'Erasmus+',
    'благодійність',
    'Україна',
    'молодіжні ініціативи',
  ],
  authors: [{ name: 'MAP NGO', url: siteUrl }],
  creator: 'MAP Association for Youth Development and Social Integration',
  publisher: 'MAP NGO',
  alternates: {
    canonical: '/',
    languages: {
      'uk-UA': '/',
      'en-US': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    alternateLocale: ['en_US'],
    url: siteUrl,
    title: 'MAP — Асоціація розвитку та соціальної інтеграції молоді',
    description: 'Створюємо можливості для нового покоління через неформальну освіту, лідерські тренінги та волонтерські проєкти в 14 містах України.',
    siteName: 'MAP NGO',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'MAP Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MAP — Асоціація розвитку та соціальної інтеграції молоді',
    description: 'Створюємо можливості для нового покоління через неформальну освіту, лідерські тренінги та волонтерські проєкти.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

const jsonLdOrg = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: 'MAP — Асоціація розвитку та соціальної інтеграції молоді',
  alternateName: 'MAP Association for Youth Development and Social Integration',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  image: `${siteUrl}/logo.png`,
  description: 'Громадська організація, що реалізує освітні, лідерські та інтеграційні програми для молоді по всій Україні.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Київ',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          id="theme-initializer"
          dangerouslySetInnerHTML={{
            __html: `
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
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased selection:bg-[#3b7da5] selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <AdminProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <AdminBar />
            <AdminLoginModal />
            <CreateNewsModal />
            <ProjectModal />
            <TeamModal />
            <DonationModal />
            <VolunteerModal />
          </AdminProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
