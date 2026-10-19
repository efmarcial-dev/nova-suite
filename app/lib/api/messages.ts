export async function fetchMessagesAPI(): Promise<any[]> {
  try {
    const res = await fetch('/api/messages/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : data.messages ?? [];
  } catch (error) {
    console.warn('Failed to fetch messages from backend', error);
    return [];
  }
}

export async function createMessageAPI(payload: Record<string, any>): Promise<any> {
  try {
    const res = await fetch('/api/messages/', {
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
    console.warn('Failed to save message to backend', error);
    return null;
  }
}
