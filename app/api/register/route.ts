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

        return new Response(await backendResponse.text(), {
            status: backendResponse.status,
            headers: {
                "Content-Type": backendResponse.headers.get("Content-Type") ?? "application/json",
            },
        });
    } catch (error) {
        console.error("Registration request failed:", error);
        return NextResponse.json({ error: "Registration service unavailable" }, { status: 502 });
    }
}