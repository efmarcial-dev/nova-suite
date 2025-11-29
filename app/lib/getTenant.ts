import { headers } from "next/headers";
import { cookies } from "next/headers";

export async function getTenant() {
    const headerList = await headers();
    const tenant = headerList.get('x-tenant');

    if (!tenant) {
        return null
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access')?.value;

    if (!accessToken) {
        return null;
    }

    // Fetch tenant data from django backend
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/tenants/${tenant}`,
        {
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            },
            cache: 'no-store'
        }
    )

    if(!response.ok){
        return null
    }

    return response.json()
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access')?.value;

    if (!accessToken){
        return null
    }

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/user/`,
            {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authrization' : `Bearer ${accessToken}`
                },
                cache: 'no-store'
            }
        )

        if (!response.ok){
            return null
        }

        return response.json();
        
    }catch (error) {
        console.error('Error fetching user: ', error);
        return null
    }

}