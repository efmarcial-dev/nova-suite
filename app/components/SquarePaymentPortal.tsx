'use client';

import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  CreditCard,
  Tag,
} from 'lucide-react';
import SquareCheckout from './SquareCheckout';

interface SquarePaymentPortalProps {
  planName?: string;
  originalPrice?: number;
  finalPrice?: number;
  promoCode?: string;
  onSuccess: (data: any) => void;
  onCancel?: () => void;
}

export default function SquarePaymentPortal({
  planName = "Nova Executive Founder Lifetime Pass",
  originalPrice = 199,
  finalPrice = 99,
  promoCode = "FOUNDER100",
  onSuccess,
  onCancel,
}: SquarePaymentPortalProps) {
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [portalSession, setPortalSession] = useState<{
    portalUrl: string;
    portalId: string;
    orderId: string;
    mode: string;
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Initialize or fetch the Square portal checkout session
  useEffect(() => {
    let mounted = true;

    async function initPortal() {
      setIsLoadingSession(true);
      setErrorMessage(null);

      try {
        const res = await fetch('/api/subscription/checkout-portal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plan: 'founder_lifetime',
            promoCode,
            amount: finalPrice,
          }),
        });

        if (!res.ok) {
          throw new Error('Could not initialize Square portal session');
        }

        const data = await res.json();
        if (mounted) {
          setPortalSession({
            portalUrl: data.portalUrl,
            portalId: data.portalId,
            orderId: data.orderId,
            mode: data.mode,
          });
        }
      } catch (err: any) {
        console.error("Portal initialization error:", err);
        if (mounted) {
          setErrorMessage(err.message || 'Unable to connect to Square payment gateway');
        }
      } finally {
        if (mounted) {
          setIsLoadingSession(false);
        }
      }
    }

    initPortal();

    return () => {
      mounted = false;
    };
  }, [finalPrice, promoCode]);

  // Handle portal checkout completion
  const handleCompletePortalCheckout = async () => {
    setIsProcessingCheckout(true);
    setErrorMessage(null);

    try {
      // Confirm subscription via backend proxy
      const res = await fetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: portalSession?.portalId || `sq_portal_token_${Date.now()}`,
          plan: 'founder_lifetime',
          promoCode,
          amount: finalPrice,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to confirm Square portal payment');
      }

      setPaymentSuccess(true);
      setIsModalOpen(false);

      setTimeout(() => {
        onSuccess(data);
      }, 800);
    } catch (err: any) {
      console.error("Square portal confirmation error:", err);
      setErrorMessage(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  // Open Square Portal in a new secure window or tab
  const handleOpenHostedPortal = () => {
    if (portalSession?.portalUrl) {
      if (portalSession.mode === 'live') {
        window.open(portalSession.portalUrl, '_blank', 'noopener,noreferrer');
      } else {
        // In sandbox or embedded mode, launch the embedded Square checkout portal modal
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-7 text-center shadow-sm">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="mb-1 text-lg font-bold text-gray-900">Payment confirmed</h3>
        <p className="mx-auto mb-3 max-w-sm text-sm text-gray-600">
          Your Founder Lifetime Pass is active. Redirecting to your executive suite...
        </p>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-white px-3.5 py-1.5 rounded-full border border-emerald-200">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Finalizing workspace setup...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-white">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-slate-900">Secure checkout</p>
              <p className="text-[11px] text-slate-500">Payment processed by Square</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" /> One-time payment
          </div>
        </div>

        <div className="grid sm:grid-cols-[1fr_190px]">
          <div className="space-y-3 p-4 sm:p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-600">Your plan</p>
              <h3 className="mt-1 text-base font-bold leading-snug text-slate-900">{planName}</h3>
              <p className="mt-0.5 text-xs text-slate-500">Lifetime access · No recurring charges</p>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5 text-xs">
              <span className="text-slate-600">Standard price</span>
              <span className="font-medium text-slate-500 line-through">${originalPrice}.00</span>
            </div>

            {promoCode && (
              <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/70 px-3 py-2.5 text-xs">
                <span className="flex items-center gap-2 text-indigo-900">
                  <Tag className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Founder offer <span className="font-mono font-semibold">{promoCode}</span></span>
                </span>
                <span className="font-semibold text-emerald-700">-${Math.max(0, originalPrice - finalPrice)}.00</span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center border-t border-slate-100 bg-gradient-to-br from-slate-50 to-indigo-50/70 p-4 sm:border-l sm:border-t-0 sm:p-5">
            <p className="text-xs font-medium text-slate-500">Due today</p>
            <p className="mt-0.5 text-3xl font-extrabold tracking-tight text-slate-950">
              ${finalPrice}<span className="ml-1 text-sm font-semibold text-slate-500">USD</span>
            </p>
            <button
              type="button"
              disabled={isLoadingSession}
              onClick={handleOpenHostedPortal}
              className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-70"
            >
              {isLoadingSession ? (
                <><RefreshCw className="h-4 w-4 animate-spin" /><span>Preparing checkout…</span></>
              ) : (
                <><Lock className="h-4 w-4" /><span>Continue to payment</span><ExternalLink className="h-3.5 w-3.5 opacity-70" /></>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-2 text-center text-[11px] font-medium text-slate-500 underline decoration-slate-300 underline-offset-2 transition hover:text-slate-900"
            >
              Enter card details here
            </button>
          </div>
        </div>

        {errorMessage && (
          <div role="alert" className="mx-4 mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700 sm:mx-5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex items-center justify-center gap-1.5 border-t border-slate-100 px-4 py-2.5 text-[11px] text-slate-500">
          <Lock className="h-3.5 w-3.5" /> Your card details are handled by Square
        </div>
      </section>

      {/* Embedded Square Checkout Portal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm animate-in fade-in duration-200 sm:p-5">
          <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-slate-950 p-4 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-950"><CreditCard className="h-4 w-4" /></div>
                <div>
                  <div className="text-sm font-bold">Complete your payment</div>
                  <div className="text-[11px] text-slate-400">{planName}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close checkout"
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-3 text-sm">
                <span className="font-medium text-slate-600">Total due today</span>
                <span className="font-bold text-slate-950">${finalPrice}.00 USD</span>
              </div>
              <div>
                <SquareCheckout
                  planName={planName}
                  originalPrice={originalPrice}
                  finalPrice={finalPrice}
                  promoCode={promoCode}
                  amountCents={finalPrice * 100}
                  onSuccess={(data) => {
                    setIsModalOpen(false);
                    onSuccess(data);
                  }}
                  onCancel={() => setIsModalOpen(false)}
                />
              </div>
              </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3 w-3" /> Processed securely by Square
              </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="font-medium text-slate-600 underline underline-offset-2 hover:text-slate-950"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
