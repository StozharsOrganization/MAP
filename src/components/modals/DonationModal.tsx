'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useL, getTranslatedProject } from '../../lib/translations';
import { formatMoney } from '../../lib/utils';
import type { ProjectItem } from '../../lib/types';
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
  Repeat,
  Loader2,
  Target,
  User,
  Mail,
  Lock,
  Smartphone,
  AlertCircle,
  ArrowLeft,
  Receipt,
} from 'lucide-react';

interface ProjectOption {
  id: string;
  slug?: string;
  title: string;
  raisedAmount?: number;
  goalAmount?: number;
}

type Step = 'form' | 'card' | 'otp' | 'mono' | 'processing' | 'success' | 'failed' | 'iban-done';

interface ReceiptInfo {
  id: string;
  date: string;
  amount: number;
  method: string;
}

const IBAN = 'UA823052990000026001234567890';
const DECLINED_CARD = '4000000000000002';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function luhnValid(num: string): boolean {
  let sum = 0;
  let dbl = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = Number(num[i]);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return num.length >= 13 && sum % 10 === 0;
}

function cardBrand(num: string): string {
  if (/^4/.test(num)) return 'VISA';
  if (/^(5[1-5]|2[2-7])/.test(num)) return 'Mastercard';
  if (/^9804/.test(num)) return 'ПРОСТІР';
  return '';
}

