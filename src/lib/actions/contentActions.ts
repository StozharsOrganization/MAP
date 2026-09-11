'use server';

import { revalidatePath } from 'next/cache';
import * as store from '../data/store';
import { HeroContent, ImpactStats, NewsItem, ProjectItem, TeamMember, ContactInfo } from '../types';
import { verifyAdminSession, AdminRole } from '../auth';
import { notifyNewVolunteer, notifyNewContactMessage } from '../telegram';

async function requireAdmin(allowedRoles?: AdminRole[]) {
  const isAuth = await verifyAdminSession(allowedRoles);
  if (!isAuth) {
    throw new Error('Unauthorized: Недостатньо прав для виконання цієї дії');
  }
}

export async function updateHeroAction(hero: Partial<HeroContent>) {
  try {
    await requireAdmin();
    const updated = await store.updateHero(hero);
    revalidatePath('/');
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateStatsAction(stats: Partial<ImpactStats>) {
  try {
    await requireAdmin();
    const updated = await store.updateStats(stats);
    revalidatePath('/');
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateAboutStoryAction(about: any) {
  try {
    await requireAdmin();
    const updated = await store.updateAboutStory(about);
    revalidatePath('/who-we-are');
    revalidatePath('/');
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// News Actions
export async function createNewsAction(formData: {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  youtubeUrl?: string;
  tags?: string[];
  status?: 'published' | 'draft';
}) {
  try {
    await requireAdmin();
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
    
    const newItem = await store.addNews({
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content || '<p>' + formData.excerpt + '</p>',
      coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      youtubeUrl: formData.youtubeUrl || '',
      date: formattedDate,
      author: 'Команда MAP',
      status: formData.status || 'published',
      tags: formData.tags && formData.tags.length > 0 ? formData.tags : ['Новини', 'MAP'],
      views: 1
    });

    revalidatePath('/');
    revalidatePath('/news');
    return { success: true, data: newItem };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateNewsAction(id: string, updates: Partial<NewsItem>) {
  try {
    await requireAdmin();
    const updated = await store.updateNews(id, updates);
    revalidatePath('/');
    revalidatePath('/news');
    if (updated) {
      revalidatePath(`/news/${updated.slug}`);
    }
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteNewsAction(id: string) {
  try {
    await requireAdmin();
    const success = await store.deleteNews(id);
    revalidatePath('/');
    revalidatePath('/news');
    return { success };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// Projects Actions
export async function donateToProjectAction(formData: {
  projectId?: string;
  amount: number;
  frequency?: 'once' | 'monthly';
  paymentMethod?: 'mono' | 'card' | 'iban';
  donorName?: string;
  donorEmail?: string;
}) {
  try {
    const numAmount = Number(formData.amount);
    if (!numAmount || numAmount <= 0) {
      return { success: false, error: 'Сума внеску повинна бути більшою за нуль' };
    }

    const result = await store.donateToProject({
      projectId: formData.projectId,
      amount: numAmount,
      frequency: formData.frequency || 'once',
      paymentMethod: formData.paymentMethod || 'card',
      donorName: formData.donorName,
      donorEmail: formData.donorEmail,
    });

    revalidatePath('/');
    revalidatePath('/projects');
    return {
      success: true,
      data: result.project,
      newRaisedAmount: result.newRaisedAmount,
      donation: result.donation,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function createProjectAction(formData: {
  title: string;
  category: string;
  status: 'active' | 'completed';
  coverImage: string;
  shortDesc: string;
  fullDesc: string;
  targetAudience: string;
  dates: string;
  raisedAmount?: number;
  goalAmount?: number;
}) {
  try {
    await requireAdmin();
    const newProj = await store.addProject({
      ...formData,
      raisedAmount: formData.raisedAmount || 0,
      goalAmount: formData.goalAmount || 100000
    });
    revalidatePath('/');
    revalidatePath('/projects');
    return { success: true, data: newProj };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateProjectAction(id: string, updates: Partial<ProjectItem>) {
  try {
    await requireAdmin();
    const updated = await store.updateProject(id, updates);
    revalidatePath('/');
    revalidatePath('/projects');
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await requireAdmin();
    const success = await store.deleteProject(id);
    revalidatePath('/');
    revalidatePath('/projects');
    return { success };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// Team Actions
export async function createTeamMemberAction(member: {
  name: string;
  role: string;
  photo: string;
  bio: string;
  order?: number;
  socials?: { linkedin?: string; email?: string };
}) {
  try {
    await requireAdmin();
    const created = await store.addTeamMember({
      name: member.name,
      role: member.role,
      photo: member.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
      bio: member.bio || '',
      order: member.order || 99,
      socials: member.socials
    });
    revalidatePath('/who-we-are');
    return { success: true, data: created };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateTeamMemberAction(id: string, updates: Partial<TeamMember>) {
  try {
    await requireAdmin();
    const updated = await store.updateTeamMember(id, updates);
    revalidatePath('/who-we-are');
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteTeamMemberAction(id: string) {
  try {
    await requireAdmin();
    const success = await store.deleteTeamMember(id);
    revalidatePath('/who-we-are');
    return { success };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// Contacts Actions
export async function updateContactsAction(contacts: Partial<ContactInfo>) {
  try {
    await requireAdmin();
    const updated = await store.updateContacts(contacts);
    revalidatePath('/contacts');
    revalidatePath('/');
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// Inbox / Feedback Action (Public)
export async function submitContactFormAction(formData: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isVolunteer: boolean;
  direction?: string;
  city?: string;
}) {
  try {
    const msg = await store.addInboxMessage({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      isVolunteer: formData.isVolunteer
    });

    // Notify team in Telegram safely in background
    if (formData.isVolunteer) {
      notifyNewVolunteer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        direction: formData.direction,
        skills: formData.message
      }).catch(console.error);
    } else {
      notifyNewContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      }).catch(console.error);
    }

    return { success: true, data: msg };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
