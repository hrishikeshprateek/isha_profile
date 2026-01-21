import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-auth';

/**
 * Admin dashboard API endpoint
 * Protected with unified admin authentication
 *
 * Usage:
 * - GET /api/admin/dashboard - Returns admin dashboard data
 * - Authorization header: Bearer <firebase_id_token>
 */
export async function GET(request: NextRequest) {
  // Verify admin authentication
  const auth = await verifyAdmin(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    // auth.uid is the authenticated admin user ID

    return NextResponse.json({
      success: true,
      message: 'Welcome to admin dashboard',
      user: {
        uid: auth.uid,
        isAdmin: true,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

