export async function fetchCalendarConnectionAPI(): Promise<Record<string, any>> {
  try {
    const res = await fetch('/api/calendar/connection/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(`Calendar connection request failed (${res.status})`);
    }

    const data = await res.json();
    const connection = data.connection ?? data ?? {};
    return {
      ...connection,
      isConnected: connection.isConnected ?? connection.is_connected ?? false,
      connectedAt: connection.connectedAt ?? connection.connected_at ?? null,
    };
  } catch (error) {
    console.warn('Failed to fetch calendar connection from backend', error);
    throw error;
  }
}

export async function connectCalendarProviderAPI(provider: string): Promise<any> {
  try {
    const res = await fetch('/api/calendar/connect/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ provider }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.details || body.detail || body.message || `Calendar connection failed (${res.status})`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('Failed to start calendar OAuth flow', error);
    throw error;
  }
}

export async function disconnectCalendarProviderAPI(provider: string): Promise<any> {
  try {
    const res = await fetch('/api/calendar/disconnect/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ provider }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.details || body.detail || body.message || `Calendar disconnect failed (${res.status})`);
    }

    return await res.json();
  } catch (error) {
    console.warn('Failed to disconnect calendar provider', error);
    throw error;
  }
}

export async function saveCalendarConnectionAPI(payload: Record<string, any>): Promise<any> {
  try {
    const res = await fetch('/api/calendar/connection/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.details || body.detail || body.message || `Calendar update failed (${res.status})`);
    }

    return await res.json();
  } catch (error) {
    console.warn('Failed to save calendar connection to backend', error);
    throw error;
  }
}

export async function fetchCalendarEventsAPI(): Promise<any[]> {
  try {
    const res = await fetch('/api/calendar/events/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(`Calendar events request failed (${res.status})`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : Array.isArray(data.events) ? data.events : [];
  } catch (error) {
    console.warn('Failed to fetch calendar events from backend', error);
    throw error;
  }
}

export async function saveCalendarEventAPI(payload: Record<string, any>): Promise<any> {
  try {
    const res = await fetch('/api/calendar/events/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.detail || body.message || `Calendar event create failed (${res.status})`);
    }

    return await res.json();
  } catch (error) {
    console.warn('Failed to create calendar event on backend', error);
    throw error;
  }
}

export async function syncCalendarEventsAPI(provider: string = 'google'): Promise<any> {
  try {
    const res = await fetch('/api/calendar/events/sync/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ provider }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.detail || body.message || `Calendar sync failed (${res.status})`);
    }

    return await res.json();
  } catch (error) {
    console.warn('Failed to sync calendar events from provider', error);
    throw error;
  }
}

