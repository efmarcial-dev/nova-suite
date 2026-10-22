'use client';

import { useState } from 'react';
import SquarePaymentPortal from '@/app/components/SquarePaymentPortal';

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
      <div className="text-center max-w-lg mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-semibold mb-1.5">
          <span>Final Step &bull; Founder lifetime access</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Activate NovaSuite
        </h2>
        <p className="text-gray-500 text-xs mt-1">
          One payment of $49. Lifetime access. No recurring subscription.
        </p>
      </div>

      {/* Square Payment Portal */}
      <div className="max-w-xl mx-auto">
        <SquarePaymentPortal
          planName="NovaSuite Founder Lifetime Access"
          originalPrice={49}
          finalPrice={49}
          onSuccess={handlePaymentSuccess}
          onCancel={onBack}
        />
      </div>

    </div>
  );
}
