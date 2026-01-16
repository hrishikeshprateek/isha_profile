# Firebase Admin Auth - Quick Reference

## 🚀 Quick Start

### 1. Create Admin User
```bash
npm run create-admin
# Uses defaults: admin@isharani.in / AdminPass123!

# Or custom
npm run create-admin your-email@example.com YourPassword123!
```

### 2. Start Dev Server
```bash
npm run dev
```

### 3. Login
```
URL: http://localhost:3000/admin/login
Email: admin@isharani.in
Password: AdminPass123!
```

---

## 📂 Key Files Reference

| File | Purpose | Use Case |
|------|---------|----------|
| `lib/auth-middleware.ts` | Protect API routes | `withAdminAuth()` wrapper |
| `lib/api-client.ts` | Authenticated HTTP calls | `apiPost()`, `apiGet()`, etc. |
| `lib/firebase-auth-context.tsx` | Client auth state | `useFirebaseAuth()` hook |
| `components/hooks/use-admin-api.ts` | Generic API hook | Making authenticated requests |
| `components/hooks/use-admin-blogs.ts` | Blog management | Blog CRUD operations |
| `app/admin/login/page.tsx` | Login page | User authentication |
| `app/admin/page.tsx` | Dashboard | Protected page example |
| `app/api/auth/login/route.ts` | Login endpoint | Backend auth sync |
| `app/api/admin/dashboard/route.ts` | Protected endpoint | Example protected route |

---

## 💻 Code Examples

### Protect an API Route
```typescript
import { withAdminAuth, DecodedToken } from '@/lib/auth-middleware';

export const POST = withAdminAuth(
  async (request: NextRequest, user: DecodedToken) => {
    // user.uid, user.email, user.admin are available
    return NextResponse.json({ success: true });
  }
);
```

### Use Admin API Hook
```tsx
import { useAdminApi } from '@/components/hooks/use-admin-api';

export default function MyComponent() {
  const api = useAdminApi();

  async function fetchData() {
    const { data } = await api.get('/api/admin/dashboard');
    console.log(data);
  }

  return <button onClick={fetchData}>Fetch</button>;
}
```

### Use Blog Hook
```tsx
import { useAdminBlogs } from '@/components/hooks/use-admin-blogs';

export default function BlogManager() {
  const { blogs, createBlog, updateBlog, deleteBlog } = useAdminBlogs();

  async function handleCreate() {
    await createBlog({
      title: 'New Post',
      content: 'Content...',
      category: 'Travel',
    });
  }

  return (
    <div>
      <button onClick={handleCreate}>Create Blog</button>
      {blogs.map(blog => <div key={blog._id}>{blog.title}</div>)}
    </div>
  );
}
```

### Make Protected API Call
```typescript
// Client side
const { data } = await apiPost(
  '/api/admin/blogs',
  { title: 'My Blog', content: '...' },
  true  // requireAuth: true
);

// With fetch
const response = await fetch('/api/admin/blogs', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
  },
  body: JSON.stringify({ title: 'My Blog' }),
});
```

---

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/login` - Login with Firebase token
- `POST /api/auth/logout` - Logout and clear session

### Admin
- `GET /api/admin/dashboard` - Get dashboard data
- `GET /api/admin/blogs` - List all blogs
- `POST /api/admin/blogs` - Create blog
- `PUT /api/admin/blogs/:id` - Update blog
- `DELETE /api/admin/blogs/:id` - Delete blog

All require: `Authorization: Bearer <firebase_id_token>`

---

## 🔐 Token Management

### Get Token (Client)
```typescript
// From localStorage
const token = localStorage.getItem('admin_token');

// Or from Firebase
const token = await auth.currentUser?.getIdToken();
```

### Verify Token (Server)
```typescript
import { adminAuth } from '@/lib/firebase-admin';

const decoded = await adminAuth.verifyIdToken(token);
// decoded.uid, decoded.email, decoded.admin
```

### Token Lifespan
- **Created:** On successful login
- **Expires:** 1 hour
- **Refresh:** Automatic when calling `getIdToken()`
- **Custom Claim:** `admin: true` (set permanently)

---

## 🐛 Troubleshooting

| Error | Solution |
|-------|----------|
| "Admin privileges required" | Run `npm run create-admin your-email@example.com` |
| "Invalid token" | Token expired? Login again. Format correct? `Bearer <token>` |
| "Missing Authorization header" | Add header: `Authorization: Bearer <token>` |
| "Firebase not initialized" | Check `.env.local` has `NEXT_PUBLIC_FIREBASE_*` vars |
| Can't login | Verify user exists in Firebase Console → Authentication |

---

## 📋 Checklist for New Admin Endpoints

When creating new protected endpoints:

- [ ] Import `withAdminAuth` and `DecodedToken` from `lib/auth-middleware`
- [ ] Wrap handler with `withAdminAuth()`
- [ ] Accept `user: DecodedToken` parameter
- [ ] Use `user.uid`, `user.email` for request info
- [ ] Return proper error responses (400, 403, 500)
- [ ] Test with Bearer token in curl/Postman
- [ ] Add JSDoc comments
- [ ] Type request/response properly

---

## 📚 Documentation

- **SETUP_COMPLETE.md** - Overview and quick start
- **IMPLEMENTATION_GUIDE.md** - Detailed guide with examples
- **AUTH_BACKEND_GUIDE_UPDATED.md** - Auth flow and references
- **CHECKLIST.md** - Complete checklist

---

## 🎯 Common Tasks

### Add New Admin User
```bash
npm run create-admin new-admin@example.com SecurePassword123!
```

### Reset Admin Password
```bash
# Via Firebase Console:
# Authentication → Users → Select user → Reset password
```

### Remove Admin Privileges
```bash
# Via Firebase Console:
# Authentication → Users → Select user → Custom Claims
# Remove admin claim
```

### Check Token in Browser
```
DevTools → Application → LocalStorage → admin_token
```

### Test Protected Endpoint
```bash
TOKEN=$(cat /path/to/token)
curl -X GET http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📱 Client-Side Auth Check Example

```tsx
"use client";
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function ProtectedPage() {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const token = await user.getIdTokenResult();
      if (token.claims.admin) {
        localStorage.setItem('admin_token', token.token);
        setAuthorized(true);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!authorized) return <div>Loading...</div>;
  return <div>Protected Content</div>;
}
```

---

## ⚡ Performance Tips

1. **Cache tokens** - Token is valid for 1 hour
2. **Lazy load hooks** - Use `useAdminApi` only when needed
3. **Batch requests** - Combine multiple calls if possible
4. **Error retry** - Implement retry logic for failed requests
5. **Token refresh** - Automatic every 1 hour, or manual with `getIdToken(true)`

---

## 🔒 Security Checklist

- [x] Verify Firebase token signature on every request
- [x] Check admin custom claim on every protected endpoint
- [x] Store tokens securely (localStorage or httpOnly cookie)
- [x] Use HTTPS only (enable in production)
- [x] Implement rate limiting (future)
- [x] Log admin actions (future)
- [x] Add 2FA support (future)

---

Last Updated: January 16, 2026

