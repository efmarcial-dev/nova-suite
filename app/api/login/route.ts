
import { NextResponse } from 'next/server'
import { serialize } from 'cookie';
 
const BASE_URL = 'https://xq615gt2-8000.use2.devtunnels.ms/api/auth/login/';

export  async function POST(req: Request) {

    
    const { email, password } = await req.json()


    console.log('Login attempt:', { email, password })
    // Make a request to the authentication API

    try {
        const res = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        })

        

        const data = await res.json();

        if (res.ok) {
            const access = data['access'];
            const refresh = data['refresh'];

            console.log('tokens', access, refresh);

            // Set HTTP-only cookies for both tokens
            const accessCookie = serialize('access', access, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 15, // 15 minutes
                path: '/',
            })

            const refreshCookie = serialize('refresh', refresh, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
             })
             
            // Set both cookies using NextResponse
            const response = NextResponse.json({ success: data }, { status: 200 });
            // Use append instead of set
            response.headers.append('Set-Cookie', accessCookie);
            response.headers.append('Set-Cookie', refreshCookie);
            
            return response;

        } 

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 })
   
    }

}
