'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Mail,
  Send,
  Zap,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useCachedUser } from '../hooks/useCachedUser';
import { fetchMessagesAPI, createMessageAPI } from '@/app/lib/api/messages';
import {
  analyzeEmailMessagesAPI,
  fetchEmailProvidersAPI,
  fetchEmailMessagesAPI,
  connectEmailProviderAPI,
  EmailInsight,
  EmailMessageItem,
  EmailProviderStatus
} from '@/app/lib/api/email';
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
}

const channelConfig = {
  email: { label: 'Executive Emails', icon: Mail, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-200 text-violet-700' },
  system: { label: 'System Directives', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200 text-amber-700' },
};

export default function AssistantHub({ className = '' }: { className?: string }) {
  const { user } = useCachedUser();
  const currentUser = user?.[0];

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [connectedEmailProvider, setConnectedEmailProvider] = useState<EmailProviderStatus | null>(null);
  const [isConnectingProvider, setIsConnectingProvider] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [directiveInput, setDirectiveInput] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const [directiveError, setDirectiveError] = useState('');
  const [providerError, setProviderError] = useState('');
  const [providerReconnectRequired, setProviderReconnectRequired] = useState(false);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);
  const [aiError, setAiError] = useState('');
  const [emailFilter, setEmailFilter] = useState<'all' | 'important' | 'high'>('all');
  const aiAnalysisInFlight = useRef(false);

  const filteredMessages = messages.filter((message) => {
    if (emailFilter === 'all') return true;
    if (message.channel !== 'email') return false;
    if (emailFilter === 'important') return ['urgent', 'high'].includes(message.aiInsight?.priority || '');
    return message.aiInsight?.priority === 'high';
  });

  // Load email providers and live inbox messages
  const hydrateMessages = async () => {
    setIsRefreshing(true);
    setAiError('');
    setAiProgress(0);
    setAiAnalysisComplete(false);
    try {
      const providers = await fetchEmailProvidersAPI();
      const connected = providers.find((p) => p.is_connected);
      setConnectedEmailProvider(connected || null);

      let remoteEmails: EmailMessageItem[] = [];

      if (connected) {
        remoteEmails = await fetchEmailMessagesAPI(connected.provider, '', 25);
      }

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
      }));

      // Also fetch any assistant system messages
      const remoteDirectives = await fetchMessagesAPI();
      const combined = [...liveEmailItems, ...(Array.isArray(remoteDirectives) ? remoteDirectives : [])];
      setMessages(combined);
      setProviderError('');
      setProviderReconnectRequired(false);
      const inboundEmails = remoteEmails.filter((item) => item.direction === 'inbound');
      if (connected && inboundEmails.length > 0) {
        void analyzeVisibleEmails(connected.provider, inboundEmails);
      }
    } catch (e) {
      console.warn('Could not hydrate live email messages:', e);
      setProviderReconnectRequired(e instanceof ProviderReconnectRequiredError);
      setProviderError(e instanceof Error ? e.message : 'Could not load live email data.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const analyzeVisibleEmails = async (provider: string, emails: EmailMessageItem[]) => {
    if (aiAnalysisInFlight.current) return;
    aiAnalysisInFlight.current = true;
    setIsAnalyzingAI(true);
    setAiProgress(0);
    setAiAnalysisComplete(false);
    setAiError('');
    try {
      const insights = await analyzeEmailMessagesAPI(provider, emails);
      setMessages((current) => current.map((message) => ({
        ...message,
        aiInsight: insights[message.id] || message.aiInsight,
      })));
      setAiProgress(100);
      setAiAnalysisComplete(true);
    } catch (error) {
      console.warn('Could not analyze inbox emails:', error);
      setAiProgress(0);
      setAiAnalysisComplete(false);
      setAiError(error instanceof Error ? error.message : 'AI analysis is temporarily unavailable.');
    } finally {
      aiAnalysisInFlight.current = false;
      setIsAnalyzingAI(false);
    }
  };

  useEffect(() => {
    hydrateMessages();
  }, [currentUser]);

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

  const handleSendDirective = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!directiveInput.trim() || isDispatching) return;

    setIsDispatching(true);
    setDirectiveError('');

    try {
      const saved = await createMessageAPI({
        channel: 'system',
        direction: 'inbound',
        sender: currentUser ? `${currentUser.first_name} (Executive)` : 'Executive',
        recipient: 'Nova Assistant',
        subject: `Directive: ${directiveInput.slice(0, 32)}`,
        content: directiveInput,
      });
      if (!saved) throw new Error('The backend did not save this directive.');
      setDirectiveInput('');
      await hydrateMessages();
    } catch (error) {
      setDirectiveError(error instanceof Error ? error.message : 'Could not save the directive.');
    } finally {
      setIsDispatching(false);
    }
  };

  const handleQuickChip = (promptText: string) => {
    setDirectiveInput(promptText);
  };

  const handleRefreshFeed = () => {
    hydrateMessages();
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-[--border] p-5 flex flex-col gap-5 ${className}`}>
      {/* 2. Executive Email & Assistant Stream */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-[--foreground] flex items-center gap-2">
              <Mail size={16} className="text-indigo-600" />
              Executive Email &amp; Assistant Stream
            </h2>
            <p className="text-xs text-[--muted-foreground]">
              Real-time feed of parsed emails, client action items, and assistant responses
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <label className="sr-only" htmlFor="email-priority-filter">Filter emails by priority</label>
            <select
              id="email-priority-filter"
              value={emailFilter}
              onChange={(event) => setEmailFilter(event.target.value as typeof emailFilter)}
              className="rounded-xl border border-[--border] bg-white px-3 py-2 text-xs font-medium text-[--foreground] outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="all">All messages</option>
              <option value="important">Important emails</option>
              <option value="high">High priority</option>
            </select>
            <button
              onClick={handleRefreshFeed}
              disabled={isRefreshing || isAnalyzingAI}
              title="Refresh live messages"
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-semibold text-indigo-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-100 disabled:cursor-wait disabled:opacity-60"
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
            className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-violet-50 px-3.5 py-3 shadow-sm shadow-indigo-100/70"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-300">
                  <Sparkles size={14} className="animate-pulse" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-indigo-950">AI is working on your inbox</p>
                  <p className="text-[10px] text-indigo-700">Finding priorities, action items, and suggested replies</p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-bold tabular-nums text-indigo-700">{aiProgress}%</span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-indigo-100"
              role="progressbar"
              aria-label="AI email analysis progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={aiProgress}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-[width] duration-200 ease-out"
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
        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
          {!connectedEmailProvider ? (
            <div className="py-7 px-5 text-center bg-gray-50/70 border border-dashed border-[--border] rounded-2xl flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
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
                  className="px-3 py-1.5 rounded-xl bg-white border border-gray-300 hover:border-indigo-400 text-xs font-semibold text-gray-700 hover:text-indigo-600 shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <span>Connect Gmail</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleConnectProvider('outlook')}
                  disabled={isConnectingProvider}
                  className="px-3 py-1.5 rounded-xl bg-white border border-gray-300 hover:border-indigo-400 text-xs font-semibold text-gray-700 hover:text-indigo-600 shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <span>Connect Outlook</span>
                </button>
                <Link
                  href="/dashboard/settings"
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-xs font-semibold text-indigo-700 border border-indigo-200 transition"
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
            filteredMessages.map((msg) => {
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
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-indigo-700 bg-indigo-50/70 border border-indigo-100 rounded-lg px-2.5 py-1 self-start">
                      <Sparkles size={11} className="text-indigo-500 shrink-0" />
                      <span>{msg.aiAction}</span>
                    </div>
                  )}
                  {msg.channel === 'email' && msg.aiInsight && (
                    <div className="rounded-xl border border-indigo-100 bg-white p-3 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                          msg.aiInsight.priority === 'urgent' ? 'bg-rose-100 text-rose-700' :
                          msg.aiInsight.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          msg.aiInsight.priority === 'normal' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                        }`} title={msg.aiInsight.priority_reason}>
                          {(isUrgent || isHighPriority) && <AlertTriangle size={11} />}
                          {msg.aiInsight.priority} priority
                        </span>
                        <span className="text-[10px] font-medium text-indigo-600">AI email triage</span>
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
                      {msg.aiInsight.reply_draft && (
                        <details className="text-[11px]">
                          <summary className="cursor-pointer font-semibold text-indigo-700">View reply draft</summary>
                          <p className="mt-1 whitespace-pre-wrap rounded-lg bg-slate-50 p-2 text-slate-700">{msg.aiInsight.reply_draft}</p>
                        </details>
                      )}
                    </div>
                  )}
                  {msg.channel === 'email' && isAnalyzingAI && !msg.aiInsight && (
                    <div className="flex items-center gap-1.5 self-start rounded-lg border border-indigo-100 bg-indigo-50/70 px-2.5 py-1 text-[11px] text-indigo-700">
                      <Sparkles size={11} className="animate-pulse" /> Analyzing email…
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Executive Directive Bar (Prompt / Dispatch Input) */}
      <div className="pt-2 border-t border-[--border] space-y-2.5">
        <form onSubmit={handleSendDirective} className="relative flex items-center gap-2">
          {/* Directive Channel Badge (Email only) */}
          <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[--background] border border-[--border] rounded-xl text-xs font-medium text-[--foreground] shrink-0">
            <Mail size={13} className="text-indigo-600" />
            <span>Directive</span>
          </div>

          {/* Directive text input */}
          <div className="relative flex-1">
            <Sparkles size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none" />
            <input
              type="text"
              value={directiveInput}
              onChange={(e) => setDirectiveInput(e.target.value)}
              placeholder="Write a directive to save to your assistant stream..."
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all placeholder:text-[--muted-foreground]"
            />
          </div>

          {/* Dispatch button */}
          <button
            type="submit"
            disabled={!directiveInput.trim() || isDispatching}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl gradient-brand text-white text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-md shadow-indigo-100"
          >
            {isDispatching ? (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                Dispatching...
              </span>
            ) : (
              <>
                <Send size={13} />
                <span className="hidden sm:inline">Dispatch</span>
              </>
            )}
          </button>
        </form>
        <p className="text-[11px] text-[--muted-foreground]">Directives are saved to your backend stream. They are not automatically executed.</p>
        {directiveError && <p role="alert" className="text-xs text-rose-600">{directiveError}</p>}

        {/* 1-Click Directive Chips */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-[11px] font-medium text-[--muted-foreground] mr-1">Quick Directives:</span>
          {[
            '✉️ Email me my top 3 priorities for today',
            '📅 Reschedule any overlapping meetings',
            '✉️ Draft milestone status email to client',
          ].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleQuickChip(chip.replace(/^[^\s]+\s/, ''))}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[--background] hover:bg-indigo-50 text-[--muted-foreground] hover:text-indigo-600 border border-[--border] hover:border-indigo-200 transition-all cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
