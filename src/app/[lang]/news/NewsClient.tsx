'use client';

import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { useTranslation, getTranslatedNews } from '../../../lib/translations';
import { NewsItem } from '../../../lib/types';
import NewsCard from '../../../components/NewsCard';
import { Plus, Search, Newspaper, Sparkles } from 'lucide-react';

interface NewsClientProps {
  initialNews: NewsItem[];
}

export default function NewsClient({ initialNews }: NewsClientProps) {
  const { isAdmin, openCreateNews } = useAdmin();
  const { t, language } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const filteredNews = initialNews.filter((item) => {
    const displayItem = getTranslatedNews(item, language);
    // Non-admin can only see published news
    if (!isAdmin && item.status === 'draft') return false;

    if (isAdmin && statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }

    const matchesSearch =
      displayItem.title.toLowerCase().includes(search.toLowerCase()) ||
      displayItem.excerpt.toLowerCase().includes(search.toLowerCase());

    const matchesTag =
      selectedTag === 'all' || (item.tags && item.tags.includes(selectedTag));

    return matchesSearch && matchesTag;
  });

  return (
    <div className="py-12 sm:py-16 bg-[#081626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.newsPage.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {t.newsPage.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            {t.newsPage.subtitle}
          </p>
        </div>

        {/* Filter bar */}
        <div className="bg-[#0e2238] p-4 sm:p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.newsPage.searchPlaceholder}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-white/15 bg-[#081626] text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-400"
              />
            </div>

            {/* Admin filters & create button */}
            <div className="flex items-center gap-3">
              {isAdmin && (
                <div className="flex items-center gap-1 bg-[#081626] p-1 rounded-xl text-xs font-bold border border-white/15">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${statusFilter === 'all' ? 'bg-[#3b7da5] text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
                  >
                    {t.newsPage.all}
                  </button>
                  <button
                    onClick={() => setStatusFilter('published')}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${statusFilter === 'published' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
                  >
                    {t.newsPage.published}
                  </button>
                  <button
                    onClick={() => setStatusFilter('draft')}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${statusFilter === 'draft' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
                  >
                    {t.newsPage.drafts}
                  </button>
                </div>
              )}

              {isAdmin && (
                <button
                  onClick={() => openCreateNews()}
                  className="flex items-center gap-1.5 bg-[#3b7da5] hover:bg-[#4a90be] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.newsPage.addNewsBtn}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <div className="py-16 text-center bg-[#0e2238] rounded-3xl border border-white/10 text-slate-400">
            {t.newsPage.empty}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
