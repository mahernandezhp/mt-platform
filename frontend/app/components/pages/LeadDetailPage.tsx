"use client";
import React, { useState, useCallback } from 'react';
import { useLeads, Lead } from '../../contexts/LeadsContext';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import {
  ChevronRightIcon,
  ChevronDownIcon,
  PlusIcon,
  Pencil1Icon,
  TrashIcon,
  CopyIcon,
  EyeOpenIcon,
  Cross2Icon,
  DotsVerticalIcon,
  CalendarIcon,
  ClockIcon,
  PersonIcon,
  EnvelopeClosedIcon,
  MobileIcon,
  GlobeIcon,
  ChatBubbleIcon,
  FileTextIcon,
  ArchiveIcon,
  StarIcon,
  StarFilledIcon,
  BookmarkIcon,
  HeartIcon,
  ArrowLeftIcon
} from '@radix-ui/react-icons';

interface LeadDetailPageProps {
  leadId: string;
  onBack: () => void;
}

export default function LeadDetailPage({ leadId, onBack }: LeadDetailPageProps) {
  const { filteredLeads, updateLead, deleteLead } = useLeads();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('activities');
  const [isEditingStage, setIsEditingStage] = useState(false);
  const [tempStatus, setTempStatus] = useState<Lead['status']>('New');
  const [isEditingFields, setIsEditingFields] = useState(false);
  const [editingField, setEditingField] = useState<keyof Lead | null>(null);
  const [editedLead, setEditedLead] = useState<Partial<Lead>>({});
  const [editMode, setEditMode] = useState<'complete' | 'individual' | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    leadInfo: true,
    contact: true,
    address: false,
    system: false
  });

  const lead = filteredLeads.find(l => l.id === leadId);

  // Componente para campos editables - soporte para ambos modos de edición
  const EditableField = React.memo(({ 
    label, 
    value, 
    field, 
    type = 'text',
    icon,
    isSelect = false,
    options = [],
    isFirstField = false
  }: {
    label: string;
    value: string;
    field: keyof Lead;
    type?: string;
    icon?: React.ReactNode;
    isSelect?: boolean;
    options?: string[];
    isFirstField?: boolean;
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    // Determinar si este campo está siendo editado
    const isThisFieldBeingEdited = (editMode === 'individual' && editingField === field) || 
                                   (editMode === 'complete' && isEditingFields);
    
    // Stable handlers usando useCallback
    const onMouseEnter = useCallback(() => setIsHovered(true), []);
    const onMouseLeave = useCallback(() => setIsHovered(false), []);
    
    // Handler para iniciar edición individual de este campo específico
    const handleStartIndividualEditing = useCallback(() => {
      if (editMode !== 'complete') {
        setEditingField(field);
        setEditMode('individual');
        setIsEditingFields(false); // Asegurar que no esté en modo completo
      }
    }, [field, editMode]);
    
    // Create stable handler for this specific field using useCallback
    const fieldHandler = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      handleFieldChange(field, e.target.value);
    }, [field, handleFieldChange]);
    
    // Auto focus logic
    const inputRef = React.useRef<HTMLInputElement>(null);
    const selectRef = React.useRef<HTMLSelectElement>(null);
    
    React.useEffect(() => {
      if (isThisFieldBeingEdited) {
        // Solo hacer focus automático en casos específicos
        const shouldAutoFocus = 
          (editMode === 'complete' && isFirstField) ||  // Primer campo en modo completo
          (editMode === 'individual' && editingField === field); // Campo específico en modo individual
        
        if (shouldAutoFocus) {
          setTimeout(() => {
            if (isSelect && selectRef.current) {
              selectRef.current.focus();
            } else if (!isSelect && inputRef.current) {
              inputRef.current.focus();
            }
          }, 100);
        }
      }
    }, [isThisFieldBeingEdited, editMode, isFirstField, editingField, field, isSelect]);
    
    // Handler para salir del modo edición individual
    const handleExitIndividualEdit = useCallback(() => {
      if (editMode === 'individual') {
        setEditingField(null);
        setEditMode(null);
      }
    }, [editMode]);
    
    return (
      <div 
        className="relative group"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
        <div className="relative">
          {isThisFieldBeingEdited ? (
            isSelect ? (
              <select
                ref={selectRef}
                value={editedLead[field] || value}
                onChange={fieldHandler}
                onBlur={editMode === 'individual' ? handleExitIndividualEdit : undefined}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
              >
                {options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                ref={inputRef}
                type={type}
                value={editedLead[field] || value}
                onChange={fieldHandler}
                onBlur={editMode === 'individual' ? handleExitIndividualEdit : undefined}
                onKeyDown={editMode === 'individual' ? (e) => {
                  if (e.key === 'Enter') {
                    handleExitIndividualEdit();
                  }
                  if (e.key === 'Escape') {
                    setEditedLead(prev => ({ ...prev, [field]: value }));
                    handleExitIndividualEdit();
                  }
                } : undefined}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
              />
            )
          ) : (
            <div className="flex items-center">
              {icon && <span className="mr-2">{icon}</span>}
              <span 
                className="text-gray-900 cursor-pointer flex-1 py-1"
                onClick={handleStartIndividualEditing}
              >
                {editedLead[field] || value}
              </span>
              {isHovered && !isEditingStage && editMode === null && (
                <button
                  onClick={handleStartIndividualEditing}
                  className="ml-2 p-1 text-blue-600 hover:bg-blue-100 rounded transition-all opacity-0 group-hover:opacity-100"
                  title="Editar campo"
                >
                  <Pencil1Icon className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }, (prevProps, nextProps) => {
    // Comparación personalizada para evitar re-renders innecesarios
    return (
      prevProps.label === nextProps.label &&
      prevProps.value === nextProps.value &&
      prevProps.field === nextProps.field &&
      prevProps.type === nextProps.type &&
      prevProps.isSelect === nextProps.isSelect &&
      JSON.stringify(prevProps.options) === JSON.stringify(nextProps.options) &&
      prevProps.icon === nextProps.icon &&
      prevProps.isFirstField === nextProps.isFirstField
    );
  });

  // Actualizar tempStatus cuando cambie el lead
  React.useEffect(() => {
    if (lead) {
      setTempStatus(lead.status);
      setEditedLead({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        status: lead.status
      });
      setEditingField(null); // Reset editing field when lead changes
      setIsEditingFields(false);
      setEditMode(null); // Reset edit mode
    }
  }, [lead]);

  if (!lead) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Lead no encontrado</h2>
          <p className="text-gray-500 mb-4">El lead que buscas no existe o fue eliminado.</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  const statusColors = {
    'New': 'bg-blue-100 text-blue-800 border-blue-200',
    'Contacted': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Qualified': 'bg-green-100 text-green-800 border-green-200',
    'Unqualified': 'bg-red-100 text-red-800 border-red-200',
    'Converted': 'bg-purple-100 text-purple-800 border-purple-200'
  };

  // Memoized constants
  const statusOptions = React.useMemo(() => ['New', 'Contacted', 'Qualified', 'Unqualified', 'Converted'] as Lead['status'][], []);

  const pathStages = [
    { id: 'new', label: 'Nuevo', status: 'New' as Lead['status'], completed: true },
    { id: 'contacted', label: 'Contactado', status: 'Contacted' as Lead['status'], completed: lead.status !== 'New' },
    { id: 'qualified', label: 'Calificado', status: 'Qualified' as Lead['status'], completed: ['Qualified', 'Converted'].includes(lead.status) },
    { id: 'converted', label: 'Convertido', status: 'Converted' as Lead['status'], completed: lead.status === 'Converted' }
  ];

  const currentStageIndex = pathStages.findIndex(stage => stage.status === lead.status);

  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  // Stable handlers for specific sections
  const toggleLeadInfo = useCallback(() => toggleSection('leadInfo'), [toggleSection]);

  // Memoized icons to prevent re-renders
  const emailIcon = React.useMemo(() => <EnvelopeClosedIcon className="w-4 h-4 text-gray-500" />, []);
  const calendarIcon = React.useMemo(() => <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />, []);
  const clockIcon = React.useMemo(() => <ClockIcon className="w-4 h-4 mr-2 text-gray-500" />, []);

  const handleDelete = () => {
    deleteLead(lead.id);
    setShowDeleteModal(false);
    onBack();
  };

  const handleStageClick = (status: Lead['status']) => {
    setTempStatus(status);
    setIsEditingStage(true);
  };

  const handleSaveStage = () => {
    if (lead && tempStatus !== lead.status) {
      updateLead(lead.id, { ...lead, status: tempStatus });
    }
    setIsEditingStage(false);
  };

  const handleCancelStageEdit = useCallback(() => {
    setTempStatus(lead?.status || 'New');
    setIsEditingStage(false);
  }, [lead?.status]);

  const handleEditFields = useCallback(() => {
    if (lead) {
      // Configurar todos los campos para edición
      setEditedLead({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        status: lead.status
      });
    }
    // Activar modo de edición completa
    setEditMode('complete');
    setIsEditingFields(true);
    setEditingField(null); // Reset editing field específico
  }, [lead]);

  const handleSaveFields = useCallback(() => {
    if (lead && editedLead) {
      updateLead(lead.id, { ...lead, ...editedLead });
    }
    setIsEditingFields(false);
    setEditingField(null);
    setEditMode(null);
  }, [lead, editedLead, updateLead]);

  const handleCancelFields = useCallback(() => {
    setEditedLead({});
    setIsEditingFields(false);
    setEditingField(null);
    setEditMode(null);
  }, []);

  const handleCancelFieldsEdit = useCallback(() => {
    if (lead) {
      setEditedLead({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        status: lead.status
      });
    }
    setIsEditingFields(false);
    setEditingField(null);
    setEditMode(null);
  }, [lead]);

  // Handlers para edición individual
  const handleSaveIndividualField = useCallback(() => {
    if (lead && editedLead && editingField) {
      // Solo actualizar el campo específico que se está editando
      const updatedLead = { ...lead, [editingField]: editedLead[editingField] };
      updateLead(lead.id, updatedLead);
    }
    setEditingField(null);
    setEditMode(null);
  }, [lead, editedLead, editingField, updateLead]);

  const handleCancelIndividualField = useCallback(() => {
    if (lead && editingField) {
      // Revertir el campo específico que se está editando
      setEditedLead(prev => ({ ...prev, [editingField]: lead[editingField] }));
    }
    setEditingField(null);
    setEditMode(null);
  }, [lead, editingField]);

  const handleFieldChange = useCallback((field: keyof Lead, value: string) => {
    setEditedLead(prev => ({ ...prev, [field]: value }));
  }, []);

  // Create stable handlers for each field type to prevent focus loss
  const createFieldHandler = useCallback((field: keyof Lead) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      handleFieldChange(field, e.target.value);
    };
  }, [handleFieldChange]);

  const mockActivities = [
    {
      id: 1,
      type: 'email',
      title: 'Email enviado',
      description: 'Enviado email de bienvenida',
      date: '2024-01-15 10:30',
      user: 'Admin'
    },
    {
      id: 2,
      type: 'call',
      title: 'Llamada realizada',
      description: 'Llamada de seguimiento - 15 min',
      date: '2024-01-14 14:20',
      user: 'Admin'
    },
    {
      id: 3,
      type: 'note',
      title: 'Nota añadida',
      description: 'Cliente interesado en producto premium',
      date: '2024-01-13 09:15',
      user: 'Admin'
    }
  ];

  const mockTasks = [
    {
      id: 1,
      title: 'Seguimiento por email',
      dueDate: '2024-01-20',
      priority: 'Alta',
      completed: false
    },
    {
      id: 2,
      title: 'Preparar propuesta',
      dueDate: '2024-01-18',
      priority: 'Media',
      completed: false
    },
    {
      id: 3,
      title: 'Llamada de confirmación',
      dueDate: '2024-01-16',
      priority: 'Baja',
      completed: true
    }
  ];

  return (
    <>

      {/* Lead Record Card */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <PersonIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">Lead</h2>
              <p className="text-sm text-gray-500 mt-1">
                Información detallada del prospecto
              </p>
            </div>          
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              disabled={isEditingStage || editMode !== null}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all min-w-[100px] ${
                isFollowing 
                  ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              } ${(isEditingStage || editMode !== null) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isFollowing ? 'Siguiendo' : 'Seguir'}
            </button>
            
            {isEditingStage ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveStage}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium min-w-[80px]"
                >
                  Guardar
                </button>
                <button
                  onClick={handleCancelStageEdit}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm font-medium"
                >
                  Cancelar
                </button>
              </div>
            ) : editMode === 'complete' ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveFields}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium min-w-[80px]"
                >
                  Guardar
                </button>
                <button
                  onClick={handleCancelFieldsEdit}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm font-medium"
                >
                  Cancelar
                </button>
              </div>
            ) : editMode === 'individual' ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveIndividualField}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium min-w-[80px]"
                >
                  Guardar
                </button>
                <button
                  onClick={handleCancelIndividualField}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm font-medium"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditFields}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium min-w-[80px]"
              >
                Editar
              </button>
            )}

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button 
                  className={`p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 ${
                    isEditingStage || editMode !== null ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isEditingStage || editMode !== null}
                >
                  <DotsVerticalIcon className="w-4 h-4 text-gray-600" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg p-1">
                  <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded cursor-pointer hover:bg-gray-100">
                    <CopyIcon className="w-4 h-4 mr-2" />
                    Clonar Lead
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded cursor-pointer hover:bg-gray-100">
                    <ArchiveIcon className="w-4 h-4 mr-2" />
                    Convertir
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded cursor-pointer hover:bg-gray-100">
                    <BookmarkIcon className="w-4 h-4 mr-2" />
                    Asignar
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
                  <DropdownMenu.Item 
                    className="flex items-center px-3 py-2 text-sm rounded cursor-pointer hover:bg-gray-100 text-red-600"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Eliminar
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </div>

      {/* Pipeline Card */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-4">
        {/* Path de Etapas - Justificado al ancho completo */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center justify-between w-full">
            {pathStages.map((stage, index) => (
              <div key={stage.id} className="flex items-center flex-1">
                <button
                  onClick={() => handleStageClick(stage.status)}
                  disabled={isEditingStage}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer hover:shadow-md w-full justify-center ${
                    tempStatus === stage.status && isEditingStage
                      ? 'bg-orange-100 text-orange-800 border border-orange-200 ring-2 ring-orange-300'
                      : stage.status === lead.status
                        ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                        : stage.completed 
                          ? 'bg-green-100 text-green-800 border border-green-200 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                  } ${isEditingStage ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                >
                  {(stage.completed || stage.status === lead.status) && !isEditingStage && (
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {tempStatus === stage.status && isEditingStage && (
                    <svg className="w-4 h-4 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {stage.label}
                </button>
                {index < pathStages.length - 1 && (
                  <div className="flex-shrink-0 mx-2">
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>      

      {/* Header con Path de Etapas */}
      <div className="bg-white border-b border-gray-200">
        {/* Breadcrumb */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button
              onClick={onBack}
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Leads
            </button>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{lead.firstName} {lead.lastName}</span>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel Izquierdo - Detalles y Relacionados */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Detalles del Lead */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div 
                className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                onClick={toggleLeadInfo}
              >
                <h2 className="text-lg font-semibold text-gray-900">Información del Lead</h2>
                {expandedSections.leadInfo ? (
                  <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                )}
              </div>
              
              {expandedSections.leadInfo && (
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <EditableField
                        label="Nombre"
                        value={lead.firstName}
                        field="firstName"
                        isFirstField={true}
                      />
                      <EditableField
                        label="Apellido"
                        value={lead.lastName}
                        field="lastName"
                      />
                      <EditableField
                        label="Email"
                        value={lead.email}
                        field="email"
                        type="email"
                        icon={emailIcon}
                      />
                    </div>
                    <div className="space-y-4">
                      <EditableField
                        label="Estado"
                        value={lead.status}
                        field="status"
                        isSelect={true}
                        options={statusOptions}
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Fecha de Creación</label>
                        <p className="text-gray-900 flex items-center">
                          {calendarIcon}
                          {lead.createdDate}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Última Modificación</label>
                        <p className="text-gray-900 flex items-center">
                          {clockIcon}
                          {lead.lastModified}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tareas Relacionadas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold text-gray-900">Tareas</h2>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                    {mockTasks.length} total{mockTasks.length !== 1 ? 'es' : ''}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
                    Ver todas las tareas
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center">
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Nueva Tarea
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {mockTasks.map(task => (
                    <div key={task.id} className={`p-3 border rounded-lg ${task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            readOnly
                          />
                          <div>
                            <p className={`font-medium ${task.completed ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                              {task.title}
                            </p>
                            <p className="text-sm text-gray-500">Vence: {task.dueDate}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.priority === 'Alta' ? 'bg-red-100 text-red-800' :
                          task.priority === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Relacionados */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Relacionados</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <PersonIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Contactos</p>
                    <p className="text-lg font-semibold text-gray-900">0</p>
                  </div>
                  <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <FileTextIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Oportunidades</p>
                    <p className="text-lg font-semibold text-gray-900">0</p>
                  </div>
                  <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <ArchiveIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Casos</p>
                    <p className="text-lg font-semibold text-gray-900">0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Derecho - Actividades e Historial */}
        <div className="w-96 bg-white border-l border-gray-200 overflow-auto">
          <div className="p-4">
            {/* Tabs */}
            <div className="flex space-x-1 mb-4">
              <button
                onClick={() => setActiveTab('activities')}
                className={`px-3 py-2 text-sm font-medium rounded-lg ${
                  activeTab === 'activities' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Actividades
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-2 text-sm font-medium rounded-lg ${
                  activeTab === 'history' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Historial
              </button>
            </div>

            {/* Contenido de Actividades */}
            {activeTab === 'activities' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Actividades Recientes</h3>
                  <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {mockActivities.map(activity => (
                    <div key={activity.id} className="flex space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'email' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'call' ? 'bg-green-100 text-green-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {activity.type === 'email' ? (
                          <EnvelopeClosedIcon className="w-4 h-4" />
                        ) : activity.type === 'call' ? (
                          <MobileIcon className="w-4 h-4" />
                        ) : (
                          <ChatBubbleIcon className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                        <p className="text-gray-600 text-sm">{activity.description}</p>
                        <p className="text-gray-500 text-xs mt-1">{activity.date} • {activity.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contenido de Historial */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Historial de Cambios</h3>
                
                <div className="space-y-3">
                  <div className="flex space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-yellow-100 text-yellow-600 rounded-full">
                      <Pencil1Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">Estado cambiado</p>
                      <p className="text-gray-600 text-sm">De "New" a "Contacted"</p>
                      <p className="text-gray-500 text-xs mt-1">2024-01-15 10:30 • Admin</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-green-100 text-green-600 rounded-full">
                      <PlusIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">Lead creado</p>
                      <p className="text-gray-600 text-sm">Registro inicial del lead</p>
                      <p className="text-gray-500 text-xs mt-1">{lead.createdDate} • Admin</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Eliminación */}
      <Dialog.Root open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
              Eliminar Lead
            </Dialog.Title>
            
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar este lead? Esta acción no se puede deshacer.
            </p>
            
            <div className="flex justify-end space-x-3">
              <Dialog.Close asChild>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}