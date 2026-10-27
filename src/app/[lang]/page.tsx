import { getDatabase } from '../../lib/data/store';
import HeroSection from '../../components/HeroSection';
import MissionSection from '../../components/MissionSection';
import StatsSection from '../../components/StatsSection';
import HomeProjectsSection from '../../components/HomeProjectsSection';
import HomeNewsSection from '../../components/HomeNewsSection';
import TestimonialsSection from '../../components/TestimonialsSection';
import PartnersSection from '../../components/PartnersSection';

// ISR: Cache page for 60s, revalidatePath() in actions provides instant updates on content edit
export const revalidate = 60;

export default async function HomePage() {
  const db = await getDatabase();

  return (
    <div className="flex flex-col">
      {/* 1. Hero Banner */}
      <HeroSection initialHero={db.hero} />

      {/* 2. Mission & Values (Місія та бачення) */}
      <MissionSection initialStory={db.aboutStory} />

      {/* 3. Impact Counters */}
      <StatsSection initialStats={db.stats} />

      {/* 4. Programs & Projects */}
      <HomeProjectsSection projects={db.projects} />

      {/* 5. News & Announcements */}
      <HomeNewsSection news={db.news.filter(n => n.status === 'published')} />

      {/* 6. Alumni & Participant Stories (Social Proof) */}
      <TestimonialsSection />

      {/* 7. Institutional Partners & Donors */}
      <PartnersSection />
    </div>
  );
}
