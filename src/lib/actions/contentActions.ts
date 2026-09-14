'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import * as store from '../data/store';
import { HeroContent, ImpactStats, NewsItem, ProjectItem, TeamMember, ContactInfo } from '../types';
import { verifyAdminSession, AdminRole } from '../auth';
import { notifyNewVolunteer, notifyNewContactMessage } from '../telegram';

// =============================================================================
// Zod Validation Schemas
// =============================================================================

const htmlSanitize = (val: string) =>
  val.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
     .replace(/on\w+\s*=/gi, '');

const SafeHtmlString = z.string().transform(htmlSanitize);

const CreateNewsSchema = z.object({
  title: z.string().min(3, 'Назва занадто коротка').max(300),
  excerpt: z.string().min(10, 'Опис занадто короткий').max(1000),
  content: SafeHtmlString,
  coverImage: z.string().url('Невірний URL зображення').or(z.literal('')),
  youtubeUrl: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string().max(50)).max(20).optional(),
  status: z.enum(['published', 'draft']).optional(),
});

const CreateProjectSchema = z.object({
  title: z.string().min(3).max(300),
  category: z.string().min(1).max(100),
  status: z.enum(['active', 'completed']),
  coverImage: z.string().url().or(z.literal('')),
  shortDesc: z.string().max(1000),
  fullDesc: SafeHtmlString,
  targetAudience: z.string().max(500),
  dates: z.string().max(100),
  raisedAmount: z.number().min(0).optional(),
  goalAmount: z.number().min(0).optional(),
});

const DonateSchema = z.object({
  projectId: z.string().max(255).optional(),
  amount: z.number().positive('Сума внеску повинна бути більшою за нуль').max(1_000_000),
  frequency: z.enum(['once', 'monthly']).optional(),
  paymentMethod: z.enum(['mono', 'card', 'iban']).optional(),
  donorName: z.string().max(150).optional(),
  donorEmail: z.string().email().optional().or(z.literal('')),
});

const ContactFormSchema = z.object({
  name: z.string().min(2, "Ім'я занадто коротке").max(150),
  email: z.string().email('Невірний формат email').max(150),
  phone: z.string().max(50).optional(),
  subject: z.string().max(300),
  message: z.string().min(5, 'Повідомлення занадто коротке').max(5000),
  isVolunteer: z.boolean(),
  direction: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
});

const TeamMemberSchema = z.object({
  name: z.string().min(2).max(150),
  role: z.string().min(1).max(150),
  photo: z.string().url().or(z.literal('')),
  bio: z.string().max(2000),
  order: z.number().int().min(0).optional(),
  socials: z.object({
    linkedin: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')),
  }).optional(),
});

// =============================================================================
// Auth Helper
// =============================================================================

async function requireAdmin(allowedRoles?: AdminRole[]) {
  const isAuth = await verifyAdminSession(allowedRoles);
  if (!isAuth) {
    throw new Error('Unauthorized: Недостатньо прав для виконання цієї дії');
  }
}

// =============================================================================
// Hero / Stats / About Actions
// =============================================================================

export async function updateHeroAction(hero: Partial<HeroContent>) {
  try {
    await requireAdmin();
    const updated = await store.updateHero(hero);
    revalidatePath('/');
    return { success: true, data: updated };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Невідома помилка';
    return { success: false, error: message };
  }
}

export async function updateStatsAction(stats: Partial<ImpactStats>) {
  try {
    await requireAdmin();
    const updated = await store.updateStats(stats);
    revalidatePath('/');
    return { success: true, data: updated };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Невідома помилка';
    return { success: false, error: message };
  }
}

export async function updateAboutStoryAction(about: Partial<{
  title: string;
  description: string;
  mission: string;
  vision: string;
  values: Array<{ title: string; desc: string; icon: string }>;
}>) {
  try {
    await requireAdmin();
    const updated = await store.updateAboutStory(about);
    revalidatePath('/who-we-are');
    revalidatePath('/');
    return { success: true, data: updated };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Невідома помилка';
    return { success: false, error: message };
  }
}

// =============================================================================
// News Actions
// =============================================================================

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
    const validated = CreateNewsSchema.parse(formData);
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
    
    const newItem = await store.addNews({
      title: validated.title,
      excerpt: validated.excerpt,
      content: validated.content || '<p>' + validated.excerpt + '</p>',
      coverImage: validated.coverImage || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      youtubeUrl: validated.youtubeUrl || '',
      date: formattedDate,
      author: 'Команда MAP',
      status: validated.status || 'published',
      tags: validated.tags && validated.tags.length > 0 ? validated.tags : ['Новини', 'MAP'],
      views: 1
    });

    revalidatePath('/');
    revalidatePath('/news');
    return { success: true, data: newItem };
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues.map((e: z.ZodIssue) => e.message).join(', ') };
    }
    const message = err instanceof Error ? err.message : 'Невідома помилка';
    return { success: false, error: message };
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Невідома помилка';
    return { success: false, error: message };
  }
}

