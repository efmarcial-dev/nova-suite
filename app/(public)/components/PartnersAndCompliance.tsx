'use client';

import { motion } from 'motion/react';
import { ShieldCheck, Mail, Calendar, CheckCircle2, Lock, Layers, Zap } from 'lucide-react';
import Image from 'next/image';

const partners = [
  {
    name: 'Vercel',
    badge: 'Edge Hosting & Serverless',
    desc: 'Ultra-low latency global delivery & high availability',
  },
  {
    name: 'Supabase',
    badge: 'Real-Time Sync',
    desc: 'Instant database synchronization with PostgreSQL engine',
  },
  {
    name: 'Google Cloud Firestore',
    badge: 'Scalable Cloud Cache',
    desc: 'High-concurrency document storage and caching',
  },
  {
    name: 'Nylas Auth',
    badge: 'Multi-Provider Engine',
    desc: 'Universal sync across Google and Microsoft ecosystems',
  },
];

const capabilities = [
  {
    title: 'Multiple Google & Outlook Inboxes',
    desc: 'Connect your personal Gmail, corporate Google Workspace, and Microsoft Outlook accounts in one place. Foxly classifies threads and drafts smart responses across all accounts.',
    icon: Mail,
    color: 'text-[#1EA0FF]',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    title: 'Multiple Calendar Synchronization',
    desc: 'Sync multiple Google Calendars and Outlook calendars simultaneously. Detect cross-calendar conflicts, generate pre-meeting briefs, and protect focus time.',
    icon: Calendar,
    color: 'text-[#FF8A00]',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
  },
  {
    title: 'Security & privacy controls',
    desc: 'OAuth account connections, tenant-isolated workspaces, and a commitment not to sell your data or use it to train public AI models. Foxly does not claim an independent SOC 2 audit or report.',
    icon: ShieldCheck,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
];

export default function PartnersAndCompliance() {
  return (
    <section className="py-20 px-6 lg:px-20 bg-[#F2F4F7]/60 border-y border-slate-200/80">
      <div className="max-w-[1200px] mx-auto space-y-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#1EA0FF] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck size={14} className="text-[#1EA0FF]" />
            Security &amp; Connected Accounts
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0D1B2A] tracking-tight">
            Keep your work connected and your data private
          </h2>
          <p className="text-slate-600 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Foxly connects multiple calendars and inboxes across Google and Microsoft Outlook into one unified workspace,
            backed by connected account controls and privacy practices. Foxly does not claim an independent SOC 2 audit or report.
          </p>
        </motion.div>

        {/* 3 Core Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {capabilities.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                <div className={`w-12 h-12 rounded-2xl ${item.bg} border ${item.border} ${item.color} flex items-center justify-center shrink-0`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#0D1B2A] tracking-tight">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 size={15} />
                  <span>Verified &amp; Active</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Partners Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-[#0D1B2A] text-white p-8 sm:p-10 shadow-xl relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 rounded-full bg-[#1EA0FF]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#1EA0FF]">Technology &amp; Cloud Partners</p>
                <h3 className="text-2xl font-black tracking-tight text-white mt-1">
                  Engineered with Industry Leaders
                </h3>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-slate-300">
                <Lock size={13} className="text-[#1EA0FF]" />
                <span>OAuth access · Isolated workspaces</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {partners.map((partner) => (
                <div
                  key={partner.name}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm hover:border-[#1EA0FF]/50 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-white tracking-tight">{partner.name}</h4>
                    <span className="w-2 h-2 rounded-full bg-[#1EA0FF]" />
                  </div>
                  <p className="text-xs font-semibold text-[#1EA0FF]">{partner.badge}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{partner.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>Zero model training on customer communication</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#1EA0FF]" />
                <span>Full OAuth 2.0 granular scopes with Nylas Auth</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-[#FF8A00]" />
                <span>Isolated tenant data partitioned with Supabase &amp; Firestore</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
