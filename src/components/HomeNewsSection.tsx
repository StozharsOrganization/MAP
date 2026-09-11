'use client';

import React from 'react';
import Link from 'next/link';
import { useAdmin } from '../context/AdminContext';
import { useTranslation } from '../lib/translations';
import { NewsItem } from '../lib/types';
import NewsCard from './NewsCard';
import { Plus, ArrowRight } from 'lucide-react';

interface HomeNewsSectionProps {
  news: NewsItem[];
}

export default function HomeNewsSection({ news }: HomeNewsSectionProps) {
  const { isAdmin, openCreateNews } = useAdmin();
  const { t } = useTranslation();

  // Take first 3 news items for the home page showcase (matching mockup)
  const displayNews = news.slice(0, 3);

  return (
    <section className="py-16 bg-[#081626] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
              {t.newsSection.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {t.newsSection.subtitle}
            </p>
          </div>

          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-sky-400 hover:text-white transition-colors"
          >
            <span>{t.newsSection.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Admin Action Button (Exactly matching the user's mockup: "+ Додати нову публікацію") */}
        {isAdmin && (
          <div className="mb-6 animate-in slide-in-from-top-2">
            <button
              onClick={() => openCreateNews()}
              className="inline-flex items-center gap-2 bg-[#3b7da5] hover:bg-[#4a90be] text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.newsSection.addPost}</span>
            </button>
          </div>
        )}

        {/* News Grid (3 items as in mockup) */}
        {displayNews.length === 0 ? (
          <div className="py-12 text-center bg-[#0e2238] rounded-2xl border border-white/10 text-slate-400 text-sm">
            {t.newsSection.empty} {isAdmin && t.newsSection.emptyAdmin}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {displayNews.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
