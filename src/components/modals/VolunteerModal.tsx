'use client';

import React, { useState } from 'react';
import Link from '../LocaleLink';
import { useAdmin } from '../../context/AdminContext';
import { useTranslation, useL } from '../../lib/translations';
import { submitContactFormAction } from '../../lib/actions/contentActions';
import { X, Sparkles, CheckCircle, Loader2, Compass, ShieldCheck } from 'lucide-react';

const VOLUNTEER_DIRECTIONS = [
  '📱 SMM, контент та графічний дизайн',
  '🎪 Організація молодіжних подій та логістика',
  '🎓 Фасилітація, менторство та неформальна освіта',
  '🌍 Міжнародні обміни (Erasmus+) та переклад',
  '💻 IT, веб-розробка та цифрові технології',
  '🤝 Соціальна адаптація та підтримка молоді ВПО'
];

const VOLUNTEER_DIRECTIONS_EN = [
  '📱 SMM, content and graphic design',
  '🎪 Youth events and logistics',
  '🎓 Facilitation, mentoring and non-formal education',
  '🌍 International exchanges (Erasmus+) and translation',
  '💻 IT, web development and digital technology',
  '🤝 Social adaptation and support for IDP youth'
];

export default function VolunteerModal() {
  const { isVolunteerOpen, closeVolunteer } = useAdmin();
  const { t } = useTranslation();
  const L = useL();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [direction, setDirection] = useState(VOLUNTEER_DIRECTIONS[0]);
  const [skills, setSkills] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isVolunteerOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !agreed) return;

    setIsSubmitting(true);
    try {
      await submitContactFormAction({
        name,
        email,
        phone,
        city,
        direction,
        subject: `Анкета волонтера (${city || 'Україна'}) — ${direction}`,
        message: `Місто: ${city || 'Не вказано'}\nНапрям: ${direction}\nНавички та досвід: ${skills || 'Готовий(а) навчатися'}`,
        isVolunteer: true
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        closeVolunteer();
      }, 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#0e2238] rounded-3xl shadow-2xl border border-white/15 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 text-white max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-[#0e2238] via-[#13304f] to-[#18426d] text-white p-6 relative border-b border-white/10 shrink-0">
          <button
            onClick={closeVolunteer}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="text-xs uppercase tracking-wider font-bold text-sky-200">{t.volunteerModal.badge}</span>
          </div>
          <h3 className="text-xl font-bold">{t.volunteerModal.title}</h3>
          <p className="text-xs text-slate-300 mt-1">
            {L('Приєднуйтесь до команди MAP у 14 містах України або долучайтеся до онлайн-проєктів.', 'Join the MAP team in 14 Ukrainian cities or take part in our online projects.')}
          </p>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-white">{t.volunteerModal.successTitle}</h4>
            <p className="text-sm text-slate-300">
              {L('Дякуємо за ваше прагнення творити зміни! Координатор волонтерських програм MAP зв’яжеться з вами найближчим часом.', 'Thank you for wanting to make a difference! The MAP volunteer coordinator will contact you shortly.')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t.volunteerModal.nameLabel}</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t.volunteerModal.namePlaceholder}
                className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-[#081626] text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t.volunteerModal.emailLabel}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-white/15 bg-[#081626] text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t.volunteerModal.telegramLabel}</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder={L('@username або телефон', '@username or phone')}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-white/15 bg-[#081626] text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t.volunteerModal.cityLabel}</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder={t.volunteerModal.cityPlaceholder}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-white/15 bg-[#081626] text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {L('Напрям волонтерства', 'Volunteering area')}
                </label>
                <select
                  value={direction}
                  onChange={e => setDirection(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-white/15 bg-[#081626] text-white focus:ring-2 focus:ring-sky-400 focus:outline-none cursor-pointer"
                >
                  {VOLUNTEER_DIRECTIONS.map((dir, i) => (
                    <option key={dir} value={dir} className="bg-[#081626] text-white">
                      {L(dir, VOLUNTEER_DIRECTIONS_EN[i])}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.volunteerModal.skillsLabel}
              </label>
              <textarea
                rows={2}
                value={skills}
                onChange={e => setSkills(e.target.value)}
                placeholder={t.volunteerModal.skillsPlaceholder}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-white/15 bg-[#081626] text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              />
            </div>

            {/* GDPR Checkbox */}
            <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-400">
              <input
                type="checkbox"
                id="gdpr-consent"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 rounded border-white/20 bg-[#081626] text-sky-500 focus:ring-sky-400 cursor-pointer"
              />
              <label htmlFor="gdpr-consent" className="cursor-pointer select-none">
                {L('Я даю згоду на обробку моїх персональних даних відповідно до', 'I consent to the processing of my personal data in accordance with the')}{' '}
                <Link href="/privacy-policy" target="_blank" className="text-sky-400 underline hover:text-sky-300">
                  {L('Політики конфіденційності', 'Privacy Policy')}
                </Link>.
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !agreed}
              className="w-full bg-[#3b7da5] hover:bg-[#4a90be] text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.volunteerModal.sending}</span>
                </>
              ) : (
                <span>{t.volunteerModal.sendBtn}</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
