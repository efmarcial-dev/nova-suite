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

      {/* Multi-Provider & Compliance Banner */}
      <PartnersAndCompliance />

      {/* How It Works (3-step visual guide) */}
      <HowItWorks />

      {/* Core Platform Capabilities */}
      <FeatureSection />

      {/* Why Executives & Founders Choose Foxly */}
      <WhySection />

      {/* Strict Security, OAuth Scopes & Data Transparency */}
      <DataTransparency />

      {/* Frequently Asked Questions */}
      <FAQSection />

      {/* High-Converting Final Call to Action */}
      <section className="py-24 px-6 lg:px-12 bg-slate-50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <CTASection
            title="Start your 3-day free trial today"
            description="Connect multiple Google and Outlook inboxes, sync your calendars, and experience an intelligent, unified executive workspace. Unlimited usage, no credit card required."
            primaryButton={{
              text: 'Start 3-Day Free Trial →',
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
