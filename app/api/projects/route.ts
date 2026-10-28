import { cookies } from "next/headers";
import { getDjangoApiUrl } from "../../lib/api/getDjangoApiUrl";
import { deduplicateProjects } from "../../lib/utils/deduplicate";

export async function GET(request: Request) {
    const accessToken = (await cookies()).get('access')?.value;


    if (!accessToken) {
        return new Response(JSON.stringify({message: "Not authenticated no access token"}),
            {status: 401})
    }

    try {

        const backendRes = await fetch(getDjangoApiUrl("auth/projects/"), {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (!backendRes.ok){
            return new Response(JSON.stringify({message: "Backend API Faild to fetch Projets"}),{
                status : backendRes.status
            })
        }

        const data = await backendRes.json();
        const rawProjects = Array.isArray(data)
            ? data
            : Array.isArray(data?.projects)
                ? data.projects
                : Array.isArray(data?.data)
                    ? data.data
                    : [];

        const uniqueProjects = deduplicateProjects(rawProjects);

        return new Response(JSON.stringify({projects: uniqueProjects}), {
            status: 200,
            headers: {'Content-type' : 'application/json'}
        });

    }catch(error){
        return new Response(JSON.stringify({message: 'Internal server error'}),{
            status: 500
        })
    }
}

export async function POST(request: Request) {
    const accessToken = (await cookies()).get('access')?.value;

    if (!accessToken) {
        return new Response(JSON.stringify({message: "Not authenticated: no access token"}), {
            status: 401,
        });
    }

    try {

        const body = await request.json(); // read from frontend body

        console.log(`Received body: ${JSON.stringify(body)}`);

        const backendRes = await fetch(getDjangoApiUrl("auth/projects/"), {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        });

        if (!backendRes.ok) {
            return new Response(JSON.stringify({message: "Backend API Failed to create project"}), {
                status: backendRes.status,
            });
        }

        const data = await backendRes.json();
        const project = data?.project ?? data;

        console.log(`Project created: ${JSON.stringify(project)}`);

        return new Response(JSON.stringify({project}), {
            status: 201,
            headers: {'Content-type': 'application/json'}
        });
        
    }catch(error) {
        return new Response(JSON.stringify({message: "Internal server error"}), {
            status: 500
        });
    }

}

export async function PATCH(request: Request) {
    const accessToken = (await cookies()).get('access')?.value;

    if (!accessToken) {
        return new Response(JSON.stringify({message: "Not authenticated: no access token"}), {
            status: 401,
        });
    }

    try {
        const body = await request.json();
        const { id, ...updates } = body;

        // Try updating Django endpoint
        const targetUrl = id ? getDjangoApiUrl(`auth/projects/${id}/`) : getDjangoApiUrl("auth/projects/");
        const backendRes = await fetch(targetUrl, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates),
        });

        if (!backendRes.ok) {
            // Also try POST if PATCH not configured in Django
            const fallbackRes = await fetch(getDjangoApiUrl("auth/projects/"), {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
            });
            if (fallbackRes.ok) {
                const data = await fallbackRes.json();
                return new Response(JSON.stringify({ project: data }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            return new Response(JSON.stringify({ message: "Backend API update failed", id, ...updates }), {
                status: backendRes.status,
            });
        }

        const data = await backendRes.json();
        return new Response(JSON.stringify({ project: data }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal server error" }), {
            status: 500,
        });
    }
}