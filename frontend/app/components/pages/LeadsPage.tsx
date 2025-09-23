"use client";
import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { useLeads, Lead, ListView } from '../../contexts/LeadsContext';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import {
  ChevronDownIcon,
  PlusIcon,
  Pencil1Icon,
  TrashIcon,
  MixerHorizontalIcon,
  EyeOpenIcon,
  Cross2Icon,
  DotsVerticalIcon,
  DrawingPinIcon,
  DrawingPinFilledIcon,
  GearIcon,
  GridIcon,
  ReloadIcon,
  BarChartIcon,
  MagnifyingGlassIcon,
  CheckCircledIcon,
  CrossCircledIcon
} from '@radix-ui/react-icons';

// Lazy loading de componentes
const CreateLeadModal = lazy(() => import('../leads/CreateLeadModal'));
const EditLeadModal = lazy(() => import('../leads/EditLeadModal'));
const LeadsTable = lazy(() => import('../leads/LeadsTable'));
const Toast = lazy(() => import('../leads/Toast'));

interface LeadsPageProps {
  onNavigateToDetail?: (leadId: string) => void;
}

export default function LeadsPage({ onNavigateToDetail }: LeadsPageProps) {
  const {
    filteredLeads,
    listViews,
    currentListView,
    searchQuery,
    selectedLeads,
    setSearchQuery,
    setCurrentListView,
    createLead,
    updateLead,
    deleteLead,
    deleteMultipleLeads,
    toggleListViewPin,
    toggleLeadSelection,
    toggleSelectAll,
    clearSelection
  } = useLeads();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [showListViewConfigModal, setShowListViewConfigModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showChartsModal, setShowChartsModal] = useState(false);
  const [showDisplayModal, setShowDisplayModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [sortField, setSortField] = useState<keyof Lead | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentDisplayType, setCurrentDisplayType] = useState<'table' | 'canvas' | 'rows'>('table');
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const statusOptions: Lead['status'][] = ['New', 'Contacted', 'Qualified', 'Unqualified', 'Converted'];
  const statusColors = {
    'New': 'bg-blue-100 text-blue-800',
    'Contacted': 'bg-yellow-100 text-yellow-800',
    'Qualified': 'bg-green-100 text-green-800',
    'Unqualified': 'bg-red-100 text-red-800',
    'Converted': 'bg-purple-100 text-purple-800'
  };

  // Toast effect on page load
  useEffect(() => {
    setShowToast(true);
    setToastMessage('¡Datos cargados exitosamente!');
    setToastType('success');
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Show toast function
  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setShowEditModal(true);
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleDeleteSelected = () => {
    if (selectedLeads.length > 0) {
      deleteMultipleLeads(selectedLeads);
    }
  };

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Ordenar los leads filtrados
  const sortedLeads = React.useMemo(() => {
    if (!sortField) return filteredLeads;
    
    return [...filteredLeads].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredLeads, sortField, sortDirection]);

  const getSortIcon = (field: keyof Lead) => {
    if (sortField !== field) {
      return (
        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    if (sortDirection === 'asc') {
      return (
        <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    } else {
      return (
        <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Object Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChartIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          </div>
          <div className="flex items-center space-x-3">
            {selectedLeads.length > 0 && (
              <>
                <button
                  onClick={handleDeleteSelected}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                >
                  Eliminar ({selectedLeads.length})
                </button>
                <button
                  onClick={clearSelection}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                >
                  Limpiar selección
                </button>
              </>
            )}
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Nuevo Lead
            </button>
          </div>
        </div>
      </div>
      
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* List View Selector */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      <span className="font-medium text-gray-900">{currentListView.name}</span>
                      <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content className="min-w-[250px] bg-white border border-gray-200 rounded-lg shadow-lg p-1">
                      <div className="p-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">Seleccionar Vista</p>
                      </div>
                      {listViews.map((view) => (
                        <DropdownMenu.Item
                          key={view.id}
                          className={`flex items-center px-3 py-2 text-sm rounded cursor-pointer ${
                            currentListView.id === view.id 
                              ? 'bg-blue-50 text-blue-700' 
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => setCurrentListView(view)}
                        >
                          <EyeOpenIcon className="w-4 h-4 mr-2" />
                          <span className="flex-1">{view.name}</span>
                          {view.isPinned && (
                            <DrawingPinFilledIcon className="w-3 h-3 text-blue-700 mr-2 transform rotate-45" />
                          )}
                          {view.isDefault && <span className="text-xs text-gray-500">Por defecto</span>}
                        </DropdownMenu.Item>
                      ))}
                      <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
                      <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded cursor-pointer hover:bg-gray-100 text-blue-600">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Nueva Vista de Lista
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>

                {/* Pin/Unpin Button */}
                <button
                  onClick={() => toggleListViewPin(currentListView.id)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    currentListView.isPinned 
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 shadow-sm border border-blue-200' 
                      : 'bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600 border border-gray-200'
                  }`}
                  title={currentListView.isPinned ? 'Desfijar vista' : 'Fijar vista'}
                >
                  {currentListView.isPinned ? (
                    <DrawingPinFilledIcon className="w-4 h-4 transform rotate-45" />
                  ) : (
                    <DrawingPinIcon className="w-4 h-4" />
                  )}
                </button>
              </div>

              <span className="text-sm text-gray-500">
                {sortedLeads.length} elemento{sortedLeads.length !== 1 ? 's' : ''}
                {selectedLeads.length > 0 && ` • ${selectedLeads.length} seleccionado${selectedLeads.length !== 1 ? 's' : ''}`}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Search Box */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Separator */}
              <div className="h-6 w-px bg-gray-300"></div>

              {/* Display Options */}
              <button
                onClick={() => setShowDisplayModal(true)}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Seleccionar vista de display"
              >
                <GridIcon className="w-4 h-4 text-gray-600" />
              </button>

              {/* Refresh */}
              <button
                onClick={() => window.location.reload()}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Actualizar datos"
              >
                <ReloadIcon className="w-4 h-4 text-gray-600" />
              </button>

              {/* Charts */}
              <button
                onClick={() => setShowChartsModal(true)}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Ver gráficos"
              >
                <BarChartIcon className="w-4 h-4 text-gray-600" />
              </button>

              {/* Filters */}
              <button
                onClick={() => setShowFiltersModal(true)}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Filtros avanzados"
              >
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-600" />
              </button>

              {/* Separator */}
              <div className="h-6 w-px bg-gray-300"></div>
              
              <button
                onClick={() => setShowListViewConfigModal(true)}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Configurar vista de lista"
              >
                <GearIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container - Lazy Loaded */}
      <div className="flex-1 overflow-auto">
        <Suspense fallback={
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="animate-pulse">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-6 gap-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex items-center space-x-4 mb-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-1">
                    <div className="grid grid-cols-6 gap-4">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }>
          <LeadsTable
            leads={sortedLeads}
            selectedLeads={selectedLeads}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onToggleSelection={toggleLeadSelection}
            onToggleSelectAll={toggleSelectAll}
            onEditLead={openEditModal}
            onDeleteLead={deleteLead}
            onNavigateToDetail={onNavigateToDetail}
          />
        </Suspense>
      </div>

      {/* Display Type Selection Modal */}
      <Dialog.Root open={showDisplayModal} onOpenChange={setShowDisplayModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Seleccionar Tipo de Vista
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-1 rounded hover:bg-gray-100">
                  <Cross2Icon className="w-5 h-5 text-gray-500" />
                </button>
              </Dialog.Close>
            </div>
            
            <div className="space-y-3">
              {/* Table View */}
              <button
                onClick={() => {
                  setCurrentDisplayType('table');
                  setShowDisplayModal(false);
                }}
                className={`w-full flex items-center p-4 border-2 rounded-lg text-left transition-all ${
                  currentDisplayType === 'table' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    currentDisplayType === 'table' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <GridIcon className={`w-5 h-5 ${
                      currentDisplayType === 'table' ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${
                      currentDisplayType === 'table' ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      Vista de Tabla
                    </h3>
                    <p className="text-sm text-gray-500">
                      Datos organizados en filas y columnas
                    </p>
                  </div>
                </div>
                {currentDisplayType === 'table' && (
                  <svg className="w-5 h-5 text-blue-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {/* Canvas View */}
              <button
                onClick={() => {
                  setCurrentDisplayType('canvas');
                  setShowDisplayModal(false);
                }}
                className={`w-full flex items-center p-4 border-2 rounded-lg text-left transition-all ${
                  currentDisplayType === 'canvas' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    currentDisplayType === 'canvas' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <svg className={`w-5 h-5 ${
                      currentDisplayType === 'canvas' ? 'text-blue-600' : 'text-gray-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`font-medium ${
                      currentDisplayType === 'canvas' ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      Vista Canvas
                    </h3>
                    <p className="text-sm text-gray-500">
                      Tarjetas visuales flexibles
                    </p>
                  </div>
                </div>
                {currentDisplayType === 'canvas' && (
                  <svg className="w-5 h-5 text-blue-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {/* Rows View */}
              <button
                onClick={() => {
                  setCurrentDisplayType('rows');
                  setShowDisplayModal(false);
                }}
                className={`w-full flex items-center p-4 border-2 rounded-lg text-left transition-all ${
                  currentDisplayType === 'rows' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    currentDisplayType === 'rows' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <svg className={`w-5 h-5 ${
                      currentDisplayType === 'rows' ? 'text-blue-600' : 'text-gray-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`font-medium ${
                      currentDisplayType === 'rows' ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      Vista de Filas
                    </h3>
                    <p className="text-sm text-gray-500">
                      Lista compacta en filas
                    </p>
                  </div>
                </div>
                {currentDisplayType === 'rows' && (
                  <svg className="w-5 h-5 text-blue-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-gray-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Tip</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Cada tipo de vista ofrece una perspectiva diferente de tus datos. La vista actual es: <span className="font-semibold">{currentDisplayType === 'table' ? 'Tabla' : currentDisplayType === 'canvas' ? 'Canvas' : 'Filas'}</span>
                  </p>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* List View Configuration Modal */}
      <Dialog.Root open={showListViewConfigModal} onOpenChange={setShowListViewConfigModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Configuración de Vista de Lista
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-1 rounded hover:bg-gray-100">
                  <Cross2Icon className="w-5 h-5 text-gray-500" />
                </button>
              </Dialog.Close>
            </div>
            
            <div className="space-y-4">
              {/* Vista Actual */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Vista Actual</h3>
                <div className="flex items-center space-x-2">
                  <EyeOpenIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{currentListView.name}</span>
                  {currentListView.isPinned && (
                    <DrawingPinFilledIcon className="w-3 h-3 text-blue-700 transform rotate-45" />
                  )}
                </div>
              </div>

              {/* Opciones de Configuración */}
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                  <PlusIcon className="w-4 h-4 mr-3 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Nueva Vista</div>
                    <div className="text-xs text-gray-500">Crear nueva vista de lista</div>
                  </div>
                </button>

                <button className="flex items-center px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                  <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Clonar</div>
                    <div className="text-xs text-gray-500">Duplicar vista actual</div>
                  </div>
                </button>

                <button className="flex items-center px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                  <Pencil1Icon className="w-4 h-4 mr-3 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Renombrar</div>
                    <div className="text-xs text-gray-500">Cambiar nombre de vista</div>
                  </div>
                </button>

                <button className="flex items-center px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                  <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Compartir</div>
                    <div className="text-xs text-gray-500">Configurar uso compartido</div>
                  </div>
                </button>

                <button className="flex items-center px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                  <GearIcon className="w-4 h-4 mr-3 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Configuración</div>
                    <div className="text-xs text-gray-500">Ajustes de vista</div>
                  </div>
                </button>

                <button className="flex items-center px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                  <MixerHorizontalIcon className="w-4 h-4 mr-3 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Campos</div>
                    <div className="text-xs text-gray-500">Seleccionar campos</div>
                  </div>
                </button>

                <button className="flex items-center px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-red-50 text-left border-red-200">
                  <TrashIcon className="w-4 h-4 mr-3 text-red-500" />
                  <div>
                    <div className="text-sm font-medium text-red-900">Eliminar</div>
                    <div className="text-xs text-red-500">Borrar vista</div>
                  </div>
                </button>

                <button className="flex items-center px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                  <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Restablecer</div>
                    <div className="text-xs text-gray-500">Anchos de columna</div>
                  </div>
                </button>
              </div>

              {/* Información Adicional */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Tip</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Puedes personalizar completamente tus vistas de lista para mostrar exactamente la información que necesitas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Filters Modal */}
      <Dialog.Root open={showFiltersModal} onOpenChange={setShowFiltersModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Filtros Avanzados
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-1 rounded hover:bg-gray-100">
                  <Cross2Icon className="w-5 h-5 text-gray-500" />
                </button>
              </Dialog.Close>
            </div>
            
            <div className="space-y-6">
              {/* Filter by Status */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Estado</h3>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(status => (
                    <label key={status} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-700">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter by Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha desde
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha hasta
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Filter by Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contiene texto
                </label>
                <input
                  type="text"
                  placeholder="Buscar en nombres y emails..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Limpiar
              </button>
              <Dialog.Close asChild>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Aplicar Filtros
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Charts Modal */}
      <Dialog.Root open={showChartsModal} onOpenChange={setShowChartsModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Análisis y Gráficos
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-1 rounded hover:bg-gray-100">
                  <Cross2Icon className="w-5 h-5 text-gray-500" />
                </button>
              </Dialog.Close>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Chart 1: Status Distribution */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Distribución por Estado</h3>
                <div className="h-48 flex items-center justify-center bg-white rounded border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <BarChartIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Gráfico de barras</p>
                    <p className="text-xs text-gray-400">Estado de leads</p>
                  </div>
                </div>
              </div>

              {/* Chart 2: Timeline */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Leads por Mes</h3>
                <div className="h-48 flex items-center justify-center bg-white rounded border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-sm text-gray-500">Gráfico de líneas</p>
                    <p className="text-xs text-gray-400">Tendencia temporal</p>
                  </div>
                </div>
              </div>

              {/* Chart 3: Conversion Rate */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Tasa de Conversión</h3>
                <div className="h-48 flex items-center justify-center bg-white rounded border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                    <p className="text-sm text-gray-500">Gráfico circular</p>
                    <p className="text-xs text-gray-400">Porcentajes</p>
                  </div>
                </div>
              </div>

              {/* Chart 4: Performance Metrics */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Métricas de Rendimiento</h3>
                <div className="h-48 flex items-center justify-center bg-white rounded border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <p className="text-sm text-gray-500">Métricas KPI</p>
                    <p className="text-xs text-gray-400">Indicadores clave</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Próximamente</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Los gráficos interactivos estarán disponibles en una próxima actualización con datos en tiempo real.
                  </p>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Create Lead Modal - Lazy Loaded */}
      <Suspense fallback={null}>
        <CreateLeadModal
          isOpen={showCreateModal}
          onOpenChange={setShowCreateModal}
          onCreateLead={createLead}
          onShowToast={showToastMessage}
        />
      </Suspense>

      {/* Edit Lead Modal - Lazy Loaded */}
      <Suspense fallback={null}>
        <EditLeadModal
          isOpen={showEditModal}
          onOpenChange={setShowEditModal}
          lead={editingLead}
          onUpdateLead={updateLead}
          onShowToast={showToastMessage}
        />
      </Suspense>

      {/* Toast Notification - Lazy Loaded */}
      <Suspense fallback={null}>
        <Toast
          isVisible={showToast}
          type={toastType}
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      </Suspense>
    </div>
  );
}
