"use client";
import { useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: false,
    darkMode: false,
    language: 'es'
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Configuración</h2>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Preferencias Generales</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Notificaciones</h4>
              <p className="text-sm text-gray-500">Recibir notificaciones del sistema</p>
            </div>
            <button
              onClick={() => handleToggle('notifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Alertas por Email</h4>
              <p className="text-sm text-gray-500">Recibir alertas importantes por correo</p>
            </div>
            <button
              onClick={() => handleToggle('emailAlerts')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.emailAlerts ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emailAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Modo Oscuro</h4>
              <p className="text-sm text-gray-500">Cambiar al tema oscuro</p>
            </div>
            <button
              onClick={() => handleToggle('darkMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.darkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-900 mb-2">
              Idioma
            </label>
            <select
              id="language"
              value={settings.language}
              onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
              className="block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Seguridad</h3>
        </div>
        <div className="p-6 space-y-4">
          <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg">
            <div className="font-medium text-gray-900">Cambiar Contraseña</div>
            <div className="text-sm text-gray-500">Actualizar tu contraseña actual</div>
          </button>
          <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg">
            <div className="font-medium text-gray-900">Autenticación de Dos Factores</div>
            <div className="text-sm text-gray-500">Agregar una capa extra de seguridad</div>
          </button>
        </div>
      </div>
    </div>
  );
}
