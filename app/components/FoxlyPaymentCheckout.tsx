'use client';

import React, { useState } from 'react';
import { Check, ShieldCheck, Lock, Sparkles, CreditCard, ArrowRight } from 'lucide-react';
import SquareCheckout from './SquareCheckout';

interface FoxlyPaymentCheckoutProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
}

export type PlanType = 'annual' | 'monthly';

export default function FoxlyPaymentCheckout({
  onSuccess,
  onCancel,
  title = 'Choose your Foxly plan',
  subtitle = 'Continue with unlimited usage across multiple Google & Outlook accounts.',
}: FoxlyPaymentCheckoutProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('annual');
  const [showCardForm, setShowCardForm] = useState(false);

  const plans = {
    annual: {
      id: 'annual' as const,
      name: 'Foxly Annual Plan',
      monthlyDisplay: '$5',
      billingNote: 'Billed annually at $60/yr',
      badge: '50% OFF',
      amountCents: 6000,
      finalPrice: 60,
      originalPrice: 120,
      periodLabel: '1 Year Access',
      features: [
        'Multiple Google & Outlook inboxes',
        'Multi-calendar sync & conflict protection',
        '0–100 task prioritization',
        '1-click draft reply studio',
        'Strict SOC II compliance & private data isolation',
      ],
    },
    monthly: {
      id: 'monthly' as const,
      name: 'Foxly Monthly Plan',
      monthlyDisplay: '$10',
      billingNote: 'Billed monthly ($10/mo)',
      badge: 'Flexible',
      amountCents: 1000,
      finalPrice: 10,
      originalPrice: 10,
      periodLabel: '1 Month Access',
      features: [
        'Multiple Google & Outlook inboxes',
        'Multi-calendar sync & conflict protection',
        '0–100 task prioritization',
        '1-click draft reply studio',
        'Strict SOC II compliance & private data isolation',
      ],
    },
  };

  const activePlanConfig = plans[selectedPlan];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Clean Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0F9FF] border border-[#BFE7FF] text-[#1EA0FF] mb-2">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{title}</h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">{subtitle}</p>
      </div>

      {/* Plan Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Option 1: Annual Plan ($5/mo billed $60 - STANDS OUT MORE) */}
        <button
          type="button"
          onClick={() => {
            setSelectedPlan('annual');
            setShowCardForm(false);
          }}
          className={`relative text-left p-5 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer ${
            selectedPlan === 'annual'
              ? 'border-[#1EA0FF] bg-[#F0F9FF]/60 shadow-md ring-2 ring-blue-500/10'
              : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
          }`}
        >
          {/* 50% Off Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#1EA0FF] text-white uppercase tracking-wider">
              50% OFF
            </span>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                selectedPlan === 'annual'
                  ? 'border-[#1EA0FF] bg-[#1EA0FF] text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {selectedPlan === 'annual' && <Check size={12} strokeWidth={3} />}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-base">Annual Plan</h3>
            <p className="text-xs text-slate-500 mt-0.5">Best value for founders &amp; executives</p>

            {/* $5/mo stands out more */}
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-950 tracking-tight">$5</span>
              <span className="text-sm font-semibold text-slate-500">/month</span>
            </div>

            {/* Billed annually at $60 (subtle, doesn't stand out as much) */}
            <p className="text-xs font-medium text-slate-500 mt-1">
              Billed annually at $60/yr
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] font-semibold text-[#1EA0FF]">
            Save $60 per year
          </div>
        </button>

        {/* Option 2: Monthly Plan ($10/mo - NORMAL) */}
        <button
          type="button"
          onClick={() => {
            setSelectedPlan('monthly');
            setShowCardForm(false);
          }}
          className={`relative text-left p-5 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer ${
            selectedPlan === 'monthly'
              ? 'border-[#1EA0FF] bg-[#F0F9FF]/60 shadow-md ring-2 ring-blue-500/10'
              : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
              Monthly
            </span>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                selectedPlan === 'monthly'
                  ? 'border-[#1EA0FF] bg-[#1EA0FF] text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {selectedPlan === 'monthly' && <Check size={12} strokeWidth={3} />}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-base">Monthly Plan</h3>
            <p className="text-xs text-slate-500 mt-0.5">Flexible, month-to-month access</p>

            {/* $10/mo */}
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-950 tracking-tight">$10</span>
              <span className="text-sm font-semibold text-slate-500">/month</span>
            </div>

            <p className="text-xs font-medium text-slate-500 mt-1">
              Billed monthly &bull; Cancel anytime
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] font-semibold text-slate-500">
            Standard pricing
          </div>
        </button>
      </div>

      {/* Summary Row */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between text-xs sm:text-sm">
        <div>
          <span className="text-slate-500">Selected plan: </span>
          <span className="font-bold text-slate-900">{activePlanConfig.name}</span>
          <span className="text-slate-400 block text-xs">{activePlanConfig.billingNote}</span>
        </div>
        <div className="text-right">
          <span className="text-slate-500 text-xs block">Due today</span>
          <span className="text-xl font-black text-slate-950">${activePlanConfig.finalPrice}.00 USD</span>
        </div>
      </div>

      {/* Checkout Form or Continue Button */}
      {showCardForm ? (
        <div className="space-y-4 pt-2">
          <SquareCheckout
            planName={activePlanConfig.name}
            originalPrice={activePlanConfig.originalPrice}
            finalPrice={activePlanConfig.finalPrice}
            amountCents={activePlanConfig.amountCents}
            plan={activePlanConfig.id}
            billingCycleLabel={activePlanConfig.billingNote}
            badgeLabel={activePlanConfig.badge}
            onSuccess={onSuccess}
            onCancel={() => setShowCardForm(false)}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowCardForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1EA0FF] hover:bg-[#0088EE] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <CreditCard className="h-4 w-4" />
          <span>Pay ${activePlanConfig.finalPrice}.00 USD &amp; Activate Foxly</span>
        </button>
      )}

      {/* Security note */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
        <Lock className="h-3.5 w-3.5 text-[#1EA0FF]" />
        <span>Payments are processed securely via Square with 256-bit encryption</span>
      </div>
    </div>
  );
}
