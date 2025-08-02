import { Assignee } from "@/app/components/assignee";

export async function fetchAssigneeAPI(): Promise<Assignee[]> {
    try {

        const res = await fetch('/api/assignee/', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
            credentials: 'include'
        });

        if(!res.ok){
            throw new Error(`Internal API Error: ${res.status}`);
        }

        const data = await res.json();
        return data.assignees || [];

    }catch(error){
        console.log(`Internal Error: ${error}`)
        return []
    }
}