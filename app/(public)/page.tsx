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


export default function Home() {

  const router = useRouter();

  return (
    <>
    <div className="min-h-screen">
        <NewsLetterModal/>
        <HeroSection />
        <ServiceSection />
        <FeatureSection />
        <WhySection />
        <CaseSection />
        {/* CTA */}
        <section className="py-32 px-6 lg:px-20">
          <div className="max-w-[1200px] mx-auto">
            <CTASection
              title="Join Us on This Journey"
              description="Partner with a team that's committed to your success and passionate about technology innovation."
              primaryButton={{
                text: 'Work With Us',
                onClick: () => router.push('/contact'),
              }}
              secondaryButton={{
                text: 'View Our Work',
                onClick: () => router.push('/case-studies'),
              }}
            />
          </div>
        </section>
    </div>
    </>
  );
}
