'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Sparkles,
  Mail,
  Calendar,
  ListTodo,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Zap,
  RotateCcw,
  Send,
  Shield,
  Clock,
  TrendingUp,
  Inbox,
  AlertCircle
} from 'lucide-react';

function FirstRunTourContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [interactiveDirective, setInteractiveDirective] = useState('');
  const [directiveResponse, setDirectiveResponse] = useState<string | null>(null);
  const [isSimulatingDirective, setIsSimulatingDirective] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Check if URL specifies ?tour=true or if this is the user's first visit after checkout
    const forceTour = searchParams.get('tour') === 'true';
    const hasSeen = localStorage.getItem('nova_has_seen_tour');

    if (forceTour || !hasSeen) {
      setIsOpen(true);
      setCurrentStep(0);
    }

    // Listen for custom replay event dispatched from anywhere (Header, Help page, Settings)
    const handleReplayEvent = () => {
      setIsOpen(true);
      setCurrentStep(0);
      setDirectiveResponse(null);
    };

    window.addEventListener('nova:open-tour', handleReplayEvent);
    return () => window.removeEventListener('nova:open-tour', handleReplayEvent);
  }, [searchParams]);

  const handleClose = () => {
    localStorage.setItem('nova_has_seen_tour', 'true');
    setIsOpen(false);
    // If ?tour=true is in the URL, cleanly strip it without full reload
    if (searchParams.get('tour')) {
      router.replace('/dashboard');
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleTestDirective = (cmd: string) => {
    setInteractiveDirective(cmd);
    setIsSimulatingDirective(true);
    setDirectiveResponse(null);

    setTimeout(() => {
      setIsSimulatingDirective(false);
      if (cmd.includes('Sarah') || cmd.includes('Draft')) {
        setDirectiveResponse('Draft email prepared: "Hi Sarah, our team reviewed the proposal and approved Phase 1 milestones." Saved to Outbox for your 1-click confirmation.');
      } else if (cmd.includes('Reschedule') || cmd.includes('2pm') || cmd.includes('Calendar')) {
        setDirectiveResponse('Calendar adjusted: Moved 2:00 PM Team Sync to 3:30 PM. Focus block from 1:00 PM – 3:30 PM is now protected.');
      } else {
        setDirectiveResponse('Directive acknowledged: Reprioritized 4 tasks. Highest impact task #102 now scheduled for tomorrow 9:00 AM.');
      }
    }, 700);
  };

  if (!isOpen) return null;

  const steps = [
    {
      id: 'task-scoring',
      title: '0–100 AI Task Prioritization',
      subtitle: 'Never question what to work on next. Nova evaluates urgency, client impact, and executive alignment in real-time.',
      icon: <ListTodo className="w-5 h-5 text-indigo-600" />,
      content: (
        <div className="space-y-4">
          <div className="bg-white border border-[--border] rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  AI Score: 94 / 100
                </span>
                <span className="text-xs text-gray-500 font-medium">Ranked #1 Priority</span>
              </div>
              <span className="text-xs text-rose-500 font-semibold">Due Today, 5:00 PM</span>
            </div>

            <h4 className="font-semibold text-gray-900 text-sm mb-1">
              Finalize Enterprise SLA contract for Series A client
            </h4>
            <p className="text-xs text-gray-500 mb-3">
              Client waiting on revision clause. Estimated completion: 45 mins.
            </p>

            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 space-y-1.5 text-[11px]">
              <div className="text-gray-700 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>Why Nova scored this 94:</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>• Imminent Deadline (&lt; 6 hrs remaining)</span>
                <span className="font-semibold text-emerald-600">+40 pts</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>• Strategic Client Revenue Impact ($120k ARR)</span>
                <span className="font-semibold text-emerald-600">+35 pts</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>• Aligns with Executive Goal: Close Q4 Deals</span>
                <span className="font-semibold text-emerald-600">+19 pts</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 italic">
            Tip: Your tasks on the Dashboard &amp; Tasks tab are dynamically ordered by this score. As deadlines shift, Nova recalibrates automatically.
          </p>
        </div>
      )
    },
    {
      id: 'email-assistant',
      title: 'AI Email Intelligence & Action Items',
      subtitle: 'Connect Gmail or Outlook to eliminate inbox zero friction. Nova extracts deliverables and prepares context-aware drafts.',
      icon: <Mail className="w-5 h-5 text-indigo-600" />,
      content: (
        <div className="space-y-4">
          <div className="bg-white border border-[--border] rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 text-sm">Marcus Vance</span>
                  <span className="text-xs text-gray-400">&lt;marcus@acmecorp.com&gt;</span>
                </div>
                <p className="text-xs font-medium text-gray-700">Subject: Project kickoff timeline &amp; deliverables</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                Action Required
              </span>
            </div>

            <div className="bg-indigo-50/60 border border-indigo-100 rounded-lg p-3 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-indigo-900">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Nova AI Email Extraction:</span>
              </div>
              <ul className="list-disc list-inside text-gray-700 text-[11px] space-y-1">
                <li>Marcus requested the finalized architecture diagram by Thursday 2 PM.</li>
                <li>Budget approval is pending your signoff on Scope Doc v2.</li>
              </ul>
              <div className="pt-2 border-t border-indigo-100 flex items-center justify-between">
                <span className="text-[11px] text-indigo-700 font-medium">Ready: 1-Click AI Response Drafted</span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Pre-screened
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 italic">
            Tip: Connect your email in <strong>Settings → Email Providers</strong>. Nova will triage your inbox without sending anything without your consent.
          </p>
        </div>
      )
    },
    {
      id: 'calendar-focus',
      title: 'Smart Calendar & Focus Guarding',
      subtitle: 'Nova syncs with Google Calendar & Outlook to protect 2-hour deep-work blocks and prevent meeting burnout.',
      icon: <Calendar className="w-5 h-5 text-indigo-600" />,
      content: (
        <div className="space-y-4">
          <div className="bg-white border border-[--border] rounded-xl p-4 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-700 pb-2 border-b border-gray-100">
              <span>Today&apos;s AI Optimized Schedule</span>
              <span className="text-indigo-600 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Guard Active
              </span>
            </div>

            {/* Time slot 1: Protected Deep Work */}
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="text-center font-mono text-[11px] font-bold text-emerald-800 leading-tight">
                09:00<br /><span className="text-gray-400 font-normal">11:00</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-900">Protected Deep Work Block</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold">Guarded</span>
                </div>
                <p className="text-[11px] text-emerald-700">Reserved for AI Task #1 (Enterprise SLA contract)</p>
              </div>
            </div>

            {/* Time slot 2: Meeting with buffer */}
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-center font-mono text-[11px] font-bold text-gray-700 leading-tight">
                11:30<br /><span className="text-gray-400 font-normal">12:15</span>
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-gray-900">Executive Team Weekly Sync</span>
                <p className="text-[11px] text-gray-500">Auto-buffered with 30m prep &amp; recap time</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 italic">
            Tip: Connect your calendar in <strong>Dashboard → Calendar</strong>. Nova will suggest time blocks directly tailored to your high-score tasks.
          </p>
        </div>
      )
    },
    {
      id: 'directives-hub',
      title: 'Executive Directive Bar & Quick Execution',
      subtitle: 'Instruct Nova in plain English. Click a sample below to test instant directive processing right now.',
      icon: <Zap className="w-5 h-5 text-indigo-600" />,
      content: (
        <div className="space-y-4">
          <div className="bg-white border border-[--border] rounded-xl p-4 shadow-sm space-y-3">
            <p className="text-xs text-gray-600 font-medium">Click a directive to test the AI engine:</p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleTestDirective('Draft reply to Sarah approving contract proposal')}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium border border-indigo-200 transition text-left"
              >
                &ldquo;Draft reply to Sarah approving contract&rdquo;
              </button>
              <button
                type="button"
                onClick={() => handleTestDirective('Reschedule 2pm meeting to protect focus block')}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium border border-indigo-200 transition text-left"
              >
                &ldquo;Reschedule 2pm meeting to protect focus&rdquo;
              </button>
            </div>

            {/* Direct Input & Simulator */}
            <div className="relative mt-2">
              <input
                type="text"
                value={interactiveDirective}
                onChange={(e) => setInteractiveDirective(e.target.value)}
                placeholder="Or type any instruction for Nova..."
                className="w-full text-xs pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && interactiveDirective.trim()) {
                    handleTestDirective(interactiveDirective);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (interactiveDirective.trim()) {
                    handleTestDirective(interactiveDirective);
                  }
                }}
                disabled={isSimulatingDirective || !interactiveDirective.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-indigo-600 hover:text-indigo-800 disabled:opacity-30"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Live Response Box */}
            {isSimulatingDirective && (
              <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center gap-2 text-xs text-indigo-700 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nova is processing your directive...</span>
              </div>
            )}

            {directiveResponse && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Executive Directive Executed:</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">{directiveResponse}</p>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500 italic">
            You can access this Directive Bar anytime on the Dashboard or by typing in the Assistant Hub!
          </p>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden max-h-[90vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              {currentStepData.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Tour: Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-base leading-snug">
                {currentStepData.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            title="Close Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-gray-100 h-1">
          <div
            className="bg-indigo-600 h-1 transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Step Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed font-medium">
            {currentStepData.subtitle}
          </p>
          {currentStepData.content}
        </div>

        {/* Footer Controls */}
        <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep ? 'w-6 bg-indigo-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <span>{currentStep === steps.length - 1 ? 'Enter Workspace' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FirstRunTourModal() {
  return (
    <Suspense fallback={null}>
      <FirstRunTourContent />
    </Suspense>
  );
}
