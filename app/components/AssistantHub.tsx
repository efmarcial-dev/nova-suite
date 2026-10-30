'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Mail,
  Zap,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Check,
  X,
} from 'lucide-react';
import { useCachedUser } from '../hooks/useCachedUser';
import {
  getCachedEmailInbox,
  saveCachedEmailInbox,
} from '@/app/lib/cache/NovaCacheHelpers';
import { getEmailInboxForSession, saveEmailInboxForSession } from '@/app/lib/cache/emailInboxSession';
import { fetchMessagesAPI } from '@/app/lib/api/messages';
import {
  analyzeEmailMessagesAPI,
  decideEmailActionAPI,
  fetchEmailProvidersAPI,
  fetchEmailMessagesAPI,
  connectEmailProviderAPI,
  EmailInsight,
  EmailMessageItem,
  EmailProviderStatus
} from '@/app/lib/api/email';
import { fetchNylasGrantsAPI, startNylasConnectAPI, NylasGrant } from '@/app/lib/api/nylas';
import { ProviderReconnectRequiredError } from '@/app/lib/api/providerErrors';

interface MessageItem {
  id: string;
  channel: 'email' | 'system';
  direction: 'inbound' | 'outbound' | 'internal';
  sender: string;
  recipient: string;
  subject?: string;
  content: string;
  aiAction?: string;
  timestamp: string;
  status: 'delivered' | 'pending' | 'resolved';
  aiInsight?: EmailInsight;
  account_email?: string;
  provider?: string;
}

interface CachedInboxRecord {
  key: string;
  userId: string;
  cachedAt: number;
  emails: EmailMessageItem[];
  messages: MessageItem[];
  signatures: Record<string, string>;
  emailGrants: NylasGrant[];
  calendarGrants: NylasGrant[];
  connectedEmailProvider: EmailProviderStatus | null;
  analysisComplete: boolean;
}

const EMAIL_INBOX_CACHE_TTL_MS = 60_000;

function makeInboxCacheKey(userId: string, grantId: string, query: string) {
  return `email-inbox:v1:${encodeURIComponent(userId)}:${encodeURIComponent(grantId)}:${encodeURIComponent(query.trim().toLocaleLowerCase())}`;
}

async function emailAnalysisSignature(email: EmailMessageItem): Promise<string> {
  const content = String(email.content || email.snippet || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 6000);
  const serialized = JSON.stringify({
    analysis_version: 2,
    id: email.id,
    sender: String(email.sender || '').slice(0, 500),
    recipient: String(email.recipient || '').slice(0, 500),
    subject: String(email.subject || '').slice(0, 1000),
    content,
    timestamp: String(email.timestamp || '').slice(0, 100),
  });

  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const digest = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(serialized));
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
  return serialized;
}

