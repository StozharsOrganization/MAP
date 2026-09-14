export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative w-12 h-12 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-[#3b7da5]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#3b7da5] animate-spin" />
        </div>
        <p className="text-slate-400 text-sm animate-pulse">Завантаження...</p>
      </div>
    </div>
  );
}
