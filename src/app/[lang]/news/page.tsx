import { pageMetadata, getLang } from '../../../lib/i18n';
import { getDatabase } from '../../../lib/data/store';
import NewsClient from './NewsClient';
import { verifyAdminSession } from '../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  return pageMetadata(await getLang(params), {
    path: '/news',
    title: { ua: 'Новини та анонси', en: 'News and announcements' },
    description: { ua: 'Останні події, тренінги та волонтерські проєкти Асоціації MAP.', en: 'Latest events, trainings and volunteer projects of the Ukrainian youth NGO MAP.' },
  });
}

export default async function NewsPage() {
  const db = await getDatabase();
  const isAdmin = await verifyAdminSession();
  // Never send draft content to anonymous visitors
  const news = isAdmin ? db.news : db.news.filter(n => n.status === 'published');

  return <NewsClient initialNews={news} />;
}
