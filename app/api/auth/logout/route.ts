import { NextRequest, NextResponse } from 'next/server';

/**
 * Logout endpoint - clears session cookie
 * Can be called by both authenticated and unauthenticated users
 */
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear session cookie
    response.headers.set('Set-Cookie', 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC; HttpOnly; SameSite=Strict;');

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}

