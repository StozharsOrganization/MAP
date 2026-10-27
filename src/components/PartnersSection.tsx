'use client';
import { useL, type LFn } from '../lib/translations';

import React from 'react';
import { Handshake, Award, Globe, Shield } from 'lucide-react';

const getPARTNERS = (L: LFn) => [
  { name: 'Erasmus+', category: L("Європейський Союз", "European Union"), desc: L("Програма молодіжної мобільності та неформальної освіти", "Youth mobility and non-formal education programme") },
  { name: 'European Youth Foundation', category: L("Рада Європи", "Council of Europe"), desc: L("Грантова підтримка молодіжних проєктів соціальної інклюзії", "Grant support for youth social inclusion projects") },
  { name: L("UNICEF Україна", "UNICEF Ukraine"), category: L("ООН", "United Nations"), desc: L("Ініціативи психологічної підтримки та безпечних просторів", "Psychological support and safe space initiatives") },
  { name: L("Мінмолодьспорту", "Ministry of Youth and Sports"), category: L("Державне партнерство", "Government partnership"), desc: L("Спільні програми молодіжної політики та лідерства", "Joint youth policy and leadership programmes") },
  { name: L("ІСАР Єднання", "ISAR Ednannia"), category: L("Громадянське суспільство", "Civil society"), desc: L("Організаційний розвиток та інституційна підтримка", "Organisational development and institutional support") },
  { name: L("Український молодіжний фонд", "Ukrainian Youth Fund"), category: L("Національний фонд", "National fund"), desc: L("Фінансування молодіжних та волонтерських стартапів", "Funding for youth and volunteer start-ups") },
];

export default function PartnersSection() {
  const L = useL();
  return (
    <section className="py-16 bg-[#050f1a] border-t border-white/10 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-bold">
            <Handshake className="w-3.5 h-3.5" />
            <span>{L("Інституційна довіра", "Institutional trust")}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {L("Партнери та міжнародні донори", "Partners and international donors")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {L("Ми реалізуємо наші освітні, соціальні та інтеграційні програми у тісній співпраці з провідними міжнародними фондами та українськими інституціями.", "We deliver our educational, social and integration programmes in close cooperation with leading international foundations and Ukrainian institutions.")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {getPARTNERS(L).map((p, idx) => (
            <div
              key={idx}
              className="bg-[#0e2238] rounded-2xl p-4 border border-white/10 flex flex-col justify-between hover:border-sky-400/50 hover:bg-[#122c4a] transition-all group shadow-md"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400 block">
                  {p.category}
                </span>
                <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                  {p.name}
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-tight">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
