'use client';

import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Shield, Lock, User, Eye, EyeOff, X, AlertCircle, Loader2, KeyRound, CheckCircle2 } from 'lucide-react';

export default function AdminLoginModal() {
  const { isAdminLoginOpen, closeAdminLogin, setIsAdmin, setCurrentUser } = useAdmin();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAdminLoginOpen) return null;

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
        closeAdminLogin();
      } else {
        setError(data.error || 'Невірний логін або пароль');
      }
    } catch (err: any) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#0e2238] rounded-3xl shadow-2xl border border-white/15 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 text-white max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0e2238] via-[#122e4d] to-[#1a446c] text-white p-6 relative border-b border-white/10">
          <button
            onClick={closeAdminLogin}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <KeyRound className="w-5 h-5 text-amber-300" />
            <span className="text-xs uppercase tracking-wider font-bold text-amber-200">
              Службовий вхід MAP
            </span>
          </div>
          <h3 className="text-xl font-bold">Авторизація та рівні доступу</h3>
          <p className="text-xs text-slate-300 mt-1">
            Введіть логін та пароль свого облікового запису відповідно до вашої ролі в організації.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
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
                autoFocus
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

          {/* Role selector / Demo presets */}
          <div className="pt-1 space-y-2">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Швидкий вибір ролі (демо-доступи):
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
                <span className="font-bold block text-xs">👑 Адмін</span>
                <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">Повний доступ</span>
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
                <span className="font-bold block text-xs">✍️ Редактор</span>
                <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">Контент сайту</span>
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
                <span className="font-bold block text-xs">🤝 Координатор</span>
                <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">Заявки ВПО</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={closeAdminLogin}
              className="flex-1 py-2.5 text-xs font-semibold rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-[#3b7da5] hover:bg-[#4a90be] text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Перевірка...</span>
                </>
              ) : (
                <span>Увійти в систему</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
