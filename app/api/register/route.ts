import { NextResponse } from "next/server";
import { getDjangoApiUrl } from "../../lib/api/getDjangoApiUrl";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const backendResponse = await fetch(getDjangoApiUrl("auth/register/"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await backendResponse.json().catch(() => ({}));

        if (!backendResponse.ok) {
            return NextResponse.json(data, { status: backendResponse.status });
        }

        const { access, refresh, ...userData } = data;
        const response = NextResponse.json(
            { ...userData, authenticated: Boolean(access) },
            { status: backendResponse.status },
        );
        const isProduction = process.env.NODE_ENV === 'production';
        if (access) {
            response.cookies.set('access', access, {
                path: '/',
                // The JWT still expires after one hour; this cookie lifetime
                // lets the client refresh it before proxy.ts redirects.
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
        console.error("Registration request failed:", error);
        return NextResponse.json({ error: "Registration service unavailable" }, { status: 502 });
    }
}
