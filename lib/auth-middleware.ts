import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export interface DecodedToken {
  uid: string;
  email?: string;
  admin?: boolean;
  iat: number;
  exp: number;
}

/**
 * Higher-order function to wrap API route handlers with token verification
 * Usage:
 *   export const POST = withAdminAuth(async (request, user) => {
 *     // user is the decoded Firebase token with admin claim verified
 *   });
 */
export function withAdminAuth(
  handler: (
    request: NextRequest,
    user: DecodedToken
  ) => Promise<Response>
) {
  return async (request: NextRequest): Promise<Response> => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Missing Authorization header' },
        { status: 401 }
      );
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    try {
      const decodedToken = await adminAuth.verifyIdToken(token);

      // Check for admin custom claim
      if (!decodedToken.admin) {
        return NextResponse.json(
          { error: 'Admin privileges required' },
          { status: 403 }
        );
      }

      // Call handler with decoded token
      return await handler(request, decodedToken as DecodedToken);
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
  };
}

