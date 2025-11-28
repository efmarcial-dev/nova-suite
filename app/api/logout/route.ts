import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
    // Clear the access and refresh tokens from cookies

    const BASE_URL = process.env.API_URL || 'http://192.168.0.110:8000';
    
    if (!BASE_URL.startsWith('http') ) {
        throw new Error('API_URL must start with http:// or https://');
    }
    if (!BASE_URL){
        console.warn('API_URL is not defined. Using default localhost URL.');
    }


    try {
        const cookieStore = await cookies();

        // Call api to invalidate tokens if necessary (optional)
        const response = await fetch(`${BASE_URL}/api/auth/logout/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Include tokens if required by your API
                'Authorization': `Bearer ${cookieStore.get('access')?.value}`,
                
            },
        });

        if (!response.ok) {
            console.error('Failed to logout from API');
        }   

        // Delete cookies

        cookieStore.delete('access')
        cookieStore.delete('refresh')

        return NextResponse.json({ success: true }, { status: 200 });

    }catch (error) {
        console.error('Error during logout:', error);
        return NextResponse.json({ success: false, error: 'Logout failed' }, { status: 500 });
    }

}
