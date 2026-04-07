// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'tenant' | 'landlord' | 'owner' | 'admin';

interface User {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (name: string, role: UserRole, email?: string) => void;
  signup: (name: string, email: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('flatmate_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error restoring user session:', error);
      localStorage.removeItem('flatmate_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (name: string, role: UserRole, email = '') => {
    const u: User = { name, email, role };
    setUser(u);
    localStorage.setItem('flatmate_user', JSON.stringify(u));
  };

  const signup = (name: string, email: string, role: UserRole) => {
    const u: User = { name, email, role };
    setUser(u);
    localStorage.setItem('flatmate_user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('flatmate_user');
    localStorage.removeItem('token');
    localStorage.removeItem('flatmate_token');
  };

  // Show loading state while checking for stored user
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-button-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
