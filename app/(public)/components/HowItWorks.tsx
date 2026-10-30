'use client';

import { motion } from 'motion/react';
import { Mail, Calendar, CheckCircle2, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    step: '01',
    title: 'Connect your accounts in 60 seconds',
    description:
      'Link your Google Workspace (Gmail & Calendar) and Microsoft 365 (Outlook & Exchange) accounts with secure one-click OAuth. Foxly never sees or stores your passwords.',
    highlight: 'Universal OAuth 2.0 & Nylas integration',
    icon: Mail,
  },
  {
    step: '02',
    title: 'Wake up to a prioritized, organized day',
    description:
      'Foxly continuously triages incoming threads across all your inboxes, extracts urgent deliverables, and checks your schedule to protect 2-hour focus blocks against overlapping meetings.',
    highlight: '0–100 task leverage scoring',
    icon: Calendar,
  },
  {
    step: '03',
    title: 'Approve actions with one click',
    description:
      'Instead of staring at a blank email or manually updating to-do lists, review Foxly\'s pre-drafted replies and scheduling proposals. You approve or edit each action with one click.',
    highlight: 'Executive oversight & zero guesswork',
    icon: CheckCircle2,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 lg:px-12 bg-slate-50/60 border-b border-slate-100">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-[#1EA0FF] text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Zap size={13} />
            <span>How Foxly Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0D1B2A] tracking-tight">
            From fragmented apps to effortless flow
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            No complicated workflow setups, no endless rule configurations. Just connect your existing Google and Outlook accounts, and Foxly immediately starts saving you hours every day.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-[#1EA0FF]/80">{item.step}</span>
                    <div className="w-10 h-10 rounded-2xl bg-[#F0F9FF] border border-[#BFE7FF] flex items-center justify-center text-[#1EA0FF]">
                      <Icon size={18} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#0D1B2A] leading-snug">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span className="text-[#1EA0FF]">{item.highlight}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="text-center pt-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-[#1EA0FF] hover:bg-[#0088EE] text-white font-bold text-sm px-6 py-3.5 rounded-full shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
          >
            <span>Experience the flow with a 3-Day Free Trial</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}
