export async function fetchSettingsAPI(): Promise<Record<string, any>> {
  try {
    const res = await fetch('/api/settings/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) {
      return {};
    }

    const data = await res.json();
    return data.settings ?? data ?? {};
  } catch (error) {
    console.warn('Failed to fetch settings from backend', error);
    return {};
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
      return {};
    }

    const data = await res.json();
    return data.providers ?? data ?? {};
  } catch (error) {
    console.warn('Failed to fetch email providers from backend', error);
    return {};
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
      return null;
    }

    return await res.json();
  } catch (error) {
    console.warn('Failed to start email OAuth flow', error);
    return null;
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
      return null;
    }

    return await res.json();
  } catch (error) {
    console.warn('Failed to disconnect email provider', error);
    return null;
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
      return null;
    }

    return await res.json();
  } catch (error) {
    console.warn('Failed to save settings to backend', error);
    return null;
  }
}
