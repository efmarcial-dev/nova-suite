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
  grant_id?: string;
  account_email?: string;
  provider?: string;
}

export interface EmailInsight {
  summary: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  priority_reason: string;
  suggested_action: string | null;
  action_items: Array<{ task: string; due_date: string | null }>;
  reply_draft: string | null;
  analyzed_at: string;
}

export interface EmailReplyDraft {
  reply_draft: string;
  rationale: string;
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
  provider: string = 'nylas',
  query: string = '',
  maxResults: number = 25,
  grantId?: string
): Promise<EmailMessageItem[]> {
  try {
    const params = new URLSearchParams({
      provider,
      q: query,
      max_results: String(maxResults),
    });
    if (grantId) {
      params.set('grant_id', grantId);
    }

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

export async function analyzeEmailMessagesAPI(
  provider: string,
  messages: EmailMessageItem[]
): Promise<Record<string, EmailInsight>> {
  const res = await fetch('/api/email/messages/analyze/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ provider, messages }),
  });

  if (!res.ok) {
    await throwProviderApiError(res, `Email analysis failed (${res.status})`);
  }

  const data = await res.json();
  return data.insights && typeof data.insights === 'object' ? data.insights : {};
}

export async function draftEmailReplyAPI(payload: {
  provider: string;
  instruction: string;
  email: Pick<EmailMessageItem, 'id' | 'subject' | 'sender' | 'content'>;
}): Promise<EmailReplyDraft> {
  const res = await fetch('/api/email/messages/draft-reply/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!res.ok) await throwProviderApiError(res, `Reply draft failed (${res.status})`);
  return res.json();
}

export async function sendEmailReplyAPI(payload: {
  provider: string;
  message_id: string;
  content: string;
}): Promise<any> {
  const res = await fetch('/api/email/messages/reply/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!res.ok) await throwProviderApiError(res, `Email reply failed (${res.status})`);
  return res.json();
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
