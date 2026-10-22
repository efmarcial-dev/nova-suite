import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDjangoApiUrl } from '@/app/lib/api/getDjangoApiUrl';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { source_id, buyer_verification_token = null } = body;

    if (!source_id) {
      return NextResponse.json(
        { status: 'FAILED', message: 'Missing source_id token from Square' },
        { status: 400 }
      );
    }

    // Forward to Django backend
    const djangoResponse = await fetch(getDjangoApiUrl('auth/payments/charge/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        source_id,
        amount: 4900,
        plan: 'founder_lifetime',
        promo_code: '',
        buyer_verification_token,
      }),
    });

    const data = await djangoResponse.json().catch(() => ({}));

    return NextResponse.json(data, { status: djangoResponse.status });
  } catch (err: any) {
    console.error('Error proxying charge to Django backend:', err);
    return NextResponse.json(
      { status: 'FAILED', message: 'Unable to communicate with payment backend' },
      { status: 502 }
    );
  }
}
