'use client';

import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { useTranslation, getTranslatedStory, getTranslatedTeamMember } from '../../../lib/translations';
import { TeamMember } from '../../../lib/types';
import { deleteTeamMemberAction, updateAboutStoryAction } from '../../../lib/actions/contentActions';
import { Users, UserPlus, Edit2, Trash2, Mail, Sparkles, Check, Edit3, HeartHandshake } from 'lucide-react';
import { LinkedinIcon } from '../../../components/icons/BrandIcons';

interface WhoWeAreClientProps {
  initialStory: any;
  initialTeam: TeamMember[];
}

export default function WhoWeAreClient({ initialStory, initialTeam }: WhoWeAreClientProps) {
  const { isAdmin, openTeamModal, openVolunteer } = useAdmin();
  const { t, language } = useTranslation();
  const [story, setStory] = useState(initialStory);
  const [team, setTeam] = useState(initialTeam);
  const [isEditingStory, setIsEditingStory] = useState(false);
  const [storyTitle, setStoryTitle] = useState(initialStory.title);
  const [storyDesc, setStoryDesc] = useState(initialStory.description);
  const [isSaving, setIsSaving] = useState(false);

  const displayStory = getTranslatedStory(story, language);

  const handleSaveStory = async () => {
    setIsSaving(true);
    try {
      const res = await updateAboutStoryAction({
        ...story,
        title: storyTitle,
        description: storyDesc
      });
      if (res.success && res.data) {
        setStory(res.data);
      }
      setIsEditingStory(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (confirm(`Ви дійсно хочете видалити з команди "${name}"?`)) {
      await deleteTeamMemberAction(id);
      setTeam(prev => prev.filter(m => m.id !== id));
    }
  };

  return (
    <div className="py-12 sm:py-16 space-y-16 bg-[#081626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.whoWeAre.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {t.whoWeAre.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            {t.whoWeAre.subtitle}
          </p>
        </div>

        {/* Story & Manifesto Card */}
        <div className="bg-[#0e2238] rounded-3xl border border-white/10 shadow-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          {isEditingStory ? (
            <div className="space-y-4 relative z-10 bg-black/40 p-5 rounded-2xl border border-white/20">
              <label className="text-xs font-bold text-slate-300 block">Заголовок блоку:</label>
              <input
                type="text"
                value={storyTitle}
                onChange={e => setStoryTitle(e.target.value)}
                className="w-full text-xl font-bold p-3 rounded-xl border border-white/20 bg-[#081626] text-white"
              />
              <label className="text-xs font-bold text-slate-300 block">Текст історії:</label>
              <textarea
                rows={5}
                value={storyDesc}
                onChange={e => setStoryDesc(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-white/20 bg-[#081626] text-white"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveStory}
                  disabled={isSaving}
                  className="bg-[#3b7da5] hover:bg-[#4a90be] text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Збереження...' : 'Зберегти зміни'}</span>
                </button>
                <button
                  onClick={() => setIsEditingStory(false)}
                  className="text-xs text-slate-400 hover:text-white px-3 py-2"
                >
                  Скасувати
                </button>
              </div>
            </div>
          ) : (
            <div className="relative z-10 space-y-6 max-w-4xl">
              <div className="flex items-start justify-between">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {displayStory.title}
                </h2>
                {isAdmin && (
                  <button
                    onClick={() => setIsEditingStory(true)}
                    className="flex items-center gap-1.5 text-xs text-sky-300 hover:text-white font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{t.whoWeAre.editStoryBtn}</span>
                  </button>
                )}
              </div>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
                {displayStory.description}
              </p>
            </div>
          )}
        </div>

        {/* Team Section */}
        <div className="mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
                <Users className="w-4 h-4" />
                <span>{t.whoWeAre.teamBadge}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {t.whoWeAre.teamTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {t.whoWeAre.teamSubtitle}
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => openTeamModal()}
                className="inline-flex items-center gap-2 bg-[#3b7da5] hover:bg-[#4a90be] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm cursor-pointer transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>{t.whoWeAre.addMemberBtn}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => {
              const displayMember = getTranslatedTeamMember(member, language);
              return (
                <div
                  key={member.id}
                  className="group relative bg-[#0e2238] rounded-3xl border border-white/10 shadow-lg shadow-black/20 hover:border-sky-500/40 hover:bg-[#112a45] transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                      <button
                        onClick={() => openTeamModal(member)}
                        className="w-8 h-8 rounded-full bg-[#3b7da5] text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer"
                        title="Редагувати учасника"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id, member.name)}
                        className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors cursor-pointer"
                        title="Видалити учасника"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Photo */}
                  <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={member.photo}
                      alt={displayMember.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Details */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                      {displayMember.name}
                    </h3>
                    <p className="text-xs font-semibold text-sky-400 mt-1 mb-3">
                      {displayMember.role}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed flex-1">
                      {displayMember.bio}
                    </p>

                    {/* Socials */}
                    <div className="pt-4 mt-4 border-t border-white/10 flex items-center gap-3">
                      {member.socials?.linkedin && (
                        <a
                          href={member.socials.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`LinkedIn — ${displayMember.name}`}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          <LinkedinIcon className="w-4 h-4" />
                        </a>
                      )}
                      {member.socials?.email && (
                        <a
                          href={`mailto:${member.socials.email}`}
                          aria-label={`Email — ${displayMember.name}`}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to action for volunteers */}
        <div className="mt-20 bg-gradient-to-r from-[#0e2238] via-[#112a45] to-[#163659] border border-white/15 rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 shadow-2xl">
          <HeartHandshake className="w-10 h-10 text-sky-400 mx-auto" />
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{t.whoWeAre.volunteerCtaTitle}</h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            {t.whoWeAre.volunteerCtaDesc}
          </p>
          <div className="pt-2">
            <button
              onClick={openVolunteer}
              className="bg-[#3b7da5] hover:bg-[#4a90be] text-white font-bold text-sm px-6 py-3.5 rounded-full shadow-lg transition-all cursor-pointer"
            >
              {t.whoWeAre.volunteerCtaBtn}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
