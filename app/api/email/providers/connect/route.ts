import { cookies } from 'next/headers';
import { getDjangoApiUrl } from '@/app/lib/api/getDjangoApiUrl';

export async function POST(request: Request) {
  const accessToken = (await cookies()).get('access')?.value;

  if (!accessToken) {
    return Response.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const provider = body?.provider || 'gmail';

    const res = await fetch(getDjangoApiUrl('auth/email/providers/connect/'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider,
        email: body?.email,
        is_connected: true,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      return Response.json({ message: 'Email provider connect failed', details: errorBody }, { status: res.status });
    }

    const data = await res.json();
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error('Email provider connect failed', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
