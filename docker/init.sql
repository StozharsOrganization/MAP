-- MAP Database Initialization Script for Docker PostgreSQL

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Page Sections (Hero, Stats, Mission)
CREATE TABLE IF NOT EXISTS page_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page VARCHAR(50) NOT NULL,
    section_key VARCHAR(50) NOT NULL,
    content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(page, section_key)
);

-- 3. News
CREATE TABLE IF NOT EXISTS news (
    id VARCHAR(100) PRIMARY KEY,
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
    id VARCHAR(100) PRIMARY KEY,
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
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(150) NOT NULL,
    photo TEXT,
    bio TEXT,
    order_index INTEGER DEFAULT 0,
    socials JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Contacts Settings
CREATE TABLE IF NOT EXISTS contacts_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    phone VARCHAR(50),
    email VARCHAR(100),
    address TEXT,
    work_hours TEXT,
    recipient_email VARCHAR(100),
    socials JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. Inbox (Contacts & Volunteer Applications)
CREATE TABLE IF NOT EXISTS inbox_messages (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    subject TEXT,
    message TEXT NOT NULL,
    is_volunteer BOOLEAN DEFAULT FALSE,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- SEED INITIAL DATA

-- Seed Hero Section
INSERT INTO page_sections (page, section_key, content)
VALUES (
    'home',
    'hero',
    '{
        "title": "Створюємо можливості для молоді разом",
        "subtitle": "Асоціація розвитку та соціальної інтеграції молоді MAP об''єднує ініціативних лідерів для реалізації освітніх програм, соціальних проєктів та європейських обмінів.",
        "badge": "MAP • Association for Youth Development and Social Integration",
        "ctaPrimaryText": "Долучитися до проєктів",
        "ctaSecondaryText": "Підтримати асоціацію",
        "imageUrl": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
    }'::jsonb
) ON CONFLICT (page, section_key) DO NOTHING;

-- Seed Stats
INSERT INTO page_sections (page, section_key, content)
VALUES (
    'home',
    'stats',
    '{
        "youthCount": "1,500+",
        "youthLabel": "Активних учасників",
        "projectsCount": "35+",
        "projectsLabel": "Реалізованих проєктів",
        "citiesCount": "14",
        "citiesLabel": "Міст в Україні",
        "yearsCount": "5",
        "yearsLabel": "Років успішної діяльності"
    }'::jsonb
) ON CONFLICT (page, section_key) DO NOTHING;

-- Seed Story
INSERT INTO page_sections (page, section_key, content)
VALUES (
    'who_we_are',
    'story',
    '{
        "title": "Хто ми такі та наша історія",
        "description": "MAP (Association for Youth Development and Social Integration) — це неприбуткова громадська організація, заснована командою активних молодіжних лідерів та педагогів. Наша мета — надання інструментів для персонального зростання та розвитку громадянських навичок у сучасному суспільстві.",
        "mission": "Сприяти всебічному розвитку, самореалізації та соціальній інтеграції молоді через неформальну освіту, лідерські тренінги та волонтерські ініціативи.",
        "vision": "Суспільство, в якому кожен молодий громадянин має рівні можливості, простір для інновацій та впевненість у власному майбутньому.",
        "values": [
            {"title": "Соціальна інтеграція", "desc": "Створення відкритого простору для кожного.", "icon": "Users"},
            {"title": "Неформальна освіта", "desc": "Практичні знання та софт-скіли.", "icon": "BookOpen"},
            {"title": "Міжнародна співпраця", "desc": "Партнерства та обміни Erasmus+.", "icon": "Globe"},
            {"title": "Прозорість та довіра", "desc": "Відкрита публічна звітність.", "icon": "ShieldCheck"}
        ]
    }'::jsonb
) ON CONFLICT (page, section_key) DO NOTHING;

