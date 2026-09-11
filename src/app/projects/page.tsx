import { getDatabase } from '../../lib/data/store';
import ProjectsClient from './ProjectsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Проєкти та програми — MAP NGO',
  description: 'Дізнайтеся більше про освітні та соціальні ініціативи Асоціації MAP.',
};

export default async function ProjectsPage() {
  const db = await getDatabase();

  return <ProjectsClient initialProjects={db.projects} />;
}
