"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
  canImpersonate?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  impersonate: (targetUserId: string) => Promise<boolean>;
  stopImpersonating: () => void;
  isImpersonating: boolean;
  originalUser: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [originalUser, setOriginalUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('user');
    const savedOriginalUser = localStorage.getItem('originalUser');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedOriginalUser) {
      setOriginalUser(JSON.parse(savedOriginalUser));
      setIsImpersonating(true);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulación de autenticación (en producción sería una llamada a API)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@dashboard.com' && password === 'admin123') {
      const userData = {
        id: '1',
        name: 'Marco Admin',
        email: email,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        isAdmin: true,
        canImpersonate: true
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }

    // Usuario normal sin permisos de administrador
    if (email === 'user@dashboard.com' && password === 'user123') {
      const userData = {
        id: '2',
        name: 'Usuario Normal',
        email: email,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
        isAdmin: false,
        canImpersonate: false
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsImpersonating(false);
    setOriginalUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('originalUser');
  };

  const impersonate = async (targetUserId: string): Promise<boolean> => {
    if (!user?.canImpersonate) {
      return false;
    }

    setIsLoading(true);
    
    // Simular búsqueda del usuario objetivo (en producción sería una llamada a API)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock de usuarios disponibles para suplantación
    const mockUsers: User[] = [
      {
        id: '2',
        name: 'Juan Vendedor',
        email: 'juan@company.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
        isAdmin: false,
        canImpersonate: false
      },
      {
        id: '3',
        name: 'María Manager',
        email: 'maria@company.com', 
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
        isAdmin: false,
        canImpersonate: false
      },
      {
        id: '4',
        name: 'Carlos Cliente',
        email: 'carlos@company.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
        isAdmin: false,
        canImpersonate: false
      }
    ];

    const targetUser = mockUsers.find(u => u.id === targetUserId);
    
    if (targetUser) {
      // Guardar el usuario original si no estamos ya suplantando
      if (!isImpersonating) {
        setOriginalUser(user);
        localStorage.setItem('originalUser', JSON.stringify(user));
      }
      
      setUser(targetUser);
      setIsImpersonating(true);
      localStorage.setItem('user', JSON.stringify(targetUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const stopImpersonating = () => {
    if (originalUser && isImpersonating) {
      setUser(originalUser);
      setIsImpersonating(false);
      setOriginalUser(null);
      localStorage.setItem('user', JSON.stringify(originalUser));
      localStorage.removeItem('originalUser');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      impersonate, 
      stopImpersonating, 
      isImpersonating, 
      originalUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
