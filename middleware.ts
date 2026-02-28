import { NextRequest, NextResponse } from 'next/server';

let maintenanceCache: { enabled: boolean; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 1000; // 1 minute

// List of paths that should bypass maintenance mode
const BYPASS_PATHS = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/admin',
  '/api/admin',
  // Keep public blog and quotes available during maintenance
  '/blogs',
  '/blog',
  '/quotes',
  '/api/quotes',
  '/api/blogs',
  '/_next',
  '/public',
  '.ico',
  '.js',
  '.css'
];

async function getMaintenanceStatus(): Promise<boolean> {
  const now = Date.now();

  // Return cached value if fresh
  if (maintenanceCache && now - maintenanceCache.timestamp < CACHE_DURATION) {
    return maintenanceCache.enabled;
  }

  try {
    // Fetch from API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/maintenance`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    const enabled = data.maintenanceMode || false;

    // Update cache
    maintenanceCache = { enabled, timestamp: now };
    return enabled;
  } catch (error) {
    console.error('Failed to fetch maintenance status:', error);
    // Return cached value or false if no cache
    return maintenanceCache?.enabled || false;
  }
}

function shouldBypass(pathname: string): boolean {
  return BYPASS_PATHS.some(path => pathname.startsWith(path));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for public files and auth paths
  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  // Check if maintenance mode is enabled
  const isMaintenanceEnabled = await getMaintenanceStatus();

  if (isMaintenanceEnabled) {
    // Check if user is admin (has admin token or cookie)
    const adminToken = request.cookies.get('admin_token')?.value;
    const authHeader = request.headers.get('authorization');

    // If not admin, redirect to maintenance page
    if (!adminToken && !authHeader?.startsWith('Bearer ')) {
      // Rewrite to maintenance page without changing URL
      return NextResponse.rewrite(new URL('/maintenance', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
