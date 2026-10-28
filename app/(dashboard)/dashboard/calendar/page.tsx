'use client';

import { useState, useEffect, useRef } from 'react';
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
  Bot,
  AlertTriangle,
  Globe,
} from 'lucide-react';
import { useCachedUser } from '@/app/hooks/useCachedUser';
import ModalPanel from '@/app/components/ModalPanel';
import {
  fetchCalendarConnectionAPI,
  fetchCalendarEventsAPI,
  connectCalendarProviderAPI,
  disconnectCalendarProviderAPI,
  saveCalendarEventAPI,
  createNylasCalendarEventAPI,
  syncCalendarEventsAPI,
} from '@/app/lib/api/calendar';
import {
  fetchNylasGrantsAPI,
  startNylasConnectAPI,
  disconnectNylasGrantAPI,
  NylasGrant,
} from '@/app/lib/api/nylas';
import { ProviderReconnectRequiredError } from '@/app/lib/api/providerErrors';

type ProviderId = 'google' | 'outlook' | 'other' | 'nylas';

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
  priorityScore?: number;
  priorityExplanation?: string;
  hasConflict?: boolean;
  startAt: string;
  endAt: string;
  provider?: string;
  accountEmail?: string;
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
    priorityScore: typeof evt.priorityScore === 'number' ? evt.priorityScore : undefined,
    priorityExplanation: evt.priorityExplanation || undefined,
    startAt: safeStart.toISOString(),
    endAt: safeEnd.toISOString(),
    provider: evt.provider || evt.sync_provider || '',
    accountEmail: evt.account_email || evt.accountEmail || '',
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

  // Nylas Multi-Account State
  const [nylasGrants, setNylasGrants] = useState<NylasGrant[]>([]);
  const [selectedGrantId, setSelectedGrantId] = useState<string>('all');
  const [targetAddEventGrantId, setTargetAddEventGrantId] = useState<string>('');
  
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
  const [newEventDate, setNewEventDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
  const [newEventTime, setNewEventTime] = useState('11:00');
  const [newEventType, setNewEventType] = useState<'meeting' | 'focus'>('meeting');
  const [isSavingEvent, setIsSavingEvent] = useState(false);
  const [eventConflicts, setEventConflicts] = useState<CalendarEvent[]>([]);
  const [createdEventNotice, setCreatedEventNotice] = useState('');
  const [agendaDate, setAgendaDate] = useState(() => new Date());
  const calendarSyncInFlight = useRef(false);

  // Load connection state from backend and sync real events
  useEffect(() => {
    const hydrateCalendar = async () => {
      // Check query params if redirected from OAuth
      let isSuccessRedirect = false;
      let paramProvider: ProviderId | null = null;
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (
          params.get('nylas') === 'connected' ||
          params.get('connected') === 'calendar' ||
          params.get('connected') === 'nylas'
        ) {
          isSuccessRedirect = true;
          const prov = params.get('provider');
          if (prov === 'outlook' || prov === 'microsoft') paramProvider = 'outlook';
          else if (prov === 'google') paramProvider = 'google';
        }
      }

      let grants: NylasGrant[] = [];
      try {
        grants = await fetchNylasGrantsAPI();
        const activeGrants = grants.filter((g) => g.is_connected !== false && g.scope?.includes('calendar'));
        setNylasGrants(activeGrants);
        if (activeGrants.length === 1 && !targetAddEventGrantId) {
          setTargetAddEventGrantId(activeGrants[0].grant_id);
        }
      } catch (e) {
        console.warn('Could not load Nylas grants:', e);
      }

      let connection: Record<string, any> = {};
      try {
        connection = await fetchCalendarConnectionAPI();
        setConnectionError('');
      } catch {
        setConnectionError('Could not load calendar connection status. Please refresh or try again.');
      }

      const activeGrants = grants.filter((g) => g.is_connected !== false && g.scope?.includes('calendar'));
      const isConnectedProvider = Boolean(connection?.isConnected) || activeGrants.length > 0;

      if (isConnectedProvider) {
        setIsConnected(true);
        if (isSuccessRedirect) {
          setCreatedEventNotice('Calendar accounts synced successfully via Nylas v3!');
        }

        if (activeGrants.length > 0) {
          setSelectedProvider('nylas');
          setConnectedEmail(activeGrants.map((g) => g.email).join(', '));
          if (!calendarSyncInFlight.current) {
            calendarSyncInFlight.current = true;
            setIsSyncing(true);
            try {
              await syncCalendarEventsAPI('nylas');
              setReconnectRequired(false);
            } catch (e) {
              console.warn('Nylas initial calendar sync skipped:', e);
              setReconnectRequired(e instanceof ProviderReconnectRequiredError);
              setEventsError(e instanceof Error ? e.message : 'Calendar sync failed.');
            } finally {
              calendarSyncInFlight.current = false;
              setIsSyncing(false);
            }
          }
        } else {
          const activeProv: ProviderId = connection?.provider === 'outlook' ? 'outlook' : (paramProvider || 'google');
          setSelectedProvider(activeProv);
          setConnectedEmail(connection?.email || (currentUser?.email ?? ''));

          try {
            await syncCalendarEventsAPI(activeProv);
            setReconnectRequired(false);
          } catch (e) {
            console.warn('Initial calendar sync skipped:', e);
            setReconnectRequired(e instanceof ProviderReconnectRequiredError);
            setEventsError(e instanceof Error ? e.message : 'Calendar sync failed.');
          }
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

  const handleSyncCalendar = async (grantIdOverride?: string) => {
    if (calendarSyncInFlight.current) return;
    calendarSyncInFlight.current = true;
    setIsSyncing(true);
    try {
      setEventsError('');
      const providerToSync = nylasGrants.length > 0 ? 'nylas' : selectedProvider;
      const activeGrantSelection = grantIdOverride ?? selectedGrantId;
      const grantIdToSync = activeGrantSelection !== 'all' ? activeGrantSelection : undefined;
      await syncCalendarEventsAPI(providerToSync, undefined, undefined, grantIdToSync);
      setReconnectRequired(false);
      const backendEvents = await fetchCalendarEventsAPI();
      if (Array.isArray(backendEvents)) {
        const selectedAccount = nylasGrants.find((grant) => grant.grant_id === activeGrantSelection);
        const visibleEvents = selectedAccount
          ? backendEvents.filter((event: any) => event.account_email === selectedAccount.email)
          : backendEvents;
        setEvents(visibleEvents.map(mapBackendEvent));
      }
    } catch (err) {
      console.error('Failed to sync calendar events from provider', err);
      setReconnectRequired(err instanceof ProviderReconnectRequiredError);
      setEventsError(err instanceof Error ? err.message : 'Calendar sync failed.');
    } finally {
      calendarSyncInFlight.current = false;
      setIsSyncing(false);
    }
  };

  const handleConnect = async (targetProvider?: ProviderId) => {
    setIsConnecting(true);
    setReconnectRequired(false);
    const target = targetProvider || selectedProvider;
    setSelectedProvider(target);

    try {
      // Primary: Nylas Hosted OAuth
      try {
        const nylasProv = target === 'outlook' ? 'microsoft' : target === 'other' ? undefined : 'google';
        const authUrl = await startNylasConnectAPI({
          provider: nylasProv,
          product: 'calendar',
          origin: 'calendar',
        });
        if (authUrl) {
          window.location.href = authUrl;
          return;
        }
      } catch (nylasErr) {
        console.warn('Nylas calendar connect error, attempting direct provider OAuth:', nylasErr);
      }

      // Fallback: Legacy provider OAuth
      if (target === 'google' || target === 'outlook') {
        const result = await connectCalendarProviderAPI(target);
        const authUrl = result?.authorization_url || result?.auth_url || result?.authorizationUrl || result?.url;
        if (authUrl) {
          window.location.href = authUrl;
          return;
        }
      }
      throw new Error('The backend did not return an authorization URL.');
    } catch (e) {
      console.error('Failed to initiate calendar connection', e);
      setConnectionError(e instanceof Error ? e.message : 'Could not start calendar authorization.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (grantIdToRemove?: string) => {
    try {
      if (nylasGrants.length > 0) {
        const targetGrantId = grantIdToRemove || (selectedGrantId !== 'all' ? selectedGrantId : nylasGrants[0]?.grant_id);
        if (targetGrantId) {
          await disconnectNylasGrantAPI(targetGrantId);
          const remaining = nylasGrants.filter((g) => g.grant_id !== targetGrantId);
          setNylasGrants(remaining);
          if (remaining.length === 0) {
            setIsConnected(false);
            setConnectedEmail('');
            setEvents([]);
          } else {
            setSelectedGrantId('all');
            setConnectedEmail(remaining.map((g) => g.email).join(', '));
            const backendEvents = await fetchCalendarEventsAPI();
            setEvents(backendEvents.map(mapBackendEvent));
          }
        }
      } else {
        await disconnectCalendarProviderAPI(selectedProvider === 'outlook' ? 'outlook' : 'google');
        setIsConnected(false);
        setConnectedEmail('');
        setEvents([]);
      }
      setConnectionError('');
    } catch (e) {
      console.error('Failed to disconnect calendar connection', e);
      setConnectionError(e instanceof Error ? e.message : 'Could not disconnect calendar.');
    }
  };

  const handleAddEvent = async (e?: React.FormEvent, allowConflicts = false) => {
    e?.preventDefault();
    if (!newEventTitle.trim() || !newEventDate || !newEventTime || isSavingEvent) return;

    const [year, month, day] = newEventDate.split('-').map(Number);
    const [hours, mins] = newEventTime.split(':').map(Number);
    const localStart = new Date(year, month - 1, day, hours, mins, 0, 0);
    if (Number.isNaN(localStart.getTime())) {
      setEventsError('Choose a valid event date and time.');
      return;
    }
    const startIso = localStart.toISOString();
    const endIso = new Date(localStart.getTime() + 60 * 60 * 1000).toISOString();

    setIsSavingEvent(true);
    try {
      setEventsError('');
      setEventConflicts([]);
      setCreatedEventNotice('');

      const syncProv = nylasGrants.length > 0 ? 'nylas' : (isConnected ? selectedProvider : undefined);
      const grantIdToUse = targetAddEventGrantId || (selectedGrantId !== 'all' ? selectedGrantId : undefined);
      if (nylasGrants.length > 1 && !grantIdToUse) {
        setEventsError('Choose which connected account should receive this event.');
        return;
      }

      if (isConnected && autoConflictWarn && !allowConflicts) {
        const syncResult = await syncCalendarEventsAPI(syncProv || selectedProvider, startIso, endIso, grantIdToUse);
        const syncedEvents = Array.isArray(syncResult?.events)
          ? syncResult.events
          : await fetchCalendarEventsAPI();
        const conflicts = syncedEvents.filter((event: any) => {
          const existingStart = new Date(event.start_time || event.start || event.startTime).getTime();
          const existingEnd = new Date(event.end_time || event.end || event.endTime).getTime();
          return Number.isFinite(existingStart) && Number.isFinite(existingEnd)
            && existingStart < new Date(endIso).getTime()
            && existingEnd > new Date(startIso).getTime();
        }).map(mapBackendEvent);

        if (conflicts.length > 0) {
          setEventConflicts(conflicts);
          return;
        }
      }

      const eventPayload = {
        title: newEventTitle.trim(),
        start_time: startIso,
        end_time: endIso,
        event_type: newEventType,
        ...(grantIdToUse ? { grant_id: grantIdToUse } : {}),
      };
      const savedEvent = syncProv === 'nylas'
        ? await createNylasCalendarEventAPI(eventPayload)
        : await saveCalendarEventAPI({ ...eventPayload, ...(syncProv ? { sync_provider: syncProv } : {}) });

      if (savedEvent) {
        const saved = mapBackendEvent(savedEvent);
        setAgendaDate(localStart);
        setViewMode('day');
        setEvents((prev) => [...prev.filter((event) => event.id !== saved.id), saved]);
        setCreatedEventNotice(`“${saved.title}” was added${isConnected ? ` to your calendar` : ''}.`);
        setEventConflicts([]);
        setShowAddModal(false);
        setNewEventTitle('');

        if (isConnected) {
          try {
            await syncCalendarEventsAPI(syncProv || selectedProvider, startIso, endIso, grantIdToUse);
            const backendEvents = await fetchCalendarEventsAPI();
            setEvents(backendEvents.map(mapBackendEvent));
          } catch (syncError) {
            console.warn('Event was saved but the calendar refresh did not finish:', syncError);
            setEventsError('Event was created, but the calendar could not refresh. Use Sync Calendar to reload it.');
          }
        } else {
          const backendEvents = await fetchCalendarEventsAPI();
          setEvents(backendEvents.map(mapBackendEvent));
        }
      } else {
        throw new Error('The backend did not save the calendar event.');
      }
    } catch (err) {
      console.error('Error saving event', err);
      setReconnectRequired(err instanceof ProviderReconnectRequiredError);
      setEventsError(err instanceof Error ? err.message : 'Could not save the calendar event.');
    } finally {
      setIsSavingEvent(false);
    }
  };

  const providerDetails: Record<ProviderId, { name: string; icon: React.ReactNode; tag: string; desc: string; color: string }> = {
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
    other: {
      name: 'Other Provider (iCloud / IMAP)',
      icon: (
        <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-gray-700 to-gray-900 flex items-center justify-center text-white">
          <CalendarIcon size={14} />
        </div>
      ),
      tag: 'Universal Sync',
      desc: 'Apple iCloud, CalDAV, Yahoo, and custom IMAP/calendar servers.',
      color: 'border-gray-200 bg-gray-50/40',
    },
    nylas: {
      name: 'Unified Executive Calendar',
      icon: (
        <div className="w-6 h-6 rounded-md bg-[#1EA0FF] flex items-center justify-center text-white font-bold text-xs">
          <Globe size={14} />
        </div>
      ),
      tag: 'Multi-Account Sync',
      desc: 'Unified multi-account calendar engine powered by Nylas v3.',
      color: 'border-blue-200 bg-blue-50/40',
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0F9FF] border border-[#BFE7FF] text-[#0088EE] text-xs font-semibold">
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
          {(['google', 'outlook', 'other'] as ProviderId[]).map((pid) => {
            const p = providerDetails[pid];
            if (!p) return null;
            const isSelected = selectedProvider === pid;
            return (
              <div
                key={pid}
                onClick={() => setSelectedProvider(pid)}
                className={`relative bg-white rounded-2xl border p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
                  isSelected
                    ? 'border-[#1EA0FF] ring-2 ring-[#1EA0FF]/20 shadow-sm'
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
                        ? 'bg-[#1EA0FF] border-[#1EA0FF] text-white'
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
                  <span className="inline-block text-[10px] font-semibold text-[#1EA0FF] bg-[#F0F9FF] px-2 py-0.5 rounded-full border border-[#BFE7FF]">
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
            <Sparkles size={16} className="text-[#1EA0FF]" />
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
                className="mt-0.5 w-4 h-4 rounded text-[#1EA0FF] focus:ring-[#1EA0FF] border-gray-300"
              />
              <div>
                <p className="text-xs font-semibold text-[--foreground] group-hover:text-[#1EA0FF] transition-colors">
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
                className="mt-0.5 w-4 h-4 rounded text-[#1EA0FF] focus:ring-[#1EA0FF] border-gray-300"
              />
              <div>
                <p className="text-xs font-semibold text-[--foreground] group-hover:text-[#1EA0FF] transition-colors">
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
                className="mt-0.5 w-4 h-4 rounded text-[#1EA0FF] focus:ring-[#1EA0FF] border-gray-300"
              />
              <div>
                <p className="text-xs font-semibold text-[--foreground] group-hover:text-[#1EA0FF] transition-colors">
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
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
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
  const activeProvider = providerDetails[selectedProvider] || providerDetails.nylas;
  const hasMultipleAccounts = nylasGrants.length > 1;
  const todayEvents = events.filter((event) => new Date(event.startAt).toDateString() === new Date().toDateString());
  const weekStart = new Date(agendaDate);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const visibleEvents = events
    .filter((event) => {
      const eventDate = new Date(event.startAt);
      if (viewMode === 'day') return eventDate.toDateString() === agendaDate.toDateString();
      return eventDate >= weekStart && eventDate < weekEnd;
    })
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  const todayMeetings = todayEvents.filter((event) => event.type !== 'focus');
  const meetingHours = todayMeetings.reduce((total, event) => total + Math.max(0, (new Date(event.endAt).getTime() - new Date(event.startAt).getTime()) / 3600000), 0);
  const focusHours = todayEvents.filter((event) => event.type === 'focus').reduce((total, event) => total + Math.max(0, (new Date(event.endAt).getTime() - new Date(event.startAt).getTime()) / 3600000), 0);
  const conflictsToday = todayEvents.filter((event) => event.hasConflict).length;
  const importantEvents = visibleEvents.filter((event) => (event.priorityScore ?? 0) >= 0.8);

  return (
    <div className="space-y-5">
      {/* Top Banner: Connection Status Bar */}
      <div className="bg-white rounded-2xl border border-[--border] p-4 flex flex-col gap-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[--background] border border-[--border] flex items-center justify-center shrink-0">
              {activeProvider.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <h2 className="text-sm font-bold text-[--foreground]">
                  {nylasGrants.length > 0
                    ? `Unified Calendar · ${nylasGrants.length} ${nylasGrants.length === 1 ? 'Account' : 'Accounts'} Synced`
                    : `Connected to ${activeProvider.name}`}
                </h2>
              </div>
              <p className="text-xs text-[--muted-foreground]">
                {nylasGrants.length > 0
                  ? nylasGrants.map((g) => g.email).join(' · ')
                  : <>Connected account: <span className="font-medium text-[--foreground]">{connectedEmail || 'provider account'}</span></>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Account filter dropdown for multi-account */}
            {hasMultipleAccounts && (
              <select
                value={selectedGrantId}
                onChange={(e) => {
                  const grantId = e.target.value;
                  setSelectedGrantId(grantId);
                  setTargetAddEventGrantId(grantId === 'all' ? nylasGrants[0]?.grant_id || '' : grantId);
                  void handleSyncCalendar(grantId);
                }}
                className="px-2.5 py-1.5 rounded-xl border border-[--border] bg-[--background] text-xs font-medium text-[--foreground] outline-none focus:ring-2 focus:ring-[#1EA0FF]"
              >
                <option value="all">🌐 All Accounts (Unified)</option>
                {nylasGrants.map((g) => (
                  <option key={g.grant_id} value={g.grant_id}>
                    {g.provider === 'google' ? '🔵' : g.provider === 'microsoft' ? '🟦' : '📧'} {g.email}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={() => void handleSyncCalendar()}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[--border] bg-white hover:bg-gray-50 text-xs font-semibold text-[--foreground] shadow-xs transition-colors disabled:opacity-50"
            >
              <RefreshCw size={13} className={isSyncing ? "animate-spin text-[#1EA0FF]" : "text-gray-500"} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Calendar'}</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl gradient-brand text-white text-xs font-semibold hover:opacity-90 shadow-sm transition-opacity"
            >
              <Plus size={13} /> Add Event
            </button>
            <button
              onClick={() => handleConnect('other')}
              disabled={isConnecting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[--border] bg-white hover:bg-gray-50 text-xs font-semibold text-[#1EA0FF] shadow-xs transition-colors disabled:opacity-50"
            >
              <Plus size={13} /> Add Account
            </button>
          </div>
        </div>

        {/* Nylas Multi-Account Badges */}
        {nylasGrants.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[--border]">
            {nylasGrants.map((g) => (
              <div
                key={g.grant_id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[--background] border border-[--border] text-xs"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className={`font-bold ${g.provider === 'google' ? 'text-blue-600' : g.provider === 'microsoft' ? 'text-sky-600' : 'text-gray-600'}`}>
                  {g.provider === 'google' ? 'G' : g.provider === 'microsoft' ? 'M' : '✉'}
                </span>
                <span className="font-medium text-[--foreground] truncate max-w-[140px]">{g.email}</span>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Active
                </span>
                <button
                  type="button"
                  onClick={() => void handleDisconnect(g.grant_id)}
                  className="text-[10px] text-[--muted-foreground] hover:text-rose-600 font-medium ml-1 transition-colors"
                  title={`Disconnect ${g.email}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
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
      {createdEventNotice && !eventsError && (
        <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <div className="flex items-center gap-2"><Check size={16} />{createdEventNotice}</div>
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
                <CalendarIcon size={16} className="text-[#1EA0FF]" />
                Executive Agenda
              </h2>
              <p className="text-xs text-[--muted-foreground]">
                {agendaDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[--background] p-1 rounded-xl border border-[--border] text-xs">
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    viewMode === 'day' ? 'bg-white text-[#1EA0FF] shadow-xs border border-[--border]' : 'text-[--muted-foreground]'
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    viewMode === 'week' ? 'bg-white text-[#1EA0FF] shadow-xs border border-[--border]' : 'text-[--muted-foreground]'
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
                <div className="w-12 h-12 rounded-2xl bg-[#F0F9FF] border border-[#BFE7FF] flex items-center justify-center text-[#1EA0FF]">
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
                    onClick={() => void handleSyncCalendar()}
                    disabled={isSyncing}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1EA0FF] hover:bg-[#0088EE] text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
                    {isSyncing ? 'Syncing...' : 'Sync Events Now'}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleConnect('google')}
                      disabled={isConnecting}
                      className="px-3.5 py-2 rounded-xl bg-white border border-[--border] text-xs font-semibold text-[--foreground] hover:border-[#1EA0FF] hover:text-[#1EA0FF] transition-all cursor-pointer disabled:opacity-50"
                    >
                      Connect Google
                    </button>
                    <button
                      onClick={() => handleConnect('outlook')}
                      disabled={isConnecting}
                      className="px-3.5 py-2 rounded-xl bg-white border border-[--border] text-xs font-semibold text-[--foreground] hover:border-[#1EA0FF] hover:text-[#1EA0FF] transition-all cursor-pointer disabled:opacity-50"
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
                        ? 'bg-gradient-to-r from-[#F0F9FF] to-violet-50/70 border-[#BFE7FF]'
                        : 'bg-[--background] border-[--border] hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold text-[#1EA0FF]">
                            {evt.startTime} – {evt.endTime}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              isFocus
                                ? 'bg-[#1EA0FF] text-white'
                                : 'bg-white text-[--muted-foreground] border border-[--border]'
                            }`}
                          >
                            {evt.type}
                          </span>
                          {typeof evt.priorityScore === 'number' && evt.priorityScore > 0 && (
                            <span
                              title={evt.priorityExplanation || 'Scored using your priority profile'}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                evt.priorityScore >= 0.8
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : evt.priorityScore >= 0.65
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-[#F0F9FF] text-[#0088EE] border-[#BFE7FF]'
                              }`}
                            >
                              {evt.priorityScore >= 0.8 ? 'Priority reminder' : 'Profile scored'} · {Math.round(evt.priorityScore * 100)}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-[--foreground] leading-snug">
                          {evt.title}
                        </h3>
                      </div>

                      {evt.location && (
                        <span className="text-xs text-[--muted-foreground] flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-[--border]">
                          <Video size={12} className="text-[#1EA0FF]" />
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
                      <div className="flex items-start gap-2 bg-white/90 rounded-xl p-2.5 border border-[#BFE7FF] text-xs text-[#0D1B2A]">
                        <Sparkles size={13} className="text-[#1EA0FF] mt-0.5 shrink-0" />
                        <p className="leading-relaxed">{evt.assistantBrief}</p>
                      </div>
                    )}
                    {evt.priorityExplanation && (
                      <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50/70 p-2.5 text-xs text-amber-950">
                        <Sparkles size={13} className="mt-0.5 shrink-0 text-amber-600" />
                        <p className="leading-relaxed">Priority reminder: {evt.priorityExplanation}</p>
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
          {importantEvents.length > 0 && (
            <div className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-orange-50 p-5 shadow-xs">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-rose-900">
                <AlertTriangle size={16} className="text-rose-600" />
                Important events
              </h3>
              <div className="space-y-2">
                {importantEvents.slice(0, 3).map((event) => (
                  <div key={`important-${event.id}`} className="rounded-xl border border-rose-100 bg-white/80 px-3 py-2">
                    <p className="text-xs font-semibold text-rose-950">{event.title}</p>
                    <p className="mt-0.5 text-[11px] text-rose-700">
                      {new Date(event.startAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {event.startTime}
                      {typeof event.priorityScore === 'number' ? ` · ${Math.round(event.priorityScore * 100)} priority` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                <span className="font-semibold text-[#1EA0FF]">{focusHours.toFixed(1)} hrs</span>
              </div>
              <div className="text-[--muted-foreground]">{todayEvents.length} event{todayEvents.length === 1 ? '' : 's'} scheduled today</div>
            </div>
          </div>

          {/* Quick Assistant Schedule Directive */}
          <div className="bg-gradient-to-br from-[#F0F9FF] to-violet-50/80 rounded-2xl border border-[#BFE7FF] p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#1EA0FF] text-white flex items-center justify-center">
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
                  className="w-full text-left text-xs font-medium px-3 py-2 rounded-xl bg-white text-[--muted-foreground] border border-[#BFE7FF]"
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
        <form onSubmit={(event) => void handleAddEvent(event)} className="space-y-4">
          <div className="border-b border-[--border] pb-3">
            <h2 className="text-lg font-bold text-[--foreground]">Schedule New Event / Focus Block</h2>
            <p className="text-xs text-[--muted-foreground]">
              {isConnected
                ? nylasGrants.length > 0
                  ? 'Choose a connected account. Nova will create the event through Nylas and sync it into this calendar.'
                  : `This event will be created in ${activeProvider.name}. We’ll check for overlaps first.`
                : 'Connect Google or Outlook to add this event to your provider calendar.'}
            </p>
          </div>

          <div className="space-y-3">
            {nylasGrants.length > 0 && (
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[--foreground]">Calendar account</label>
                <select
                  required
                  value={targetAddEventGrantId}
                  onChange={(event) => setTargetAddEventGrantId(event.target.value)}
                  className="w-full rounded-xl border border-[--border] bg-[--background] px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-[#1EA0FF]"
                >
                  <option value="">Choose a connected account…</option>
                  {nylasGrants.filter((grant) => grant.scope?.includes('calendar')).map((grant) => (
                    <option key={grant.grant_id} value={grant.grant_id}>{grant.email} · {grant.provider}</option>
                  ))}
                </select>
              </div>
            )}
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
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-[#1EA0FF]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[--foreground]">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="w-full rounded-xl border border-[--border] bg-[--background] px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-[#1EA0FF]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[--foreground] uppercase tracking-wide mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  required
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-[#1EA0FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[--foreground] uppercase tracking-wide mb-1">
                  Type
                </label>
                <select
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs bg-[--background] border border-[--border] rounded-xl outline-none focus:ring-2 focus:ring-[#1EA0FF]"
                >
                  <option value="meeting">📅 Meeting / Call</option>
                  <option value="focus">🛡️ Focus / Deep Work</option>
                </select>
              </div>
            </div>
          </div>

          {eventConflicts.length > 0 && (
            <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950">
              <div className="flex items-center gap-2 font-bold"><AlertTriangle size={14} />This time overlaps with your calendar</div>
              <ul className="mt-2 space-y-1">
                {eventConflicts.map((event) => (
                  <li key={`conflict-${event.id}`}>
                    {event.title} · {event.startTime}–{event.endTime}
                  </li>
                ))}
              </ul>
              <p className="mt-2">Choose another time, or add the event anyway.</p>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[--border]">
            <button
              type="button"
              onClick={() => { setShowAddModal(false); setEventConflicts([]); }}
              className="px-4 py-2 text-xs font-medium text-[--muted-foreground] hover:text-[--foreground] rounded-xl hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newEventTitle.trim() || isSavingEvent}
              className="px-5 py-2 text-xs font-semibold gradient-brand text-white rounded-xl hover:opacity-90 disabled:opacity-50"
            >
              {isSavingEvent ? 'Checking calendar…' : 'Add to Schedule'}
            </button>
            {eventConflicts.length > 0 && (
              <button
                type="button"
                disabled={isSavingEvent}
                onClick={() => void handleAddEvent(undefined, true)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200 disabled:opacity-50"
              >
                Add anyway
              </button>
            )}
          </div>
        </form>
      </ModalPanel>
    </div>
  );
}
