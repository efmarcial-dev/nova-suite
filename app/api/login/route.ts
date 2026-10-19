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

    const response = NextResponse.json(data, { status: 200 });

    const isProduction = process.env.NODE_ENV === 'production';
    if (data.access) {
      response.cookies.set('access', data.access, {
        path: '/',
        maxAge: 86400,
        sameSite: 'lax',
        secure: isProduction,
      });
    }

    if (data.refresh) {
      response.cookies.set('refresh', data.refresh, {
        path: '/',
        maxAge: 604800,
        sameSite: 'lax',
        secure: isProduction,
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
