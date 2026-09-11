'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useTranslation } from '../../lib/translations';
import { formatMoney } from '../../lib/utils';
import {
  X,
  Heart,
  CheckCircle,
  CreditCard,
  Landmark,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Repeat,
  Loader2,
  Target,
  Layers,
  User,
  Mail
} from 'lucide-react';

interface ProjectOption {
  id: string;
  slug?: string;
  title: string;
  raisedAmount?: number;
  goalAmount?: number;
}

export default function DonationModal() {
  const { isDonationOpen, closeDonation, donationProjectId } = useAdmin();
  const { t } = useTranslation();

  const [frequency, setFrequency] = useState<'once' | 'monthly'>('once');
  const [amount, setAmount] = useState('500');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mono' | 'card' | 'iban'>('mono');
  const [copiedIban, setCopiedIban] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Project selection
  const [selectedProject, setSelectedProject] = useState<string>('general');
  const [projectsList, setProjectsList] = useState<ProjectOption[]>([
    { id: 'proj-1', title: 'Академія молодіжного лідерства', raisedAmount: 75000, goalAmount: 100000 },
    { id: 'proj-2', title: 'Хаб соціальної інтеграції', raisedAmount: 120000, goalAmount: 120000 },
    { id: 'proj-3', title: 'Лабораторія цифрових навичок', raisedAmount: 90000, goalAmount: 90000 },
  ]);

  // Donor Details
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  // Sync project selection whenever modal opens or donationProjectId changes
  useEffect(() => {
    if (isDonationOpen) {
      if (donationProjectId) {
        setSelectedProject(donationProjectId);
      } else {
        setSelectedProject('general');
      }

      fetch('/api/projects')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
            setProjectsList(data.projects);
          }
        })
        .catch((err) => console.warn('Could not fetch projects list:', err));
    }
  }, [isDonationOpen, donationProjectId]);

  if (!isDonationOpen) return null;

  const currentSumNum = parseInt(customAmount || amount, 10) || 0;
  const currentSumStr = customAmount || amount;

  // Active targeted project info if any
  const targetedProject = selectedProject !== 'general'
    ? projectsList.find((p) => p.id === selectedProject || p.slug === selectedProject)
    : null;

  // Social Impact Tier Calculator
  const getImpactDescription = (sum: number) => {
    if (sum < 200) {
      return '☕ Кава-брейк і роздаткові матеріали для 2 учасників клубу адаптації молоді ВПО.';
    }
    if (sum < 500) {
      return '📚 Набір навчальних зошитів та канцелярії для воркшопу з проєктного менеджменту.';
    }
    if (sum < 1000) {
      return '🗣️ Один місяць роботи розмовного клубу англійської мови для 15 студентів.';
    }
    if (sum < 2000) {
      return '🧠 Індивідуальна сесія психологічної підтримки та арт-терапії для підлітків із прифронтових громад.';
    }
    if (sum < 4000) {
      return '🎒 Повне забезпечення проживання та харчування 1 волонтера на молодіжному обміні Erasmus+.';
    }
    return '🚀 Організація комплексного виїзного тренінгу з лідерства та прав людини для 25 активістів громади.';
  };

  const handleCopyIban = () => {
    navigator.clipboard.writeText('UA823052990000026001234567890');
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2500);
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSumNum <= 0) return;

    setIsSubmitting(true);
    try {
      const projId = selectedProject !== 'general' ? selectedProject : undefined;
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: projId,
          amount: currentSumNum,
          frequency,
          paymentMethod,
          donorName: isAnonymous ? 'Анонімний благодійник' : (donorName.trim() || 'Благодійник'),
          donorEmail: donorEmail.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Real-time reactive update event for all project cards on screen
        window.dispatchEvent(
          new CustomEvent('map:donation', {
            detail: {
              projectId: projId,
              amount: currentSumNum,
              newRaisedAmount: data.newRaisedAmount,
              project: data.project,
            },
          })
        );

        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          closeDonation();
        }, 3000);
      } else {
        alert(data.error || 'Помилка обробки донату');
      }
    } catch (err) {
      console.error('Donation error:', err);
      alert('Не вдалося з`єднатися із сервером. Спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#0e2238] rounded-3xl shadow-2xl border border-white/15 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 text-white max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0e2238] via-[#13304f] to-[#18426d] text-white p-6 relative border-b border-white/10 shrink-0">
          <button
            onClick={closeDonation}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-400/30" />
            <span className="text-xs uppercase tracking-wider font-bold text-sky-200">
              Підтримка молодіжних ініціатив MAP
            </span>
          </div>
          <h3 className="text-xl font-bold">Зробити благодійний внесок</h3>
          <p className="text-xs text-slate-300 mt-1">
            Кожна гривня зараховується в базу даних та спрямовується на обраний вами напрямок.
          </p>

          {/* Once vs Monthly Tabs */}
          <div className="mt-4 flex items-center bg-[#081626]/80 p-1 rounded-xl border border-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFrequency('once')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                frequency === 'once'
                  ? 'bg-[#3b7da5] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Разовий внесок</span>
            </button>
            <button
              type="button"
              onClick={() => setFrequency('monthly')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                frequency === 'monthly'
                  ? 'bg-[#3b7da5] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Repeat className="w-3.5 h-3.5 text-amber-300" />
              <span>Щомісячна підтримка</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-5 text-sm">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-xl font-bold text-white">Щиро дякуємо за вашу підтримку!</h4>
              <p className="text-sm text-slate-300 max-w-sm mx-auto">
                Ваш внесок <strong className="text-white font-bold">{currentSumStr} ₴</strong> успішно зараховано
                {targetedProject ? (
                  <span> на проєкт <strong className="text-sky-300">«{targetedProject.title}»</strong></span>
                ) : (
                  <span> на <strong className="text-sky-300">загальну діяльність організації MAP</strong></span>
                )}.
              </p>
              <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-xs text-emerald-300">
                Дані про збір оновлено в базі даних у реальному часі.
              </div>
              <div className="pt-2 text-xs text-slate-400">
                Звітність про використання коштів доступна на сторінці «Прозорість та звітність».
              </div>
            </div>
          ) : (
            <form onSubmit={handleDonate} className="space-y-4">
              
              {/* Project Target Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-sky-400" />
                  <span>Куди спрямувати ваш внесок:</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#081626] text-white text-xs font-medium focus:ring-2 focus:ring-sky-400 focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="general" className="bg-[#081626] text-white">
                      🌟 Загальна діяльність ГО «МАР» (усі напрямки)
                    </option>
                    {projectsList.map((p) => (
                      <option key={p.id} value={p.id} className="bg-[#081626] text-white">
                        🎯 {p.title} {p.goalAmount ? `(Збір: ${formatMoney(p.raisedAmount || 0)} / ${formatMoney(p.goalAmount)} ₴)` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Progress bar preview if specific project selected */}
                {targetedProject && targetedProject.goalAmount && (
                  <div className="mt-2.5 p-2.5 bg-[#081626]/70 rounded-xl border border-white/10 space-y-1.5">
                    <div className="flex justify-between text-[11px] text-slate-300">
                      <span>Поточний збір: <strong className="text-white">{formatMoney(targetedProject.raisedAmount || 0)} ₴</strong></span>
                      <span>Ціль: <strong className="text-sky-300">{formatMoney(targetedProject.goalAmount)} ₴</strong></span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#3b7da5] to-emerald-400 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, Math.round(((targetedProject.raisedAmount || 0) / targetedProject.goalAmount) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Amount Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Оберіть суму допомоги:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['150', '500', '1000', '2500'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setAmount(val);
                        setCustomAmount('');
                      }}
                      className={`py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                        amount === val && !customAmount
                          ? 'bg-[#3b7da5] text-white shadow-md ring-2 ring-sky-300'
                          : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {val} ₴
                    </button>
                  ))}
                </div>
                <div className="mt-2.5">
                  <input
                    type="number"
                    min="10"
                    placeholder="Або введіть іншу суму (₴)..."
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount('');
                    }}
                    className="w-full px-4 py-2 text-sm rounded-xl border border-white/15 bg-[#081626] text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Social Impact Card */}
              <div className="p-3 bg-sky-950/40 rounded-2xl border border-sky-500/30 text-xs text-sky-200 flex items-start gap-2.5 animate-in fade-in">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sky-100 mb-0.5">Соціальний вплив вашого внеску:</span>
                  <span className="leading-relaxed">{getImpactDescription(currentSumNum)}</span>
                </div>
              </div>

              {/* Donor info (Optional / Anonymous) */}
              <div className="space-y-2 pt-1 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Інформація про благодійника:</label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-white/20 bg-[#081626] text-sky-500 focus:ring-sky-400 cursor-pointer"
                    />
                    <span>Анонімно</span>
                  </label>
                </div>

                {!isAnonymous && (
                  <div className="grid grid-cols-2 gap-2 animate-in fade-in">
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Ваше ім'я"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-white/15 bg-[#081626] text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-400"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="Email для звіту"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-white/15 bg-[#081626] text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Спосіб оплати:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mono')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer text-center ${
                      paymentMethod === 'mono'
                        ? 'border-sky-400 bg-[#143254] ring-2 ring-sky-400 text-white'
                        : 'border-white/15 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="font-black text-xs text-white">monobank</span>
                    <span className="text-[10px] text-amber-300 font-semibold">Демо-затичка</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer text-center ${
                      paymentMethod === 'card'
                        ? 'border-sky-400 bg-[#143254] ring-2 ring-sky-400 text-white'
                        : 'border-white/15 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-slate-300" />
                    <span className="text-[10px] text-slate-400">Картка онлайн</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('iban')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer text-center ${
                      paymentMethod === 'iban'
                        ? 'border-sky-400 bg-[#143254] ring-2 ring-sky-400 text-white'
                        : 'border-white/15 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <Landmark className="w-4 h-4 text-slate-300" />
                    <span className="text-[10px] text-slate-400">Реквізити IBAN</span>
                  </button>
                </div>
              </div>

              {/* Monobank Stub / Demo Box */}
              {paymentMethod === 'mono' && (
                <div className="p-3.5 bg-gradient-to-br from-[#12283e] to-[#0a1828] rounded-2xl border border-sky-400/30 text-xs text-slate-300 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-bold text-white text-xs">Затичка Monobank (симуляція)</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-semibold">
                      Тестовий режим
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Зовнішній перехід на реальну банку вимкнено. При натисканні кнопки нижче внесок <strong>{currentSumStr || '500'} ₴</strong> миттєво зберігається в базу даних MAP та динамічно оновлює прогрес збору проєкту на екрані.
                  </p>
                </div>
              )}

              {/* Card Demo Box */}
              {paymentMethod === 'card' && (
                <div className="p-3 bg-gradient-to-br from-[#12283e] to-[#0a1828] rounded-2xl border border-sky-400/30 text-xs text-slate-300 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">Тестова банківська картка</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold">
                      Демо
                    </span>
                  </div>
                  <div className="bg-[#081626] p-2 rounded-xl border border-white/10 font-mono text-slate-300 text-xs flex justify-between items-center">
                    <span>4441 •••• •••• 9876</span>
                    <span className="text-slate-400 text-[11px]">12/28</span>
                  </div>
                </div>
              )}

              {/* IBAN Box */}
              {paymentMethod === 'iban' && (
                <div className="p-3.5 bg-[#081626] rounded-2xl border border-white/15 text-xs text-slate-300 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span><strong>Одержувач:</strong> ГО «МАР»</span>
                    <span className="text-slate-400">ЄДРПОУ: 43210987</span>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Номер рахунку IBAN:</label>
                    <div className="flex items-center justify-between bg-black/40 px-3 py-2 rounded-xl border border-white/10 font-mono text-sky-300 text-xs">
                      <span>UA823052990000026001234567890</span>
                      <button
                        type="button"
                        onClick={handleCopyIban}
                        className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 transition-colors ml-2 cursor-pointer font-sans"
                      >
                        {copiedIban ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Скопійовано!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Копіювати</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    <strong>Призначення:</strong> Благодійний внесок {targetedProject ? `на проєкт "${targetedProject.title}"` : 'на статутну діяльність'}
                  </p>
                </div>
              )}

              {/* Security guarantee */}
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-[#081626] p-2.5 rounded-xl border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Офіційна реєстрація неприбуткової організації. Захищене з'єднання.</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#3b7da5] hover:bg-[#4a90be] disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Збереження внеску в базі...</span>
                  </>
                ) : (
                  <span>Підтвердити внесок {currentSumStr || '500'} ₴ (Тестова оплата)</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
