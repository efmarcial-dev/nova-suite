import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getDjangoApiUrl } from '@/app/lib/api/getDjangoApiUrl';

export async function GET() {
  const accessToken = (await cookies()).get('access')?.value;
  if (!accessToken) {
    return NextResponse.json(
      { plan: 'none', status: 'none', isActive: false, hasAccess: false },
      { status: 200 },
    );
  }
  try {
    const res = await fetch(getDjangoApiUrl('auth/subscription/'), {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    const payload = await res.json().catch(() => ({}));
    if (res.status === 404) {
      // No subscription record — return a safe 200 with no access
      return NextResponse.json(
        { plan: 'none', status: 'none', isActive: false, hasAccess: false },
        { status: 200 },
      );
    }
    return NextResponse.json(payload, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: 'Subscription service unavailable.' },
      { status: 502 },
    );
  }
}
