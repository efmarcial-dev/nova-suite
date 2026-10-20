import { ProviderReconnectRequiredError, throwProviderApiError } from './providerErrors';

export interface EmailProviderStatus {
  provider: 'gmail' | 'outlook';
  email: string;
  is_connected: boolean;
  connected_at: string | null;
}

export interface EmailMessageItem {
  id: string;
  thread_id?: string | null;
  channel: 'email';
  direction: 'inbound' | 'outbound';
  sender: string;
  recipient: string;
  subject: string;
  content: string;
  snippet?: string;
  timestamp: string;
  status: 'read' | 'unread' | 'delivered';
}

export async function fetchEmailProvidersAPI(): Promise<EmailProviderStatus[]> {
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
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.providers)) return data.providers;
    return [];
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
      body: JSON.stringify({ provider, ...(email ? { email } : {}) }),
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
      return null;
    }

    return await res.json();
  } catch (error) {
    console.warn('Failed to disconnect email provider', error);
    return null;
  }
}

export async function fetchEmailMessagesAPI(
  provider: string = 'gmail',
  query: string = '',
  maxResults: number = 25
): Promise<EmailMessageItem[]> {
  try {
    const params = new URLSearchParams({
      provider,
      q: query,
      max_results: String(maxResults),
    });

    const res = await fetch(`/api/email/messages/?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) {
      await throwProviderApiError(res, `Email messages request failed (${res.status})`);
    }

    const data = await res.json();
    return Array.isArray(data.messages) ? data.messages : [];
  } catch (error) {
    console.warn('Failed to fetch live email messages', error);
    throw error;
  }
}

export async function sendEmailMessageAPI(payload: {
  recipient: string;
  subject: string;
  content: string;
  provider?: string;
}): Promise<any> {
  try {
    const res = await fetch('/api/email/messages/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!res.ok) await throwProviderApiError(res, `Email send failed (${res.status})`);

    return await res.json();
  } catch (error) {
    console.warn('Failed to send email message', error);
    if (error instanceof ProviderReconnectRequiredError) throw error;
    return null;
  }
}
