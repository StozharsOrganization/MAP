import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Політика конфіденційності — MAP NGO',
  description: 'Політика обробки та захисту персональних даних громадської організації «Асоціація розвитку та соціальної інтеграції молоді «МАР».',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 sm:py-16 bg-[#081626] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Повернутися на головну</span>
        </Link>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30">
            <Lock className="w-3.5 h-3.5" />
            <span>Захист персональних даних</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Політика конфіденційності
          </h1>
          <p className="text-sm text-slate-400">
            Редакція чинна з 1 січня 2024 року. Відповідає Закону України «Про захист персональних даних» та Загальному регламенту захисту даних ЄС (GDPR).
          </p>
        </div>

        <div className="bg-[#0e2238] rounded-3xl border border-white/10 p-6 sm:p-10 space-y-8 text-sm text-slate-300 leading-relaxed shadow-xl">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Загальні положення</h2>
            <p>
              Ця Політика конфіденційності визначає порядок збору, зберігання, обробки та використання персональних даних, які користувачі надають громадській організації «Асоціація розвитку та соціальної інтеграції молоді «МАР» (код ЄДРПОУ 43210987) через веб-сайт під час заповнення форм зворотного зв'язку, реєстрації на освітні заходи чи подачі анкет волонтерів.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Які дані ми збираємо</h2>
            <p>Ми збираємо виключно ту інформацію, яку ви добровільно вказуєте під час взаємодії з платформою:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>Ім'я та прізвище;</li>
              <li>Адреса електронної пошти (email);</li>
              <li>Номер телефону або нікнейм у Telegram;</li>
              <li>Місто проживання та сфера інтересів (для волонтерів та учасників тренінгів);</li>
              <li>Текстове повідомлення або супровідний коментар.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. Мета збору даних</h2>
            <p>
              Зібрані персональні дані використовуються виключно для:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>Обробки та координації заявок волонтерів на проєкти організації;</li>
              <li>Надання зворотного зв'язку щодо консультацій та звернень;</li>
              <li>Інформування про нові навчальні програми, гранти та молодіжні обміни Erasmus+;</li>
              <li>Організації логістики (проїзд, проживання) учасників офлайн-заходів.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Захист та нерозголошення даних</h2>
            <p>
              ГО «МАР» вживає всіх необхідних технічних та організаційних заходів для захисту інформації від несанкціонованого доступу, зміни, розкриття чи знищення. Ми ніколи не передаємо та не продаємо ваші персональні дані третім особам чи комерційним компаніям.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">5. Ваші права</h2>
            <p>
              Ви маєте право у будь-який момент вимагати оновлення, виправлення або повного видалення ваших персональних даних із нашої бази, надіславши запит на адресу: <a href="mailto:info@map-association.org" className="text-sky-400 underline">info@map-association.org</a>.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
