import { notFound } from 'next/navigation';
import { getDatabase } from '../../../lib/data/store';
import SingleNewsClient from './SingleNewsClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const db = await getDatabase();
  const newsItem = db.news.find(n => n.slug === slug || n.id === slug);
  if (!newsItem) return { title: 'Новина не знайдена — MAP' };

  return {
    title: `${newsItem.title} — MAP NGO`,
    description: newsItem.excerpt,
    openGraph: {
      title: newsItem.title,
      description: newsItem.excerpt,
      images: [newsItem.coverImage],
    }
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const db = await getDatabase();
  const newsItem = db.news.find(n => n.slug === slug || n.id === slug);

  if (!newsItem) {
    notFound();
  }

  // Get related news excluding current
  const relatedNews = db.news
    .filter(n => n.id !== newsItem.id && n.status === 'published')
    .slice(0, 2);

  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: newsItem.title,
    description: newsItem.excerpt,
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
      '@id': `https://map.org.ua/news/${newsItem.slug || newsItem.id}`,
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
