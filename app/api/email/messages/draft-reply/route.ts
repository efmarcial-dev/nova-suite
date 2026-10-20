import { cookies } from 'next/headers';
import { getDjangoApiUrl } from '@/app/lib/api/getDjangoApiUrl';

export const maxDuration = 60;

export async function POST(request: Request) {
  const accessToken = (await cookies()).get('access')?.value;
  if (!accessToken) return Response.json({ message: 'Not authenticated' }, { status: 401 });

  try {
    const body = await request.json();
    const response = await fetch(getDjangoApiUrl('auth/email/messages/draft-reply/'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error('Email reply draft request failed', error);
    return Response.json({ detail: 'Could not draft an email reply.' }, { status: 502 });
  }
}
