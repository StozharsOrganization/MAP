'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { createTeamMemberAction, updateTeamMemberAction } from '../../lib/actions/contentActions';
import { X, Check, Loader2, UserPlus } from 'lucide-react';

export default function TeamModal() {
  const { isTeamModalOpen, closeTeamModal, editingTeam } = useAdmin();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [photo, setPhoto] = useState('');
  const [bio, setBio] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTeam) {
      setName(editingTeam.name);
      setRole(editingTeam.role);
      setPhoto(editingTeam.photo);
      setBio(editingTeam.bio);
      setLinkedin(editingTeam.socials?.linkedin || '');
      setEmail(editingTeam.socials?.email || '');
    } else {
      setName('');
      setRole('');
      setPhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80');
      setBio('');
      setLinkedin('');
      setEmail('');
    }
  }, [editingTeam, isTeamModalOpen]);

  if (!isTeamModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingTeam) {
        await updateTeamMemberAction(editingTeam.id, {
          name,
          role,
          photo,
          bio,
          socials: { linkedin, email }
        });
      } else {
        await createTeamMemberAction({
          name,
          role,
          photo,
          bio,
          socials: { linkedin, email }
        });
      }
      closeTeamModal();
    } catch (err) {
      console.error('Error saving team member:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#0e2238] rounded-2xl shadow-2xl border border-white/15 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0b1d30]/60">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-white text-base">
              {editingTeam ? 'Редагувати учасника команди' : 'Додати учасника команди'}
            </h3>
          </div>
          <button
            onClick={closeTeamModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Повне ім’я та прізвище</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Олена Коваленко"
              className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-[#081626] text-white placeholder:text-slate-500 font-medium focus:ring-2 focus:ring-sky-400 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Посада / Роль в організації</label>
            <input
              type="text"
              required
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="Координаторка молодіжних проєктів"
              className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-[#081626] text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-400 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">URL фотографії</label>
            <input
              type="text"
              value={photo}
              onChange={e => setPhoto(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-[#081626] text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-400 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Короткий опис / Біографія</label>
            <textarea
              rows={2}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Досвід, ключові напрямки діяльності..."
              className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-[#081626] text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-400 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={linkedin}
                onChange={e => setLinkedin(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-white/15 bg-[#081626] text-slate-200 placeholder:text-slate-500 focus:ring-1 focus:ring-sky-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Робочий Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@map-ngo.org"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-white/15 bg-[#081626] text-slate-200 placeholder:text-slate-500 focus:ring-1 focus:ring-sky-400 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#3b7da5] hover:bg-[#2d6282] text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Збереження...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{editingTeam ? 'Зберегти зміни' : 'Додати до команди'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
