"use client";
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (!success) {
      setError('Credenciales incorrectas. Intenta con admin@dashboard.com / admin123');
    }
  };

  const handleSSOLogin = async (provider: string) => {
    setError('');
    
    // Simulación de login SSO - En producción aquí irían las integraciones reales
    try {
      // Simular diferentes respuestas según el proveedor
      const mockUsers = {
        google: { email: 'usuario@gmail.com', name: 'Usuario Google' },
        microsoft: { email: 'usuario@hotmail.com', name: 'Usuario Microsoft' },
        github: { email: 'usuario@github.com', name: 'Usuario GitHub' },
        linkedin: { email: 'usuario@linkedin.com', name: 'Usuario LinkedIn' }
      };

      const userData = mockUsers[provider as keyof typeof mockUsers];
      
      if (userData) {
        // Simular login exitoso con SSO
        const success = await login(userData.email, 'sso_login');
        if (!success) {
          setError(`Error al iniciar sesión con ${provider}. Inténtalo nuevamente.`);
        }
      } else {
        setError(`Proveedor ${provider} no configurado correctamente.`);
      }
    } catch (error) {
      setError(`Error de conexión con ${provider}. Verifica tu conexión a internet.`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-white rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-blue-600">D</span>
          </div>
          <h2 className="text-3xl font-bold text-white">
            Bienvenido al Dashboard
          </h2>
          <p className="mt-2 text-blue-100">
            Inicia sesión para continuar
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                placeholder="admin@dashboard.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                placeholder="admin123"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-100 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-white/70">O continúa con</span>
            </div>
          </div>

          {/* SSO Buttons */}
          <div className="space-y-3">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleSSOLogin('google')}
              className="w-full flex items-center justify-center px-4 py-3 border border-white/20 rounded-lg shadow-sm bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>

            {/* Microsoft */}
            <button
              type="button"
              onClick={() => handleSSOLogin('microsoft')}
              className="w-full flex items-center justify-center px-4 py-3 border border-white/20 rounded-lg shadow-sm bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#F25022" d="M1 1h10v10H1z"/>
                <path fill="#00A4EF" d="M13 1h10v10H13z"/>
                <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                <path fill="#FFB900" d="M13 13h10v10H13z"/>
              </svg>
              Continuar con Microsoft
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-blue-100 text-sm">
              Credenciales de prueba: admin@dashboard.com / admin123
            </p>
            <p className="text-blue-100/70 text-xs mt-1">
              O prueba cualquier botón de SSO para demo
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
