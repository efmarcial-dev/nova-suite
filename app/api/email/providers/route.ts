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
    const targetUrl = provider ? `auth/email/providers/?provider=${encodeURIComponent(provider)}` : 'auth/email/providers/';

    const res = await fetch(getDjangoApiUrl(targetUrl), {
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
    console.error('Email providers fetch failed', error);
    return Response.json({ message: 'Email providers fetch failed' }, { status: 502 });
  }
}
