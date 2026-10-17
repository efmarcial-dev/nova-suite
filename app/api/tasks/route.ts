import { cookies } from "next/headers";
import { getDjangoApiUrl } from "../../lib/api/getDjangoApiUrl";

export async function GET(request: Request){
  const accessToken = (await cookies()).get('access')?.value;

  if (!accessToken) {
    return new Response(JSON.stringify({message: 'Not autenticated no access token'}), {
      status: 401,
    })
  }

  try {
    const backendRes = await fetch(getDjangoApiUrl("auth/tasks/"), {
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

    const backendRes = await fetch(getDjangoApiUrl("auth/tasks/"), {
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

export async function PATCH(request: Request) {
  const accessToken = (await cookies()).get('access')?.value;

  if (!accessToken) {
    return new Response(JSON.stringify({ message: "Not authenticated: no access token" }), {
      status: 401,
    });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const targetUrl = id ? getDjangoApiUrl(`auth/tasks/${id}/`) : getDjangoApiUrl("auth/tasks/");
    const backendRes = await fetch(targetUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!backendRes.ok) {
      // Fallback to PUT
      const fallbackRes = await fetch(getDjangoApiUrl("auth/tasks/"), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (fallbackRes.ok) {
        const data = await fallbackRes.json();
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ message: "Backend API task update failed", ...body }), {
        status: backendRes.status,
      });
    }

    const data = await backendRes.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function DELETE(request: Request) {
  const accessToken = (await cookies()).get('access')?.value;

  if (!accessToken) {
    return new Response(JSON.stringify({ message: "Not authenticated: no access token" }), {
      status: 401,
    });
  }

  try {
    const body = await request.json();
    const { id } = body;

    const targetUrl = id ? getDjangoApiUrl(`auth/tasks/${id}/`) : getDjangoApiUrl("auth/tasks/");
    await fetch(targetUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return new Response(JSON.stringify({ success: true, id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}