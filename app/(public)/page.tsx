'use client'
import HeroSection from "./components/Hero";
import NewsLetterModal from "../components/NewsLetterModal";
import ServiceSection from "./components/Services";
import WhySection from "./components/WhyUs";
import CaseSection from "./components/CaseStudies";
import FeatureSection from "./components/FeatureSection";
import CTASec from "./components/CTA";
import { CTASection } from "./components/CTASection";
import { useRouter } from "next/navigation";
import UnravelingFlow from './components/UravelingFlow';
import DataTransparency from './components/DataTransparency';


export default function Home() {

  const router = useRouter();

  return (
    <>
    <div className="min-h-screen">
        <NewsLetterModal/>
        <HeroSection />
        <UnravelingFlow />
        <DataTransparency />
        <ServiceSection />
        <FeatureSection />
        <WhySection />
        <CaseSection />
        {/* CTA */}
        <section className="py-32 px-6 lg:px-20">
          <div className="max-w-[1200px] mx-auto">
            <CTASection
              title="Your Executive Workspace Is Ready"
              description="Connect your Gmail or Outlook inbox, Google or Microsoft calendar, and start your first AI-powered briefing in under 5 minutes."
              primaryButton={{
                text: 'Get Started Free →',
                onClick: () => router.push('/register'),
              }}
              secondaryButton={{
                text: 'Sign In to Dashboard',
                onClick: () => router.push('/login'),
              }}
            />
          </div>
        </section>
    </div>
    </>
  );
}
