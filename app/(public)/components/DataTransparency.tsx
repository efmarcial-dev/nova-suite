'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Mail,
  Calendar,
  Brain,
  ShieldCheck,
  Lock,
  EyeOff,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

const dataPoints = [
  {
    icon: Mail,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    title: 'Gmail & Outlook Email Access',
    purpose: 'Why we request this',
    description:
      'Foxly reads your inbox to triage incoming messages, detect action items, surface high-priority client correspondence, and prepare draft responses for your review. You approve every AI-drafted reply before it is sent.',
    scope: 'Read-only access to email headers, subjects, and message content.',
    notUsedFor: 'We never send emails on your behalf without your explicit confirmation.',
  },
  {
    icon: Calendar,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    title: 'Google Calendar & Outlook Calendar Access',
    purpose: 'Why we request this',
    description:
      'Foxly syncs your calendar events to build your daily schedule view, detect meeting conflicts, extract agenda items, and generate pre-meeting briefings so you walk into every call fully prepared.',
    scope: 'Read and write access to calendar events to sync and display your schedule.',
    notUsedFor: 'We do not create, modify, or delete calendar events without your explicit action.',
  },
  {
    icon: Brain,
    color: 'text-[#1EA0FF]',
    bg: 'bg-[#F0F9FF]',
    border: 'border-[#BFE7FF]',
    title: 'AI-Powered Task & Project Intelligence',
    purpose: 'What we do with your data',
    description:
      'Your email and calendar data is processed by Foxly\'s AI engine solely to surface work you need to act on. Extracted insights are organized into tasks, project boards, and morning briefings visible only to you.',
    scope: 'Data is processed server-side within your isolated tenant workspace.',
    notUsedFor: 'Your data is never sold, shared with third parties, or used to train public AI models.',
  },
];

const guarantees = [
  'Strict SOC II compliance rules: isolated per-tenant workspaces and zero cross-tenant access',
  'Multi-provider support: connect multiple Google (Gmail & Google Calendar) and Microsoft (Outlook & Exchange) accounts',
  'Nylas Auth OAuth 2.0 integration — Foxly never sees or stores your Google or Microsoft password',
  'Backed by enterprise cloud partners: Vercel edge deployment, Supabase real-time sync, and Firestore document caching',
  'Strict Limited Use policy: customer data is never sold, shared, or used to train public AI models',
  'You can disconnect any Google or Outlook provider at any time from Workspace Settings without losing your tasks',
];

export default function DataTransparency() {
  return (
    <section
      id="security"
      className="relative py-24 px-6 lg:px-20 bg-slate-50/70 border-y border-slate-200/60"
    >
      <div className="max-w-[1200px] mx-auto space-y-14">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0F9FF] border border-[#BFE7FF] text-[#0088EE] text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck size={14} />
            Data Transparency &amp; Privacy
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 max-w-3xl mx-auto leading-tight tracking-tight">
            What Data Foxly Requests — and Exactly Why
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            When you connect your Google or Microsoft account, Foxly requests
            specific permissions to power your executive workspace. Here is a complete,
            plain-language breakdown.
          </p>
        </motion.div>

        {/* Data access cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {dataPoints.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`rounded-2xl border ${item.border} bg-white p-6 space-y-4 shadow-xs flex flex-col`}
              >
                <div className={`w-11 h-11 rounded-xl ${item.bg} ${item.border} border flex items-center justify-center ${item.color} shrink-0`}>
                  <Icon size={22} />
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gray-900 leading-snug">{item.title}</h3>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{item.purpose}</p>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed flex-1">{item.description}</p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-start gap-2 text-xs text-gray-500">
                    <Lock size={12} className="text-[#1EA0FF] mt-0.5 shrink-0" />
                    <span><strong className="text-gray-700">Scope: </strong>{item.scope}</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-gray-500">
                    <EyeOff size={12} className="text-rose-400 mt-0.5 shrink-0" />
                    <span><strong className="text-gray-700">Not used for: </strong>{item.notUsedFor}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Guarantees strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8"
        >
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            Our Privacy Guarantees
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {guarantees.map((g) => (
              <li key={g} className="flex items-start gap-2.5 text-sm text-gray-600">
                <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 shrink-0" />
                {g}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CTA links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 text-sm"
        >
          <Link
            href="/privacy"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1EA0FF] hover:bg-[#0088EE] text-white font-semibold shadow-sm transition-colors"
          >
            <ShieldCheck size={15} />
            Read Our Full Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#80CFFF] text-gray-700 hover:text-[#0088EE] font-semibold transition-colors"
          >
            <ExternalLink size={14} />
            Terms of Service
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
