export async function fetchSettingsAPI(): Promise<Record<string, any>> {
  try {
    const res = await fetch('/api/settings/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(`Settings request failed (${res.status})`);
    }

    const data = await res.json();
    return data.settings ?? data ?? {};
  } catch (error) {
    console.warn('Failed to fetch settings from backend', error);
    throw error;
  }
}

export async function fetchEmailProvidersAPI(): Promise<Record<string, any>> {
  try {
    const res = await fetch('/api/email/providers/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(`Email provider request failed (${res.status})`);
    }

    const data = await res.json();
    return data.providers ?? data ?? {};
  } catch (error) {
    console.warn('Failed to fetch email providers from backend', error);
    throw error;
  }
}

export async function connectEmailProviderAPI(provider: string, email?: string): Promise<any> {
  try {
    const res = await fetch('/api/email/providers/connect/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ provider, email }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.details || body.detail || body.message || `Email connection failed (${res.status})`);
    }

    return await res.json();
  } catch (error) {
    console.warn('Failed to start email OAuth flow', error);
    throw error;
  }
}

export async function disconnectEmailProviderAPI(provider: string): Promise<any> {
  try {
    const res = await fetch('/api/email/providers/disconnect/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ provider }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.details || body.detail || body.message || `Email disconnect failed (${res.status})`);
    }

    return await res.json();
  } catch (error) {
    console.warn('Failed to disconnect email provider', error);
    throw error;
  }
}

export async function saveSettingsAPI(payload: Record<string, any>): Promise<any> {
  try {
    const res = await fetch('/api/settings/', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.details || body.detail || body.message || `Settings save failed (${res.status})`);
    }

    return await res.json();
  } catch (error) {
    console.warn('Failed to save settings to backend', error);
    throw error;
  }
}
