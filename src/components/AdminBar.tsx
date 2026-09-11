'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Plus, MessageSquare, LogOut, Heart, RefreshCw } from 'lucide-react';
import { InboxMessage, DonationRecord } from '../lib/types';
import { formatMoney } from '../lib/utils';

export default function AdminBar() {
  const {
    isAdmin,
    currentUser,
    role,
    can,
    toggleAdmin,
    openCreateNews,
    openProjectModal,
    openTeamModal,
  } = useAdmin();
  const [modalType, setModalType] = useState<'inbox' | 'donations' | null>(null);
  const [inboxMessages, setInboxMessages] = useState<InboxMessage[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInbox = () => {
    setLoading(true);
    fetch('/api/inbox')
      .then((res) => res.json())
      .then((data) => setInboxMessages(data.messages || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const fetchDonations = () => {
    setLoading(true);
    fetch('/api/donate')
      .then((res) => res.json())
      .then((data) => setDonations(data.donations || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAdmin && modalType === 'inbox') {
      fetchInbox();
    } else if (isAdmin && modalType === 'donations') {
      fetchDonations();
    }
  }, [isAdmin, modalType]);

  if (!isAdmin) return null;

  const totalDonationsAmount = donations.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[#0e2238]/95 backdrop-blur-md text-white px-5 py-2.5 rounded-full shadow-2xl border border-sky-500/30 flex items-center gap-4 text-xs animate-in slide-in-from-bottom-5">
        <div className="flex items-center gap-2 pr-3 border-r border-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-sky-200">
            {role === 'admin' && '👑 Головний адмін'}
            {role === 'editor' && '✍️ Редактор'}
            {role === 'coordinator' && '🤝 Координатор'}
            {!role && 'Адмін-режим'}
          </span>
          {currentUser && (
            <span className="text-[10px] text-slate-400 font-normal">
              ({currentUser.username})
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {can('content') && (
            <>
              <button
                onClick={() => openCreateNews()}
                className="flex items-center gap-1 bg-[#3b7da5] hover:bg-[#4a90be] px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Новина</span>
              </button>

              <button
                onClick={() => openProjectModal()}
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Проєкт</span>
              </button>

              <button
                onClick={() => openTeamModal()}
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Команда</span>
              </button>
            </>
          )}

          {can('inbox') && (
            <button
              onClick={() => setModalType(modalType === 'inbox' ? null : 'inbox')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                modalType === 'inbox'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
              }`}
              title="Переглянути заявки та повідомлення з сайту"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Заявки</span>
            </button>
          )}

          {can('finances') && (
            <button
              onClick={() => setModalType(modalType === 'donations' ? null : 'donations')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                modalType === 'donations'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-rose-300'
              }`}
              title="Переглянути історію благодійних внесків у базі"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Внески</span>
            </button>
          )}
        </div>

        <button
          onClick={toggleAdmin}
          className="flex items-center gap-1 text-slate-400 hover:text-white pl-2 border-l border-slate-700 transition-colors cursor-pointer"
          title="Вийти з адмін-режиму"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Вийти</span>
        </button>
      </div>

      {/* Modal Dialog for Inbox / Donations */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-[#0e2238] rounded-2xl shadow-2xl border border-white/15 overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0b1d30]/80">
              <div className="flex items-center gap-3">
                {modalType === 'inbox' ? (
                  <>
                    <MessageSquare className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="font-bold text-white text-base">Вхідні звернення та анкети</h3>
                      <p className="text-[11px] text-slate-400">Повідомлення контактів та реєстрації волонтерів</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 text-rose-400 fill-rose-400/20" />
                    <div>
                      <h3 className="font-bold text-white text-base">Журнал благодійних внесків</h3>
                      <p className="text-[11px] text-slate-400">
                        Всього внесків: <strong className="text-white">{donations.length}</strong> • На суму: <strong className="text-emerald-400 font-mono">{formatMoney(totalDonationsAmount)} ₴</strong>
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={modalType === 'inbox' ? fetchInbox : fetchDonations}
                  disabled={loading}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Оновити список"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => setModalType(null)}
                  className="text-slate-400 hover:text-white text-sm font-semibold px-2 py-1 transition-colors cursor-pointer"
                >
                  Закрити
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto divide-y divide-white/10 space-y-4">
              {modalType === 'inbox' ? (
                inboxMessages.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    Нових повідомлень або анкет ще немає. Спробуйте надіслати тестове звернення зі сторінки контактів або модалки волонтера!
                  </div>
                ) : (
                  inboxMessages.map((msg) => (
                    <div key={msg.id} className="pt-3 first:pt-0 space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{msg.name}</span>
                          {msg.isVolunteer && (
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold text-[10px]">
                              Волонтер
                            </span>
                          )}
                        </div>
                        <span className="text-slate-400 text-[11px]">
                          {new Date(msg.createdAt).toLocaleString('uk-UA')}
                        </span>
                      </div>
                      <p className="text-slate-400">
                        Email: <a href={`mailto:${msg.email}`} className="text-sky-400 underline">{msg.email}</a>
                        {msg.phone && <span> • Тел/ТГ: {msg.phone}</span>}
                      </p>
                      <p className="font-semibold text-slate-100 mt-1">{msg.subject}</p>
                      <p className="p-2.5 bg-[#081626] border border-white/10 rounded-lg text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  ))
                )
              ) : donations.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  Записів про внески в базі даних поки немає.
                </div>
              ) : (
                donations.map((don) => (
                  <div key={don.id} className="pt-3 first:pt-0 space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-emerald-400 text-base">
                          +{formatMoney(don.amount)} ₴
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-300 uppercase">
                          {don.paymentMethod === 'mono' ? 'Monobank' : don.paymentMethod === 'card' ? 'Картка' : 'IBAN'}
                        </span>
                        {don.frequency === 'monthly' && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                            Щомісячний
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 text-[11px]">
                        {new Date(don.createdAt).toLocaleString('uk-UA')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>
                        Благодійник: <strong className="text-slate-200">{don.donorName || 'Анонімний'}</strong>
                        {don.donorEmail && ` (${don.donorEmail})`}
                      </span>
                      <span>
                        Проєкт: <strong className="text-sky-300">{don.projectId ? `ID: ${don.projectId}` : 'Загальна діяльність'}</strong>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
