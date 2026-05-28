
import React, { Suspense, useCallback, useState } from 'react';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import { View, ERPProvider, IntegrationStatus, HeatmapDataPoint } from './types';
import { HEATMAP_DATA } from './constants';

type OperationsTab = 'metrics' | 'audit' | 'vision' | 'scanner' | 'variance' | 'compliance';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Scheduling = React.lazy(() => import('./pages/Scheduling'));
const Operations = React.lazy(() => import('./pages/Operations'));
const Inventory = React.lazy(() => import('./pages/Inventory'));
const Team = React.lazy(() => import('./pages/Team'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const EnterpriseSkillsPolicies = React.lazy(() => import('./pages/EnterpriseSkillsPolicies'));
const Playbook = React.lazy(() => import('./pages/Playbook'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Comparison = React.lazy(() => import('./pages/Comparison'));
const MetricsReport = React.lazy(() => import('./pages/MetricsReport'));
const RoyaltyDashboard = React.lazy(() => import('./pages/RoyaltyDashboard'));
const StoreRatings = React.lazy(() => import('./pages/StoreRatings'));
const Logistics = React.lazy(() => import('./pages/Logistics'));
const GhostInventory = React.lazy(() => import('./pages/GhostInventory'));
const DefenderAssistant = React.lazy(() => import('./components/DefenderAssistant'));

const LoadingView: React.FC = () => (
  <div className="flex-1 bg-slate-950 text-slate-400 flex items-center justify-center font-mono text-xs uppercase tracking-widest">
    Loading Defender module...
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
    const viewRenderers: Record<View, () => React.ReactNode> = {
      [View.DASHBOARD]: () => <Dashboard setCurrentView={setCurrentView} />,
      [View.LOGISTICS]: () => <Logistics />,
      [View.GHOST_INVENTORY]: () => <GhostInventory />,
      [View.METRICS_REPORT]: () => <MetricsReport />,
      [View.ROYALTY_DASHBOARD]: () => <RoyaltyDashboard />,
      [View.STORE_RATINGS]: () => <StoreRatings />,
      [View.COMPARISON]: () => <Comparison />,
      [View.SCHEDULING]: () => <Scheduling setCurrentView={setCurrentView} onFinalize={handleFinalizeSchedule} activeProvider={activeERPProvider} setActiveProvider={setActiveERPProvider} isConnected={isERPConnected} setIsConnected={setIsERPConnected} setHubspotStatus={setHubspotStatus} heatmapData={heatmapData} onAdjustStaffing={handleStaffingAdjustment} />,
      [View.OPERATIONS]: () => <Operations defaultTab={operationsTab} externalTrigger={linterTrigger} onClearTrigger={handleClearLinterTrigger} />,
      [View.INVENTORY]: () => <Inventory />,
      [View.ANALYTICS]: () => <Analytics hubspotStatus={hubspotStatus} />,
      [View.ENTERPRISE_SKILLS]: () => <EnterpriseSkillsPolicies />,
      [View.TEAM]: () => <Team onEmployeeAdded={handleEmployeeAdded} />,
      [View.PLAYBOOK]: () => <Playbook />,
      [View.SETTINGS]: () => <Settings hubspotStatus={hubspotStatus} setHubspotStatus={setHubspotStatus} />,
    };

    return viewRenderers[currentView]();
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
          <DefenderAssistant hubspotStatus={hubspotStatus} />
        </Suspense>
      </main>
    </div>
  );
};

export default App;