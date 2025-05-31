import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// We'll handle auth validation on the client side since we need localStorage access
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Keep the matchers to ensure our client-side validation runs on these routes
export const config = {
  matcher: ['/', '/login', '/home/:path*'],
};
