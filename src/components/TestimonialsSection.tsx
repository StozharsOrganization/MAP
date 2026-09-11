'use client';

import React from 'react';
import Image from 'next/image';
import { Quote, Sparkles, Star, MapPin } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Олена Ковальська',
    role: 'Випускниця «Академії лідерства»',
    city: 'Київ / Дніпро (ВПО)',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    text: 'Переїхавши до Дніпра після початку повномасштабного вторгнення, я почувалася розгубленою. У Хабі MAP я знайшла не лише підтримку й друзів, а й здобула софт-скіли, які допомогли мені виграти грант на свій перший соціальний проєкт.',
    program: 'Хаб соціальної інтеграції'
  },
  {
    name: 'Артем Дмитренко',
    role: 'Координатор молодіжних проєктів',
    city: 'Львів',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    text: 'Завдяки обміну Erasmus+ від MAP у Страсбурзі я зрозумів, як працює молодіжна політика в Європі. Отримав європейський сертифікат Youthpass, і це стало вирішальним фактором при отриманні стипендії на навчання!',
    program: 'Erasmus+ Mobility'
  },
  {
    name: 'Анастасія Бойко',
    role: 'Учасниця волонтерського руху',
    city: 'Харків',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    text: 'Волонтерство в MAP навчило мене критично мислити, координувати заходи для 100+ людей та не боятися публічних виступів. Це найкраща школа життя, яку я коли-небудь проходила.',
    program: 'Волонтерська програма'
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-20 bg-[#081626] border-t border-white/10 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Історії трансформації</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Що кажуть випускники наших програм
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Реальний вплив — це не просто статистика. Це змінені долі, впевненість у майбутньому та реалізовані ініціативи.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#0e2238] rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between space-y-6 shadow-xl relative hover:border-sky-400/40 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-[11px] font-bold">
                    {t.program}
                  </span>
                  <Quote className="w-6 h-6 text-slate-600 group-hover:text-amber-400/60 transition-colors" />
                </div>

                <p className="text-sm text-slate-300 leading-relaxed italic">
                  «{t.text}»
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-white/10">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-sky-400/40 shrink-0">
                  <Image
                    src={t.photo}
                    alt={t.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm leading-tight">{t.name}</h3>
                  <p className="text-xs text-sky-300">{t.role}</p>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{t.city}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
