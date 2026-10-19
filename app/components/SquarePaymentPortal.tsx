'use client';

import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  X,
  CreditCard,
  Building2,
  Check,
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
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-8 text-center shadow-xs">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          Payment Confirmed via Square!
        </h3>
        <p className="text-sm text-gray-600 max-w-sm mx-auto mb-4">
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
    <div className="space-y-4">
      {/* Official Square Portal Card */}
      <div className="bg-white border-2 border-gray-900/10 rounded-2xl shadow-sm overflow-hidden">
        {/* Square Portal Top Brand Header */}
        <div className="bg-gray-950 text-white px-5 py-4 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            {/* Square Official Logo Mark */}
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center p-1.5 shadow-xs">
              <div className="w-full h-full bg-gray-950 rounded-[4px] flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-[2px]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">Square</span>
                <span className="text-[10px] uppercase font-semibold text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
                  Secure Checkout Portal
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Official Hosted Checkout Gateway
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/40">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* Order Details & Founder Discount Breakdown */}
        <div className="p-5 sm:p-6 space-y-5">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-bold text-gray-900 text-base">
                  {planName}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Member #100 Milestone &bull; Lifetime Executive Access
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400 line-through">
                  ${originalPrice}.00 USD
                </div>
                <div className="text-2xl font-extrabold text-gray-900">
                  ${finalPrice}.00 <span className="text-xs font-normal text-gray-500">USD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Applied Promo Code Pill */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold text-gray-900">Promo applied: </span>
                <span className="font-mono font-semibold text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded">
                  {promoCode}
                </span>
              </div>
            </div>
            <span className="font-semibold text-emerald-600">-$100.00 OFF</span>
          </div>

          {/* Security & Accepted Methods Badges */}
          <div className="border-t border-gray-100 pt-4">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Accepted Square Payment Methods
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {['Apple Pay', 'Google Pay', 'Visa', 'Mastercard', 'Amex', 'Cash App Pay'].map((method) => (
                <span
                  key={method}
                  className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[11px] font-medium text-gray-700"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Portal Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              disabled={isLoadingSession}
              onClick={handleOpenHostedPortal}
              className="w-full flex items-center justify-center gap-2.5 bg-gray-900 hover:bg-black text-white font-semibold py-3 px-5 rounded-xl shadow-sm transition disabled:opacity-50"
            >
              {isLoadingSession ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-gray-300" />
                  <span>Connecting to Square Portal...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Pay $99 via Square Portal</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-1" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full text-center text-xs text-gray-500 hover:text-gray-900 py-1.5 font-medium transition"
            >
              Prefer embedded Square checkout? Click to open portal overlay
            </button>
          </div>
        </div>

        {/* Bottom Trust Footer */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-gray-600" />
            <span>PCI-DSS Level 1 Certified</span>
          </div>
          <span>Encrypted by Square, Inc.</span>
        </div>
      </div>

      {/* Embedded Square Checkout Portal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gray-950 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center p-1">
                  <div className="w-full h-full bg-gray-950 rounded-[3px] flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-[1.5px]" />
                  </div>
                </div>
                <div>
                  <div className="font-bold text-sm">Square Checkout Portal</div>
                  <div className="text-[10px] text-gray-400">Order ID: {portalSession?.orderId || 'sq_order_pending'}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 font-medium">Merchant</span>
                  <span className="text-xs font-semibold text-gray-900">NovaSuite Technologies</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 font-medium">Plan</span>
                  <span className="text-xs font-semibold text-gray-900">Founder Lifetime Pass (User #100)</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 font-medium">Promo Discount</span>
                  <span className="text-xs font-semibold text-emerald-600">-$100.00 USD ({promoCode})</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-sm font-bold text-gray-900">Total to Charge</span>
                  <span className="text-lg font-extrabold text-gray-900">${finalPrice}.00 USD</span>
                </div>
              </div>

              {/* Square Official Web Payments SDK Form inside Modal */}
              <div className="pt-2">
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
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" /> Powered by Square Payment Portal
              </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-900 underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
