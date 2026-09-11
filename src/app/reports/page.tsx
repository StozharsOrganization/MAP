import type { Metadata } from 'next';
import ReportsClient from './ReportsClient';

export const metadata: Metadata = {
  title: 'Прозорість та звітність — MAP NGO',
  description: 'Публічні річні та фінансові звіти, статутні документи та структура використання коштів Асоціації розвитку та соціальної інтеграції молоді MAP.',
};

export default function ReportsPage() {
  return <ReportsClient />;
}
