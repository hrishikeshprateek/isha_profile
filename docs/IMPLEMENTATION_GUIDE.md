# Implementation Guide - Centralized Firebase Admin Auth

## Quick Start

### 1. Create an Admin User

```bash
npm run create-admin
# or
node scripts/create-admin-firebase.js admin@example.com Password123!
```

### 2. Login to Admin Panel

Navigate to `http://localhost:3000/admin/login`

**Default Credentials:**
- Email: `admin@isharani.in`
- Password: `AdminPass123!`

### 3. Access Protected Routes

The following routes are now protected and require Firebase admin authentication:
- `/admin` - Admin dashboard
- `/api/admin/*` - All admin API endpoints

---

## File Structure

```
lib/
├── firebase.ts                    # Client Firebase SDK
├── firebase-admin.ts              # Server Firebase Admin SDK
├── auth.ts                        # JWT utilities (legacy)
├── auth-middleware.ts             # ✨ NEW: API route protection
├── api-client.ts                  # ✨ NEW: Authenticated API client
└── firebase-auth-context.tsx      # ✨ NEW: Client auth context

app/
├── admin/
│   ├── page.tsx                   # ✨ UPDATED: Client-side auth check
│   └── login/
│       └── page.tsx               # ✨ UPDATED: Firebase + admin claim check
└── api/
    ├── auth/
    │   ├── login/
    │   │   └── route.ts           # ✨ UPDATED: Firebase token verification
    │   └── logout/
    │       └── route.ts           # ✨ NEW: Logout endpoint
    └── admin/
        ├── dashboard/
        │   └── route.ts           # ✨ NEW: Example protected endpoint
        └── blogs/
            └── route.ts           # ✨ NEW: Blog management endpoints

components/
└── hooks/
    ├── use-admin-api.ts           # ✨ NEW: Admin API hook
    └── use-admin-blogs.ts         # ✨ NEW: Blog management hook

scripts/
└── create-admin-firebase.js       # ✨ FIXED: Shebang line
```

---

## How It Works

### Authentication Flow

```
1. User enters credentials in /admin/login
   ↓
2. Firebase signInWithEmailAndPassword() (client-side)
   ↓
3. Get ID token with getIdTokenResult()
   ↓
4. Verify admin claim exists (custom claim set by Firebase Admin)
   ↓
5. Store token in localStorage ('admin_token')
   ↓
6. Redirect to /admin
   ↓
7. On /admin, verify token and admin claim again
   ↓
8. Show admin dashboard with all menu items
```

### API Protection

```
Protected Endpoints (require Authorization header):
GET /api/admin/dashboard
GET /api/admin/blogs
POST /api/admin/blogs
PUT /api/admin/blogs/:id
DELETE /api/admin/blogs/:id

Header format:
Authorization: Bearer <firebase_id_token>

Flow:
1. Client sends request with token in Authorization header
   ↓
2. withAdminAuth middleware intercepts
   ↓
3. Firebase Admin SDK verifies token signature
   ↓
4. Verify custom claim admin === true
   ↓
5. Pass decoded token to handler
   ↓
6. Process request
```

---

## Usage Examples

### Example 1: Login Page (Already Implemented)

```tsx
"use client";

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  async function handleLogin(email: string, password: string) {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const idTokenResult = await credential.user.getIdTokenResult();

      // Verify admin claim
      if (!idTokenResult.claims.admin) {
        throw new Error('Admin privileges required');
      }

      // Store token
      localStorage.setItem('admin_token', idTokenResult.token);

      // Navigate to admin
      window.location.href = '/admin';
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  // render form...
}
```

### Example 2: Protected Page Component

```tsx
"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AdminBlogs() {
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

  return <div>Admin Blogs Content</div>;
}
```

### Example 3: Using Protected API with useAdminApi Hook

```tsx
"use client";

import { useEffect } from 'react';
import { useAdminBlogs } from '@/components/hooks/use-admin-blogs';

export default function BlogsManagement() {
  const { blogs, loading, error, fetchBlogs, createBlog } = useAdminBlogs();

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function handleCreateBlog() {
    try {
      await createBlog({
        title: 'New Blog Post',
        content: 'Blog content here...',
        category: 'Travel',
      });
      console.log('Blog created!');
    } catch (error) {
      console.error('Failed to create blog:', error);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={handleCreateBlog}>Create Blog</button>
      <ul>
        {blogs.map(blog => (
          <li key={blog._id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Example 4: Creating Protected API Endpoints

```typescript
// app/api/admin/blogs/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/auth-middleware';

