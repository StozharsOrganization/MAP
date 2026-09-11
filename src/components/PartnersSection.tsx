'use client';

import React from 'react';
import { Handshake, Award, Globe, Shield } from 'lucide-react';

const PARTNERS = [
  { name: 'Erasmus+', category: 'Європейський Союз', desc: 'Програма молодіжної мобільності та неформальної освіти' },
  { name: 'European Youth Foundation', category: 'Рада Європи', desc: 'Грантова підтримка молодіжних проєктів соціальної інклюзії' },
  { name: 'UNICEF Україна', category: 'ООН', desc: 'Ініціативи психологічної підтримки та безпечних просторів' },
  { name: 'Мінмолодьспорту', category: 'Державне партнерство', desc: 'Спільні програми молодіжної політики та лідерства' },
  { name: 'ІСАР Єднання', category: 'Громадянське суспільство', desc: 'Організаційний розвиток та інституційна підтримка' },
  { name: 'Український молодіжний фонд', category: 'Національний фонд', desc: 'Фінансування молодіжних та волонтерських стартапів' },
];

export default function PartnersSection() {
  return (
    <section className="py-16 bg-[#050f1a] border-t border-white/10 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-bold">
            <Handshake className="w-3.5 h-3.5" />
            <span>Інституційна довіра</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Партнери та міжнародні донори
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Ми реалізуємо наші освітні, соціальні та інтеграційні програми у тісній співпраці з провідними міжнародними фондами та українськими інституціями.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {PARTNERS.map((p, idx) => (
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
