'use client';

import { useState } from 'react';
import { useSubscription } from '@/app/hooks/useSubscription';
import SquareCheckout from '@/app/components/SquareCheckout';
import FounderMilestoneCard from '@/app/components/FounderMilestoneCard';
import { ShieldAlert, Sparkles, Lock, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const { subscription, hasAccess, isLoading, refreshSubscription } = useSubscription();
  const [showPortal, setShowPortal] = useState(false);

  // While checking subscription status or if user has active/lifetime access, render children
  if (isLoading || hasAccess) {
    return <>{children}</>;
  }

  // Paywall: user can log in, but can NOT use the dashboard until payment is confirmed
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-10 space-y-6">
        
        {/* Milestone Card */}
        <FounderMilestoneCard variant="banner" />

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Account Activation Required
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Welcome to NovaSuite! You are logged in, but your workspace requires an active license before accessing executive email intelligence, meeting briefings, and task boards.
          </p>
        </div>

        {/* Feature summary */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Included in your Founder Lifetime Access:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
            <span className="flex items-center gap-1.5"><Check size={13} className="text-emerald-600" /> Email triage &amp; drafts</span>
            <span className="flex items-center gap-1.5"><Check size={13} className="text-emerald-600" /> Calendar conflict sync</span>
            <span className="flex items-center gap-1.5"><Check size={13} className="text-emerald-600" /> AI task delegation</span>
            <span className="flex items-center gap-1.5"><Check size={13} className="text-emerald-600" /> Executive briefings</span>
          </div>
        </div>

        {/* Square Embedded Portal */}
        {showPortal ? (
          <div className="space-y-3">
            <SquareCheckout
              planName="Nova Executive Founder Lifetime Pass"
              originalPrice={199}
              finalPrice={99}
              promoCode="FOUNDER100"
              amountCents={9900}
              plan="founder_lifetime"
              onSuccess={() => {
                refreshSubscription();
              }}
              onCancel={() => setShowPortal(false)}
            />
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => setShowPortal(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl gradient-brand text-white text-sm font-bold shadow-lg shadow-indigo-100 hover:opacity-95 transition cursor-pointer"
            >
              <Sparkles size={16} />
              <span>Activate Lifetime Access ($99 One-Time)</span>
              <ArrowRight size={16} />
            </button>

            <div className="text-center">
              <Link
                href="/onboarding"
                className="text-xs text-gray-400 hover:text-indigo-600 underline transition"
              >
                Or review your onboarding preferences &rarr;
              </Link>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-gray-100 flex items-center justify-center gap-2 text-[11px] text-gray-400">
          <ShieldAlert size={12} className="text-gray-400" />
          <span>Encrypted payment processed directly by Square &bull; 100% Secure</span>
        </div>
      </div>
    </div>
  );
}
