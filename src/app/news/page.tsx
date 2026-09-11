import { getDatabase } from '../../lib/data/store';
import NewsClient from './NewsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Новини та анонси — MAP NGO',
  description: 'Останні події, тренінги та волонтерські проєкти Асоціації MAP.',
};

export default async function NewsPage() {
  const db = await getDatabase();

  return <NewsClient initialNews={db.news} />;
}
