import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const hasSession = Boolean(cookieStore.get('access')?.value || cookieStore.get('refresh')?.value);

  return NextResponse.json({ authenticated: hasSession }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
