'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthUser extends FirebaseUser {
  isAdmin?: boolean;
  token?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get ID token with custom claims
          const token = await firebaseUser.getIdToken();
          const decodedToken = await firebaseUser.getIdTokenResult();
          const isAdminUser = decodedToken.claims.admin === true;

          setUser({
            ...firebaseUser,
            isAdmin: isAdminUser,
            token,
          });
          setIsAdmin(isAdminUser);

          // Store token in localStorage for API calls
          if (isAdminUser) {
            localStorage.setItem('admin_token', token);
          }
        } else {
          setUser(null);
          setIsAdmin(false);
          localStorage.removeItem('admin_token');
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    if (!auth) return;
    await auth.signOut();
    localStorage.removeItem('admin_token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useFirebaseAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useFirebaseAuth must be used within FirebaseAuthProvider');
  }
  return context;
}

