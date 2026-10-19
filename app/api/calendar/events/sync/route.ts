import { cookies } from 'next/headers';
import { getDjangoApiUrl } from '@/app/lib/api/getDjangoApiUrl';

export async function POST(request: Request) {
  const accessToken = (await cookies()).get('access')?.value;

  if (!accessToken) {
    return Response.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const provider = body.provider || 'google';

    const res = await fetch(getDjangoApiUrl('auth/calendar/events/sync/'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider,
        time_min: body.time_min || null,
        time_max: body.time_max || null,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return Response.json(err, { status: res.status });
    }

    const data = await res.json();
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error('Calendar sync failed', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
