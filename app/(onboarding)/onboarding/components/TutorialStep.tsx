'use client';

import { useState } from 'react';
import {
  Sparkles,
  Bot,
  Zap,
  Mail,
  Calendar,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Layers,
  Send,
  Loader2
} from 'lucide-react';

interface TutorialStepProps {
  onNext: () => void;
  onBack?: () => void;
}

export default function TutorialStep({ onNext, onBack }: TutorialStepProps) {
  const [activeTab, setActiveTab] = useState<'briefing' | 'scoring' | 'directives'>('briefing');
  const [isSubmittingStep, setIsSubmittingStep] = useState(false);

  const handleContinue = async () => {
    setIsSubmittingStep(true);
    try {
      // Advance user onboarding step to 1 (Tutorial Complete)
      await fetch('/api/onboarding-step', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 1 }),
      });
    } catch (err) {
      console.warn('Could not record onboarding step, proceeding anyway:', err);
    } finally {
      setIsSubmittingStep(false);
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0F9FF] border border-[#BFE7FF] text-[#0088EE] text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Product Tour</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          How Nova Operates as Your Executive Assistant
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Review the core capabilities designed to eliminate daily cognitive overhead before activating your workspace.
        </p>
      </div>

      {/* Feature Selector Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-xl max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('briefing')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
            activeTab === 'briefing'
              ? 'bg-white text-[#1EA0FF] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          1. Daily Briefing
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('scoring')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
            activeTab === 'scoring'
              ? 'bg-white text-[#1EA0FF] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          2. AI Task Scoring
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('directives')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
            activeTab === 'directives'
              ? 'bg-white text-[#1EA0FF] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          3. Directives &amp; Email
        </button>
      </div>

      {/* Tab Showcase Card */}
      <div className="bg-gray-50 border border-[--border] rounded-2xl p-6 min-h-[250px] transition-all">
        {activeTab === 'briefing' && (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#1EA0FF] text-white flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-base">Proactive Executive Morning Briefings</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Every morning, Nova synthesizes upcoming deliverables, meetings, and unread client communication into an actionable agenda with zero manual sorting.
                </p>
              </div>
            </div>

            {/* Mock Visual */}
            <div className="bg-white rounded-xl p-4 border border-[--border] shadow-xs space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                <span className="flex items-center gap-1.5 text-[#0088EE]">
                  <Sparkles className="w-3.5 h-3.5" /> Today&apos;s Focus
                </span>
                <span className="text-gray-400">8:30 AM Briefing</span>
              </div>
              <p className="text-xs text-gray-700 bg-[#F0F9FF]/50 p-2.5 rounded-lg border border-[#BFE7FF]">
                &ldquo;You have 2 high-priority deliverables due today and 1 client sync at 2:00 PM. I&apos;ve cleared a 90-minute focus block this afternoon to protect your deep work.&rdquo;
              </p>
            </div>
          </div>
        )}

        {activeTab === 'scoring' && (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-base">0–100 AI Urgency &amp; Priority Scoring</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Tasks are dynamically evaluated in real-time. Nova factors in deadline proximity, project weights, and urgency tags to bubble the truly critical items to the top.
                </p>
              </div>
            </div>

            {/* Mock Task Pill */}
            <div className="bg-white rounded-xl p-4 border border-[--border] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-800">Finalize Enterprise Client Proposal</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-gray-400">Due today &bull; Sprint Planning</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                <Zap className="w-3 h-3 fill-rose-600 text-rose-600" /> 92 AI Score
              </span>
            </div>
          </div>
        )}

        {activeTab === 'directives' && (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-base">Executive Directive Bar &amp; Email Stream</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Type a command to draft client follow-ups, reassign priorities, or schedule meetings. Your directives are queued and executed seamlessly.
                </p>
              </div>
            </div>

            {/* Mock Input Bar */}
            <div className="bg-white rounded-xl p-3 border border-[--border] shadow-xs flex items-center gap-2 text-xs text-gray-500">
              <Send className="w-4 h-4 text-[#1EA0FF]" />
              <span className="italic text-gray-400">
                &ldquo;Draft a reply to Sarah agreeing to the 2pm schedule and mark proposal as complete&rdquo;
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Highlights List */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-gray-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Starter projects &amp; tasks already prepared</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Google &amp; Outlook calendar integrations</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Full single-domain local caching &amp; offline mode</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Cancel or adjust subscription anytime</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-[--border]">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
          >
            Back
          </button>
        ) : <div />}

        <button
          type="button"
          onClick={handleContinue}
          disabled={isSubmittingStep}
          className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#1EA0FF] hover:bg-[#0088EE] flex items-center gap-2 shadow-sm transition disabled:opacity-50"
        >
          {isSubmittingStep ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving Progress...</span>
            </>
          ) : (
            <>
              <span>Continue to Subscription</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
