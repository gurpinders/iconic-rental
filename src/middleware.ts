import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Let auth pages through
  if (pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  // Create a new response
  const response = NextResponse.next();

  // Add pathname to headers for layout to access
  response.headers.set('x-pathname', pathname);

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin-auth-token');

    if (!token) {
      return NextResponse.redirect(new URL('/auth/admin', request.url));
    }
  }

  // Protect customer dashboard routes
  if (pathname.startsWith('/customer/dashboard') || 
      pathname.startsWith('/customer/bookings') || 
      pathname.startsWith('/customer/invoices') ||
      pathname.startsWith('/customer/profile')) {
    const token = request.cookies.get('customer-auth-token');

    if (!token) {
      return NextResponse.redirect(new URL('/customer/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};