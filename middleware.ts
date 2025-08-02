// This middleware is used to handle authentication and authorization for the application dashboard.
import { NextResponse, NextRequest} from 'next/server';

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('access')?.value;
    const refreshToken = request.cookies.get('refresh')?.value; 

    // Define protected routes
    const protectedPaths = ['/dashboard'];
    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

    // If accessing protected route without any token, redirect to login
    if(isProtectedPath && !accessToken ) {
        
        return NextResponse.redirect(new URL('/login', request.url));
    }

   

    // If user is authenticated and trying to access login, redirect to dashboard
    if (accessToken && request.nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    } 

    return NextResponse.next();

}

export const config = {
    // This middleware will run for all paths under /dashboard and /api
    matcher: ['/dashboard/:path*'],
}
