'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isMounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');
  const [isMounted, setIsMounted] = useState(false);

  const applyTheme = (resolved: ResolvedTheme) => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    root.style.colorScheme = resolved;
  };

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('map_theme') as ThemeMode | null;
    const mode = saved && ['system', 'light', 'dark'].includes(saved) ? saved : 'system';
    setThemeModeState(mode);

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const computeResolved = (m: ThemeMode): ResolvedTheme => {
      if (m === 'light') return 'light';
      if (m === 'dark') return 'dark';
      return mql.matches ? 'dark' : 'light';
    };

    const initialResolved = computeResolved(mode);
    setResolvedTheme(initialResolved);
    applyTheme(initialResolved);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      const currentSaved = localStorage.getItem('map_theme') as ThemeMode | null;
      const currentMode = currentSaved && ['system', 'light', 'dark'].includes(currentSaved) ? currentSaved : 'system';
      if (currentMode === 'system') {
        const nextResolved: ResolvedTheme = e.matches ? 'dark' : 'light';
        setResolvedTheme(nextResolved);
        applyTheme(nextResolved);
      }
    };

    mql.addEventListener('change', handleMediaChange);
    return () => mql.removeEventListener('change', handleMediaChange);
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('map_theme', mode);

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const nextResolved: ResolvedTheme =
      mode === 'light' ? 'light' : mode === 'dark' ? 'dark' : mql.matches ? 'dark' : 'light';

    setResolvedTheme(nextResolved);
    applyTheme(nextResolved);
  };

  const toggleTheme = () => {
    if (resolvedTheme === 'dark') {
      setThemeMode('light');
    } else {
      setThemeMode('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ themeMode, resolvedTheme, setThemeMode, toggleTheme, isMounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
