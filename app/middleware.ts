import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login and auth callback through
  if (
    pathname.startsWith('/mhe-control-center/login') ||
    pathname.startsWith('/mhe-control-center/auth')
  ) {
    return NextResponse.next();
  }

  // Redirect bare /mhe-control-center to login
  if (pathname === '/mhe-control-center') {
    return NextResponse.redirect(new URL('/mhe-control-center/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/mhe-control-center/:path*'],
};
