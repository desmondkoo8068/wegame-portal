/**
 * Home page: a recreation of wegame.com.cn/home.
 *
 * This file stays a Server Component: it only lists the full-screen pages in
 * order. Each page is its own component in src/components/home, and the
 * order here must match `pages` in src/data/home.ts (used by the side nav).
 */
import KvSection from "@/components/home/KvSection";
import TopicSection from "@/components/home/TopicSection";
import { FrameFastSection, FrameUpdateSection } from "@/components/home/FrameSections";
import FeatureSection from "@/components/home/FeatureSection";
import { TeamUpSection, TeamWorldSection } from "@/components/home/TeamSections";
import UniversitySection from "@/components/home/UniversitySection";
import MoreSection from "@/components/home/MoreSection";
import SideNav from "@/components/layout/SideNav";
import PageTracker from "@/components/layout/PageTracker";

export default function Home() {
  return (
    <main>
      {/* One h1 per page for accessibility/SEO; the visible titles are images. */}
      <h1 className="sr-only">WeGame：一起更好玩</h1>

      <KvSection />
      <TopicSection />
      <FrameUpdateSection />
      <FrameFastSection />
      <FeatureSection />
      <TeamUpSection />
      <TeamWorldSection />
      <UniversitySection />
      <MoreSection />

      <SideNav />
      <PageTracker />
    </main>
  );
}
