import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';

export interface UserPayload {
  userId: string;
  email: string;
  role: string;
}

// Generate JWT Token
export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  });
}

// Verify JWT Token
export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Hash Password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare Password
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// User Types
export interface User {
  _id?: ObjectId;
  firebaseUid?: string;
  email: string;
  password?: string; // Optional - used for email/password auth
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

// Validate Email Format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate Password Strength
export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true };
}

