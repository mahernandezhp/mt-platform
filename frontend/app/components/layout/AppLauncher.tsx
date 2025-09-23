"use client";
import { useState, useEffect } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import {
  BarChartIcon,
  GearIcon,
  FileTextIcon,
  Cross2Icon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  UpdateIcon,
  RocketIcon,
  ArchiveIcon
} from '@radix-ui/react-icons';

interface App {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  url?: string;
}

interface AppLauncherProps {
  selectedApp?: string;
  onAppSelect?: (appId: string) => void;
}

export default function AppLauncher({ 
  selectedApp,
  onAppSelect 
}: AppLauncherProps) {
  const [waffleDropdownOpen, setWaffleDropdownOpen] = useState(false);
  const [showAppLauncherModal, setShowAppLauncherModal] = useState(false);
  const [activeTab, setActiveTab] = useState('apps');
  const [appsCollapsed, setAppsCollapsed] = useState(false);
  const [shortcutsCollapsed, setShortcutsCollapsed] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState('');

  // Apps disponibles
  const apps: App[] = [
    {
      id: 'sales-cloud',
      name: 'Sales',
      description: 'Gestión de ventas y CRM',
      icon: BarChartIcon,
      color: 'bg-blue-500',
      url: '/sales'
    },
    {
      id: 'service-cloud',
      name: 'Service',
      description: 'Atención al cliente',
      icon: GearIcon,
      color: 'bg-green-500',
      url: '/service'
    },
    {
      id: 'marketing-cloud',
      name: 'Marketing',
      description: 'Automatización de marketing',
      icon: FileTextIcon,
      color: 'bg-purple-500',
      url: '/marketing'
    },
    {
      id: 'analytics-cloud',
      name: 'Analytics',
      description: 'Inteligencia de negocios',
      icon: BarChartIcon,
      color: 'bg-orange-500',
      url: '/analytics'
    }
  ];

  const shortcuts = [
    { id: 'reports', name: 'Reportes', icon: FileTextIcon, color: 'bg-indigo-500' },
    { id: 'dashboards', name: 'Dashboards', icon: BarChartIcon, color: 'bg-pink-500' },
    { id: 'leads', name: 'Leads', icon: BarChartIcon, color: 'bg-blue-500' },
    { id: 'opportunities', name: 'Oportunidades', icon: BarChartIcon, color: 'bg-green-500' }
  ];

  const handleAppClick = (app: App) => {
    if (onAppSelect) {
      onAppSelect(app.id);
    }
    setShowAppLauncherModal(false);
    setWaffleDropdownOpen(false);
  };

  const filteredApps = modalSearchQuery.length > 0 
    ? apps.filter(app =>
        app.name.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(modalSearchQuery.toLowerCase())
      )
    : apps;

  const filteredShortcuts = modalSearchQuery.length > 0 
    ? shortcuts.filter(shortcut =>
        shortcut.name.toLowerCase().includes(modalSearchQuery.toLowerCase())
      )
    : shortcuts;

  // Expandir secciones automáticamente cuando hay búsqueda
  useEffect(() => {
    if (modalSearchQuery.length > 0) {
      setAppsCollapsed(false);
      setShortcutsCollapsed(false);
    }
  }, [modalSearchQuery]);

  return (
    <>
      {/* Waffle Button con Dropdown */}
      <DropdownMenu.Root open={waffleDropdownOpen} onOpenChange={setWaffleDropdownOpen}>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center px-3 py-3 mr-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:bg-gray-50 text-gray-700 hover:text-blue-600">
            <div className="grid grid-cols-3 gap-1 w-5 h-5">
              <div className="w-1 h-1 bg-current rounded-sm"></div>
              <div className="w-1 h-1 bg-current rounded-sm"></div>
              <div className="w-1 h-1 bg-current rounded-sm"></div>
              <div className="w-1 h-1 bg-current rounded-sm"></div>
              <div className="w-1 h-1 bg-current rounded-sm"></div>
              <div className="w-1 h-1 bg-current rounded-sm"></div>
              <div className="w-1 h-1 bg-current rounded-sm"></div>
              <div className="w-1 h-1 bg-current rounded-sm"></div>
              <div className="w-1 h-1 bg-current rounded-sm"></div>
            </div>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-[480px] bg-white rounded-lg shadow-xl border p-0 z-50"
            sideOffset={5}
            align="start"
          >
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-800">Selector de aplicaciones</h3>
              <p className="text-sm text-gray-600">Accede a todas tus aplicaciones Salesforce</p>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4">
                {apps.map((app) => (
                  <DropdownMenu.Item
                    key={app.id}
                    className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleAppClick(app)}
                  >
                    <div className={`w-12 h-12 ${app.color} rounded-lg flex items-center justify-center mb-2`}>
                      <app.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 text-center mb-1">{app.name}</h4>
                    <p className="text-xs text-gray-500 text-center line-clamp-2">{app.description}</p>
                  </DropdownMenu.Item>
                ))}
              </div>
            </div>
            
            <div className="border-t p-4 bg-gray-50">
              <button 
                className="w-full text-center py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => {
                  setWaffleDropdownOpen(false);
                  setShowAppLauncherModal(true);
                  setModalSearchQuery('');
                }}
              >
                Ver todas las aplicaciones
              </button>
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* Modal Completo del App Launcher */}
      {showAppLauncherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowAppLauncherModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gray-50">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Selector de aplicaciones</h2>
                <p className="text-sm text-gray-600">Accede a todas tus aplicaciones y objetos del sistema</p>
              </div>
              <button
                onClick={() => setShowAppLauncherModal(false)}
                className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-700"
              >
                <Cross2Icon className="w-5 h-5" />
              </button>
            </div>

            {/* Search Box */}
            <div className="px-6 py-4 border-b bg-white">
              <div className="relative">
                <div className="flex items-center w-full bg-gray-50 rounded-lg border">
                  <svg className="w-5 h-5 text-gray-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Buscar aplicaciones y objetos..."
                    value={modalSearchQuery}
                    onChange={(e) => setModalSearchQuery(e.target.value)}
                    className="flex-1 px-3 py-2 bg-transparent outline-none text-sm"
                  />
                  {modalSearchQuery && (
                    <button
                      onClick={() => setModalSearchQuery('')}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Cross2Icon className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {modalSearchQuery && (
                  <p className="text-xs text-gray-500 mt-2">
                    Mostrando resultados para "{modalSearchQuery}"
                  </p>
                )}
              </div>
            </div>

            {/* Modal Body with Collapsible Sections */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              
              {/* Apps Section */}
              <div className="mb-6">
                <button
                  onClick={() => setAppsCollapsed(!appsCollapsed)}
                  className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                      <RocketIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-medium text-gray-800">Aplicaciones Salesforce</h3>
                      <p className="text-sm text-gray-600">Accede a las diferentes aplicaciones del sistema</p>
                    </div>
                  </div>
                  <ChevronDownIcon 
                    className={`w-5 h-5 text-gray-500 transition-transform ${appsCollapsed ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {!appsCollapsed && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                    {filteredApps.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredApps.map((app) => (
                          <button
                            key={app.id}
                            onClick={() => handleAppClick(app)}
                            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                          >
                            <div className={`w-12 h-12 ${app.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                              <app.icon className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-sm font-medium text-gray-900 text-center mb-1">{app.name}</h4>
                            <p className="text-xs text-gray-500 text-center line-clamp-2">{app.description}</p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-400 mb-2">
                          <RocketIcon className="w-12 h-12 mx-auto" />
                        </div>
                        <p className="text-gray-500">No se encontraron aplicaciones que coincidan con "{modalSearchQuery}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Shortcuts Section */}
              <div className="mb-6">
                <button
                  onClick={() => setShortcutsCollapsed(!shortcutsCollapsed)}
                  className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                      <ArchiveIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-medium text-gray-800">Accesos Directos a Objetos</h3>
                      <p className="text-sm text-gray-600">Accede directamente a los objetos del sistema</p>
                    </div>
                  </div>
                  <ChevronDownIcon 
                    className={`w-5 h-5 text-gray-500 transition-transform ${shortcutsCollapsed ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {!shortcutsCollapsed && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                    {filteredShortcuts.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredShortcuts.map((shortcut) => (
                          <button
                            key={shortcut.id}
                            onClick={() => {
                              console.log('Navegando a objeto:', shortcut.name);
                              setShowAppLauncherModal(false);
                              // onNavigate(shortcut.url); // Descomentar cuando esté listo
                            }}
                            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                          >
                            <div className={`w-12 h-12 ${shortcut.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                              <shortcut.icon className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-sm font-medium text-gray-900 text-center mb-1">{shortcut.name}</h4>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-400 mb-2">
                          <ArchiveIcon className="w-12 h-12 mx-auto" />
                        </div>
                        <p className="text-gray-500">No se encontraron objetos que coincidan con "{modalSearchQuery}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t p-4 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowAppLauncherModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}