import { getDatabase } from '../../lib/data/store';
import ContactsClient from './ContactsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Контакти — MAP NGO',
  description: 'Офіційні контакти, локація офісу та форма зворотного зв’язку Асоціації розвитку та соціальної інтеграції молоді MAP.',
};

export default async function ContactsPage() {
  const db = await getDatabase();

  return <ContactsClient initialContacts={db.contacts} />;
}
