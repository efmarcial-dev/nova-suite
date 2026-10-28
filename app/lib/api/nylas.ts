export interface NylasGrant {
  id: number;
  grantId?: string;
  grant_id: string;
  email: string;
  provider: 'google' | 'microsoft' | 'icloud' | 'imap' | string;
  scope: string;
  is_connected: boolean;
  isConnected?: boolean;
  display_name: string;
  connected_at: string | null;
  connectedAt?: string | null;
}

export interface NylasStatus {
  total_connected: number;
  has_email: boolean;
  has_calendar: boolean;
  providers: string[];
  accounts: NylasGrant[];
}

export interface StartNylasConnectOptions {
  provider?: 'google' | 'microsoft' | 'icloud' | 'imap' | string;
  product?: 'all' | 'email' | 'calendar';
  origin?: 'settings' | 'onboarding' | 'calendar' | 'inbox' | 'assistant';
  login_hint?: string;
}

/**
 * Initiates Nylas Hosted Authentication by fetching the authorization URL from the backend.
 */
export async function startNylasConnectAPI(options: StartNylasConnectOptions = {}): Promise<string> {
  const res = await fetch('/api/nylas/connect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(options),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.message || `Failed to initiate connection (${res.status})`);
  }

  const data = await res.json();
  if (!data.authorization_url) {
    throw new Error('No authorization URL returned from backend.');
  }

  return data.authorization_url;
}

/**
 * Fetches all connected Nylas accounts for the authenticated user.
 */
export async function fetchNylasGrantsAPI(): Promise<NylasGrant[]> {
  try {
    const res = await fetch('/api/nylas/grants', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn('Failed to fetch Nylas grants', error);
    return [];
  }
}

/**
 * Fetches unified integration status summary.
 */
export async function fetchNylasStatusAPI(): Promise<NylasStatus> {
  try {
    const res = await fetch('/api/nylas/status', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) {
      return { total_connected: 0, has_email: false, has_calendar: false, providers: [], accounts: [] };
    }

    return await res.json();
  } catch (error) {
    console.warn('Failed to fetch Nylas status', error);
    return { total_connected: 0, has_email: false, has_calendar: false, providers: [], accounts: [] };
  }
}

/**
 * Disconnects a specific Nylas account grant.
 */
export async function disconnectNylasGrantAPI(grantId: string): Promise<boolean> {
  try {
    const res = await fetch('/api/nylas/disconnect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ grant_id: grantId }),
    });

    return res.ok;
  } catch (error) {
    console.warn('Failed to disconnect Nylas grant', error);
    return false;
  }
}
