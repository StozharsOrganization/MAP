-- MAP Platform Supabase Schema (Zero-Rebuild Real-Time Content)

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Page Sections (For Hero, Stats, Mission, and dynamic site blocks)
CREATE TABLE IF NOT EXISTS page_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page VARCHAR(50) NOT NULL,
    section_key VARCHAR(50) NOT NULL,
    content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(page, section_key)
);

-- 3. News / Publications
CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    youtube_url TEXT,
    date VARCHAR(20) NOT NULL,
    author VARCHAR(100) DEFAULT 'Команда MAP',
    status VARCHAR(20) DEFAULT 'published',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    cover_image TEXT,
    short_desc TEXT,
    full_desc TEXT,
    target_audience TEXT,
    dates VARCHAR(100),
    raised_amount NUMERIC DEFAULT 0,
    goal_amount NUMERIC DEFAULT 100000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Team Members
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    role VARCHAR(150) NOT NULL,
    photo TEXT,
    bio TEXT,
    order_index INTEGER DEFAULT 0,
    socials JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Contacts & Settings
CREATE TABLE IF NOT EXISTS contacts_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(50),
    email VARCHAR(100),
    address TEXT,
    work_hours TEXT,
    recipient_email VARCHAR(100),
    socials JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. Inbox (Contact Form & Volunteer Applications)
CREATE TABLE IF NOT EXISTS inbox_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    subject TEXT,
    message TEXT NOT NULL,
    is_volunteer BOOLEAN DEFAULT FALSE,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8. Row Level Security (RLS) Policies
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbox_messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published content
CREATE POLICY "Public Read News" ON news FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public Read Page Sections" ON page_sections FOR SELECT USING (true);
CREATE POLICY "Public Read Team" ON team_members FOR SELECT USING (true);
CREATE POLICY "Public Read Contacts" ON contacts_settings FOR SELECT USING (true);

-- Allow public insert to inbox (contact form submissions)
CREATE POLICY "Public Insert Inbox" ON inbox_messages FOR INSERT WITH CHECK (true);

-- Allow authenticated admins full access
CREATE POLICY "Admin Full News" ON news FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Projects" ON projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Page Sections" ON page_sections FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Team" ON team_members FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Contacts" ON contacts_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Inbox" ON inbox_messages FOR ALL TO authenticated USING (true);
