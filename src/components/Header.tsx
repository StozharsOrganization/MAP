'use client';

import React from 'react';
import { stripLocale } from '../lib/i18n';
import Link from './LocaleLink';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAdmin } from '../context/AdminContext';
import { Heart, Shield, Menu, X, Globe, LogOut } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header() {
  const pathname = usePathname();
  const { isAdmin, toggleAdmin, openDonation, language, setLanguage } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { href: '/', label: language === 'ua' ? 'Головна' : 'Home' },
    { href: '/who-we-are', label: language === 'ua' ? 'Про нас' : 'Who we are' },
    { href: '/projects', label: language === 'ua' ? 'Програми' : 'Programs' },
    { href: '/news', label: language === 'ua' ? 'Новини' : 'News' },
    { href: '/contacts', label: language === 'ua' ? 'Контакти' : 'Contacts' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#081626]/90 backdrop-blur-md border-b border-white/10 shadow-md shadow-black/20">
      {/* Main navigation container (Single Clean Header) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group" aria-label="MAP NGO">
          <div className="relative h-11 w-32 sm:h-12 sm:w-36 bg-white rounded-xl px-2.5 py-1.5 shadow-sm border border-white/20 transition-all duration-200 group-hover:scale-105 group-hover:shadow-md">
            <Image
              src="/logo.png"
              alt="MAP - Association for Youth Development and Social Integration"
              fill
              sizes="(max-width: 768px) 130px, 150px"
              className="object-contain p-0.5"
              priority
            />
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = stripLocale(pathname || '/') === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'text-white bg-white/10 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#3b7da5] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Theme Switcher, Language Switcher, Donate Button & Admin Mode */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          
          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Language Switcher */}
          <div className="flex items-center bg-[#0e2238] rounded-full p-1 border border-white/15 shadow-xs">
            <button
              onClick={() => setLanguage('ua')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                language === 'ua'
                  ? 'bg-[#3b7da5] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Українська мова"
            >
              UA
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#3b7da5] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="English language"
            >
              EN
            </button>
          </div>

          {/* Support / Donate Button */}
          <button
            onClick={openDonation}
            className="flex items-center gap-2 bg-[#3b7da5] hover:bg-[#4a90be] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <Heart className="w-3.5 h-3.5 text-rose-300 group-hover:scale-110 transition-transform" />
            <span>{language === 'ua' ? 'Підтримати' : 'Support'}</span>
          </button>

          {/* Admin badge / toggle if logged in */}
          {isAdmin && (
            <button
              onClick={toggleAdmin}
              className="flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-950 border border-amber-500/40 px-3 py-2 rounded-full shadow-xs transition-all cursor-pointer"
              title="Вийти з режиму адміністратора"
            >
              <LogOut className="w-3.5 h-3.5 text-amber-400" />
              <span>Адмін (Вихід)</span>
            </button>
          )}
        </div>

        {/* Mobile menu hamburger button */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Mobile Theme Switcher */}
          <ThemeSwitcher />

          {/* Mobile Language Switcher */}
          <div className="flex items-center bg-[#0e2238] rounded-full p-0.5 border border-white/15 text-[11px] font-bold">
            <button
              onClick={() => setLanguage('ua')}
              className={`px-2 py-0.5 rounded-full ${language === 'ua' ? 'bg-[#3b7da5] text-white shadow-xs' : 'text-slate-400'}`}
            >
              UA
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded-full ${language === 'en' ? 'bg-[#3b7da5] text-white shadow-xs' : 'text-slate-400'}`}
            >
              EN
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#081626] px-4 pt-2 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const isActive = stripLocale(pathname || '/') === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 text-base font-semibold rounded-lg ${
                  isActive
                    ? 'text-white bg-white/10 font-bold'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openDonation();
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#3b7da5] hover:bg-[#4a90be] text-white text-sm font-semibold py-3 rounded-full"
            >
              <Heart className="w-4 h-4 text-rose-300" />
              <span>{language === 'ua' ? 'Підтримати проєкти MAP' : 'Support MAP projects'}</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  toggleAdmin();
                }}
                className="w-full flex items-center justify-center gap-2 bg-amber-950/60 text-amber-300 text-xs font-semibold py-2.5 rounded-xl border border-amber-500/30"
              >
                <LogOut className="w-3.5 h-3.5 text-amber-400" />
                <span>Вийти з адмін-режиму</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
