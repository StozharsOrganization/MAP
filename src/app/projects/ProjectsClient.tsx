'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useTranslation, getTranslatedProject } from '../../lib/translations';
import { ProjectItem } from '../../lib/types';
import { deleteProjectAction, updateProjectAction } from '../../lib/actions/contentActions';
import { formatMoney } from '../../lib/utils';
import { Plus, Edit2, Trash2, Clock, CheckCircle2, Search, Heart, Sparkles, FolderKanban } from 'lucide-react';

interface ProjectsClientProps {
  initialProjects: ProjectItem[];
}

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const { isAdmin, openProjectModal, openDonation } = useAdmin();
  const { t, language } = useTranslation();
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  useEffect(() => {
    const handleDonationEvent = (e: any) => {
      const { projectId, amount, newRaisedAmount } = e.detail || {};
      if (!projectId) return;
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === projectId || p.slug === projectId) {
            const updatedRaised =
              newRaisedAmount !== undefined
                ? Number(newRaisedAmount)
                : (p.raisedAmount || 0) + Number(amount || 0);
            return {
              ...p,
              raisedAmount: updatedRaised,
            };
          }
          return p;
        })
      );
    };

    window.addEventListener('map:donation', handleDonationEvent);
    return () => window.removeEventListener('map:donation', handleDonationEvent);
  }, []);

  const categories = [
    { key: 'all', label: language === 'en' ? 'All' : 'Всі' },
    { key: 'Освіта & Софт-скіли', label: language === 'en' ? 'Education & Soft Skills' : 'Освіта & Софт-скіли' },
    { key: 'Соціальна дія', label: language === 'en' ? 'Social Action' : 'Соціальна дія' },
    { key: 'Технології', label: language === 'en' ? 'Technology' : 'Технології' }
  ];

  const filteredProjects = projects.filter((proj) => {
    const displayProj = getTranslatedProject(proj, language);
    const matchesCat = selectedCategory === 'all' || proj.category === selectedCategory;
    const matchesStatus = statusFilter === 'all' || proj.status === statusFilter;
    const matchesSearch = displayProj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          displayProj.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Ви дійсно бажаєте видалити проєкт "${title}"?`)) {
      await deleteProjectAction(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleToggleStatus = async (proj: ProjectItem) => {
    const newStatus = proj.status === 'active' ? 'completed' : 'active';
    await updateProjectAction(proj.id, { status: newStatus });
    setProjects(prev => prev.map(p => p.id === proj.id ? { ...p, status: newStatus } : p));
  };

  return (
    <div className="py-12 sm:py-16 bg-[#081626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold">
            <FolderKanban className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.projectsPage.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {t.projectsPage.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            {t.projectsPage.subtitle}
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="bg-[#0e2238] p-4 sm:p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
               <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.projectsPage.searchPlaceholder}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-white/15 bg-[#081626] text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-400"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-[#081626] p-1 rounded-xl text-xs font-bold text-slate-300 border border-white/15">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'all' ? 'bg-[#3b7da5] text-white shadow-xs' : 'hover:text-white'
                }`}
              >
                {t.projectsPage.all}
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'active' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:text-white'
                }`}
              >
                {t.projectsPage.active}
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'completed' ? 'bg-slate-700 text-white shadow-xs' : 'hover:text-white'
                }`}
              >
                {t.projectsPage.completed}
              </button>
            </div>

            {/* Admin Add Button */}
            {isAdmin && (
              <button
                onClick={() => openProjectModal()}
                className="flex items-center gap-1.5 bg-[#3b7da5] hover:bg-[#4a90be] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.projectsPage.createBtn}</span>
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'bg-[#3b7da5] text-white shadow-xs'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((proj) => {
            const displayProj = getTranslatedProject(proj, language);
            return (
              <div
                key={proj.id}
                className="group relative bg-[#0e2238] rounded-3xl border border-white/10 shadow-lg shadow-black/20 hover:border-sky-500/40 hover:bg-[#112a45] transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Admin Actions */}
                {isAdmin && (
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleStatus(proj)}
                      className="px-2 py-1 rounded-full bg-black/60 hover:bg-black text-white text-[10px] font-bold shadow-md cursor-pointer"
                      title="Змінити статус"
                    >
                      {proj.status === 'active' ? 'Зробити завершеним' : 'Зробити активним'}
                    </button>
                    <button
                      onClick={() => openProjectModal(proj)}
                      className="w-8 h-8 rounded-full bg-[#3b7da5] text-white flex items-center justify-center shadow-md hover:scale-105 cursor-pointer"
                      title="Редагувати"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(proj.id, proj.title)}
                      className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md hover:bg-red-600 cursor-pointer"
                      title="Видалити"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Cover Image */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                  <img
                    src={displayProj.coverImage}
                    alt={displayProj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-xs ${
                        proj.status === 'active'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-700 text-slate-200'
                      }`}
                    >
                      {proj.status === 'active' ? (
                        <>
                          <Clock className="w-3 h-3" />
                          <span>{t.projectsSection.statusActive}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{t.projectsSection.statusCompleted}</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col flex-1 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-sky-400 uppercase tracking-wider">
                      {displayProj.category}
                    </span>
                    <span>{displayProj.dates}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors leading-snug">
                    {displayProj.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 flex-1">
                    {displayProj.shortDesc}
                  </p>

                  {displayProj.targetAudience && (
                    <p className="text-[11px] text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                      🎯 {t.projectsPage.audience}: {displayProj.targetAudience}
                    </p>
                  )}



                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => openDonation(proj.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#3b7da5] hover:bg-[#4a90be] px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-300" />
                      <span>{t.projectsPage.support}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="py-16 text-center bg-[#0e2238] rounded-3xl border border-white/10 text-slate-400">
            {t.projectsPage.empty}
          </div>
        )}

      </div>
    </div>
  );
}
