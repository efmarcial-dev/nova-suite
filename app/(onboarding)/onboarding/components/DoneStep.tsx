'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export default function DoneStep() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard?tour=true');
    }, 1800);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-5 animate-bounce">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        You&apos;re All Set, Executive!
      </h2>
      <p className="text-gray-500 text-sm max-w-sm mb-6 leading-relaxed">
        Your Pro subscription is active. Starter projects and prioritized tasks have been provisioned in your workspace.
      </p>

      <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium bg-indigo-50 px-4 py-2 rounded-full mb-6">
        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
        <span>Launching your executive dashboard...</span>
      </div>

      <button
        type="button"
        onClick={() => router.push('/dashboard?tour=true')}
        className="text-xs text-gray-400 hover:text-gray-700 underline flex items-center gap-1"
      >
        <span>Click here if you are not automatically redirected</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}