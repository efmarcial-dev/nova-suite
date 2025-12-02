'use client';
import {motion} from 'motion/react';
import { CaseStudyCard } from './CaseStudyCard';
import { useRouter } from 'next/navigation';
import { Button } from './Button';

export default function CaseSection() {

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
            {/** About Us pill */}
            <div className="inline-block px-4 py-1 border border-black rounded-full text-small text-black">
              <h4>Success Stories</h4>
            </div>
            {/* Section Heading */}
            <p className="lg:text-6xl md:text-4xl text-3xl font-regular text-gray-900 max-w-3xl mx-auto">
            See how we've helped businesses transform their operations and achieve unprecedented growth.
            </p>
            
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <CaseStudyCard
              company="FinTech Innovations"
              industry="Financial Services"
              problem="Manual processes causing delays and errors in loan processing, resulting in customer dissatisfaction."
              solution="Developed an AI-powered loan automation system with real-time decision-making capabilities."
              results={[
                { label: 'Faster Processing', value: '85%' },
                { label: 'Error Reduction', value: '95%' },
                { label: 'Cost Savings', value: '$2M' },
              ]}
              delay={0}
            />
            <CaseStudyCard
              company="HealthCore Systems"
              industry="Healthcare"
              problem="Fragmented patient data across multiple legacy systems hindering care coordination."
              solution="Built a unified healthcare platform integrating all systems with HIPAA-compliant data management."
              results={[
                { label: 'System Integration', value: '100%' },
                { label: 'Patient Satisfaction', value: '+42%' },
                { label: 'Time Saved', value: '15hrs/wk' },
              ]}
              delay={0.2}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/case-studies')}
            >
              View All Case Studies
            </Button>
          </motion.div>
        </div>
      </section>
    )
}