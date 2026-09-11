import fs from 'fs/promises';
import path from 'path';
import { initialData } from './initialData';
import { getPgPool, isPgConnected } from './pgClient';
import {
  MapDatabase,
  NewsItem,
  ProjectItem,
  TeamMember,
  ContactInfo,
  HeroContent,
  ImpactStats,
  InboxMessage,
  DonationRecord
} from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'map_database.json');

let memoryCache: MapDatabase | null = null;

// JSON File Store Fallback Helpers
async function ensureFileDb(): Promise<MapDatabase> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const content = await fs.readFile(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      memoryCache = { ...initialData, ...parsed };
      return memoryCache!;
    } catch {
      await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      memoryCache = { ...initialData };
      return memoryCache;
    }
  } catch (error) {
    console.error('Error ensuring file DB:', error);
    if (!memoryCache) memoryCache = { ...initialData };
    return memoryCache;
  }
}

async function saveFileDb(data: MapDatabase): Promise<void> {
  memoryCache = data;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save to disk:', error);
  }
}

function generateSlug(text: string): string {
  const cyrillicToLatinMap: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye', 'ж': 'zh',
    'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
    'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'yu', 'я': 'ya'
  };

  const latin = text
    .toLowerCase()
    .split('')
    .map(char => cyrillicToLatinMap[char] || char)
    .join('');

  return latin
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `item-${Date.now()}`;
}

export async function getDatabase(): Promise<MapDatabase> {
  const pgConnected = await isPgConnected();
  const pool = getPgPool();

  if (pgConnected && pool) {
    try {
      // 1. Fetch Sections
      const sectionsRes = await pool.query('SELECT page, section_key, content FROM page_sections');
      let hero = initialData.hero;
      let stats = initialData.stats;
      let aboutStory = initialData.aboutStory;

      for (const row of sectionsRes.rows) {
        if (row.page === 'home' && row.section_key === 'hero') hero = { ...hero, ...row.content };
        if (row.page === 'home' && row.section_key === 'stats') stats = { ...stats, ...row.content };
        if (row.page === 'who_we_are' && row.section_key === 'story') aboutStory = { ...aboutStory, ...row.content };
      }

      // 2. Fetch News
      const newsRes = await pool.query('SELECT * FROM news ORDER BY created_at DESC');
      const news: NewsItem[] = newsRes.rows.map(r => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        content: r.content,
        coverImage: r.cover_image,
        youtubeUrl: r.youtube_url,
        date: r.date,
        author: r.author,
        status: r.status,
        tags: r.tags || [],
        views: r.views || 0
      }));

      // 3. Fetch Projects
      const projRes = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
      const projects: ProjectItem[] = projRes.rows.map(r => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        category: r.category,
        status: r.status,
        coverImage: r.cover_image,
        shortDesc: r.short_desc,
        fullDesc: r.full_desc,
        targetAudience: r.target_audience,
        dates: r.dates,
        raisedAmount: Number(r.raised_amount) || 0,
        goalAmount: Number(r.goal_amount) || 100000
      }));

      // 4. Fetch Team
      const teamRes = await pool.query('SELECT * FROM team_members ORDER BY order_index ASC');
      const team: TeamMember[] = teamRes.rows.map(r => ({
        id: r.id,
        name: r.name,
        role: r.role,
        photo: r.photo,
        bio: r.bio,
        order: r.order_index,
        socials: r.socials || {}
      }));

      // 5. Fetch Contacts
      const contactsRes = await pool.query('SELECT * FROM contacts_settings WHERE id = $1', ['default']);
      let contacts = initialData.contacts;
      if (contactsRes.rows.length > 0) {
        const c = contactsRes.rows[0];
        contacts = {
          phone: c.phone,
          email: c.email,
          address: c.address,
          workHours: c.work_hours,
          recipientEmail: c.recipient_email,
          socials: c.socials || initialData.contacts.socials
        };
      }

      // 6. Fetch Inbox
      const inboxRes = await pool.query('SELECT * FROM inbox_messages ORDER BY created_at DESC');
      const inbox: InboxMessage[] = inboxRes.rows.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        subject: r.subject,
        message: r.message,
        isVolunteer: r.is_volunteer,
        createdAt: r.created_at,
        read: r.read
      }));

      return { hero, stats, aboutStory, news, projects, team, contacts, inbox };
    } catch (err) {
      console.warn('PostgreSQL read query failed, falling back to local file DB:', err);
    }
  }

  // Fallback to local JSON file store
  return await ensureFileDb();
}

