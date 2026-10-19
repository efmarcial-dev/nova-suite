'use client';

import { useState } from 'react';
import { useSubscription } from '@/app/hooks/useSubscription';
import SquarePaymentForm from '@/app/components/SquarePaymentForm';
import { AlertCircle, ShieldAlert, Sparkles, X } from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const { subscription, hasAccess, isLoading, refreshSubscription } = useSubscription();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // While loading or if user has access, render content seamlessly
  if (isLoading || hasAccess) {
    return <>{children}</>;
  }

  // If user does not have access (e.g. no subscription yet or deactivated/canceled)
  return (
    <div className="relative">
      {/* Notice Banner */}
      <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-900">
              Subscription Inactive &bull; Action Required
            </h4>
            <p className="text-[11px] text-amber-700 mt-0.5">
              Subscribe to Nova Executive Pro to unlock full AI briefings, email intelligence, and directives.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Link
            href="/onboarding"
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 transition"
          >
            Review Onboarding
          </Link>
          <button
            type="button"
            onClick={() => setShowCheckoutModal(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition"
          >
            Activate Subscription ($49/mo)
          </button>
        </div>
      </div>

      {/* Main Content (can still view seeded starter workspace) */}
      <div className="opacity-95">
        {children}
      </div>

      {/* Quick Paywall Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[--border] relative animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Sparkles className="w-3.5 h-3.5" /> Instant Activation
              </span>
              <h3 className="text-xl font-bold text-gray-900 mt-2">
                Activate Nova Executive Pro
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Enter your card details via Square to immediately restore full AI capabilities.
              </p>
            </div>

            <SquarePaymentForm
              planName="Nova Executive Pro"
              amount="$49/mo"
              onSuccess={() => {
                refreshSubscription();
                setShowCheckoutModal(false);
              }}
              onCancel={() => setShowCheckoutModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
