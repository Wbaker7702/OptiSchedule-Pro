
import React, { Suspense, useCallback, useState } from 'react';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import { View, ERPProvider, IntegrationStatus, HeatmapDataPoint, OperationsTab } from './types';
import { HEATMAP_DATA } from './constants';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Scheduling = React.lazy(() => import('./pages/Scheduling'));
const Operations = React.lazy(() => import('./pages/Operations'));
const Inventory = React.lazy(() => import('./pages/Inventory'));
const Team = React.lazy(() => import('./pages/Team'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Playbook = React.lazy(() => import('./pages/Playbook'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Comparison = React.lazy(() => import('./pages/Comparison'));
const MetricsReport = React.lazy(() => import('./pages/MetricsReport'));
const RoyaltyDashboard = React.lazy(() => import('./pages/RoyaltyDashboard'));
const StoreRatings = React.lazy(() => import('./pages/StoreRatings'));
const Logistics = React.lazy(() => import('./pages/Logistics'));
const GhostInventory = React.lazy(() => import('./pages/GhostInventory'));
const SentinelAI = React.lazy(() => import('./components/SentinelAI'));

const assertNever = (value: never): never => {
  throw new Error(`Unhandled view: ${value}`);
};

const LoadingView: React.FC = () => (
  <div className="flex-1 bg-slate-950 text-slate-400 flex items-center justify-center font-mono text-xs uppercase tracking-widest">
    Loading operations module...
  </div>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [operationsTab, setOperationsTab] = useState<OperationsTab>('metrics');
  const [linterTrigger, setLinterTrigger] = useState<string | null>(null);

  const [heatmapData, setHeatmapData] = useState<HeatmapDataPoint[]>(HEATMAP_DATA);
  const [activeERPProvider, setActiveERPProvider] = useState<ERPProvider>('Dynamics 365');
  const [isERPConnected, setIsERPConnected] = useState(true);
  const [hubspotStatus, setHubspotStatus] = useState<IntegrationStatus>('connected');

  const handleLogin = useCallback(() => setIsAuthenticated(true), []);
  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentView(View.DASHBOARD);
    setOperationsTab('metrics');
    setLinterTrigger(null);
  }, []);

  const navigateToOperations = useCallback((tab: OperationsTab = 'metrics') => {
    setOperationsTab(tab);
    setCurrentView(View.OPERATIONS);
  }, []);

  const handleEmployeeAdded = useCallback(() => {
    setLinterTrigger('NEW_ASSET_SCAN');
    navigateToOperations('audit');
  }, [navigateToOperations]);

  const handleStaffingAdjustment = useCallback(() => {
    setHeatmapData(prev => prev.map(point => {
      if (point.efficiency < 80) {
        return { ...point, staffing: point.staffing + 2, efficiency: Math.min(100, point.efficiency + 15) };
      }
      return point;
    }));
  }, []);

  const handleSidebarViewChange = useCallback((view: View) => {
    if (view !== View.OPERATIONS) {
      setOperationsTab('metrics');
    }
    setCurrentView(view);
  }, []);

  const handleFinalizeSchedule = useCallback(() => {
    navigateToOperations('audit');
  }, [navigateToOperations]);

  const handleClearLinterTrigger = useCallback(() => {
    setLinterTrigger(null);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard setCurrentView={setCurrentView} />;
      case View.LOGISTICS: return <Logistics />;
      case View.GHOST_INVENTORY: return <GhostInventory />;
      case View.METRICS_REPORT: return <MetricsReport />;
      case View.ROYALTY_DASHBOARD: return <RoyaltyDashboard />;
      case View.STORE_RATINGS: return <StoreRatings />;
      case View.COMPARISON: return <Comparison />;
      case View.SCHEDULING: return <Scheduling setCurrentView={setCurrentView} onFinalize={handleFinalizeSchedule} activeProvider={activeERPProvider} setActiveProvider={setActiveERPProvider} isConnected={isERPConnected} setIsConnected={setIsERPConnected} setHubspotStatus={setHubspotStatus} heatmapData={heatmapData} onAdjustStaffing={handleStaffingAdjustment} />;
      case View.OPERATIONS: return <Operations defaultTab={operationsTab} externalTrigger={linterTrigger} onClearTrigger={handleClearLinterTrigger} />;
      case View.INVENTORY: return <Inventory />;
      case View.ANALYTICS: return <Analytics hubspotStatus={hubspotStatus} />;
      case View.TEAM: return <Team onEmployeeAdded={handleEmployeeAdded} />;
      case View.PLAYBOOK: return <Playbook />;
      case View.SETTINGS: return <Settings hubspotStatus={hubspotStatus} setHubspotStatus={setHubspotStatus} />;
      default:
        return assertNever(currentView);
    }
  };

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={handleSidebarViewChange}
        onLogout={handleLogout}
      />
      <main className="flex-1 ml-64 flex flex-col h-screen relative">
        <Suspense fallback={<LoadingView />}>
          {renderView()}
          <SentinelAI hubspotStatus={hubspotStatus} />
        </Suspense>
      </main>
    </div>
  );
};

export default App;