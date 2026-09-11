import { getDatabase } from '../../lib/data/store';
import WhoWeAreClient from './WhoWeAreClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Про нас — MAP NGO',
  description: 'Дізнайтеся більше про історію, місію та команду Асоціації розвитку та соціальної інтеграції молоді MAP.',
};

export default async function WhoWeArePage() {
  const db = await getDatabase();

  return (
    <WhoWeAreClient
      initialStory={db.aboutStory}
      initialTeam={db.team}
    />
  );
}
