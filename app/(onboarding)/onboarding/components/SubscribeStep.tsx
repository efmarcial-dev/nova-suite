'use client';

import { useState } from 'react';
import SquarePaymentPortal from '@/app/components/SquarePaymentPortal';
import FounderMilestoneCard from '@/app/components/FounderMilestoneCard';
import { ShieldCheck, Check, Sparkles, Trophy } from 'lucide-react';

interface SubscribeStepProps {
  onNext: () => void;
  onBack?: () => void;
}

export default function SubscribeStep({ onNext, onBack }: SubscribeStepProps) {
  const [hasSubscribed, setHasSubscribed] = useState(false);

  const handlePaymentSuccess = (subscriptionData: any) => {
    console.log("Founder subscription confirmed in onboarding:", subscriptionData);
    setHasSubscribed(true);
    // Proceed to DoneStep / Dashboard
    setTimeout(() => {
      onNext();
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* 100th User Milestone Celebration Banner */}
      <FounderMilestoneCard variant="banner" />

      <div className="text-center max-w-lg mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>Final Step &bull; Activate Founder Account</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Secure Your Founder Lifetime Pass
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">
          Complete your checkout via the official Square payment portal. Your starter projects, prioritized tasks, and executive assistant are ready.
        </p>
      </div>

      {/* Product Intelligence Highlights */}
      <div className="bg-gray-50/80 rounded-2xl border border-gray-200/80 p-4 max-w-xl mx-auto">
        <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2.5">
          Everything Included in Your Lifetime Pass:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
          <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-gray-100">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900 block font-semibold">Meeting Intelligence</strong>
              <span className="text-gray-500 text-[11px]">Extracts decisions & action items</span>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-gray-100">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900 block font-semibold">Email Intelligence</strong>
              <span className="text-gray-500 text-[11px]">Inbox prioritization & urgent flags</span>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-gray-100">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900 block font-semibold">Task Delegation</strong>
              <span className="text-gray-500 text-[11px]">Turns instructions into delegated tasks</span>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-gray-100">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900 block font-semibold">AI Generated Responses</strong>
              <span className="text-gray-500 text-[11px]">Prepares replies for your review</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-gray-200/70 flex items-center gap-2 text-[11px] text-indigo-900">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span><strong>The Nova Difference:</strong> AI that helps you complete work, not simply tell you what to do.</span>
        </div>
      </div>

      {/* Square Payment Portal */}
      <div className="max-w-lg mx-auto">
        <SquarePaymentPortal
          planName="Nova Executive Founder Lifetime Pass"
          originalPrice={199}
          finalPrice={99}
          promoCode="FOUNDER100"
          onSuccess={handlePaymentSuccess}
          onCancel={onBack}
        />
      </div>

      <p className="text-center text-[11px] text-gray-400 max-w-sm mx-auto">
        One-time payment of $99. No recurring monthly fees or auto-renewals. 100% money-back satisfaction guarantee within 14 days.
      </p>
    </div>
  );
}
