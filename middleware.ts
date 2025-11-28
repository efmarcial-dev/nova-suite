// middleware.ts

import { NextResponse} from 'next/server';
import { NextRequest } from 'next/server';
 


export function middleware(request: NextRequest) {
    
    const url = request.nextUrl.clone();
    const hostname = request.headers.get("host") || "";
    const accessToken = request.cookies.get("access")?.value;

    // extract subdomain 
    const subdomain = getSubdomain(hostname);

    // Define public paths (accessible without authentication)
    const publicPaths = ["/login", "/register", "/api/auth/register", "/api/auth/login", "/api/auth/refresh", '/'];
    const currentPath = url.pathname;
    const isPublicPath = publicPaths.includes(currentPath);

    // If on main domain (no subdomain or wwww)
    if (!subdomain || subdomain === "www") {
        // If user has access token, redirect to their tenant dashboard
        if (accessToken && isPublicPath) {
            // Get tenant from token or make api call
            const tenant = getTenantFromToken(accessToken);
            if (tenant) {
                return redirectToTenant(request, tenant);
            }
        }

        // If no token and trying to access protected page → redirect to /login
        if (!accessToken && !isPublicPath) {
            return NextResponse.redirect(new URL(`/login`, request.url));
        }

        return NextResponse.next();
    }

    // If on tenant subdomain
    if (subdomain && subdomain !== "www") {
        // if no access token → redirect to main domain login
        if (!accessToken) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.hostname = getBaseDomain(hostname);
            return NextResponse.redirect(loginUrl);
        }

        // Verify token belongs to this tenant
        const tokenTenant = getTenantFromToken(accessToken);
        if (tokenTenant && tokenTenant !== subdomain) {
            // Token is for different tenant, redirect to correct tenant
            return redirectToTenant(request, tokenTenant)
        }

        // Block access to login/signup pages on tenant subdomains
        if (['/login', '/register'].includes(currentPath)) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }

        // add tenant info to headers for use in appp
        const response = NextResponse.next();
        response.headers.set('x-tenant', subdomain);
        response.headers.set('x-has-auth', 'true');

        return response
    }
  

  return NextResponse.next();
}

function getSubdomain(hostname: string) : string | null {

    // Remove port if present
    const host = hostname.split(':')[0];

    // Split by dots
    const parts = host.split('.');

    // for localhost development
    if (host.includes('localhost')) {
        if (parts.length > 1 && parts[0] !== 'localhost') {
            return parts[0];
        }

        return null;
    }

    // for production domains like novadev.solutions
    // if we have tenant.novadev.solutions (3 parts), return tenant

    if (parts.length > 3) {
        return parts[0];
    }

    return null;
}

function getBaseDomain(hostname: string): string {
    const host = hostname.split(':')[0];
    const parts = host.split('.');

    // for localhost development
    if (host.includes('localhost')) {
        return 'localhost';
    }

    // Return last two parts (e.g., novadev.solutions)
    if (parts.length >= 2) {
        return parts.slice(-2).join('.');
    }

    return host;
}

function getTenantFromToken(token: string): string | null {
    try {

        // Decode JWT token to get tenant info
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = JSON.parse(
            Buffer.from(parts[1], 'base64').toString('utf-8')
        )

        // Return tenant slug from token payload
        return payload['tenant_slug'] || null;

    }catch(error){
        console.error("Error decoding token:", error);
        return null;
    }
}

function redirectToTenant(request: NextRequest, tenantSlug: string){
    const hostname = request.headers.get('host') || '';
    const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1')

    const protocol = isLocalhost ? 'https' : 'http';
    const baseDomain = isLocalhost ? 'localhost' : (process.env.NEXT_PUBLIC_BASE_DOMAIN || 'novadev.solutions')
    // Extract port from current hostname if it exists
    const portMatch = hostname.match(/:(\d+)/)
    const port = portMatch ? `:${portMatch[1]}` : ''

    const tenantUrl = `${protocol}://${tenantSlug}.${baseDomain}${port}/dashboard`
  
    return NextResponse.redirect(tenantUrl)
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
