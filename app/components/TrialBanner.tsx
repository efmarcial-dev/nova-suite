'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSubscription } from '@/app/hooks/useSubscription';
import { Clock, X, Sparkles } from 'lucide-react';

export default function TrialBanner() {
  const { subscription } = useSubscription();
  const [dismissed, setDismissed] = useState(false);

  const isInTrial = subscription?.isInTrial ?? false;
  const daysRemaining = subscription?.trialDaysRemaining ?? 0;
  const isPaid = subscription?.status === 'active' && subscription?.plan !== 'trial';

  // Don't show if not in trial, already paid, or dismissed
  if (!isInTrial || isPaid || dismissed) return null;

  const urgency = daysRemaining <= 1 ? 'urgent' : 'normal';

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-2.5 text-xs font-medium transition-colors ${
        urgency === 'urgent'
          ? 'border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-950'
          : 'border-blue-100 bg-gradient-to-r from-blue-50 to-sky-50 text-slate-900'
      }`}
    >
      <div className="flex items-center gap-2.5">
        {urgency === 'urgent' ? (
          <Clock className="h-4 w-4 shrink-0 text-[#FF8A00]" />
        ) : (
          <Sparkles className="h-4 w-4 shrink-0 text-[#1EA0FF]" />
        )}
        <span>
          {daysRemaining <= 1
            ? 'Your free trial ends today — subscribe to keep using Foxly with unlimited usage.'
            : `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} left in your Foxly free trial (unlimited usage).`}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/dashboard/settings?tab=billing"
          className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition shadow-2xs ${
            urgency === 'urgent'
              ? 'bg-[#FF8A00] text-white hover:bg-[#E66A00]'
              : 'bg-[#1EA0FF] text-white hover:bg-[#0088EE]'
          }`}
        >
          Subscribe now
        </Link>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss trial banner"
          className="rounded-md p-1 text-slate-400 transition hover:bg-white/60 hover:text-slate-600"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
