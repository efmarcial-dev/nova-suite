import { cookies } from "next/headers";

// lib/api.ts - Helper for authenticated API Calls
export async function fetchWithAuth(url: string, options: RequestInit = {}){ 
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access')?.value;

    const headers = {
        'Content-Type' : 'application/json',
        ...(accessToken && {'Authorization' : `Bearer ${accessToken}`}),
        ...options.headers,
    }

    const response = await fetch(url, {
        ...options,
        headers,
    })

    // If token expired, handle refresh or redirect
    if (response.status === 401){
        // Implement token refresh logic here if have refresh token
        // Or redirect to login
        console.log('Expired Refresh Token')
        return null
    }

    return response
}