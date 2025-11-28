// Api route for client-side auth checks
import { error } from "console";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access')?.value;

    if (!accessToken){
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    try{
        const response = await fetch(

            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/user/`,
            {
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${accessToken}`
                }
            }
        )

        if(!response.ok){
            return NextResponse.json({error: 'Unauthorized'}, {status : 401})
        }

        const data = await response.json();
        return NextResponse.json(data);

    }catch(error){
        console.error(error)
        return NextResponse.json({error: 'Server error'}, {status: 500})
    }
}