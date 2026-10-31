'use client';

import { motion } from 'motion/react';
import { Calendar, CheckSquare, Mail, Sparkles } from 'lucide-react';

const priorities = [
  {
    icon: Mail,
    title: 'Know which messages need you',
    description: 'Foxly brings urgent emails forward and prepares reply drafts for you to review, so important conversations do not get buried.',
  },
  {
    icon: Calendar,
    title: 'Show up ready for what is next',
    description: 'See the meetings that need preparation alongside the work already on your plate.',
  },
  {
    icon: CheckSquare,
    title: 'Keep important work moving',
    description: 'Turn follow-ups into tasks and see what is due, so commitments do not fall through the cracks.',
  },
];

export default function FeatureSection() {
  return (
    <section id="features" className="relative py-24 px-6 lg:px-20 bg-white">
      <div className="max-w-[1200px] mx-auto space-y-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0F9FF] border border-[#BFE7FF] text-[#0088EE] text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={13} /> One clear daily plan
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 max-w-3xl mx-auto leading-tight tracking-tight">
            Start with what deserves your attention
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Foxly turns signals across your workday into a short, useful list of next steps.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {priorities.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs"
            >
              <div className="w-11 h-11 rounded-xl bg-[#F0F9FF] border border-[#BFE7FF] flex items-center justify-center text-[#1EA0FF]">
                <Icon size={22} />
              </div>
              <h3 className="text-base font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
