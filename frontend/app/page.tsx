import { Header } from "@/components/header";

import CTA from "@/components/cta";
import Featured from "@/components/featured";
import FeaturesSection from "@/components/features-section";
import Footer from "@/components/footer";
import HowItWorks from "@/components/how-it-works";
import Hero from "@/components/hero";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <HowItWorks />
      <FeaturesSection />
      <Featured />
      <CTA />
      <Footer />
    </div>
  );
}
