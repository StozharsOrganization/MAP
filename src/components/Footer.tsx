'use client';

import React, { useRef } from 'react';
import Link from './LocaleLink';
import Image from 'next/image';
import { useAdmin } from '../context/AdminContext';
import { useTranslation } from '../lib/translations';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { InstagramIcon, FacebookIcon, LinkedinIcon, TelegramIcon } from './icons/BrandIcons';
import ThemeSwitcher from './ThemeSwitcher';

export default function Footer() {
  const { openAdminLogin, openDonation, openVolunteer, language } = useAdmin();
  const { t } = useTranslation();
  const clickCountRef = useRef(0);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSecretCopyrightClick = () => {
    clickCountRef.current += 1;
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      openAdminLogin();
    } else {
      resetTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 4000);
    }
  };

  return (
    <footer className="bg-[#050f1a] text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: About */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-block group" aria-label="MAP NGO">
              <div className="relative h-11 w-32 bg-white rounded-xl px-2.5 py-1.5 shadow-sm border border-white/20 transition-all duration-200 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="MAP NGO"
                  fill
                  sizes="130px"
                  className="object-contain p-0.5"
                />
              </div>
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t.footer.aboutDesc}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#3b7da5] transition-colors">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="https://t.me" target="_blank" rel="noreferrer" aria-label="Telegram" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#3b7da5] transition-colors">
                <TelegramIcon className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#3b7da5] transition-colors">
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#3b7da5] transition-colors">
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Programs */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white tracking-wide">
              {t.footer.colPrograms}
            </h2>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/projects" className="hover:text-[#5a9bc4] transition-colors">
                  {t.footer.prog1}
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-[#5a9bc4] transition-colors">
                  {t.footer.prog2}
                </Link>
              </li>
              <li>
                <Link href="/who-we-are" className="hover:text-[#5a9bc4] transition-colors">
                  {t.footer.prog3}
                </Link>
              </li>
              <li>
                <button
                  onClick={openVolunteer}
                  className="hover:text-[#5a9bc4] transition-colors text-left cursor-pointer"
                >
                  {t.footer.prog4}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white tracking-wide">
              {t.footer.colNav}
            </h2>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/" className="hover:text-[#5a9bc4] transition-colors">
                  {t.footer.navHome}
                </Link>
              </li>
              <li>
                <Link href="/who-we-are" className="hover:text-[#5a9bc4] transition-colors">
                  {t.footer.navAbout}
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[#5a9bc4] transition-colors">
                  {t.footer.navProjects}
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-[#5a9bc4] transition-colors">
                  {t.footer.navNews}
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="hover:text-[#5a9bc4] transition-colors">
                  {t.footer.navContacts}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts & Donate */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white tracking-wide">
              {t.footer.colContacts}
            </h2>
            <div className="space-y-2 text-sm text-slate-300">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#5a9bc4]" />
                <span>{t.footer.phoneLabel}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#5a9bc4]" />
                <span>{t.footer.emailLabel}</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#5a9bc4] shrink-0 mt-1" />
                <span>{t.footer.addressLabel}</span>
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={openDonation}
                className="w-full flex items-center justify-center gap-2 bg-[#3b7da5] hover:bg-[#4a90be] text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-md"
              >
                <Heart className="w-4 h-4 text-rose-300" />
                <span>{t.footer.supportBtn}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright (with hidden 5-click easter egg admin trigger) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p
            onClick={handleSecretCopyrightClick}
            className="select-none cursor-pointer hover:text-slate-300 transition-colors touch-manipulation active:scale-[0.99]"
            title="MAP NGO"
          >
            © {new Date().getFullYear()} MAP Association for Youth Development and Social Integration. {t.footer.copyright}
          </p>

          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-slate-200 transition-colors">
              {t.footer.privacy}
            </Link>
            <span className="text-white/20">•</span>
            <Link
              href="/admin"
              className="text-slate-400 hover:text-slate-200 transition-colors"
              title="Адміністративна панель"
            >
              Адмін
            </Link>
            <span className="text-white/20">•</span>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
