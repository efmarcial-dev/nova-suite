import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getDjangoApiUrl } from '@/app/lib/api/getDjangoApiUrl';

async function proxy(request: Request, method: 'GET' | 'POST') {
  const accessToken = (await cookies()).get('access')?.value;
  if (!accessToken) return NextResponse.json({ detail: 'Not authenticated.' }, { status: 401 });

  try {
    const body = method === 'POST' ? await request.json().catch(() => ({})) : undefined;
    const response = await fetch(getDjangoApiUrl('auth/chat/conversations/'), {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(method === 'POST' ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: 'no-store',
    });
    const payload = await response.json().catch(() => ({}));
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json({ detail: 'Chat service is unavailable.' }, { status: 502 });
  }
}

export async function GET(request: Request) {
  return proxy(request, 'GET');
}

export async function POST(request: Request) {
  return proxy(request, 'POST');
}
