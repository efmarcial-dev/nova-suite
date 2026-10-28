'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function DoneStep() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard?tour=true');
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-5 animate-bounce">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Thank you. You&apos;re all set!
      </h2>
      <p className="text-gray-500 text-sm max-w-sm mb-6 leading-relaxed">
        Your payment was successful and your workspace is ready. We&apos;re taking you to your dashboard now.
      </p>

      <div className="flex items-center gap-2 text-xs text-[#1EA0FF] font-medium bg-[#F0F9FF] px-4 py-2 rounded-full mb-6">
        <span className="w-2 h-2 rounded-full bg-[#1EA0FF] animate-ping" />
        <span>Launching your executive dashboard...</span>
      </div>

      <button
        type="button"
        onClick={() => router.push('/dashboard?tour=true')}
        className="text-xs text-gray-400 hover:text-gray-700 underline flex items-center gap-1"
      >
        <span>Continue to dashboard</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}
