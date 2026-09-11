export interface PageSectionContent {
  [key: string]: any;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  badge: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  imageUrl: string;
}

export interface ImpactStats {
  youthCount: string;
  youthLabel: string;
  projectsCount: string;
  projectsLabel: string;
  citiesCount: string;
  citiesLabel: string;
  yearsCount: string;
  yearsLabel: string;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML or structured content
  coverImage: string;
  youtubeUrl?: string;
  date: string;
  author: string;
  status: 'published' | 'draft';
  tags: string[];
  views?: number;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: 'active' | 'completed';
  coverImage: string;
  shortDesc: string;
  fullDesc: string;
  targetAudience: string;
  dates: string;
  partners?: string[];
  raisedAmount?: number;
  goalAmount?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  order: number;
  socials?: {
    linkedin?: string;
    instagram?: string;
    email?: string;
  };
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  workHours: string;
  recipientEmail: string;
  socials: {
    instagram: string;
    telegram: string;
    facebook: string;
    linkedin: string;
    youtube: string;
  };
}

export interface InboxMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isVolunteer: boolean;
  createdAt: string;
  read: boolean;
}

export interface DonationRecord {
  id: string;
  projectId?: string;
  projectTitle?: string;
  amount: number;
  frequency: 'once' | 'monthly';
  paymentMethod: string;
  donorName?: string;
  donorEmail?: string;
  createdAt: string;
}

export interface MapDatabase {
  hero: HeroContent;
  stats: ImpactStats;
  aboutStory: {
    title: string;
    description: string;
    mission: string;
    vision: string;
    values: Array<{ title: string; desc: string; icon: string }>;
  };
  news: NewsItem[];
  projects: ProjectItem[];
  team: TeamMember[];
  contacts: ContactInfo;
  inbox: InboxMessage[];
  donations?: DonationRecord[];
}
