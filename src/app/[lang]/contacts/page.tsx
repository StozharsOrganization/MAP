import { pageMetadata, getLang } from '../../../lib/i18n';
import { getDatabase } from '../../../lib/data/store';
import ContactsClient from './ContactsClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  return pageMetadata(await getLang(params), {
    path: '/contacts',
    title: { ua: 'Контакти', en: 'Contacts' },
    description: { ua: 'Офіційні контакти, локація офісу та форма зворотного зв’язку Асоціації розвитку та соціальної інтеграції молоді MAP.', en: 'Contact MAP — the Association for Youth Development and Social Integration in Kyiv, Ukraine: office address, phone, email and contact form.' },
  });
}

export default async function ContactsPage() {
  const db = await getDatabase();

  return <ContactsClient initialContacts={db.contacts} />;
}
