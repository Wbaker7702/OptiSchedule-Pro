import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Scheduling from './pages/Scheduling';
import Operations from './pages/Operations';
import Inventory from './pages/Inventory';
import Team from './pages/Team';
import Analytics from './pages/Analytics';
import Playbook from './pages/Playbook';
import Settings from './pages/Settings';
import Login from './components/Login';
import SentinelAI from './components/SentinelAI';
import { View } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [operationsTab, setOperationsTab] = useState<'metrics' | 'audit' | 'vision'>('metrics');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView(View.DASHBOARD);
  };

  const navigateToOperations = (tab: 'metrics' | 'audit' | 'vision' = 'metrics') => {
    setOperationsTab(tab);
    setCurrentView(View.OPERATIONS);
  };

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard />;
      case View.SCHEDULING:
        return <Scheduling setCurrentView={setCurrentView} onFinalize={() => navigateToOperations('audit')} />;
      case View.OPERATIONS:
        return <Operations defaultTab={operationsTab} />;
      case View.INVENTORY:
        return <Inventory />;
      case View.ANALYTICS:
        return <Analytics />;
      case View.TEAM:
        return <Team />;
      case View.PLAYBOOK:
        return <Playbook setCurrentView={setCurrentView} />;
      case View.SETTINGS:
        return <Settings />;
      default:
        return <Dashboard />;
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
        <SentinelAI />
      </main>
    </div>
  );
};

export default App;