export async function updateHero(heroUpdates: Partial<HeroContent>): Promise<HeroContent> {
  const pgConnected = await isPgConnected();
  const pool = getPgPool();

  if (pgConnected && pool) {
    try {
      const db = await getDatabase();
      const newHero = { ...db.hero, ...heroUpdates };
      await pool.query(
        `INSERT INTO page_sections (page, section_key, content)
         VALUES ('home', 'hero', $1)
         ON CONFLICT (page, section_key) DO UPDATE SET content = $1, updated_at = NOW()`,
        [JSON.stringify(newHero)]
      );
      return newHero;
    } catch (err) {
      console.warn('PostgreSQL updateHero failed, using file fallback:', err);
    }
  }

  const db = await ensureFileDb();
  db.hero = { ...db.hero, ...heroUpdates };
  await saveFileDb(db);
  return db.hero;
}

export async function updateStats(statsUpdates: Partial<ImpactStats>): Promise<ImpactStats> {
  const pgConnected = await isPgConnected();
  const pool = getPgPool();

  if (pgConnected && pool) {
    try {
      const db = await getDatabase();
      const newStats = { ...db.stats, ...statsUpdates };
      await pool.query(
        `INSERT INTO page_sections (page, section_key, content)
         VALUES ('home', 'stats', $1)
         ON CONFLICT (page, section_key) DO UPDATE SET content = $1, updated_at = NOW()`,
        [JSON.stringify(newStats)]
      );
      return newStats;
    } catch (err) {
      console.warn('PostgreSQL updateStats failed, using file fallback:', err);
    }
  }

  const db = await ensureFileDb();
  db.stats = { ...db.stats, ...statsUpdates };
  await saveFileDb(db);
  return db.stats;
}

export async function updateAboutStory(aboutUpdates: Partial<MapDatabase['aboutStory']>): Promise<MapDatabase['aboutStory']> {
  const pgConnected = await isPgConnected();
  const pool = getPgPool();

  if (pgConnected && pool) {
    try {
      const db = await getDatabase();
      const newStory = { ...db.aboutStory, ...aboutUpdates };
      await pool.query(
        `INSERT INTO page_sections (page, section_key, content)
         VALUES ('who_we_are', 'story', $1)
         ON CONFLICT (page, section_key) DO UPDATE SET content = $1, updated_at = NOW()`,
        [JSON.stringify(newStory)]
      );
      return newStory;
    } catch (err) {
      console.warn('PostgreSQL updateAboutStory failed, using file fallback:', err);
    }
  }

  const db = await ensureFileDb();
  db.aboutStory = { ...db.aboutStory, ...aboutUpdates };
  await saveFileDb(db);
  return db.aboutStory;
}

