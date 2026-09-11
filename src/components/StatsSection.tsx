'use client';

import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useTranslation } from '../lib/translations';
import { ImpactStats } from '../lib/types';
import { updateStatsAction } from '../lib/actions/contentActions';
import { Users, Award, MapPin, Calendar, Check, Edit3 } from 'lucide-react';

interface StatsSectionProps {
  initialStats: ImpactStats;
}

export default function StatsSection({ initialStats }: StatsSectionProps) {
  const { isAdmin } = useAdmin();
  const { t, language } = useTranslation();
  const [stats, setStats] = useState<ImpactStats>(initialStats);
  const [isEditing, setIsEditing] = useState(false);
  const [inputs, setInputs] = useState<ImpactStats>(initialStats);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateStatsAction(inputs);
      if (res.success && res.data) {
        setStats(res.data);
      }
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const statItems = [
    {
      icon: Users,
      count: stats.youthCount,
      label: language === 'en' ? t.stats.youthLabel : stats.youthLabel,
      key: 'youth'
    },
    {
      icon: Award,
      count: stats.projectsCount,
      label: language === 'en' ? t.stats.projectsLabel : stats.projectsLabel,
      key: 'projects'
    },
    {
      icon: MapPin,
      count: stats.citiesCount,
      label: language === 'en' ? t.stats.citiesLabel : stats.citiesLabel,
      key: 'cities'
    },
    {
      icon: Calendar,
      count: stats.yearsCount,
      label: language === 'en' ? t.stats.yearsLabel : stats.yearsLabel,
      key: 'years'
    },
  ];

  return (
    <section className="py-12 bg-[#0b1d30] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin toggle for stats */}
        {isAdmin && !isEditing && (
          <div className="flex justify-end mb-3">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 text-xs text-sky-300 hover:text-white font-semibold bg-sky-950/60 border border-sky-500/30 hover:bg-sky-900/60 px-3 py-1 rounded-full cursor-pointer transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t.stats.editBtn}</span>
            </button>
          </div>
        )}

        {isEditing ? (
          <div className="p-6 bg-[#0e2238] rounded-2xl border border-white/15 space-y-4 shadow-xl">
            <h4 className="font-bold text-sm text-white">Редагування лічильників впливу (Impact)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Молодь:</label>
                <input
                  type="text"
                  value={inputs.youthCount}
                  onChange={e => setInputs({ ...inputs, youthCount: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-sm bg-[#081626] rounded-lg border border-white/20 text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300">Проєкти:</label>
                <input
                  type="text"
                  value={inputs.projectsCount}
                  onChange={e => setInputs({ ...inputs, projectsCount: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-sm bg-[#081626] rounded-lg border border-white/20 text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300">Міста:</label>
                <input
                  type="text"
                  value={inputs.citiesCount}
                  onChange={e => setInputs({ ...inputs, citiesCount: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-sm bg-[#081626] rounded-lg border border-white/20 text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300">Роки діяльності:</label>
                <input
                  type="text"
                  value={inputs.yearsCount}
                  onChange={e => setInputs({ ...inputs, yearsCount: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-sm bg-[#081626] rounded-lg border border-white/20 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#3b7da5] hover:bg-[#4a90be] text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Збереження...' : 'Зберегти'}</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs text-slate-400 hover:text-white px-3 py-2"
              >
                Скасувати
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {item.count}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-slate-400">
                      {item.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
