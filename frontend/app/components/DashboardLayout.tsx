"use client";
import { useState, useEffect, Suspense, lazy } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  HamburgerMenuIcon,
  PersonIcon,
  ExitIcon,
  HomeIcon,
  GearIcon,
  BarChartIcon,
  FileTextIcon,
  ChevronDownIcon,
  DotFilledIcon,
  Cross2Icon,
  BellIcon,
  ClockIcon,
  MixerHorizontalIcon,
  LockClosedIcon,
  UpdateIcon,
  QuestionMarkCircledIcon,
  RocketIcon,
  StarIcon,
  PlusIcon,
  ReaderIcon,
  CalendarIcon,
  EnvelopeClosedIcon,
  ChatBubbleIcon,
  ArchiveIcon,
  MaskOnIcon
} from '@radix-ui/react-icons';

// Lazy load de componentes del menú
const NavigationMenu = lazy(() => import('./layout/NavigationMenu'));
const AppLauncher = lazy(() => import('./layout/AppLauncher'));
const UserMenu = lazy(() => import('./layout/UserMenu'));

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

// Función helper para obtener el contenido del home desde fuera del componente
export const getAppHomeContent = (appId: string) => {
  const appHomes = {
    'sales-cloud': {
      title: 'Sales Home',
      description: 'Tu hub central para gestionar ventas y relaciones con clientes',
      quickActions: [
        { id: 'new-lead', label: 'Nuevo Lead', icon: 'PlusIcon', color: 'bg-blue-500' },
        { id: 'new-opportunity', label: 'Nueva Oportunidad', icon: 'RocketIcon', color: 'bg-green-500' },
        { id: 'new-account', label: 'Nueva Cuenta', icon: 'PersonIcon', color: 'bg-purple-500' },
        { id: 'view-pipeline', label: 'Ver Pipeline', icon: 'BarChartIcon', color: 'bg-orange-500' }
      ],
      recentItems: [
        { id: 1, title: 'Acme Corp - Oportunidad Q4', type: 'Oportunidad', updated: 'Hace 2 horas' },
        { id: 2, title: 'Juan Pérez - Lead Calificado', type: 'Lead', updated: 'Hace 4 horas' },
        { id: 3, title: 'TechStart Inc - Reunión Programada', type: 'Cuenta', updated: 'Ayer' }
      ]
    },
    // ... otros homes de apps
  };
  
  return appHomes[appId] || null;
};

// Interface para configuración de apps - preparado para API
interface AppConfig {
  selectedAppId: string;
  availableApps: any[];
  userPermissions: string[];
  lastUpdated: Date;
  defaultPage: string; // Página por defecto cuando no hay selección
  navigationState: {
    lastVisitedPage: string;
    favoritePages: string[];
  };
}

