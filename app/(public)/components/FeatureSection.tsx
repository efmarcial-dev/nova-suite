'use client';
import { motion } from 'motion/react';
import {
  Mail,
  Calendar,
  CheckSquare,
  Sparkles,
  ClipboardList,
  ShieldCheck,
  Zap,
  BrainCircuit,
} from 'lucide-react';

const features = [
  {
    icon: Mail,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    title: 'Multiple Inboxes (Google & Outlook)',
    description:
      'Foxly connects to multiple Gmail and Microsoft Outlook inboxes simultaneously. It automatically aggregates and classifies incoming correspondence, detects urgent client inquiries, and prepares AI-drafted replies across all accounts.',
    bullets: [
      'Multi-inbox support (Google Workspace & Outlook 365)',
      'Cross-account triage & unified priority stream',
      'One-click AI-drafted reply approvals',
      'Daily consolidated morning email digest',
    ],
  },
  {
    icon: Calendar,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    title: 'Multi-Calendar Intelligence',
    description:
      'Connect multiple Google Calendars and Microsoft Outlook calendars into one unified schedule. Foxly detects scheduling conflicts across providers, extracts agendas, and generates pre-meeting briefings.',
    bullets: [
      'Multi-calendar sync (Google & Microsoft Exchange)',
      'Cross-provider conflict detection & buffer scoring',
      'Pre-meeting briefing cards with attendees',
      'Focus block and deep-work protection',
    ],
  },
  {
    icon: CheckSquare,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    title: 'Task & Project Delegation',
    description:
      'Turn emails, meetings, and voice directives into structured tasks. Assign them to projects, track progress across your team, and let Foxly automatically update task status as work moves forward.',
    bullets: [
      'Natural language task creation',
      'Project boards with priority scoring',
      'Team assignment & tracking',
      'Deadline extraction from email & calendar',
    ],
  },
  {
    icon: Sparkles,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    title: 'AI Executive Briefings',
    description:
      "Every morning, Foxly compiles a personalized briefing from your inbox, calendar, and open tasks. You see exactly what needs your attention — before you've opened a single email.",
    bullets: [
      'Morning executive summary',
      'Top 3 priorities surfaced automatically',
      'Upcoming meeting prep digest',
      'Weekly performance roll-up',
    ],
  },
  {
    icon: BrainCircuit,
    color: 'text-[#1EA0FF]',
    bg: 'bg-[#F0F9FF]',
    border: 'border-[#BFE7FF]',
    title: 'Meeting Intelligence',
    description:
      'After every meeting Foxly extracts decisions, action items, and follow-ups from your calendar events and notes — so nothing slips through the cracks between your inbox and your task board.',
    bullets: [
      'Post-meeting action item capture',
      'Decision logging per project',
      'Follow-up task auto-creation',
      'Attendee accountability tracking',
    ],
  },
  {
    icon: ShieldCheck,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    title: 'Strict SOC II Compliance & Privacy',
    description:
      'Engineered following strict SOC II compliance rules. Connected via Nylas Auth, deployed on Vercel with real-time Supabase and Firestore caching. Your data is isolated per tenant and never used to train public AI models.',
    bullets: [
      'Strict SOC II compliance rules & TLS 1.3 encryption',
      'Universal Nylas Auth OAuth 2.0 integration',
      'Backed by Vercel, Supabase & Firestore infrastructure',
      'Full data deletion and provider disconnect on demand',
    ],
  },
];

export default function FeatureSection() {
  return (
    <section id="features" className="relative py-24 px-6 lg:px-20 bg-white">
      <div className="max-w-[1200px] mx-auto space-y-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0F9FF] border border-[#BFE7FF] text-[#0088EE] text-xs font-semibold uppercase tracking-wider">
            <Zap size={13} />
            Platform Features
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 max-w-3xl mx-auto leading-tight tracking-tight">
            Everything an executive needs — in one intelligent workspace
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Foxly replaces your scattered inboxes, calendar apps, and task tools with a single AI-powered command center built around how executive work actually flows.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`rounded-2xl border ${f.border} bg-white p-6 space-y-4 shadow-xs flex flex-col hover:shadow-md transition-shadow`}
              >
                <div className={`w-11 h-11 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center ${f.color} shrink-0`}>
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{f.title}</h3>
                  <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{f.description}</p>
                </div>
                <ul className="space-y-1.5 pt-1 border-t border-slate-100 mt-auto">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className={`mt-0.5 shrink-0 ${f.color}`}>✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}