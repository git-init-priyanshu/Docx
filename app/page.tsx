import FeaturesSection from "./components/FeaturesSection";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function Component() {
  return (
    <div className="flex flex-col min-h-[100dvh] overflow-hidden">
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        {/* <AboutSection /> */}
        {/* <ContactSection /> */}
        <Footer />
      </main>
    </div>
  );
}