export async function deleteNewsAction(id: string) {
  try {
    await requireAdmin();
    const success = await store.deleteNews(id);
    revalidatePath('/');
    revalidatePath('/news');
    return { success };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Невідома помилка';
    return { success: false, error: message };
  }
}

// =============================================================================
// Projects & Donations Actions
// =============================================================================

export async function donateToProjectAction(formData: {
  projectId?: string;
  amount: number;
  frequency?: 'once' | 'monthly';
  paymentMethod?: 'mono' | 'card' | 'iban';
  donorName?: string;
  donorEmail?: string;
}) {
  try {
    const validated = DonateSchema.parse(formData);
    const result = await store.donateToProject({
      projectId: validated.projectId,
      amount: validated.amount,
      frequency: validated.frequency || 'once',
      paymentMethod: validated.paymentMethod || 'card',
      donorName: validated.donorName,
      donorEmail: validated.donorEmail,
    });

    revalidatePath('/');
    revalidatePath('/projects');
    return {
      success: true,
      data: result.project,
      newRaisedAmount: result.newRaisedAmount,
      donation: result.donation,
    };
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues.map((e: z.ZodIssue) => e.message).join(', ') };
    }
    const message = err instanceof Error ? err.message : 'Невідома помилка';
    return { success: false, error: message };
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
    const validated = CreateProjectSchema.parse(formData);
    const newProj = await store.addProject({
      ...validated,
      raisedAmount: validated.raisedAmount || 0,
      goalAmount: validated.goalAmount || 100000
    });
    revalidatePath('/');
    revalidatePath('/projects');
    return { success: true, data: newProj };
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues.map((e: z.ZodIssue) => e.message).join(', ') };
    }
    const message = err instanceof Error ? err.message : 'Невідома помилка';
    return { success: false, error: message };
  }
}

export async function updateProjectAction(id: string, updates: Partial<ProjectItem>) {
  try {
    await requireAdmin();
    const updated = await store.updateProject(id, updates);
    revalidatePath('/');
    revalidatePath('/projects');
    return { success: true, data: updated };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Невідома помилка';
    return { success: false, error: message };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await requireAdmin();
    const success = await store.deleteProject(id);
    revalidatePath('/');
    revalidatePath('/projects');
    return { success };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Невідома помилка';
    return { success: false, error: message };
  }
}

// =============================================================================
// Team Actions
// =============================================================================

export async function createTeamMemberAction(member: {
  name: string;
  role: string;
  photo: string;
  bio: string;
  order?: number;
  socials?: { linkedin?: string; instagram?: string; email?: string };
}) {
  try {
    await requireAdmin();
    const validated = TeamMemberSchema.parse(member);
    const created = await store.addTeamMember({
      name: validated.name,
      role: validated.role,
      photo: validated.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
      bio: validated.bio || '',
      order: validated.order || 99,
      socials: validated.socials
    });
    revalidatePath('/who-we-are');
    return { success: true, data: created };
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues.map((e: z.ZodIssue) => e.message).join(', ') };
    }
    const message = err instanceof Error ? err.message : 'Невідома помилка';
    return { success: false, error: message };
  }
}

export async function updateTeamMemberAction(id: string, updates: Partial<TeamMember>) {
  try {
    await requireAdmin();
    const updated = await store.updateTeamMember(id, updates);
    revalidatePath('/who-we-are');
    return { success: true, data: updated };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Невідома помилка';
    return { success: false, error: message };
  }
}

export async function deleteTeamMemberAction(id: string) {
  try {
    await requireAdmin();
    const success = await store.deleteTeamMember(id);
    revalidatePath('/who-we-are');
    return { success };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Невідома помилка';
    return { success: false, error: message };
  }
}

// =============================================================================
// Contacts Actions
// =============================================================================

export async function updateContactsAction(contacts: Partial<ContactInfo>) {
  try {
    await requireAdmin();
    const updated = await store.updateContacts(contacts);
    revalidatePath('/contacts');
    revalidatePath('/');
    return { success: true, data: updated };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Невідома помилка';
    return { success: false, error: message };
  }
}

// =============================================================================
// Inbox / Feedback Action (Public)
// =============================================================================

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
    const validated = ContactFormSchema.parse(formData);
    const msg = await store.addInboxMessage({
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      subject: validated.subject,
      message: validated.message,
      isVolunteer: validated.isVolunteer
    });

    // Notify team in Telegram safely in background
    if (validated.isVolunteer) {
      notifyNewVolunteer({
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        city: validated.city,
        direction: validated.direction,
        skills: validated.message
      }).catch(console.error);
    } else {
      notifyNewContactMessage({
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        subject: validated.subject,
        message: validated.message
      }).catch(console.error);
    }

    return { success: true, data: msg };
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues.map((e: z.ZodIssue) => e.message).join(', ') };
    }
    const message = err instanceof Error ? err.message : 'Невідома помилка';
    return { success: false, error: message };
  }
}
