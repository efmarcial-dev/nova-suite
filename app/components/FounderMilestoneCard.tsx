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
      <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border border-amber-300/60 rounded-2xl p-4 mb-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                  Milestone Unlocked &bull; Member #100
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  $100 OFF Applied
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mt-1">
                Congrats! You unlocked the $99 Lifetime Founder Pass
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Original <span className="line-through text-gray-400 font-medium">$199</span> &rarr; now{' '}
                <span className="font-bold text-gray-900">$99 one-time for life</span> as a thank you for signing up.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 shadow-2xs transition self-start sm:self-auto shrink-0"
          >
            <Tag className="w-3.5 h-3.5 text-indigo-600" />
            <span>Code: <code className="font-mono text-indigo-600">{promoCode}</code></span>
            {copied ? (
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600 ml-1" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-gray-400 ml-1" />
            )}
          </button>
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
