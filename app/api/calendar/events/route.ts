import { cookies } from 'next/headers';
import { getDjangoApiUrl } from '@/app/lib/api/getDjangoApiUrl';

export async function GET() {
  const accessToken = (await cookies()).get('access')?.value;

  if (!accessToken) {
    return Response.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const res = await fetch(getDjangoApiUrl('auth/calendar/events/'), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const details = await res.json().catch(() => ({}));
      return Response.json(details, { status: res.status });
    }

    const data = await res.json();
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error('Calendar events fetch failed', error);
    return Response.json({ message: 'Calendar events fetch failed' }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const accessToken = (await cookies()).get('access')?.value;

  if (!accessToken) {
    return Response.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const res = await fetch(getDjangoApiUrl('auth/calendar/events/'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return Response.json({ message: 'Calendar event creation failed' }, { status: res.status });
    }

    const data = await res.json();
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error('Calendar event create failed', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
