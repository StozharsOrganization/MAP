'use client';

import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { useTranslation, getTranslatedContacts } from '../../../lib/translations';
import { ContactInfo } from '../../../lib/types';
import { updateContactsAction, submitContactFormAction } from '../../../lib/actions/contentActions';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Edit3,
  Check,
  Sparkles,
  Loader2
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, LinkedinIcon, YoutubeIcon } from '../../../components/icons/BrandIcons';

interface ContactsClientProps {
  initialContacts: ContactInfo;
}

export default function ContactsClient({ initialContacts }: ContactsClientProps) {
  const { isAdmin } = useAdmin();
  const { t, language } = useTranslation();
  const [contacts, setContacts] = useState<ContactInfo>(initialContacts);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [phoneInput, setPhoneInput] = useState(initialContacts.phone);
  const [emailInput, setEmailInput] = useState(initialContacts.email);
  const [addressInput, setAddressInput] = useState(initialContacts.address);
  const [workHoursInput, setWorkHoursInput] = useState(initialContacts.workHours);
  const [isSavingContacts, setIsSavingContacts] = useState(false);

  const displayContacts = getTranslatedContacts(contacts, language);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    isVolunteer: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSaveContacts = async () => {
    setIsSavingContacts(true);
    try {
      const res = await updateContactsAction({
        phone: phoneInput,
        email: emailInput,
        address: addressInput,
        workHours: workHoursInput
      });
      if (res.success && res.data) {
        setContacts(res.data);
      }
      setIsEditingInfo(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingContacts(false);
    }
  };

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    try {
      await submitContactFormAction(formData);
      setIsSent(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        isVolunteer: false
      });
      setTimeout(() => setIsSent(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-[#081626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.contactsPage.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {t.contactsPage.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            {t.contactsPage.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Contact Details (Editable in Admin mode) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0e2238] text-white p-8 rounded-3xl shadow-2xl border border-white/10 space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{t.contactsPage.infoTitle}</h2>
                {isAdmin && (
                  <button
                    onClick={() => setIsEditingInfo(!isEditingInfo)}
                    className="flex items-center gap-1 text-xs text-sky-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditingInfo ? t.contactsPage.cancelBtn : t.contactsPage.editBtn}</span>
                  </button>
                )}
              </div>

              {isEditingInfo ? (
                <div className="space-y-3 bg-black/40 p-4 rounded-2xl border border-white/20 text-xs">
                  <div>
                    <label className="text-sky-200 font-semibold block mb-1">{t.contactsPage.phoneLabel}:</label>
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={e => setPhoneInput(e.target.value)}
                      className="w-full bg-[#081626] text-white p-2.5 rounded-xl border border-white/20"
                    />
                  </div>
                  <div>
                    <label className="text-sky-200 font-semibold block mb-1">{t.contactsPage.emailLabel}:</label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      className="w-full bg-[#081626] text-white p-2.5 rounded-xl border border-white/20"
                    />
                  </div>
                  <div>
                    <label className="text-sky-200 font-semibold block mb-1">{t.contactsPage.addressLabel}:</label>
                    <input
                      type="text"
                      value={addressInput}
                      onChange={e => setAddressInput(e.target.value)}
                      className="w-full bg-[#081626] text-white p-2.5 rounded-xl border border-white/20"
                    />
                  </div>
                  <div>
                    <label className="text-sky-200 font-semibold block mb-1">{t.contactsPage.hoursLabel}:</label>
                    <input
                      type="text"
                      value={workHoursInput}
                      onChange={e => setWorkHoursInput(e.target.value)}
                      className="w-full bg-[#081626] text-white p-2.5 rounded-xl border border-white/20"
                    />
                  </div>
                  <button
                    onClick={handleSaveContacts}
                    disabled={isSavingContacts}
                    className="w-full bg-[#3b7da5] hover:bg-[#4a90be] text-white font-bold py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isSavingContacts ? t.contactsPage.saving : t.contactsPage.saveBtn}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-5 text-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sky-400 shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">{t.contactsPage.phoneLabel}</p>
                      <a href={`tel:${contacts.phone}`} className="font-bold text-white hover:text-sky-300 text-base transition-colors">
                        {contacts.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sky-400 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">{t.contactsPage.emailLabel}</p>
                      <a href={`mailto:${contacts.email}`} className="font-bold text-white hover:text-sky-300 text-base transition-colors">
                        {contacts.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sky-400 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">{t.contactsPage.addressLabel}</p>
                      <p className="font-bold text-white text-base">
                        {displayContacts.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sky-400 shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">{t.contactsPage.hoursLabel}</p>
                      <p className="font-bold text-white text-base">
                        {displayContacts.workHours}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Media Links */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider font-semibold">
                  {t.contactsPage.followUs}
                </p>
                <div className="flex items-center gap-3">
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#3b7da5] flex items-center justify-center text-white transition-colors">
                    <InstagramIcon className="w-5 h-5" />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#3b7da5] flex items-center justify-center text-white transition-colors">
                    <FacebookIcon className="w-5 h-5" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#3b7da5] flex items-center justify-center text-white transition-colors">
                    <LinkedinIcon className="w-5 h-5" />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#3b7da5] flex items-center justify-center text-white transition-colors">
                    <YoutubeIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Interactive Map Block */}
            <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-64 bg-slate-900 relative">
              <iframe
                title="Office Map"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src="https://www.openstreetmap.org/export/embed.html?bbox=30.518%2C50.446%2C30.530%2C50.453&amp;layer=mapnik&amp;marker=50.449%2C30.523"
                className="w-full h-full border-0 brightness-90 contrast-110"
              />
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#0e2238] rounded-3xl border border-white/10 shadow-2xl p-8 sm:p-10 space-y-6 text-white">
              <div>
                <h2 className="text-2xl font-extrabold text-white">{t.contactsPage.formTitle}</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {t.contactsPage.formSubtitle}
                </p>
              </div>

              {isSent ? (
                <div className="p-8 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 text-center space-y-3 animate-in fade-in">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-emerald-300">{t.contactsPage.successTitle}</h4>
                  <p className="text-xs text-emerald-400/90">
                    {t.contactsPage.successDesc}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitMessage} className="space-y-4 text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.contactsPage.nameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t.contactsPage.namePlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#081626] text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.contactsPage.emailInputLabel}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#081626] text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.contactsPage.phoneInputLabel}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+380..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#081626] text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.contactsPage.subjectLabel}
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        placeholder={t.contactsPage.subjectPlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#081626] text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {t.contactsPage.messageLabel}
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t.contactsPage.messagePlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#081626] text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="volunteerCheck"
                      checked={formData.isVolunteer}
                      onChange={e => setFormData({ ...formData, isVolunteer: e.target.checked })}
                      className="w-4 h-4 rounded bg-[#081626] border-white/20 text-[#3b7da5] focus:ring-sky-400"
                    />
                    <label htmlFor="volunteerCheck" className="text-xs text-slate-300 font-medium cursor-pointer">
                      {t.contactsPage.volunteerCheckbox}
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#3b7da5] hover:bg-[#4a90be] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t.contactsPage.sending}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t.contactsPage.sendBtn}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
