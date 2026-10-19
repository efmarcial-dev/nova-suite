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

        const response = NextResponse.json(data, { status: backendResponse.status });
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
        console.error("Registration request failed:", error);
        return NextResponse.json({ error: "Registration service unavailable" }, { status: 502 });
    }
}