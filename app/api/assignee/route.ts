import { cookies } from "next/headers";

export async function GET(request: Request) {
    const accessToken = (await cookies()).get('access')?.value;


    if (!accessToken) {
        return new Response(JSON.stringify({message: "Not authenticated no access token"}),
            {status: 401})
    }

    try {

        const backendRes = await fetch('http://127.0.0.1:8000/api/auth/assignees/', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (!backendRes.ok){
            return new Response(JSON.stringify({message: "Backend API Faild to fetch Assignees"}),{
                status : backendRes.status
            })
        }

        const data = await backendRes.json();

        return new Response(JSON.stringify({assignees: data}), {
            status: 200,
            headers: {'Content-type' : 'application/json'}
        });

    }catch(error){
        return new Response(JSON.stringify({message: 'Internal server error'}),{
            status: 500
        })
    }
}