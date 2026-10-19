'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Mail,
  Send,
  Volume2,
  VolumeX,
  CheckCircle2,
  Clock,
  Zap,
  RotateCcw,
  RefreshCw,
  Inbox,
  Check,
  ExternalLink
} from 'lucide-react';
import { useCachedUser } from '../hooks/useCachedUser';
import { useCachedTasks } from '../hooks/useCachedTasks';
import { useCachedProjects } from '../hooks/useCachedProjects';
import { fetchMessagesAPI, saveMessagesAPI } from '@/app/lib/api/messages';
import {
  fetchEmailProvidersAPI,
  fetchEmailMessagesAPI,
  connectEmailProviderAPI,
  EmailProviderStatus
} from '@/app/lib/api/email';

export type ChannelType = 'all' | 'email' | 'system';

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
}

const channelConfig = {
  all: { label: 'All Inquiries', icon: Inbox, color: 'text-indigo-600' },
  email: { label: 'Executive Emails', icon: Mail, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-200 text-violet-700' },
  system: { label: 'System Directives', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200 text-amber-700' },
};

export default function AssistantHub({ className = '' }: { className?: string }) {
  const { user } = useCachedUser();
  const { tasks } = useCachedTasks();
  const { projects } = useCachedProjects();
  const currentUser = user?.[0];

  const [activeChannel, setActiveChannel] = useState<ChannelType>('all');
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [connectedEmailProvider, setConnectedEmailProvider] = useState<EmailProviderStatus | null>(null);
  const [isConnectingProvider, setIsConnectingProvider] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [directiveInput, setDirectiveInput] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);

  // Load email providers and live inbox messages
  const hydrateMessages = async () => {
    setIsRefreshing(true);
    try {
      const providers = await fetchEmailProvidersAPI();
      const connected = providers.find((p) => p.is_connected);
      setConnectedEmailProvider(connected || null);

      let liveEmailItems: MessageItem[] = [];

      if (connected) {
        const remoteEmails = await fetchEmailMessagesAPI(connected.provider, '', 25);
        if (Array.isArray(remoteEmails) && remoteEmails.length > 0) {
          liveEmailItems = remoteEmails.map((item) => ({
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
            aiAction: item.direction === 'inbound' ? 'AI Triage & Action Item Detection' : undefined,
          }));
        }
      }

      // Also fetch any assistant system messages
      const remoteDirectives = await fetchMessagesAPI();
      const combined = [...liveEmailItems, ...(Array.isArray(remoteDirectives) ? remoteDirectives : [])];
      setMessages(combined);
    } catch (e) {
      console.warn('Could not hydrate live email messages:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    hydrateMessages();
  }, [currentUser]);

  const handleConnectProvider = async (provider: 'gmail' | 'outlook') => {
    setIsConnectingProvider(true);
    try {
      const result = await connectEmailProviderAPI(provider);
      const authUrl = result?.authorization_url || result?.auth_url || result?.url;
      if (authUrl) {
        window.location.href = authUrl;
        return;
      }
    } catch (e) {
      console.error('Failed to initiate email provider OAuth', e);
    } finally {
      setIsConnectingProvider(false);
    }
  };

  const saveMessages = async (items: MessageItem[]) => {
    setMessages(items);
    try {
      await saveMessagesAPI({ messages: items });
    } catch (e) {
      console.error('Failed to save assistant messages', e);
    }
  };

  const pendingTasksCount = tasks.filter((t) => t.status !== 'done').length;
  const criticalTasksCount = tasks.filter((t) => t.priority === 'high' && t.status !== 'done').length;
  const inProgressProjectsCount = projects.filter((p) => p.status === 'in_progress').length;

  const handleSendDirective = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!directiveInput.trim() || isDispatching) return;

    setIsDispatching(true);

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: MessageItem = {
      id: `dir-${Date.now()}`,
      channel: 'system',
      direction: 'inbound',
      sender: currentUser ? `${currentUser.first_name} (Executive)` : 'You (Executive)',
      recipient: 'Nova Assistant',
      subject: `Directive: ${directiveInput.slice(0, 32)}...`,
      content: directiveInput,
      timestamp: timeStr,
      status: 'delivered',
    };

    const newItems = [userMsg, ...messages];
    saveMessages(newItems);
    setDirectiveInput('');

    // Proactive assistant confirmation
    setTimeout(() => {
      const assistantReply: MessageItem = {
        id: `reply-${Date.now()}`,
        channel: 'system',
        direction: 'outbound',
        sender: 'Nova Assistant',
        recipient: currentUser ? `${currentUser.first_name}` : 'You',
        subject: `Re: Directive Execution`,
        content: `Understood! I am executing: "${userMsg.content}". I have updated your priority queue and will alert you upon completion.`,
        aiAction: "Action queued in background workflow runner",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'resolved',
      };
      saveMessages([assistantReply, ...newItems]);
      setIsDispatching(false);
    }, 700);
  };

  const handleQuickChip = (promptText: string) => {
    setDirectiveInput(promptText);
  };

  const handleRefreshFeed = () => {
    hydrateMessages();
  };

  const filteredMessages = activeChannel === 'all'
    ? messages
    : messages.filter((m) => m.channel === activeChannel);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-[--border] p-5 flex flex-col gap-5 ${className}`}>
      {/* 1. Today's Executive Briefing Banner */}
      <div className="relative overflow-hidden rounded-xl gradient-brand text-white p-5 shadow-sm">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                Personal Executive Assistant • Email Connected
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight">
              Good morning, {currentUser?.first_name || 'Chief'} ☕
            </h1>
            <p className="text-xs md:text-sm text-indigo-100/90 max-w-xl leading-relaxed">
              You have <span className="font-semibold text-white">{criticalTasksCount} priority item{criticalTasksCount !== 1 ? 's' : ''}</span> requiring attention and <span className="font-semibold text-white">{pendingTasksCount} total tasks</span> across <span className="font-semibold text-white">{inProgressProjectsCount} active projects</span>. Your connected mailbox is actively monitored.
            </p>
          </div>

          {/* Audio memo toggle */}
          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className="self-start md:self-center flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-medium backdrop-blur-sm transition-all shrink-0 cursor-pointer"
          >
            {isPlayingAudio ? (
              <>
                <VolumeX size={15} className="text-white" />
                <span>Stop Memo</span>
              </>
            ) : (
              <>
                <Volume2 size={15} className="text-indigo-200" />
                <span>45s Audio Briefing</span>
              </>
            )}
          </button>
        </div>

        {/* Executive Highlights Bar */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 pt-3.5 border-t border-white/15 text-xs">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
            <Zap size={14} className="text-amber-300 shrink-0" />
            <span className="truncate">Top: Review Milestone 2 delivery</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
            <Clock size={14} className="text-sky-300 shrink-0" />
            <span className="truncate">Calendar: Next meeting at 2:00 PM</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
            <CheckCircle2 size={14} className="text-emerald-300 shrink-0" />
            <span className="truncate">Assistant: Executive emails processed</span>
          </div>
        </div>
      </div>

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

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              onClick={handleRefreshFeed}
              disabled={isRefreshing}
              title="Refresh live messages"
              className="p-1.5 rounded-lg text-[--muted-foreground] hover:text-[--foreground] hover:bg-[--background] transition-colors border border-transparent hover:border-[--border] disabled:opacity-50"
            >
              <RefreshCw size={13} className={isRefreshing ? "animate-spin text-indigo-600" : ""} />
            </button>
            <div className="flex items-center gap-1 bg-[--background] p-1 rounded-xl border border-[--border]">
              {(['all', 'email', 'system'] as ChannelType[]).map((ch) => {
                const cfg = channelConfig[ch];
                const isActive = activeChannel === ch;
                const Icon = cfg.icon;
                return (
                  <button
                    key={ch}
                    onClick={() => setActiveChannel(ch)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white text-indigo-600 shadow-sm border border-[--border]'
                        : 'text-[--muted-foreground] hover:text-[--foreground]'
                    }`}
                  >
                    <Icon size={12} className={isActive ? 'text-indigo-600' : cfg.color} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Message Feed Container */}
        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
          {activeChannel !== 'system' && !connectedEmailProvider ? (
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
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="py-10 text-center text-xs text-[--muted-foreground]">
              No messages found.
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const ch = channelConfig[msg.channel] || channelConfig.system;
              const Icon = ch.icon;

              return (
                <div
                  key={msg.id}
                  className="group bg-[--background] hover:bg-slate-50/80 rounded-xl p-3.5 border border-[--border] transition-all duration-150 flex flex-col gap-2"
                >
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

                  {/* AI Action tag if assistant handled it */}
                  {msg.aiAction && (
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-indigo-700 bg-indigo-50/70 border border-indigo-100 rounded-lg px-2.5 py-1 self-start">
                      <Sparkles size={11} className="text-indigo-500 shrink-0" />
                      <span>{msg.aiAction}</span>
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
            <span>Email Directive</span>
          </div>

          {/* Directive text input */}
          <div className="relative flex-1">
            <Sparkles size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none" />
            <input
              type="text"
              value={directiveInput}
              onChange={(e) => setDirectiveInput(e.target.value)}
              placeholder='Give directive (e.g. "Draft reply to Sarah regarding Milestone 2", "Schedule follow-up email")...'
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
