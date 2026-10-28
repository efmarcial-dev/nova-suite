'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCachedUser } from '@/app/hooks/useCachedUser';
import { saveUserToCache } from '@/app/lib/cache/NovaCacheHelpers';
import {
  fetchSettingsAPI,
  saveSettingsAPI,
  connectEmailProviderAPI,
  disconnectEmailProviderAPI,
} from '@/app/lib/api/settings';
import {
  fetchNylasGrantsAPI,
  fetchNylasStatusAPI,
  startNylasConnectAPI,
  disconnectNylasGrantAPI,
  NylasGrant,
  NylasStatus,
} from '@/app/lib/api/nylas';
import {
  User,
  Mail,
  Calendar as CalendarIcon,
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
  AlertCircle,
  CreditCard,
  Lock,
  Trophy,
  Trash2,
  Plus,
} from 'lucide-react';
import { useSubscription } from '@/app/hooks/useSubscription';
import FoxlyPaymentCheckout from '@/app/components/FoxlyPaymentCheckout';

type SettingsTab = 'profile' | 'billing' | 'email' | 'assistant' | 'notifications';

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

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

function SettingsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useCachedUser();
  const currentUser = user?.[0];
  const { subscription, hasAccess, isLoading: isSubLoading, refreshSubscription } = useSubscription();
  const [showUpdateCard, setShowUpdateCard] = useState(false);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Profile states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [timezone, setTimezone] = useState('UTC');

  // Email Provider Connection states
  const [connectedProvider, setConnectedProvider] = useState<EmailProviderId | null>(null);
  const [connectedEmail, setConnectedEmail] = useState('');
  const [isConnecting, setIsConnecting] = useState<EmailProviderId | null>(null);
  const [integrationError, setIntegrationError] = useState('');
  const [settingsError, setSettingsError] = useState('');

  // Nylas Unified Multi-Account states
  const [nylasGrants, setNylasGrants] = useState<NylasGrant[]>([]);
  const [nylasStatus, setNylasStatus] = useState<NylasStatus | null>(null);
  const [isConnectingNylas, setIsConnectingNylas] = useState<string | null>(null);
  const [connectSuccessMessage, setConnectSuccessMessage] = useState('');

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

  // Listen to OAuth redirect query params (?nylas=connected or ?nylas=error)
  useEffect(() => {
    const nylas = searchParams.get('nylas');
    const reason = searchParams.get('reason');
    const provider = searchParams.get('provider');
    const errorCode = searchParams.get('error_code');
    const connected = searchParams.get('connected');
    const emailParam = searchParams.get('email');
    const tabParam = searchParams.get('tab');

    if (tabParam === 'billing') {
      setActiveTab('billing');
    }

    if (nylas === 'connected' || connected === 'nylas' || connected === 'email' || connected === 'calendar') {
      setActiveTab('email');
      const provName = provider ? provider.toUpperCase() : 'your account';
      setConnectSuccessMessage(
        emailParam
          ? `Successfully connected ${provName} (${emailParam}) via Nylas! Your unified inbox and multi-calendar are active.`
          : `Successfully connected ${provName} via Nylas! Your unified inbox and multi-calendar are active.`
      );
      setIntegrationError('');

      // Refresh connection status from API
      Promise.all([fetchNylasGrantsAPI(), fetchNylasStatusAPI()]).then(([grants, status]) => {
        setNylasGrants(grants.filter((g) => g.is_connected !== false));
        setNylasStatus(status);
      }).catch(console.warn);

      // Clean query parameters so refresh does not repeat the message
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.delete('nylas');
      currentParams.delete('connected');
      currentParams.delete('provider');
      currentParams.delete('email');
      currentParams.delete('reason');
      currentParams.delete('error_code');
      const newQuery = currentParams.toString();
      router.replace(newQuery ? `${pathname}?${newQuery}` : pathname);
    } else if (nylas === 'error') {
      setActiveTab('email');
      const reasonMessages: Record<string, string> = {
        invalid_state: 'Security verification failed: OAuth state was invalid or expired. Please try connecting again.',
        exchange_failed: 'Authentication exchange with Nylas failed. Please try connecting again.',
        save_failed: 'Failed to save account integration record in database.',
        user_not_found: 'User account session not found. Please log in again.',
        access_denied: 'Account connection was cancelled or denied.',
        invalid_authentication: 'The email provider rejected those credentials. For IMAP, check the username, password or app password, and server settings.',
        provider_not_responding: 'The email provider did not respond. Check the provider status and IMAP host/port settings, then try again.',
        auth_limit_reached: 'Too many sign-in attempts were rejected. Wait before trying again, and verify the credentials first.',
        nylas_error: 'Nylas could not complete this provider sign-in. Check that this provider is enabled for the Nylas application and try again.',
      };
      setIntegrationError(
        reason && reasonMessages[reason]
          ? `${provider ? `${provider.toUpperCase()}: ` : ''}${reasonMessages[reason]}${errorCode ? ` (${errorCode})` : ''}`
          : `Connection error${provider ? ` for ${provider.toUpperCase()}` : ''}: ${reason || 'Failed to connect provider.'}${errorCode ? ` (${errorCode})` : ''}`
      );
      setConnectSuccessMessage('');

      // Refresh connection status from API
      Promise.all([fetchNylasGrantsAPI(), fetchNylasStatusAPI()]).then(([grants, status]) => {
        setNylasGrants(grants.filter((g) => g.is_connected !== false));
        setNylasStatus(status);
      }).catch(console.warn);

      // Clean query parameters so refresh does not repeat the message
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.delete('nylas');
      currentParams.delete('reason');
      currentParams.delete('provider');
      currentParams.delete('error_code');
      const newQuery = currentParams.toString();
      router.replace(newQuery ? `${pathname}?${newQuery}` : pathname);
    }
  }, [searchParams, router, pathname]);

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.first_name || '');
      setLastName(currentUser.last_name || '');
      setEmail(currentUser.email || '');
    }

    const hydrateSettings = async () => {
      // Check live Nylas grants (unified multi-accounts)
      try {
        const [grants, status] = await Promise.all([fetchNylasGrantsAPI(), fetchNylasStatusAPI()]);
        setNylasGrants(grants.filter((g) => g.is_connected !== false));
        setNylasStatus(status);
      } catch (err) {
        console.warn('Could not fetch Nylas grants in settings', err);
      }

      // Check live connected email providers from backend (for legacy accounts)
      try {
        const emailRes = await fetch('/api/email/providers/', {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (emailRes.ok) {
          const emailData = await emailRes.json();
          const pList = Array.isArray(emailData) ? emailData : (emailData.providers || []);
          const active = pList.find((p: any) => p.is_connected);
          if (active) {
            setConnectedProvider(active.provider === 'outlook' ? 'microsoft' : 'gmail');
            setConnectedEmail(active.email || '');
          } else {
            setConnectedProvider(null);
            setConnectedEmail('');
          }
        } else {
          throw new Error(`Email provider status request failed (${emailRes.status})`);
        }
      } catch (err) {
        console.warn('Could not fetch email providers in settings', err);
        setIntegrationError(err instanceof Error ? err.message : 'Could not load email provider status.');
      }

      try {
        const savedSettings = await fetchSettingsAPI();
        if (savedSettings.timezone) setTimezone(savedSettings.timezone);
        if (savedSettings.briefingTime) setBriefingTime(savedSettings.briefingTime);
        if (savedSettings.assistantTone) setAssistantTone(savedSettings.assistantTone);
        if (savedSettings.urgentEmailAlerts !== undefined) setUrgentEmailAlerts(savedSettings.urgentEmailAlerts);
        if (savedSettings.dailyBriefingEmail !== undefined) setDailyBriefingEmail(savedSettings.dailyBriefingEmail);
        if (savedSettings.calendarWarnings !== undefined) setCalendarWarnings(savedSettings.calendarWarnings);
        if (savedSettings.autoParseTasks !== undefined) setAutoParseTasks(savedSettings.autoParseTasks);
        if (savedSettings.draftReplies !== undefined) setDraftReplies(savedSettings.draftReplies);
        if (savedSettings.trackDeadlines !== undefined) setTrackDeadlines(savedSettings.trackDeadlines);
        setSettingsError('');
      } catch (err) {
        setSettingsError(err instanceof Error ? err.message : 'Could not load settings from the backend.');
      }
    };

    hydrateSettings();
  }, [currentUser]);

  const handleConnectProvider = async (pid: EmailProviderId) => {
    setIsConnecting(pid);
    const syncEmail = email || currentUser?.email || '';
    const backendProvider = pid === 'microsoft' ? 'outlook' : 'gmail';
    setIntegrationError('');

    try {
      const result = await connectEmailProviderAPI(backendProvider, syncEmail || undefined);
      const authUrl = result?.authorization_url || result?.auth_url || result?.authorizationUrl || result?.url;

      if (authUrl) {
        window.location.href = authUrl;
        return;
      }
      throw new Error('The backend did not return an authorization URL.');
    } catch (e) {
      console.error('Failed to save email provider connection', e);
      setIntegrationError(e instanceof Error ? e.message : 'Could not start email authorization.');
      setIsConnecting(null);
    }
  };

  const handleDisconnectProvider = async () => {
    const backendProvider = connectedProvider === 'microsoft' ? 'outlook' : 'gmail';

    try {
      await disconnectEmailProviderAPI(backendProvider);
      setConnectedProvider(null);
      setConnectedEmail('');
      setIntegrationError('');
    } catch (e) {
      console.error('Failed to disconnect email provider', e);
      setIntegrationError(e instanceof Error ? e.message : 'Could not disconnect email provider.');
    }
  };

  const handleConnectNylas = async (provider?: 'google' | 'microsoft' | 'icloud' | 'imap' | 'other') => {
    setIsConnectingNylas(provider || 'all');
    setIntegrationError('');
    try {
      const authUrl = await startNylasConnectAPI({
        provider,
        product: 'all',
        origin: 'settings',
      });
      if (authUrl) {
        window.location.href = authUrl;
        return;
      }
      throw new Error('Backend did not return an authorization URL.');
    } catch (e) {
      console.error('Failed to initiate Nylas connection', e);
      setIntegrationError(e instanceof Error ? e.message : 'Could not initiate account authorization.');
      setIsConnectingNylas(null);
    }
  };

  const handleDisconnectNylasGrant = async (grantId: string) => {
    try {
      const ok = await disconnectNylasGrantAPI(grantId);
      if (ok) {
        setNylasGrants((prev) => prev.filter((g) => g.grant_id !== grantId));
        setNylasStatus(await fetchNylasStatusAPI());
        setIntegrationError('');
      } else {
        throw new Error('Failed to disconnect account');
      }
    } catch (e) {
      console.error('Failed to disconnect grant', e);
      setIntegrationError(e instanceof Error ? e.message : 'Could not disconnect account.');
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
      await saveSettingsAPI({
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
      });
      setSettingsError('');
    } catch (e) {
      console.error('Backend settings save failed', e);
      setSettingsError(e instanceof Error ? e.message : 'Could not save settings to the backend.');
      setIsSaving(false);
      return;
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
          className="self-start sm:self-auto flex items-center gap-1.5 px-5 py-2.5 rounded-xl gradient-brand text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity shadow-md shadow-blue-500/10 disabled:opacity-50 cursor-pointer"
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

      {(integrationError || settingsError) && (
        <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {integrationError || settingsError}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 bg-[--background] p-1 rounded-xl border border-[--border] w-fit flex-wrap">
        {[
          { id: 'profile' as const, label: 'Profile & Account', icon: User },
          { id: 'billing' as const, label: 'Subscription & Plans', icon: CreditCard },
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
                  ? 'bg-white text-[#1EA0FF] shadow-xs border border-[--border]'
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
            <div className="w-16 h-16 rounded-2xl gradient-brand text-white flex items-center justify-center text-xl font-bold shadow-md shadow-blue-500/10">
              {initials}
            </div>
            <div>
              <h2 className="text-base font-bold text-[--foreground]">
                {firstName ? `${firstName} ${lastName}` : 'Your Account'}
              </h2>
              <p className="text-xs text-[--muted-foreground]">{email || 'Not connected'}</p>
              {subscription?.isInTrial ? (
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-block text-[11px] font-semibold text-[#1EA0FF] bg-[#F0F9FF] px-2.5 py-0.5 rounded-full border border-[#BFE7FF]">
                    3-Day Free Trial ({subscription.trialDaysRemaining ?? 3} days left)
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('billing')}
                    className="text-xs text-[#1EA0FF] hover:underline font-medium cursor-pointer"
                  >
                    Upgrade
                  </button>
                </div>
              ) : subscription?.plan === 'annual' ? (
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Foxly Annual ($5/mo)
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('billing')}
                    className="text-xs text-[#1EA0FF] hover:underline font-medium cursor-pointer"
                  >
                    Manage
                  </button>
                </div>
              ) : subscription?.plan === 'monthly' ? (
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-block text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    Foxly Monthly ($10/mo)
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('billing')}
                    className="text-xs text-[#1EA0FF] hover:underline font-medium cursor-pointer"
                  >
                    Manage
                  </button>
                </div>
              ) : (
                <span className="inline-block mt-1 text-[11px] font-semibold text-[#1EA0FF] bg-[#F0F9FF] px-2.5 py-0.5 rounded-full border border-[#BFE7FF]">
                  Foxly Member
                </span>
              )}
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
                className="w-full px-3.5 py-2.5 text-sm bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-[#1EA0FF]"
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
                className="w-full px-3.5 py-2.5 text-sm bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-[#1EA0FF]"
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
                className="w-full px-3.5 py-2.5 text-sm bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-[#1EA0FF]"
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
              className="w-full px-3.5 py-2.5 text-sm bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-[#1EA0FF]"
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

      {/* TAB: SUBSCRIPTION & BILLING */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          {/* Current Plan Overview Card */}
          <div className="bg-white rounded-2xl border border-[--border] p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[--border]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#F0F9FF] border border-[#BFE7FF] flex items-center justify-center text-[#1EA0FF]">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[--foreground]">
                    {subscription?.isInTrial
                      ? '3-Day Free Trial'
                      : subscription?.plan === 'annual'
                      ? 'Foxly Annual Plan ($5/mo)'
                      : subscription?.plan === 'monthly'
                      ? 'Foxly Monthly Plan ($10/mo)'
                      : subscription?.plan === 'founder_lifetime'
                      ? 'Founder Lifetime Plan'
                      : 'Foxly Plan'}
                  </h2>
                  <p className="text-xs text-[--muted-foreground] mt-0.5">
                    {subscription?.isInTrial
                      ? `${subscription.trialDaysRemaining ?? 0} days remaining on your trial`
                      : subscription?.isActive || subscription?.hasAccess
                      ? 'Active subscription'
                      : 'No active plan'}
                  </p>
                </div>
              </div>

              <div>
                {subscription?.isInTrial ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0F9FF] text-[#1EA0FF] border border-[#BFE7FF]">
                    <Clock size={13} /> Free Trial Active
                  </span>
                ) : subscription?.hasAccess ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 size={13} /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <AlertCircle size={13} /> Expired
                  </span>
                )}
              </div>
            </div>

            {/* Billing Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[--background] border border-[--border]">
                <p className="text-xs font-semibold text-[--muted-foreground] uppercase tracking-wider">
                  Current Plan
                </p>
                <p className="text-base font-bold text-[--foreground] mt-1">
                  {subscription?.isInTrial
                    ? '3-Day Trial'
                    : subscription?.plan === 'annual'
                    ? '$5 / mo ($60/yr)'
                    : subscription?.plan === 'monthly'
                    ? '$10 / mo'
                    : 'Free Trial'}
                </p>
                <p className="text-[11px] text-[--muted-foreground] mt-0.5">
                  {subscription?.plan === 'annual'
                    ? '50% off discount'
                    : subscription?.plan === 'monthly'
                    ? 'Billed monthly'
                    : 'Includes full feature access'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[--background] border border-[--border]">
                <p className="text-xs font-semibold text-[--muted-foreground] uppercase tracking-wider">
                  Payment Date
                </p>
                <p className="text-base font-bold text-[--foreground] mt-1">
                  {formatDate(
                    subscription?.lastPaymentDate ||
                      subscription?.paidAt ||
                      subscription?.currentPeriodStart ||
                      subscription?.trialStartedAt
                  )}
                </p>
                <p className="text-[11px] text-[--muted-foreground] mt-0.5">
                  {subscription?.isInTrial ? 'Trial start date' : 'Last billing date'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[--background] border border-[--border]">
                <p className="text-xs font-semibold text-[--muted-foreground] uppercase tracking-wider">
                  Next Payment / Renewal
                </p>
                <p className="text-base font-bold text-[--foreground] mt-1">
                  {formatDate(
                    subscription?.nextPaymentDate ||
                      subscription?.currentPeriodEnd ||
                      subscription?.trialEndsAt
                  )}
                </p>
                <p className="text-[11px] text-[--muted-foreground] mt-0.5">
                  {subscription?.isInTrial ? 'Trial expiration date' : 'Next billing cycle'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[--muted-foreground] pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Payments are processed securely via Square with 256-bit encryption. Cancel anytime.</span>
            </div>
          </div>

          {/* Checkout / Plan Upgrade Card */}
          <div className="bg-white rounded-2xl border border-[--border] p-6 shadow-xs space-y-6">
            <div className="border-b border-[--border] pb-4">
              <h3 className="text-base font-bold text-[--foreground]">
                {subscription?.isInTrial
                  ? 'Upgrade from Free Trial'
                  : 'Change or Renew Your Plan'}
              </h3>
              <p className="text-xs text-[--muted-foreground] mt-0.5">
                Select your preferred billing cycle below to unlock continuous executive assistance.
              </p>
            </div>

            <FoxlyPaymentCheckout
              title="Select Your Foxly Plan"
              subtitle="Clean pricing, full access to multiple Google & Outlook inboxes and calendars."
              onSuccess={() => {
                refreshSubscription();
              }}
            />
          </div>
        </div>
      )}

      {/* TAB 2: UNIFIED MULTI-ACCOUNT INTEGRATIONS (NYLAS POWERED) */}
      {activeTab === 'email' && (
        <div className="space-y-5">
          {connectSuccessMessage && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 flex items-center justify-between text-xs text-emerald-800 shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span className="font-semibold">{connectSuccessMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setConnectSuccessMessage('')}
                className="text-emerald-600 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {integrationError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 flex items-center gap-2 text-xs text-rose-700 shadow-xs">
              <AlertCircle size={16} className="shrink-0" />
              <span>{integrationError}</span>
            </div>
          )}

          {/* Active Connected Accounts Card */}
          <div className="bg-white rounded-2xl border border-[--border] p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[--border] pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0F9FF] border border-[#BFE7FF] text-[#0088EE] text-xs font-semibold mb-1">
                  <Sparkles size={12} />
                  <span>{nylasStatus?.is_email_unified ? 'Unified Multi-Account Inbox' : 'Nylas Connected Accounts'}</span>
                </div>
                <h2 className="text-base font-bold text-[--foreground]">
                  Connected Inboxes &amp; Calendars
                </h2>
                <p className="text-xs text-[--muted-foreground] mt-0.5">
                  Connect Google, Microsoft, iCloud, Yahoo, and IMAP accounts. Nova combines connected inboxes and supported calendars in one place.
                </p>
              </div>

              {nylasGrants.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold self-start sm:self-auto">
                  <CheckCircle2 size={13} />
                  {nylasStatus
                    ? `${nylasStatus.email_account_count} inbox${nylasStatus.email_account_count === 1 ? '' : 'es'}${nylasStatus.is_email_unified ? ' unified' : ''} · ${nylasStatus.calendar_account_count} calendar${nylasStatus.calendar_account_count === 1 ? '' : 's'}`
                    : `${nylasGrants.length} ${nylasGrants.length === 1 ? 'Account' : 'Accounts'} Active`}
                </span>
              )}
            </div>

            {/* List of Connected Accounts */}
            {nylasGrants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                {nylasGrants.map((grant) => {
                  const isGoogle = grant.provider === 'google';
                  const isMicrosoft = grant.provider === 'microsoft' || grant.provider === 'outlook';

                  return (
                    <div
                      key={grant.grant_id}
                      className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/30 flex items-start justify-between gap-3 shadow-2xs hover:bg-emerald-50/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-2xs">
                          {isGoogle ? (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                          ) : isMicrosoft ? (
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                              <rect width="24" height="24" rx="4" fill="#0078D4" />
                              <path d="M14.5 6.5h-5A1.5 1.5 0 008 8v8a1.5 1.5 0 001.5 1.5h5a1.5 1.5 0 001.5-1.5V8a1.5 1.5 0 00-1.5-1.5z" fill="#fff" fillOpacity="0.8" />
                              <path d="M12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" fill="#0078D4" />
                            </svg>
                          ) : (
                            <Mail className="w-5 h-5 text-gray-600" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-gray-900">{grant.email}</p>
                            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider bg-white px-1.5 py-0.5 rounded border border-gray-200">
                              {grant.provider}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            {grant.scope?.includes('email') && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                                <Mail size={10} /> Email Active
                              </span>
                            )}
                            {grant.scope?.includes('calendar') && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                                <CalendarIcon size={10} /> Calendar Active
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDisconnectNylasGrant(grant.grant_id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                        title="Disconnect this account"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-dashed border-gray-200 text-center space-y-2">
                <Mail className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-xs font-semibold text-gray-700">No accounts connected yet</p>
                <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
                  Connect your primary Google Workspace or Microsoft 365 account below to activate automatic email triage and multi-calendar scheduling.
                </p>
              </div>
            )}
          </div>

          {/* Connect Another Account Options */}
          <div className="bg-white rounded-2xl border border-[--border] p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[--foreground]">
              Connect an Email &amp; Calendar Account
            </h3>
            <p className="text-xs text-[--muted-foreground]">
              Nylas handles provider sign-in securely. Link multiple accounts to combine mailboxes and supported calendars.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleConnectNylas('google')}
                disabled={!!isConnectingNylas}
                className="p-4 rounded-xl border border-gray-200 hover:border-[#4285F4] bg-white hover:bg-blue-50/20 text-left transition flex flex-col justify-between space-y-3 cursor-pointer group shadow-2xs disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Google
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Google Workspace / Gmail
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Link Gmail inbox &amp; Google Calendar
                  </p>
                </div>
                <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 pt-1">
                  {isConnectingNylas === 'google' ? 'Connecting...' : 'Connect Google'}
                  <ExternalLink size={11} />
                </span>
              </button>

              {/* Microsoft Button */}
              <button
                type="button"
                onClick={() => handleConnectNylas('microsoft')}
                disabled={!!isConnectingNylas}
                className="p-4 rounded-xl border border-gray-200 hover:border-[#0078D4] bg-white hover:bg-blue-50/20 text-left transition flex flex-col justify-between space-y-3 cursor-pointer group shadow-2xs disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-[#0078D4] flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                      <path d="M14.5 6.5h-5A1.5 1.5 0 008 8v8a1.5 1.5 0 001.5 1.5h5a1.5 1.5 0 001.5-1.5V8a1.5 1.5 0 00-1.5-1.5z" fill="#fff" fillOpacity="0.9" />
                      <path d="M12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" fill="#0078D4" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                    Microsoft
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 group-hover:text-[#0078D4] transition-colors">
                    Microsoft 365 / Outlook
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Link Outlook inbox &amp; Exchange calendar
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#0078D4] flex items-center gap-1 pt-1">
                  {isConnectingNylas === 'microsoft' ? 'Connecting...' : 'Connect Outlook'}
                  <ExternalLink size={11} />
                </span>
              </button>

              {/* Other Providers (iCloud / Yahoo / IMAP) */}
              <button
                type="button"
                onClick={() => handleConnectNylas('other')}
                disabled={!!isConnectingNylas}
                className="p-4 rounded-xl border border-gray-200 hover:border-gray-400 bg-white hover:bg-gray-50 text-left transition flex flex-col justify-between space-y-3 cursor-pointer group shadow-2xs disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                    <Mail size={16} />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                    Any Provider
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 group-hover:text-gray-950 transition-colors">
                    iCloud, Yahoo or IMAP
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    IMAP accounts may require an app password. Generic IMAP lets you enter custom server settings.
                  </p>
                </div>
                <span className="text-xs font-semibold text-gray-700 flex items-center gap-1 pt-1">
                  {isConnectingNylas === 'other' ? 'Connecting...' : 'Choose Provider'}
                  <ExternalLink size={11} />
                </span>
              </button>
            </div>
          </div>

          {/* Assistant Email Ingestion Capabilities */}
          <div className="bg-white rounded-2xl border border-[--border] p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[--foreground] flex items-center gap-2">
              <Bot size={16} className="text-[#1EA0FF]" />
              Inbox Assistant Capabilities
            </h3>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={autoParseTasks}
                  onChange={(e) => setAutoParseTasks(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#1EA0FF] focus:ring-[#1EA0FF] border-gray-300"
                />
                <div>
                  <p className="text-xs font-semibold text-[--foreground] group-hover:text-[#1EA0FF] transition-colors">
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
                  className="mt-0.5 w-4 h-4 rounded text-[#1EA0FF] focus:ring-[#1EA0FF] border-gray-300"
                />
                <div>
                  <p className="text-xs font-semibold text-[--foreground] group-hover:text-[#1EA0FF] transition-colors">
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
                  className="mt-0.5 w-4 h-4 rounded text-[#1EA0FF] focus:ring-[#1EA0FF] border-gray-300"
                />
                <div>
                  <p className="text-xs font-semibold text-[--foreground] group-hover:text-[#1EA0FF] transition-colors">
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
                        ? 'border-[#1EA0FF] bg-[#F0F9FF] ring-1 ring-[#1EA0FF]/20'
                        : 'border-[--border] hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[--foreground]">{tone.label}</span>
                      {isSelected && <Check size={12} className="text-[#1EA0FF]" />}
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
              className="w-48 px-3.5 py-2 text-sm bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-[#1EA0FF]"
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
                <p className="text-xs font-bold text-[--foreground] group-hover:text-[#1EA0FF] transition-colors">
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
                className="w-4 h-4 rounded text-[#1EA0FF] focus:ring-[#1EA0FF] border-gray-300 mt-0.5"
              />
            </label>

            <label className="flex items-start justify-between p-3.5 rounded-xl bg-[--background] border border-[--border] cursor-pointer group">
              <div className="space-y-0.5 pr-4">
                <p className="text-xs font-bold text-[--foreground] group-hover:text-[#1EA0FF] transition-colors">
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
                className="w-4 h-4 rounded text-[#1EA0FF] focus:ring-[#1EA0FF] border-gray-300 mt-0.5"
              />
            </label>

            <label className="flex items-start justify-between p-3.5 rounded-xl bg-[--background] border border-[--border] cursor-pointer group">
              <div className="space-y-0.5 pr-4">
                <p className="text-xs font-bold text-[--foreground] group-hover:text-[#1EA0FF] transition-colors">
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
                className="w-4 h-4 rounded text-[#1EA0FF] focus:ring-[#1EA0FF] border-gray-300 mt-0.5"
              />
            </label>

            <label className="flex items-start justify-between p-3.5 rounded-xl bg-[--background] border border-[--border] cursor-pointer group">
              <div className="space-y-0.5 pr-4">
                <p className="text-xs font-bold text-[--foreground] group-hover:text-[#1EA0FF] transition-colors">
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
                className="w-4 h-4 rounded text-[#1EA0FF] focus:ring-[#1EA0FF] border-gray-300 mt-0.5"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
