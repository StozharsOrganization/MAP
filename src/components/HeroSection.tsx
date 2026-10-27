'use client';

import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useTranslation } from '../lib/translations';
import { HeroContent } from '../lib/types';
import { updateHeroAction } from '../lib/actions/contentActions';
import { Camera, Check, Edit3, Heart, Users, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  initialHero: HeroContent;
}

export default function HeroSection({ initialHero }: HeroSectionProps) {
  const { isAdmin, openDonation, openVolunteer } = useAdmin();
  const { t, language } = useTranslation();
  const [hero, setHero] = useState<HeroContent>(initialHero);
  const [isEditingText, setIsEditingText] = useState(false);
  const [titleInput, setTitleInput] = useState(initialHero.title);
  const [subtitleInput, setSubtitleInput] = useState(initialHero.subtitle);
  const [isChangingImage, setIsChangingImage] = useState(false);
  const [imageInput, setImageInput] = useState(initialHero.imageUrl);
  const [isSaving, setIsSaving] = useState(false);

  const displayTitle = language === 'en' ? t.hero.title : hero.title;
  const displaySubtitle = language === 'en' ? t.hero.subtitle : hero.subtitle;
  const displayBadge = language === 'en' ? t.hero.badge : hero.badge;
  const displayCtaPrimary = language === 'en' ? t.hero.ctaPrimary : hero.ctaPrimaryText;
  const displayCtaSecondary = language === 'en' ? t.hero.ctaSecondary : hero.ctaSecondaryText;

  const handleSaveText = async () => {
    setIsSaving(true);
    try {
      const res = await updateHeroAction({
        title: titleInput,
        subtitle: subtitleInput
      });
      if (res.success && res.data) {
        setHero(res.data);
      }
      setIsEditingText(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveImage = async () => {
    setIsSaving(true);
    try {
      const res = await updateHeroAction({
        imageUrl: imageInput
      });
      if (res.success && res.data) {
        setHero(res.data);
      }
      setIsChangingImage(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="on-image relative text-white overflow-hidden min-h-[560px] lg:min-h-[640px] flex items-center pt-16 pb-20 border-b border-white/10">
      {/* Background image: Молодь організації MAP */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={hero.imageUrl}
          alt="Молодь організації MAP"
          className="w-full h-full object-cover object-center"
        />
        {/* Lighter, softer gradient overlay so the image is clear and bright */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#081626]/75 via-[#081626]/40 to-black/20" />
        {/* Soft bottom blend into the next section */}
        <div className="hero-fade absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#081626] to-transparent" />
      </div>

      {/* Admin camera button to change background photo */}
      {isAdmin && (
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={() => setIsChangingImage(!isChangingImage)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-[#3b7da5] text-white text-xs font-semibold shadow-xl border border-white/20 transition-all cursor-pointer backdrop-blur-md"
            title="Змінити фонове фото"
          >
            <Camera className="w-4 h-4" />
            <span>Змінити фон</span>
          </button>

          {isChangingImage && (
            <div className="mt-3 p-4 bg-slate-900/95 border border-sky-500/40 rounded-2xl text-xs space-y-2 shadow-2xl backdrop-blur-md w-80">
              <label className="font-semibold text-sky-200 block">URL фонового зображення:</label>
              <input
                type="text"
                value={imageInput}
                onChange={e => setImageInput(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:ring-2 focus:ring-sky-400"
              />
              <div className="flex gap-2 justify-end pt-1">
                <button
                  onClick={handleSaveImage}
                  disabled={isSaving}
                  className="bg-[#3b7da5] hover:bg-[#4a90be] text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow-xs"
                >
                  {isSaving ? '...' : 'Оновити фон'}
                </button>
                <button
                  onClick={() => setIsChangingImage(false)}
                  className="text-slate-400 hover:text-white text-xs px-2.5 py-1.5"
                >
                  Закрити
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main hero content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-3xl space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-sky-200 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{displayBadge}</span>
          </div>

          {/* In-place editable headline */}
          <div className={`relative ${isAdmin ? 'group/edit' : ''}`}>
            {isAdmin && isEditingText ? (
              <div className="space-y-3 bg-[#081626]/90 p-5 rounded-2xl border border-sky-400/50 backdrop-blur-md shadow-2xl">
                <label className="text-xs font-semibold text-sky-300">{t.hero.editBadge}</label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={e => setTitleInput(e.target.value)}
                  className="w-full text-2xl sm:text-3xl font-extrabold bg-black/50 text-white px-3 py-2 rounded-xl border border-white/20 focus:ring-2 focus:ring-[#3b7da5]"
                />
                <label className="text-xs font-semibold text-sky-300 block">{t.hero.editSub}</label>
                <textarea
                  rows={3}
                  value={subtitleInput}
                  onChange={e => setSubtitleInput(e.target.value)}
                  className="w-full text-sm text-slate-200 bg-black/50 px-3 py-2 rounded-xl border border-white/20 focus:ring-2 focus:ring-[#3b7da5]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveText}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 bg-[#3b7da5] hover:bg-[#4a90be] text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isSaving ? '...' : t.hero.save}</span>
                  </button>
                  <button
                    onClick={() => setIsEditingText(false)}
                    className="text-xs text-slate-300 hover:text-white px-3 py-2"
                  >
                    {t.hero.cancel}
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => isAdmin && setIsEditingText(true)}
                className={`space-y-4 ${
                  isAdmin ? 'cursor-pointer hover:bg-white/5 p-2 -m-2 rounded-xl transition-colors' : ''
                }`}
                title={isAdmin ? 'Клікніть для редагування тексту' : undefined}
              >
                <div className="flex items-start justify-between gap-2">
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]">
                    {displayTitle}
                  </h1>
                  {isAdmin && (
                    <span className="p-1.5 rounded-full bg-white/15 text-sky-300 shrink-0 opacity-0 group-hover/edit:opacity-100 transition-opacity">
                      <Edit3 className="w-4 h-4" />
                    </span>
                  )}
                </div>
                <p className="text-base sm:text-xl text-slate-100 leading-relaxed font-medium max-w-2xl drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
                  {displaySubtitle}
                </p>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={openVolunteer}
              className="flex items-center gap-2 bg-[#3b7da5] hover:bg-[#4a90be] text-white font-bold text-sm sm:text-base px-7 py-4 rounded-full shadow-lg hover:shadow-sky-500/25 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{displayCtaPrimary}</span>
            </button>

            <button
              onClick={openDonation}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-sm sm:text-base px-7 py-4 rounded-full border border-white/25 backdrop-blur-md hover:-translate-y-0.5 transition-all cursor-pointer shadow-md"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
              <span>{displayCtaSecondary}</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
