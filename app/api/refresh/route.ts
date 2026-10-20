// /app/api/refresh/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getDjangoApiUrl } from '../../lib/api/getDjangoApiUrl';

async function refreshAccessToken() {
  const refreshCookie = await cookies();
  const refresh = refreshCookie.get('refresh')?.value;

  if (!refresh) {
    const response = NextResponse.json({ error: 'No refresh token' }, { status: 401 });
    response.cookies.delete('access');
    response.cookies.delete('refresh');
    return response;
  }

  let res: Response;
  try {
    res = await fetch(getDjangoApiUrl('auth/refresh/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
  } catch {
    return NextResponse.json({ error: 'Refresh service unavailable' }, { status: 502 });
  }

  if (!res.ok) {
    const response = NextResponse.json({ error: 'Refresh token is invalid or expired' }, { status: 401 });
    response.cookies.delete('access');
    response.cookies.delete('refresh');
    return response;
  }

  const data = await res.json();
  if (!data.access) {
    return NextResponse.json({ error: 'Refresh response did not include an access token' }, { status: 502 });
  }

  const response = NextResponse.json({ success: true });
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };

  response.cookies.set('access', data.access, {
    ...cookieOptions,
    // JWT validity is enforced by Django. The cookie remains as a session
    // marker so a stale access token can be refreshed on the next page load.
    maxAge: 14 * 24 * 60 * 60,
  });

  // Persist replacement refresh tokens when Django rotates them.
  if (data.refresh) {
    response.cookies.set('refresh', data.refresh, {
      ...cookieOptions,
      maxAge: 14 * 24 * 60 * 60,
    });
  }

  return response;
}

export async function GET() {
  return refreshAccessToken();
}

export async function POST() {
  return refreshAccessToken();
}
