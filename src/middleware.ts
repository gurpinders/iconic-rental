import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Create response and set pathname header FIRST
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);

  // Let auth pages through
  if (
    pathname.startsWith('/auth') || 
    pathname.startsWith('/admin-login') ||
    pathname === '/admin/login' ||
    pathname === '/not-found' ||
    pathname === '/_not-found'
  ) {
    return response; // Return the response with header set
  }

  // Protect admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin-auth-token');

    if (!token) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
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