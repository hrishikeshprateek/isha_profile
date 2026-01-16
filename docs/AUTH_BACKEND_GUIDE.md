# Authentication Backend - Complete Setup Guide

## 🎯 Overview

This backend uses:
- **MongoDB** - User data storage
- **Firebase Authentication** - User management & social auth
- **JWT Tokens** - Session management
- **Next.js API Routes** - RESTful API endpoints

---

## 📦 Installation

All dependencies are already installed. If you need to reinstall:

```bash
npm install mongodb firebase firebase-admin bcryptjs jsonwebtoken dotenv
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

---

## ⚙️ Configuration

### 1. Environment Variables

Update `.env.local` with your Firebase credentials:

```env
# MongoDB (Already configured)
MONGODB_URI=mongodb+srv://ishra0317_db_user:DVGJYhcbUkfvjOqU@cluster0.mongodb.net/isha_portfolio?retryWrites=true&w=majority
MONGODB_DB=isha_portfolio

# JWT Secret (Generate a strong random key)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# Firebase Client SDK (Get from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin SDK (Get from Firebase Console > Project Settings > Service Accounts)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
```

### 2. Get Firebase Credentials

**Client SDK (Frontend):**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project or create a new one
3. Go to Project Settings > General
4. Under "Your apps", add a Web app
5. Copy the `firebaseConfig` values to `.env.local`

**Admin SDK (Backend):**
1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract values and add to `.env.local`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the \n characters)

---

## 🚀 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### 1. **Register User**

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "displayName": "John Doe"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "firebaseUid": "firebase-unique-id",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "user"
  }
}
```

**Error Responses:**
- `400` - Validation error (invalid email, weak password)
- `409` - User already exists
- `500` - Server error

---

### 2. **Login User**

**Endpoint:** `POST /api/auth/login`

**Method 1: Email/Password**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Method 2: Firebase Token (Social Auth)**
```json
{
  "firebaseToken": "firebase-id-token"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "firebaseUid": "firebase-unique-id",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoURL": "https://...",
    "role": "user"
  }
}
```

**Error Responses:**
- `400` - Missing credentials
- `401` - Invalid credentials
- `403` - Account deactivated
- `500` - Server error

---

### 3. **Get Current User**

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "firebaseUid": "firebase-unique-id",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoURL": "https://...",
    "role": "user",
    "createdAt": "2026-01-14T10:30:00.000Z",
    "lastLogin": "2026-01-14T15:45:00.000Z"
  }
}
```

**Error Responses:**
- `401` - No token or invalid token
- `403` - Account deactivated
- `404` - User not found
- `500` - Server error

---

## 🔧 Create User from Console

Use the admin script to create users directly:

```bash
npm run create-user
```

**Interactive Prompts:**
```
Enter email: admin@isharani.in
Enter password (min 8 chars): AdminPass123!
Enter display name: Isha Rani
Enter role (admin/user) [default: user]: admin
Confirm creation? (yes/no): yes
```

**Output:**
```
✅ User created successfully!
   User ID: 65f1a2b3c4d5e6f7g8h9i0j1
   Email: admin@isharani.in
   Role: admin
```

---

## 📁 Project Structure

```
lib/
├── mongodb.ts          # MongoDB connection & collections
├── firebase.ts         # Firebase client SDK (frontend)
├── firebase-admin.ts   # Firebase admin SDK (backend)
└── auth.ts            # Auth utilities (JWT, password hashing)

app/api/auth/
├── register/route.ts   # POST /api/auth/register
├── login/route.ts      # POST /api/auth/login
└── me/route.ts        # GET /api/auth/me

scripts/
└── create-user.js     # Console user creation script
```

---

## 🔐 Security Features

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

### JWT Tokens
- 7-day expiration
- Secure secret key
- Contains: userId, email, role

### Password Hashing
- bcrypt with salt rounds: 10
- Passwords never stored in plain text

### Firebase Integration
- Social authentication ready (Google, GitHub, etc.)
- Secure token verification
- User management UI available

---

## 🧪 Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "displayName": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

**Get User (replace TOKEN):**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman/Insomnia

1. Create a new request
2. Set method and URL
3. Add headers and body as shown above
4. Send request

---

## 📊 Database Schema

### Users Collection
```typescript
{
  _id: ObjectId,
  firebaseUid: string,        // Firebase user ID
  email: string,              // Unique, lowercase
  password: string,           // Hashed (optional for social auth)
  displayName: string,        // User's display name
  photoURL: string,           // Profile picture URL
  role: "admin" | "user",    // User role
  createdAt: Date,           // Account creation date
  updatedAt: Date,           // Last update date
  lastLogin: Date,           // Last login timestamp
  isActive: boolean          // Account status
}
```

---

## 🎨 Frontend Integration Example

```typescript
// Login function
async function login(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Store token
    localStorage.setItem('token', data.token);
    // Store user data
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }
  
  throw new Error(data.error);
}

// Get current user
async function getCurrentUser() {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  return response.json();
}

// Logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Check MongoDB URI in `.env.local`
- Verify IP whitelist in MongoDB Atlas
- Check network connectivity

### Firebase Errors
- Verify all Firebase credentials are correct
- Check Firebase project is active
- Ensure private key has proper formatting (\n)

### JWT Token Issues
- Ensure JWT_SECRET is at least 32 characters
- Check token expiration (7 days default)
- Verify Authorization header format: `Bearer TOKEN`

---

## 🚀 Next Steps

1. **Enable Firebase Social Auth:**
   - Go to Firebase Console > Authentication > Sign-in method
   - Enable Google, GitHub, etc.

2. **Add Protected Routes:**
   - Create middleware to verify JWT tokens
   - Check user roles for admin access

3. **Add More Features:**
   - Password reset
   - Email verification
   - Profile update
   - User roles & permissions

---

## 📝 Notes

- All passwords are hashed with bcrypt (never stored in plain text)
- JWT tokens expire after 7 days
- MongoDB collections are created automatically
- Firebase handles social authentication
- User roles: `admin` or `user` (default: `user`)

---

## 📞 Support

For issues or questions:
- Check logs in terminal
- Verify environment variables
- Test with console script first
- Check MongoDB Atlas dashboard

---

**Status:** ✅ Backend Ready | **Version:** 1.0.0 | **Date:** January 14, 2026

