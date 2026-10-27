import { pageMetadata, getLang } from '../../../lib/i18n';
import { getDatabase } from '../../../lib/data/store';
import ProjectsClient from './ProjectsClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  return pageMetadata(await getLang(params), {
    path: '/projects',
    title: { ua: 'Проєкти та програми', en: 'Projects and programmes' },
    description: { ua: 'Дізнайтеся більше про освітні та соціальні ініціативи Асоціації MAP.', en: 'Educational and social programmes for young people in Ukraine run by MAP — leadership academy, IDP integration hub, digital skills and Erasmus+ exchanges.' },
  });
}

export default async function ProjectsPage() {
  const db = await getDatabase();

  return <ProjectsClient initialProjects={db.projects} />;
}
