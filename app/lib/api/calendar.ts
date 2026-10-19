export async function fetchCalendarConnectionAPI(): Promise<Record<string, any>> {
  try {
    const res = await fetch('/api/calendar/connection/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) {
      return { isConnected: false };
    }

    const data = await res.json();
    return data.connection ?? data ?? { isConnected: false };
  } catch (error) {
    console.warn('Failed to fetch calendar connection from backend', error);
    return { isConnected: false };
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
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('Failed to start calendar OAuth flow', error);
    return null;
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
      return null;
    }

    return await res.json();
  } catch (error) {
    console.warn('Failed to disconnect calendar provider', error);
    return null;
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
      return null;
    }

    return await res.json();
  } catch (error) {
    console.warn('Failed to save calendar connection to backend', error);
    return null;
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
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : data.events ?? [];
  } catch (error) {
    console.warn('Failed to fetch calendar events from backend', error);
    return [];
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
      return null;
    }

    return await res.json();
  } catch (error) {
    console.warn('Failed to create calendar event on backend', error);
    return null;
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
      return null;
    }

    return await res.json();
  } catch (error) {
    console.warn('Failed to sync calendar events from provider', error);
    return null;
  }
}

