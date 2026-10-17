'use client';

import { useState, useEffect } from 'react';
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
  Inbox,
  Check
} from 'lucide-react';
import { useCachedUser } from '../hooks/useCachedUser';
import { useCachedTasks } from '../hooks/useCachedTasks';
import { useCachedProjects } from '../hooks/useCachedProjects';
import { fetchMessagesAPI, saveMessagesAPI } from '@/app/lib/api/messages';

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

const defaultMessages: MessageItem[] = [
  {
    id: 'msg-1',
    channel: 'email',
    direction: 'outbound',
    sender: 'Nova Executive Assistant',
    recipient: 'eduardo@novasuite.io',
    subject: 'Daily Executive Briefing & Calendar Review',
    content: "Good morning Eduardo. You have 2 high-priority deliverables scheduled for today and a client strategy sync at 2:00 PM. I have prepared draft notes and checked your schedule for any overlaps.",
    aiAction: "Synthesized morning agenda & queued email briefing",
    timestamp: "8:30 AM",
    status: 'delivered',
  },
  {
    id: 'msg-2',
    channel: 'email',
    direction: 'inbound',
    sender: 'Sarah Jenkins (Apex Labs)',
    recipient: 'eduardo@novasuite.io',
    subject: 'Milestone 2 Sign-off & Asset Delivery',
    content: "Hi Eduardo, we've reviewed the designs and everything looks approved. Please proceed with Phase 3 when ready.",
    aiAction: "Parsed sign-off & marked 'Client Asset Delivery' task as ready",
    timestamp: "9:15 AM",
    status: 'resolved',
  },
  {
    id: 'msg-3',
    channel: 'email',
    direction: 'inbound',
    sender: 'Finance & Invoicing System',
    recipient: 'eduardo@novasuite.io',
    subject: 'Contractor Invoice Notification — Project Alpha',
    content: "Invoice #INV-2049 from Lead Designer has been submitted for approval ($3,400.00).",
    aiAction: "Extracted invoice total & prepared 1-click authorization draft",
    timestamp: "10:02 AM",
    status: 'delivered',
  },
  {
    id: 'msg-4',
    channel: 'system',
    direction: 'internal',
    sender: 'Executive Intelligence Engine',
    recipient: 'Dashboard Stream',
    subject: 'Backlog Health Optimization',
    content: "Analyzed your task backlog: 3 tasks were missing due dates. Target dates have been assigned based on active project milestones.",
    aiAction: "Backlog health score improved from 72% → 91%",
    timestamp: "10:45 AM",
    status: 'resolved',
  },
];

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
  const [messages, setMessages] = useState<MessageItem[]>(defaultMessages);
  const [directiveInput, setDirectiveInput] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);

  // Load persisted messages from backend and then local fallback
  useEffect(() => {
    const hydrateMessages = async () => {
      const remoteMessages = await fetchMessagesAPI();
      if (remoteMessages.length > 0) {
        setMessages(remoteMessages);
        return;
      }

      try {
        const saved = localStorage.getItem('nova_assistant_email_messages');
        if (saved) {
          setMessages(JSON.parse(saved));
        }
      } catch (e) {
        console.error(e);
      }
    };

    hydrateMessages();
  }, []);

  const saveMessages = async (items: MessageItem[]) => {
    setMessages(items);

    try {
      await saveMessagesAPI({ messages: items });
    } catch (e) {
      console.error('Failed to save assistant messages', e);
    }

    try {
      localStorage.setItem('nova_assistant_email_messages', JSON.stringify(items));
    } catch (e) {
      console.error(e);
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
      channel: 'email',
      direction: 'inbound',
      sender: currentUser ? `${currentUser.first_name} (Boss)` : 'You (Boss)',
      recipient: 'Nova Assistant (Inbox)',
      subject: `Executive Directive: ${directiveInput.slice(0, 32)}...`,
      content: directiveInput,
      timestamp: timeStr,
      status: 'delivered',
    };

    const newItems = [userMsg, ...messages];
    saveMessages(newItems);
    setDirectiveInput('');

    // Simulate assistant proactive confirmation
    setTimeout(() => {
      const assistantReply: MessageItem = {
        id: `reply-${Date.now()}`,
        channel: 'email',
        direction: 'outbound',
        sender: 'Nova Assistant',
        recipient: currentUser ? `${currentUser.first_name}` : 'You',
        subject: `Re: Executive Directive Execution`,
        content: `Understood! I am executing: "${userMsg.content}". I have updated your priority queue and will send a confirmation email once completed.`,
        aiAction: "Action queued in background workflow runner",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'resolved',
      };
      saveMessages([assistantReply, ...newItems]);
      setIsDispatching(false);
    }, 800);
  };

  const handleQuickChip = (promptText: string) => {
    setDirectiveInput(promptText);
  };

  const handleResetFeed = () => {
    saveMessages(defaultMessages);
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
              onClick={handleResetFeed}
              title="Reset sample feed"
              className="p-1.5 rounded-lg text-[--muted-foreground] hover:text-[--foreground] hover:bg-[--background] transition-colors border border-transparent hover:border-[--border]"
            >
              <RotateCcw size={13} />
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
          {filteredMessages.length === 0 ? (
            <div className="py-10 text-center text-xs text-[--muted-foreground]">
              No messages in this filter yet.
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
