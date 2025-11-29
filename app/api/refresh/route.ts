// /app/api/refresh/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function GET() {
    
  const refreshCookie = await cookies();

  const refresh = refreshCookie.get('refresh')?.value;

  if (!refresh) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) throw new Error('Failed to refresh');

    const data = await res.json();
    const newAccess = data['access'];

    const accessCookie = serialize('access', newAccess, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 15, // 15 mins
      path: '/',
    });

    const response = NextResponse.json({ success: true });
    response.headers.set('Set-Cookie', accessCookie);
    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Refresh failed' }, { status: 403 });
  }
}
