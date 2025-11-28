import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const accessToken = (await cookies()).get('access')?.value;
    

    if (!accessToken) {
        return NextResponse.json({ error: "Not authenticated: no access token" }, { status: 401 });
    }

    try {

        const body = await req.json(); // Read the onboarding data from the request body
        console.log(`Received onboarding data: ${JSON.stringify(body)}`);

        const res = await fetch('http://127.0.0.1:8000/api/auth/onboarding/', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}` // Include access token for authentication
            },
            body: JSON.stringify(body),
        });

        if(!res.ok) {
            const errorData = await res.json();
            console.error("Onboarding API error:", errorData);
            return NextResponse.json({ error: "Failed to save onboarding data" }, { status: res.status });
        }

        const data = await res.json();
        console.log("Onboarding data saved successfully:", data);
        console.log("tenants", data.tenant_slug, data.tenant_domain);
        // Set HTTP-only cookies for both tokens
        const tenant = serialize("tenant", data.tenant_slug, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: 60 * 15, // 15 minutes
                            path: '/',
                        })
            
        const tenant_domain = serialize("tenant_domain", data.tenant_domain, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: 60 * 60 * 24 * 7, // 7 days
                            path: '/',
                         })


        const response =  NextResponse.json({ success: true, data }, {status: 200});

        response.headers.append('Set-Cookie', tenant);
        response.headers.append('Set-Cookie', tenant_domain);

        return response;

    }catch(error) {
        console.error("Onboarding API error:", error);
        return NextResponse.json({ error: "Onboarding failed" }, { status: 500 });
    }
}