'use client';

import { useState } from 'react';
import SquarePaymentPortal from '@/app/components/SquarePaymentPortal';
import FounderMilestoneCard from '@/app/components/FounderMilestoneCard';
import { Trophy } from 'lucide-react';

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
    <div className="space-y-4">
      {/* 100th User Milestone Celebration Banner */}
      <FounderMilestoneCard variant="banner" />

      <div className="text-center max-w-lg mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold mb-1.5">
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>Final Step &bull; Activate Founder Account</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Secure Your Founder Lifetime Pass
        </h2>
        <p className="text-gray-500 text-xs mt-1">
          One payment. Lifetime access. No recurring subscription.
        </p>
      </div>

      {/* Square Payment Portal */}
      <div className="max-w-xl mx-auto">
        <SquarePaymentPortal
          planName="Nova Executive Founder Lifetime Pass"
          originalPrice={199}
          finalPrice={99}
          promoCode="FOUNDER100"
          onSuccess={handlePaymentSuccess}
          onCancel={onBack}
        />
      </div>

    </div>
  );
}
