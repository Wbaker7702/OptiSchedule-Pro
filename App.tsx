
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Scheduling from './pages/Scheduling';
import Operations from './pages/Operations';
import Inventory from './pages/Inventory';
import Team from './pages/Team';
import Analytics from './pages/Analytics';
import EnterpriseSkillsPolicies from './pages/EnterpriseSkillsPolicies';
import Playbook from './pages/Playbook';
import Settings from './pages/Settings';
import Comparison from './pages/Comparison';
import MetricsReport from './pages/MetricsReport';
import RoyaltyDashboard from './pages/RoyaltyDashboard';
import StoreRatings from './pages/StoreRatings';
import Logistics from './pages/Logistics';
import GhostInventory from './pages/GhostInventory';
import Login from './components/Login';
import DefenderAssistant from './components/DefenderAssistant';
import { View, ERPProvider, IntegrationStatus, HeatmapDataPoint } from './types';
import { HEATMAP_DATA } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [operationsTab, setOperationsTab] = useState<'metrics' | 'audit' | 'vision' | 'scanner' | 'variance' | 'compliance'>('metrics');
  const [linterTrigger, setLinterTrigger] = useState<string | null>(null);

  const [heatmapData, setHeatmapData] = useState<HeatmapDataPoint[]>(HEATMAP_DATA);
  const [activeERPProvider, setActiveERPProvider] = useState<ERPProvider>('Dynamics 365');
  const [isERPConnected, setIsERPConnected] = useState(true);
  const [hubspotStatus, setHubspotStatus] = useState<IntegrationStatus>('connected');

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => { setIsAuthenticated(false); setCurrentView(View.DASHBOARD); };

  const navigateToOperations = (tab: 'metrics' | 'audit' | 'vision' | 'scanner' | 'variance' | 'compliance' = 'metrics') => {
    setOperationsTab(tab);
    setCurrentView(View.OPERATIONS);
  };

  const handleEmployeeAdded = () => {
    setLinterTrigger('NEW_ASSET_SCAN');
    navigateToOperations('audit');
  };

  const handleStaffingAdjustment = () => {
    setHeatmapData(prev => prev.map(point => {
      if (point.efficiency < 80) {
        return { ...point, staffing: point.staffing + 2, efficiency: Math.min(100, point.efficiency + 15) };
      }
      return point;
    }));
  };

  const renderView = () => {
    const views: Record<View, React.ReactNode> = {
      [View.DASHBOARD]: <Dashboard setCurrentView={setCurrentView} />,
      [View.LOGISTICS]: <Logistics />,
      [View.GHOST_INVENTORY]: <GhostInventory />,
      [View.METRICS_REPORT]: <MetricsReport />,
      [View.ROYALTY_DASHBOARD]: <RoyaltyDashboard />,
      [View.STORE_RATINGS]: <StoreRatings />,
      [View.COMPARISON]: <Comparison />,
      [View.SCHEDULING]: <Scheduling setCurrentView={setCurrentView} onFinalize={() => navigateToOperations('audit')} activeProvider={activeERPProvider} setActiveProvider={setActiveERPProvider} isConnected={isERPConnected} setIsConnected={setIsERPConnected} setHubspotStatus={setHubspotStatus} heatmapData={heatmapData} onAdjustStaffing={handleStaffingAdjustment} />,
      [View.OPERATIONS]: <Operations defaultTab={operationsTab} externalTrigger={linterTrigger} onClearTrigger={() => setLinterTrigger(null)} />,
      [View.INVENTORY]: <Inventory />,
      [View.ANALYTICS]: <Analytics hubspotStatus={hubspotStatus} />,
      [View.ENTERPRISE_SKILLS]: <EnterpriseSkillsPolicies />,
      [View.TEAM]: <Team onEmployeeAdded={handleEmployeeAdded} />,
      [View.PLAYBOOK]: <Playbook />,
      [View.SETTINGS]: <Settings hubspotStatus={hubspotStatus} setHubspotStatus={setHubspotStatus} />,
    };

    return views[currentView];
  };

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

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
        <DefenderAssistant hubspotStatus={hubspotStatus} />
      </main>
    </div>
  );
};

export default App;