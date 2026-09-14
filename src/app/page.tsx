import { getDatabase } from '../lib/data/store';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import InteractiveMapSection from '../components/InteractiveMapSection';
import HomeNewsSection from '../components/HomeNewsSection';
import HomeProjectsSection from '../components/HomeProjectsSection';
import MissionSection from '../components/MissionSection';
import TestimonialsSection from '../components/TestimonialsSection';
import PartnersSection from '../components/PartnersSection';

// ISR: Cache page for 60s, revalidatePath() in actions provides instant updates on content edit
export const revalidate = 60;

export default async function HomePage() {
  const db = await getDatabase();

  return (
    <div className="flex flex-col">
      {/* 1. Hero Banner */}
      <HeroSection initialHero={db.hero} />

      {/* 2. Impact Counters */}
      <StatsSection initialStats={db.stats} />

      {/* 3. Interactive Map of 14 Ukrainian Regional Hubs */}
      <InteractiveMapSection />

      {/* 4. Programs & Projects */}
      <HomeProjectsSection projects={db.projects} />

      {/* 5. News & Announcements */}
      <HomeNewsSection news={db.news} />

      {/* 6. Mission & Values */}
      <MissionSection initialStory={db.aboutStory} />

      {/* 7. Alumni & Participant Stories (Social Proof) */}
      <TestimonialsSection />

      {/* 8. Institutional Partners & Donors */}
      <PartnersSection />
    </div>
  );
}
