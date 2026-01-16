import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, DecodedToken } from '@/lib/auth-middleware';

/**
 * Example protected admin API endpoint
 * Demonstrates how to use withAdminAuth middleware to verify Firebase token and admin claims
 *
 * Usage:
 * - GET /api/admin/dashboard - Returns admin dashboard data
 * - Authorization header: Bearer <firebase_id_token>
 */
export const GET = withAdminAuth(async (request: NextRequest, user: DecodedToken) => {
  try {
    // user is the decoded Firebase token with admin claim verified
    // Access user properties: user.uid, user.email, user.admin, etc.

    return NextResponse.json({
      success: true,
      message: 'Welcome to admin dashboard',
      user: {
        uid: user.uid,
        email: user.email,
        isAdmin: user.admin,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
});