// News
export async function addNews(item: Omit<NewsItem, 'id' | 'slug'>): Promise<NewsItem> {
  const slug = generateSlug(item.title) + '-' + Math.random().toString(36).substring(2, 6);
  const id = 'news-' + Date.now();
  const newItem: NewsItem = { ...item, id, slug };

  const pgConnected = await isPgConnected();
  const pool = getPgPool();

  if (pgConnected && pool) {
    try {
      await pool.query(
        `INSERT INTO news (id, slug, title, excerpt, content, cover_image, youtube_url, date, author, status, tags, views)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          newItem.id,
          newItem.slug,
          newItem.title,
          newItem.excerpt,
          newItem.content,
          newItem.coverImage,
          newItem.youtubeUrl || '',
          newItem.date,
          newItem.author,
          newItem.status,
          newItem.tags,
          newItem.views || 0
        ]
      );
      return newItem;
    } catch (err) {
      console.warn('PostgreSQL addNews failed, using file fallback:', err);
    }
  }

  const db = await ensureFileDb();
  db.news = [newItem, ...db.news];
  await saveFileDb(db);
  return newItem;
}

export async function updateNews(id: string, updates: Partial<NewsItem>): Promise<NewsItem | null> {
  const pgConnected = await isPgConnected();
  const pool = getPgPool();

  if (pgConnected && pool) {
    try {
      const current = await pool.query('SELECT * FROM news WHERE id = $1 OR slug = $1', [id]);
      if (current.rows.length > 0) {
        const row = current.rows[0];
        const updated: NewsItem = {
          id: row.id,
          slug: row.slug,
          title: updates.title ?? row.title,
          excerpt: updates.excerpt ?? row.excerpt,
          content: updates.content ?? row.content,
          coverImage: updates.coverImage ?? row.cover_image,
          youtubeUrl: updates.youtubeUrl ?? row.youtube_url,
          date: updates.date ?? row.date,
          author: updates.author ?? row.author,
          status: updates.status ?? row.status,
          tags: updates.tags ?? row.tags,
          views: updates.views ?? row.views
        };

        await pool.query(
          `UPDATE news SET title = $1, excerpt = $2, content = $3, cover_image = $4,
           youtube_url = $5, date = $6, author = $7, status = $8, tags = $9, updated_at = NOW()
           WHERE id = $10`,
          [
            updated.title,
            updated.excerpt,
            updated.content,
            updated.coverImage,
            updated.youtubeUrl,
            updated.date,
            updated.author,
            updated.status,
            updated.tags,
            updated.id
          ]
        );
        return updated;
      }
    } catch (err) {
      console.warn('PostgreSQL updateNews failed, using file fallback:', err);
    }
  }

  const db = await ensureFileDb();
  const idx = db.news.findIndex(n => n.id === id || n.slug === id);
  if (idx === -1) return null;

  db.news[idx] = { ...db.news[idx], ...updates };
  await saveFileDb(db);
  return db.news[idx];
}

export async function deleteNews(id: string): Promise<boolean> {
  const pgConnected = await isPgConnected();
  const pool = getPgPool();

  if (pgConnected && pool) {
    try {
      const res = await pool.query('DELETE FROM news WHERE id = $1 OR slug = $1', [id]);
      if ((res.rowCount ?? 0) > 0) return true;
    } catch (err) {
      console.warn('PostgreSQL deleteNews failed, using file fallback:', err);
    }
  }

  const db = await ensureFileDb();
  const prevLen = db.news.length;
  db.news = db.news.filter(n => n.id !== id && n.slug !== id);
  if (db.news.length !== prevLen) {
    await saveFileDb(db);
    return true;
  }
  return false;
}

// Projects
export async function addProject(project: Omit<ProjectItem, 'id' | 'slug'>): Promise<ProjectItem> {
  const slug = generateSlug(project.title) + '-' + Math.random().toString(36).substring(2, 6);
  const id = 'proj-' + Date.now();
  const newProj: ProjectItem = { ...project, id, slug };

  const pgConnected = await isPgConnected();
  const pool = getPgPool();

  if (pgConnected && pool) {
    try {
      await pool.query(
        `INSERT INTO projects (id, slug, title, category, status, cover_image, short_desc, full_desc, target_audience, dates, raised_amount, goal_amount)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          newProj.id,
          newProj.slug,
          newProj.title,
          newProj.category,
          newProj.status,
          newProj.coverImage,
          newProj.shortDesc,
          newProj.fullDesc,
          newProj.targetAudience,
          newProj.dates,
          newProj.raisedAmount || 0,
          newProj.goalAmount || 100000
        ]
      );
      return newProj;
    } catch (err) {
      console.warn('PostgreSQL addProject failed, using file fallback:', err);
    }
  }

  const db = await ensureFileDb();
  db.projects = [newProj, ...db.projects];
  await saveFileDb(db);
  return newProj;
}

