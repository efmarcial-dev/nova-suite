'use client';

import Link from 'next/link';
import { useSubscription } from '@/app/hooks/useSubscription';
import DashboardSkeleton from '@/app/components/DashboardSkeleton';
import FoxlyPaymentCheckout from '@/app/components/FoxlyPaymentCheckout';
import { RefreshCw, ShieldAlert } from 'lucide-react';

export default function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const { hasAccess, isLoading, error, refreshSubscription } = useSubscription();

  // While loading and not yet verified: render a realistic dashboard skeleton.
  if (isLoading && !hasAccess) {
    return <DashboardSkeleton />;
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
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1EA0FF] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0088EE]"
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

  // Confirmed access (active trial or paid subscription) — render dashboard.
  if (hasAccess) return <>{children}</>;

  // Confirmed NO access — trial expired, paywall with clean plan options.
  return (
    <div className="min-h-screen grid place-items-center bg-slate-950 p-4 sm:p-8">
      <div className="w-full max-w-2xl space-y-6 rounded-3xl border border-white/10 bg-white p-6 shadow-2xl sm:p-10">
        <FoxlyPaymentCheckout
          title="Your 3-day free trial has ended"
          subtitle="Choose a plan to continue using Foxly and keep all your connected inboxes, calendars, and projects."
          onSuccess={() => void refreshSubscription()}
        />

        <div className="pt-2 text-center">
          <Link href="/logout" className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-4">
            Sign out of account
          </Link>
        </div>
      </div>
    </div>
  );
}
