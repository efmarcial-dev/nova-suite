'use client';

import {
  Sparkles,
  HelpCircle,
  Play,
  ListTodo,
  Mail,
  Calendar,
  Zap,
  Shield,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
  const handleLaunchTour = () => {
    window.dispatchEvent(new CustomEvent('foxly:open-tour'));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Hero: Replay Interactive Tour */}
      <div className="bg-gradient-to-br from-[#0D1B2A] via-[#1E232C] to-[#0D1B2A] text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-72 h-72 rounded-full bg-[#1EA0FF]/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-100 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#80CFFF]" />
            <span>Interactive Onboarding &amp; AI Tour</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            How Foxly Operates as Your Executive Assistant
          </h1>

          <p className="text-blue-100 text-sm leading-relaxed">
            Need a refresher on how the AI scores your tasks, extracts action items from emails, or guards your calendar? Launch the interactive visual walkthrough anytime.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleLaunchTour}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#0D1B2A] font-bold text-xs shadow-lg hover:bg-blue-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-3.5 h-3.5 fill-[#0D1B2A]" />
              <span>Launch Interactive Walkthrough</span>
            </button>

            <Link
              href="/dashboard/settings"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition"
            >
              <span>Manage Integrations</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#80CFFF]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Core Capabilities Deep Dive */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4 flex items-center gap-2">
          <span>Executive Assistant Core Pillars</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pillar 1: Task Scoring */}
          <div className="bg-white border border-[--border] rounded-2xl p-6 shadow-sm hover:border-[#BFE7FF] transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] text-[#1EA0FF] border border-[#BFE7FF] flex items-center justify-center">
              <ListTodo className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">
              0–100 AI Task Prioritization
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Every deliverable is dynamically graded based on deadline proximity, business leverage, and your onboarding preferences. High-scoring tasks (80+) automatically populate your Daily Executive Briefing.
            </p>
            <div className="pt-2 text-xs font-semibold text-[#1EA0FF] flex items-center gap-1">
              <span>View in Tasks page</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Pillar 2: Email Intelligence */}
          <div className="bg-white border border-[--border] rounded-2xl p-6 shadow-sm hover:border-[#BFE7FF] transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] text-[#1EA0FF] border border-[#BFE7FF] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">
              AI Email Intelligence &amp; Triage
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Connect Gmail or Microsoft Outlook. Foxly filters newsletters, summarizes key threads, detects explicit commitments/requests, and writes context-aware draft replies ready for 1-click approval.
            </p>
            <div className="pt-2 text-xs font-semibold text-[#1EA0FF] flex items-center gap-1">
              <span>Configure in Settings</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Pillar 3: Calendar & Focus */}
          <div className="bg-white border border-[--border] rounded-2xl p-6 shadow-sm hover:border-[#BFE7FF] transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] text-[#1EA0FF] border border-[#BFE7FF] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">
              Focus Guard &amp; Smart Scheduling
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Foxly protects 2-hour uninterrupted deep-work windows against meeting fragmentation, reserves decompression buffers, and flags overlapping calendar conflicts before they occur.
            </p>
            <div className="pt-2 text-xs font-semibold text-[#1EA0FF] flex items-center gap-1">
              <span>Open Calendar View</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Pillar 4: Directives */}
          <div className="bg-white border border-[--border] rounded-2xl p-6 shadow-sm hover:border-[#BFE7FF] transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] text-[#1EA0FF] border border-[#BFE7FF] flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">
              Executive Directives Engine
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Instruct Foxly naturally from the bottom bar or Assistant Hub: &ldquo;Reschedule my 3pm sync&rdquo;, &ldquo;Draft contract follow-up to David&rdquo;, or &ldquo;Prioritize client milestones for this week&rdquo;.
            </p>
            <div className="pt-2 text-xs font-semibold text-[#1EA0FF] flex items-center gap-1">
              <span>Try on Dashboard</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white border border-[--border] rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3 divide-y divide-gray-100">
          <div className="pt-3 first:pt-0 space-y-1">
            <p className="text-xs font-semibold text-gray-900">
              Does Foxly send emails or change calendar events without my confirmation?
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              No. Foxly operates under strict executive oversight. Draft replies and calendar reschedules are prepared as proposals that you approve or edit with one click.
            </p>
          </div>

          <div className="pt-3 space-y-1">
            <p className="text-xs font-semibold text-gray-900">
              How do I connect or disconnect Gmail and Microsoft Outlook?
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Head to <Link href="/dashboard/settings" className="text-[#1EA0FF] underline font-medium">Settings &rarr; Email Providers</Link> to link your account via OAuth. You can disconnect with one click at any time.
            </p>
          </div>

          <div className="pt-3 space-y-1">
            <p className="text-xs font-semibold text-gray-900">
              Can I re-run this interactive tutorial later?
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Yes! Click the <strong>&ldquo;Product Tour&rdquo;</strong> button in the top navigation header or click <strong>&ldquo;Launch Interactive Walkthrough&rdquo;</strong> at the top of this Help page anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}