export async function updateProject(id: string, updates: Partial<ProjectItem>): Promise<ProjectItem | null> {
  const pgConnected = await isPgConnected();
  const pool = getPgPool();

  if (pgConnected && pool) {
    try {
      const current = await pool.query('SELECT * FROM projects WHERE id = $1 OR slug = $1', [id]);
      if (current.rows.length > 0) {
        const row = current.rows[0];
        const updated: ProjectItem = {
          id: row.id,
          slug: row.slug,
          title: updates.title ?? row.title,
          category: updates.category ?? row.category,
          status: updates.status ?? row.status,
          coverImage: updates.coverImage ?? row.cover_image,
          shortDesc: updates.shortDesc ?? row.short_desc,
          fullDesc: updates.fullDesc ?? row.full_desc,
          targetAudience: updates.targetAudience ?? row.target_audience,
          dates: updates.dates ?? row.dates,
          raisedAmount: updates.raisedAmount ?? Number(row.raised_amount),
          goalAmount: updates.goalAmount ?? Number(row.goal_amount)
        };

        await pool.query(
          `UPDATE projects SET title = $1, category = $2, status = $3, cover_image = $4,
           short_desc = $5, full_desc = $6, target_audience = $7, dates = $8, raised_amount = $9, goal_amount = $10
           WHERE id = $11`,
          [
            updated.title,
            updated.category,
            updated.status,
            updated.coverImage,
            updated.shortDesc,
            updated.fullDesc,
            updated.targetAudience,
            updated.dates,
            updated.raisedAmount,
            updated.goalAmount,
            updated.id
          ]
        );

        // Keep file DB in sync
        try {
          const fileDb = await ensureFileDb();
          const fIdx = fileDb.projects.findIndex(p => p.id === id || p.slug === id);
          if (fIdx !== -1) {
            fileDb.projects[fIdx] = { ...fileDb.projects[fIdx], ...updated };
            await saveFileDb(fileDb);
          }
        } catch {}

        return updated;
      }
    } catch (err) {
      console.warn('PostgreSQL updateProject failed, using file fallback:', err);
    }
  }

  const db = await ensureFileDb();
  const idx = db.projects.findIndex(p => p.id === id || p.slug === id);
  if (idx === -1) return null;

  db.projects[idx] = { ...db.projects[idx], ...updates };
  await saveFileDb(db);
  return db.projects[idx];
}

export async function deleteProject(id: string): Promise<boolean> {
  const pgConnected = await isPgConnected();
  const pool = getPgPool();

  if (pgConnected && pool) {
    try {
      const res = await pool.query('DELETE FROM projects WHERE id = $1 OR slug = $1', [id]);
      if ((res.rowCount ?? 0) > 0) return true;
    } catch (err) {
      console.warn('PostgreSQL deleteProject failed, using file fallback:', err);
    }
  }

  const db = await ensureFileDb();
  const prevLen = db.projects.length;
  db.projects = db.projects.filter(p => p.id !== id && p.slug !== id);
  if (db.projects.length !== prevLen) {
    await saveFileDb(db);
    return true;
  }
  return false;
}

