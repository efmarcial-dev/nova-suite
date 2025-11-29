import { cookies } from "next/headers";

export async function GET(request: Request){
  const accessToken = (await cookies()).get('access')?.value;

  if (!accessToken) {
    return new Response(JSON.stringify({message: 'Not autenticated no access token'}), {
      status: 401,
    })
  }

  try {
    const backendRes = await fetch('http://127.0.0.1:8000/api/auth/tasks/', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!backendRes.ok){
      return new Response(JSON.stringify({message: 'Backend API Failed to fetch tasks from api'}),{
        status : backendRes.status
      })
    }

    const data = await backendRes.json();
    return new Response(JSON.stringify({tasks: data}), {
      status: 200,
      headers: {'Content-type': 'application/json'}
    });

  } catch(error){
    return new Response(JSON.stringify({message: "Internal server error"}),{
      status: 500
    })
  }

}

export async function POST(request: Request){

  const accessToken = (await cookies()).get('access')?.value;


  if (!accessToken) {
    return new Response(JSON.stringify({message: "Not authenticated: no access token"}), {
      status: 401,
    });
  }

  try {

    const body = await request.json(); // read from frontend body

    console.log(`Received body: ${JSON.stringify(body)}`);

    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/tasks/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if(!backendRes.ok){
      return new Response(JSON.stringify({message: "Backend API Failed to fetch tasks from api"}), {
        status : backendRes.status
      })
    }

    const data = await backendRes.json();

    console.log(`Backend POST response: ${data}`);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers : {'Content-type' : "application/json"}
    })

  }catch(error) {
    return new Response(JSON.stringify({message: "Internal server error"}), {
      status: 500
    })
  }
}