import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getDjangoApiUrl } from '@/app/lib/api/getDjangoApiUrl';

type RouteContext = { params: Promise<{ conversationId: string }> };

async function proxy(conversationId: string, method: 'GET' | 'DELETE') {
  const accessToken = (await cookies()).get('access')?.value;
  if (!accessToken) return NextResponse.json({ detail: 'Not authenticated.' }, { status: 401 });

  try {
    const response = await fetch(
      getDjangoApiUrl(`auth/chat/conversations/${encodeURIComponent(conversationId)}/`),
      {
        method,
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      },
    );
    const payload = await response.json().catch(() => ({}));
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json({ detail: 'Chat service is unavailable.' }, { status: 502 });
  }
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { conversationId } = await params;
  return proxy(conversationId, 'GET');
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { conversationId } = await params;
  return proxy(conversationId, 'DELETE');
}
