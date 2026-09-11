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
    <section className="relative bg-[#0e2238] text-white overflow-hidden pt-12 pb-16 lg:py-20">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#3b7da5]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Title & Text */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-sky-200 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{displayBadge}</span>
            </div>

            {/* In-place editable headline */}
            <div className={`relative ${isAdmin ? 'group/edit' : ''}`}>
              {isAdmin && isEditingText ? (
                <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-sky-400/50 backdrop-blur-sm">
                  <label className="text-xs font-semibold text-sky-300">{t.hero.editBadge}</label>
                  <input
                    type="text"
                    value={titleInput}
                    onChange={e => setTitleInput(e.target.value)}
                    className="w-full text-2xl sm:text-3xl font-extrabold bg-black/40 text-white px-3 py-2 rounded-xl border border-white/20 focus:ring-2 focus:ring-[#3b7da5]"
                  />
                  <label className="text-xs font-semibold text-sky-300 block">{t.hero.editSub}</label>
                  <textarea
                    rows={3}
                    value={subtitleInput}
                    onChange={e => setSubtitleInput(e.target.value)}
                    className="w-full text-sm text-slate-200 bg-black/40 px-3 py-2 rounded-xl border border-white/20 focus:ring-2 focus:ring-[#3b7da5]"
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
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                      {displayTitle}
                    </h1>
                    {isAdmin && (
                      <span className="p-1.5 rounded-full bg-white/15 text-sky-300 shrink-0 opacity-0 group-hover/edit:opacity-100 transition-opacity">
                        <Edit3 className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                    {displaySubtitle}
                  </p>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={openVolunteer}
                className="flex items-center gap-2 bg-[#3b7da5] hover:bg-[#4a90be] text-white font-bold text-sm px-6 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>{displayCtaPrimary}</span>
              </button>

              <button
                onClick={openDonation}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-6 py-3.5 rounded-full border border-white/20 backdrop-blur-sm transition-all cursor-pointer"
              >
                <Heart className="w-4 h-4 text-rose-400" />
                <span>{displayCtaSecondary}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Image (matches mockup youth photo) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none group">
              
              {/* Outer decorative ring */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#3b7da5] to-sky-400 rounded-3xl blur-sm opacity-50 group-hover:opacity-75 transition duration-500"></div>

              {/* Main image container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-4/3 sm:aspect-16/11 bg-slate-800">
                <img
                  src={hero.imageUrl}
                  alt="Молодь організації MAP"
                  className="w-full h-full object-cover"
                />

                {/* Camera icon in admin mode to change photo */}
                {isAdmin && (
                  <button
                    onClick={() => setIsChangingImage(!isChangingImage)}
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-[#0e2238]/90 hover:bg-[#3b7da5] text-white shadow-lg transition-all cursor-pointer"
                    title="Змінити головне фото"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Image URL editor popup */}
              {isAdmin && isChangingImage && (
                <div className="mt-3 p-3 bg-slate-900/95 border border-sky-500/40 rounded-xl text-xs space-y-2 animate-in slide-in-from-top-2">
                  <label className="font-semibold text-sky-200">Вкажіть URL нового зображення:</label>
                  <input
                    type="text"
                    value={imageInput}
                    onChange={e => setImageInput(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/20 text-white text-xs"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={handleSaveImage}
                      disabled={isSaving}
                      className="bg-[#3b7da5] text-white font-bold px-3 py-1 rounded-md text-xs cursor-pointer"
                    >
                      {isSaving ? '...' : 'Оновити фото'}
                    </button>
                    <button
                      onClick={() => setIsChangingImage(false)}
                      className="text-slate-400 hover:text-white text-xs px-2 py-1"
                    >
                      Закрити
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
