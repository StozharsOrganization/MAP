'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Щось пішло не так</h2>
          <p className="text-slate-400 text-sm">
            Виникла непередбачена помилка. Спробуйте перезавантажити сторінку або поверніться на головну.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#3b7da5] hover:bg-[#4a90be] text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Спробувати ще раз
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl text-sm font-semibold transition-colors"
          >
            <Home className="w-4 h-4" />
            На головну
          </Link>
        </div>
      </div>
    </div>
  );
}
