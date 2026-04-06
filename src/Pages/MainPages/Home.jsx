import Hero from "../HomePageSections/HeroSection";
import QuickLinks from "../HomePageSections/QuickLinksSection";
import NewsSection from "../HomePageSections/NewsSection";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        <Hero />
        <QuickLinks />
        <NewsSection />
      </main>
    </div>
  );
}
