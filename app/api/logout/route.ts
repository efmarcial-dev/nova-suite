import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
    // Clear the access and refresh tokens from cookies

    const cookieStore = await cookies();
    cookieStore.delete('access')
    cookieStore.delete('refresh')

    return NextResponse.json({ success: true })
}
