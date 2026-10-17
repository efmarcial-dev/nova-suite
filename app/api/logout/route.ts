import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getDjangoApiUrl } from '../../lib/api/getDjangoApiUrl'

export async function POST() {
    // Clear the access and refresh tokens from cookies

    try {
        const cookieStore = await cookies();

        // Call api to invalidate tokens if necessary (optional)
        const response = await fetch(getDjangoApiUrl('auth/logout/'), {
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
