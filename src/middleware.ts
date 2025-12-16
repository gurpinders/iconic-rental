import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Add pathname to headers for layout
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);

  // Skip auth check for login page and API routes
  if (pathname.startsWith('/admin/login') || pathname.startsWith('/api/')) {
    return response;
  }

  // Check for admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      // No token, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verify token
    const user = await verifyToken(token);

    if (!user) {
      // Invalid token, redirect to login
      const redirectResponse = NextResponse.redirect(new URL('/admin/login', request.url));
      redirectResponse.cookies.delete('admin-token');
      return redirectResponse;
    }

    // Token valid, allow access
    return response;
  }

  return response;
}

export const config = {
  matcher: ['/:path*'], // Match all paths
};