'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAdmin } from '../context/AdminContext';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeSwitcherProps {
  compact?: boolean;
  className?: string;
}

export default function ThemeSwitcher({ compact = false, className = '' }: ThemeSwitcherProps) {
  const { themeMode, resolvedTheme, setThemeMode, isMounted } = useTheme();
  const { language } = useAdmin();

  // Translations for tooltips
  const labels = {
    light: language === 'ua' ? 'Світла тема' : 'Light theme',
    dark: language === 'ua' ? 'Темна тема' : 'Dark theme',
    system: language === 'ua' ? 'Автоматично (як у системі)' : 'Auto (System preference)',
  };

  if (!isMounted) {
    return (
      <div className={`flex items-center rounded-full p-1 border border-white/15 bg-white/5 h-8 w-24 ${className}`} />
    );
  }

  return (
    <div
      className={`inline-flex items-center rounded-full p-1 border border-white/15 bg-[#0e2238] shadow-xs transition-colors theme-switcher-container ${className}`}
      role="group"
      aria-label="Theme switcher"
    >
      <button
        type="button"
        onClick={() => setThemeMode('light')}
        className={`relative p-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center justify-center ${
          themeMode === 'light'
            ? 'bg-[#3b7da5] text-white shadow-xs scale-105'
            : 'text-slate-400 hover:text-white hover:bg-white/10'
        }`}
        title={labels.light}
        aria-label={labels.light}
      >
        <Sun className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => setThemeMode('dark')}
        className={`relative p-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center justify-center ${
          themeMode === 'dark'
            ? 'bg-[#3b7da5] text-white shadow-xs scale-105'
            : 'text-slate-400 hover:text-white hover:bg-white/10'
        }`}
        title={labels.dark}
        aria-label={labels.dark}
      >
        <Moon className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => setThemeMode('system')}
        className={`relative p-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center justify-center ${
          themeMode === 'system'
            ? 'bg-[#3b7da5] text-white shadow-xs scale-105'
            : 'text-slate-400 hover:text-white hover:bg-white/10'
        }`}
        title={labels.system}
        aria-label={labels.system}
      >
        <Monitor className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
