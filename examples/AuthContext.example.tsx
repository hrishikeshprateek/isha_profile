// Example: Authentication Context for Frontend
// Save this as: app/contexts/AuthContext.tsx

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase';

interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    // Guard: Only listen to Firebase auth state if auth is initialized
    const clientAuth = firebaseAuth;
    if (!clientAuth) {
      setLoading(false);
      return;
    }

    // Listen to Firebase auth state
    const unsubscribe = onAuthStateChanged(clientAuth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, get custom token from backend
        const idToken = await firebaseUser.getIdToken();
        await syncWithBackend(idToken);
      } else {
        // User is signed out
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync Firebase user with backend
  const syncWithBackend = async (firebaseToken: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebaseToken }),
      });

      const data = await response.json();

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch (error) {
      console.error('Backend sync error:', error);
    }
  };

  // Login with email/password
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Login failed');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Also sign in to Firebase if available
      try {
        if (firebaseAuth) {
          await signInWithEmailAndPassword(firebaseAuth, email, password);
        } else {
          console.warn('Firebase sign-in skipped (auth not initialized)');
        }
      } catch (err) {
        console.warn('Firebase sign-in failed:', err);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login error occurred';
      console.error('Login error:', message);
      throw error;
    }
  };

  // Register new user
  const register = async (email: string, password: string, displayName: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      // Auto-login after registration
      await login(email, password);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration error occurred';
      console.error('Registration error:', message);
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      if (!firebaseAuth) throw new Error('Firebase not initialized');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuth, provider);

      // Get Firebase token and sync with backend
      const idToken = await result.user.getIdToken();
      await syncWithBackend(idToken);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Google login error occurred';
      console.error('Google login error:', message);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      try {
        if (firebaseAuth) await signOut(firebaseAuth);
      } catch (err) {
        console.warn('Firebase signOut skipped (auth not initialized)');
      }
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Logout error occurred';
      console.error('Logout error:', message);
    }
  };

  const value = {
    user,
    loading,
    token,
    login,
    register,
    loginWithGoogle,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Example usage in components:
/*

// In app/layout.tsx:
import { AuthProvider } from './contexts/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

// In any component:
'use client';
import { useAuth } from '@/app/contexts/AuthContext';

export default function LoginPage() {
  const { login, register, loginWithGoogle, user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Redirect to dashboard
    } catch (error) {
      alert('Login failed');
    }
  };

  if (isAuthenticated) {
    return <div>Welcome, {user?.displayName}!</div>;
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
      <button type="button" onClick={loginWithGoogle}>
        Login with Google
      </button>
    </form>
  );
}

*/
