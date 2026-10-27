'use client';

import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useTranslation, getTranslatedStory } from '../lib/translations';
import { updateAboutStoryAction } from '../lib/actions/contentActions';
import { Users, BookOpen, Globe, ShieldCheck, Check, Edit3, HeartHandshake } from 'lucide-react';

interface MissionSectionProps {
  initialStory: {
    title: string;
    description: string;
    mission: string;
    vision: string;
    values: Array<{ title: string; desc: string; icon: string }>;
  };
}

export default function MissionSection({ initialStory }: MissionSectionProps) {
  const { isAdmin, openVolunteer } = useAdmin();
  const { t, language } = useTranslation();
  const [story, setStory] = useState(initialStory);
  const [isEditing, setIsEditing] = useState(false);
  const [missionInput, setMissionInput] = useState(initialStory.mission);
  const [visionInput, setVisionInput] = useState(initialStory.vision);
  const [isSaving, setIsSaving] = useState(false);

  const displayStory = getTranslatedStory(story, language);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateAboutStoryAction({
        ...story,
        mission: missionInput,
        vision: visionInput
      });
      if (res.success && res.data) {
        setStory(res.data);
      }
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const iconsMap: Record<string, any> = {
    Users,
    BookOpen,
    Globe,
    ShieldCheck
  };

  return (
    <section className="py-16 bg-[#081626] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mission Banner */}
        <div className="bg-gradient-to-br from-[#0e2238] via-[#112a45] to-[#163659] border border-white/15 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden mb-16">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold">
              <HeartHandshake className="w-4 h-4" />
              <span>{t.missionSection.badge}</span>
            </div>

            {isEditing ? (
              <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-white/20 backdrop-blur-sm">
                <div>
                  <label className="text-xs text-sky-200 font-semibold block mb-1">{t.missionSection.missionTitle}</label>
                  <textarea
                    rows={2}
                    value={missionInput}
                    onChange={e => setMissionInput(e.target.value)}
                    className="w-full text-base bg-[#081626] text-white p-3 rounded-xl border border-white/20 focus:ring-2 focus:ring-sky-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-sky-200 font-semibold block mb-1">{t.missionSection.visionTitle}</label>
                  <textarea
                    rows={2}
                    value={visionInput}
                    onChange={e => setVisionInput(e.target.value)}
                    className="w-full text-base bg-[#081626] text-white p-3 rounded-xl border border-white/20 focus:ring-2 focus:ring-sky-400"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-[#3b7da5] hover:bg-[#4a90be] text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.missionSection.save}</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-xs text-slate-300 hover:text-white px-3 py-2"
                  >
                    {t.missionSection.cancel}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug text-white">
                  {displayStory.mission}
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {displayStory.vision}
                </p>
                {isAdmin && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 text-xs text-sky-300 hover:text-white font-semibold cursor-pointer pt-2"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{t.missionSection.editBtn}</span>
                  </button>
                )}
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={openVolunteer}
                className="bg-[#3b7da5] hover:bg-[#4a90be] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-full shadow-lg transition-all cursor-pointer"
              >
                {t.missionSection.joinBtn}
              </button>
            </div>
          </div>
        </div>

        {/* 4 Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayStory.values.map((val: any, idx: number) => {
            const Icon = iconsMap[val.icon] || Users;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0e2238] border border-white/10 shadow-lg shadow-black/20 hover:border-sky-500/40 hover:bg-[#112a45] transition-all duration-300 flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-4 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">{val.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed flex-1">{val.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
