'use client';

import { useState, useEffect } from 'react';
import { useCachedUser } from '@/app/hooks/useCachedUser';
import { saveUserToCache } from '@/app/lib/cache/NovaCacheHelpers';
import {
  User,
  Mail,
  Bell,
  Check,
  Globe,
  Clock,
  Save,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Bot,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

type EmailProviderId = 'gmail' | 'microsoft';

interface EmailProviderConfig {
  id: EmailProviderId;
  name: string;
  subtitle: string;
  tag: string;
  desc: string;
  icon: React.ReactNode;
}

const providers: EmailProviderConfig[] = [
  {
    id: 'gmail',
    name: 'Gmail & Google Workspace',
    subtitle: 'Google Cloud OAuth 2.0',
    tag: 'Recommended',
    desc: 'Connect your personal Gmail or Google Workspace inbox. Assistant will parse action items, draft email responses, and track client deliverables.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
      </svg>
    ),
  },
  {
    id: 'microsoft',
    name: 'Microsoft Outlook / Office 365',
    subtitle: 'Microsoft Graph API',
    tag: 'Enterprise Standard',
    desc: 'Connect your Microsoft 365, Outlook.com, or Exchange inbox. Real-time webhook sync for corporate and executive correspondence.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#0078D4" />
        <path d="M14.5 6.5h-5A1.5 1.5 0 008 8v8a1.5 1.5 0 001.5 1.5h5a1.5 1.5 0 001.5-1.5V8a1.5 1.5 0 00-1.5-1.5z" fill="#fff" fillOpacity="0.8" />
        <path d="M12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" fill="#0078D4" />
      </svg>
    ),
  },
];

