import { cookies } from 'next/headers';
import { getDjangoApiUrl } from '@/app/lib/api/getDjangoApiUrl';

export async function POST(request: Request) {
  const accessToken = (await cookies()).get('access')?.value;

  if (!accessToken) {
    return Response.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const provider = body.provider || 'nylas';
    const syncPayload: Record<string, unknown> = { provider };

    if (body.time_min) syncPayload.time_min = body.time_min;
    if (body.time_max) syncPayload.time_max = body.time_max;
    if (body.grant_id) syncPayload.grant_id = body.grant_id;

    const res = await fetch(getDjangoApiUrl('auth/calendar/events/sync/'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(syncPayload),
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
