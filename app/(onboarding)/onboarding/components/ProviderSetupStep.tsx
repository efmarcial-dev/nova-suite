'use client';

import { useState, useEffect } from 'react';
import { Mail, Calendar, CheckCircle2, RefreshCw, ShieldCheck, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { connectEmailProviderAPI, fetchEmailProvidersAPI } from '@/app/lib/api/email';
import { connectCalendarProviderAPI, fetchCalendarConnectionAPI } from '@/app/lib/api/calendar';

interface ProviderSetupStepProps {
  onNext: () => void;
  onBack?: () => void;
}

export default function ProviderSetupStep({ onNext, onBack }: ProviderSetupStepProps) {
  const [emailConnected, setEmailConnected] = useState(false);
  const [emailProvider, setEmailProvider] = useState<'gmail' | 'outlook' | null>(null);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [calendarProvider, setCalendarProvider] = useState<'google' | 'outlook' | null>(null);

  const [isConnectingEmail, setIsConnectingEmail] = useState<'gmail' | 'outlook' | null>(null);
  const [isConnectingCalendar, setIsConnectingCalendar] = useState<'google' | 'outlook' | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [connectionError, setConnectionError] = useState('');

  // Check live connections
  useEffect(() => {
    const checkStatus = async () => {
      setIsChecking(true);
      try {
        const [emailList, calStatus] = await Promise.all([
          fetchEmailProvidersAPI().catch(() => []),
          fetchCalendarConnectionAPI().catch(() => null),
        ]);

        const activeEmail = emailList.find((p) => p.is_connected);
        if (activeEmail) {
          setEmailConnected(true);
          setEmailProvider(activeEmail.provider === 'outlook' ? 'outlook' : 'gmail');
        }

        if (calStatus?.isConnected) {
          setCalendarConnected(true);
          setCalendarProvider(calStatus.provider === 'outlook' ? 'outlook' : 'google');
        }
      } catch (e) {
        console.warn('Could not check provider connections', e);
      } finally {
        setIsChecking(false);
      }
    };

    checkStatus();
  }, []);

  const handleConnectEmail = async (provider: 'gmail' | 'outlook') => {
    setIsConnectingEmail(provider);
    try {
      const res = await connectEmailProviderAPI(provider);
      const url = res?.authorization_url || res?.auth_url || res?.url;
      if (url) {
        window.location.href = url;
        return;
      }
      throw new Error('The backend did not return an authorization URL.');
    } catch (e) {
      console.error('Failed to connect email', e);
      setConnectionError(e instanceof Error ? e.message : 'Could not start email authorization.');
    } finally {
      setIsConnectingEmail(null);
    }
  };

  const handleConnectCalendar = async (provider: 'google' | 'outlook') => {
    setIsConnectingCalendar(provider);
    try {
      const res = await connectCalendarProviderAPI(provider);
      const url = res?.authorization_url || res?.auth_url || res?.url;
      if (url) {
        window.location.href = url;
        return;
      }
      throw new Error('The backend did not return an authorization URL.');
    } catch (e) {
      console.error('Failed to connect calendar', e);
      setConnectionError(e instanceof Error ? e.message : 'Could not start calendar authorization.');
    } finally {
      setIsConnectingCalendar(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-1">
          <Sparkles size={12} />
          <span>Real-Time Workspace Sync</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-950">
          Connect Your Email &amp; Calendar
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Connect your accounts now so your dashboard opens pre-configured with live emails, meetings, and AI triage actions.
        </p>
      </div>

      {connectionError && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {connectionError}
        </div>
      )}

      {/* Grid of 2 Setup Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email Connection Card */}
        <div className={`p-5 rounded-2xl border transition-all ${
          emailConnected ? 'bg-indigo-50/20 border-indigo-500' : 'bg-white border-gray-200'
        } flex flex-col justify-between space-y-4`}>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Mail size={20} />
              </div>
              {emailConnected ? (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  <CheckCircle2 size={12} /> Connected
                </span>
              ) : (
                <span className="text-xs text-gray-400">Step 1</span>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900">Email Provider</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Powers AI inbox triage, urgency scoring, and draft response preparation.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-100">
            {emailConnected ? (
              <div className="text-xs text-emerald-700 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/80 flex items-center gap-2">
                <Check size={14} className="shrink-0" />
                <span>Inbox active ({emailProvider === 'outlook' ? 'Microsoft Outlook' : 'Google Gmail'})</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleConnectEmail('gmail')}
                  disabled={!!isConnectingEmail}
                  className="px-3 py-2 rounded-xl border border-gray-200 hover:border-indigo-400 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isConnectingEmail === 'gmail' && <RefreshCw size={12} className="animate-spin" />}
                  <span>Gmail</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleConnectEmail('outlook')}
                  disabled={!!isConnectingEmail}
                  className="px-3 py-2 rounded-xl border border-gray-200 hover:border-indigo-400 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isConnectingEmail === 'outlook' && <RefreshCw size={12} className="animate-spin" />}
                  <span>Outlook</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Calendar Connection Card */}
        <div className={`p-5 rounded-2xl border transition-all ${
          calendarConnected ? 'bg-indigo-50/20 border-indigo-500' : 'bg-white border-gray-200'
        } flex flex-col justify-between space-y-4`}>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <Calendar size={20} />
              </div>
              {calendarConnected ? (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  <CheckCircle2 size={12} /> Connected
                </span>
              ) : (
                <span className="text-xs text-gray-400">Step 2</span>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900">Calendar Provider</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Syncs meetings, checks schedule health, and prepares pre-meeting briefings.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-100">
            {calendarConnected ? (
              <div className="text-xs text-emerald-700 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/80 flex items-center gap-2">
                <Check size={14} className="shrink-0" />
                <span>Calendar active ({calendarProvider === 'outlook' ? 'Microsoft Outlook' : 'Google Calendar'})</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleConnectCalendar('google')}
                  disabled={!!isConnectingCalendar}
                  className="px-3 py-2 rounded-xl border border-gray-200 hover:border-indigo-400 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isConnectingCalendar === 'google' && <RefreshCw size={12} className="animate-spin" />}
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleConnectCalendar('outlook')}
                  disabled={!!isConnectingCalendar}
                  className="px-3 py-2 rounded-xl border border-gray-200 hover:border-indigo-400 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isConnectingCalendar === 'outlook' && <RefreshCw size={12} className="animate-spin" />}
                  <span>Outlook</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/70 flex items-center gap-2 text-xs text-gray-600">
        <ShieldCheck size={16} className="text-indigo-600 shrink-0" />
        <span>You can connect either provider now or skip and connect later from Workspace Settings.</span>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>Back</span>
          </button>
        ) : <div />}

        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl gradient-brand text-white text-xs font-semibold shadow-md shadow-indigo-100 hover:opacity-90 transition cursor-pointer"
        >
          <span>Continue to Activation</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