export default function SettingsPage() {
  const { user } = useCachedUser();
  const currentUser = user?.[0];

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'profile' | 'email' | 'assistant' | 'notifications'>('profile');

  // Profile states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [timezone, setTimezone] = useState('America/Los_Angeles (Pacific Time)');

  // Email Provider Connection states
  const [connectedProvider, setConnectedProvider] = useState<EmailProviderId | null>('gmail');
  const [connectedEmail, setConnectedEmail] = useState('eduardo@novasuite.io');
  const [isConnecting, setIsConnecting] = useState<EmailProviderId | null>(null);

  // Email Sync Guardrails
  const [autoParseTasks, setAutoParseTasks] = useState(true);
  const [draftReplies, setDraftReplies] = useState(true);
  const [trackDeadlines, setTrackDeadlines] = useState(true);

  // Assistant states
  const [briefingTime, setBriefingTime] = useState('08:00');
  const [assistantTone, setAssistantTone] = useState<'concise' | 'detailed' | 'conversational'>('concise');

  // Notification toggles (All email-focused)
  const [urgentEmailAlerts, setUrgentEmailAlerts] = useState(true);
  const [dailyBriefingEmail, setDailyBriefingEmail] = useState(true);
  const [calendarWarnings, setCalendarWarnings] = useState(true);
  const [taskScoreUpdates, setTaskScoreUpdates] = useState(false);

  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.first_name || '');
      setLastName(currentUser.last_name || '');
      setEmail(currentUser.email || '');
    }

    try {
      const savedSettings = localStorage.getItem('nova_user_settings');
      if (savedSettings) {
        const data = JSON.parse(savedSettings);
        if (data.timezone) setTimezone(data.timezone);
        if (data.briefingTime) setBriefingTime(data.briefingTime);
        if (data.assistantTone) setAssistantTone(data.assistantTone);
        if (data.urgentEmailAlerts !== undefined) setUrgentEmailAlerts(data.urgentEmailAlerts);
        if (data.dailyBriefingEmail !== undefined) setDailyBriefingEmail(data.dailyBriefingEmail);
        if (data.calendarWarnings !== undefined) setCalendarWarnings(data.calendarWarnings);
        if (data.autoParseTasks !== undefined) setAutoParseTasks(data.autoParseTasks);
        if (data.draftReplies !== undefined) setDraftReplies(data.draftReplies);
        if (data.trackDeadlines !== undefined) setTrackDeadlines(data.trackDeadlines);
      }

      const savedEmailProvider = localStorage.getItem('nova_connected_email_provider');
      if (savedEmailProvider) {
        const pData = JSON.parse(savedEmailProvider);
        setConnectedProvider(pData.provider);
        setConnectedEmail(pData.email || (currentUser?.email ?? 'eduardo@novasuite.io'));
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  const handleConnectProvider = (pid: EmailProviderId) => {
    setIsConnecting(pid);
    setTimeout(() => {
      const syncEmail = email || currentUser?.email || 'eduardo@novasuite.io';
      setConnectedProvider(pid);
      setConnectedEmail(syncEmail);
      setIsConnecting(null);

      try {
        localStorage.setItem(
          'nova_connected_email_provider',
          JSON.stringify({
            provider: pid,
            email: syncEmail,
            connectedAt: new Date().toISOString(),
          })
        );
      } catch (e) {
        console.error(e);
      }
    }, 1000);
  };

  const handleDisconnectProvider = () => {
    setConnectedProvider(null);
    try {
      localStorage.removeItem('nova_connected_email_provider');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    const updatedUser = {
      ...(currentUser || {}),
      first_name: firstName,
      last_name: lastName,
      email,
      last_updated: Date.now(),
    };
    await saveUserToCache([updatedUser]);

    try {
      localStorage.setItem(
        'nova_user_settings',
        JSON.stringify({
          timezone,
          briefingTime,
          assistantTone,
          urgentEmailAlerts,
          dailyBriefingEmail,
          calendarWarnings,
          taskScoreUpdates,
          autoParseTasks,
          draftReplies,
          trackDeadlines,
        })
      );
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }, 400);
  };

  const initials = `${firstName?.[0] || 'U'}${lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[--foreground] tracking-tight">Settings</h1>
          <p className="text-sm text-[--muted-foreground] mt-0.5">
            Manage your personal profile, email provider connections, and assistant briefing rules.
          </p>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={isSaving}
          className="self-start sm:self-auto flex items-center gap-1.5 px-5 py-2.5 rounded-xl gradient-brand text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity shadow-md shadow-indigo-100 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? (
            <span>Saving...</span>
          ) : savedSuccess ? (
            <>
              <Check size={14} /> Saved!
            </>
          ) : (
            <>
              <Save size={14} /> Save Preferences
            </>
          )}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 bg-[--background] p-1 rounded-xl border border-[--border] w-fit flex-wrap">
        {[
          { id: 'profile' as const, label: 'Profile & Account', icon: User },
          { id: 'email' as const, label: 'Email Providers', icon: Mail },
          { id: 'assistant' as const, label: 'Assistant & Briefings', icon: Bot },
          { id: 'notifications' as const, label: 'Email Alerts', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white text-indigo-600 shadow-xs border border-[--border]'
                  : 'text-[--muted-foreground] hover:text-[--foreground]'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROFILE & ACCOUNT */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-[--border] p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-[--border]">
            <div className="w-16 h-16 rounded-2xl gradient-brand text-white flex items-center justify-center text-xl font-bold shadow-md shadow-indigo-100">
              {initials}
            </div>
            <div>
              <h2 className="text-base font-bold text-[--foreground]">
                {firstName ? `${firstName} ${lastName}` : 'Your Account'}
              </h2>
              <p className="text-xs text-[--muted-foreground]">{email || 'Not connected'}</p>
              <span className="inline-block mt-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                Executive Boss Tier
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[--foreground] uppercase tracking-wide">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="First Name"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[--foreground] uppercase tracking-wide">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Last Name"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-semibold text-[--foreground] uppercase tracking-wide">
                Primary Account Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="name@company.com"
              />
              <p className="text-[11px] text-[--muted-foreground]">
                Used for executive account access and primary assistant communications.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[--border] space-y-1.5">
            <label className="block text-xs font-semibold text-[--foreground] uppercase tracking-wide flex items-center gap-1.5">
              <Globe size={13} className="text-[--muted-foreground]" />
              Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="America/Los_Angeles (Pacific Time)">America/Los_Angeles (Pacific Time - GMT-7)</option>
              <option value="America/New_York (Eastern Time)">America/New_York (Eastern Time - GMT-4)</option>
              <option value="America/Chicago (Central Time)">America/Chicago (Central Time - GMT-5)</option>
              <option value="Europe/London (GMT)">Europe/London (GMT / BST)</option>
              <option value="Europe/Paris (CET)">Europe/Paris (CET / CEST)</option>
            </select>
          </div>
        </div>
      )}

      {/* TAB 2: EMAIL PROVIDER CONNECTIONS (GMAIL & MICROSOFT) */}
      {activeTab === 'email' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-[--border] p-6 shadow-xs space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
                <Sparkles size={12} />
                <span>Executive Inbox Intelligence</span>
              </div>
              <h2 className="text-base font-bold text-[--foreground]">
                Connect Your Email Provider
              </h2>
              <p className="text-xs text-[--muted-foreground] mt-0.5">
                Connect your business or personal mailbox so your executive assistant can automatically scan inbound client requests, extract deliverables, and draft responses.
              </p>
            </div>

            {/* Provider Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {providers.map((p) => {
                const isCurrent = connectedProvider === p.id;
                const connecting = isConnecting === p.id;

                return (
                  <div
                    key={p.id}
                    className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 ${
                      isCurrent
                        ? 'border-indigo-600 bg-indigo-50/20 shadow-xs'
                        : 'border-[--border] bg-white hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-[--background] border border-[--border] flex items-center justify-center">
                          {p.icon}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                            {p.tag}
                          </span>
                          {isCurrent && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 size={11} /> Connected
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-[--foreground]">{p.name}</h3>
                      <p className="text-[11px] text-[--muted-foreground] font-mono mt-0.5">{p.subtitle}</p>
                      <p className="text-xs text-[--muted-foreground] leading-relaxed mt-2.5">
                        {p.desc}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[--border] flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                        <ShieldCheck size={13} />
                        <span>Encrypted OAuth 2.0</span>
                      </div>

                      {isCurrent ? (
                        <button
                          type="button"
                          onClick={handleDisconnectProvider}
                          className="px-3 py-1.5 rounded-xl border border-[--border] bg-white hover:bg-gray-50 text-xs font-medium text-[--muted-foreground] hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          Disconnect
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleConnectProvider(p.id)}
                          disabled={!!isConnecting}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl gradient-brand text-white text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-xs"
                        >
                          {connecting ? (
                            <>
                              <RefreshCw size={12} className="animate-spin" />
                              Connecting...
                            </>
                          ) : (
                            <>
                              <span>Connect {p.id === 'gmail' ? 'Gmail' : 'Microsoft'}</span>
                              <ExternalLink size={12} />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assistant Email Ingestion Capabilities */}
          <div className="bg-white rounded-2xl border border-[--border] p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[--foreground] flex items-center gap-2">
              <Bot size={16} className="text-indigo-600" />
              Inbox Assistant Capabilities
            </h3>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={autoParseTasks}
                  onChange={(e) => setAutoParseTasks(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <div>
                  <p className="text-xs font-semibold text-[--foreground] group-hover:text-indigo-600 transition-colors">
                    Auto-Extract Tasks & Action Items from Inbound Emails
                  </p>
                  <p className="text-[11px] text-[--muted-foreground]">
                    Assistant automatically creates draft deliverables on your Task board when clients or partners request work.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={draftReplies}
                  onChange={(e) => setDraftReplies(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <div>
                  <p className="text-xs font-semibold text-[--foreground] group-hover:text-indigo-600 transition-colors">
                    Draft Email Responses for Executive Review
                  </p>
                  <p className="text-[11px] text-[--muted-foreground]">
                    Assistant drafts replies to urgent client inquiries and queues them for your 1-click approval.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={trackDeadlines}
                  onChange={(e) => setTrackDeadlines(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <div>
                  <p className="text-xs font-semibold text-[--foreground] group-hover:text-indigo-600 transition-colors">
                    Email Thread Milestone & Deadline Detection
                  </p>
                  <p className="text-[11px] text-[--muted-foreground]">
                    Identifies mentioned dates (e.g. &quot;by next Thursday&quot;) and syncs them to your schedule and AI scoring engine.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ASSISTANT & BRIEFINGS */}
      {activeTab === 'assistant' && (
        <div className="bg-white rounded-2xl border border-[--border] p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-[--foreground]">
              Executive Briefing & Delivery Settings
            </h2>
            <p className="text-xs text-[--muted-foreground] mt-0.5">
              Customize when and how your assistant synthesizes your daily updates.
            </p>
          </div>

          {/* Assistant Tone */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[--foreground] uppercase tracking-wide">
              Assistant Executive Tone
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'concise' as const, label: 'Executive Concise', desc: 'Short bullet points, bottom line up front.' },
                { id: 'detailed' as const, label: 'Detailed & Thorough', desc: 'Includes full context, reasoning, and background.' },
                { id: 'conversational' as const, label: 'Warm & Natural', desc: 'Friendly personal assistant voice.' },
              ].map((tone) => {
                const isSelected = assistantTone === tone.id;
                return (
                  <div
                    key={tone.id}
                    onClick={() => setAssistantTone(tone.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-500/20'
                        : 'border-[--border] hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[--foreground]">{tone.label}</span>
                      {isSelected && <Check size={12} className="text-indigo-600" />}
                    </div>
                    <p className="text-[11px] text-[--muted-foreground]">{tone.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Morning Briefing Delivery Time */}
          <div className="pt-4 border-t border-[--border] space-y-1.5">
            <label className="block text-xs font-semibold text-[--foreground] uppercase tracking-wide flex items-center gap-1.5">
              <Clock size={13} className="text-[--muted-foreground]" />
              Daily Morning Executive Briefing Email Time
            </label>
            <input
              type="time"
              value={briefingTime}
              onChange={(e) => setBriefingTime(e.target.value)}
              className="w-48 px-3.5 py-2 text-sm bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <p className="text-[11px] text-[--muted-foreground]">
              Your assistant prepares your priorities, calendar events, and top deliverables and delivers them to your inbox before your day starts.
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: EMAIL ALERTS & GUARDRAILS */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-[--border] p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-[--foreground]">
              Email Notification Guardrails
            </h2>
            <p className="text-xs text-[--muted-foreground] mt-0.5">
              Manage what alerts are sent to your connected email inbox.
            </p>
          </div>

          <div className="space-y-4">
            <label className="flex items-start justify-between p-3.5 rounded-xl bg-[--background] border border-[--border] cursor-pointer group">
              <div className="space-y-0.5 pr-4">
                <p className="text-xs font-bold text-[--foreground] group-hover:text-indigo-600 transition-colors">
                  Urgent Executive Email Escalations
                </p>
                <p className="text-[11px] text-[--muted-foreground]">
                  Receive an immediate priority email alert if a client deliverable is overdue or a critical task requires sign-off.
                </p>
              </div>
              <input
                type="checkbox"
                checked={urgentEmailAlerts}
                onChange={(e) => setUrgentEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 mt-0.5"
              />
            </label>

            <label className="flex items-start justify-between p-3.5 rounded-xl bg-[--background] border border-[--border] cursor-pointer group">
              <div className="space-y-0.5 pr-4">
                <p className="text-xs font-bold text-[--foreground] group-hover:text-indigo-600 transition-colors">
                  Daily Morning Executive Summary Email
                </p>
                <p className="text-[11px] text-[--muted-foreground]">
                  Delivers a 1-page condensed email briefing with your day&apos;s schedule, top 3 priorities, and pending drafts.
                </p>
              </div>
              <input
                type="checkbox"
                checked={dailyBriefingEmail}
                onChange={(e) => setDailyBriefingEmail(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 mt-0.5"
              />
            </label>

            <label className="flex items-start justify-between p-3.5 rounded-xl bg-[--background] border border-[--border] cursor-pointer group">
              <div className="space-y-0.5 pr-4">
                <p className="text-xs font-bold text-[--foreground] group-hover:text-indigo-600 transition-colors">
                  Calendar Schedule Conflict Email Alerts
                </p>
                <p className="text-[11px] text-[--muted-foreground]">
                  Alerts you if meetings overlap or if focus time is violated.
                </p>
              </div>
              <input
                type="checkbox"
                checked={calendarWarnings}
                onChange={(e) => setCalendarWarnings(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 mt-0.5"
              />
            </label>

            <label className="flex items-start justify-between p-3.5 rounded-xl bg-[--background] border border-[--border] cursor-pointer group">
              <div className="space-y-0.5 pr-4">
                <p className="text-xs font-bold text-[--foreground] group-hover:text-indigo-600 transition-colors">
                  AI Task Importance Score Updates (Score &ge; 90)
                </p>
                <p className="text-[11px] text-[--muted-foreground]">
                  Notify via email whenever a newly analyzed task is automatically marked as Critical Priority.
                </p>
              </div>
              <input
                type="checkbox"
                checked={taskScoreUpdates}
                onChange={(e) => setTaskScoreUpdates(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 mt-0.5"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
