import { cookies } from 'next/headers';
import { getDjangoApiUrl } from '@/app/lib/api/getDjangoApiUrl';

export async function GET(request: Request) {
  const accessToken = (await cookies()).get('access')?.value;

  if (!accessToken) {
    return Response.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const provider = url.searchParams.get('provider');
    const backendUrl = provider ? `auth/calendar/connection/?provider=${encodeURIComponent(provider)}` : 'auth/calendar/connection/';

    const res = await fetch(getDjangoApiUrl(backendUrl), {
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
    console.error('Calendar connection fetch failed', error);
    return Response.json({ message: 'Calendar connection fetch failed' }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const accessToken = (await cookies()).get('access')?.value;

  if (!accessToken) {
    return Response.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const provider = body?.provider || 'google';
    const connectUrl = body?.isConnected === false ? 'auth/calendar/disconnect/' : 'auth/calendar/connection/';

    const res = await fetch(getDjangoApiUrl(connectUrl), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...body, provider }),
    });

    if (!res.ok) {
      return Response.json({ message: 'Calendar connection update failed' }, { status: res.status });
    }

    const data = await res.json();
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error('Calendar connection update failed', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
