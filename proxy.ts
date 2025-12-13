// middleware.ts

import { NextResponse} from 'next/server';
import type { NextRequest } from 'next/server';
 
// Main Middleware function
export function proxy(request: NextRequest) {
    
    const url = request.nextUrl.clone();
    const hostname = request.headers.get("host") || "";
    const accessToken = request.cookies.get("access")?.value;
    const currentPath = url.pathname;

    // extract subdomain 
    

    // Debug logging (remove in production after fixing)
    console.log('=== MIDDLEWARE DEBUG ===')
    console.log('Hostname:', hostname)
    console.log('Path:', currentPath)
    console.log('Has Token:', !!accessToken)

    // Define public paths (accessible without authentication)
    const publicPaths = ["/login", "/register", '/', '/sitemap.xml', '/sitemap-0.xml']; 
    const isPublicPath = publicPaths.includes(currentPath);

    // Skip middleware for static files and API routes
    if (
        currentPath.startsWith('/_next') ||
        currentPath.startsWith('/api') ||
        currentPath.startsWith('/sitemap') ||
        currentPath.includes('.')
    ){
        console.log("Skipping middleware for static files and API routes")
        return NextResponse.next();

    }

    
        console.log("On main domain");

        // If the user is authenticated and tries to access auth routes (login/register), redirect to dashoard.
        if (accessToken && (currentPath === '/login' || currentPath === '/register') ) {
            
            console.log('Authenticated user accessing auth route - redirecting to /dasboard')
            
            return NextResponse.redirect(new URL(`/dashboard`, request.url))
            
        }

        // If no token and trying to access protected page → redirect to /login
        if (!accessToken && !isPublicPath) {

            console.log("No token on proteced route, redirecting to login")
            return NextResponse.redirect(new URL(`/login`, request.url));
        }

        // Allow access to public paths
    console.log("Allowing access to: ", currentPath)
    return NextResponse.next();
}



export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
