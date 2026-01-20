import { CTA } from "../../../features/home/components/Cta";
import { Deploy } from "../../../features/home/components/Deploy";
import { Features } from "../../../features/home/components/Features";
import { Footer } from "../../../features/home/components/Footer";
import { LandingHeader } from "../../../features/home/components/Header";
import { Hero } from "../../../features/home/components/Hero";
import { OpenSource } from "../../../features/home/components/OpenSource";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <Hero />
        <Features />
        <OpenSource />
        <Deploy />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
