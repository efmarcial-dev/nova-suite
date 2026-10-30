'use client'
import {motion} from 'motion/react';
import { useRouter } from 'next/navigation';
import { Target, Shield, Heart, Lightbulb, Eye, Award, TrendingUp} from "lucide-react";
import { GeometricShape } from '../components/GeometricShape';
import { Button } from '../components/Button';
import CTASec from '../components/CTA';
import { CTASection } from '../components/CTASection';
import { ParticleField } from '../components/ParticleField';

export default function AboutPage(){

    const router = useRouter();

    const timeline = [
            { year: '2018', title: 'Founded', description: 'Foxly was born with a mission to bring intelligence, flow, and effortless productivity to daily work.' },
            { year: '2019', title: 'First Major Client', description: 'Secured partnership with Fortune 500 financial institution.' },
            { year: '2021', title: 'AI Division', description: 'Launched dedicated AI and machine learning practice.' },
            { year: '2023', title: 'National Expansion', description: 'Expanded operations to serve clients across all 50 states.' },
            { year: '2025', title: 'Industry Leader', description: 'Recognized as top IT solutions provider with 500+ successful projects.' },
        ];

    const values = [
            {
            icon: <Target size={28} />,
            title: 'Results-Driven',
            description: 'We measure success by your success. Every solution is designed to deliver measurable ROI.',
            },
            {
            icon: <Lightbulb size={28} />,
            title: 'Innovation First',
            description: 'We stay ahead of technology trends to provide cutting-edge solutions that future-proof your business.',
            },
            {
            icon: <Shield size={28} />,
            title: 'Security & Trust',
            description: 'Enterprise-grade security and transparent communication in everything we do.',
            },
            {
            icon: <Heart size={28} />,
            title: 'Client Partnership',
            description: 'We build long-term relationships, not transactions. Your success is our mission.',
            },
        ];

  return (
    <>
        <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex items-center justify-center overflow-hidden pt-12 sm:pt-16">
        
        <ParticleField />
        <div className="relative z-10 mx-auto flex flex-1 flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-[#1EA0FF]/10 border border-[#1EA0FF]/20 rounded-full text-[#1EA0FF] text-sm">
              About Us
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 max-w-5xl mx-auto text-[clamp(2rem,8vw,3rem)] leading-tight sm:mb-8 sm:text-5xl lg:text-7xl"
          >
            Transforming Businesses Through Technology
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 max-w-3xl mx-auto text-base text-gray-700 sm:mb-12 sm:text-lg lg:text-xl"
          >
            We're a team of engineers, designers, and strategists passionate about building technology solutions that drive real business value.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 max-w-4xl mx-auto"
          >
            {[
              { value: '500+', label: 'Projects Delivered' },
              { value: '98%', label: 'Client Satisfaction' },
              { value: '50+', label: 'Team Members' },
              { value: '7 Years', label: 'In Business' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl text-[#1EA0FF] mb-2">{stat.value}</div>
                <div className="text-sm text-[#A9B3C9]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative overflow-x-clip py-16 px-4 sm:py-20 sm:px-6 lg:py-32 lg:px-20 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-6 sm:p-8 lg:p-10 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-gray-200 shadow-md"
            >
              <div className="inline-flex p-4 rounded-xl bg-[#1EA0FF]/10 text-[#1EA0FF] mb-6">
                <Target size={32} />
              </div>
              <h2 className="mb-6 text-xl font-semibold">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                To empower businesses with cutting-edge technology solutions that drive growth, efficiency, and innovation. We believe every organization deserves access to enterprise-grade software and AI capabilities, regardless of size.
              </p>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#1EA0FF]/10 rounded-full blur-3xl" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-6 sm:p-8 lg:p-10 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-gray-200 shadow-lg"
            >
              <div className="inline-flex p-4 rounded-xl bg-[#1EA0FF]/10 text-[#1EA0FF] mb-6">
                <Eye size={32} />
              </div>
              <h2 className="mb-6 text-xl font-semibold">Our Vision</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                To be the most trusted technology partner for businesses across America, recognized for excellence in AI innovation, software craftsmanship, and client success. We envision a future where technology seamlessly amplifies human potential.
              </p>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#1EA0FF]/10 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative py-10 px-6 lg:px-20">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-block px-4 py-2 bg-[#1EA0FF]/10 border border-[#1EA0FF]/20 rounded-full text-[#1EA0FF] text-sm mb-8">
              <h3>Our Journey</h3>
            </span>
            <p className="text-xl text-gray-500">
              From startup to industry leader, here's how we've grown.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-[#1EA0FF]/50 to-transparent hidden lg:block" />

            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`relative flex items-center mb-16 last:mb-0 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:pl-16 lg:text-left'}`}>
                  <div className="inline-block px-4 py-2 bg-[#1EA0FF]/10 border border-[#1EA0FF]/20 rounded-full text-[#1EA0FF] mb-4">
                    {item.year}
                  </div>
                  <h3 className="mb-3">{item.title}</h3>
                  <p className="text-[#A9B3C9]">{item.description}</p>
                </div>

                {/* Center dot */}
                <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[#1EA0FF] border-4 border-[#0A0F1F] z-10" />

                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach / Values */}
      <section className="relative py-16 px-4 sm:py-20 sm:px-6 lg:py-32 lg:px-20 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-[#1EA0FF]/10 border border-[#1EA0FF]/20 rounded-full text-[#1EA0FF] text-sm mb-8">
              <h3>Our Values</h3>
            </span>
            
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              These principles guide every decision we make and every solution we build.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-[#1EA0FF]/10 hover:border-[#1EA0FF]/30 transition-all"
              >
                <motion.div
                  className="inline-flex p-3 rounded-lg bg-[#1EA0FF]/10 text-[#1EA0FF] mb-6"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {value.icon}
                </motion.div>
                <h3 className="mb-3 font-semibold">{value.title}</h3>
                <p className="text-gray-500 text-sm">{value.description}</p>

                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#1EA0FF]/5 rounded-full blur-2xl" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Spotlight */}
      <section className="relative py-16 px-4 sm:py-20 sm:px-6 lg:py-32 lg:px-20">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#0D1B2A]" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSg3OCwgMTIzLCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
            
            <div className="relative p-12 lg:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#1EA0FF] to-[#007CE8] flex items-center justify-center text-4xl mb-6">
                    EF
                  </div>
                  <h2 className="mb-2 text-white font-semibold text-lg">Eduardo Fajardo</h2>
                  <p className="text-[#1EA0FF] mb-6">Founder & CEO</p>
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="flex items-center space-x-2">
                      <Award size={20} className="text-[#1EA0FF]" />
                      <span className="text-sm text-white">20+ Years Experience</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp size={20} className="text-[#1EA0FF]" />
                      <span className="text-sm text-[#A9B3C9]">Former CTO</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-lg text-[#DCE1EB] leading-relaxed">
                    "Technology should empower, not complicate. That's why we focus on building solutions that are powerful yet intuitive, cutting-edge yet reliable."
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    With over two decades in enterprise technology and AI, Eduardo founded Foxly to bridge the gap between fragmented tools and intelligent, automated daily workflows. He's led digital transformations for Fortune 500 companies and helped hundreds of businesses leverage AI for competitive advantage.
                  </p>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="sm">
                      Connect on LinkedIn
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:py-20 sm:px-6 lg:py-32 lg:px-20">
        <div className="max-w-[1200px] mx-auto">
          <CTASection
            title="Join Us on This Journey"
            description="Partner with a team that's committed to your success and passionate about technology innovation."
            primaryButton={{
              text: 'Work With Us',
              onClick: () => router.push('/contact'),
            }}
            secondaryButton={{
              text: 'Start Free Trial',
              onClick: () => router.push('/register'),
            }}
          />
        </div>
      </section>
    </div>
    </>
  )

}
