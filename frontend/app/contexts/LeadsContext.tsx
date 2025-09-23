"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Unqualified' | 'Converted';
  createdDate: string;
  lastModified: string;
}

export interface ListView {
  id: string;
  name: string;
  isDefault: boolean;
  isPinned: boolean;
  filters: any[];
  columns: string[];
}

interface LeadsContextType {
  leads: Lead[];
  listViews: ListView[];
  currentListView: ListView;
  searchQuery: string;
  selectedLeads: string[];
  filteredLeads: Lead[];
  createLead: (lead: Omit<Lead, 'id' | 'createdDate' | 'lastModified'>) => void;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  deleteMultipleLeads: (ids: string[]) => void;
  setSearchQuery: (query: string) => void;
  setCurrentListView: (listView: ListView) => void;
  createListView: (listView: Omit<ListView, 'id'>) => void;
  toggleListViewPin: (listViewId: string) => void;
  toggleLeadSelection: (id: string) => void;
  toggleSelectAll: () => void;
  clearSelection: () => void;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export function LeadsProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  
  // Lista de vistas predefinidas
  const defaultListViews: ListView[] = [
    {
      id: 'all',
      name: 'Todos los Leads',
      isDefault: true,
      isPinned: true,
      filters: [],
      columns: ['firstName', 'lastName', 'email', 'status', 'createdDate']
    },
    {
      id: 'new',
      name: 'Leads Nuevos',
      isDefault: false,
      isPinned: false,
      filters: [{ field: 'status', operator: 'equals', value: 'New' }],
      columns: ['firstName', 'lastName', 'email', 'createdDate']
    },
    {
      id: 'qualified',
      name: 'Leads Calificados',
      isDefault: false,
      isPinned: false,
      filters: [{ field: 'status', operator: 'equals', value: 'Qualified' }],
      columns: ['firstName', 'lastName', 'email', 'status', 'lastModified']
    },
    {
      id: 'recent',
      name: 'Creados Recientemente',
      isDefault: false,
      isPinned: false,
      filters: [],
      columns: ['firstName', 'lastName', 'email', 'status', 'createdDate']
    }
  ];

  const [listViews, setListViews] = useState<ListView[]>(defaultListViews);
  const [currentListView, setCurrentListView] = useState<ListView>(defaultListViews[0]);

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const savedLeads = localStorage.getItem('leads');
    const savedListViews = localStorage.getItem('listViews');
    const savedCurrentView = localStorage.getItem('currentListView');

    if (savedLeads) {
      setLeads(JSON.parse(savedLeads));
    } else {
      // Datos de ejemplo si no hay datos guardados
      const sampleLeads: Lead[] = [
        {
          id: '1',
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@email.com',
          status: 'New',
          createdDate: '2024-01-15',
          lastModified: '2024-01-15'
        },
        {
          id: '2',
          firstName: 'María',
          lastName: 'García',
          email: 'maria.garcia@email.com',
          status: 'Contacted',
          createdDate: '2024-01-14',
          lastModified: '2024-01-16'
        },
        {
          id: '3',
          firstName: 'Carlos',
          lastName: 'López',
          email: 'carlos.lopez@email.com',
          status: 'Qualified',
          createdDate: '2024-01-13',
          lastModified: '2024-01-17'
        },
        {
          id: '4',
          firstName: 'Ana',
          lastName: 'Martínez',
          email: 'ana.martinez@email.com',
          status: 'New',
          createdDate: '2024-01-12',
          lastModified: '2024-01-12'
        },
        {
          id: '5',
          firstName: 'Luis',
          lastName: 'Rodríguez',
          email: 'luis.rodriguez@email.com',
          status: 'Converted',
          createdDate: '2024-01-11',
          lastModified: '2024-01-18'
        }
      ];
      setLeads(sampleLeads);
      localStorage.setItem('leads', JSON.stringify(sampleLeads));
    }

    if (savedListViews) {
      setListViews(JSON.parse(savedListViews));
    }

    if (savedCurrentView) {
      setCurrentListView(JSON.parse(savedCurrentView));
    }
  }, []);

  // Guardar leads en localStorage cuando cambien
  useEffect(() => {
    if (leads.length > 0) {
      localStorage.setItem('leads', JSON.stringify(leads));
    }
  }, [leads]);

  // Filtrar leads basado en la vista actual y búsqueda
  const filteredLeads = leads.filter(lead => {
    // Aplicar filtros de la vista actual
    const passesViewFilters = currentListView.filters.every(filter => {
      if (filter.field === 'status' && filter.operator === 'equals') {
        return lead.status === filter.value;
      }
      return true;
    });

    // Aplicar filtro de búsqueda
    const passesSearch = searchQuery === '' || 
      lead.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.status.toLowerCase().includes(searchQuery.toLowerCase());

    return passesViewFilters && passesSearch;
  });

  const createLead = (leadData: Omit<Lead, 'id' | 'createdDate' | 'lastModified'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Date.now().toString(),
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };
    setLeads(prev => [...prev, newLead]);
  };

  const updateLead = (id: string, leadData: Partial<Lead>) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id 
        ? { ...lead, ...leadData, lastModified: new Date().toISOString().split('T')[0] }
        : lead
    ));
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
    setSelectedLeads(prev => prev.filter(selectedId => selectedId !== id));
  };

  const deleteMultipleLeads = (ids: string[]) => {
    setLeads(prev => prev.filter(lead => !ids.includes(lead.id)));
    setSelectedLeads([]);
  };

  const createListView = (listViewData: Omit<ListView, 'id'>) => {
    const newListView: ListView = {
      ...listViewData,
      id: Date.now().toString()
    };
    setListViews(prev => [...prev, newListView]);
    localStorage.setItem('listViews', JSON.stringify([...listViews, newListView]));
  };

  const toggleListViewPin = (listViewId: string) => {
    setListViews(prev => {
      const updatedViews = prev.map(view =>
        view.id === listViewId
          ? { ...view, isPinned: !view.isPinned }
          : view
      );
      localStorage.setItem('listViews', JSON.stringify(updatedViews));
      return updatedViews;
    });
    
    // Si estamos modificando la vista actual, actualizarla también
    if (currentListView.id === listViewId) {
      setCurrentListView(prev => ({ ...prev, isPinned: !prev.isPinned }));
    }
  };

  const handleSetCurrentListView = (listView: ListView) => {
    setCurrentListView(listView);
    setSelectedLeads([]);
    localStorage.setItem('currentListView', JSON.stringify(listView));
  };

  const toggleLeadSelection = (id: string) => {
    setSelectedLeads(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  const clearSelection = () => {
    setSelectedLeads([]);
  };

  return (
    <LeadsContext.Provider value={{
      leads,
      listViews,
      currentListView,
      searchQuery,
      selectedLeads,
      filteredLeads,
      createLead,
      updateLead,
      deleteLead,
      deleteMultipleLeads,
      setSearchQuery,
      setCurrentListView: handleSetCurrentListView,
      createListView,
      toggleListViewPin,
      toggleLeadSelection,
      toggleSelectAll,
      clearSelection
    }}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadsContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
}
