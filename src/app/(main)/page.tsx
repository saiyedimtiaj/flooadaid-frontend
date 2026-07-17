import FeaturedShelters from "@/components/landing/featured-shelters";
import { HeroSection } from "@/components/landing/hero-section";
import HomeFloodMap from "@/components/landing/home-flood-map-client";
import HowItWorks from "@/components/landing/how-it-works";
import LatestAlerts from "@/components/landing/latest-alerts";
import LiveStatsBar from "@/components/landing/live-stats-bar";
import VolunteerCTA from "@/components/landing/volunteer-cta";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <LiveStatsBar />
      <HomeFloodMap />
      <LatestAlerts/>
      <HowItWorks />
      <FeaturedShelters />
      <VolunteerCTA />
    </div>
  );
}
