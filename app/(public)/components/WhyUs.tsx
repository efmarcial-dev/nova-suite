'use client';
import { motion } from 'motion/react';
import { Clock, Zap, ShieldCheck, TrendingUp } from 'lucide-react';

const reasons = [
  {
    icon: Clock,
    title: 'Save 2+ Hours Every Day',
    description:
      'Executives using Foxly report reclaiming over two hours per day previously lost to inbox triage, meeting prep, and manual task tracking. The AI handles the overhead — you handle the decisions.',
  },
  {
    icon: Zap,
    title: 'AI That Completes Work, Not Just Suggests It',
    description:
      'Most AI tools tell you what to do. Foxly actually prepares the response, organizes the task, and queues the follow-up — you just review and approve. Your judgment stays in control.',
  },
  {
    icon: TrendingUp,
    title: 'Multiple Google & Outlook Inboxes & Calendars',
    description:
      'Email, calendar, and tasks finally in sync across all accounts. Connect multiple Google Workspace and Outlook 365 profiles into a single command center with zero duplicate data and zero missed threads.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy controls you can understand',
    description:
      'OAuth connections keep Foxly from seeing your account password. Workspaces are isolated by tenant, and your data is not used to train public AI models. Foxly does not claim an independent SOC 2 audit or report.',
  },
];

export default function WhySection() {
  return (
    <section className="relative py-24 px-6 lg:px-20 bg-slate-50/60">
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
            Why Foxly
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 max-w-3xl mx-auto leading-tight tracking-tight">
            Built for how executives actually work
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Not another productivity app. Foxly is an intelligence layer that sits across your existing tools and turns raw communication into organized, prioritized, actionable work.
          </p>
        </motion.div>

        {/* Reasons grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-slate-200 p-7 space-y-3 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] border border-[#BFE7FF] flex items-center justify-center text-[#1EA0FF]">
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-bold text-gray-900">{r.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{r.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {[
            { value: '2h+', label: 'Saved daily per executive' },
            { value: '5', label: 'Intelligence pillars in one workspace' },
            { value: '100%', label: 'Your data stays yours' },
            { value: '1', label: 'Login to run your entire day' },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-xs"
            >
              <p className="text-3xl font-extrabold text-[#1EA0FF]">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1 leading-snug">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
