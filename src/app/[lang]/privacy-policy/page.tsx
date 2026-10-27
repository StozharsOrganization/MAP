import { pageMetadata, getLang } from '../../../lib/i18n';
import Link from '../../../components/LocaleLink';
import { ArrowLeft, Lock } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  return pageMetadata(await getLang(params), {
    path: '/privacy-policy',
    title: { ua: 'Політика конфіденційності', en: 'Privacy policy' },
    description: { ua: 'Політика обробки та захисту персональних даних громадської організації «Асоціація розвитку та соціальної інтеграції молоді «МАР».', en: 'How the NGO “MAP — Association for Youth Development and Social Integration” processes and protects personal data.' },
  });
}

const CONTENT = {
  ua: {
    back: 'Повернутися на головну',
    badge: 'Захист персональних даних',
    title: 'Політика конфіденційності',
    edition: 'Редакція чинна з 1 січня 2024 року. Відповідає Закону України «Про захист персональних даних» та Загальному регламенту захисту даних ЄС (GDPR).',
    s1: '1. Загальні положення',
    s1p: 'Ця Політика конфіденційності визначає порядок збору, зберігання, обробки та використання персональних даних, які користувачі надають громадській організації «Асоціація розвитку та соціальної інтеграції молоді «МАР» (код ЄДРПОУ 43210987) через веб-сайт під час заповнення форм зворотного зв’язку, реєстрації на освітні заходи чи подачі анкет волонтерів.',
    s2: '2. Які дані ми збираємо',
    s2p: 'Ми збираємо виключно ту інформацію, яку ви добровільно вказуєте під час взаємодії з платформою:',
    s2l: [
      'Ім’я та прізвище;',
      'Адреса електронної пошти (email);',
      'Номер телефону або нікнейм у Telegram;',
      'Місто проживання та сфера інтересів (для волонтерів та учасників тренінгів);',
      'Текстове повідомлення або супровідний коментар.',
    ],
    s3: '3. Мета збору даних',
    s3p: 'Зібрані персональні дані використовуються виключно для:',
    s3l: [
      'Обробки та координації заявок волонтерів на проєкти організації;',
      'Надання зворотного зв’язку щодо консультацій та звернень;',
      'Інформування про нові навчальні програми, гранти та молодіжні обміни Erasmus+;',
      'Організації логістики (проїзд, проживання) учасників офлайн-заходів.',
    ],
    s4: '4. Захист та нерозголошення даних',
    s4p: 'ГО «МАР» вживає всіх необхідних технічних та організаційних заходів для захисту інформації від несанкціонованого доступу, зміни, розкриття чи знищення. Ми ніколи не передаємо та не продаємо ваші персональні дані третім особам чи комерційним компаніям.',
    s5: '5. Ваші права',
    s5p: 'Ви маєте право у будь-який момент вимагати оновлення, виправлення або повного видалення ваших персональних даних із нашої бази, надіславши запит на адресу:',
  },
  en: {
    back: 'Back to home',
    badge: 'Personal data protection',
    title: 'Privacy Policy',
    edition: 'Effective from 1 January 2024. Compliant with the Law of Ukraine “On Personal Data Protection” and the EU General Data Protection Regulation (GDPR).',
    s1: '1. General provisions',
    s1p: 'This Privacy Policy sets out how personal data is collected, stored, processed and used when users provide it to the non-governmental organisation “MAP — Association for Youth Development and Social Integration” (EDRPOU code 43210987) through this website, for example when submitting contact forms, registering for educational events or applying as a volunteer.',
    s2: '2. What data we collect',
    s2p: 'We collect only the information you voluntarily provide when using the platform:',
    s2l: [
      'First and last name;',
      'Email address;',
      'Phone number or Telegram username;',
      'City of residence and areas of interest (for volunteers and training participants);',
      'Your message or accompanying comment.',
    ],
    s3: '3. Purpose of data collection',
    s3p: 'Personal data we collect is used solely to:',
    s3l: [
      'Process and coordinate volunteer applications for the organisation’s projects;',
      'Respond to your enquiries and requests;',
      'Inform you about new educational programmes, grants and Erasmus+ youth exchanges;',
      'Arrange logistics (travel, accommodation) for participants of in-person events.',
    ],
    s4: '4. Data protection and confidentiality',
    s4p: 'NGO “MAP” takes all necessary technical and organisational measures to protect information against unauthorised access, alteration, disclosure or destruction. We never share or sell your personal data to third parties or commercial companies.',
    s5: '5. Your rights',
    s5p: 'You may at any time request that your personal data be updated, corrected or completely deleted from our records by sending a request to:',
  },
} as const;

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ lang: string }> }) {
  const c = CONTENT[await getLang(params)];
  return (
    <div className="py-12 sm:py-16 bg-[#081626] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{c.back}</span>
        </Link>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30">
            <Lock className="w-3.5 h-3.5" />
            <span>{c.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">{c.title}</h1>
          <p className="text-sm text-slate-400">{c.edition}</p>
        </div>

        <div className="bg-[#0e2238] rounded-3xl border border-white/10 p-6 sm:p-10 space-y-8 text-sm text-slate-300 leading-relaxed shadow-xl">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">{c.s1}</h2>
            <p>{c.s1p}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">{c.s2}</h2>
            <p>{c.s2p}</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              {c.s2l.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">{c.s3}</h2>
            <p>{c.s3p}</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              {c.s3l.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">{c.s4}</h2>
            <p>{c.s4p}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">{c.s5}</h2>
            <p>
              {c.s5p}{' '}
              <a href="mailto:info@map-association.org" className="text-sky-400 underline">info@map-association.org</a>.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
