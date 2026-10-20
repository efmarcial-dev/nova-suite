'use client';

import { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Check,
  Sparkles,
  Video,
  ShieldCheck,
  Plus,
  RefreshCw,
  ExternalLink,
  Lock,
  Bot
} from 'lucide-react';
import { useCachedUser } from '@/app/hooks/useCachedUser';
import ModalPanel from '@/app/components/ModalPanel';
import {
  fetchCalendarConnectionAPI,
  fetchCalendarEventsAPI,
  connectCalendarProviderAPI,
  disconnectCalendarProviderAPI,
  saveCalendarEventAPI,
  syncCalendarEventsAPI,
} from '@/app/lib/api/calendar';
import { ProviderReconnectRequiredError } from '@/app/lib/api/providerErrors';

type ProviderId = 'google' | 'outlook';

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  startHour: number; // e.g. 9 for 9:00 AM
  durationHours: number; // e.g. 1.0
  type: 'meeting' | 'focus' | 'review' | 'personal';
  location?: string;
  attendees?: string[];
  assistantBrief?: string;
  hasConflict?: boolean;
  startAt: string;
  endAt: string;
}

function mapBackendEvent(evt: any): CalendarEvent {
  const startValue = evt.start_time || evt.start || evt.startTime;
  const endValue = evt.end_time || evt.end || evt.endTime;
  const startDate = startValue ? new Date(startValue) : new Date(NaN);
  const endDate = endValue ? new Date(endValue) : new Date(NaN);
  const safeStart = Number.isNaN(startDate.getTime()) ? new Date() : startDate;
  const safeEnd = Number.isNaN(endDate.getTime()) ? new Date(safeStart.getTime() + 60 * 60 * 1000) : endDate;
  const startHour = safeStart.getHours() + safeStart.getMinutes() / 60;
  const endHour = safeEnd.getHours() + safeEnd.getMinutes() / 60;
  const durationHours = Math.max(0.5, endHour - startHour);

  const formatH = (d: Date) => {
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return {
    id: String(evt.id || `${safeStart.toISOString()}-${evt.title || 'event'}`),
    title: evt.title || '(No Title)',
    startTime: evt.startTime || formatH(safeStart),
    endTime: evt.endTime || formatH(safeEnd),
    startHour,
    durationHours,
    type: (evt.event_type || evt.type || 'meeting') as any,
    location: evt.location || '',
    attendees: Array.isArray(evt.attendees) ? evt.attendees : [],
    assistantBrief: evt.assistant_brief || evt.assistantBrief || '',
    startAt: safeStart.toISOString(),
    endAt: safeEnd.toISOString(),
  };
}

export default function CalendarPage() {
  const { user } = useCachedUser();
  const currentUser = user?.[0];

  // Calendar connection state
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState('');
  const [eventsError, setEventsError] = useState('');
  const [reconnectRequired, setReconnectRequired] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderId>('google');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedEmail, setConnectedEmail] = useState('');
  
  // Permission toggles
  const [autoConflictWarn, setAutoConflictWarn] = useState(true);
  const [sendSmsBriefings, setSendSmsBriefings] = useState(true);
  const [protectFocusBlocks, setProtectFocusBlocks] = useState(true);

  // Calendar view state
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('11:00');
  const [newEventType, setNewEventType] = useState<'meeting' | 'focus'>('meeting');

  // Load connection state from backend and sync real events
  useEffect(() => {
    const hydrateCalendar = async () => {
      // Check query params if redirected from OAuth
      let paramProvider: ProviderId | null = null;
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('connected') === 'calendar') {
          const prov = params.get('provider');
          if (prov === 'outlook' || prov === 'google') {
            paramProvider = prov;
          }
        }
      }

      let connection: Record<string, any> = {};
      try {
        connection = await fetchCalendarConnectionAPI();
        setConnectionError('');
      } catch {
        setConnectionError('Could not load calendar connection status. Please refresh or try again.');
      }
      const isConnectedProvider = Boolean(connection?.isConnected);

      if (isConnectedProvider) {
        setIsConnected(true);
        const activeProv: ProviderId = connection?.provider === 'outlook' ? 'outlook' : (paramProvider || 'google');
        setSelectedProvider(activeProv);
        setConnectedEmail(connection?.email || (currentUser?.email ?? ''));

        // Initial sync from provider
        try {
          await syncCalendarEventsAPI(activeProv);
          setReconnectRequired(false);
        } catch (e) {
          console.warn('Initial calendar sync skipped:', e);
          setReconnectRequired(e instanceof ProviderReconnectRequiredError);
          setEventsError(e instanceof Error ? e.message : 'Calendar sync failed.');
        }
      } else {
        setIsConnected(false);
      }

      try {
        const backendEvents = await fetchCalendarEventsAPI();
        setEvents(backendEvents.map(mapBackendEvent));
      } catch {
        setEvents([]);
        setEventsError('Could not load calendar events from the backend.');
      }
    };

    void hydrateCalendar();
  }, [currentUser]);

  const handleSyncCalendar = async () => {
    setIsSyncing(true);
    try {
      setEventsError('');
      await syncCalendarEventsAPI(selectedProvider);
      setReconnectRequired(false);
      const backendEvents = await fetchCalendarEventsAPI();
      if (Array.isArray(backendEvents)) {
        setEvents(backendEvents.map(mapBackendEvent));
      }
    } catch (err) {
      console.error('Failed to sync calendar events from provider', err);
      setReconnectRequired(err instanceof ProviderReconnectRequiredError);
      setEventsError(err instanceof Error ? err.message : 'Calendar sync failed.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleConnect = async (targetProvider?: ProviderId) => {
    setIsConnecting(true);
    setReconnectRequired(false);
    const provider = (targetProvider || selectedProvider) === 'outlook' ? 'outlook' : 'google';
    setSelectedProvider(provider);

    try {
      const result = await connectCalendarProviderAPI(provider);
      const authUrl = result?.authorization_url || result?.auth_url || result?.authorizationUrl || result?.url;

      if (authUrl) {
        window.location.href = authUrl;
        return;
      }
      throw new Error('The backend did not return an authorization URL.');
    } catch (e) {
      console.error('Failed to save calendar connection', e);
      setConnectionError(e instanceof Error ? e.message : 'Could not start calendar authorization.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectCalendarProviderAPI(selectedProvider === 'outlook' ? 'outlook' : 'google');
      setIsConnected(false);
      setConnectedEmail('');
      setEvents([]);
      setConnectionError('');
    } catch (e) {
      console.error('Failed to disconnect calendar connection', e);
      setConnectionError(e instanceof Error ? e.message : 'Could not disconnect calendar.');
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const [hours, mins] = newEventTime.split(':').map(Number);
    const today = new Date();
    today.setHours(hours, mins || 0, 0, 0);
    const startIso = today.toISOString();
    const endIso = new Date(today.getTime() + 60 * 60 * 1000).toISOString();

    const startHour = hours + (mins || 0) / 60;
    try {
      setEventsError('');
      const savedEvent = await saveCalendarEventAPI({
        title: newEventTitle,
        start_time: startIso,
        end_time: endIso,
        event_type: newEventType,
        sync_provider: selectedProvider,
      });

      if (savedEvent) {
        setEvents((prev) => [...prev, mapBackendEvent(savedEvent)]);
      } else {
        throw new Error('The backend did not save the calendar event.');
      }
    } catch (err) {
      console.error('Error saving event', err);
      setReconnectRequired(err instanceof ProviderReconnectRequiredError);
      setEventsError(err instanceof Error ? err.message : 'Could not save the calendar event.');
      return;
    }

    setShowAddModal(false);
    setNewEventTitle('');
  };

  const providerDetails = {
    google: {
      name: 'Google Calendar',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      ),
      tag: 'Most Popular',
      desc: 'Google Workspace & personal Gmail. Real-time bi-directional sync.',
      color: 'border-blue-200 bg-blue-50/40',
    },
    outlook: {
      name: 'Microsoft Outlook / 365',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#0078D4" />
          <path d="M14.5 6.5h-5A1.5 1.5 0 008 8v8a1.5 1.5 0 001.5 1.5h5a1.5 1.5 0 001.5-1.5V8a1.5 1.5 0 00-1.5-1.5z" fill="#fff" fillOpacity="0.8" />
          <path d="M12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" fill="#0078D4" />
        </svg>
      ),
      tag: 'Enterprise Standard',
      desc: 'Microsoft 365, Exchange, and Outlook.com with corporate SSO.',
      color: 'border-sky-200 bg-sky-50/40',
    },
  };

  // -------------------------------------------------------------
  // STATE 1: UNCONNECTED ONBOARDING FLOW
  // -------------------------------------------------------------
  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Bot size={13} />
            <span>Assistant Calendar Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[--foreground] tracking-tight">
            Connect Your Calendar
          </h1>
          <p className="text-sm text-[--muted-foreground] max-w-xl mx-auto">
            Your executive assistant monitors your schedule to warn you about meeting overlaps, protect your daily focus time, and send you proactive email briefings.
          </p>
        </div>

        {(connectionError || eventsError) && (
          <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {connectionError || eventsError}
            {reconnectRequired && (
              <button
                type="button"
                onClick={() => handleConnect(selectedProvider)}
                disabled={isConnecting}
                className="ml-3 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-amber-100 disabled:opacity-50"
              >
                Reconnect {selectedProvider === 'outlook' ? 'Outlook' : 'Google'}
              </button>
            )}
          </div>
        )}

        {/* Provider Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.keys(providerDetails) as ProviderId[]).map((pid) => {
            const p = providerDetails[pid];
            const isSelected = selectedProvider === pid;
            return (
              <div
                key={pid}
                onClick={() => setSelectedProvider(pid)}
                className={`relative bg-white rounded-2xl border p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
                  isSelected
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm'
                    : 'border-[--border] hover:border-gray-300'
                }`}
              >
                {/* Radio indicator */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[--background] border border-[--border] flex items-center justify-center">
                    {p.icon}
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-[--border] bg-white'
                    }`}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[--foreground]">{p.name}</h3>
                  </div>
                  <span className="inline-block text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    {p.tag}
                  </span>
                  <p className="text-xs text-[--muted-foreground] leading-relaxed pt-1">
                    {p.desc}
                  </p>
                </div>

                <div className="text-[11px] font-medium text-emerald-600 flex items-center gap-1.5 pt-2 border-t border-[--border]">
                  <ShieldCheck size={13} />
                  <span>Encrypted OAuth 2.0</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Assistant Capabilities & Permissions Box */}
        <div className="bg-white rounded-2xl border border-[--border] p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-600" />
            <h3 className="text-sm font-bold text-[--foreground]">
              AI Assistant Schedule Guardrails
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={autoConflictWarn}
                onChange={(e) => setAutoConflictWarn(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <div>
                <p className="text-xs font-semibold text-[--foreground] group-hover:text-indigo-600 transition-colors">
                  Proactive Schedule Conflict Alerts
                </p>
                <p className="text-[11px] text-[--muted-foreground]">
                  Assistant will automatically flag meeting overlaps and suggest rescheduling solutions via text.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={sendSmsBriefings}
                onChange={(e) => setSendSmsBriefings(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <div>
                <p className="text-xs font-semibold text-[--foreground] group-hover:text-indigo-600 transition-colors">
                  15-Minute Pre-Meeting Email Briefings
                </p>
                <p className="text-[11px] text-[--muted-foreground]">
                  Receive attendee bios, related email threads, and task status right before each call starts.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={protectFocusBlocks}
                onChange={(e) => setProtectFocusBlocks(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <div>
                <p className="text-xs font-semibold text-[--foreground] group-hover:text-indigo-600 transition-colors">
                  Daily Deep Work & Focus Block Protection
                </p>
                <p className="text-[11px] text-[--muted-foreground]">
                  Automatically guards a 2-hour daily window to complete high-confidence AI scored tasks.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-[--muted-foreground]">
            <Lock size={13} />
            <span>Read-only calendar access until you authorize assistant scheduling.</span>
          </div>

          <button
            onClick={() => handleConnect()}
            disabled={isConnecting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md shadow-indigo-200 disabled:opacity-50 cursor-pointer"
          >
            {isConnecting ? (
              <span className="flex items-center gap-2">
                <RefreshCw size={14} className="animate-spin" />
                Connecting to {providerDetails[selectedProvider].name}...
              </span>
            ) : (
              <>
                <span>Connect with {providerDetails[selectedProvider].name}</span>
                <ExternalLink size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE 2: CONNECTED CALENDAR & LIVE EXECUTIVE AGENDA VIEW
  // -------------------------------------------------------------
  const activeProvider = providerDetails[selectedProvider];
  const todayEvents = events.filter((event) => new Date(event.startAt).toDateString() === new Date().toDateString());
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const visibleEvents = events
    .filter((event) => {
      const eventDate = new Date(event.startAt);
      if (viewMode === 'day') return eventDate.toDateString() === now.toDateString();
      return eventDate >= weekStart && eventDate < weekEnd;
    })
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  const todayMeetings = todayEvents.filter((event) => event.type !== 'focus');
  const meetingHours = todayMeetings.reduce((total, event) => total + Math.max(0, (new Date(event.endAt).getTime() - new Date(event.startAt).getTime()) / 3600000), 0);
  const focusHours = todayEvents.filter((event) => event.type === 'focus').reduce((total, event) => total + Math.max(0, (new Date(event.endAt).getTime() - new Date(event.startAt).getTime()) / 3600000), 0);
  const conflictsToday = todayEvents.filter((event) => event.hasConflict).length;

  return (
    <div className="space-y-5">
      {/* Top Banner: Connection Status Bar */}
      <div className="bg-white rounded-2xl border border-[--border] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[--background] border border-[--border] flex items-center justify-center shrink-0">
            {activeProvider.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <h2 className="text-sm font-bold text-[--foreground]">
                Connected to {activeProvider.name}
              </h2>
            </div>
            <p className="text-xs text-[--muted-foreground]">
              Connected account: <span className="font-medium text-[--foreground]">{connectedEmail || 'provider account'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncCalendar}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[--border] bg-white hover:bg-gray-50 text-xs font-semibold text-[--foreground] shadow-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={isSyncing ? "animate-spin text-indigo-600" : "text-gray-500"} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Calendar'}</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl gradient-brand text-white text-xs font-semibold hover:opacity-90 shadow-sm transition-opacity"
          >
            <Plus size={13} /> Add Event
          </button>
          <button
            onClick={handleDisconnect}
            className="px-3 py-1.5 rounded-xl border border-[--border] bg-white hover:bg-gray-50 text-xs font-medium text-[--muted-foreground] hover:text-rose-600 transition-colors"
          >
            Disconnect
          </button>
        </div>
      </div>

      {(connectionError || eventsError) && (
        <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {connectionError || eventsError}
          {reconnectRequired && (
            <button
              type="button"
              onClick={() => handleConnect(selectedProvider)}
              disabled={isConnecting}
              className="ml-3 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-amber-100 disabled:opacity-50"
            >
              Reconnect {selectedProvider === 'outlook' ? 'Outlook' : 'Google'}
            </button>
          )}
        </div>
      )}

      {/* Main Schedule View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Interactive Agenda Timeline (Spans 2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[--border] p-5 shadow-xs space-y-4">
          {/* Header Controls */}
          <div className="flex items-center justify-between border-b border-[--border] pb-3">
            <div>
              <h2 className="text-base font-bold text-[--foreground] flex items-center gap-2">
                <CalendarIcon size={16} className="text-indigo-600" />
                Today&apos;s Executive Agenda
              </h2>
              <p className="text-xs text-[--muted-foreground]">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[--background] p-1 rounded-xl border border-[--border] text-xs">
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    viewMode === 'day' ? 'bg-white text-indigo-600 shadow-xs border border-[--border]' : 'text-[--muted-foreground]'
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    viewMode === 'week' ? 'bg-white text-indigo-600 shadow-xs border border-[--border]' : 'text-[--muted-foreground]'
                  }`}
                >
                  Week
                </button>
              </div>
            </div>
          </div>

          {/* Event Timeline */}
          <div className="space-y-3">
            {visibleEvents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[--border] p-10 text-center flex flex-col items-center justify-center gap-3 bg-[--background]">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <CalendarIcon size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[--foreground]">
                    {isConnected ? `No events found for this ${viewMode}` : 'No calendar connected'}
                  </h3>
                  <p className="text-xs text-[--muted-foreground] max-w-sm mt-1">
                    {isConnected
                      ? 'Your connected calendar has no events in this view. Try another view or sync again.'
                      : 'Connect your Google or Microsoft Outlook account to sync live meetings and events.'}
                  </p>
                </div>
                {isConnected ? (
                  <button
                    onClick={handleSyncCalendar}
                    disabled={isSyncing}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
                    {isSyncing ? 'Syncing...' : 'Sync Events Now'}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleConnect('google')}
                      disabled={isConnecting}
                      className="px-3.5 py-2 rounded-xl bg-white border border-[--border] text-xs font-semibold text-[--foreground] hover:border-indigo-400 hover:text-indigo-600 transition-all cursor-pointer disabled:opacity-50"
                    >
                      Connect Google
                    </button>
                    <button
                      onClick={() => handleConnect('outlook')}
                      disabled={isConnecting}
                      className="px-3.5 py-2 rounded-xl bg-white border border-[--border] text-xs font-semibold text-[--foreground] hover:border-indigo-400 hover:text-indigo-600 transition-all cursor-pointer disabled:opacity-50"
                    >
                      Connect Outlook
                    </button>
                  </div>
                )}
              </div>
            ) : (
              visibleEvents.map((evt) => {
                const isFocus = evt.type === 'focus';
                return (
                  <div
                    key={evt.id}
                    className={`rounded-2xl border p-4 transition-all duration-150 flex flex-col gap-2.5 ${
                      isFocus
                        ? 'bg-gradient-to-r from-indigo-50/70 to-violet-50/70 border-indigo-200'
                        : 'bg-[--background] border-[--border] hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold text-indigo-600">
                            {evt.startTime} – {evt.endTime}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              isFocus
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-[--muted-foreground] border border-[--border]'
                            }`}
                          >
                            {evt.type}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-[--foreground] leading-snug">
                          {evt.title}
                        </h3>
                      </div>

                      {evt.location && (
                        <span className="text-xs text-[--muted-foreground] flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-[--border]">
                          <Video size={12} className="text-indigo-500" />
                          {evt.location}
                        </span>
                      )}
                    </div>

                    {/* Attendees */}
                    {evt.attendees && evt.attendees.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-[--muted-foreground]">
                        <span className="font-medium text-[--foreground]">Attendees:</span>
                        <span>{evt.attendees.join(', ')}</span>
                      </div>
                    )}

                    {/* AI Assistant Insight / Briefing */}
                    {evt.assistantBrief && (
                      <div className="flex items-start gap-2 bg-white/90 rounded-xl p-2.5 border border-indigo-100 text-xs text-indigo-950">
                        <Sparkles size={13} className="text-indigo-600 mt-0.5 shrink-0" />
                        <p className="leading-relaxed">{evt.assistantBrief}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Assistant Smart Schedule Sidebar */}
        <div className="space-y-4">
          {/* Daily Schedule Health Card */}
          <div className="bg-white rounded-2xl border border-[--border] p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[--foreground] flex items-center gap-2">
                <ShieldCheck size={16} className={conflictsToday ? 'text-amber-600' : 'text-emerald-600'} />
                Today&apos;s Schedule
              </h3>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${conflictsToday ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                {conflictsToday ? `${conflictsToday} conflict${conflictsToday === 1 ? '' : 's'}` : 'Live calendar data'}
              </span>
            </div>
            <p className="text-xs text-[--muted-foreground] leading-relaxed">
              Showing counts from events returned by your connected calendar for today.
            </p>
            <div className="pt-2 border-t border-[--border] space-y-2 text-xs">
              <div className="flex justify-between text-[--muted-foreground]">
                <span>Total Meetings Today:</span>
                <span className="font-semibold text-[--foreground]">{todayMeetings.length} ({meetingHours.toFixed(1)} hrs)</span>
              </div>
              <div className="flex justify-between text-[--muted-foreground]">
                <span>Focus / Deep Work:</span>
                <span className="font-semibold text-indigo-600">{focusHours.toFixed(1)} hrs</span>
              </div>
              <div className="text-[--muted-foreground]">{todayEvents.length} event{todayEvents.length === 1 ? '' : 's'} scheduled today</div>
            </div>
          </div>

          {/* Quick Assistant Schedule Directive */}
          <div className="bg-gradient-to-br from-indigo-50/80 to-violet-50/80 rounded-2xl border border-indigo-100 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Bot size={14} />
              </div>
              <h4 className="text-xs font-bold text-[--foreground] uppercase tracking-wide">
                Schedule Directives
              </h4>
            </div>
            <p className="text-xs text-[--foreground] leading-relaxed">
              These are examples of requests you can write in the assistant stream. No schedule changes happen automatically.
            </p>
            <div className="space-y-2">
              {[
                '📅 Protect 1 more hour of focus time',
                '✉️ Send email update to meeting attendees',
                '⚡ Clear my afternoon for project deadline',
              ].map((chip) => (
                <p
                  key={chip}
                  className="w-full text-left text-xs font-medium px-3 py-2 rounded-xl bg-white text-[--muted-foreground] border border-indigo-100"
                >
                  {chip}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      <ModalPanel isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <form onSubmit={handleAddEvent} className="space-y-4">
          <div className="border-b border-[--border] pb-3">
            <h2 className="text-lg font-bold text-[--foreground]">Schedule New Event / Focus Block</h2>
            <p className="text-xs text-[--muted-foreground]">Assistant will sync this with {activeProvider.name}</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[--foreground] uppercase tracking-wide mb-1">
                Event Title
              </label>
              <input
                type="text"
                required
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="e.g. Client Design Review or Focus Block..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[--foreground] uppercase tracking-wide mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[--foreground] uppercase tracking-wide mb-1">
                  Type
                </label>
                <select
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="meeting">📅 Meeting / Call</option>
                  <option value="focus">🛡️ Focus / Deep Work</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[--border]">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-xs font-medium text-[--muted-foreground] hover:text-[--foreground] rounded-xl hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newEventTitle.trim()}
              className="px-5 py-2 text-xs font-semibold gradient-brand text-white rounded-xl hover:opacity-90 disabled:opacity-50"
            >
              Add to Schedule
            </button>
          </div>
        </form>
      </ModalPanel>
    </div>
  );
}
