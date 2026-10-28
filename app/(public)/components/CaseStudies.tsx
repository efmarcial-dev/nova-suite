'use client';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Button } from './Button';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      'Before Foxly, I started every day buried in unread emails. Now I open the dashboard, see my top 5 priorities, and my assistant has already drafted responses for the three most urgent threads. I approved them in 4 minutes.',
    name: 'Marcus T.',
    title: 'CEO, Series B SaaS Company',
    result: '2.5 hrs reclaimed per day',
  },
  {
    quote:
      'We stopped using four different tools — email, calendar, Trello, and a separate task manager. Foxly replaced all of them. The calendar conflict detection alone saved us from two missed client calls last month.',
    name: 'Priya M.',
    title: 'VP of Operations, Growth Agency',
    result: '4 tools consolidated into 1',
  },
];

const stats = [
  { value: '2h+', label: 'Average daily time saved' },
  { value: '94%', label: 'Schedule health score achieved' },
  { value: '< 5 min', label: 'Daily morning briefing review time' },
  { value: '1', label: 'Workspace for email, calendar & tasks' },
];

export default function CaseSection() {
  const router = useRouter();

  return (
    <section className="relative py-24 px-6 lg:px-20 bg-white">
      <div className="max-w-[1200px] mx-auto space-y-14">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="inline-block px-4 py-1.5 border border-slate-300 rounded-full text-xs font-semibold text-slate-600 uppercase tracking-wider">
            User Stories
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 max-w-3xl mx-auto leading-tight tracking-tight">
            Executives who changed how they work
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Real outcomes from real Foxly users who connected their inbox, calendar, and tasks into one AI-powered command center.
          </p>
        </motion.div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="bg-slate-50 rounded-2xl border border-slate-200 p-7 space-y-4 flex flex-col shadow-xs hover:shadow-md transition-shadow"
            >
              <Quote size={22} className="text-[#80CFFF]" />
              <p className="text-sm text-gray-700 leading-relaxed flex-1 italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.title}</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-[#F0F9FF] text-[#0088EE] border border-[#BFE7FF] rounded-full">
                  {t.result}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-gradient-to-br from-[#F0F9FF] to-violet-50 border border-[#BFE7FF] rounded-2xl p-5 text-center"
            >
              <p className="text-3xl font-extrabold text-[#0088EE]">{s.value}</p>
              <p className="text-xs text-[#1EA0FF] mt-1 leading-snug">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <Button variant="primary" size="lg" onClick={() => router.push('/register')}>
            Start Your Executive Workspace →
          </Button>
          <p className="text-xs text-gray-400 mt-3">
            One-time lifetime access available · Connect Google or Microsoft · Cancel any time
          </p>
        </motion.div>

      </div>
    </section>
  );
}