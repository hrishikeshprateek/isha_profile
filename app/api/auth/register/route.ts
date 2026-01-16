import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, Collections } from '@/lib/mongodb';
import { hashPassword, isValidEmail, isValidPassword, User } from '@/lib/auth';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, displayName, method = 'email' } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection<User>(Collections.USERS);

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create user in Firebase
    let firebaseUser;
    try {
      firebaseUser = await adminAuth.createUser({
        email: email.toLowerCase(),
        password: password,
        displayName: displayName || email.split('@')[0],
      });
      console.log('✅ Firebase user created:', firebaseUser.uid);
    } catch (firebaseError: any) {
      console.error('❌ Firebase user creation error:', firebaseError);
      return NextResponse.json(
        { error: `Firebase error: ${firebaseError.message}` },
        { status: 500 }
      );
    }

    // Hash password for MongoDB storage
    const hashedPassword = await hashPassword(password);

    // Create user in MongoDB
    const newUser: User = {
      firebaseUid: firebaseUser.uid,
      email: email.toLowerCase(),
      password: hashedPassword,
      displayName: displayName || email.split('@')[0],
      photoURL: '',
      role: 'user', // Default role
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    const result = await usersCollection.insertOne(newUser);

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        user: {
          id: result.insertedId,
          firebaseUid: firebaseUser.uid,
          email: newUser.email,
          displayName: newUser.displayName,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}

