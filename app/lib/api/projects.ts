import { Project } from "@/app/components/project";


export async function fetchProjectsAPI(): Promise<Project[]> {

    try{

        const res = await fetch('/api/projects/', {
            method: 'GET',
            headers: {
                'Content-type' : 'application/json',
            },
            credentials: 'include'
        });

        if(!res.ok){
            throw new Error(`Internal API Error: ${res.status}`);
        }

        const data = await res.json();
        return data.projects || [];

    }catch(error){
        console.log(`Internal Error: ${error}`)
        return [];
    }
}


export async function createProject(projectData: {
    projectName: string;
    description: string;
    status: string | null;

}): Promise<{id: string}> {

    const res = await fetch("/api/projects/", {
        method: "POST",
        headers: {
            'Content-type' : 'application/json',
        },
        credentials: 'include',
        body : JSON.stringify(projectData),
    });

    if (!res.ok) throw new Error("Failed to create project");

    const data = await res.json();
    return data || {};
}

export async function updateProjectAPI(id: string | number, updates: {
    projectName?: string;
    title?: string;
    description?: string;
    status?: string;
    due_date?: string;
}): Promise<any> {
    try {
        const res = await fetch("/api/projects/", {
            method: "PATCH",
            headers: {
                'Content-type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ id, ...updates }),
        });
        if (!res.ok) {
            console.warn(`Backend update returned status ${res.status}`);
            return null;
        }
        return await res.json();
    } catch (e) {
        console.warn("Failed to reach backend API for update, cached locally", e);
        return null;
    }
}

export { updateProjectAPI as updateProject };