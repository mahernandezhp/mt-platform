"use client";
import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Lead } from '../../contexts/LeadsContext';

interface EditLeadModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingLead: Lead | null;
  onUpdateLead: (leadId: string, updates: Partial<Lead>) => void;
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

export default function EditLeadModal({
  isOpen,
  onOpenChange,
  editingLead,
  onUpdateLead,
  onShowToast
}: EditLeadModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    status: 'New' as Lead['status']
  });

  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    general: ''
  });

  const statusOptions: Lead['status'][] = ['New', 'Contacted', 'Qualified', 'Unqualified', 'Converted'];

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Load editing lead data when modal opens
  useEffect(() => {
    if (isOpen && editingLead) {
      setFormData({
        firstName: editingLead.firstName,
        lastName: editingLead.lastName,
        email: editingLead.email,
        status: editingLead.status
      });
      setFormErrors({
        firstName: '',
        lastName: '',
        email: '',
        general: ''
      });
    }
  }, [isOpen, editingLead]);

  const validateForm = (): boolean => {
    const errors = {
      firstName: '',
      lastName: '',
      email: '',
      general: ''
    };

    if (!formData.firstName.trim()) {
      errors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'El formato del email no es válido';
    }

    setFormErrors(errors);
    return !Object.values(errors).some(error => error !== '');
  };

  const handleEditLead = async () => {
    if (!editingLead) return;

    if (!validateForm()) {
      onShowToast('Por favor corrige los errores en el formulario', 'error');
      return;
    }

    try {
      const updates: Partial<Lead> = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        status: formData.status,
        updatedAt: new Date().toISOString()
      };

      onUpdateLead(editingLead.id, updates);
      onOpenChange(false);
      onShowToast('Lead actualizado exitosamente', 'success');
    } catch (error) {
      console.error('Error updating lead:', error);
      onShowToast('Error al actualizar el lead', 'error');
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!editingLead) {
    return null;
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-full max-w-md p-6 z-50">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Editar Lead
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600">
                <Cross2Icon className="w-6 h-6" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ingresa el nombre"
              />
              {formErrors.firstName && (
                <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ingresa el apellido"
              />
              {formErrors.lastName && (
                <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ingresa el email"
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as Lead['status'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Dialog.Close asChild>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Cancelar
              </button>
            </Dialog.Close>
            <button
              onClick={handleEditLead}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Guardar Cambios
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}