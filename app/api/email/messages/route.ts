import { cookies } from 'next/headers';
import { getDjangoApiUrl } from '@/app/lib/api/getDjangoApiUrl';

export async function GET(request: Request) {
  const accessToken = (await cookies()).get('access')?.value;

  if (!accessToken) {
    return Response.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const provider = url.searchParams.get('provider') || 'gmail';
    const q = url.searchParams.get('q') || '';
    const maxResults = url.searchParams.get('max_results') || '25';

    const targetUrl = `auth/email/messages/?provider=${encodeURIComponent(provider)}&q=${encodeURIComponent(q)}&max_results=${encodeURIComponent(maxResults)}`;

    const res = await fetch(getDjangoApiUrl(targetUrl), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return Response.json(err, { status: res.status });
    }

    const data = await res.json();
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error('Email messages fetch failed', error);
    return Response.json({ message: 'Internal server error', messages: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const accessToken = (await cookies()).get('access')?.value;

  if (!accessToken) {
    return Response.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const res = await fetch(getDjangoApiUrl('auth/email/messages/send/'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return Response.json(err, { status: res.status });
    }

    const data = await res.json();
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error('Email message send failed', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
