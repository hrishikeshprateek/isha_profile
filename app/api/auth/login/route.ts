import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, Collections } from '@/lib/mongodb';
import { comparePassword, generateToken, isValidEmail, User } from '@/lib/auth';
import { adminAuth } from '@/lib/firebase-admin';
import { buildSessionCookie } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firebaseToken } = body;

    // Method 1: Firebase Token Login (for Firebase auth)
    if (firebaseToken) {
      try {
        // Verify Firebase token and check admin claim
        const decodedToken = await adminAuth.verifyIdToken(firebaseToken);

        // Enforce admin role via custom claim
        if (!decodedToken.admin) {
          return NextResponse.json(
            { error: 'Admin privileges required' },
            { status: 403 }
          );
        }

        const db = await getDatabase();
        const usersCollection = db.collection<User>(Collections.USERS);

        // Find or create user in MongoDB based on Firebase UID
        let user = await usersCollection.findOne({ firebaseUid: decodedToken.uid });

        if (!user) {
          // Create new user from Firebase data
          const newUser: User = {
            firebaseUid: decodedToken.uid,
            email: decodedToken.email || '',
            displayName: decodedToken.name || decodedToken.email?.split('@')[0],
            photoURL: decodedToken.picture || '',
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLogin: new Date(),
            isActive: true,
          };

          const result = await usersCollection.insertOne(newUser);
          user = { ...newUser, _id: result.insertedId };
        } else {
          // Update last login
          await usersCollection.updateOne(
            { firebaseUid: decodedToken.uid },
            { $set: { lastLogin: new Date() } }
          );
        }

        // Generate JWT token for session management
        const token = generateToken({
          userId: user._id!.toString(),
          email: user.email,
          role: user.role,
        });

        const response = NextResponse.json({
          success: true,
          message: 'Login successful',
          token,
          user: {
            id: user._id,
            firebaseUid: user.firebaseUid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: user.role,
          },
        });

        response.headers.set('Set-Cookie', buildSessionCookie(token));
        return response;
      } catch (firebaseError: any) {
        console.error('Firebase token verification error:', firebaseError);
        return NextResponse.json(
          { error: 'Invalid Firebase token or insufficient privileges' },
          { status: 401 }
        );
      }
    }

    // Method 2: Email/Password Login
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection<User>(Collections.USERS);

    // Find user
    const user = await usersCollection.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated. Please contact support.' },
        { status: 403 }
      );
    }

    // Verify password
    if (!user.password) {
      return NextResponse.json(
        { error: 'Password not set for this account. Please use social login.' },
        { status: 401 }
      );
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    // Generate JWT token
    const token = generateToken({
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: user.role,
      },
    });

    response.headers.set('Set-Cookie', buildSessionCookie(token));
    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
