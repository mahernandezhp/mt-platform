"use client";
import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  HomeIcon,
  BarChartIcon,
  FileTextIcon,
  GearIcon,
  ChevronDownIcon
} from '@radix-ui/react-icons';

interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  hasSubmenu: boolean;
  submenu?: Array<{
    id: string;
    label: string;
    description: string;
    icon?: any;
  }>;
}

interface NavigationMenuProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  items?: NavigationItem[];
}

export default function NavigationMenu({ 
  currentPage, 
  onNavigate, 
  items 
}: NavigationMenuProps) {
  
  // Default navigation items si no se pasan items
  const defaultNavigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Inicio',
      icon: HomeIcon,
      hasSubmenu: false
    },
    {
      id: 'sales',
      label: 'Ventas',
      icon: BarChartIcon,
      hasSubmenu: true,
      submenu: [
        { id: 'leads', label: 'Leads', description: 'Gestionar leads potenciales' },
        { id: 'opportunities', label: 'Oportunidades', description: 'Seguimiento de ventas' },
        { id: 'accounts', label: 'Cuentas', description: 'Gestión de clientes' },
        { id: 'contacts', label: 'Contactos', description: 'Base de contactos' }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChartIcon,
      hasSubmenu: true,
      submenu: [
        { id: 'reports', label: 'Reportes', description: 'Informes y análisis' },
        { id: 'dashboards', label: 'Dashboards', description: 'Paneles de control' },
        { id: 'metrics', label: 'Métricas', description: 'KPIs y métricas' }
      ]
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: FileTextIcon,
      hasSubmenu: true,
      submenu: [
        { id: 'campaigns', label: 'Campañas', description: 'Gestión de campañas' },
        { id: 'leads-marketing', label: 'Lead Generation', description: 'Generación de leads' },
        { id: 'social', label: 'Redes Sociales', description: 'Marketing digital' }
      ]
    },
    {
      id: 'service',
      label: 'Servicio',
      icon: GearIcon,
      hasSubmenu: true,
      submenu: [
        { id: 'cases', label: 'Casos', description: 'Gestión de casos' },
        { id: 'knowledge', label: 'Base de Conocimiento', description: 'Artículos y FAQ' },
        { id: 'community', label: 'Comunidad', description: 'Foros y comunidad' }
      ]
    }
  ];

  const navigationItems = items || defaultNavigationItems;

  return (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        
        // Si es el indicador de la app actual (primer elemento), mostrarlo como no clickeable
        if ((item as any).isAppIndicator) {
          return (
            <div 
              key={item.id}
              className="flex items-center px-4 py-3 text-base font-bold text-gray-600 bg-gray-50 border-b border-gray-200 cursor-default"
            >
              {item.label}
            </div>
          );
        }
        
        // Para otros items, mantener el comportamiento normal
        return (
          <div key={item.id} className="flex items-center">
            {/* Botón principal clickeable para navegar a la lista */}
            <button 
              className={`flex items-center px-4 py-3 text-sm font-medium transition-colors border-b-2 flex-1 ${
                (() => {
                  // Si tiene submenú, extraer el tipo de objeto para comparar
                  if (item.hasSubmenu) {
                    const objectType = item.id.split('-').pop();
                    return currentPage === objectType || currentPage === item.id || 
                           (item.submenu && item.submenu.some(sub => sub.id === currentPage))
                      ? 'text-blue-600 border-blue-600 bg-blue-50' 
                      : 'text-gray-700 border-transparent hover:text-blue-600 hover:bg-gray-50';
                  } else {
                    // Para items sin submenú (como Home), comparar directamente
                    const isActive = currentPage === item.id;
                    return isActive
                      ? 'text-blue-600 border-blue-600 bg-blue-50' 
                      : 'text-gray-700 border-transparent hover:text-blue-600 hover:bg-gray-50';
                  }
                })()
              }`}
              onClick={() => {
                // Si tiene submenú, navegar a la lista del objeto
                if (item.hasSubmenu) {
                  // Extraer el tipo de objeto del id (ej: sales-cloud-accounts -> accounts)
                  const objectType = item.id.split('-').pop();
                  onNavigate(objectType || item.id); // Navegar a la lista (ej: 'accounts', 'leads', etc.)
                } else {
                  // Si no tiene submenú, navegación normal
                  onNavigate(item.id);
                }
              }}
            >
              {Icon && <Icon className="w-4 h-4 mr-2" />}
              {item.label}
            </button>

            {/* Dropdown para submenú (solo si tiene submenú) */}
            {item.hasSubmenu && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="px-2 py-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors border-b-2 border-transparent">
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[300px] bg-white rounded-lg shadow-lg border p-2"
                    sideOffset={5}
                    align="center"
                  >
                  {item.submenu?.map((subItem) => {
                    // Si es un separador, renderizar como texto no clickeable
                    if ((subItem as any).isSeparator) {
                      return (
                        <div 
                          key={subItem.id}
                          className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide border-t border-gray-200 mt-2 pt-3"
                        >
                          Recientes
                        </div>
                      );
                    }
                    
                    // Para items normales (crear + recientes)
                    const SubIcon = subItem.icon;
                    return (
                      <DropdownMenu.Item
                        key={subItem.id}
                        className="flex items-start px-3 py-3 text-sm rounded hover:bg-gray-100 cursor-pointer"
                        onClick={() => onNavigate(subItem.id)}
                      >
                        <div className="flex items-start w-full">
                          {SubIcon && <SubIcon className="w-4 h-4 mr-3 mt-0.5 text-gray-500" />}
                          <div className="flex-1">
                            <span className="font-medium text-gray-900 block">{subItem.label}</span>
                            <span className="text-xs text-gray-500 mt-1 block">{subItem.description}</span>
                          </div>
                        </div>
                      </DropdownMenu.Item>
                    );
                  })}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            )}
          </div>
        );
      })}
    </>
  );
}