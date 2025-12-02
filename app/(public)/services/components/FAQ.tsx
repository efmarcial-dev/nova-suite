import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What services does Nova IT Solutions offer?',
    answer: 'We specialize in AI & automation, custom software development, web development, IT consulting, and enterprise solutions. Our team works with cutting-edge technologies to deliver tailored solutions for businesses of all sizes.',
  },
  {
    question: 'How long does a typical project take?',
    answer: 'Project timelines vary based on scope and complexity. A standard website takes 4-8 weeks, while custom software can range from 3-6 months. We provide detailed timelines during our initial consultation and keep you updated throughout the process.',
  },
  {
    question: 'Do you provide ongoing support and maintenance?',
    answer: 'Yes! All our packages include post-launch support. We offer various maintenance plans ranging from basic updates to comprehensive managed services with dedicated account managers.',
  },
  {
    question: 'What technologies do you work with?',
    answer: 'We work with modern tech stacks including React, Next.js, Node.js, Python, AWS, Azure, PostgreSQL, MongoDB, and various AI/ML frameworks. We choose technologies based on your specific needs and scalability requirements.',
  },
  {
    question: 'Can you integrate AI into existing systems?',
    answer: 'Absolutely! We specialize in retrofitting existing systems with AI capabilities, including natural language processing, predictive analytics, computer vision, and intelligent automation without disrupting your current operations.',
  },
  {
    question: 'What is your pricing model?',
    answer: 'We offer project-based pricing, retainer agreements, and hourly rates depending on your needs. After understanding your requirements, we provide a detailed proposal with transparent pricing and payment milestones.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="border border-blue-100 rounded-xl overflow-hidden bg-gradient-to-br from-white/5 to-transparent hover:border-[#4E7BFF]/30 transition-all"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-6 py-5 flex items-center justify-between text-left"
          >
            <span className="pr-8">{faq.question}</span>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0"
            >
              {openIndex === index ? (
                <Minus size={20} className="text-[#4E7BFF]" />
              ) : (
                <Plus size={20} className="text-[#4E7BFF]" />
              )}
            </motion.div>
          </button>
          
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5 text-gray-500">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
