'use client';

import { useState, useEffect } from 'react';
import { Mail, Calendar, CheckCircle2, RefreshCw, ShieldCheck, ArrowRight, ArrowLeft, Check, Sparkles, ExternalLink, Plus } from 'lucide-react';
import { connectEmailProviderAPI, fetchEmailProvidersAPI } from '@/app/lib/api/email';
import { connectCalendarProviderAPI, fetchCalendarConnectionAPI } from '@/app/lib/api/calendar';
import { fetchNylasGrantsAPI, startNylasConnectAPI, NylasGrant } from '@/app/lib/api/nylas';

interface ProviderSetupStepProps {
  onNext: () => void;
  onBack?: () => void;
}

export default function ProviderSetupStep({ onNext, onBack }: ProviderSetupStepProps) {
  const [nylasGrants, setNylasGrants] = useState<NylasGrant[]>([]);
  const [emailConnected, setEmailConnected] = useState(false);
  const [emailProvider, setEmailProvider] = useState<string | null>(null);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [calendarProvider, setCalendarProvider] = useState<string | null>(null);

  const [isConnecting, setIsConnecting] = useState<'google' | 'microsoft' | 'other' | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [connectionError, setConnectionError] = useState('');

  // Check live connections
  useEffect(() => {
    const checkStatus = async () => {
      setIsChecking(true);
      try {
        const [grants, emailList, calStatus] = await Promise.all([
          fetchNylasGrantsAPI().catch(() => []),
          fetchEmailProvidersAPI().catch(() => []),
          fetchCalendarConnectionAPI().catch(() => null),
        ]);

        const activeGrants = grants.filter((g) => g.is_connected !== false);
        setNylasGrants(activeGrants);

        if (activeGrants.length > 0) {
          setEmailConnected(true);
          setCalendarConnected(true);
          setEmailProvider(activeGrants[0].provider);
          setCalendarProvider(activeGrants[0].provider);
        } else {
          const activeEmail = emailList.find((p) => p.is_connected);
          if (activeEmail) {
            setEmailConnected(true);
            setEmailProvider(activeEmail.provider === 'outlook' ? 'outlook' : 'gmail');
          }

          if (calStatus?.isConnected) {
            setCalendarConnected(true);
            setCalendarProvider(calStatus.provider === 'outlook' ? 'outlook' : 'google');
          }
        }
      } catch (e) {
        console.warn('Could not check provider connections', e);
      } finally {
        setIsChecking(false);
      }
    };

    checkStatus();
  }, []);

  const handleConnectProvider = async (provider?: 'google' | 'microsoft' | 'other') => {
    setIsConnecting(provider || 'other');
    setConnectionError('');
    try {
      const selectedProv = provider === 'other' ? undefined : provider;
      const url = await startNylasConnectAPI({
        provider: selectedProv,
        product: 'all',
        origin: 'onboarding',
      });
      if (url) {
        window.location.href = url;
        return;
      }
      throw new Error('Backend did not return an authorization URL.');
    } catch (e) {
      console.error('Failed to connect provider', e);
      setConnectionError(e instanceof Error ? e.message : 'Could not start account authorization.');
      setIsConnecting(null);
    }
  };

  const hasAnyConnection = nylasGrants.length > 0 || emailConnected || calendarConnected;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F9FF] border border-[#BFE7FF] text-[#0088EE] text-xs font-semibold mb-1">
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

      {/* Connected Accounts Status (if any) */}
      {nylasGrants.length > 0 && (
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
            <CheckCircle2 size={15} className="text-emerald-600" />
            <span>{nylasGrants.length} {nylasGrants.length === 1 ? 'Account' : 'Accounts'} Connected (Email &amp; Calendar Synced)</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {nylasGrants.map((g) => (
              <span
                key={g.grant_id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-emerald-200 text-xs font-semibold text-gray-800 shadow-2xs"
              >
                <Check size={12} className="text-emerald-600" />
                <span className="capitalize text-gray-500 font-normal">[{g.provider}]</span>
                <span>{g.email}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Grid of Provider Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Google Card */}
        <div className="p-5 rounded-2xl border border-gray-200 bg-white hover:border-[#4285F4] transition-all flex flex-col justify-between space-y-4 shadow-2xs">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-2xs">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Recommended
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900">Google Workspace &amp; Gmail</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Connects your Gmail inbox and Google Calendar in a single secure authorization.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => handleConnectProvider('google')}
              disabled={!!isConnecting}
              className="w-full px-4 py-2.5 rounded-xl gradient-brand text-white text-xs font-semibold shadow-xs hover:opacity-90 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isConnecting === 'google' ? (
                <>
                  <RefreshCw size={12} className="animate-spin" />
                  <span>Connecting Google...</span>
                </>
              ) : (
                <>
                  <span>Connect Google Account</span>
                  <ExternalLink size={12} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Microsoft Card */}
        <div className="p-5 rounded-2xl border border-gray-200 bg-white hover:border-[#0078D4] transition-all flex flex-col justify-between space-y-4 shadow-2xs">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#0078D4] flex items-center justify-center text-white shadow-2xs">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M14.5 6.5h-5A1.5 1.5 0 008 8v8a1.5 1.5 0 001.5 1.5h5a1.5 1.5 0 001.5-1.5V8a1.5 1.5 0 00-1.5-1.5z" fill="#fff" fillOpacity="0.9" />
                  <path d="M12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" fill="#0078D4" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                Enterprise
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900">Microsoft 365 &amp; Outlook</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Connects your Outlook inbox and Exchange calendar in a single step.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => handleConnectProvider('microsoft')}
              disabled={!!isConnecting}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 hover:border-[#0078D4] bg-white hover:bg-sky-50/30 text-gray-800 text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isConnecting === 'microsoft' ? (
                <>
                  <RefreshCw size={12} className="animate-spin" />
                  <span>Connecting Microsoft...</span>
                </>
              ) : (
                <>
                  <span>Connect Microsoft Account</span>
                  <ExternalLink size={12} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200/70 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#1EA0FF] shrink-0" />
          <span>Multi-account support: You can connect multiple Google &amp; Outlook inboxes.</span>
        </div>
        <button
          type="button"
          onClick={() => handleConnectProvider('other')}
          disabled={!!isConnecting}
          className="text-xs font-semibold text-[#1EA0FF] hover:underline cursor-pointer shrink-0"
        >
          Other Provider →
        </button>
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
          className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl gradient-brand text-white text-xs font-semibold shadow-md shadow-blue-500/10 hover:opacity-90 transition cursor-pointer"
        >
          <span>Continue to Activation</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
