import Navbar from "@/components/Navbar";
import HeroSection from "./components/HeroSection";
import LiveDemoSection from "./components/LiveDemoSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function LandingPage() {
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
