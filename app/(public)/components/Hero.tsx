'use client';

import { motion } from 'motion/react';
import { ArrowRight, Calendar, CheckCircle2, Mail, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const priorities = [
  { title: 'Reply to urgent client email', detail: 'Inbox · 5 min', icon: Mail },
  { title: 'Prepare for 2 PM meeting', detail: 'Calendar · 20 min', icon: Calendar },
  { title: 'Finish project deliverable', detail: 'Task · Due today', icon: CheckCircle2 },
];

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center overflow-hidden bg-white border-b border-slate-100 sm:min-h-[88vh]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#F0F9FF]/50 via-white to-white pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10 py-12 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-9 sm:gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F9FF] border border-[#BFE7FF] text-[#0088EE] text-xs font-bold uppercase tracking-wider"
            >
              <Sparkles size={14} /> Foxly · AI Productivity
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[clamp(2rem,8vw,2.75rem)] sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0D1B2A] leading-[1.08]"
            >
              Your day is full. Foxly helps you{' '}
              <span className="text-[#1EA0FF]">focus on what matters.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl"
            >
              Stop wasting time figuring out which email to answer, which task to finish, or what’s about to fall through the cracks.
              Foxly connects your inbox, calendar, and tasks to identify what deserves your attention first.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl border border-blue-100 bg-white/90 p-4 sm:p-5 shadow-sm max-w-xl"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Today’s priorities</p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-[#0088EE]">
                  <Sparkles size={12} /> AI prioritized
                </span>
              </div>
              <ul className="space-y-2.5">
                {priorities.map(({ title, detail, icon: Icon }, index) => (
                  <li key={title} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#1EA0FF] border border-slate-100">
                      <Icon size={15} />
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-semibold text-slate-800">{title}</span>
                    <span className="hidden sm:block text-xs text-slate-500">{detail}</span>
                    <span className="sr-only">Priority {index + 1}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1"
            >
              <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 sm:mr-1">
                <p className="text-2xl font-black tracking-tight text-[#0D1B2A]">$60 <span className="text-base font-semibold text-slate-500">/ year</span></p>
                <p className="text-xs text-slate-500">Founding customer annual offer</p>
              </div>
              <button
                type="button"
                onClick={() => router.push('/register')}
                className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-[#1EA0FF] hover:bg-[#0088EE] text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Start your 3-day free trial</span>
                <ArrowRight size={18} />
              </button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-xs sm:text-sm text-slate-500 leading-relaxed"
            >
              No card required for the trial. After 3 days, choose annual access for $60, paid upfront for 12 months. No automatic charge; renew manually to continue.
            </motion.p>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-md"
            >
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xl shadow-slate-200/60">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                  <div className="w-11 h-11 rounded-2xl bg-[#0D1B2A] flex items-center justify-center p-1.5 shadow-sm">
                    <Image
                      src="/images/foxly_mascot_transparent.png"
                      alt="Foxly"
                      width={36}
                      height={36}
                      className="object-contain"
                      priority
                    />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-[#0D1B2A] text-lg leading-tight lowercase">foxly</h2>
                    <p className="text-[11px] text-slate-400 font-medium">Your day, in focus</p>
                  </div>
                </div>
                <div className="py-6">
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Your next best move</p>
                      <p className="mt-1 text-xl font-extrabold text-[#0D1B2A]">Reply to Maya</p>
                    </div>
                    <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700">Urgent</span>
                  </div>
                  <div className="rounded-2xl border border-blue-100 bg-[#F0F9FF] p-4">
                    <p className="text-sm font-semibold text-slate-800">Client approval is waiting in your inbox.</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">Reply now to keep today’s project on track before your 2 PM meeting.</p>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-600" /> You stay in control</span>
                  <span>Inbox · Calendar · Tasks</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
