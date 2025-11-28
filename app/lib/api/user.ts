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
        return data.user || [];

    } catch (error) {
        console.log(`Internal Error: ${error}`);
        return [];
    }
}