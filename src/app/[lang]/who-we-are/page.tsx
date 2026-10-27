import { pageMetadata, getLang } from '../../../lib/i18n';
import { getDatabase } from '../../../lib/data/store';
import WhoWeAreClient from './WhoWeAreClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  return pageMetadata(await getLang(params), {
    path: '/who-we-are',
    title: { ua: 'Про нас', en: 'About us' },
    description: { ua: 'Дізнайтеся більше про історію, місію та команду Асоціації розвитку та соціальної інтеграції молоді MAP.', en: 'The story, mission and team of MAP — the Association for Youth Development and Social Integration, a Ukrainian NGO.' },
  });
}

export default async function WhoWeArePage() {
  const db = await getDatabase();

  return (
    <WhoWeAreClient
      initialStory={db.aboutStory}
      initialTeam={db.team}
    />
  );
}
