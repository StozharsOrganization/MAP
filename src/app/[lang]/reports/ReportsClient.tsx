'use client';
import { useL, type LFn } from '../../../lib/translations';

import React from 'react';
import Link from '../../../components/LocaleLink';
import {
  ShieldCheck,
  FileText,
  Download,
  PieChart,
  Landmark,
  Building,
  CheckCircle,
  ExternalLink,
  Heart,
  Award
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

export default function ReportsClient() {
  const { openDonation } = useAdmin();
  const L = useL();

  const reports = [
    {
      year: '2024',
      title: L("Річний описовий та фінансовий звіт за 2024 рік", "Annual narrative and financial report 2024"),
      summary: L("35+ реалізованих проєктів, 1 500+ залучених молодих людей, розширення діяльності на 14 міст України.", "35+ projects delivered, 1,500+ young people engaged, operations expanded to 14 Ukrainian cities."),
      budget: '2 850 000 ₴',
      participants: '1 520',
      fileName: 'MAP_Annual_Report_2024.pdf',
      fileSize: '4.2 MB'
    },
    {
      year: '2023',
      title: L("Річний описовий та фінансовий звіт за 2023 рік", "Annual narrative and financial report 2023"),
      summary: L("Запуск Хабу соціальної інтеграції для молоді ВПО, 12 міжнародних обмінів за програмою Erasmus+.", "Launch of the Social Integration Hub for IDP youth, 12 international Erasmus+ exchanges."),
      budget: '1 940 000 ₴',
      participants: '980',
      fileName: 'MAP_Annual_Report_2023.pdf',
      fileSize: '3.8 MB'
    },
    {
      year: '2022',
      title: L("Звіт про реалізацію гуманітарних та освітніх ініціатив 2022", "Report on humanitarian and educational initiatives 2022"),
      summary: L("Екстрена допомога переміщеній молоді, арт-терапевтичні табори, переорієнтація проєктів.", "Emergency aid for displaced youth, art-therapy camps, project reorientation."),
      budget: '1 210 000 ₴',
      participants: '650',
      fileName: 'MAP_Annual_Report_2022.pdf',
      fileSize: '2.9 MB'
    }
  ];

  const documents = [
    {
      title: L("Статут ГО «МАР»", "Charter of NGO \"MAP\""),
      desc: L("Нова редакція статуту організації, зареєстрована Міністерством юстиції України", "Current edition of the charter, registered by the Ministry of Justice of Ukraine"),
      type: L("PDF Документ", "PDF document"),
      date: '18.04.2019'
    },
    {
      title: L("Виписка з ЄДРПОУ", "EDRPOU registry extract"),
      desc: L("Ідентифікаційний код юридичної особи: 43210987", "Legal entity ID code: 43210987"),
      type: L("Офіційна виписка", "Official extract"),
      date: '18.04.2019'
    },
    {
      title: L("Рішення ДПС про неприбутковість", "Tax Service non-profit status decision"),
      desc: L("Включення до Реєстру неприбуткових установ та організацій з ознакою 0032", "Listed in the Register of Non-Profit Organisations under code 0032"),
      type: L("Довідка ДПС", "Tax Service certificate"),
      date: '25.04.2019'
    }
  ];

  return (
    <div className="py-12 sm:py-16 bg-[#081626] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>{L("Відкритість та підзвітність", "Openness and accountability")}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {L("Прозорість та публічна звітність", "Transparency and public reporting")}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            {L("Ми дотримуємося найвищих стандартів доброчесності, відкритості та фінансової прозорості перед нашими учасниками, донорами, волонтерами та партнерами.", "We hold ourselves to the highest standards of integrity, openness and financial transparency towards our participants, donors, volunteers and partners.")}
          </p>
        </div>

        {/* Official Org Credentials Card */}
        <div className="bg-[#0e2238] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-sky-500/10 rounded-2xl border border-sky-400/20 text-sky-400">
                <Building className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{L("Офіційні реквізити організації", "Official organisation details")}</h2>
                <p className="text-xs text-slate-400">{L("Зареєстрована неприбуткова громадська організація", "Registered non-profit NGO")}</p>
              </div>
            </div>
            <button
              onClick={openDonation}
              className="flex items-center gap-2 bg-[#3b7da5] hover:bg-[#4a90be] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-md"
            >
              <Heart className="w-4 h-4 text-rose-300" />
              <span>{L("Підтримати нашу діяльність", "Support our work")}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-xs text-slate-300">
            <div className="space-y-1">
              <span className="text-slate-500 uppercase tracking-wider font-semibold text-[10px]">{L("Повна юридична назва:", "Full legal name:")}</span>
              <p className="font-semibold text-white">{L("ГРОМАДСЬКА ОРГАНІЗАЦІЯ «АСОЦІАЦІЯ РОЗВИТКУ ТА СОЦІАЛЬНОЇ ІНТЕГРАЦІЇ МОЛОДІ «МАР»", "NGO \"ASSOCIATION FOR YOUTH DEVELOPMENT AND SOCIAL INTEGRATION \"MAP\"")}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 uppercase tracking-wider font-semibold text-[10px]">{L("Код за ЄДРПОУ:", "EDRPOU code:")}</span>
              <p className="font-mono text-base font-bold text-sky-300">43210987</p>
              <p className="text-[11px] text-slate-400">{L("Ознака неприбутковості: 0032", "Non-profit code: 0032")}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 uppercase tracking-wider font-semibold text-[10px]">{L("Офіційна адреса:", "Registered address:")}</span>
              <p className="font-semibold text-white">{L("вул. Хрещатик, 22, оф. 405, м. Київ, 01001, Україна", "22 Khreshchatyk St, office 405, Kyiv 01001, Ukraine")}</p>
            </div>
          </div>
        </div>

        {/* Financial Distribution Breakdown (Budget Usage) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <PieChart className="w-6 h-6 text-sky-400" />
            <h2 className="text-2xl font-bold text-white">{L("Як ми використовуємо залучені кошти", "How we use the funds we raise")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#0e2238] rounded-2xl p-6 border border-white/10 space-y-2">
              <div className="text-3xl font-black text-sky-400">65%</div>
              <div className="font-bold text-white text-sm">{L("Освітні програми та молодіжні обміни", "Educational programmes and youth exchanges")}</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {L("Організація тренінгів лідерства, воркшопів, оплата проїзду та проживання на заходах Erasmus+.", "Leadership trainings and workshops, travel and accommodation for Erasmus+ events.")}
              </p>
            </div>

            <div className="bg-[#0e2238] rounded-2xl p-6 border border-white/10 space-y-2">
              <div className="text-3xl font-black text-emerald-400">20%</div>
              <div className="font-bold text-white text-sm">{L("Інтеграція та підтримка молоді ВПО", "Integration and support for IDP youth")}</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {L("Робота Хабу соціальної інтеграції, психологічні консультації, арт-терапія та розмовні клуби.", "Social Integration Hub operations, psychological counselling, art therapy and conversation clubs.")}
              </p>
            </div>

            <div className="bg-[#0e2238] rounded-2xl p-6 border border-white/10 space-y-2">
              <div className="text-3xl font-black text-amber-400">10%</div>
              <div className="font-bold text-white text-sm">{L("Розвиток волонтерської мережі", "Growing the volunteer network")}</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {L("Навчання локальних координаторів у 14 містах, залучення нових активістів та публічні кампанії.", "Training local coordinators in 14 cities, recruiting new activists and public campaigns.")}
              </p>
            </div>

            <div className="bg-[#0e2238] rounded-2xl p-6 border border-white/10 space-y-2">
              <div className="text-3xl font-black text-purple-400">5%</div>
              <div className="font-bold text-white text-sm">{L("Операційні та адміністративні витрати", "Operational and administrative costs")}</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {L("Банківське обслуговування, бухгалтерський та юридичний супровід, підтримка цифрових сервісів.", "Banking fees, accounting and legal support, digital services.")}
              </p>
            </div>
          </div>
        </div>

        {/* Annual Reports List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-sky-400" />
              <h2 className="text-2xl font-bold text-white">{L("Офіційні річні звіти організації", "Official annual reports")}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reports.map((r) => (
              <div
                key={r.year}
                className="bg-[#0e2238] rounded-3xl border border-white/10 p-6 flex flex-col justify-between space-y-4 hover:border-sky-400/40 transition-all group shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 font-bold text-xs">
                      {L("Рік", "Year")} {r.year}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{r.fileSize}</span>
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug group-hover:text-sky-300 transition-colors">
                    {r.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {r.summary}
                  </p>

                  <div className="pt-2 grid grid-cols-2 gap-2 border-t border-white/10 text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] block">{L("Бюджет проєктів:", "Project budget:")}</span>
                      <strong className="text-white">{r.budget}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">{L("Учасників:", "Participants:")}</span>
                      <strong className="text-white">{r.participants} {L("осіб", "people")}</strong>
                    </div>
                  </div>
                </div>

                <a
                  href={`#download-${r.year}`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(L(`Завантаження звіту ${r.fileName}. Усі публічні звіти організації відкриті для громадськості.`, `Downloading report ${r.fileName}. All of our public reports are open to everyone.`));
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-sky-300 border border-white/10 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{L("Завантажити PDF", "Download PDF")}</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Statutory Documents */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-sky-400" />
            <h2 className="text-2xl font-bold text-white">{L("Статутні та реєстраційні документи", "Statutory and registration documents")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {documents.map((doc, idx) => (
              <div
                key={idx}
                className="bg-[#0e2238] rounded-2xl p-5 border border-white/10 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{doc.type}</span>
                  <h3 className="font-bold text-white text-sm">{doc.title}</h3>
                  <p className="text-xs text-slate-400">{doc.desc}</p>
                  <span className="text-[10px] text-slate-500 block pt-1">{L("Дата реєстрації:", "Registration date:")} {doc.date}</span>
                </div>
                <div className="p-2 bg-white/5 rounded-lg text-slate-400 shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