export const PUT = withAdminAuth(async (request: NextRequest, user: any) => {
  const { id } = request.nextUrl.searchParams;
  const updates = await request.json();

  // user.uid = Firebase UID
  // user.email = User email
  // user.admin = true (guaranteed)

  // Update logic...
  return NextResponse.json({ success: true });
});

export const DELETE = withAdminAuth(async (request: NextRequest, user: any) => {
  const { id } = request.nextUrl.searchParams;

  // Delete logic...
  return NextResponse.json({ success: true });
});
```

### Example 5: Raw API Calls

```typescript
// Using apiCall from lib/api-client.ts

// Get token from localStorage
const token = localStorage.getItem('admin_token');

// Method 1: Using apiPost helper
import { apiPost } from '@/lib/api-client';

const { data, status } = await apiPost(
  '/api/admin/blogs',
  { title: 'New Post', content: '...' },
  true  // requireAuth: true
);

// Method 2: Raw fetch
const response = await fetch('/api/admin/blogs', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'New Post',
    content: '...',
  }),
});

const data = await response.json();
```

---

## Testing the Auth Flow

### 1. Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@isharani.in",
    "password": "AdminPass123!"
  }'
```

Expected Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token...",
  "user": {
    "email": "admin@isharani.in",
    "role": "admin"
  }
}
```

### 2. Test Protected Endpoint

```bash
# Get valid token first
TOKEN="<firebase_id_token>"

curl -X GET http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

Expected Response:
```json
{
  "success": true,
  "message": "Welcome to admin dashboard",
  "user": {
    "uid": "firebase-uid",
    "email": "admin@example.com",
    "isAdmin": true
  }
}
```

### 3. Test with Invalid Token

```bash
curl -X GET http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer invalid-token"
```

Expected Response:
```json
{
  "error": "Invalid or expired token"
}
```

---

## Environment Variables

### Required

```env
# Firebase (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx

# Firebase (Server-side)
FIREBASE_PROJECT_ID=xxx
FIREBASE_CLIENT_EMAIL=xxx@iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# MongoDB
MONGODB_URI=mongodb+srv://user:password@host/db
```

---

## Troubleshooting

### Issue: "Admin privileges required"

**Solution:**
```bash
# Check if user has admin claim
node scripts/create-admin-firebase.js your-email@example.com

# Or manually set via Firebase Console:
# Authentication → Users → Select user → Custom Claims
# Add: {"admin": true}
```

### Issue: "Invalid or expired token"

**Solution:**
- Token expires after 1 hour
- Client automatically refreshes on each `getIdToken()` call
- Check Authorization header format: `Bearer <token>` (with space)
- Check token is from localStorage, not from credential directly

### Issue: "Missing Authorization header"

**Solution:**
- Ensure token is passed: `Authorization: Bearer <token>`
- Check `api-client.ts` is setting header correctly
- Verify `requireAuth: true` is passed to API calls

### Issue: "Firebase not initialized"

**Solution:**
- Check `.env.local` has all `NEXT_PUBLIC_FIREBASE_*` variables
- Restart dev server after changing env variables
- Check browser console for Firebase initialization errors

---

## Next Steps

1. **Create Admin Pages:**
   - `/admin/blogs` - Blog management
   - `/admin/users` - User management
   - `/admin/settings` - Site settings

2. **Create Protected API Routes:**
   - `/api/admin/blogs/[id]` - Blog CRUD
   - `/api/admin/users` - User CRUD
   - `/api/admin/analytics` - Analytics data

3. **Add More Protected Pages:**
   - Analytics dashboard
   - User management interface
   - Content moderation tools

4. **Security Enhancements:**
   - Add rate limiting on auth endpoints
   - Add audit logging for admin actions
   - Add IP whitelisting
   - Add 2FA support

---

## References

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Custom Claims](https://firebase.google.com/docs/auth/admin/custom-claims)
- [Verify ID Tokens](https://firebase.google.com/docs/auth/admin/verify-id-tokens)

