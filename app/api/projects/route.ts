import { cookies } from "next/headers";

export async function GET(request: Request) {
    const accessToken = (await cookies()).get('access')?.value;


    if (!accessToken) {
        return new Response(JSON.stringify({message: "Not authenticated no access token"}),
            {status: 401})
    }

    try {

        const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/projects/`, {
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

        return new Response(JSON.stringify({projects: data}), {
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

        const backendRes = await fetch('http://127.0.0.1:8000/api/auth/projects/', {
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

        console.log(`Project created: ${JSON.stringify(data)}`);

        return new Response(JSON.stringify({project: data}), {
            status: 201,
            headers: {'Content-type': 'application/json'}
        });
        
    }catch(error) {
        return new Response(JSON.stringify({message: "Internal server error"}), {
            status: 500
        });
    }

}