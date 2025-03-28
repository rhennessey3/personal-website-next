import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export default function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // Check if the pathname starts with /admin
  if (pathname.startsWith('/admin')) {
    // Skip the login page from authentication check
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check if the user is authenticated by looking for the auth token in cookies
    const authToken = request.cookies.get('auth_token')?.value;

    // If there's no auth token, redirect to the login page
    if (!authToken) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }

    // If there is an auth token, allow the request to proceed
    // In a production app, you would also verify the token's validity here
    return NextResponse.next();
  }

  // For all other routes, allow the request to proceed
  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ['/admin/:path*'],
};