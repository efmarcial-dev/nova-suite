'use client';

import { useState } from 'react';
import {
  Sparkles,
  Trophy,
  Check,
  Copy,
  CheckCheck,
  Calendar,
  Mail,
  Zap,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  Tag,
} from 'lucide-react';

interface FounderMilestoneCardProps {
  variant?: 'banner' | 'card' | 'checkout';
  showDetails?: boolean;
}

export default function FounderMilestoneCard({
  variant = 'card',
  showDetails = true,
}: FounderMilestoneCardProps) {
  const [copied, setCopied] = useState(false);
  const promoCode = 'FOUNDER100';

  const handleCopy = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pillars = [
    {
      icon: Calendar,
      title: 'Meeting intelligence',
      desc: 'Analyzes meetings, extracts decisions, and identifies action items.',
    },
    {
      icon: Mail,
      title: 'Email intelligence',
      desc: 'Analyzes inboxes, prioritizes messages, and prepares responses.',
    },
    {
      icon: Zap,
      title: 'Task delegation',
      desc: 'Turns instructions into tasks and delegates work.',
    },
    {
      icon: MessageSquare,
      title: 'AI-generated responses',
      desc: 'Prepares replies for users to review or send.',
    },
    {
      icon: BarChart3,
      title: 'Executive productivity',
      desc: 'Helps users manage their responsibilities in one place.',
    },
  ];

  if (variant === 'banner') {
    return (
      <div className="relative isolate mb-6 overflow-hidden rounded-3xl border border-amber-300/30 bg-gradient-to-br from-[#161832] via-[#202452] to-[#171a35] p-4 text-white shadow-xl shadow-indigo-950/15 sm:p-5">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 h-52 w-52 rounded-full bg-amber-400/20 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 left-1/3 h-44 w-64 rounded-full bg-indigo-400/20 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/80 to-transparent" />

        <div className="relative">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/25 bg-amber-100/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-100 sm:text-[11px]">
              <Trophy className="h-3.5 w-3.5 text-amber-300" /> A Nova milestone
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-100/70 sm:text-[11px]">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" /> The founding 100
            </span>
          </div>

          <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto] sm:gap-5">
            <div>
              <h3 className="text-xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl">
                You&apos;re Nova&apos;s <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent">100th member.</span>
              </h3>
              <p className="mt-1.5 max-w-md text-xs leading-5 text-indigo-100/80 sm:text-sm">
                A milestone this big deserves a thank-you. Your Founder Lifetime Pass is unlocked for $99—with <strong className="font-bold text-white">$100 off</strong> and no recurring fees.
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-3.5 py-2.5 sm:min-w-[156px] sm:flex-col sm:items-end sm:gap-0 sm:px-4 sm:py-3">
              <div className="text-left sm:text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-100/65">Founder lifetime price</p>
                <p className="mt-0.5 text-xs text-indigo-100/65"><span className="line-through">$199</span><span className="mx-1.5">→</span><strong className="text-2xl font-black leading-none text-white">$99</strong></p>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-300/15 px-2.5 py-1 text-[10px] font-bold text-emerald-200 ring-1 ring-emerald-200/20">50% OFF</span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
            <span className="text-[10px] font-medium text-indigo-100/65 sm:text-[11px]">One payment · No recurring fees · Lifetime access</span>
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? 'Founder code copied' : `Copy founder code ${promoCode}`}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200/25 bg-amber-100/10 px-3 py-2 text-[11px] font-semibold text-amber-50 transition hover:border-amber-200/50 hover:bg-amber-100/15 focus:outline-none focus:ring-2 focus:ring-amber-200/60"
            >
              <Tag className="h-3.5 w-3.5 text-amber-300" />
              <span>FOUNDER CODE <code className="ml-1 font-mono font-bold text-white">{promoCode}</code></span>
              {copied ? <CheckCheck className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5 text-amber-100/65" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-amber-50/70 via-white to-gray-50/40 border border-amber-200/80 rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden mb-6">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-300/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-300/15 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Badge */}
      <div className="flex items-center justify-between gap-2 flex-wrap mb-3.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold tracking-wide border border-amber-300/50">
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>Milestone: Member #100 Celebration</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>100% Guaranteed One-Time Lifetime Pass</span>
        </div>
      </div>

      {/* Main Headline */}
      <div className="mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Congratulations on Being Our 100th User!
        </h3>
        <p className="text-gray-600 text-sm mt-1 leading-relaxed">
          As a special thank you for joining our founding cohort, you’ve earned the exclusive{' '}
          <strong className="text-gray-900 font-semibold">Founder Lifetime Pass</strong>. Instead of recurring subscriptions, you lock in full executive intelligence for a single one-time payment.
        </p>
      </div>

      {/* Pricing Comparison Box */}
      <div className="bg-white rounded-xl border border-amber-200/70 p-4 mb-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2.5">
              <span className="text-xs text-gray-400 line-through font-medium">$199 Standard</span>
              <span className="text-3xl font-extrabold text-gray-900 tracking-tight">$99</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Save $100 (50% Off)
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              One-time payment for life &bull; No recurring monthly fees &bull; Lifetime updates
            </p>
          </div>

          <div className="flex items-center gap-2 bg-amber-50/80 border border-amber-200/80 rounded-xl px-3.5 py-2">
            <Tag className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="text-left">
              <div className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider">
                Founder Promo Code
              </div>
              <div className="font-mono text-sm font-bold text-gray-900">{promoCode}</div>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="ml-2 p-1.5 rounded-lg bg-white border border-amber-200 hover:bg-amber-100/50 text-gray-700 transition"
              title="Copy promo code"
            >
              {copied ? (
                <CheckCheck className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Value Pillars */}
      {showDetails && (
        <div className="space-y-3.5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Why Executives Love Nova at $99 Lifetime:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/80 border border-gray-100 text-xs text-gray-700"
                >
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 block">{item.title}</span>
                    <span className="text-gray-500 text-[11px] leading-tight block mt-0.5">
                      {item.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Philosophy Statement */}
          <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-indigo-50/80 to-blue-50/60 border border-indigo-100/80 text-xs text-indigo-950 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-semibold text-indigo-900">The Nova Philosophy:</strong> The important distinction is that the AI should help you complete work, not simply tell you what to do.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
