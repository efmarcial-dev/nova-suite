
import HeroSection from "./components/Hero";
import NewsLetterModal from "../components/NewsLetterModal";
import ServiceSection from "./components/Services";
import WhySection from "./components/WhyUs";
import CaseSection from "./components/CaseStudies";
import FeatureSection from "./components/FeatureSection";
import CTASec from "./components/CTA";


export default function Home() {

  

  return (
    <>
    <div className="min-h-screen">
        <NewsLetterModal/>
        <HeroSection />
        <ServiceSection />
        <FeatureSection />
        <WhySection />
        <CaseSection />
        <CTASec />
    </div>
    </>
  );
}
