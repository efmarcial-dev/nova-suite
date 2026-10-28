import { cookies } from 'next/headers';
import { getDjangoApiUrl } from '@/app/lib/api/getDjangoApiUrl';

export async function POST(request: Request) {
  const accessToken = (await cookies()).get('access')?.value;
  if (!accessToken) return Response.json({ detail: 'Not authenticated' }, { status: 401 });

  try {
    const body = await request.json();
    const res = await fetch(getDjangoApiUrl('auth/email/messages/actions/'), {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch (error) {
    console.error('Email action request failed', error);
    return Response.json({ detail: 'Could not apply the email action.' }, { status: 502 });
  }
}
