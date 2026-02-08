import React, { useCallback, useEffect, useState, createContext, useContext, Component } from 'react';
export type UserRole = 'tenant' | 'owner' | 'admin';
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
}
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, role: UserRole) => void;
  signup: (name: string, email: string, role: UserRole) => void;
  updateProfile: (data: Partial<User>) => void;
  logout: () => void;
  isLoading: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const initAuth = () => {
      try {
        // On first app load, clear previous session to show landing page
        const isFirstLoad = !sessionStorage.getItem('flatmate_session_started');
        if (isFirstLoad) {
          localStorage.removeItem('flatmate_user');
          sessionStorage.setItem('flatmate_session_started', 'true');
        }
        
        const storedUser = localStorage.getItem('flatmate_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to parse user from local storage', error);
        localStorage.removeItem('flatmate_user');
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);
  const login = useCallback((email: string, role: UserRole) => {
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0],
      email,
      role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=0D3A2F&color=fff`,
      phone: '+977 9800000000',
      address: 'Kathmandu, Nepal'
    };
    localStorage.setItem('flatmate_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
  }, []);
  const signup = useCallback((name: string, email: string, role: UserRole) => {
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D3A2F&color=fff`,
      phone: '',
      address: ''
    };
    localStorage.setItem('flatmate_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
  }, []);
  const updateProfile = useCallback((data: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser = {
        ...prevUser,
        ...data
      };
      localStorage.setItem('flatmate_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);
  const logout = useCallback(() => {
    localStorage.removeItem('flatmate_user');
    setUser(null);
    setIsAuthenticated(false);
  }, []);
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="w-8 h-8 border-4 border-button-primary border-t-transparent rounded-full animate-spin" />
      </div>;
  }
  return <AuthContext.Provider value={{
    isAuthenticated,
    user,
    login,
    signup,
    updateProfile,
    logout,
    isLoading
  }}>
      {children}
    </AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}