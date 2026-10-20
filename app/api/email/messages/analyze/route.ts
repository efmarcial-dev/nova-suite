import { cookies } from 'next/headers';
import { getDjangoApiUrl } from '@/app/lib/api/getDjangoApiUrl';

export const maxDuration = 60;

export async function POST(request: Request) {
  const accessToken = (await cookies()).get('access')?.value;
  if (!accessToken) {
    return Response.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const res = await fetch(getDjangoApiUrl('auth/email/messages/analyze/'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch (error) {
    console.error('Email analysis request failed', error);
    return Response.json({ detail: 'Could not analyze emails.' }, { status: 502 });
  }
}
