'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { createProjectAction, updateProjectAction } from '../../lib/actions/contentActions';
import { X, Check, Loader2, FolderKanban } from 'lucide-react';

export default function ProjectModal() {
  const { isProjectModalOpen, closeProjectModal, editingProject } = useAdmin();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Освіта & Софт-скіли');
  const [status, setStatus] = useState<'active' | 'completed'>('active');
  const [coverImage, setCoverImage] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [targetAudience, setTargetAudience] = useState('Молодь 16-25 років');
  const [dates, setDates] = useState('2024 - 2025');
  const [raisedAmount, setRaisedAmount] = useState(0);
  const [goalAmount, setGoalAmount] = useState(100000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingProject) {
      setTitle(editingProject.title);
      setCategory(editingProject.category);
      setStatus(editingProject.status);
      setCoverImage(editingProject.coverImage);
      setShortDesc(editingProject.shortDesc);
      setFullDesc(editingProject.fullDesc);
      setTargetAudience(editingProject.targetAudience);
      setDates(editingProject.dates);
      setRaisedAmount(editingProject.raisedAmount || 0);
      setGoalAmount(editingProject.goalAmount || 100000);
    } else {
      setTitle('');
      setCategory('Освіта & Софт-скіли');
      setStatus('active');
      setCoverImage('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80');
      setShortDesc('');
      setFullDesc('');
      setTargetAudience('Молодь 16-25 років');
      setDates('2024 - 2025');
      setRaisedAmount(0);
      setGoalAmount(100000);
    }
  }, [editingProject, isProjectModalOpen]);

  if (!isProjectModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingProject) {
        await updateProjectAction(editingProject.id, {
          title,
          category,
          status,
          coverImage,
          shortDesc,
          fullDesc,
          targetAudience,
          dates,
          raisedAmount: Number(raisedAmount) || 0,
          goalAmount: Number(goalAmount) || 100000
        });
      } else {
        await createProjectAction({
          title,
          category,
          status,
          coverImage,
          shortDesc,
          fullDesc,
          targetAudience,
          dates,
          goalAmount: Number(goalAmount) || 100000,
          raisedAmount: Number(raisedAmount) || 0
        });
      }
      closeProjectModal();
    } catch (err) {
      console.error('Error saving project:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#0e2238] rounded-2xl shadow-2xl border border-white/15 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0b1d30]/60">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-white text-base">
              {editingProject ? 'Редагування проєкту' : 'Новий проєкт MAP'}
            </h3>
          </div>
          <button
            onClick={closeProjectModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Назва проєкту</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Наприклад: Академія лідерства..."
              className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-[#081626] focus:ring-2 focus:ring-sky-400 text-white placeholder:text-slate-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Категорія</label>
              <input
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
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
                <option value="active" className="bg-[#081626] text-white">Активний (в процесі)</option>
                <option value="completed" className="bg-[#081626] text-white">Завершений</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Короткий опис для картки</label>
            <textarea
              rows={2}
              required
              value={shortDesc}
              onChange={e => setShortDesc(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-white/15 bg-[#081626] text-slate-200 placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Повний опис і цілі</label>
            <textarea
              rows={3}
              value={fullDesc}
              onChange={e => setFullDesc(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-white/15 bg-[#081626] text-slate-200 placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Цільова аудиторія</label>
              <input
                type="text"
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-white/15 bg-[#081626] text-slate-200 placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Термін проведення</label>
              <input
                type="text"
                value={dates}
                onChange={e => setDates(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-white/15 bg-[#081626] text-slate-200 placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Зібрано коштів (₴)</label>
              <input
                type="number"
                min="0"
                value={raisedAmount}
                onChange={e => setRaisedAmount(Number(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-white/15 bg-[#081626] text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ціль збору (₴)</label>
              <input
                type="number"
                min="0"
                value={goalAmount}
                onChange={e => setGoalAmount(Number(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-white/15 bg-[#081626] text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">URL обкладинки</label>
            <input
              type="text"
              value={coverImage}
              onChange={e => setCoverImage(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-white/15 bg-[#081626] text-slate-200 placeholder:text-slate-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#3b7da5] hover:bg-[#2d6282] text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Збереження...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{editingProject ? 'Зберегти зміни' : 'Створити проєкт'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