// Team
export async function addTeamMember(member: Omit<TeamMember, 'id'>): Promise<TeamMember> {
  const id = 'team-' + Date.now();
  const newMember: TeamMember = { ...member, id };

  const pgConnected = await isPgConnected();
  const pool = getPgPool();

  if (pgConnected && pool) {
    try {
      await pool.query(
        `INSERT INTO team_members (id, name, role, photo, bio, order_index, socials)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          newMember.id,
          newMember.name,
          newMember.role,
          newMember.photo,
          newMember.bio,
          newMember.order,
          JSON.stringify(newMember.socials || {})
        ]
      );
      return newMember;
    } catch (err) {
      console.warn('PostgreSQL addTeamMember failed, using file fallback:', err);
    }
  }

  const db = await ensureFileDb();
  db.team.push(newMember);
  await saveFileDb(db);
  return newMember;
}

export async function updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> {
  const pgConnected = await isPgConnected();
  const pool = getPgPool();

  if (pgConnected && pool) {
    try {
      const current = await pool.query('SELECT * FROM team_members WHERE id = $1', [id]);
      if (current.rows.length > 0) {
        const row = current.rows[0];
        const updated: TeamMember = {
          id: row.id,
          name: updates.name ?? row.name,
          role: updates.role ?? row.role,
          photo: updates.photo ?? row.photo,
          bio: updates.bio ?? row.bio,
          order: updates.order ?? row.order_index,
          socials: updates.socials ?? row.socials
        };

        await pool.query(
          `UPDATE team_members SET name = $1, role = $2, photo = $3, bio = $4,
           order_index = $5, socials = $6 WHERE id = $7`,
          [
            updated.name,
            updated.role,
            updated.photo,
            updated.bio,
            updated.order,
            JSON.stringify(updated.socials || {}),
            updated.id
          ]
        );
        return updated;
      }
    } catch (err) {
      console.warn('PostgreSQL updateTeamMember failed, using file fallback:', err);
    }
  }

  const db = await ensureFileDb();
  const idx = db.team.findIndex(t => t.id === id);
  if (idx === -1) return null;

  db.team[idx] = { ...db.team[idx], ...updates };
  await saveFileDb(db);
  return db.team[idx];
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  const pgConnected = await isPgConnected();
  const pool = getPgPool();

  if (pgConnected && pool) {
    try {
      const res = await pool.query('DELETE FROM team_members WHERE id = $1', [id]);
      if ((res.rowCount ?? 0) > 0) return true;
    } catch (err) {
      console.warn('PostgreSQL deleteTeamMember failed, using file fallback:', err);
    }
  }

  const db = await ensureFileDb();
  const prevLen = db.team.length;
  db.team = db.team.filter(t => t.id !== id);
  if (db.team.length !== prevLen) {
    await saveFileDb(db);
    return true;
  }
  return false;
}

// Contacts
export async function updateContacts(updates: Partial<ContactInfo>): Promise<ContactInfo> {
  const pgConnected = await isPgConnected();
  const pool = getPgPool();

  if (pgConnected && pool) {
    try {
      const current = await getDatabase();
      const newContacts = { ...current.contacts, ...updates };
      await pool.query(
        `INSERT INTO contacts_settings (id, phone, email, address, work_hours, recipient_email, socials)
         VALUES ('default', $1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
           phone = $1, email = $2, address = $3, work_hours = $4, recipient_email = $5, socials = $6, updated_at = NOW()`,
        [
          newContacts.phone,
          newContacts.email,
          newContacts.address,
          newContacts.workHours,
          newContacts.recipientEmail,
          JSON.stringify(newContacts.socials || {})
        ]
      );
      return newContacts;
    } catch (err) {
      console.warn('PostgreSQL updateContacts failed, using file fallback:', err);
    }
  }

  const db = await ensureFileDb();
  db.contacts = { ...db.contacts, ...updates };
  await saveFileDb(db);
  return db.contacts;
}

// Inbox
export async function addInboxMessage(msg: Omit<InboxMessage, 'id' | 'createdAt' | 'read'>): Promise<InboxMessage> {
  const id = 'msg-' + Date.now();
  const newMsg: InboxMessage = {
    ...msg,
    id,
    createdAt: new Date().toISOString(),
    read: false
  };

  const pgConnected = await isPgConnected();
  const pool = getPgPool();

  if (pgConnected && pool) {
    try {
      await pool.query(
        `INSERT INTO inbox_messages (id, name, email, phone, subject, message, is_volunteer, read, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          newMsg.id,
          newMsg.name,
          newMsg.email,
          newMsg.phone || '',
          newMsg.subject,
          newMsg.message,
          newMsg.isVolunteer,
          newMsg.read
        ]
      );
      return newMsg;
    } catch (err) {
      console.warn('PostgreSQL addInboxMessage failed, using file fallback:', err);
    }
  }

  const db = await ensureFileDb();
  db.inbox = [newMsg, ...(db.inbox || [])];
  await saveFileDb(db);
  return newMsg;
}

// Donations & Raised Amount
export async function donateToProject(params: {
  projectId?: string;
  amount: number;
  frequency?: 'once' | 'monthly';
  paymentMethod?: string;
  donorName?: string;
  donorEmail?: string;
}): Promise<{ project: ProjectItem | null; newRaisedAmount: number; donation: DonationRecord }> {
  const donation: DonationRecord = {
    id: 'don-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    projectId: params.projectId,
    amount: Number(params.amount),
    frequency: params.frequency || 'once',
    paymentMethod: params.paymentMethod || 'card',
    donorName: params.donorName,
    donorEmail: params.donorEmail,
    createdAt: new Date().toISOString(),
  };

  const pgConnected = await isPgConnected();
  const pool = getPgPool();

  if (pgConnected && pool) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS donations (
          id VARCHAR(100) PRIMARY KEY,
          project_id VARCHAR(100),
          amount NUMERIC NOT NULL,
          frequency VARCHAR(20) DEFAULT 'once',
          payment_method VARCHAR(50),
          donor_name VARCHAR(150),
          donor_email VARCHAR(150),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
        )
      `);

      await pool.query(
        `INSERT INTO donations (id, project_id, amount, frequency, payment_method, donor_name, donor_email)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          donation.id,
          donation.projectId || null,
          donation.amount,
          donation.frequency,
          donation.paymentMethod,
          donation.donorName || null,
          donation.donorEmail || null,
        ]
      );

      let updatedProject: ProjectItem | null = null;
      let newRaised = donation.amount;

      if (params.projectId) {
        const updateRes = await pool.query(
          `UPDATE projects 
           SET raised_amount = COALESCE(raised_amount, 0) + $1 
           WHERE id = $2 OR slug = $2 
           RETURNING *`,
          [donation.amount, params.projectId]
        );

        if (updateRes.rows.length > 0) {
          const r = updateRes.rows[0];
          updatedProject = {
            id: r.id,
            slug: r.slug,
            title: r.title,
            category: r.category,
            status: r.status,
            coverImage: r.cover_image,
            shortDesc: r.short_desc,
            fullDesc: r.full_desc,
            targetAudience: r.target_audience,
            dates: r.dates,
            raisedAmount: Number(r.raised_amount || 0),
            goalAmount: Number(r.goal_amount || 100000),
          };
          newRaised = updatedProject.raisedAmount || 0;
        }
      }

      // Keep local file DB backup in sync
      try {
        const fileDb = await ensureFileDb();
        if (!fileDb.donations) fileDb.donations = [];
        fileDb.donations.unshift(donation);
        if (params.projectId) {
          const fProj = fileDb.projects.find(
            (p) => p.id === params.projectId || p.slug === params.projectId
          );
          if (fProj) {
            fProj.raisedAmount = newRaised;
          }
        }
        await saveFileDb(fileDb);
      } catch (syncErr) {
        console.warn('File DB donation sync warning:', syncErr);
      }

      return { project: updatedProject, newRaisedAmount: newRaised, donation };
    } catch (err) {
      console.warn('PostgreSQL donateToProject failed, falling back to file DB:', err);
    }
  }

  // Fallback to JSON file DB
  const db = await ensureFileDb();
  if (!db.donations) db.donations = [];
  db.donations.unshift(donation);

  let updatedProject: ProjectItem | null = null;
  let newRaised = donation.amount;

  if (params.projectId) {
    const proj = db.projects.find(
      (p) => p.id === params.projectId || p.slug === params.projectId
    );
    if (proj) {
      proj.raisedAmount = (proj.raisedAmount || 0) + Number(params.amount);
      updatedProject = { ...proj };
      newRaised = proj.raisedAmount;
    }
  }

  await saveFileDb(db);
  return { project: updatedProject, newRaisedAmount: newRaised, donation };
}

export async function getDonations(): Promise<DonationRecord[]> {
  const pgConnected = await isPgConnected();
  const pool = getPgPool();

  if (pgConnected && pool) {
    try {
      const res = await pool.query('SELECT * FROM donations ORDER BY created_at DESC');
      return res.rows.map((r) => ({
        id: r.id,
        projectId: r.project_id,
        amount: Number(r.amount),
        frequency: r.frequency,
        paymentMethod: r.payment_method,
        donorName: r.donor_name,
        donorEmail: r.donor_email,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      }));
    } catch (err) {
      console.warn('PostgreSQL getDonations failed, falling back to file DB:', err);
    }
  }

  const db = await ensureFileDb();
  return db.donations || [];
}

