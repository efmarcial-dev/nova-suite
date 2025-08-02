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
            throw new Error(`Internal APII Error: ${res.status}`);
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