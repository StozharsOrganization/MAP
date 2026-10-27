'use client';

import React, { useState } from 'react';
import Link from '../../../components/LocaleLink';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../../../context/AdminContext';
import { Shield, Lock, User, Eye, EyeOff, KeyRound, AlertCircle, ArrowLeft, LogOut, CheckCircle2 } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { isAdmin, setIsAdmin, currentUser, setCurrentUser, toggleAdmin } = useAdmin();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        setIsAdmin(true);
        setCurrentUser(data.user);
        setPassword('');
        router.push('/');
      } else {
        setError(data.error || 'Невірний логін або пароль');
      }
    } catch {
      setError('Не вдалося підключитися до сервера. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError(null);
  };

  if (isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-[#081626]">
        <div className="w-full max-w-md bg-[#0e2238] rounded-3xl border border-white/15 p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Ви авторизовані в адмінці</h1>
            <p className="text-sm text-slate-300 mt-1">
              Користувач: <span className="font-bold text-sky-400">{currentUser?.username || 'admin'}</span> ({currentUser?.name || 'Адміністратор'})
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="w-full py-3 px-4 rounded-xl bg-[#3b7da5] hover:bg-[#4a90be] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Перейти на головну</span>
            </Link>
            <button
              onClick={toggleAdmin}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Вийти з адмін-панелі</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-[#081626]">
      <div className="w-full max-w-md bg-[#0e2238] rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col text-white">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0e2238] via-[#122e4d] to-[#1a446c] p-6 relative border-b border-white/10">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>На головну</span>
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <KeyRound className="w-5 h-5 text-amber-300" />
            <span className="text-xs uppercase tracking-wider font-bold text-amber-200">
              Службовий вхід MAP
            </span>
          </div>
          <h1 className="text-xl font-bold">Вхід в панель управління</h1>
          <p className="text-xs text-slate-300 mt-1">
            Введіть логін та пароль свого облікового запису
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs animate-in shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Логін користувача:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin, editor або coordinator..."
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-white/15 bg-[#081626] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Пароль доступу:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введіть пароль..."
                required
                className="w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border border-white/15 bg-[#081626] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Demo presets */}
          <div className="pt-1 space-y-2">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Швидкий вибір:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials('admin', 'map_admin_2026!')}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                  username === 'admin'
                    ? 'border-amber-400 bg-amber-950/30 text-amber-200 ring-1 ring-amber-400'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="text-[11px] font-bold">Admin</div>
                <div className="text-[9px] text-slate-400">Повний</div>
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('editor', 'editor_2026!')}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                  username === 'editor'
                    ? 'border-sky-400 bg-sky-950/30 text-sky-200 ring-1 ring-sky-400'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="text-[11px] font-bold">Editor</div>
                <div className="text-[9px] text-slate-400">Контент</div>
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('coordinator', 'coord_2026!')}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                  username === 'coordinator'
                    ? 'border-emerald-400 bg-emerald-950/30 text-emerald-200 ring-1 ring-emerald-400'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="text-[11px] font-bold">Coord</div>
                <div className="text-[9px] text-slate-400">Волонтери</div>
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#3b7da5] to-[#2563eb] hover:from-[#4a90be] hover:to-[#3b82f6] text-white font-bold text-sm shadow-lg hover:shadow-sky-500/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Перевірка доступу...' : 'Увійти в систему'}
          </button>
        </form>
      </div>
    </div>
  );
}
