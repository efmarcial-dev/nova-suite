import { User } from "@/app/components/user";


export async function fetchUserAPI() : Promise<User[]> {
    
    try {
        const res = await fetch('/api/user/', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
            credentials: 'include'
        });

        if (!res.ok) {
            throw new Error(`Internal API Error: ${res.status}`);
        }

        const data = await res.json();
        if (Array.isArray(data)) return data;
        if (Array.isArray(data.user)) return data.user;
        if (data.user && typeof data.user === 'object') return [data.user];
        if (data.id || data.email) return [data];
        return [];

    } catch (error) {
        console.log(`Internal Error: ${error}`);
        return [];
    }
}