export default function DonationModal() {
  const { isDonationOpen, closeDonation, donationProjectId, language } = useAdmin();
  const L = useL();

  const [frequency, setFrequency] = useState<'once' | 'monthly'>('once');
  const [amount, setAmount] = useState('500');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mono' | 'card' | 'iban'>('mono');
  const [copiedIban, setCopiedIban] = useState(false);
  const [step, setStep] = useState<Step>('form');
  const [processingStage, setProcessingStage] = useState(0);
  const [errorText, setErrorText] = useState('');
  const [receipt, setReceipt] = useState<ReceiptInfo | null>(null);

  // Card form
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
  const [otp, setOtp] = useState('');

  // Project selection
  const [selectedProject, setSelectedProject] = useState<string>('general');
  const [projectsList, setProjectsList] = useState<ProjectOption[]>([
    { id: 'proj-1', slug: 'youth-leadership-academy', title: 'Академія молодіжного лідерства', raisedAmount: 75000, goalAmount: 100000 },
    { id: 'proj-2', slug: 'social-integration-hub', title: 'Хаб соціальної інтеграції', raisedAmount: 120000, goalAmount: 120000 },
    { id: 'proj-3', slug: 'digital-skills-lab', title: 'Лабораторія цифрових навичок', raisedAmount: 90000, goalAmount: 90000 },
  ]);

  // Donor Details
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  const cancelledRef = useRef(false);

  useEffect(() => {
    if (isDonationOpen) {
      cancelledRef.current = false;
      setSelectedProject(donationProjectId || 'general');
      setStep('form');
      setReceipt(null);
      setErrorText('');
      setOtp('');
      setCardErrors({});

      fetch('/api/projects')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
            setProjectsList(data.projects);
          }
        })
        .catch((err) => console.warn('Could not fetch projects list:', err));
    } else {
      cancelledRef.current = true;
    }
  }, [isDonationOpen, donationProjectId]);

  if (!isDonationOpen) return null;

  const currentSumNum = parseInt(customAmount || amount, 10) || 0;
  const sumLabel = `${formatMoney(currentSumNum)} ₴`;

  const projTitle = (p: ProjectOption) =>
    getTranslatedProject(p as unknown as ProjectItem, language).title || p.title;

  const targetedProject = selectedProject !== 'general'
    ? projectsList.find((p) => p.id === selectedProject || p.slug === selectedProject)
    : null;

  const getImpactDescription = (sum: number) => {
    if (sum < 200) return L('☕ Кава-брейк і роздаткові матеріали для 2 учасників клубу адаптації молоді ВПО.', '☕ A coffee break and handouts for 2 participants of the IDP youth adaptation club.');
    if (sum < 500) return L('📚 Набір навчальних зошитів та канцелярії для воркшопу з проєктного менеджменту.', '📚 Notebooks and stationery for a project-management workshop.');
    if (sum < 1000) return L('🗣️ Один місяць роботи розмовного клубу англійської мови для 15 студентів.', '🗣️ One month of an English conversation club for 15 students.');
    if (sum < 2000) return L('🧠 Індивідуальна сесія психологічної підтримки та арт-терапії для підлітків із прифронтових громад.', '🧠 A one-on-one psychological support and art-therapy session for teenagers from frontline communities.');
    if (sum < 4000) return L('🎒 Повне забезпечення проживання та харчування 1 волонтера на молодіжному обміні Erasmus+.', '🎒 Full accommodation and meals for 1 volunteer at an Erasmus+ youth exchange.');
    return L('🚀 Організація комплексного виїзного тренінгу з лідерства та прав людини для 25 активістів громади.', '🚀 A full off-site leadership and human-rights training for 25 community activists.');
  };

  const handleCopyIban = () => {
    navigator.clipboard.writeText(IBAN);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2500);
  };

  const methodLabel = () => {
    if (paymentMethod === 'mono') return 'monobank';
    const digits = cardNumber.replace(/\D/g, '');
    return `${cardBrand(digits) || L('Картка', 'Card')} •••• ${digits.slice(-4)}`;
  };

  // ---- Step 1: main form submit ----
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSumNum < 10) {
      setErrorText(L('Мінімальна сума внеску — 10 ₴', 'The minimum donation is 10 ₴'));
      return;
    }
    if (!isAnonymous && donorEmail && !/^\S+@\S+\.\S+$/.test(donorEmail)) {
      setErrorText(L('Перевірте правильність email', 'Please check your email address'));
      return;
    }
    setErrorText('');
    if (paymentMethod === 'iban') {
      setStep('iban-done');
    } else if (paymentMethod === 'card') {
      setStep('card');
    } else {
      runMonoFlow();
    }
  };

  // ---- Record payment on the server (stub provider records it as completed) ----
  const finalizePayment = async () => {
    const projId = selectedProject !== 'general' ? selectedProject : undefined;
    const res = await fetch('/api/payments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: projId,
        projectTitle: targetedProject?.title,
        amount: currentSumNum,
        frequency,
        paymentMethod,
        donorName: isAnonymous ? 'Анонімний благодійник' : (donorName.trim() || 'Благодійник'),
        donorEmail: donorEmail.trim() || undefined,
      }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'payment_failed');

    if (data.checkoutUrl) {
      window.location.assign(data.checkoutUrl);
      return;
    }

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

    const rawId: string = data.donation?.id || crypto.randomUUID();
    setReceipt({
      id: `MAP-${rawId.replace(/-/g, '').slice(0, 10).toUpperCase()}`,
      date: new Date().toLocaleString(language === 'en' ? 'en-GB' : 'uk-UA'),
      amount: currentSumNum,
      method: methodLabel(),
    });
    setStep('success');
  };

  const runProcessing = async () => {
    setStep('processing');
    for (let i = 0; i < 3; i++) {
      setProcessingStage(i);
      await sleep(800 + i * 300);
      if (cancelledRef.current) return;
    }
    try {
      await finalizePayment();
    } catch (err) {
      console.error('Donation error:', err);
      setErrorText(L('Банк не зміг обробити платіж. Кошти не списано. Спробуйте ще раз.', 'The bank could not process the payment. You have not been charged. Please try again.'));
      setStep('failed');
    }
  };

  // ---- monobank flow ----
  const runMonoFlow = async () => {
    setStep('mono');
    await sleep(3500);
    if (cancelledRef.current) return;
    await runProcessing();
  };

  // ---- Card flow ----
  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = cardNumber.replace(/\D/g, '');
    const errs: Record<string, string> = {};
    if (!luhnValid(digits)) errs.number = L('Невірний номер картки', 'Invalid card number');

    const m = cardExpiry.match(/^(\d{2})\/(\d{2})$/);
    if (!m) {
      errs.expiry = L('Формат ММ/РР', 'Format MM/YY');
    } else {
      const mm = Number(m[1]);
      const yy = 2000 + Number(m[2]);
      const now = new Date();
      const expired = yy < now.getFullYear() || (yy === now.getFullYear() && mm < now.getMonth() + 1);
      if (mm < 1 || mm > 12) errs.expiry = L('Невірний місяць', 'Invalid month');
      else if (expired) errs.expiry = L('Термін дії картки минув', 'Card has expired');
    }
    if (!/^\d{3}$/.test(cardCvv)) errs.cvv = L('3 цифри', '3 digits');

    setCardErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setOtp('');
    setStep('otp');
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4,6}$/.test(otp)) {
      setErrorText(L('Введіть код із SMS', 'Enter the code from the SMS'));
      return;
    }
    setErrorText('');
    const digits = cardNumber.replace(/\D/g, '');
    if (digits === DECLINED_CARD) {
      setStep('processing');
      for (let i = 0; i < 2; i++) {
        setProcessingStage(i);
        await sleep(800);
      }
      setErrorText(L('Платіж відхилено банком-емітентом (недостатньо коштів). Кошти не списано.', 'Payment declined by the issuing bank (insufficient funds). You have not been charged.'));
      setStep('failed');
      return;
    }
    await runProcessing();
  };

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const processingStages = [
    L('З’єднання з банком…', 'Connecting to the bank…'),
    L('Авторизація платежу…', 'Authorising payment…'),
    L('Підтвердження транзакції…', 'Confirming transaction…'),
  ];

  const locked = step === 'processing' || step === 'mono';
  const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border bg-[#081626] text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-400 focus:outline-none font-mono text-sm';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#0e2238] rounded-3xl shadow-2xl border border-white/15 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 text-white max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0e2238] via-[#13304f] to-[#18426d] text-white p-6 relative border-b border-white/10 shrink-0">
          {!locked && (
            <button
              onClick={closeDonation}
              aria-label={L('Закрити', 'Close')}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-400/30" />
            <span className="text-xs uppercase tracking-wider font-bold text-sky-200">
              {L('Підтримка молодіжних ініціатив MAP', 'Support MAP youth initiatives')}
            </span>
          </div>
          <h3 className="text-xl font-bold">{L('Зробити благодійний внесок', 'Make a donation')}</h3>
          <p className="text-xs text-slate-300 mt-1">
            {L('Кожна гривня спрямовується на обраний вами напрямок.', 'Every hryvnia goes to the cause you choose.')}
          </p>

          {step === 'form' && (
            <div className="mt-4 flex items-center bg-[#081626]/80 p-1 rounded-xl border border-white/10 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFrequency('once')}
                className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  frequency === 'once' ? 'bg-[#3b7da5] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{L('Разовий внесок', 'One-time')}</span>
              </button>
              <button
                type="button"
                onClick={() => setFrequency('monthly')}
                className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  frequency === 'monthly' ? 'bg-[#3b7da5] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Repeat className="w-3.5 h-3.5 text-amber-300" />
                <span>{L('Щомісячна підтримка', 'Monthly')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-5 text-sm">
          {/* ---------------- SUCCESS ---------------- */}
          {step === 'success' && receipt && (
            <div className="py-4 text-center space-y-4 animate-in fade-in">
              <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto" />
              <h4 className="text-xl font-bold text-white">{L('Оплата успішна. Дякуємо!', 'Payment successful. Thank you!')}</h4>
              <p className="text-sm text-slate-300 max-w-sm mx-auto">
                {L('Ваш внесок', 'Your donation of')} <strong className="text-sky-300 font-bold">{sumLabel}</strong>{' '}
                {targetedProject ? (
                  <>{L('зараховано на проєкт', 'has been credited to')} <strong className="text-sky-300">«{projTitle(targetedProject)}»</strong></>
                ) : (
                  <>{L('зараховано на', 'has been credited to')} <strong className="text-sky-300">{L('загальну діяльність MAP', 'MAP’s general work')}</strong></>
                )}.
              </p>

              <div className="text-left bg-[#081626] rounded-2xl border border-white/10 p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300 font-semibold pb-2 border-b border-white/10">
                  <Receipt className="w-4 h-4 text-sky-400" />
                  <span>{L('Квитанція', 'Receipt')}</span>
                </div>
                <div className="flex justify-between"><span className="text-slate-400">{L('Номер операції', 'Transaction ID')}</span><span className="font-mono text-slate-200">{receipt.id}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">{L('Дата', 'Date')}</span><span className="text-slate-200">{receipt.date}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">{L('Сума', 'Amount')}</span><span className="text-slate-200 font-bold">{formatMoney(receipt.amount)} ₴</span></div>
                <div className="flex justify-between"><span className="text-slate-400">{L('Спосіб оплати', 'Payment method')}</span><span className="text-slate-200">{receipt.method}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">{L('Отримувач', 'Recipient')}</span><span className="text-slate-200">{L('ГО «МАР»', 'NGO “MAP”')}</span></div>
                {frequency === 'monthly' && (
                  <div className="pt-2 text-amber-300">{L('Щомісячне списання активовано. Скасувати можна будь-коли.', 'Monthly payment activated. You can cancel at any time.')}</div>
                )}
              </div>

              {donorEmail && !isAnonymous && (
                <div className="text-xs text-slate-400">{L('Копію квитанції надіслано на', 'A copy of the receipt was sent to')} {donorEmail}</div>
              )}
              <button
                onClick={closeDonation}
                className="w-full bg-[#3b7da5] hover:bg-[#4a90be] text-white font-bold py-3 rounded-xl cursor-pointer"
              >
                {L('Готово', 'Done')}
              </button>
            </div>
          )}

          {/* ---------------- FAILED ---------------- */}
          {step === 'failed' && (
            <div className="py-6 text-center space-y-4 animate-in fade-in">
              <AlertCircle className="w-14 h-14 text-rose-400 mx-auto" />
              <h4 className="text-lg font-bold text-white">{L('Платіж не пройшов', 'Payment failed')}</h4>
              <p className="text-sm text-slate-300 max-w-sm mx-auto">{errorText}</p>
              <div className="flex gap-2">
                <button onClick={() => { setErrorText(''); setStep('form'); }} className="flex-1 bg-white/10 hover:bg-white/15 text-white font-semibold py-3 rounded-xl cursor-pointer">
                  {L('Змінити спосіб оплати', 'Change payment method')}
                </button>
                <button onClick={() => { setErrorText(''); setStep(paymentMethod === 'card' ? 'card' : 'form'); }} className="flex-1 bg-[#3b7da5] hover:bg-[#4a90be] text-white font-bold py-3 rounded-xl cursor-pointer">
                  {L('Спробувати ще раз', 'Try again')}
                </button>
              </div>
            </div>
          )}

          {/* ---------------- PROCESSING ---------------- */}
          {step === 'processing' && (
            <div className="py-10 text-center space-y-5 animate-in fade-in">
              <Loader2 className="w-12 h-12 text-sky-400 mx-auto animate-spin" />
              <div className="space-y-2">
                {processingStages.map((s, i) => (
                  <div key={i} className={`flex items-center justify-center gap-2 text-sm transition-opacity ${i <= processingStage ? 'opacity-100' : 'opacity-30'}`}>
                    {i < processingStage ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="w-4 h-4" />}
                    <span className={i === processingStage ? 'text-slate-200 font-semibold' : 'text-slate-400'}>{s}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500">{L('Не закривайте це вікно', 'Please do not close this window')}</p>
            </div>
          )}

          {/* ---------------- MONOBANK ---------------- */}
          {step === 'mono' && (
            <div className="py-6 text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-2xl bg-black mx-auto flex items-center justify-center border border-white/20">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold">{L('Підтвердіть оплату в застосунку monobank', 'Confirm the payment in the monobank app')}</h4>
              <p className="text-sm text-slate-300">
                {L('Ми надіслали запит на оплату', 'We have sent a payment request for')} <strong className="text-sky-300">{sumLabel}</strong>.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-sky-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{L('Очікуємо підтвердження…', 'Waiting for confirmation…')}</span>
              </div>
            </div>
          )}

          {/* ---------------- CARD FORM ---------------- */}
          {step === 'card' && (
            <form onSubmit={handleCardSubmit} className="space-y-4 animate-in fade-in">
              <button type="button" onClick={() => setStep('form')} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white cursor-pointer">
                <ArrowLeft className="w-3.5 h-3.5" /> {L('Назад', 'Back')}
              </button>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">{L('Оплата карткою', 'Pay by card')}</span>
                <span className="text-sky-300 font-bold">{sumLabel}</span>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">{L('Номер картки', 'Card number')}</label>
                <div className="relative">
                  <input
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    className={`${inputCls} ${cardErrors.number ? 'border-rose-500' : 'border-white/15'}`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-300">
                    {cardBrand(cardNumber.replace(/\D/g, ''))}
                  </span>
                </div>
                {cardErrors.number && <p className="text-[11px] text-rose-400 mt-1">{cardErrors.number}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">{L('Термін дії', 'Expiry')}</label>
                  <input
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder={L('ММ/РР', 'MM/YY')}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                    className={`${inputCls} ${cardErrors.expiry ? 'border-rose-500' : 'border-white/15'}`}
                  />
                  {cardErrors.expiry && <p className="text-[11px] text-rose-400 mt-1">{cardErrors.expiry}</p>}
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">CVV2</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="•••"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    className={`${inputCls} ${cardErrors.cvv ? 'border-rose-500' : 'border-white/15'}`}
                  />
                  {cardErrors.cvv && <p className="text-[11px] text-rose-400 mt-1">{cardErrors.cvv}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-[#081626] p-2.5 rounded-xl border border-white/10">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{L('Дані картки передаються в зашифрованому вигляді (PCI DSS) і не зберігаються на сайті.', 'Card data is encrypted (PCI DSS) and never stored on this site.')}</span>
              </div>
              <button type="submit" className="w-full bg-[#3b7da5] hover:bg-[#4a90be] text-white font-bold py-3.5 rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                <span>{L('Оплатити', 'Pay')} {sumLabel}</span>
              </button>
            </form>
          )}

          {/* ---------------- 3-D SECURE ---------------- */}
          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4 animate-in fade-in">
              <div className="text-center space-y-2">
                <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-lg">3-D Secure</h4>
                <p className="text-xs text-slate-300">
                  {L('Банк надіслав SMS з кодом підтвердження для оплати', 'Your bank has sent an SMS with a confirmation code for the payment of')}{' '}
                  <strong className="text-sky-300">{sumLabel}</strong> {L('з картки', 'from card')} •••• {cardNumber.replace(/\D/g, '').slice(-4)}.
                </p>
              </div>
              <input
                autoFocus
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="••••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className={`${inputCls} text-center tracking-[0.5em] text-lg border-white/15`}
              />
              {errorText && <p className="text-xs text-rose-400 text-center">{errorText}</p>}
              <button type="submit" className="w-full bg-[#3b7da5] hover:bg-[#4a90be] text-white font-bold py-3 rounded-xl cursor-pointer">
                {L('Підтвердити', 'Confirm')}
              </button>
              <button type="button" onClick={() => setStep('card')} className="w-full text-xs text-slate-400 hover:text-white cursor-pointer">
                {L('Скасувати', 'Cancel')}
              </button>
            </form>
          )}

          {/* ---------------- IBAN DONE ---------------- */}
          {step === 'iban-done' && (
            <div className="py-6 text-center space-y-4 animate-in fade-in">
              <Landmark className="w-14 h-14 text-sky-400 mx-auto" />
              <h4 className="text-lg font-bold">{L('Дякуємо за намір підтримати MAP!', 'Thank you for supporting MAP!')}</h4>
              <p className="text-sm text-slate-300">
                {L('Здійсніть переказ', 'Please transfer')} <strong className="text-sky-300">{sumLabel}</strong> {L('за реквізитами нижче. Внесок буде зараховано після надходження коштів на рахунок (зазвичай 1 банківський день).', 'using the details below. The donation will be credited once the funds arrive (usually 1 business day).')}
              </p>
              <div className="font-mono text-sky-300 text-xs bg-black/40 px-3 py-2 rounded-xl border border-white/10">{IBAN}</div>
              <button onClick={closeDonation} className="w-full bg-[#3b7da5] hover:bg-[#4a90be] text-white font-bold py-3 rounded-xl cursor-pointer">
                {L('Готово', 'Done')}
              </button>
            </div>
          )}

          {/* ---------------- MAIN FORM ---------------- */}
          {step === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Project Target Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-sky-400" />
                  <span>{L('Куди спрямувати ваш внесок:', 'Where should your donation go:')}</span>
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#081626] text-white text-xs font-medium focus:ring-2 focus:ring-sky-400 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="general" className="bg-[#081626] text-white">
                    🌟 {L('Загальна діяльність ГО «МАР» (усі напрямки)', 'General work of NGO “MAP” (all areas)')}
                  </option>
                  {projectsList.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#081626] text-white">
                      🎯 {projTitle(p)} {p.goalAmount ? `(${L('Збір', 'Raised')}: ${formatMoney(p.raisedAmount || 0)} / ${formatMoney(p.goalAmount)} ₴)` : ''}
                    </option>
                  ))}
                </select>

                {targetedProject && targetedProject.goalAmount ? (
                  <div className="mt-2.5 p-2.5 bg-[#081626]/70 rounded-xl border border-white/10 space-y-1.5">
                    <div className="flex justify-between text-[11px] text-slate-300">
                      <span>{L('Поточний збір', 'Raised so far')}: <strong className="text-sky-300">{formatMoney(targetedProject.raisedAmount || 0)} ₴</strong></span>
                      <span>{L('Ціль', 'Goal')}: <strong className="text-sky-300">{formatMoney(targetedProject.goalAmount)} ₴</strong></span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#3b7da5] to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.round(((targetedProject.raisedAmount || 0) / targetedProject.goalAmount) * 100))}%` }}
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {L('Оберіть суму допомоги:', 'Choose an amount:')}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['150', '500', '1000', '2500'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => { setAmount(val); setCustomAmount(''); }}
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
                <input
                  type="number"
                  min="10"
                  max="1000000"
                  placeholder={L('Або введіть іншу суму (₴)...', 'Or enter another amount (₴)...')}
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setAmount(''); }}
                  className="mt-2.5 w-full px-4 py-2 text-sm rounded-xl border border-white/15 bg-[#081626] text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                />
              </div>

              {/* Impact */}
              <div className="p-3 bg-sky-950/40 rounded-2xl border border-sky-500/30 text-xs text-sky-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sky-100 mb-0.5">{L('Соціальний вплив вашого внеску:', 'The impact of your donation:')}</span>
                  <span className="leading-relaxed">{getImpactDescription(currentSumNum)}</span>
                </div>
              </div>

              {/* Donor info */}
              <div className="space-y-2 pt-1 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">{L('Інформація про благодійника:', 'Donor details:')}</label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-white/20 bg-[#081626] text-sky-500 focus:ring-sky-400 cursor-pointer"
                    />
                    <span>{L('Анонімно', 'Anonymous')}</span>
                  </label>
                </div>
                {!isAnonymous && (
                  <div className="grid grid-cols-2 gap-2 animate-in fade-in">
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder={L('Ваше ім’я', 'Your name')}
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-white/15 bg-[#081626] text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-400"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder={L('Email для квитанції', 'Email for receipt')}
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
                <label className="block text-xs font-semibold text-slate-300 mb-2">{L('Спосіб оплати:', 'Payment method:')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    ['mono', <span key="m" className="font-black text-xs text-white">monobank</span>, L('Оплата в застосунку', 'Pay in app')],
                    ['card', <CreditCard key="c" className="w-4 h-4 text-slate-300" />, L('Картка Visa / MC', 'Visa / MC card')],
                    ['iban', <Landmark key="i" className="w-4 h-4 text-slate-300" />, L('Переказ IBAN', 'IBAN transfer')],
                  ] as const).map(([key, icon, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPaymentMethod(key)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer text-center ${
                        paymentMethod === key
                          ? 'border-sky-400 bg-[#143254] ring-2 ring-sky-400 text-white'
                          : 'border-white/15 bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {icon}
                      <span className="text-[10px] text-slate-400">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* IBAN details */}
              {paymentMethod === 'iban' && (
                <div className="p-3.5 bg-[#081626] rounded-2xl border border-white/15 text-xs text-slate-300 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span><strong>{L('Одержувач', 'Recipient')}:</strong> {L('ГО «МАР»', 'NGO “MAP”')}</span>
                    <span className="text-slate-400">{L('ЄДРПОУ', 'EDRPOU')}: 43210987</span>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">IBAN:</label>
                    <div className="flex items-center justify-between bg-black/40 px-3 py-2 rounded-xl border border-white/10 font-mono text-sky-300 text-xs">
                      <span>{IBAN}</span>
                      <button
                        type="button"
                        onClick={handleCopyIban}
                        className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 transition-colors ml-2 cursor-pointer font-sans"
                      >
                        {copiedIban ? (
                          <><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400 font-bold">{L('Скопійовано!', 'Copied!')}</span></>
                        ) : (
                          <><Copy className="w-3.5 h-3.5" /><span>{L('Копіювати', 'Copy')}</span></>
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    <strong>{L('Призначення', 'Reference')}:</strong>{' '}
                    {targetedProject
                      ? L(`Благодійний внесок на проєкт "${targetedProject.title}"`, `Charitable donation to project "${projTitle(targetedProject)}"`)
                      : L('Благодійний внесок на статутну діяльність', 'Charitable donation for statutory activities')}
                  </p>
                </div>
              )}

              {errorText && <p className="text-xs text-rose-400">{errorText}</p>}

              <div className="flex items-center gap-2 text-xs text-slate-400 bg-[#081626] p-2.5 rounded-xl border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{L('Офіційна неприбуткова організація. Захищене з’єднання.', 'Officially registered non-profit. Secure connection.')}</span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#3b7da5] hover:bg-[#4a90be] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {paymentMethod === 'iban'
                  ? <span>{L('Отримати реквізити для переказу', 'Get transfer details')}</span>
                  : <><Lock className="w-4 h-4" /><span>{L('Перейти до оплати', 'Continue to payment')} {sumLabel}{frequency === 'monthly' ? L(' / міс.', ' / mo') : ''}</span></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
