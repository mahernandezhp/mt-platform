"use client";
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LeadsProvider } from '../contexts/LeadsContext';
import dynamic from 'next/dynamic';

// Lazy load pages
const DashboardLayout = dynamic(() => import('./DashboardLayout'));
const HomePage = dynamic(() => import('./pages/HomePage'));
const AnalyticsPage = dynamic(() => import('./pages/AnalyticsPage'));
const ReportsPage = dynamic(() => import('./pages/ReportsPage'));
const SettingsPage = dynamic(() => import('./pages/SettingsPage'));
const ProfilePage = dynamic(() => import('./pages/ProfilePage'));
const LeadsPage = dynamic(() => import('./pages/LeadsPage'));
const LeadDetailPage = dynamic(() => import('./pages/LeadDetailPage'));

export default function Dashboard() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  if (!user) {
    return null; // El AuthProvider se encargará de mostrar el login
  }

  const handleNavigateToLeadDetail = (leadId: string) => {
    setSelectedLeadId(leadId);
    setCurrentPage('lead-detail');
  };

  const handleBackToLeads = () => {
    setSelectedLeadId(null);
    setCurrentPage('leads');
  };

  const handleNavigate = (pageId: string) => {
    console.log(`Navigating to page: ${pageId}`);
    setCurrentPage(pageId);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'leads':
        return <LeadsPage onNavigateToDetail={handleNavigateToLeadDetail} />;
      case 'lead-detail':
        return <LeadDetailPage leadId={selectedLeadId} onBack={handleBackToLeads} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <LeadsProvider>
      <DashboardLayout onNavigate={handleNavigate}>
        {renderPage()}
      </DashboardLayout>
    </LeadsProvider>
  );
}
