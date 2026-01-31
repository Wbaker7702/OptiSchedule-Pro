
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Scheduling from './pages/Scheduling';
import Operations from './pages/Operations';
import Inventory from './pages/Inventory';
import Team from './pages/Team';
import Analytics from './pages/Analytics';
import Playbook from './pages/Playbook';
import Feedback from './pages/Feedback';
import Settings from './pages/Settings';
import Login from './components/Login';
import SentinelAI from './components/SentinelAI';
import { View, ERPProvider, IntegrationStatus } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [operationsTab, setOperationsTab] = useState<'metrics' | 'audit' | 'vision' | 'scanner'>('metrics');
  const [linterTrigger, setLinterTrigger] = useState<string | null>(null);

  // Global Integration State
  const [activeERPProvider, setActiveERPProvider] = useState<ERPProvider>('Dynamics 365');
  const [isERPConnected, setIsERPConnected] = useState(false);
  const [hubspotStatus, setHubspotStatus] = useState<IntegrationStatus>('disconnected');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView(View.DASHBOARD);
  };

  const navigateToOperations = (tab: 'metrics' | 'audit' | 'vision' | 'scanner' = 'metrics') => {
    setOperationsTab(tab);
    setCurrentView(View.OPERATIONS);
  };

  const handleEmployeeAdded = () => {
    setLinterTrigger('NEW_ASSET_SCAN');
    navigateToOperations('audit');
  };

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard setCurrentView={setCurrentView} />;
      case View.SCHEDULING:
        return (
          <Scheduling 
            setCurrentView={setCurrentView} 
            onFinalize={() => navigateToOperations('audit')}
            activeProvider={activeERPProvider}
            setActiveProvider={setActiveERPProvider}
            isConnected={isERPConnected}
            setIsConnected={setIsERPConnected}
            setHubspotStatus={setHubspotStatus}
          />
        );
      case View.OPERATIONS:
        return (
          <Operations 
            defaultTab={operationsTab} 
            externalTrigger={linterTrigger}
            onClearTrigger={() => setLinterTrigger(null)}
          />
        );
      case View.INVENTORY:
        return <Inventory />;
      case View.ANALYTICS:
        return <Analytics hubspotStatus={hubspotStatus} />;
      case View.TEAM:
        return <Team onEmployeeAdded={handleEmployeeAdded} />;
      case View.PLAYBOOK:
        return <Playbook setCurrentView={setCurrentView} />;
      case View.FEEDBACK:
        return <Feedback />;
      case View.SETTINGS:
        return <Settings hubspotStatus={hubspotStatus} setHubspotStatus={setHubspotStatus} />;
      default:
        return <Dashboard setCurrentView={setCurrentView} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={(view) => {
          if (view !== View.OPERATIONS) setOperationsTab('metrics');
          setCurrentView(view);
        }} 
        onLogout={handleLogout}
      />
      <main className="flex-1 ml-64 flex flex-col h-screen relative">
        {renderView()}
        <SentinelAI hubspotStatus={hubspotStatus} />
      </main>
    </div>
  );
};

export default App;
