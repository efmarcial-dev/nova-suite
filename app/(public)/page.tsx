'use client';

import { useRouter } from 'next/navigation';
import HeroSection from './components/Hero';
import PartnersAndCompliance from './components/PartnersAndCompliance';
import HowItWorks from './components/HowItWorks';
import FeatureSection from './components/FeatureSection';
import WhySection from './components/WhyUs';
import DataTransparency from './components/DataTransparency';
import FAQSection from './components/FAQSection';
import { CTASection } from './components/CTASection';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* The main benefit: a clear set of next steps */}
      <FeatureSection />

      {/* How It Works (3-step visual guide) */}
      <HowItWorks />

      {/* Why Executives & Founders Choose Foxly */}
      <WhySection />

      {/* Connected accounts and security controls */}
      <PartnersAndCompliance />

      {/* Strict Security, OAuth Scopes & Data Transparency */}
      <DataTransparency />

      {/* Frequently Asked Questions */}
      <FAQSection />

      {/* High-Converting Final Call to Action */}
      <section className="py-24 px-6 lg:px-12 bg-slate-50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <CTASection
            title="Find your next best move"
            description="Start with a 3-day free trial, then choose the founding customer annual offer at $60 for 12 months of access. No card required to start and no automatic charge at the end of the trial."
            primaryButton={{
              text: 'Start your 3-day free trial →',
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
  );
}
