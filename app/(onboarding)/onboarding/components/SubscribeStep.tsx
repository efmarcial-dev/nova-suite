'use client';

import { Sparkles, ArrowRight, ShieldCheck, Zap, Users, Infinity as InfinityIcon } from 'lucide-react';

interface SubscribeStepProps {
  onNext: () => void;
  onBack?: () => void;
}

export default function SubscribeStep({ onNext, onBack }: SubscribeStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>3-Day Free Trial Activated &bull; Unlimited Usage</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
          Welcome to Your Foxly Free Trial
        </h2>
        <p className="text-slate-600 text-sm mt-2 leading-relaxed">
          You have <strong>3 full days</strong> of unlimited access to everything Foxly offers.
          No payment is needed today—start exploring your new executive command center right away.
        </p>
      </div>

      <div className="max-w-xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1EA0FF] border border-blue-100">
              <InfinityIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Unlimited Usage</p>
              <p className="text-xs text-slate-500 mt-0.5">
                No artificial caps on AI messages, project tracking, or task scoring during your trial.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#FF8A00] border border-orange-100">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">AI Intelligence</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Automated inbox parsing, smart reply drafting, and real-time meeting briefings across Outlook &amp; Google.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Strict SOC II Rules</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Tenant-isolated security, zero public model training, and zero obligation or credit card required.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1EA0FF] border border-blue-100">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Multi-Account Workspace</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Connect multiple inboxes and calendars with Nylas Auth, Supabase, and Firestore sync.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            className="w-full flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#1EA0FF] hover:bg-[#0088EE] text-white text-sm font-bold transition shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            <span>Start Exploring Foxly</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
