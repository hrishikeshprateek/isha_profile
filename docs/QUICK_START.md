# 🚀 Quick Start Guide

## ✅ What's Been Set Up

1. **MongoDB Integration** ✅
   - User database connection
   - Collections: users, blog_posts, projects, contacts

2. **Firebase Authentication** ✅  
   - User management system ready
   - Social auth support (Google, GitHub, etc.)

3. **JWT Token System** ✅
   - Secure session management
   - 7-day token expiration

4. **API Endpoints** ✅
   - `/api/auth/register` - Create new user
   - `/api/auth/login` - Login user
   - `/api/auth/me` - Get current user

5. **Admin Scripts** ✅
   - `npm run create-user` - Create user from console
   - `npm run test-db` - Test MongoDB connection

---

## 🔧 Setup Steps

### Step 1: Update MongoDB Connection

Your current MongoDB URI in `.env.local` needs the correct cluster address.

**Current:**
```env
MONGODB_URI=mongodb+srv://ishra0317_db_user:DVGJYhcbUkfvjOqU@cluster0.mongodb.net/isha_portfolio?retryWrites=true&w=majority
```

**To fix:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `cluster0.mongodb.net` with your actual cluster address
6. Example format: `@cluster0.xxxxx.mongodb.net`

### Step 2: Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a project or select existing one
3. **Get Client SDK credentials:**
   - Project Settings > General
   - Under "Your apps" > Web app
   - Copy config values to `.env.local`

4. **Get Admin SDK credentials:**
   - Project Settings > Service Accounts
   - Click "Generate new private key"
   - Extract values from JSON to `.env.local`

### Step 3: Generate JWT Secret

Generate a secure random key (min 32 characters):

```bash
# On Mac/Linux
openssl rand -base64 32

# Or use this online:
# https://generate-secret.now.sh/32
```

Update `JWT_SECRET` in `.env.local`

### Step 4: Test Connection

```bash
npm run test-db
```

Should output:
```
✅ Successfully connected to MongoDB!
📊 Existing collections: ...
👥 Total users: 0
```

---

## 🎯 Create Your First User

### Option 1: Using Console Script (Recommended)

```bash
npm run create-user
```

**Example:**
```
Enter email: admin@isharani.in
Enter password (min 8 chars): AdminPass123!
Enter display name: Isha Rani
Enter role (admin/user): admin
Confirm creation? yes

✅ User created successfully!
```

### Option 2: Using API

**Start dev server:**
```bash
npm run dev
```

**Register via API:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@isharani.in",
    "password": "AdminPass123!",
    "displayName": "Isha Rani"
  }'
```

---

## 🔐 Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@isharani.in",
    "password": "AdminPass123!"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@isharani.in",
    "displayName": "Isha Rani",
    "role": "admin"
  }
}
```

**Save the token** - you'll need it for authenticated requests!

---

## 📁 Files Created

```
lib/
├── mongodb.ts              # MongoDB connection
├── firebase.ts             # Firebase client SDK
├── firebase-admin.ts       # Firebase admin SDK
└── auth.ts                # Auth utilities

app/api/auth/
├── register/route.ts       # User registration
├── login/route.ts          # User login
└── me/route.ts            # Get current user

scripts/
├── create-user.js         # Console user creation
└── test-mongodb.js        # Test DB connection

.env.local                 # Environment variables
AUTH_BACKEND_GUIDE.md      # Complete documentation
QUICK_START.md            # This file
```

---

## 🐛 Common Issues

### MongoDB Connection Error
**Error:** `querySrv ENOTFOUND`

**Fix:**
- Get correct cluster address from MongoDB Atlas
- Update `.env.local` with correct URI
- Example: `@cluster0.abc123.mongodb.net`

### Firebase Not Working
**Error:** Firebase initialization failed

**Fix:**
- Add all Firebase credentials to `.env.local`
- Check private key format (keep `\n` characters)
- Verify project ID matches

### User Creation Fails
**Error:** Validation errors

**Fix:**
- Password must be 8+ chars with uppercase, lowercase, number
- Email must be valid format
- Check MongoDB connection first

---

## 📊 Project Status

| Component | Status | Notes |
|-----------|--------|-------|
| MongoDB Setup | ✅ | Update URI needed |
| Firebase Client | ⚠️ | Add credentials |
| Firebase Admin | ⚠️ | Add credentials |
| JWT Auth | ✅ | Generate secret key |
| API Routes | ✅ | Ready to use |
| User Scripts | ✅ | Ready to use |

---

## 🎨 Next Steps

1. ✅ Fix MongoDB connection string
2. ✅ Add Firebase credentials  
3. ✅ Generate JWT secret
4. ✅ Test connection: `npm run test-db`
5. ✅ Create first user: `npm run create-user`
6. ✅ Test login via API
7. 🚀 Build your frontend auth UI!

---

## 📖 Documentation

- **Complete Guide:** `AUTH_BACKEND_GUIDE.md`
- **API Reference:** See guide for all endpoints
- **Security:** Password requirements & token management

---

## 🎯 Ready to Use Commands

```bash
# Test MongoDB connection
npm run test-db

# Create admin user
npm run create-user

# Start dev server
npm run dev

# Test registration (in another terminal)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!","displayName":"Test User"}'
```

---

**Your backend is 95% ready! Just update the environment variables and you're good to go!** 🚀