export default function DashboardLayout({ children, currentPage, onNavigate }: DashboardLayoutProps) {
  const { user, logout, impersonate, stopImpersonating, isImpersonating, originalUser } = useAuth();
  
  // App configuration state - later this will come from API
  const [appConfig, setAppConfig] = useState<AppConfig>({
    selectedAppId: 'sales-cloud', // Default to Sales Cloud app
    availableApps: [],
    userPermissions: [],
    lastUpdated: new Date()
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [selectedApp, setSelectedApp] = useState<string | null>(appConfig.selectedAppId); // App seleccionada actualmente

  // Mock de usuarios disponibles para suplantación
  const availableUsers = [
    {
      id: '2',
      name: 'Juan Vendedor',
      email: 'juan@company.com',
      role: 'Vendedor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'María Manager',
      email: 'maria@company.com',
      role: 'Manager de Ventas',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
    },
    {
      id: '4',
      name: 'Carlos Cliente',
      email: 'carlos@company.com',
      role: 'Especialista',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face'
    },
    {
      id: '5',
      name: 'Ana Directora',
      email: 'ana@company.com',
      role: 'Directora Regional',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
    }
  ];
  
  // Estructura de menú similar a Salesforce
  const navigationItems = [
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

  // Apps disponibles para el waffle menu
  const apps = [
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
      icon: RocketIcon,
      color: 'bg-purple-500',
      url: '/marketing'
    },
    {
      id: 'analytics-cloud',
      name: 'Analytics',
      description: 'Análisis y reportes',
      icon: BarChartIcon,
      color: 'bg-orange-500',
      url: '/analytics'
    },
    {
      id: 'commerce-cloud',
      name: 'Commerce',
      description: 'E-commerce y ventas online',
      icon: ArchiveIcon,
      color: 'bg-red-500',
      url: '/commerce'
    },
    {
      id: 'platform',
      name: 'Platform',
      description: 'Herramientas de desarrollo',
      icon: MixerHorizontalIcon,
      color: 'bg-gray-500',
      url: '/platform'
    },
    {
      id: 'community',
      name: 'Community',
      description: 'Foros y comunidad',
      icon: ChatBubbleIcon,
      color: 'bg-teal-500',
      url: '/community'
    },
    {
      id: 'einstein',
      name: 'Einstein',
      description: 'Inteligencia artificial',
      icon: StarIcon,
      color: 'bg-yellow-500',
      url: '/einstein'
    },
    {
      id: 'chatter',
      name: 'Chatter',
      description: 'Colaboración empresarial',
      icon: EnvelopeClosedIcon,
      color: 'bg-indigo-500',
      url: '/chatter'
    }
  ];

  // Accesos directos a objetos del sistema
  const shortcuts = [
    {
      id: 'accounts',
      name: 'Cuentas',
      description: 'Gestionar cuentas de clientes',
      icon: PersonIcon,
      color: 'bg-blue-500',
      url: '/objects/accounts'
    },
    {
      id: 'contacts',
      name: 'Contactos',
      description: 'Base de datos de contactos',
      icon: PersonIcon,
      color: 'bg-green-500',
      url: '/objects/contacts'
    },
    {
      id: 'leads',
      name: 'Leads',
      description: 'Gestión de leads potenciales',
      icon: RocketIcon,
      color: 'bg-orange-500',
      url: '/objects/leads'
    },
    {
      id: 'opportunities',
      name: 'Oportunidades',
      description: 'Pipeline de ventas',
      icon: BarChartIcon,
      color: 'bg-purple-500',
      url: '/objects/opportunities'
    },
    {
      id: 'cases',
      name: 'Casos',
      description: 'Tickets de soporte',
      icon: FileTextIcon,
      color: 'bg-red-500',
      url: '/objects/cases'
    },
    {
      id: 'campaigns',
      name: 'Campañas',
      description: 'Campañas de marketing',
      icon: RocketIcon,
      color: 'bg-pink-500',
      url: '/objects/campaigns'
    },
    {
      id: 'products',
      name: 'Productos',
      description: 'Catálogo de productos',
      icon: ArchiveIcon,
      color: 'bg-indigo-500',
      url: '/objects/products'
    },
    {
      id: 'contracts',
      name: 'Contratos',
      description: 'Gestión de contratos',
      icon: ReaderIcon,
      color: 'bg-gray-600',
      url: '/objects/contracts'
    },
    {
      id: 'tasks',
      name: 'Tareas',
      description: 'Lista de tareas pendientes',
      icon: CalendarIcon,
      color: 'bg-teal-500',
      url: '/objects/tasks'
    },
    {
      id: 'events',
      name: 'Eventos',
      description: 'Calendario y eventos',
      icon: CalendarIcon,
      color: 'bg-yellow-600',
      url: '/objects/events'
    },
    {
      id: 'documents',
      name: 'Documentos',
      description: 'Biblioteca de documentos',
      icon: ReaderIcon,
      color: 'bg-blue-600',
      url: '/objects/documents'
    },
    {
      id: 'reports',
      name: 'Reportes',
      description: 'Informes y analytics',
      icon: BarChartIcon,
      color: 'bg-green-600',
      url: '/objects/reports'
    }
  ];

  // Objetos específicos por aplicación
  const appObjects = {
    'sales-cloud': [
      { id: 'accounts', label: 'Cuentas', icon: PersonIcon, description: 'Gestionar cuentas de clientes' },
      { id: 'contacts', label: 'Contactos', icon: PersonIcon, description: 'Base de datos de contactos' },
      { id: 'leads', label: 'Leads', icon: RocketIcon, description: 'Gestión de leads potenciales' },
      { id: 'opportunities', label: 'Oportunidades', icon: BarChartIcon, description: 'Pipeline de ventas' },
      { id: 'products', label: 'Productos', icon: ArchiveIcon, description: 'Catálogo de productos' },
      { id: 'contracts', label: 'Contratos', icon: ReaderIcon, description: 'Gestión de contratos' }
    ],
    'service-cloud': [
      { id: 'cases', label: 'Casos', icon: FileTextIcon, description: 'Tickets de soporte' },
      { id: 'contacts', label: 'Contactos', icon: PersonIcon, description: 'Base de datos de contactos' },
      { id: 'accounts', label: 'Cuentas', icon: PersonIcon, description: 'Gestionar cuentas de clientes' },
      { id: 'tasks', label: 'Tareas', icon: CalendarIcon, description: 'Lista de tareas pendientes' },
      { id: 'events', label: 'Eventos', icon: CalendarIcon, description: 'Calendario y eventos' },
      { id: 'documents', label: 'Documentos', icon: ReaderIcon, description: 'Base de conocimiento' }
    ],
    'marketing-cloud': [
      { id: 'campaigns', label: 'Campañas', icon: RocketIcon, description: 'Campañas de marketing' },
      { id: 'leads', label: 'Leads', icon: RocketIcon, description: 'Gestión de leads potenciales' },
      { id: 'contacts', label: 'Contactos', icon: PersonIcon, description: 'Base de datos de contactos' },
      { id: 'accounts', label: 'Cuentas', icon: PersonIcon, description: 'Gestionar cuentas de clientes' },
      { id: 'events', label: 'Eventos', icon: CalendarIcon, description: 'Eventos de marketing' },
      { id: 'reports', label: 'Reportes', icon: BarChartIcon, description: 'Analytics de marketing' }
    ],
    'analytics-cloud': [
      { id: 'reports', label: 'Reportes', icon: BarChartIcon, description: 'Informes y analytics' },
      { id: 'dashboards', label: 'Dashboards', icon: BarChartIcon, description: 'Paneles de control' },
      { id: 'accounts', label: 'Cuentas', icon: PersonIcon, description: 'Análisis de cuentas' },
      { id: 'opportunities', label: 'Oportunidades', icon: BarChartIcon, description: 'Análisis de ventas' },
      { id: 'campaigns', label: 'Campañas', icon: RocketIcon, description: 'Análisis de marketing' },
      { id: 'cases', label: 'Casos', icon: FileTextIcon, description: 'Análisis de servicio' }
    ],
    'commerce-cloud': [
      { id: 'products', label: 'Productos', icon: ArchiveIcon, description: 'Catálogo de productos' },
      { id: 'accounts', label: 'Cuentas', icon: PersonIcon, description: 'Clientes' },
      { id: 'contacts', label: 'Contactos', icon: PersonIcon, description: 'Compradores' },
      { id: 'orders', label: 'Pedidos', icon: FileTextIcon, description: 'Gestión de pedidos' },
      { id: 'campaigns', label: 'Promociones', icon: RocketIcon, description: 'Campañas promocionales' },
      { id: 'reports', label: 'Reportes', icon: BarChartIcon, description: 'Analytics de ventas' }
    ],
    'platform': [
      { id: 'apps', label: 'Aplicaciones', icon: MixerHorizontalIcon, description: 'Apps personalizadas' },
      { id: 'objects', label: 'Objetos', icon: ArchiveIcon, description: 'Objetos personalizados' },
      { id: 'fields', label: 'Campos', icon: GearIcon, description: 'Campos personalizados' },
      { id: 'workflows', label: 'Flujos', icon: UpdateIcon, description: 'Automatizaciones' },
      { id: 'users', label: 'Usuarios', icon: PersonIcon, description: 'Gestión de usuarios' },
      { id: 'permissions', label: 'Permisos', icon: LockClosedIcon, description: 'Perfiles y permisos' }
    ],
    'community': [
      { id: 'topics', label: 'Temas', icon: ChatBubbleIcon, description: 'Temas de discusión' },
      { id: 'groups', label: 'Grupos', icon: PersonIcon, description: 'Grupos de la comunidad' },
      { id: 'members', label: 'Miembros', icon: PersonIcon, description: 'Miembros activos' },
      { id: 'events', label: 'Eventos', icon: CalendarIcon, description: 'Eventos comunitarios' },
      { id: 'documents', label: 'Recursos', icon: ReaderIcon, description: 'Biblioteca de recursos' },
      { id: 'feedback', label: 'Feedback', icon: ChatBubbleIcon, description: 'Comentarios y sugerencias' }
    ],
    'einstein': [
      { id: 'insights', label: 'Insights', icon: StarIcon, description: 'Insights automáticos' },
      { id: 'predictions', label: 'Predicciones', icon: BarChartIcon, description: 'Modelos predictivos' },
      { id: 'recommendations', label: 'Recomendaciones', icon: RocketIcon, description: 'Sugerencias IA' },
      { id: 'analytics', label: 'Analytics', icon: BarChartIcon, description: 'Análisis inteligente' },
      { id: 'automations', label: 'Automatizaciones', icon: UpdateIcon, description: 'Procesos automáticos' },
      { id: 'models', label: 'Modelos', icon: MixerHorizontalIcon, description: 'Modelos de IA' }
    ],
    'chatter': [
      { id: 'feed', label: 'Feed', icon: EnvelopeClosedIcon, description: 'Feed de noticias' },
      { id: 'groups', label: 'Grupos', icon: PersonIcon, description: 'Grupos de trabajo' },
      { id: 'messages', label: 'Mensajes', icon: ChatBubbleIcon, description: 'Mensajes directos' },
      { id: 'files', label: 'Archivos', icon: ReaderIcon, description: 'Archivos compartidos' },
      { id: 'people', label: 'Personas', icon: PersonIcon, description: 'Directorio de usuarios' },
      { id: 'events', label: 'Eventos', icon: CalendarIcon, description: 'Eventos y reuniones' }
    ]
  };

  // Home dinámico para cada aplicación
  const appHomes = {
    'sales-cloud': {
      title: 'Sales Home',
      description: 'Tu hub central para gestionar ventas y relaciones con clientes',
      quickActions: [
        { id: 'new-lead', label: 'Nuevo Lead', icon: PlusIcon, color: 'bg-blue-500' },
        { id: 'new-opportunity', label: 'Nueva Oportunidad', icon: RocketIcon, color: 'bg-green-500' },
        { id: 'new-account', label: 'Nueva Cuenta', icon: PersonIcon, color: 'bg-purple-500' },
        { id: 'view-pipeline', label: 'Ver Pipeline', icon: BarChartIcon, color: 'bg-orange-500' }
      ],
      recentItems: [
        { id: 1, title: 'Acme Corp - Oportunidad Q4', type: 'Oportunidad', updated: 'Hace 2 horas' },
        { id: 2, title: 'Juan Pérez - Lead Calificado', type: 'Lead', updated: 'Hace 4 horas' },
        { id: 3, title: 'TechStart Inc - Reunión Programada', type: 'Cuenta', updated: 'Ayer' }
      ]
    },
    'service-cloud': {
      title: 'Service Home',
      description: 'Centro de control para atención al cliente y soporte técnico',
      quickActions: [
        { id: 'new-case', label: 'Nuevo Caso', icon: PlusIcon, color: 'bg-red-500' },
        { id: 'view-queue', label: 'Cola de Casos', icon: FileTextIcon, color: 'bg-blue-500' },
        { id: 'knowledge-base', label: 'Base Conocimiento', icon: ReaderIcon, color: 'bg-green-500' },
        { id: 'escalations', label: 'Escalaciones', icon: UpdateIcon, color: 'bg-orange-500' }
      ],
      recentItems: [
        { id: 1, title: 'Caso #00123 - Error en sistema', type: 'Caso', updated: 'Hace 1 hora' },
        { id: 2, title: 'María García - Consulta técnica', type: 'Caso', updated: 'Hace 3 horas' },
        { id: 3, title: 'Artículo: Configuración VPN', type: 'Knowledge', updated: 'Hace 2 días' }
      ]
    },
    'marketing-cloud': {
      title: 'Marketing Home',
      description: 'Automatiza y optimiza tus campañas de marketing digital',
      quickActions: [
        { id: 'new-campaign', label: 'Nueva Campaña', icon: RocketIcon, color: 'bg-purple-500' },
        { id: 'email-builder', label: 'Email Builder', icon: EnvelopeClosedIcon, color: 'bg-blue-500' },
        { id: 'lead-scoring', label: 'Lead Scoring', icon: StarIcon, color: 'bg-yellow-500' },
        { id: 'analytics', label: 'Analytics', icon: BarChartIcon, color: 'bg-green-500' }
      ],
      recentItems: [
        { id: 1, title: 'Campaña Black Friday 2024', type: 'Campaña', updated: 'Hace 30 min' },
        { id: 2, title: 'Newsletter Diciembre', type: 'Email', updated: 'Hace 2 horas' },
        { id: 3, title: 'Webinar Tech Trends', type: 'Evento', updated: 'Ayer' }
      ]
    },
    'analytics-cloud': {
      title: 'Analytics Home',
      description: 'Dashboards e insights para tomar decisiones basadas en datos',
      quickActions: [
        { id: 'new-report', label: 'Nuevo Reporte', icon: FileTextIcon, color: 'bg-blue-500' },
        { id: 'new-dashboard', label: 'Nuevo Dashboard', icon: BarChartIcon, color: 'bg-green-500' },
        { id: 'data-explorer', label: 'Explorar Datos', icon: MixerHorizontalIcon, color: 'bg-purple-500' },
        { id: 'insights', label: 'Insights AI', icon: StarIcon, color: 'bg-orange-500' }
      ],
      recentItems: [
        { id: 1, title: 'Dashboard Ventas Q4', type: 'Dashboard', updated: 'Hace 1 hora' },
        { id: 2, title: 'Reporte ROI Marketing', type: 'Reporte', updated: 'Hace 3 horas' },
        { id: 3, title: 'Análisis Comportamiento Usuario', type: 'Análisis', updated: 'Hace 1 día' }
      ]
    },
    'commerce-cloud': {
      title: 'Commerce Home',
      description: 'Gestiona tu tienda online y experiencia de compra',
      quickActions: [
        { id: 'new-product', label: 'Nuevo Producto', icon: PlusIcon, color: 'bg-blue-500' },
        { id: 'orders', label: 'Gestionar Pedidos', icon: ArchiveIcon, color: 'bg-green-500' },
        { id: 'promotions', label: 'Promociones', icon: StarIcon, color: 'bg-purple-500' },
        { id: 'analytics', label: 'Analytics Tienda', icon: BarChartIcon, color: 'bg-orange-500' }
      ],
      recentItems: [
        { id: 1, title: 'Pedido #12345 - Procesando', type: 'Pedido', updated: 'Hace 15 min' },
        { id: 2, title: 'Producto: MacBook Pro M3', type: 'Producto', updated: 'Hace 1 hora' },
        { id: 3, title: 'Promoción Navidad 2024', type: 'Promoción', updated: 'Hace 2 horas' }
      ]
    },
    'platform': {
      title: 'Platform Home',
      description: 'Herramientas de desarrollo y personalización de la plataforma',
      quickActions: [
        { id: 'new-app', label: 'Nueva App', icon: PlusIcon, color: 'bg-blue-500' },
        { id: 'custom-objects', label: 'Objetos Custom', icon: MixerHorizontalIcon, color: 'bg-green-500' },
        { id: 'workflows', label: 'Automatizaciones', icon: UpdateIcon, color: 'bg-purple-500' },
        { id: 'apis', label: 'APIs', icon: GearIcon, color: 'bg-gray-500' }
      ],
      recentItems: [
        { id: 1, title: 'App: Customer Portal', type: 'Aplicación', updated: 'Hace 2 horas' },
        { id: 2, title: 'Objeto: Custom Product', type: 'Objeto', updated: 'Hace 4 horas' },
        { id: 3, title: 'Flujo: Auto-Assignment', type: 'Automatización', updated: 'Ayer' }
      ]
    },
    'community': {
      title: 'Community Home',
      description: 'Conecta con tu comunidad y fomenta la colaboración',
      quickActions: [
        { id: 'new-topic', label: 'Nuevo Tema', icon: PlusIcon, color: 'bg-teal-500' },
        { id: 'create-group', label: 'Crear Grupo', icon: PersonIcon, color: 'bg-blue-500' },
        { id: 'events', label: 'Eventos', icon: CalendarIcon, color: 'bg-purple-500' },
        { id: 'resources', label: 'Recursos', icon: ReaderIcon, color: 'bg-green-500' }
      ],
      recentItems: [
        { id: 1, title: 'Discusión: Best Practices API', type: 'Tema', updated: 'Hace 1 hora' },
        { id: 2, title: 'Grupo: Developers LATAM', type: 'Grupo', updated: 'Hace 3 horas' },
        { id: 3, title: 'Evento: Webinar AI Trends', type: 'Evento', updated: 'Hace 1 día' }
      ]
    },
    'einstein': {
      title: 'Einstein Home',
      description: 'Inteligencia artificial para potenciar tu productividad',
      quickActions: [
        { id: 'insights', label: 'Ver Insights', icon: StarIcon, color: 'bg-yellow-500' },
        { id: 'predictions', label: 'Predicciones', icon: BarChartIcon, color: 'bg-blue-500' },
        { id: 'recommendations', label: 'Recomendaciones', icon: RocketIcon, color: 'bg-green-500' },
        { id: 'train-model', label: 'Entrenar Modelo', icon: MixerHorizontalIcon, color: 'bg-purple-500' }
      ],
      recentItems: [
        { id: 1, title: 'Insight: Lead Conversion Trend', type: 'Insight', updated: 'Hace 30 min' },
        { id: 2, title: 'Predicción: Ventas Q1 2025', type: 'Predicción', updated: 'Hace 2 horas' },
        { id: 3, title: 'Modelo: Churn Prediction', type: 'Modelo', updated: 'Hace 1 día' }
      ]
    },
    'chatter': {
      title: 'Chatter Home',
      description: 'Colaboración empresarial y comunicación en equipo',
      quickActions: [
        { id: 'new-post', label: 'Nueva Publicación', icon: PlusIcon, color: 'bg-indigo-500' },
        { id: 'create-group', label: 'Crear Grupo', icon: PersonIcon, color: 'bg-blue-500' },
        { id: 'share-file', label: 'Compartir Archivo', icon: ReaderIcon, color: 'bg-green-500' },
        { id: 'schedule-meeting', label: 'Programar Reunión', icon: CalendarIcon, color: 'bg-purple-500' }
      ],
      recentItems: [
        { id: 1, title: 'Post: Resultados Q4', type: 'Publicación', updated: 'Hace 45 min' },
        { id: 2, title: 'Archivo: Propuesta Cliente X', type: 'Archivo', updated: 'Hace 2 horas' },
        { id: 3, title: 'Reunión: Planning Sprint', type: 'Evento', updated: 'Hace 4 horas' }
      ]
    }
  };
  
  // Datos de ejemplo para búsqueda
  const searchData = [
    { id: 1, title: 'Reporte de Ventas Enero', type: 'reporte', category: 'ventas' },
    { id: 2, title: 'Análisis de Marketing Q1', type: 'análisis', category: 'marketing' },
    { id: 3, title: 'Dashboard de Analytics', type: 'dashboard', category: 'analytics' },
    { id: 4, title: 'Configuración de Usuario', type: 'configuración', category: 'usuarios' },
    { id: 5, title: 'Reporte Financiero 2024', type: 'reporte', category: 'finanzas' },
    { id: 6, title: 'Métricas de Rendimiento', type: 'métricas', category: 'rendimiento' },
    { id: 7, title: 'Usuarios Activos', type: 'usuarios', category: 'usuarios' },
    { id: 8, title: 'Configuración del Sistema', type: 'configuración', category: 'sistema' },
    { id: 9, title: 'Análisis de Tráfico Web', type: 'análisis', category: 'web' },
    { id: 10, title: 'Reporte de Inventario', type: 'reporte', category: 'inventario' },
    { id: 11, title: 'Panel de Control', type: 'panel', category: 'control' },
    { id: 12, title: 'Estadísticas de Ventas', type: 'estadísticas', category: 'ventas' },
    { id: 13, title: 'Configuración de Notificaciones', type: 'configuración', category: 'notificaciones' },
    { id: 14, title: 'Análisis de Clientes', type: 'análisis', category: 'clientes' },
    { id: 15, title: 'Reporte de Actividad', type: 'reporte', category: 'actividad' }
  ];

  // Filtrar sugerencias basadas en la consulta
  const filteredSuggestions = searchQuery.length > 0 
    ? searchData.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8) // Limitar a 8 sugerencias
    : [];

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
    setSelectedSuggestionIndex(-1);
  };

  // Funciones para manejar la suplantación
  const handleImpersonate = async (userId: string) => {
    const success = await impersonate(userId);
    // El cierre del modal lo maneja ahora el componente UserMenu
    if (success) {
      console.log('User impersonated successfully');
    }
  };

  const handleStopImpersonating = () => {
    stopImpersonating();
  };

  // Simulate API data loading on component mount
  useEffect(() => {
    // Simular carga de configuración desde API
    const loadAppConfiguration = async () => {
      try {
        // En el futuro, esto será una llamada real a la API
        // const response = await fetch('/api/user/app-configuration');
        // const config = await response.json();
        
        // Por ahora, simulamos la configuración
        const simulatedConfig: AppConfig = {
          selectedAppId: 'sales-cloud', // Sales Cloud por defecto
          availableApps: apps, // Todas las apps disponibles
          userPermissions: ['read', 'write', 'admin'], // Permisos del usuario
          lastUpdated: new Date(),
          defaultPage: 'sales-cloud-home', // Home por defecto
          navigationState: {
            lastVisitedPage: '',
            favoritePages: ['sales-cloud-home', 'leads', 'accounts']
          }
        };
        
        setAppConfig(simulatedConfig);
        setSelectedApp(simulatedConfig.selectedAppId);
        
        // Navegar automáticamente al home de la app por defecto solo si no hay página actual
        if (!currentPage || currentPage === '') {
          const defaultPage = simulatedConfig.defaultPage;
          console.log('Initial navigation to:', defaultPage);
          onNavigate(defaultPage);
          // También guardar en el estado de navegación
          saveNavigationState(defaultPage);
        } else {
          console.log('Current page already set:', currentPage);
        }
        
        console.log('App configuration loaded:', simulatedConfig);
      } catch (error) {
        console.error('Error loading app configuration:', error);
        // Fallback a configuración por defecto
        setSelectedApp('sales-cloud');
        
        // Navegar al home por defecto en caso de error
        if (!currentPage || currentPage === '') {
          const defaultPage = 'sales-cloud-home';
          onNavigate(defaultPage);
          saveNavigationState(defaultPage);
        }
      }
    };

    loadAppConfiguration();
  }, []);

  // Effect para asegurar que Home esté preseleccionado al cargar
  useEffect(() => {
    // Si tenemos una app seleccionada pero no hay página actual, ir a Home
    if (selectedApp && (!currentPage || currentPage === '')) {
      const homePage = `${selectedApp}-home`;
      console.log('Navigating to home page:', homePage);
      onNavigate(homePage);
      saveNavigationState(homePage);
    }
  }, [selectedApp, currentPage]);

  // Effect adicional para debug y verificación de estado
  useEffect(() => {
    console.log('DashboardLayout state update:', {
      currentPage,
      selectedApp,
      expectedHomePage: selectedApp ? `${selectedApp}-home` : null
    });
  }, [currentPage, selectedApp]);

  // Función para cambiar de app (preparada para sincronizar con API)
  const handleAppChange = async (newAppId: string) => {
    try {
      // En el futuro, esto será una llamada a la API para guardar la preferencia
      // await fetch('/api/user/app-configuration', {
      //   method: 'PUT',
      //   body: JSON.stringify({ selectedAppId: newAppId })
      // });
      
      // Por ahora, solo actualizamos el estado local
      setAppConfig(prev => ({
        ...prev,
        selectedAppId: newAppId,
        lastUpdated: new Date()
      }));
      
      setSelectedApp(newAppId);
      
      console.log('App changed to:', newAppId);
    } catch (error) {
      console.error('Error changing app:', error);
    }
  };

  // Función para obtener la app actual
  const getCurrentApp = () => {
    return apps.find(app => app.id === appConfig.selectedAppId) || apps.find(app => app.id === 'sales-cloud');
  };

  // Función para guardar el estado de navegación (preparada para API)
  const saveNavigationState = async (pageId: string) => {
    try {
      // En el futuro, esto será una llamada a la API
      // await fetch('/api/user/navigation-state', {
      //   method: 'PUT',
      //   body: JSON.stringify({ lastVisitedPage: pageId })
      // });
      
      // Por ahora, solo actualizamos el estado local
      setAppConfig(prev => ({
        ...prev,
        navigationState: {
          ...prev.navigationState,
          lastVisitedPage: pageId
        },
        lastUpdated: new Date()
      }));
      
      console.log('Navigation state saved:', pageId);
    } catch (error) {
      console.error('Error saving navigation state:', error);
    }
  };

  // Función para obtener la página por defecto cuando no hay selección
  const getDefaultPage = () => {
    // Prioridades para selección por defecto:
    // 1. Última página visitada (si está disponible)
    // 2. Página por defecto configurada
    // 3. Home de la app actual
    
    if (appConfig.navigationState.lastVisitedPage) {
      return appConfig.navigationState.lastVisitedPage;
    }
    
    if (appConfig.defaultPage) {
      return appConfig.defaultPage;
    }
    
    return `${appConfig.selectedAppId}-home`;
  };

  // Debug function para desarrollo - puedes remover en producción
  const getAppConfigInfo = () => {
    console.log('Current App Config:', {
      selectedAppId: appConfig.selectedAppId,
      selectedApp: selectedApp,
      currentApp: getCurrentApp(),
      availableAppsCount: appConfig.availableApps.length,
      lastUpdated: appConfig.lastUpdated,
      currentPage: currentPage // Agregar currentPage al debug
    });
  };

  // Llamar debug info cuando cambie la configuración (solo en desarrollo)
  useEffect(() => {
    getAppConfigInfo();
  }, [appConfig, selectedApp]);

  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery(suggestion.title);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    // Aquí puedes agregar la lógica para navegar o filtrar basado en la sugerencia
    console.log('Navegando a:', suggestion);
  };

  const handleKeyDown = (e: any) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(filteredSuggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Función para obtener el menú dinámico basado en la aplicación seleccionada
  const getDynamicNavigationItems = () => {
    if (!selectedApp) {
      // Si no hay app seleccionada, mostrar el menú estático original
      return navigationItems;
    }

    const currentApp = getCurrentApp();
    const appName = currentApp?.name || 'App';
    const appObjects_items = appObjects[selectedApp] || [];

    // Primer elemento: indicador de app actual (no clickeable)
    const appIndicator = {
      id: `${selectedApp}-indicator`,
      label: appName,
      icon: currentApp?.icon || BarChartIcon,
      hasSubmenu: false,
      submenu: undefined,
      isAppIndicator: true // Flag para identificar que es solo informativo
    };

    // Segundo elemento: Home de la app
    const homeItem = {
      id: `${selectedApp}-home`,
      label: 'Inicio',
      icon: null,
      hasSubmenu: false,
      submenu: undefined
    };

    // Crear items individuales para cada objeto con su propio submenú
    const objectItems = appObjects_items.map(obj => ({
      id: `${selectedApp}-${obj.id}`,
      label: obj.label,
      icon: obj.icon,
      hasSubmenu: true,
      submenu: [
        {
          id: `create-${obj.id}`,
          label: `Crear ${obj.label}`,
          icon: PlusIcon,
          description: `Crear nuevo ${obj.label.toLowerCase()}`
        },
        // Separador visual
        {
          id: `separator-${obj.id}`,
          label: '--- Recientes ---',
          icon: null,
          description: '',
          isSeparator: true
        },
        // Últimos 4 registros (simulados)
        {
          id: `recent-1-${obj.id}`,
          label: `${obj.label} Ejemplo 1`,
          icon: obj.icon,
          description: 'Visto hace 2 horas'
        },
        {
          id: `recent-2-${obj.id}`,
          label: `${obj.label} Ejemplo 2`,
          icon: obj.icon,
          description: 'Visto hace 5 horas'
        },
        {
          id: `recent-3-${obj.id}`,
          label: `${obj.label} Ejemplo 3`,
          icon: obj.icon,
          description: 'Visto ayer'
        },
        {
          id: `recent-4-${obj.id}`,
          label: `${obj.label} Ejemplo 4`,
          icon: obj.icon,
          description: 'Visto hace 2 días'
        }
      ]
    }));

    return [
      appIndicator,
      homeItem,
      ...objectItems
    ];
  };

  // Función para manejar navegación con guardado de estado
  const handleNavigation = (pageId: string) => {
    // Guardar el estado de navegación
    saveNavigationState(pageId);
    // Ejecutar la navegación original
    onNavigate(pageId);
  };

  // Función para manejar la selección de una aplicación
  const handleAppSelection = (appId: string) => {
    handleAppChange(appId);
    // Navegar automáticamente al home de la aplicación
    const homePage = `${appId}-home`;
    handleNavigation(homePage);
    console.log('App seleccionada:', appId);
  };

  // Función para obtener el contenido del home dinámico
  const getAppHomeContent = (appId: string) => {
    return appHomes[appId] || null;
  };

  // Exponer información útil para el componente padre
  const currentAppHome = selectedApp ? getAppHomeContent(selectedApp) : null;
  const isAppHomePage = currentPage?.endsWith('-home') || false;
  const currentAppId = selectedApp;

  // Obtener el menú actual
  const currentNavigationItems = getDynamicNavigationItems();
  
  // Notificaciones de ejemplo
  const [notifications] = useState([
    { id: 1, title: 'Nuevo reporte disponible', message: 'El reporte mensual de Analytics está listo', time: '5 min', unread: true },
    { id: 2, title: 'Actualización completada', message: 'La sincronización de datos se completó exitosamente', time: '15 min', unread: true },
    { id: 3, title: 'Nuevo usuario registrado', message: 'Juan Pérez se unió a la plataforma', time: '1 h', unread: false },
    { id: 4, title: 'Backup programado', message: 'El backup automático se ejecutó correctamente', time: '2 h', unread: false },
    { id: 5, title: 'Alerta de seguridad', message: 'Intento de acceso desde nueva ubicación', time: '3 h', unread: true },
    { id: 6, title: 'Mantenimiento programado', message: 'Mantenimiento del servidor el próximo domingo', time: '5 h', unread: false },
    { id: 7, title: 'Nueva función disponible', message: 'Nuevas herramientas de análisis han sido añadidas', time: '1 día', unread: false },
    { id: 8, title: 'Reporte de errores', message: 'Se detectaron 3 errores menores en el sistema', time: '1 día', unread: false },
    { id: 9, title: 'Actualización de política', message: 'Nuevas políticas de privacidad disponibles', time: '2 días', unread: false },
    { id: 10, title: 'Feedback recibido', message: 'Nuevo comentario en tu reporte de ventas', time: '2 días', unread: false },
    { id: 11, title: 'Sesión expirada', message: 'Tu sesión anterior expiró por inactividad', time: '3 días', unread: false },
    { id: 12, title: 'Exportación completada', message: 'Los datos solicitados han sido exportados', time: '3 días', unread: false },
    { id: 13, title: 'Recordatorio', message: 'Revisa las métricas de rendimiento semanal', time: '4 días', unread: false },
    { id: 14, title: 'Actualización del sistema', message: 'Nueva versión instalada exitosamente', time: '5 días', unread: false },
    { id: 15, title: 'Bienvenido', message: 'Gracias por unirte a nuestra plataforma', time: '1 semana', unread: false }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Favoritos del usuario
  const favorites = [
    { id: 1, title: 'Dashboard Principal', type: 'dashboard', icon: BarChartIcon, path: '/dashboard' },
    { id: 2, title: 'Reporte de Ventas', type: 'reporte', icon: FileTextIcon, path: '/reports/sales' },
    { id: 3, title: 'Lista de Leads', type: 'lista', icon: PersonIcon, path: '/sales/leads' },
    { id: 4, title: 'Calendario de Eventos', type: 'calendario', icon: CalendarIcon, path: '/calendar' },
    { id: 5, title: 'Configuración de Usuario', type: 'configuración', icon: GearIcon, path: '/settings/user' },
    { id: 6, title: 'Analytics Avanzado', type: 'analytics', icon: BarChartIcon, path: '/analytics/advanced' }
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Banda de notificación de suplantación */}
      {isImpersonating && originalUser && (
        <div className="bg-orange-500 text-white px-6 py-2 text-sm flex items-center justify-between">
          <div className="flex items-center">
            <MaskOnIcon className="w-4 h-4 mr-2" />
            <span>
              Estás suplantando a <strong>{user?.name}</strong> ({user?.email})
            </span>
          </div>
          <button
            onClick={handleStopImpersonating}
            className="bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded text-xs font-medium transition-colors"
          >
            Volver a {originalUser.name}
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <header className="bg-white shadow-sm border-b">
        {/* Top Bar */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">MT</span>
              </div>
              <span className="ml-3 font-semibold text-gray-800">Muebles Tanquian</span>
            </div>

            {/* Search Box */}
            <div className="flex items-center mx-4 relative">
              <div className="flex items-center w-96">
                <div className="flex items-center w-full bg-gray-50 rounded-lg border">
                  <svg className="w-5 h-5 text-gray-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Buscar en Salesforce..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="flex-1 px-3 py-2 bg-transparent outline-none text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setShowSuggestions(false);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Cross2Icon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  <div className="p-2">
                    <p className="text-xs text-gray-500 px-3 py-2 font-medium">
                      {filteredSuggestions.length} resultado{filteredSuggestions.length !== 1 ? 's' : ''} encontrado{filteredSuggestions.length !== 1 ? 's' : ''}
                    </p>
                    {filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                          index === selectedSuggestionIndex 
                            ? 'bg-blue-100 border-blue-200' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {suggestion.title}
                          </p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full mr-2">
                              {suggestion.type}
                            </span>
                            <span className="text-xs text-gray-500">
                              {suggestion.category}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {searchQuery && (
                    <div className="border-t border-gray-200 p-2">
                      <button 
                        onClick={() => {
                          console.log('Buscar todos los resultados para:', searchQuery);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        Ver todos los resultados para "{searchQuery}"
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right side: Notifications, Setup and User Menu */}
            <div className="flex items-center space-x-2">

              {/* Favorites Menu */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                    <StarIcon className="w-5 h-5" />
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[320px] bg-white rounded-lg shadow-lg border p-1"
                    sideOffset={5}
                    align="end"
                  >
                    <div className="p-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-800 text-sm">Mis Favoritos</h3>
                      <p className="text-xs text-gray-500">Acceso rápido a tus elementos favoritos</p>
                    </div>

                    <div className="max-h-80 overflow-y-auto py-1">
                      {favorites.map((favorite) => {
                        const Icon = favorite.icon;
                        return (
                          <DropdownMenu.Item
                            key={favorite.id}
                            className="flex items-center px-3 py-2 text-sm rounded hover:bg-gray-100 cursor-pointer mx-1"
                            onClick={() => console.log('Navegando a favorito:', favorite.path)}
                          >
                            <Icon className="w-4 h-4 mr-3 text-blue-600" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{favorite.title}</p>
                              <p className="text-xs text-gray-500">{favorite.type}</p>
                            </div>
                            <StarIcon className="w-3 h-3 text-yellow-500" />
                          </DropdownMenu.Item>
                        );
                      })}
                    </div>

                    <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />

                    <div className="p-2">
                      <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md font-medium">
                        Gestionar favoritos
                      </button>
                    </div>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>

              {/* Quick Actions Menu */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[300px] bg-white rounded-lg shadow-lg border p-1"
                    sideOffset={5}
                    align="end"
                  >
                    <div className="p-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-800 text-sm">Acciones Rápidas</h3>
                      <p className="text-xs text-gray-500">Crear y gestionar elementos</p>
                    </div>

                    {/* Crear Nuevos */}
                    <div className="py-1">
                      <div className="px-3 py-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Crear Nuevo</p>
                      </div>
                      
                      <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded hover:bg-gray-100 cursor-pointer mx-1">
                        <PersonIcon className="w-4 h-4 mr-3 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">Lead</p>
                          <p className="text-xs text-gray-500">Crear nuevo prospecto</p>
                        </div>
                      </DropdownMenu.Item>

                      <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded hover:bg-gray-100 cursor-pointer mx-1">
                        <ArchiveIcon className="w-4 h-4 mr-3 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">Oportunidad</p>
                          <p className="text-xs text-gray-500">Nueva oportunidad de venta</p>
                        </div>
                      </DropdownMenu.Item>

                      <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded hover:bg-gray-100 cursor-pointer mx-1">
                        <EnvelopeClosedIcon className="w-4 h-4 mr-3 text-purple-600" />
                        <div>
                          <p className="font-medium text-gray-900">Campaña</p>
                          <p className="text-xs text-gray-500">Crear campaña de marketing</p>
                        </div>
                      </DropdownMenu.Item>

                      <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded hover:bg-gray-100 cursor-pointer mx-1">
                        <CalendarIcon className="w-4 h-4 mr-3 text-orange-600" />
                        <div>
                          <p className="font-medium text-gray-900">Evento</p>
                          <p className="text-xs text-gray-500">Programar nueva reunión</p>
                        </div>
                      </DropdownMenu.Item>
                    </div>

                    <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />

                    {/* Acciones Rápidas */}
                    <div className="py-1">
                      <div className="px-3 py-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Acciones</p>
                      </div>

                      <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded hover:bg-gray-100 cursor-pointer mx-1">
                        <FileTextIcon className="w-4 h-4 mr-3 text-indigo-600" />
                        <div>
                          <p className="font-medium text-gray-900">Generar Reporte</p>
                          <p className="text-xs text-gray-500">Crear reporte personalizado</p>
                        </div>
                      </DropdownMenu.Item>

                      <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded hover:bg-gray-100 cursor-pointer mx-1">
                        <ChatBubbleIcon className="w-4 h-4 mr-3 text-teal-600" />
                        <div>
                          <p className="font-medium text-gray-900">Enviar Email</p>
                          <p className="text-xs text-gray-500">Comunicación masiva</p>
                        </div>
                      </DropdownMenu.Item>

                      <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded hover:bg-gray-100 cursor-pointer mx-1">
                        <UpdateIcon className="w-4 h-4 mr-3 text-red-600" />
                        <div>
                          <p className="font-medium text-gray-900">Importar Datos</p>
                          <p className="text-xs text-gray-500">Cargar información externa</p>
                        </div>
                      </DropdownMenu.Item>
                    </div>

                    <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />

                    <div className="p-2">
                      <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md font-medium">
                        Ver todas las acciones →
                      </button>
                    </div>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>            

              {/* Setup Menu */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                    <GearIcon className="w-5 h-5" />
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[280px] bg-white rounded-lg shadow-lg border p-1"
                    sideOffset={5}
                    align="end"
                  >
                    <div className="p-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-800 text-sm">Configuración</h3>
                      <p className="text-xs text-gray-500">Administra tu organización</p>
                    </div>

                    {/* Configuración de la Organización */}
                    <div className="py-1">
                      <div className="px-3 py-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Organización</p>
                      </div>
                      
                      <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded hover:bg-gray-100 cursor-pointer mx-1">
                        <MixerHorizontalIcon className="w-4 h-4 mr-3 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Configuración General</p>
                          <p className="text-xs text-gray-500">Configuraciones básicas de la org</p>
                        </div>
                      </DropdownMenu.Item>

                      <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded hover:bg-gray-100 cursor-pointer mx-1">
                        <PersonIcon className="w-4 h-4 mr-3 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Gestión de Usuarios</p>
                          <p className="text-xs text-gray-500">Usuarios, roles y permisos</p>
                        </div>
                      </DropdownMenu.Item>

                      <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded hover:bg-gray-100 cursor-pointer mx-1">
                        <LockClosedIcon className="w-4 h-4 mr-3 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Seguridad</p>
                          <p className="text-xs text-gray-500">Políticas y configuraciones de seguridad</p>
                        </div>
                      </DropdownMenu.Item>
                    </div>

                    <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />

                    {/* Personalización */}
                    <div className="py-1">
                      <div className="px-3 py-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Personalización</p>
                      </div>

                      <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded hover:bg-gray-100 cursor-pointer mx-1">
                        <RocketIcon className="w-4 h-4 mr-3 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Objetos y Campos</p>
                          <p className="text-xs text-gray-500">Personalizar objetos personalizados</p>
                        </div>
                      </DropdownMenu.Item>

                      <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded hover:bg-gray-100 cursor-pointer mx-1">
                        <BarChartIcon className="w-4 h-4 mr-3 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Flujos de Trabajo</p>
                          <p className="text-xs text-gray-500">Automatización y procesos</p>
                        </div>
                      </DropdownMenu.Item>

                      <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded hover:bg-gray-100 cursor-pointer mx-1">
                        <FileTextIcon className="w-4 h-4 mr-3 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Plantillas de Email</p>
                          <p className="text-xs text-gray-500">Gestionar plantillas de comunicación</p>
                        </div>
                      </DropdownMenu.Item>
                    </div>

                    <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />

                    {/* Integración y Herramientas */}
                    <div className="py-1">
                      <div className="px-3 py-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Integración</p>
                      </div>

                      <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded hover:bg-gray-100 cursor-pointer mx-1">
                        <UpdateIcon className="w-4 h-4 mr-3 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Integraciones API</p>
                          <p className="text-xs text-gray-500">Conectar sistemas externos</p>
                        </div>
                      </DropdownMenu.Item>

                      <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded hover:bg-gray-100 cursor-pointer mx-1">
                        <QuestionMarkCircledIcon className="w-4 h-4 mr-3 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Centro de Ayuda</p>
                          <p className="text-xs text-gray-500">Documentación y soporte</p>
                        </div>
                      </DropdownMenu.Item>
                    </div>

                    <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />

                    {/* Footer del menú */}
                    <div className="p-3 bg-gray-50 rounded-b-lg">
                      <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium text-left">
                        Ver todas las configuraciones →
                      </button>
                    </div>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>

              {/* Notifications */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                    <BellIcon className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[400px] max-w-[400px] bg-white rounded-lg shadow-lg border p-0 max-h-96 overflow-y-auto"
                    sideOffset={5}
                    align="end"
                  >
                    <div className="p-4 border-b bg-gray-50">
                      <h3 className="font-semibold text-gray-800">Notificaciones</h3>
                      <p className="text-sm text-gray-600">Tienes {unreadCount} notificaciones sin leer</p>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <DropdownMenu.Item
                          key={notification.id}
                          className={`flex items-start p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                            notification.unread ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex-shrink-0 mr-3 mt-1">
                            <div className={`w-2 h-2 rounded-full ${notification.unread ? 'bg-blue-500' : 'bg-gray-300'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <ClockIcon className="w-3 h-3 mr-1" />
                              {notification.time}
                            </div>
                          </div>
                        </DropdownMenu.Item>
                      ))}
                    </div>
                    
                    <div className="p-3 border-t bg-gray-50">
                      <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
                        Ver todas las notificaciones
                      </button>
                    </div>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>                

              {/* User Menu - Lazy Loaded */}
              <Suspense fallback={<div className="flex items-center space-x-3 p-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse"></div>
                <div className="w-4 h-4 bg-gray-100 animate-pulse rounded"></div>
              </div>}>
                <UserMenu 
                  user={user}
                  isImpersonating={isImpersonating}
                  originalUser={originalUser}
                  availableUsers={availableUsers}
                  onNavigate={onNavigate}
                  onLogout={logout}
                  onImpersonate={handleImpersonate}
                  onStopImpersonating={handleStopImpersonating}
                />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="px-6 py-0">
          <div className="flex items-center space-x-1">
            {/* App Launcher (Waffle Menu) - Lazy Loaded */}
            <Suspense fallback={<div className="w-12 h-8 bg-gray-100 animate-pulse rounded"></div>}>
              <AppLauncher 
                selectedApp={selectedApp}
                onAppSelect={handleAppSelection}
              />
            </Suspense>

            {/* Navigation Menu - Lazy Loaded */}
            <Suspense fallback={<div className="flex space-x-1">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-20 h-8 bg-gray-100 animate-pulse rounded"></div>
              ))}
            </div>}>
              <NavigationMenu 
                currentPage={currentPage}
                onNavigate={handleNavigation}
                items={currentNavigationItems}
              />
            </Suspense>
          </div>
        </nav>
      </header>

      {/* Content Area */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
