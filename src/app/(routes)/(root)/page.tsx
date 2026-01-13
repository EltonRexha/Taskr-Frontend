import { CTA } from "./_components/Cta";
import { Deploy } from "./_components/Deploy";
import { Features } from "./_components/Features";
import { Footer } from "./_components/Footer";
import { LandingHeader } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { OpenSource } from "./_components/OpenSource";

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
  )
}
