'use client';
import {motion} from 'motion/react';
import { ServiceCard } from './ServiceCard';
import { Brain, Palette, Code2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ServiceSection() {

    const router = useRouter();

    return (
        <section className="relative py-32 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            {/* Title Pill */}
            <div className="inline-block px-4 py-1 border border-black rounded-full text-small text-black">
              <h2>Our Core Service</h2>
            </div>
            {/* Section Heading */}
            <p className="lg:text-6xl md:text-4xl text-3xl font-regular text-gray-900 max-w-5xl mx-auto">
            From AI-powered automation to custom enterprise software, we deliver solutions that drive real business value.
            </p>
            
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              icon={<Brain size={32} />}
              title="AI & Automation"
              description="Transform operations with intelligent automation, machine learning, and AI-powered insights."
              features={[
                'Process automation',
                'Predictive analytics',
                'Natural language processing',
                'Computer vision solutions',
              ]}
              delay={0}
              onClick={() => router.push('/services#ai')}
            />
            <ServiceCard
              icon={<Code2 size={32} />}
              title="Custom Software & IT Systems"
              description="Enterprise-grade software tailored to your unique business requirements and workflows."
              features={[
                'Custom web applications',
                'API development & integration',
                'Database architecture',
                'Cloud infrastructure',
              ]}
              delay={0.1}
              onClick={() => router.push('/services#software')}
            />
            <ServiceCard
              icon={<Palette size={32} />}
              title="Web Development"
              description="High-performance, scalable websites and web apps built with cutting-edge technologies."
              features={[
                'Modern responsive design',
                'E-commerce platforms',
                'Progressive web apps',
                'Performance optimization',
              ]}
              delay={0.2}
              onClick={() => router.push('/services#web')}
            />
          </div>
        </div>
      </section>
    )
}