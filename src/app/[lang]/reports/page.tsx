import { pageMetadata, getLang } from '../../../lib/i18n';
import ReportsClient from './ReportsClient';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  return pageMetadata(await getLang(params), {
    path: '/reports',
    title: { ua: 'Прозорість та звітність', en: 'Transparency and reports' },
    description: { ua: 'Публічні річні та фінансові звіти, статутні документи та структура використання коштів Асоціації розвитку та соціальної інтеграції молоді MAP.', en: 'Annual narrative and financial reports, statutory documents and how MAP, a Ukrainian youth NGO, spends donations.' },
  });
}

export default function ReportsPage() {
  return <ReportsClient />;
}
