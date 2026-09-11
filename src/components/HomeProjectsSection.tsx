'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdmin } from '../context/AdminContext';
import { useTranslation, getTranslatedProject } from '../lib/translations';
import { ProjectItem } from '../lib/types';
import { deleteProjectAction } from '../lib/actions/contentActions';
import { formatMoney } from '../lib/utils';
import { Plus, Edit2, Trash2, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

interface HomeProjectsSectionProps {
  projects: ProjectItem[];
}

export default function HomeProjectsSection({ projects }: HomeProjectsSectionProps) {
  const { isAdmin, openProjectModal, openDonation } = useAdmin();
  const { t, language } = useTranslation();
  const [projectList, setProjectList] = useState<ProjectItem[]>(projects);

  useEffect(() => {
    setProjectList(projects);
  }, [projects]);

  useEffect(() => {
    const handleDonationEvent = (e: any) => {
      const { projectId, amount, newRaisedAmount } = e.detail || {};
      if (!projectId) return;
      setProjectList((prev) =>
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

  const handleDelete = async (id: string, title: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`${t.projectsSection.deleteConfirm} "${title}"?`)) {
      await deleteProjectAction(id);
    }
  };

  const handleEdit = (proj: ProjectItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openProjectModal(proj);
  };

  return (
    <section className="py-16 bg-[#0b1d30] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
              {t.projectsSection.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {t.projectsSection.subtitle}
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-sky-400 hover:text-white transition-colors"
          >
            <span>{t.projectsSection.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Admin "+ Створити проєкт" placeholder card */}
          {isAdmin && (
            <button
              onClick={() => openProjectModal()}
              className="group border-2 border-dashed border-sky-500/30 hover:border-sky-400 bg-sky-950/20 hover:bg-sky-950/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[340px]"
            >
              <div className="w-14 h-14 rounded-full bg-[#3b7da5] text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                <Plus className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-white text-base mb-1">{t.projectsSection.createProject}</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                {t.projectsSection.createSub}
              </p>
            </button>
          )}

          {projectList.slice(0, 3).map((proj) => {
            const displayProj = getTranslatedProject(proj, language);
            return (
              <div
                key={proj.id}
                className="group relative bg-[#0e2238] rounded-2xl border border-white/10 shadow-lg shadow-black/20 hover:border-sky-500/40 hover:bg-[#112a45] transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Admin Actions */}
                {isAdmin && (
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 animate-in fade-in">
                    <button
                      onClick={(e) => handleEdit(proj, e)}
                      className="w-8 h-8 rounded-full bg-[#3b7da5] hover:bg-[#4a90be] text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer"
                      title={t.projectsSection.editTooltip}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(proj.id, proj.title, e)}
                      className="w-8 h-8 rounded-full bg-slate-900/90 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-all hover:scale-105 cursor-pointer"
                      title={t.projectsSection.deleteTooltip}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Cover Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={displayProj.coverImage}
                    alt={displayProj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs ${
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

                {/* Details */}
                <div className="p-6 flex flex-col flex-1 space-y-3">
                  <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                    {displayProj.category}
                  </span>

                  <h3 className="font-bold text-white text-lg leading-snug group-hover:text-sky-300 transition-colors">
                    {displayProj.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 flex-1">
                    {displayProj.shortDesc}
                  </p>

                {/* Progress bar if donation goal exists */}
                {proj.goalAmount && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs text-slate-400 font-medium">
                      <span>{t.projectsSection.raised}: {formatMoney(proj.raisedAmount || 0)} {t.projectsSection.currency}</span>
                      <span>{t.projectsSection.goal}: {formatMoney(proj.goalAmount)} {t.projectsSection.currency}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#3b7da5] to-emerald-400 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, Math.round(((proj.raisedAmount || 0) / proj.goalAmount) * 100))}%`
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href={`/projects`}
                    className="text-xs font-bold text-sky-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>{t.projectsSection.learnMore}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {proj.status === 'active' && (
                    <button
                      onClick={() => openDonation(proj.id)}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors"
                    >
                      {t.projectsSection.supportProject}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
}
