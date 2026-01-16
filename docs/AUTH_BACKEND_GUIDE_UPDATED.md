# Centralized Firebase Admin Authentication Guide

## Overview

This guide explains the centralized Firebase authentication system for admin access. The system uses Firebase Authentication with custom claims to enforce admin role at both the client and backend level.

## Architecture

### Components

1. **Firebase Admin SDK** (`lib/firebase-admin.ts`)
   - Server-side initialization
   - Sets custom `admin` claim on Firebase users
   - Verifies ID tokens

2. **Firebase Client SDK** (`lib/firebase.ts`)
   - Client-side authentication
   - Handles sign-in/sign-out
   - Manages ID token retrieval

3. **Authentication Middleware** (`lib/auth-middleware.ts`)
   - `withAdminAuth()` - Higher-order function for protecting API routes
   - Automatically verifies Firebase ID token
   - Checks admin custom claim

4. **API Client Helper** (`lib/api-client.ts`)
   - `apiCall()`, `apiGet()`, `apiPost()`, etc.
   - Automatically attaches Firebase ID token to requests
   - Supports both client and server-side calls

5. **Firebase Auth Context** (`lib/firebase-auth-context.tsx`)
   - Centralized user state management
   - Exposes `useFirebaseAuth()` hook

## Flow Diagram

```
User Login (admin/login)
    ↓
Firebase signInWithEmailAndPassword()
    ↓
Get ID Token with custom claims
    ↓
Verify admin claim exists
    ↓
Store token in localStorage
    ↓
Redirect to /admin
    ↓
Protected Pages/APIs use Authorization: Bearer <token>
    ↓
Backend verifies token with Firebase Admin SDK
    ↓
Check admin custom claim
    ↓
Process request
```

## Creating an Admin User

Use the provided script to create Firebase admin users:

```bash
npm run create-admin -- admin@example.com Password123!
```

Or manually:

```bash
node scripts/create-admin-firebase.js admin@example.com Password123!
```

The script:
1. Creates Firebase user with email/password
2. Sets custom claim `admin: true`
3. Upserts user in MongoDB with admin role

## Setting Custom Claims in Firebase

### Option 1: Using the Script (Recommended)

```bash
node scripts/create-admin-firebase.js
```

### Option 2: Manual via Firebase Console

1. Go to Firebase Console → Authentication → Users
2. Click on user → Custom Claims
3. Add: `{"admin": true}`

### Option 3: Programmatically

```javascript
// In Node.js/Express backend
const admin = require('firebase-admin');

await admin.auth().setCustomUserClaims(uid, { admin: true });
```

## Client-Side Usage

### Login Page

```tsx
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

async function handleLogin(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const idTokenResult = await credential.user.getIdTokenResult();

  // Check admin claim
  if (!idTokenResult.claims.admin) {
    throw new Error('Admin privileges required');
  }

  // Store token for API calls
  localStorage.setItem('admin_token', idTokenResult.token);
}
```

### Protected Pages

```tsx
"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.admin) {
        localStorage.setItem('admin_token', idTokenResult.token);
        setIsAuthorized(true);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!isAuthorized) return <div>Loading...</div>;

  return <div>Admin Content</div>;
}
```

### Using Auth Context

```tsx
import { useFirebaseAuth } from '@/lib/firebase-auth-context';

export default function MyComponent() {
  const { user, isAdmin, getToken, logout } = useFirebaseAuth();

  if (!isAdmin) return <div>Not authorized</div>;

  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={logout}>Sign out</button>
    </div>
  );
}
```

### Making Authenticated API Calls

```tsx
import { apiPost, apiGet } from '@/lib/api-client';

// Client-side
const { data, status } = await apiPost(
  '/api/admin/blogs',
  { title: 'New Blog' },
  true // requireAuth = true
);

// Server-side with Bearer token in headers
const response = await fetch('/api/admin/blogs', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

## Backend API Protection

### Using `withAdminAuth` Wrapper

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/auth-middleware';

// Automatically verifies token and admin claim
export const POST = withAdminAuth(async (request: NextRequest, user: any) => {
  // user is decoded Firebase token
  // user.uid, user.email, user.admin (always true here)

  const body = await request.json();

  // Process authenticated request
  return NextResponse.json({
    success: true,
    createdBy: user.email,
  });
});
```

### Manual Token Verification

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split('Bearer ')[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(token!);

    if (!decodedToken.admin) {
      return NextResponse.json(
        { error: 'Admin required' },
        { status: 403 }
      );
    }

    // Use decodedToken for request
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}
```

## Environment Variables

### Client-Side (Public)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
```

### Server-Side (Secret)

```env
FIREBASE_PROJECT_ID=xxx
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@xxx.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

## Security Best Practices

1. **Always verify admin claim** on backend before processing sensitive requests
2. **Use HTTPS only** for token transmission
3. **Set token expiration** - Firebase tokens expire in 1 hour by default
4. **Refresh tokens periodically** - Client automatically refreshes on `getIdToken()`
5. **Store tokens securely** - Use httpOnly cookies for sensitive operations
6. **Revoke access quickly** - Remove admin claim to immediately revoke access

## Troubleshooting

### "Admin privileges required" error

- Check that user has admin claim set: `firebase.auth().getIdTokenResult()` should show `admin: true` in custom claims
- Run: `node scripts/create-admin-firebase.js email@example.com`

### "Invalid token" error

- Token may have expired - refresh with `getIdToken(true)`
- Check Authorization header format: `Bearer <token>` (with space)

### Token not in localStorage

- Check browser DevTools → Application → LocalStorage
- Ensure `localStorage.setItem()` is called after successful login
- Check if localStorage is disabled in browser settings

### Firebase SDK not initialized

- Check `.env.local` has all `NEXT_PUBLIC_FIREBASE_*` variables
- Verify Firebase project credentials are correct
- Check browser console for initialization errors

## Examples

See `/examples/` directory for complete working examples.

## References

- [Firebase Admin SDK](https://firebase.google.com/docs/auth/admin/manage-users)
- [Custom Claims](https://firebase.google.com/docs/auth/admin/custom-claims)
- [ID Tokens](https://firebase.google.com/docs/auth/admin/verify-id-tokens)

