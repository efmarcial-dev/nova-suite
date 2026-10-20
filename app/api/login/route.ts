import { NextResponse } from 'next/server';
import { getDjangoApiUrl } from '@/app/lib/api/getDjangoApiUrl';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const backendResponse = await fetch(getDjangoApiUrl('auth/login/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json().catch(() => ({}));

    if (!backendResponse.ok) {
      return NextResponse.json(
        { detail: data.detail || data.error || 'Invalid credentials' },
        { status: backendResponse.status }
      );
    }

    const { access, refresh, ...userData } = data;
    const response = NextResponse.json({ ...userData, authenticated: Boolean(access) }, { status: 200 });

    const isProduction = process.env.NODE_ENV === 'production';
    if (access) {
      response.cookies.set('access', access, {
        path: '/',
        // Keep the expired JWT cookie present as a session marker so proxy.ts
        // doesn't redirect before the refresh token can renew it.
        maxAge: 14 * 24 * 60 * 60,
        sameSite: 'lax',
        secure: isProduction,
        httpOnly: true,
      });
    }

    if (refresh) {
      response.cookies.set('refresh', refresh, {
        path: '/',
        maxAge: 14 * 24 * 60 * 60,
        sameSite: 'lax',
        secure: isProduction,
        httpOnly: true,
      });
    }

    return response;
  } catch (error) {
    console.error('Login request failed:', error);
    return NextResponse.json(
      { detail: 'Authentication service temporarily unavailable' },
      { status: 502 }
    );
  }
}
