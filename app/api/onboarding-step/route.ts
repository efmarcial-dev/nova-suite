import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDjangoApiUrl } from "../../lib/api/getDjangoApiUrl";

export async function PATCH(req: Request) {
    const accessToken = (await cookies()).get('access')?.value;

    if (!accessToken) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const step = body.step;

        if (step === undefined || step === null) {
            return NextResponse.json({ error: "Step is required" }, { status: 400 });
        }

        const res = await fetch(getDjangoApiUrl("auth/onboarding-step/"), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ step }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error("Backend onboarding-step error:", errorData);
            return NextResponse.json(
                { error: errorData.detail || errorData.step || "Failed to update onboarding step" },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json({ success: true, ...data }, { status: 200 });

    } catch (error) {
        console.error("Onboarding step API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
