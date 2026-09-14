import Link from 'next/link';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative">
          <span className="text-8xl font-black text-[#3b7da5]/20">404</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-12 h-12 text-[#3b7da5]" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Сторінку не знайдено</h1>
          <p className="text-slate-400 text-sm">
            Ця сторінка не існує або була переміщена. Перевірте правильність посилання або поверніться на головну.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#3b7da5] hover:bg-[#4a90be] text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Home className="w-4 h-4" />
            На головну
          </Link>
          <Link
            href="/news"
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Новини
          </Link>
        </div>
      </div>
    </div>
  );
}
