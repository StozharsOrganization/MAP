import { notFound } from 'next/navigation';
import { pageMetadata, getLang, localizePath, SITE_URL } from '../../../../lib/i18n';
import { getTranslatedNews } from '../../../../lib/translations';
import { getDatabase } from '../../../../lib/data/store';
import SingleNewsClient from './SingleNewsClient';
import { verifyAdminSession } from '../../../../lib/auth';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string; lang: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const lang = await getLang(params);
  const db = await getDatabase();
  const raw = db.news.find(n => n.slug === slug || n.id === slug);
  if (!raw || raw.status === 'draft') {
    return { title: lang === 'en' ? 'News not found' : 'Новина не знайдена' };
  }
  const ua = raw;
  const en = getTranslatedNews(raw, 'en');

  return pageMetadata(lang, {
    path: `/news/${raw.slug || raw.id}`,
    title: { ua: ua.title, en: en.title },
    description: { ua: ua.excerpt, en: en.excerpt },
    image: raw.coverImage,
  });
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const lang = await getLang(params);
  const db = await getDatabase();
  const newsItem = db.news.find(n => n.slug === slug || n.id === slug);

  if (!newsItem) {
    notFound();
  }

  if (newsItem.status === 'draft' && !(await verifyAdminSession())) {
    notFound();
  }

  // Get related news excluding current
  const relatedNews = db.news
    .filter(n => n.id !== newsItem.id && n.status === 'published')
    .slice(0, 2);

  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: getTranslatedNews(newsItem, lang).title,
    description: getTranslatedNews(newsItem, lang).excerpt,
    inLanguage: lang === 'en' ? 'en' : 'uk',
    image: [newsItem.coverImage],
    datePublished: newsItem.date,
    dateModified: newsItem.date,
    author: {
      '@type': 'Organization',
      name: 'MAP NGO',
      url: 'https://map.org.ua',
    },
    publisher: {
      '@type': 'Organization',
      name: 'MAP NGO',
      logo: {
        '@type': 'ImageObject',
        url: 'https://map.org.ua/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}${localizePath(`/news/${newsItem.slug || newsItem.id}`, lang)}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <SingleNewsClient
        newsItem={newsItem}
        relatedNews={relatedNews}
      />
    </>
  );
}
