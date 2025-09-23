"use client";
import { Lead } from '../../contexts/LeadsContext';
import {
  Pencil1Icon,
  TrashIcon,
  EyeOpenIcon,
  DotsVerticalIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MixerVerticalIcon
} from '@radix-ui/react-icons';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface LeadsTableProps {
  leads: Lead[];
  selectedLeads: string[];
  sortField: keyof Lead | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Lead) => void;
  onToggleSelection: (leadId: string) => void;
  onToggleSelectAll: () => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
  onNavigateToDetail?: (leadId: string) => void;
}

export default function LeadsTable({
  leads,
  selectedLeads,
  sortField,
  sortDirection,
  onSort,
  onToggleSelection,
  onToggleSelectAll,
  onEditLead,
  onDeleteLead,
  onNavigateToDetail
}: LeadsTableProps) {
  const statusColors = {
    'New': 'bg-blue-100 text-blue-800',
    'Contacted': 'bg-yellow-100 text-yellow-800',
    'Qualified': 'bg-green-100 text-green-800',
    'Unqualified': 'bg-red-100 text-red-800',
    'Converted': 'bg-purple-100 text-purple-800'
  };

  const allSelected = leads.length > 0 && selectedLeads.length === leads.length;
  const someSelected = selectedLeads.length > 0 && selectedLeads.length < leads.length;

  const getSortIcon = (field: keyof Lead) => {
    if (sortField !== field) {
      return <MixerVerticalIcon className="w-3 h-3 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUpIcon className="w-3 h-3 text-blue-600" />
      : <ChevronDownIcon className="w-3 h-3 text-blue-600" />;
  };

  const handleSort = (field: keyof Lead) => {
    onSort(field);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-12 px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </th>
              
                              <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                  onClick={() => onSort('firstName')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Nombre</span>
                    {getSortIcon('firstName')}
                  </div>
                </th>
              
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                onClick={() => onSort('lastName')}
              >
                <div className="flex items-center space-x-1">
                  <span>Apellido</span>
                  {getSortIcon('lastName')}
                </div>
              </th>
              
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                onClick={() => onSort('email')}
              >
                <div className="flex items-center space-x-1">
                  <span>Email</span>
                  {getSortIcon('email')}
                </div>
              </th>
              
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                onClick={() => onSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Estado</span>
                  {getSortIcon('status')}
                </div>
              </th>
              
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                onClick={() => onSort('createdDate')}
              >
                <div className="flex items-center space-x-1">
                  <span>Fecha de Creación</span>
                  {getSortIcon('createdDate')}
                </div>
              </th>
              
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr 
                key={lead.id} 
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => onToggleSelection(lead.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {onNavigateToDetail ? (
                    <button
                      onClick={() => onNavigateToDetail(lead.id)}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                    >
                      {lead.firstName}
                    </button>
                  ) : (
                    <span className="text-gray-900">{lead.firstName}</span>
                  )}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {lead.lastName}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {lead.email}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[lead.status]}`}>
                    {lead.status}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(lead.createdDate).toLocaleDateString('es-ES')}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center justify-end">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-50">
                          <DotsVerticalIcon className="w-4 h-4" />
                        </button>
                      </DropdownMenu.Trigger>
                      
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content className="bg-white rounded-lg shadow-lg border p-1 z-50">
                          {onNavigateToDetail && (
                            <DropdownMenu.Item
                              className="flex items-center px-3 py-2 text-sm text-blue-600 rounded hover:bg-blue-50 cursor-pointer"
                              onClick={() => onNavigateToDetail(lead.id)}
                            >
                              <EyeOpenIcon className="w-4 h-4 mr-2" />
                              Ver detalles
                            </DropdownMenu.Item>
                          )}
                          
                          <DropdownMenu.Item
                            className="flex items-center px-3 py-2 text-sm text-gray-600 rounded hover:bg-gray-50 cursor-pointer"
                            onClick={() => onEditLead(lead)}
                          >
                            <Pencil1Icon className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenu.Item>
                          
                          <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
                          
                          <DropdownMenu.Item
                            className="flex items-center px-3 py-2 text-sm text-red-600 rounded hover:bg-red-50 cursor-pointer"
                            onClick={() => onDeleteLead(lead.id)}
                          >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Eliminar
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {leads.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay leads</h3>
          <p className="text-gray-500">Comienza creando tu primer lead.</p>
        </div>
      )}
    </div>
  );
}