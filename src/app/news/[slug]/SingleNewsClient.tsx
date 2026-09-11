'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '../../../context/AdminContext';
import { useTranslation, getTranslatedNews } from '../../../lib/translations';
import { NewsItem } from '../../../lib/types';
import { updateNewsAction, deleteNewsAction } from '../../../lib/actions/contentActions';
import NewsCard from '../../../components/NewsCard';
import {
  ArrowLeft,
  Calendar,
  User,
  Share2,
  Image as ImageIcon,
  Edit3,
  Check,
  Trash2,
  Bold,
  Italic,
  List,
  Eye,
  Link as LinkIcon
} from 'lucide-react';
import { YoutubeIcon } from '../../../components/icons/BrandIcons';

interface SingleNewsClientProps {
  newsItem: NewsItem;
  relatedNews: NewsItem[];
}

// Convert any YouTube link (youtu.be, watch?v=) to embed URL
function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
}

export default function SingleNewsClient({ newsItem, relatedNews }: SingleNewsClientProps) {
  const { isAdmin } = useAdmin();
  const { t, language } = useTranslation();
  const [item, setItem] = useState<NewsItem>(newsItem);
  const [isEditing, setIsEditing] = useState(false);
  
  // Editor form state
  const [title, setTitle] = useState(newsItem.title);
  const [excerpt, setExcerpt] = useState(newsItem.excerpt);
  const [content, setContent] = useState(newsItem.content);
  const [coverImage, setCoverImage] = useState(newsItem.coverImage);
  const [youtubeUrl, setYoutubeUrl] = useState(newsItem.youtubeUrl || '');
  const [status, setStatus] = useState(newsItem.status);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayItem = getTranslatedNews(item, language);

  // Quick insertion helpers for block editing
  const insertText = (tag: string) => {
    setContent(prev => `${prev}\n<${tag}>Введіть ваш текст тут...</${tag}>\n`);
  };

  const insertImageBlock = () => {
    const url = prompt('Введіть URL зображення:');
    if (url) {
      setContent(prev => `${prev}\n<figure class="my-6">\n  <img src="${url}" alt="Фото події" class="rounded-2xl w-full object-cover max-h-[450px]" />\n  <figcaption class="text-center text-xs text-slate-500 mt-2">Підпис до фотографії</figcaption>\n</figure>\n`);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateNewsAction(item.id, {
        title,
        excerpt,
        content,
        coverImage,
        youtubeUrl,
        status
      });
      if (res.success && res.data) {
        setItem(res.data);
      }
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating article:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const embedUrl = getYoutubeEmbedUrl(displayItem.youtubeUrl || '');

  return (
    <article className="py-10 sm:py-16 bg-[#081626] min-h-screen text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation & Admin Control Bar */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.singleNews.backToNews}</span>
          </Link>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1.5 bg-[#3b7da5] hover:bg-[#4a90be] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? t.singleNews.closeEditor : t.singleNews.editArticle}</span>
              </button>
            </div>
          )}
        </div>

        {/* Admin In-Place Editing Panel */}
        {isEditing && (
          <div className="p-6 bg-[#0e2238] border-2 border-sky-500/40 rounded-2xl space-y-5 shadow-2xl animate-in slide-in-from-top-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-bold text-sm text-white">{t.singleNews.editorMode}</span>
              <span className="text-xs text-emerald-400 font-semibold">{t.singleNews.saveNotice}</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">{t.singleNews.titleH1}</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full text-lg font-bold p-3 rounded-xl border border-white/20 bg-[#081626] text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">{t.singleNews.coverUrl}</label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={e => setCoverImage(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-white/20 bg-[#081626] text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">{t.singleNews.videoUrl}</label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={e => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full text-xs p-2.5 rounded-lg border border-white/20 bg-[#081626] text-white placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t.singleNews.toolsLabel}
              </label>
              <div className="flex flex-wrap items-center gap-2 p-2 bg-[#081626] border border-white/15 rounded-t-xl text-xs">
                <button
                  type="button"
                  onClick={() => insertText('h3')}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-md cursor-pointer"
                >
                  {t.singleNews.addH3}
                </button>
                <button
                  type="button"
                  onClick={() => insertText('p')}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-md cursor-pointer"
                >
                  {t.singleNews.addP}
                </button>
                <button
                  type="button"
                  onClick={() => insertText('blockquote')}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-md cursor-pointer"
                >
                  {t.singleNews.addQuote}
                </button>
                <button
                  type="button"
                  onClick={() => setContent(prev => `${prev}\n<figure class="my-6">\n  <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80" alt="Фото" class="rounded-2xl w-full" />\n  <figcaption class="text-xs text-slate-400 mt-2 text-center">Підпис до світлини</figcaption>\n</figure>\n`)}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-md cursor-pointer flex items-center gap-1"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{t.singleNews.addPhoto}</span>
                </button>
              </div>
              <textarea
                rows={10}
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full text-sm font-mono p-3 rounded-b-xl border border-white/20 bg-[#081626] text-white"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300">{t.singleNews.statusLabel}</span>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="text-xs p-2 rounded-lg border border-white/20 bg-[#081626] text-white"
                >
                  <option value="published">{t.singleNews.statusPublished}</option>
                  <option value="draft">{t.singleNews.statusDraft}</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 bg-[#3b7da5] hover:bg-[#4a90be] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? t.singleNews.saving : t.singleNews.saveChanges}</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-400 hover:text-white px-3 py-2"
                >
                  {t.singleNews.cancel}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Article Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {displayItem.tags?.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider"
              >
                #{tag}
              </span>
            ))}
            {displayItem.status === 'draft' && (
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
                {t.singleNews.draftBadge}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {displayItem.title}
          </h1>

          <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-400 pt-2 border-b border-white/10 pb-6">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{displayItem.date}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" />
              <span>{displayItem.author}</span>
            </span>
          </div>
        </header>

        {/* Featured Cover Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900 aspect-16/9">
          <img
            src={displayItem.coverImage}
            alt={displayItem.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Lead Excerpt */}
        {displayItem.excerpt && (
          <div className="p-6 bg-[#0e2238] rounded-2xl border-l-4 border-[#3b7da5] border border-white/10 text-base sm:text-lg font-medium text-slate-200 leading-relaxed shadow-lg">
            {displayItem.excerpt}
          </div>
        )}

        {/* Embedded YouTube Video Player (if URL provided) */}
        {embedUrl && (
          <div className="space-y-2 my-8">
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
              <YoutubeIcon className="w-4 h-4 text-red-500" />
              <span>{t.singleNews.videoBadge}</span>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-16/9 bg-black">
              <iframe
                src={embedUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}

        {/* Article Body */}
        <div
          className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:text-white prose-h3:text-2xl prose-p:text-base prose-p:leading-relaxed prose-p:text-slate-300 prose-blockquote:border-l-4 prose-blockquote:border-[#3b7da5] prose-blockquote:bg-white/5 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:text-slate-200 prose-ul:list-disc prose-ul:pl-5 space-y-4"
          dangerouslySetInnerHTML={{ __html: displayItem.content }}
        />

        {/* Share & Feedback Section */}
        <div className="pt-8 mt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.singleNews.share}</span>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>{copied ? t.singleNews.copied : t.singleNews.copyLink}</span>
            </button>
            <a
              href={`https://t.me/share/url?url=${typeof window !== 'undefined' ? window.location.href : ''}&text=${encodeURIComponent(displayItem.title)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold transition-colors"
            >
              <span>Telegram</span>
            </a>
          </div>

          <Link
            href="/contacts"
            className="text-xs font-semibold text-sky-400 hover:underline"
          >
            {t.singleNews.proposal}
          </Link>
        </div>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div className="pt-16 border-t border-white/10 space-y-6">
            <h3 className="text-2xl font-bold text-white">{t.singleNews.relatedTitle}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedNews.map((rel) => (
                <NewsCard key={rel.id} item={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
}
