'use client';

import { motion } from 'motion/react';
import {
  Mail,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Lock,
  Clock,
  Layers,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const keyBenefits = [
  { icon: Mail, label: 'Multiple Google & Outlook Inboxes' },
  { icon: Calendar, label: 'Multi-Calendar Conflict Protection' },
  { icon: Layers, label: '0–100 Task Prioritization' },
  { icon: Clock, label: 'Protected 2-Hour Focus Windows' },
  { icon: ShieldCheck, label: 'Strict SOC II Compliance' },
];

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative min-h-[88vh] flex flex-col justify-center overflow-hidden bg-white border-b border-slate-100">
      {/* Subtle brand tint background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F0F9FF]/50 via-white to-white pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Headlines & Call to Action */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Benefit Pill */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F9FF] border border-[#BFE7FF] text-[#0088EE] text-xs font-bold uppercase tracking-wider"
            >
              <span className="w-2 h-2 rounded-full bg-[#1EA0FF] animate-pulse" />
              <span>3-Day Free Trial &bull; Unlimited Access</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0D1B2A] leading-[1.08]"
            >
              One calm workspace for all your{' '}
              <span className="text-[#1EA0FF]">inboxes, calendars &amp; tasks.</span>
            </motion.h1>

            {/* Clear, Benefit-Driven Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl"
            >
              Stop switching between multiple Gmail tabs, Outlook windows, and disconnected to-do lists.
              Foxly brings all your work into one unified command center with automatic prioritization, focus time protection, and 1-click email triage.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-2 pt-1"
            >
              {keyBenefits.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  <Icon size={13} className="text-[#1EA0FF]" />
                  {label}
                </span>
              ))}
            </motion.div>

            {/* Primary Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <button
                type="button"
                onClick={() => router.push('/register')}
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#1EA0FF] hover:bg-[#0088EE] text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Start 3-Day Free Trial</span>
                <ArrowRight size={18} />
              </button>
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="px-6 py-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition shadow-2xs cursor-pointer text-center"
              >
                Sign In to Account
              </button>
            </motion.div>

            {/* Trust and Assurance */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1"
            >
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                No credit card required
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <ShieldCheck size={15} className="text-[#1EA0FF] shrink-0" />
                Strict SOC II Compliance
              </span>
              <span>&bull;</span>
              <span className="text-slate-600 font-medium">Instant 60-second setup</span>
            </motion.div>
          </div>

          {/* Right Column: Clean Product Mockup */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-md"
            >
              {/* Product Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 space-y-5">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
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
                      <h3 className="font-extrabold text-[#0D1B2A] text-lg leading-tight lowercase">foxly</h3>
                      <p className="text-[11px] text-slate-400 font-medium">Your life. In flow.</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    All Inboxes Synced
                  </span>
                </div>

                {/* Multiple Connected Inboxes */}
                <div className="space-y-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Unified Multi-Provider Inboxes
                  </p>
                  
                  {/* Google Account */}
                  <div className="p-3 rounded-2xl border border-blue-100 bg-[#F0F9FF] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white border border-blue-200 flex items-center justify-center text-xs font-black text-[#1EA0FF] shadow-2xs">
                        G
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Google Workspace (Work)</p>
                        <p className="text-[11px] text-slate-500">2 priority emails drafted &bull; Calendar synced</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-[#1EA0FF] border border-[#BFE7FF]">
                      Connected
                    </span>
                  </div>

                  {/* Microsoft Account */}
                  <div className="p-3 rounded-2xl border border-blue-100 bg-[#F0F9FF] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white border border-blue-200 flex items-center justify-center text-xs font-black text-[#0088EE] shadow-2xs">
                        O
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Microsoft Outlook (Executive)</p>
                        <p className="text-[11px] text-slate-500">1 urgent reply ready &bull; Exchange synced</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-[#1EA0FF] border border-[#BFE7FF]">
                      Connected
                    </span>
                  </div>
                </div>

                {/* Today's Schedule & Focus Guard */}
                <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Today's Schedule</p>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Zero Conflicts
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-800 bg-white p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#1EA0FF]" />
                      <span>Deep Work Focus Block</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">9:00 AM – 11:00 AM</span>
                  </div>
                </div>

                {/* Bottom Trust Badge */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Lock size={12} className="text-[#1EA0FF]" /> Strict SOC II Type II Rules
                  </span>
                  <span>Vercel &bull; Supabase &bull; Nylas</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
