"use client";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import dynamic from 'next/dynamic';

// Lazy load components
const LoginForm = dynamic(() => import('./components/LoginForm'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  ),
});

const Dashboard = dynamic(() => import('./components/Dashboard'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  ),
});

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? <Dashboard /> : <LoginForm />;
}

export default function Home() {
  return (
    <AuthProvider>
      <div>
        <AppContent />
      </div>
    </AuthProvider>
  );
}
