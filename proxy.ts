import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const currentPath = url.pathname;
  const accessToken = request.cookies.get('access')?.value;

  // 1. Skip proxy for static assets, API routes, and system files
  if (
    currentPath.startsWith('/_next') ||
    currentPath.startsWith('/api') ||
    currentPath.startsWith('/sitemap') ||
    currentPath.startsWith('/images') ||
    currentPath.startsWith('/fonts') ||
    currentPath === '/favicon.ico' ||
    currentPath === '/robots.txt' ||
    currentPath.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Define public paths (no authentication required)
  const publicPaths = [
    '/',
    '/login',
    '/register',
    '/about',
    '/contact',
    '/services',
    '/debug-cache',
  ];
  const isPublicPath = publicPaths.includes(currentPath);

  // 3. If authenticated user tries to access /login or /register, redirect to /dashboard
  if (accessToken && (currentPath === '/login' || currentPath === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 4. If unauthenticated user tries to access a protected route, redirect to /login
  if (!accessToken && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    if (currentPath !== '/dashboard') {
      loginUrl.searchParams.set('redirect', currentPath);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and images
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
