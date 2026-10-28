'use client';

import { useState } from 'react';
import { CheckCircle2, CreditCard, Lock, ShieldCheck, X } from 'lucide-react';
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
  planName = 'Foxly Founder Lifetime Access',
  originalPrice = 49,
  finalPrice = 49,
  onSuccess,
  onCancel,
}: SquarePaymentPortalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSuccess = (data: any) => {
    setIsModalOpen(false);
    setPaymentSuccess(true);
    onSuccess(data);
  };

  if (paymentSuccess) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-7 text-center shadow-sm">
        <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-600" />
        <h3 className="text-lg font-bold text-gray-900">Payment confirmed</h3>
        <p className="mt-1 text-sm text-gray-600">Your Founder Lifetime Access is active.</p>
      </div>
    );
  }

  return (
    <>
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
          <div className="p-4 sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1EA0FF]">Founder plan</p>
            <h3 className="mt-1 text-base font-bold leading-snug text-slate-900">{planName}</h3>
            <p className="mt-0.5 text-xs text-slate-500">One payment for lifetime access. No recurring charges.</p>
          </div>
          <div className="flex flex-col justify-center border-t border-slate-100 bg-gradient-to-br from-slate-50 to-[#F0F9FF] p-4 sm:border-l sm:border-t-0 sm:p-5">
            <p className="text-xs font-medium text-slate-500">Due today</p>
            <p className="mt-0.5 text-3xl font-extrabold tracking-tight text-slate-950">
              ${finalPrice}<span className="ml-1 text-sm font-semibold text-slate-500">USD</span>
            </p>
            {originalPrice > finalPrice && (
              <p className="text-xs text-slate-500">Regular price ${originalPrice} USD</p>
            )}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1EA0FF] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#0088EE]"
            >
              <CreditCard className="h-4 w-4" /> Continue to payment
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 border-t border-slate-100 px-4 py-2.5 text-[11px] text-slate-500">
          <Lock className="h-3.5 w-3.5" /> Your card details are handled by Square
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5">
          <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-slate-950 p-4 text-white">
              <div className="flex items-center gap-2.5">
                <CreditCard className="h-4 w-4" />
                <div>
                  <p className="text-sm font-bold">Complete your payment</p>
                  <p className="text-[11px] text-slate-400">{planName}</p>
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
            <div className="overflow-y-auto p-4 sm:p-5">
              <SquareCheckout
                planName={planName}
                originalPrice={originalPrice}
                finalPrice={finalPrice}
                amountCents={finalPrice * 100}
                plan="founder_lifetime"
                onSuccess={handleSuccess}
                onCancel={() => {
                  setIsModalOpen(false);
                  onCancel?.();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