const channelConfig = {
  email: { label: 'Executive Emails', icon: Mail, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-200 text-violet-700' },
  system: { label: 'System Directives', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200 text-amber-700' },
};

export default function AssistantHub({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  const { user } = useCachedUser();
  const currentUser = user?.[0];

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inboxEmails, setInboxEmails] = useState<EmailMessageItem[]>([]);
  const [connectedEmailProvider, setConnectedEmailProvider] = useState<EmailProviderStatus | null>(null);
  const [nylasGrants, setNylasGrants] = useState<NylasGrant[]>([]);
  const [calendarGrants, setCalendarGrants] = useState<NylasGrant[]>([]);
  const [selectedGrantId, setSelectedGrantId] = useState<string>('all');
  const [isConnectingProvider, setIsConnectingProvider] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionBusyId, setActionBusyId] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionGrantIds, setActionGrantIds] = useState<Record<string, string>>({});
  const [providerError, setProviderError] = useState('');
  const [providerReconnectRequired, setProviderReconnectRequired] = useState(false);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);
  const [aiError, setAiError] = useState('');
  const [emailFilter, setEmailFilter] = useState<'all' | 'important' | 'high'>('all');
  const [activeEmailQuery, setActiveEmailQuery] = useState('');
  const [searchMessageId, setSearchMessageId] = useState('');
  const aiAnalysisInFlight = useRef(false);
  const hydratedUserId = useRef('');

  const filteredMessages = messages.filter((message) => {
    if (searchMessageId && message.id !== searchMessageId) return false;
    if (emailFilter === 'all') return true;
    if (message.channel !== 'email') return false;
    if (emailFilter === 'important') return ['urgent', 'high'].includes(message.aiInsight?.priority || '');
    return message.aiInsight?.priority === 'high';
  });
  const visibleMessages = compact ? filteredMessages.slice(0, 3) : filteredMessages;

  const analyzeVisibleEmails = async (
    provider: string,
    emails: EmailMessageItem[],
  ): Promise<Record<string, EmailInsight> | null> => {
    if (emails.length === 0) return {};
    if (aiAnalysisInFlight.current) return null;
    aiAnalysisInFlight.current = true;
    setIsAnalyzingAI(true);
    setAiProgress(0);
    setAiAnalysisComplete(false);
    setAiError('');
    try {
      const insights = await analyzeEmailMessagesAPI(provider, emails);
      setAiProgress(100);
      setAiAnalysisComplete(true);
      return insights;
    } catch (error) {
      console.warn('Could not analyze inbox emails:', error);
      setAiProgress(0);
      setAiAnalysisComplete(false);
      setAiError(error instanceof Error ? error.message : 'AI analysis is temporarily unavailable.');
      return null;
    } finally {
      aiAnalysisInFlight.current = false;
      setIsAnalyzingAI(false);
    }
  };

  const hydrateMessages = async (
    grantIdOverride = selectedGrantId,
    options: { forceRefresh?: boolean; searchQuery?: string } = {},
  ) => {
    const forceRefresh = options.forceRefresh === true;
    const searchQuery = options.searchQuery ?? activeEmailQuery;
    const userId = String(currentUser?.id ?? currentUser?.email ?? '');
    const cacheKey = userId ? makeInboxCacheKey(userId, grantIdOverride, searchQuery) : '';

    setActiveEmailQuery(searchQuery);
    setIsRefreshing(true);
    setAiError('');
    setAiProgress(0);
    setAiAnalysisComplete(false);

    try {
      const sessionCached = cacheKey ? getEmailInboxForSession(cacheKey) as CachedInboxRecord | undefined : undefined;
      const cached = sessionCached || (cacheKey
        ? await getCachedEmailInbox(cacheKey).catch((error) => {
            console.warn('Could not read the local inbox cache; loading live messages.', error);
            return undefined;
          }) as CachedInboxRecord | undefined
        : undefined);
      const cacheAge = cached ? Date.now() - cached.cachedAt : Number.POSITIVE_INFINITY;
      const hasFreshCache = Boolean(cached && cacheAge < EMAIL_INBOX_CACHE_TTL_MS);

      if (cached) {
        setInboxEmails(cached.emails || []);
        setMessages(cached.messages || []);
        setNylasGrants(cached.emailGrants || []);
        setCalendarGrants(cached.calendarGrants || []);
        setConnectedEmailProvider(cached.connectedEmailProvider || null);
        setAiAnalysisComplete(cached.analysisComplete === true);
      }

      // Fresh inboxes include the email list and its AI insights, so opening the
      // dashboard again during the TTL makes no provider, message, or analysis calls.
      if (cached && !forceRefresh && (sessionCached || hasFreshCache)) {
        saveEmailInboxForSession(cached);
        setProviderError('');
        setProviderReconnectRequired(false);
        setIsRefreshing(false);
        return;
      }

      const [providers, grants] = await Promise.all([
        fetchEmailProvidersAPI().catch(() => []),
        fetchNylasGrantsAPI().catch(() => []),
      ]);
      const activeGrants = grants.filter((g) => g.is_connected !== false);
      const emailGrants = activeGrants.filter((g) => g.scope?.includes('email'));
      const calendarAccounts = activeGrants.filter((g) => g.scope?.includes('calendar'));
      setNylasGrants(emailGrants);
      setCalendarGrants(calendarAccounts);

      const connected = emailGrants.length > 0 ? ({
        provider: 'nylas',
        email: emailGrants[0].email,
        is_connected: true,
        connected_at: emailGrants[0].connected_at,
      } as any) : (providers.find((p) => p.is_connected) || null);
      setConnectedEmailProvider(connected);

      let remoteEmails: EmailMessageItem[] = [];
      if (emailGrants.length > 0) {
        const grantIdParam = grantIdOverride === 'all' ? undefined : grantIdOverride;
        remoteEmails = await fetchEmailMessagesAPI('nylas', searchQuery, 25, grantIdParam, {
          forceRefresh: forceRefresh || (cached !== undefined && !hasFreshCache),
        });
      } else if (connected) {
        remoteEmails = await fetchEmailMessagesAPI(connected.provider, searchQuery, 25, undefined, {
          forceRefresh: forceRefresh || (cached !== undefined && !hasFreshCache),
        });
      }
      setInboxEmails(remoteEmails);

      const previousMessages = cached?.messages || [];
      const previousEmailById = new Map(previousMessages.filter((message) => message.channel === 'email').map((message) => [message.id, message]));
      const signatures = Object.fromEntries(await Promise.all(
        remoteEmails.map(async (email) => [email.id, await emailAnalysisSignature(email)] as const),
      ));
      const liveEmailItems: MessageItem[] = remoteEmails.map((item) => ({
        id: item.id,
        channel: 'email',
        direction: item.direction || 'inbound',
        sender: item.sender || 'Unknown Sender',
        recipient: item.recipient || (currentUser?.email ?? 'You'),
        subject: item.subject || '(No Subject)',
        content: item.snippet || item.content || '',
        timestamp: item.timestamp
          ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'Recent',
        status: item.status === 'read' ? 'resolved' : 'delivered',
        account_email: item.account_email,
        provider: item.provider,
        aiInsight: cached?.signatures?.[item.id] === signatures[item.id]
          ? previousEmailById.get(item.id)?.aiInsight
          : undefined,
      }));

      const remoteDirectives = await fetchMessagesAPI();
      let combined: MessageItem[] = [...liveEmailItems, ...(Array.isArray(remoteDirectives) ? remoteDirectives : [])];
      setMessages(combined);
      setProviderError('');
      setProviderReconnectRequired(false);

      const emailsToAnalyze = remoteEmails.filter((email) => {
        if (email.direction !== 'inbound') return false;
        const unchanged = cached?.signatures?.[email.id] === signatures[email.id];
        const hasSavedInsight = Boolean(unchanged && previousEmailById.get(email.id)?.aiInsight);
        return !hasSavedInsight;
      });

      let analysisComplete = true;
      if (connected && emailsToAnalyze.length > 0) {
        const insights = await analyzeVisibleEmails(connected.provider, emailsToAnalyze);
        analysisComplete = insights !== null;
        if (insights) {
          combined = combined.map((message) => ({
            ...message,
            aiInsight: insights[message.id] || message.aiInsight,
          }));
          setMessages(combined);
        }
      }
      if (emailsToAnalyze.length === 0) {
        setAiAnalysisComplete(true);
      }

      // Keep only the short preview needed for the feed and content signatures;
      // do not persist full email bodies in browser storage.
      if (cacheKey && analysisComplete) {
        const cachedEmails = remoteEmails.map((email) => ({
          ...email,
          content: String(email.snippet || email.content || '').slice(0, 1200),
          snippet: String(email.snippet || '').slice(0, 1200),
        }));
        const inboxRecord: CachedInboxRecord = {
          key: cacheKey,
          userId,
          cachedAt: Date.now(),
          emails: cachedEmails,
          messages: combined,
          signatures,
          emailGrants,
          calendarGrants: calendarAccounts,
          connectedEmailProvider: connected,
          analysisComplete: true,
        };
        saveEmailInboxForSession(inboxRecord);
        void saveCachedEmailInbox(inboxRecord).catch((error) => console.warn('Could not save the local inbox cache.', error));
      }
    } catch (e) {
      console.warn('Could not hydrate live email messages:', e);
      setProviderReconnectRequired(e instanceof ProviderReconnectRequiredError);
      setProviderError(e instanceof Error ? e.message : 'Could not load live email data.');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const userId = String(currentUser?.id ?? currentUser?.email ?? '');
    if (!userId || hydratedUserId.current === userId) return;
    hydratedUserId.current = userId;
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('search') || '';
    setSearchMessageId(params.get('message_id') || '');
    void hydrateMessages('all', { searchQuery });
  }, [currentUser?.id, currentUser?.email]);

  useEffect(() => {
    if (!isAnalyzingAI) return;

    const progressTimer = window.setInterval(() => {
      setAiProgress((progress) => progress >= 75 ? 75 : Math.min(75, progress + 5));
    }, 80);

    return () => window.clearInterval(progressTimer);
  }, [isAnalyzingAI]);

  const handleConnectProvider = async (provider: 'gmail' | 'outlook') => {
    setIsConnectingProvider(true);
    try {
      setProviderError('');
      setProviderReconnectRequired(false);
      try {
        const nylasProv = provider === 'gmail' ? 'google' : 'microsoft';
        const authUrl = await startNylasConnectAPI({
          provider: nylasProv,
          product: 'all',
          origin: 'assistant',
          login_hint: currentUser?.email,
        });
        if (authUrl) {
          window.location.href = authUrl;
          return;
        }
      } catch (nylasErr) {
        console.warn('Nylas connect attempt failed, falling back to direct provider OAuth', nylasErr);
      }

      const result = await connectEmailProviderAPI(provider);
      const authUrl = result?.authorization_url || result?.auth_url || result?.url;
      if (authUrl) {
        window.location.href = authUrl;
        return;
      }
    } catch (e) {
      console.error('Failed to initiate email provider OAuth', e);
      setProviderError(e instanceof Error ? e.message : 'Could not start email authorization.');
    } finally {
      setIsConnectingProvider(false);
    }
  };

  const handleActionDecision = async (actionId: string, decision: 'approve' | 'dismiss', grantId?: string) => {
    setActionBusyId(actionId);
    setActionError('');
    try {
      await decideEmailActionAPI({ action_id: actionId, decision, ...(grantId ? { grant_id: grantId } : {}) });
      await hydrateMessages(selectedGrantId, { forceRefresh: true });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not apply this action.');
    } finally {
      setActionBusyId('');
    }
  };

  const handleRefreshFeed = () => {
    void hydrateMessages(selectedGrantId, { forceRefresh: true });
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-[--border] p-4 sm:p-5 flex flex-col gap-4 sm:gap-5 ${className}`}>
      {/* 2. Executive Email & Assistant Stream */}
      <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-[--foreground] flex items-center gap-2">
              <Mail size={16} className="text-[#1EA0FF]" />
              Executive Email &amp; Assistant Stream
            </h2>
            <p className="text-xs text-[--muted-foreground]">
              Email triage with suggested tasks, projects, and calendar changes for your approval
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {nylasGrants.length > 1 && (
              <select
                id="email-account-filter"
                value={selectedGrantId}
                onChange={(event) => {
                  const grantId = event.target.value;
                  setSelectedGrantId(grantId);
                  void hydrateMessages(grantId);
                }}
                className="rounded-xl border border-[#BFE7FF] bg-[#F0F9FF] px-3 py-2 text-xs font-semibold text-[#0088EE] outline-none focus:ring-2 focus:ring-[#1EA0FF] shadow-2xs"
                title="Filter by connected account"
              >
                <option value="all">🌐 All Accounts ({nylasGrants.length} Inboxes)</option>
                {nylasGrants.map((g) => (
                  <option key={g.grant_id} value={g.grant_id}>
                    {g.provider === 'google' ? 'Google' : g.provider === 'microsoft' ? 'Outlook' : g.provider}: {g.email}
                  </option>
                ))}
              </select>
            )}

            <label className="sr-only" htmlFor="email-priority-filter">Filter emails by priority</label>
            <select
              id="email-priority-filter"
              value={emailFilter}
              onChange={(event) => setEmailFilter(event.target.value as typeof emailFilter)}
              className="rounded-xl border border-[--border] bg-white px-3 py-2 text-xs font-medium text-[--foreground] outline-none focus:ring-2 focus:ring-[#1EA0FF]"
            >
              <option value="all">All messages</option>
              <option value="important">Important emails</option>
              <option value="high">High priority</option>
            </select>
            <button
              onClick={handleRefreshFeed}
              disabled={isRefreshing || isAnalyzingAI}
              title="Refresh live messages"
              className="inline-flex items-center gap-2 rounded-xl border border-[#BFE7FF] bg-[#F0F9FF] px-3.5 py-2 text-xs font-semibold text-[#0088EE] shadow-sm transition hover:border-[#80CFFF] hover:bg-[#E8F6FF] disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? 'Refreshing…' : isAnalyzingAI ? 'Analyzing…' : 'Refresh inbox'}
            </button>
          </div>
        </div>

        {/* Message Feed Container */}
      {providerError && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          {providerError}
          {providerReconnectRequired && connectedEmailProvider && (
            <button
              type="button"
              onClick={() => handleConnectProvider(connectedEmailProvider.provider)}
              disabled={isConnectingProvider}
              className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 font-semibold text-amber-900 hover:bg-amber-100 disabled:opacity-50"
            >
              Reconnect {connectedEmailProvider.provider === 'outlook' ? 'Outlook' : 'Gmail'}
            </button>
          )}
        </div>
      )}
        {isAnalyzingAI && (
          <div
            role="status"
            aria-live="polite"
            className="ai-working-glow rounded-xl border border-[#BFE7FF] bg-gradient-to-r from-[#F0F9FF] via-white to-violet-50 px-3.5 py-3 shadow-sm shadow-blue-500/10"
          >
            <svg
              aria-hidden="true"
              className="ai-orbit-trace pointer-events-none absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="assistant-orbit-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1EA0FF" stopOpacity="0" />
                  <stop offset="55%" stopColor="#1EA0FF" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#A855F7" stopOpacity="0.75" />
                </linearGradient>
              </defs>
              <rect
                x="1"
                y="1"
                width="calc(100% - 2px)"
                height="calc(100% - 2px)"
                rx="12"
                fill="none"
                stroke="url(#assistant-orbit-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength="100"
                className="ai-orbit-stroke"
              />
            </svg>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1EA0FF] text-white shadow-sm shadow-blue-500/30">
                  <Sparkles size={14} className="animate-pulse" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#0D1B2A]">AI is working on your inbox</p>
                  <p className="text-[10px] text-[#0088EE]">Finding priorities and changes you can approve</p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-bold tabular-nums text-[#0088EE]">{aiProgress}%</span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-[#E8F6FF]"
              role="progressbar"
              aria-label="AI email analysis progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={aiProgress}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#F0F9FF]0 via-violet-500 to-fuchsia-500 transition-[width] duration-200 ease-out"
                style={{ width: `${aiProgress}%` }}
              />
            </div>
          </div>
        )}
        {!isAnalyzingAI && aiAnalysisComplete && !aiError && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-3.5 py-3"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-600" />
                <div>
                  <p className="text-xs font-bold text-emerald-900">AI analysis complete</p>
                  <p className="text-[10px] text-emerald-700">Your inbox priorities and action items are ready</p>
                </div>
              </div>
              <span className="text-xs font-bold tabular-nums text-emerald-700">100%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-emerald-100" role="progressbar" aria-label="AI email analysis complete" aria-valuemin={0} aria-valuemax={100} aria-valuenow={100}>
              <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" />
            </div>
          </div>
        )}
        {aiError && (
          <p role="status" className="text-[11px] text-amber-700">
            Inbox loaded, but AI analysis could not finish. {aiError}
          </p>
        )}
        <div className={`space-y-2.5 ${compact ? 'max-h-[320px] overflow-y-auto' : 'max-h-none'} pr-1`}>
          {!connectedEmailProvider ? (
            <div className="py-7 px-5 text-center bg-gray-50/70 border border-dashed border-[--border] rounded-2xl flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] border border-[#BFE7FF] text-[#1EA0FF] flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div className="max-w-md">
                <h3 className="text-xs font-bold text-gray-900">No Email Provider Connected</h3>
                <p className="text-[11px] text-gray-500 mt-1">
                  Connect your Google (Gmail) or Microsoft (Outlook) account to activate live inbox triage, action item detection, and executive morning summaries.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleConnectProvider('gmail')}
                  disabled={isConnectingProvider}
                  className="px-3 py-1.5 rounded-xl bg-white border border-gray-300 hover:border-[#1EA0FF] text-xs font-semibold text-gray-700 hover:text-[#1EA0FF] shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <span>Connect Gmail</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleConnectProvider('outlook')}
                  disabled={isConnectingProvider}
                  className="px-3 py-1.5 rounded-xl bg-white border border-gray-300 hover:border-[#1EA0FF] text-xs font-semibold text-gray-700 hover:text-[#1EA0FF] shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <span>Connect Outlook</span>
                </button>
                <Link
                  href="/dashboard/settings"
                  className="px-3 py-1.5 rounded-xl bg-[#F0F9FF] hover:bg-[#E8F6FF] text-xs font-semibold text-[#0088EE] border border-[#BFE7FF] transition"
                >
                  Settings &rarr;
                </Link>
              </div>
              {providerError && <p role="alert" className="text-xs text-rose-600">{providerError}</p>}
            </div>
        ) : filteredMessages.length === 0 ? (
            <div className="py-10 text-center text-xs text-[--muted-foreground]">
            {emailFilter === 'all' ? 'No messages found.' : 'No emails match this priority filter yet.'}
            </div>
        ) : (
            visibleMessages.map((msg) => {
              const ch = channelConfig[msg.channel] || channelConfig.system;
              const Icon = ch.icon;
              const priority = msg.aiInsight?.priority;
              const isUrgent = priority === 'urgent';
              const isHighPriority = priority === 'high';
              const priorityCardStyle = isUrgent
                ? 'border-rose-300 bg-rose-50/50 shadow-sm shadow-rose-100 ring-1 ring-rose-100'
                : isHighPriority
                  ? 'border-orange-300 bg-orange-50/40 shadow-sm shadow-orange-100'
                  : 'border-[--border] bg-[--background] hover:bg-slate-50/80';

              return (
                <div
                  key={msg.id}
                  className={`group rounded-xl p-3.5 border transition-all duration-150 flex flex-col gap-2 ${priorityCardStyle}`}
                >
                  {(isUrgent || isHighPriority) && (
                    <div className={`-mx-1 -mt-1 flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                      isUrgent ? 'bg-rose-600 text-white' : 'bg-orange-500 text-white'
                    }`}>
                      <AlertTriangle size={12} />
                      {isUrgent ? 'AI flagged as urgent' : 'AI flagged as high priority'}
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${ch.bg}`}>
                        <Icon size={11} />
                        {ch.label}
                      </span>
                      {msg.account_email && (
                        <span className="text-[10px] text-gray-600 font-medium bg-slate-100 px-1.5 py-0.5 rounded border border-gray-200">
                          {msg.provider ? `${msg.provider.toUpperCase()} · ` : ''}{msg.account_email}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-[--foreground]">
                        {msg.sender}
                      </span>
                      <span className="text-[11px] text-[--muted-foreground]">
                        → {msg.recipient}
                      </span>
                    </div>
                    <span className="text-[10px] text-[--muted-foreground] font-mono shrink-0">
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.subject && (
                    <p className="text-xs font-semibold text-[--foreground]">
                      Subj: {msg.subject}
                    </p>
                  )}

                  <p className="text-xs text-[--foreground] leading-relaxed">
                    {msg.content}
                  </p>

                  {/* Stored AI analysis from Django/OpenRouter */}
                  {msg.aiAction && (
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#0088EE] bg-[#F0F9FF] border border-[#BFE7FF] rounded-lg px-2.5 py-1 self-start">
                      <Sparkles size={11} className="text-[#1EA0FF] shrink-0" />
                      <span>{msg.aiAction}</span>
                    </div>
                  )}
                  {msg.channel === 'email' && msg.aiInsight && (
                    <div className="rounded-xl border border-[#BFE7FF] bg-white p-3 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                          msg.aiInsight.priority === 'urgent' ? 'bg-rose-100 text-rose-700' :
                          msg.aiInsight.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          msg.aiInsight.priority === 'normal' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                        }`} title={msg.aiInsight.priority_reason}>
                          {(isUrgent || isHighPriority) && <AlertTriangle size={11} />}
                          {msg.aiInsight.priority} priority
                        </span>
                        <span className="text-[10px] font-medium text-[#1EA0FF]">AI email triage</span>
                      </div>
                      <p className="text-xs font-medium leading-relaxed text-slate-800">{msg.aiInsight.summary}</p>
                      {msg.aiInsight.priority_reason && (
                        <p className="text-[11px] text-slate-500">{msg.aiInsight.priority_reason}</p>
                      )}
                      {msg.aiInsight.suggested_action && (
                        <p className="text-[11px] text-slate-600">
                          <span className="font-semibold text-slate-700">Next step:</span> {msg.aiInsight.suggested_action}
                        </p>
                      )}
                      {msg.aiInsight.action_items.length > 0 && (
                        <ul className="list-disc space-y-0.5 pl-4 text-[11px] text-slate-600">
                          {msg.aiInsight.action_items.map((item, index) => (
                            <li key={`${msg.id}-action-${index}`}>
                              {item.task}{item.due_date ? ` · ${item.due_date}` : ''}
                            </li>
                          ))}
                        </ul>
                      )}
                      {msg.aiInsight.proposed_actions?.length > 0 && (
                        <div className="space-y-2 border-t border-slate-100 pt-2">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Suggested changes · approval required</p>
                          {msg.aiInsight.proposed_actions.map((action) => {
                            const kindLabels = {
                              task: 'Create task', project: 'Create project', calendar_create: 'Create calendar event',
                              calendar_update: 'Update calendar event', calendar_cancel: 'Cancel calendar event',
                            };
                            const selectedGrant = actionGrantIds[action.id] || '';
                            const isPending = action.status === 'pending';
                            return (
                              <div key={action.id} className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="text-[11px] font-semibold text-slate-800">{kindLabels[action.kind]}</p>
                                    <p className="mt-0.5 text-[11px] text-slate-700">
                                      {action.payload.title || action.payload.event_title || action.payload.event_id}
                                      {(action.payload.start || action.payload.event_start) && ` · ${new Date(action.payload.start || action.payload.event_start).toLocaleString()}`}
                                      {action.payload.due_date && ` · due ${action.payload.due_date}`}
                                    </p>
                                    {action.explanation && <p className="mt-1 text-[10px] text-slate-500">{action.explanation}</p>}
                                  </div>
                                  {!isPending && <span className="text-[10px] font-semibold capitalize text-slate-500">{action.status}</span>}
                                </div>
                                {isPending && action.kind === 'calendar_create' && (
                                  <select
                                    aria-label="Choose calendar account for proposed event"
                                    value={selectedGrant}
                                    onChange={(event) => setActionGrantIds((current) => ({ ...current, [action.id]: event.target.value }))}
                                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[11px] text-slate-700 outline-none focus:ring-2 focus:ring-[#1EA0FF]"
                                  >
                                    <option value="">Choose a calendar account…</option>
                                    {calendarGrants.map((grant) => (
                                      <option key={grant.grant_id} value={grant.grant_id}>{grant.email} · {grant.provider}</option>
                                    ))}
                                  </select>
                                )}
                                {isPending && (
                                  <div className="mt-2 flex items-center justify-end gap-2">
                                    <button
                                      type="button"
                                      disabled={actionBusyId === action.id}
                                      onClick={() => void handleActionDecision(action.id, 'dismiss')}
                                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                                    ><X size={12} /> Dismiss</button>
                                    <button
                                      type="button"
                                      disabled={actionBusyId === action.id || (action.kind === 'calendar_create' && !selectedGrant)}
                                      onClick={() => void handleActionDecision(action.id, 'approve', selectedGrant || undefined)}
                                      className="inline-flex items-center gap-1 rounded-md bg-[#1EA0FF] px-2.5 py-1.5 text-[10px] font-semibold text-white hover:bg-[#0088EE] disabled:cursor-not-allowed disabled:opacity-50"
                                    ><Check size={12} /> {actionBusyId === action.id ? 'Applying…' : 'Approve'}</button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                  {msg.channel === 'email' && isAnalyzingAI && !msg.aiInsight && (
                    <div className="flex items-center gap-1.5 self-start rounded-lg border border-[#BFE7FF] bg-[#F0F9FF] px-2.5 py-1 text-[11px] text-[#0088EE]">
                      <Sparkles size={11} className="animate-pulse" /> Analyzing email…
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        {compact && (
          <Link
            href="/dashboard/inbox"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#BFE7FF] bg-[#F0F9FF] px-4 text-sm font-semibold text-[#0088EE] transition hover:bg-[#E8F6FF]"
          >
            {filteredMessages.length > visibleMessages.length
              ? `View all ${filteredMessages.length} inbox items`
              : 'Open inbox'} <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>

      {actionError && <p role="alert" className="text-xs text-rose-700">{actionError}</p>}

    </div>
  );
}
