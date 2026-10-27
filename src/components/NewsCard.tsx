'use client';

import React from 'react';
import Link from './LocaleLink';
import { useAdmin } from '../context/AdminContext';
import { useTranslation, getTranslatedNews } from '../lib/translations';
import { NewsItem } from '../lib/types';
import { deleteNewsAction } from '../lib/actions/contentActions';
import { Edit2, Trash2, ArrowRight } from 'lucide-react';
import { unsplashSrcSet } from '../lib/utils';
import { YoutubeIcon } from './icons/BrandIcons';

interface NewsCardProps {
  item: NewsItem;
}

export default function NewsCard({ item }: NewsCardProps) {
  const { isAdmin, openCreateNews } = useAdmin();
  const { t, language } = useTranslation();
  const displayItem = getTranslatedNews(item, language);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`${t.newsSection.deleteConfirm} "${displayItem.title}"?`)) {
      await deleteNewsAction(item.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openCreateNews(item);
  };

  return (
    <div className="group relative bg-[#0e2238] rounded-2xl border border-white/10 shadow-lg shadow-black/20 hover:border-sky-500/40 hover:bg-[#112a45] transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Admin Action Badges (matches user's mockup screenshot) */}
      {isAdmin && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 animate-in fade-in">
          <button
            onClick={handleEdit}
            className="w-8 h-8 rounded-full bg-[#3b7da5] hover:bg-[#4a90be] text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer"
            title={t.newsSection.editTooltip}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            className="w-8 h-8 rounded-full bg-slate-900/90 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-all hover:scale-105 cursor-pointer"
            title={t.newsSection.deleteTooltip}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Image container */}
      <Link href={`/news/${item.slug}`} className="relative block h-48 w-full bg-slate-900 overflow-hidden">
        <img
          src={displayItem.coverImage}
          srcSet={unsplashSrcSet(displayItem.coverImage)}
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          loading="lazy"
          decoding="async"
          alt={displayItem.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {displayItem.youtubeUrl && (
          <div className="absolute bottom-2 left-2 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <YoutubeIcon className="w-3 h-3" />
            <span>{t.newsSection.videoBadge}</span>
          </div>
        )}
        {displayItem.status === 'draft' && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {t.newsSection.draftBadge}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>{displayItem.date}</span>
          {displayItem.tags && displayItem.tags[0] && (
            <span className="text-sky-300/90 font-medium">#{displayItem.tags[0]}</span>
          )}
        </div>

        <Link href={`/news/${item.slug}`} className="block group-hover:text-sky-300 transition-colors">
          <h2 className="font-bold text-white text-base leading-snug line-clamp-2 mb-2">
            {displayItem.title}
          </h2>
        </Link>

        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed flex-1">
          {displayItem.excerpt}
        </p>

        <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between">
          <Link
            href={`/news/${item.slug}`}
            className="text-xs font-semibold text-sky-400 group-hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>{t.newsSection.readMore}</span>
            <span className="sr-only">: {displayItem.title}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
