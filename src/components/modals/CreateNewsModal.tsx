'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { createNewsAction, updateNewsAction } from '../../lib/actions/contentActions';
import { X, Bold, Italic, Link2, Image as ImageIcon, List, Check, Loader2, Upload } from 'lucide-react';
import { YoutubeIcon } from '../icons/BrandIcons';

export default function CreateNewsModal() {
  const { isCreateNewsOpen, closeCreateNews, editingNews } = useAdmin();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [tags, setTags] = useState('Новини, Молодь');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);

  useEffect(() => {
    if (editingNews) {
      setTitle(editingNews.title);
      setExcerpt(editingNews.excerpt);
      setContent(editingNews.content);
      setCoverImage(editingNews.coverImage);
      setYoutubeUrl(editingNews.youtubeUrl || '');
      setTags(editingNews.tags?.join(', ') || 'Новини, Молодь');
      setStatus(editingNews.status);
      if (editingNews.youtubeUrl) setShowYoutubeInput(true);
    } else {
      setTitle('');
      setExcerpt('');
      setContent('');
      setCoverImage('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80');
      setYoutubeUrl('');
      setTags('Новини, Молодь');
      setStatus('published');
      setShowYoutubeInput(false);
    }
  }, [editingNews, isCreateNewsOpen]);

  if (!isCreateNewsOpen) return null;

  const handleFormat = (tag: string) => {
    setContent(prev => `${prev}\n<${tag}>Текст</${tag}>`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
      
      if (editingNews) {
        await updateNewsAction(editingNews.id, {
          title,
          excerpt,
          content,
          coverImage,
          youtubeUrl,
          tags: parsedTags,
          status
        });
      } else {
        await createNewsAction({
          title,
          excerpt: excerpt || title,
          content: content || `<p>${excerpt || title}</p>`,
          coverImage,
          youtubeUrl,
          tags: parsedTags,
          status
        });
      }
      closeCreateNews();
    } catch (err) {
      console.error('Error saving news:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#0e2238] rounded-2xl shadow-2xl border border-white/15 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0b1d30]/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <h3 className="font-bold text-white text-base">
              {editingNews ? 'Редагування новини' : 'Створення публікації'}
            </h3>
          </div>
          <button
            onClick={closeCreateNews}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm">
          {/* Title input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Заголовок новини
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Введіть заголовок публікації..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#081626] focus:outline-hidden focus:ring-2 focus:ring-[#3b7da5] text-white font-medium placeholder:text-slate-500"
            />
          </div>

          {/* Excerpt input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Короткий анонс (для картки)
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="Короткий опис на 1-2 речення..."
              className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-[#081626] focus:outline-hidden focus:ring-2 focus:ring-[#3b7da5] text-slate-200 placeholder:text-slate-500"
            />
          </div>

          {/* Format Toolbar */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Текст статті
            </label>
            <div className="flex items-center gap-1 p-1 bg-[#081626] rounded-t-xl border border-b-0 border-white/15 text-slate-300">
              <button
                type="button"
                onClick={() => handleFormat('strong')}
                className="p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-all"
                title="Жирний"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleFormat('em')}
                className="p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-all"
                title="Курсив"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleFormat('h3')}
                className="px-2 py-1 text-xs font-bold rounded-md hover:bg-white/10 hover:text-white transition-all"
                title="Підзаголовок"
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => handleFormat('ul')}
                className="p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-all"
                title="Список"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleFormat('blockquote')}
                className="p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-all"
                title="Цитата"
              >
                <span className="font-serif font-bold text-xs">“</span>
              </button>
              <div className="h-4 w-px bg-white/20 mx-1" />
              <button
                type="button"
                onClick={() => setShowYoutubeInput(!showYoutubeInput)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                  showYoutubeInput ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'hover:bg-white/10 hover:text-white'
                }`}
                title="Додати YouTube відео"
              >
                <YoutubeIcon className="w-3.5 h-3.5 text-red-400" />
                <span>YouTube</span>
              </button>
            </div>
            <textarea
              rows={5}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Тут опишіть текст, що спостерігалося, результати заходу або деталі проєкту..."
              className="w-full px-3.5 py-2.5 rounded-b-xl border border-white/15 bg-[#081626] focus:outline-hidden focus:ring-2 focus:ring-[#3b7da5] text-slate-200 placeholder:text-slate-500 font-normal"
            />
          </div>

          {/* YouTube input expander */}
          {showYoutubeInput && (
            <div className="p-3 bg-red-950/40 border border-red-800/40 rounded-xl space-y-1.5 animate-in slide-in-from-top-1">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-red-300">
                <YoutubeIcon className="w-4 h-4 text-red-400" />
                <span>Посилання на YouTube відео</span>
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={e => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-1.5 rounded-lg border border-red-800/50 bg-[#081626] text-xs text-white placeholder:text-slate-500 focus:ring-2 focus:ring-red-400 focus:outline-hidden"
              />
              <p className="text-[11px] text-red-300/80">
                Відео автоматично відобразиться у вбудованому плеєрі 16:9 на сторінці новини.
              </p>
            </div>
          )}

          {/* Cover Image Upload & Preview Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Обкладинка новини
            </label>
            <div className="border-2 border-dashed border-white/15 rounded-xl p-3 text-center bg-[#081626]/50 hover:bg-[#081626] transition-colors">
              {coverImage ? (
                <div className="relative h-28 w-full rounded-lg overflow-hidden mb-2 group">
                  <img
                    src={coverImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-xs font-medium">Змінити зображення</span>
                  </div>
                </div>
              ) : (
                <div className="py-4">
                  <ImageIcon className="w-8 h-8 mx-auto text-slate-500 mb-1" />
                  <p className="text-xs text-slate-400 font-medium">Вільна публікація</p>
                </div>
              )}
              <input
                type="text"
                value={coverImage}
                onChange={e => setCoverImage(e.target.value)}
                placeholder="Вставте URL фотографії (наприклад з Unsplash або сховища)..."
                className="w-full px-3 py-1.5 text-xs bg-[#081626] rounded-lg border border-white/15 text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:ring-1 focus:ring-[#3b7da5]"
              />
            </div>
          </div>

          {/* Tags & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Теги</label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="Освіта, Семінар..."
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-white/15 bg-[#081626] text-slate-200 placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Статус</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as typeof status)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-white/15 bg-[#081626] text-slate-200 font-medium"
              >
                <option value="published" className="bg-[#081626] text-white">Опубліковано</option>
                <option value="draft" className="bg-[#081626] text-white">Чернетка</option>
              </select>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#3b7da5] hover:bg-[#2d6282] text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Збереження...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{editingNews ? 'Зберегти зміни' : 'Опублікувати'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
