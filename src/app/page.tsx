/**
 * Home page: a recreation of wegame.com.cn/home.
 *
 * This file stays a Server Component: it only lists the pages in order.
 * Each page is its own component in src/components/home (order must match
 * `pages` in src/data/home.ts). <PageFlow> turns them into a full-screen
 * slideshow on wide screens; elsewhere they simply stack and scroll.
 */
import KvSection from "@/components/home/KvSection";
import TopicSection from "@/components/home/TopicSection";
import FrameSection from "@/components/home/FrameSection";
import FeatureSection from "@/components/home/FeatureSection";
import TeamSection from "@/components/home/TeamSection";
import UniversitySection from "@/components/home/UniversitySection";
import MoreSection from "@/components/home/MoreSection";
import PageFlow from "@/components/home/PageFlow";
import SideNav from "@/components/layout/SideNav";

export default function Home() {
  return (
    <>
      <main className="home-flow">
        {/* One h1 per page for accessibility/SEO; the visible titles are images. */}
        <h1 className="sr-only">WeGame：一起更好玩</h1>

        <KvSection />
        <TopicSection />
        <FrameSection />
        <FeatureSection />
        <TeamSection />
        <UniversitySection />
        <MoreSection />
      </main>

      {/* Outside <main>: in full-page mode <main> is its own layer below the
          footer, and the TOP button must stay above the footer. */}
      <SideNav />
      <PageFlow />
    </>
  );
}
