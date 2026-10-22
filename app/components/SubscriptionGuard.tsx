'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSubscription } from '@/app/hooks/useSubscription';
import SquareCheckout from '@/app/components/SquareCheckout';
import { Check, CreditCard, RefreshCw, ShieldAlert, Lock } from 'lucide-react';

export default function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const { hasAccess, isLoading, error, refreshSubscription } = useSubscription();
  const [showCheckout, setShowCheckout] = useState(false);

  // While loading and not yet verified: render a clean, sleek background.
  // No tacky spinner or "Checking your subscription..." text.
  // The dashboard stays hidden so unpaid users NEVER see any dashboard pages.
  if (isLoading && !hasAccess) {
    return (
      <div className="min-h-screen bg-slate-950 transition-colors" aria-busy="true" />
    );
  }

  // Error verifying subscription: show a clean message card on the dark background.
  if (error && !hasAccess) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-950 p-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 text-center text-slate-900 shadow-2xl">
          <ShieldAlert className="mx-auto mb-4 h-9 w-9 text-amber-500" />
          <h1 className="text-xl font-bold">We couldn't verify your subscription</h1>
          <p className="mt-2 text-sm text-slate-600">
            Your dashboard stays locked until we can confirm your account status.
          </p>
          <button
            type="button"
            onClick={() => void refreshSubscription()}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <RefreshCw className="h-4 w-4" /> Try again
          </button>
          <Link href="/logout" className="mt-4 block text-sm text-slate-500 underline underline-offset-4">
            Sign out
          </Link>
        </div>
      </div>
    );
  }

  // Confirmed access — show dashboard.
  if (hasAccess) return <>{children}</>;

  // Confirmed NO access — hard paywall. No way around it.
  return (
    <div className="min-h-screen grid place-items-center bg-slate-950 p-4 sm:p-8">
      <div className="w-full max-w-xl space-y-6 rounded-3xl border border-white/10 bg-white p-6 shadow-2xl sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-950">
            Activate NovaSuite
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
            An active Founder subscription is required to use the dashboard and connected services.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-700">
          <span className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Email intelligence</span>
          <span className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Calendar sync</span>
          <span className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> AI chat and task planning</span>
          <span className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Projects and reminders</span>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-700">Founder lifetime access</p>
          <p className="mt-1 text-3xl font-black text-slate-950">$49 <span className="text-sm font-semibold text-slate-500">USD · one time</span></p>
          <p className="mt-1 text-xs text-slate-600">Pay once. Keep access for the life of NovaSuite.</p>
        </div>

        {showCheckout ? (
          <SquareCheckout
            planName="NovaSuite Founder Lifetime Access"
            originalPrice={49}
            finalPrice={49}
            amountCents={4900}
            plan="founder_lifetime"
            onSuccess={() => void refreshSubscription()}
            onCancel={() => setShowCheckout(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowCheckout(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
          >
            <CreditCard className="h-4 w-4" /> Continue to secure payment
          </button>
        )}

        <div className="flex items-center justify-center gap-2 border-t border-slate-100 pt-4 text-[11px] text-slate-500">
          <ShieldAlert className="h-3.5 w-3.5" /> Card details are handled securely by Square
        </div>
        <Link href="/logout" className="block text-center text-xs text-slate-500 underline underline-offset-4">
          Sign out
        </Link>
      </div>
    </div>
  );
}
