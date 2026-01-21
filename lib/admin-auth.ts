import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

interface AuthResult {
  authorized: boolean;
  uid?: string;
  error?: string;
}

/**
 * Unified admin authentication middleware
 * Verifies Firebase ID token and checks for admin claim
 *
 * @param request - The Next.js request object
 * @returns AuthResult with authorization status and user ID
 *
 * @example
 * export async function GET(request: NextRequest) {
 *   const auth = await verifyAdmin(request);
 *   if (!auth.authorized) {
 *     return auth.response;
 *   }
 *   // ... your protected logic
 * }
 */
export async function verifyAdmin(request: NextRequest): Promise<AuthResult & { response?: NextResponse }> {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        authorized: false,
        error: 'Missing or invalid Authorization header',
        response: NextResponse.json(
          { error: 'Unauthorized. Admin access required.' },
          { status: 401 }
        )
      };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return {
        authorized: false,
        error: 'Empty token',
        response: NextResponse.json(
          { error: 'Unauthorized. Admin access required.' },
          { status: 401 }
        )
      };
    }

    // Verify token with Firebase Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Check if user has admin custom claim
    if (!decodedToken.admin) {
      return {
        authorized: false,
        uid: decodedToken.uid,
        error: 'User does not have admin privileges',
        response: NextResponse.json(
          { error: 'Forbidden. Admin privileges required.' },
          { status: 403 }
        )
      };
    }

    // Success - user is authenticated and has admin claim
    return {
      authorized: true,
      uid: decodedToken.uid
    };

  } catch (error) {
    console.error('Admin auth verification error:', error);

    // Distinguish between token expiry and other errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isExpired = errorMessage.includes('expired') || errorMessage.includes('exp');

    return {
      authorized: false,
      error: errorMessage,
      response: NextResponse.json(
        {
          error: isExpired
            ? 'Session expired. Please login again.'
            : 'Authentication failed. Please login again.'
        },
        { status: 401 }
      )
    };
  }
}

/**
 * Legacy compatibility - will be removed in future
 * @deprecated Use verifyAdmin instead
 */
export async function verifyAdminToken(request: NextRequest): Promise<{ authorized: boolean; uid?: string }> {
  const result = await verifyAdmin(request);
  return { authorized: result.authorized, uid: result.uid };
}

/**
 * Legacy compatibility - will be removed in future
 * @deprecated Response is now included in verifyAdmin result
 */
export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized. Admin access required.' },
    { status: 401 }
  );
}

