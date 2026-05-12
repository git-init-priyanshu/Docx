import { redirect } from "next/navigation";

import getServerSession from "@/lib/customHooks/getServerSession";
import Navbar from "@/components/Navbar";
import HeroSection from "./components/HeroSection";
import LiveDemoSection from "./components/LiveDemoSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default async function LandingPage() {
  const session = await getServerSession();
  if (session?.id) redirect("/document");

  return (
    <div style={{ background: "var(--lp-paper)" }}>
      <Navbar />
      <main>
        <HeroSection />
        <LiveDemoSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
