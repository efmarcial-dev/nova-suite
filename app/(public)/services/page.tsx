"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Button } from '../components/Button';
import { PricingTable } from './components/PricingTable';
import { FAQ } from './components/FAQ';
import { CTASection } from '../components/CTASection';
import { 
  Brain, 
  Code2, 
  Palette, 
  Check,
  TrendingUp,
  Database,
  Cloud,
  Lock,
  Sparkles,
  Workflow,
  BarChart3,
  Settings
} from 'lucide-react';
import CodeSnippets from "./components/CodeSnippet";


// Add global type for window.VANTA
declare global {
    interface Window {
        VANTA: any;
    }
}


export default function ServicesPage() {
  const router = useRouter();

  const vantaRef = useRef<HTMLDivElement>(null);
    const vantaEffect = useRef<{ destroy: () => void } | null>(null);
    const [vantaLoaded, setVantaLoaded] = useState(false);

    useEffect(() => {
        // Function to load external script
        const loadScript = (src: string) => {
            return new Promise<void>((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) {
                    resolve();
                    return;
                }

                const script = document.createElement("script");
                script.src = src;
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject();
                document.body.appendChild(script);
            });
        };

        const initVanta = async () => {
            try {
                // Load Three.js first
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js');
        
                // Then load Vanta NET
                //await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js');
                await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js')
                
                setVantaLoaded(true);

            }catch (error) {
                console.error("Error loading Vanta.js:", error);
            }
        }

        initVanta();

    }, [])

    useEffect(() => {
        if (vantaLoaded && vantaRef.current && window.VANTA) {
            // Initialize Vanta effect
            vantaEffect.current = window.VANTA.GLOBE({
                el: vantaRef.current,
                mouseControls:false,
                touchControls: false,
                gyroControls: true,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: '#a3a3a3', // network lines
                backgroundColor: 'white', // Tailwind's gray-100 //background
                points: 15.00,
                maxDistance: 20.00,
                spacing: 15.00
            });
        }

        return () => {
            if(vantaEffect.current){
                vantaEffect.current.destroy();
            }
        };
    }, [vantaLoaded]);

  const technologies = [
    'React', 'Next.js', 'Node.js', 'Python', 'TypeScript',
    'AWS', 'Azure', 'PostgreSQL', 'MongoDB', 'Docker',
    'Kubernetes', 'TensorFlow', 'PyTorch', 'OpenAI'
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Discovery & Strategy',
      description: 'We analyze your business needs, goals, and technical requirements to create a tailored roadmap.',
    },
    {
      number: '02',
      title: 'Design & Architecture',
      description: 'Our team designs scalable solutions with modern architecture principles and best practices.',
    },
    {
      number: '03',
      title: 'Development & Testing',
      description: 'Agile development with continuous integration, rigorous testing, and quality assurance.',
    },
    {
      number: '04',
      title: 'Deployment & Support',
      description: 'Smooth deployment to production with ongoing monitoring, optimization, and dedicated support.',
    },
  ];

  return (
    <div className="">
      {/* Hero Section */}
      <section ref={vantaRef} className="relative py-32 px-6 lg:px-20 overflow-hidden"
        style={{
                    height: '90vh',
                    minHeight: '400px',  // Ensures it's never too small
                    maxHeight: '900px'   // Ensures it's never too large
                    }}
      >
        

        <div className="relative z-10 max-w-[1400px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-[#4E7BFF]/10 border border-[#4E7BFF]/20 rounded-full text-[#4E7BFF] text-sm">
              Our Services
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl mb-8 max-w-5xl mx-auto leading-tight"
          >
            Enterprise Solutions Built for Scale
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            From AI-powered automation to custom enterprise software, we deliver cutting-edge solutions that drive measurable business results.
          </motion.p>
        
        <div className="mt-12 max-w-4xl mx-auto">
          <CodeSnippets />
        </div>

        </div>
      </section>

      

      {/* AI & Automation */}
      <section id="ai" className="relative py-32 px-6 lg:px-20 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex p-4 rounded-xl bg-[#4E7BFF]/10 text-[#4E7BFF] mb-6">
                <Brain size={40} />
              </div>
              <h2 className="mb-6 text-black text-lg">AI & Automation</h2>
              <p className="text-xl text-gray-600 mb-8">
                Leverage artificial intelligence and intelligent automation to reduce costs, increase efficiency, and unlock new capabilities.
              </p>
              <Button variant="primary" onClick={() => router.push('/contact')}>
                Get Started with AI
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {[
                { icon: <Sparkles size={20} />, title: 'Machine Learning Models', desc: 'Custom ML models for prediction, classification, and optimization' },
                { icon: <Workflow size={20} />, title: 'Process Automation', desc: 'Automate repetitive tasks and complex workflows with AI agents' },
                { icon: <BarChart3 size={20} />, title: 'Predictive Analytics', desc: 'Data-driven insights for better decision making' },
                { icon: <Brain size={20} />, title: 'Natural Language Processing', desc: 'Chatbots, sentiment analysis, and document processing' },
                { icon: <Settings size={20} />, title: 'Computer Vision', desc: 'Image recognition, object detection, and visual inspection' },
                { icon: <TrendingUp size={20} />, title: 'AI Integration', desc: 'Seamlessly integrate AI into your existing systems' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 border border-[#4E7BFF]/10 hover:border-[#4E7BFF]/30 transition-all"
                >
                  <div className="flex-shrink-0 p-2 rounded-lg bg-[#4E7BFF]/10 text-[#4E7BFF]">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="mb-1">{item.title}</h4>
                    <p className="text-sm text-[#A9B3C9]">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Custom Software & IT Systems */}
      <section id="software" className="relative py-32 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1 space-y-4"
            >
              {[
                { icon: <Code2 size={20} />, title: 'Custom Web Applications', desc: 'Scalable, secure apps built with modern frameworks' },
                { icon: <Database size={20} />, title: 'API Development', desc: 'RESTful and GraphQL APIs for seamless integration' },
                { icon: <Cloud size={20} />, title: 'Cloud Architecture', desc: 'AWS, Azure, and Google Cloud infrastructure design' },
                { icon: <Lock size={20} />, title: 'Enterprise Security', desc: 'Penetration testing, security audits, and compliance' },
                { icon: <Settings size={20} />, title: 'DevOps & CI/CD', desc: 'Automated deployment pipelines and monitoring' },
                { icon: <Database size={20} />, title: 'Database Design', desc: 'Optimized data architecture for performance and scale' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: -10 }}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 border border-[#4E7BFF]/10 hover:border-[#4E7BFF]/30 transition-all"
                >
                  <div className="flex-shrink-0 p-2 rounded-lg bg-[#4E7BFF]/10 text-[#4E7BFF]">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="mb-1">{item.title}</h4>
                    <p className="text-sm text-[#A9B3C9]">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="inline-flex p-4 rounded-xl bg-[#4E7BFF]/10 text-[#4E7BFF] mb-6">
                <Code2 size={40} />
              </div>
              <h2 className="mb-6 text-lg">Custom Software & IT Systems</h2>
              <p className="text-xl text-gray-600 mb-8">
                Enterprise-grade software tailored to your unique business requirements, workflows, and scalability needs.
              </p>
              <Button variant="primary" onClick={() => router.push('/contact')}>
                Discuss Your Project
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Web Development */}
      <section id="web" className="relative py-32 px-6 lg:px-20 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex p-4 rounded-xl bg-[#4E7BFF]/10 text-[#4E7BFF] mb-6">
                <Palette size={40} />
              </div>
              <h2 className="mb-6 text-lg">Web Development</h2>
              <p className="text-xl text-gray-600 mb-8">
                High-performance, responsive websites and web applications built with cutting-edge technologies and modern design principles.
              </p>
              <Button variant="primary" onClick={() => router.push('/contact')}>
                Start Your Project
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {[
                'Modern responsive design with mobile-first approach',
                'Progressive Web Apps (PWAs) for app-like experiences',
                'E-commerce platforms with payment integration',
                'Content Management Systems (CMS)',
                'Performance optimization and Core Web Vitals',
                'SEO optimization and technical SEO audits',
                'Conversion rate optimization (CRO)',
                'Web accessibility (WCAG compliance)',
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-[#4E7BFF]/10"
                >
                  <Check size={20} className="text-[#4E7BFF] flex-shrink-0" />
                  <span className="text-gray-600">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-32 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
          
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-[#4E7BFF]/10 border border-[#4E7BFF]/20 rounded-full text-[#4E7BFF] text-sm mb-8">
              <h3>Transparent Pricing</h3>
            </span>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              Choose the package that fits your needs. All plans include dedicated support and ongoing maintenance.
            </p>
          </motion.div>

          <PricingTable />
        </div>
      </section>

      {/* How We Work */}
      <section id="process" className="relative py-32 px-6 lg:px-20 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
          
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          > 
          <span className="inline-block px-4 py-2 bg-[#4E7BFF]/10 border border-[#4E7BFF]/20 rounded-full text-[#4E7BFF] text-sm mb-8">
              <h3>Our Process</h3>
            </span>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A proven methodology that ensures successful delivery and exceeds expectations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-6xl text-blue-600 mb-4">{step.number}</div>
                <h3 className="mb-3 text-black">{step.title}</h3>
                <p className="text-gray-500">{step.description}</p>
                
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#4E7BFF] to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="relative py-32 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="inline-block px-4 py-2 bg-[#4E7BFF]/10 border border-[#4E7BFF]/20 rounded-full text-[#4E7BFF] text-sm mb-8">
              <h3>Technologies We Use</h3>
            </span>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We work with cutting-edge technologies to build future-proof solutions.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="px-6 py-3 bg-gradient-to-br from-white/5 to-white/[0.02] border border-[#4E7BFF]/20 rounded-lg hover:border-[#4E7BFF]/50 hover:bg-[#4E7BFF]/10 transition-all cursor-default"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-32 px-6 lg:px-20 bg-white">
        <div className="max-w-[1000px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-[#4E7BFF]/10 border border-[#4E7BFF]/20 rounded-full text-[#4E7BFF] text-sm mb-8">
              <h3>Frequently Asked Questions</h3>
            </span>
            
            
            <p className="text-xl text-gray-600">
              Have questions? We've got answers.
            </p>
          </motion.div>

          <FAQ />
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 lg:px-20">
        <div className="max-w-[1200px] mx-auto">
          <CTASection
            title="Ready to Build Something Amazing?"
            description="Let's turn your vision into reality with cutting-edge technology and expert execution."
            primaryButton={{
              text: 'Start Your Project',
              onClick: () => router.push('/contact'),
            }}
            secondaryButton={{
              text: 'View Portfolio',
              onClick: () => router.push('/case-studies'),
            }}
          />
        </div>
      </section>
    </div>
  );
}
