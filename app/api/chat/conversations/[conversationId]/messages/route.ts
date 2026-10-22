import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getDjangoApiUrl } from '@/app/lib/api/getDjangoApiUrl';

type RouteContext = { params: Promise<{ conversationId: string }> };

export async function POST(request: Request, { params }: RouteContext) {
  const accessToken = (await cookies()).get('access')?.value;
  if (!accessToken) return NextResponse.json({ detail: 'Not authenticated.' }, { status: 401 });

  try {
    const { conversationId } = await params;
    const body = await request.json();
    const response = await fetch(
      getDjangoApiUrl(`auth/chat/conversations/${encodeURIComponent(conversationId)}/messages/`),
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        cache: 'no-store',
      },
    );
    const payload = await response.json().catch(() => ({}));
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json({ detail: 'Chat service is unavailable.' }, { status: 502 });
  }
}