-- Seed News
INSERT INTO news (id, slug, title, date, author, excerpt, cover_image, youtube_url, status, tags, views, content)
VALUES
(
    'news-1',
    'reiestratsiia-na-volonterskyi-proiekt-vidkryta',
    'Реєстрація на волонтерський проєкт відкрита',
    '27.06.2023',
    'Команда MAP',
    'Реєстрація на волонтерський проєкт відкрита для всіх охочих спробувати себе в ролі координатора подій.',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'published',
    ARRAY['Волонтерство', 'Молодь', 'Анонс'],
    420,
    '<h3>Про що цей проєкт?</h3><p>Ми відкриваємо набір координаторів та активних волонтерів на осінній сезон проєктів MAP.</p><blockquote>«Волонтерство в MAP стало для мене стартом у міжнародних проєктах», — ділиться випускниця Олена.</blockquote>'
),
(
    'news-2',
    'zvit-pro-uspishnyi-seminar',
    'Звіт про успішний семінар',
    '27.06.2023',
    'Оргкомітет MAP',
    'Звіт про успішний семінар комунікаційних компетенцій та дебатів для молодіжних лідерів.',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    '',
    'published',
    ARRAY['Семінар', 'Освіта', 'Звіт'],
    315,
    '<h3>Підсумки триденного інтенсиву</h3><p>Минулого вікенду відбувся триденний семінар із публічних виступів та комунікаційних компетенцій.</p>'
),
(
    'news-3',
    'poperednii-osvitnii-seminar',
    'Попередній освітній семінар',
    '26.06.2023',
    'Оргкомітет MAP',
    'Підсумки та відеозаписи попереднього освітнього семінару для молодих підприємців.',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    'published',
    ARRAY['Освіта', 'Лідерство'],
    280,
    '<h3>Презентація матеріалів заходу</h3><p>Ділимося матеріалами та презентаціями спікерів із попередньої зустрічі.</p>'
) ON CONFLICT (id) DO NOTHING;

-- Seed Projects
INSERT INTO projects (id, slug, title, category, status, cover_image, short_desc, full_desc, target_audience, dates, raised_amount, goal_amount)
VALUES
(
    'proj-1',
    'youth-leadership-academy',
    'Академія молодіжного лідерства',
    'Освіта & Софт-скіли',
    'active',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    'Річна програма розвитку лідерських якостей, проєктного менеджменту та публічних виступів для молоді 16-25 років.',
    'Академія передбачає 6 навчальних модулів, практичні завдання та менторську підтримку.',
    'Молодь 16-25 років',
    'Вересень 2024 - Травень 2025',
    75000,
    100000
),
(
    'proj-2',
    'social-integration-hub',
    'Хаб соціальної інтеграції',
    'Соціальна дія',
    'active',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    'Простір психологічної підтримки, арт-терапії та адаптації для внутрішньо переміщеної молоді.',
    'Щотижневі зустрічі, клуб розмовної англійської та спільні волонтерські акції.',
    'ВПО та місцева молодь',
    'Постійно діючий',
    120000,
    120000
),
(
    'proj-3',
    'digital-skills-lab',
    'Лабораторія цифрових навичок',
    'Технології',
    'completed',
    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    'Безкоштовні курси цифрової грамотності, базового веб-дизайну та кібергігієни.',
    'Понад 300 молодих людей успішно пройшли навчання та презентували свої проєкти.',
    'Студенти та старшокласники',
    'Січень 2024 - Червень 2024',
    90000,
    90000
) ON CONFLICT (id) DO NOTHING;

-- Seed Team
INSERT INTO team_members (id, name, role, photo, bio, order_index, socials)
VALUES
(
    'team-1',
    'Олександр Шевченко',
    'Голова правління MAP',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    'Громадський діяч, фасилітатор молодіжних програм із понад 7 роками досвіду.',
    1,
    '{"linkedin": "https://linkedin.com", "email": "oleksandr@map-ngo.org"}'::jsonb
),
(
    'team-2',
    'Марія Ковальчук',
    'Координаторка освітніх програм',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80',
    'Експертка з неформальної освіти, випускниця програм Erasmus+.',
    2,
    '{"linkedin": "https://linkedin.com", "email": "maria@map-ngo.org"}'::jsonb
),
(
    'team-3',
    'Богдан Мельник',
    'Керівник міжнародних партнерств',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
    'Відповідає за грантові заявки та європейські молодіжні обміни.',
    3,
    '{"linkedin": "https://linkedin.com", "email": "bogdan@map-ngo.org"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Seed Contacts
INSERT INTO contacts_settings (id, phone, email, address, work_hours, recipient_email, socials)
VALUES (
    'default',
    '+380 (44) 345-67-89',
    'info@map-association.org',
    'вул. Хрещатик, 22, оф. 405, м. Київ, 01001, Україна',
    'Пн - Пт: 10:00 - 18:00 (Сб, Нд: за розкладом подій)',
    'admin@map-association.org',
    '{
        "instagram": "https://instagram.com",
        "telegram": "https://t.me",
        "facebook": "https://facebook.com",
        "linkedin": "https://linkedin.com",
        "youtube": "https://youtube.com"
    }'::jsonb
) ON CONFLICT (id) DO NOTHING;
