
import { Employee, Product, HeatmapDataPoint, DepartmentMetric, IngressDataPoint, Vulnerability, AuditLog, LaborLawConfig, SystemPlugin } from './types';

export const CURRENT_USER = "Wesley Baker";
export const STORE_NUMBER = "5065";
export const COMPARISON_STORE = "2080";
export const APP_VERSION = "v4.1.0-Azure-Cloud";
export const CURRENT_STATE = "MI";

export interface StoreRatingData {
  id: string;
  location: string;
  state: string;
  overallScore: number;
  customerExperience: number;
  operationalEfficiency: number;
  laborCompliance: number;
  fiscalROI: number;
  safetyScore: number;
  lastAudit: string;
}

export const MOCK_STORES: StoreRatingData[] = [
  { id: "5065", location: "Kalamazoo", state: "MI", overallScore: 92, customerExperience: 88, operationalEfficiency: 94, laborCompliance: 98, fiscalROI: 85, safetyScore: 95, lastAudit: "2024-05-15" },
  { id: "2080", location: "Detroit", state: "MI", overallScore: 84, customerExperience: 82, operationalEfficiency: 79, laborCompliance: 91, fiscalROI: 76, safetyScore: 89, lastAudit: "2024-04-20" },
  { id: "1010", location: "Columbus", state: "OH", overallScore: 78, customerExperience: 75, operationalEfficiency: 72, laborCompliance: 85, fiscalROI: 68, safetyScore: 82, lastAudit: "2024-05-01" },
  { id: "3030", location: "Chicago", state: "IL", overallScore: 95, customerExperience: 92, operationalEfficiency: 96, laborCompliance: 99, fiscalROI: 91, safetyScore: 97, lastAudit: "2024-05-18" },
  { id: "4040", location: "Indianapolis", state: "IN", overallScore: 81, customerExperience: 79, operationalEfficiency: 83, laborCompliance: 88, fiscalROI: 74, safetyScore: 85, lastAudit: "2024-03-12" },
];

export const HOURLY_LOGISTICS = [
  { hour: '8 AM', inbound: 4, outbound: 12, pickRate: 98 },
  { hour: '9 AM', inbound: 8, outbound: 22, pickRate: 96 },
  { hour: '10 AM', inbound: 12, outbound: 45, pickRate: 94 },
  { hour: '11 AM', inbound: 6, outbound: 68, pickRate: 92 },
  { hour: '12 PM', inbound: 2, outbound: 85, pickRate: 88 },
  { hour: '1 PM', inbound: 5, outbound: 72, pickRate: 89 },
  { hour: '2 PM', inbound: 9, outbound: 55, pickRate: 93 },
  { hour: '3 PM', inbound: 15, outbound: 42, pickRate: 95 },
  { hour: '4 PM', inbound: 12, outbound: 38, pickRate: 97 },
];

export const ROYALTY_METRICS = {
  baselineLaborSalesPct: 25.0,
  currentLaborSalesPct: 21.8,
  royaltyRate: 0.15,
  backPayMonthsSettled: 1,
  backPayMonthsTotal: 3,
  backPayStatus: 'Pending' as 'Pending' | 'Settled',
  backPayPeriod: {
    start: '2025-11-01',
    end: '2026-02-01',
    totalSales: 1250000,
    historicalLaborPct: 25.4,
    optimizedLaborPct: 22.1,
    recapturedValue: 41250,
    creatorRoyalty: 6187.50
  }
};

export const STORE_2080_METRICS = {
  avgPayRate: 15.20,
  targetWeeklyHoursRecapture: 245,
  executionLeakage: 9800,
  currentROI: 14.8,
};

export const PLUGIN_REGISTRY: SystemPlugin[] = [
  {
    id: 'plg-cloud-az',
    name: 'Azure Cloud Fabric',
    category: 'Cloud',
    provider: 'Microsoft Azure',
    description: 'Hyperscale compute, storage, and Cognitive Services backbone.',
    version: '2024.Q4',
    status: 'Mounted',
    iconName: 'Cloud'
  },
  {
    id: 'plg-crm-hs',
    name: 'HubSpot Breeze',
    category: 'CRM',
    provider: 'HubSpot',
    description: 'Real-time marketing velocity & loyalty signal ingress.',
    version: '2.4.1',
    status: 'Mounted',
    iconName: 'Zap'
  },
  {
    id: 'plg-erp-d365',
    name: 'Dynamics 365 ERP',
    category: 'ERP',
    provider: 'Microsoft',
    description: 'Enterprise resource planning & fiscal data bridge.',
    version: '8.0.2',
    status: 'Mounted',
    iconName: 'Database'
  },
  {
    id: 'plg-lab-mi',
    name: 'Michigan Labor Frame',
    category: 'Jurisdiction',
    provider: 'Sentinel Legal',
    description: 'MI P.A. 90 Compliance (Minors & Mandatory Breaks).',
    version: '1.0.4',
    status: 'Mounted',
    iconName: 'Scale'
  },
  {
    id: 'plg-vision-az',
    name: 'Azure Cognitive Vision',
    category: 'Vision',
    provider: 'Microsoft Azure',
    description: 'Edge-based computer vision for inventory & safety.',
    version: '3.1.0',
    status: 'Available',
    iconName: 'Eye'
  }
];

export const LABOR_REGULATIONS: Record<string, LaborLawConfig> = {
  "MI": {
    state: "Michigan",
    maxShiftAdult: 12,
    maxShiftMinor1617: 10,
    maxShiftMinor1415: 8,
    curfewMinor1617: "10:30 PM", 
    curfewMinor1415: "7:00 PM",
    mandatoryBreakThreshold: 5,
    mandatoryBreakDuration: 30,
  },
  "OH": {
    state: "Ohio",
    maxShiftAdult: 14,
    maxShiftMinor1617: 8,
    maxShiftMinor1415: 8,
    curfewMinor1617: "11:00 PM",
    curfewMinor1415: "7:00 PM",
    mandatoryBreakThreshold: 5,
    mandatoryBreakDuration: 30,
  }
};

export const DATE_STRING = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

export const FISCAL_METRICS = {
  avgPayRate: 14.00,
  targetWeeklyHoursRecapture: 186,
  executionLeakage: 12500,
  currentROI: 12.4,
  annualRecoveryTarget: 4.68,
  vision2028: 491,
  laborSurplusPct: 15,
};

export const EMPLOYEES: Employee[] = [
  { id: '1', name: 'Sarah Jenkins', role: 'Front End Coach', department: 'Front End', status: 'Active', performance: 4.8, email: 's.jenkins@walmart-5065.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', age: 34, isMinor: false },
  { id: '2', name: 'Marcus Chen', role: 'Inventory Specialist', department: 'Grocery', status: 'Active', performance: 4.5, email: 'm.chen@walmart-5065.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', age: 28, isMinor: false },
  { id: '3', name: 'Chloe Miller', role: 'Sales Associate', department: 'Apparel', status: 'Active', performance: 4.1, email: 'c.miller@walmart-5065.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', age: 17, isMinor: true },
  { id: '4', name: 'James Wilson', role: 'Stock Associate', department: 'Electronics', status: 'Training', performance: 3.9, email: 'j.wilson@walmart-5065.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', age: 15, isMinor: true },
  { id: '5', name: 'Emily Davis', role: 'Pharmacy Tech', department: 'Pharmacy', status: 'Active', performance: 4.9, email: 'e.davis@walmart-5065.com', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', age: 42, isMinor: false },
  { id: '11', name: 'Leo Thompson', role: 'Front End Associate', department: 'Front End', status: 'Active', performance: 4.2, email: 'l.thompson@walmart-5065.com', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop', age: 16, isMinor: true },
];

export const HEATMAP_DATA: HeatmapDataPoint[] = [
  { hour: '8 AM', transactionVolume: 45, staffing: 8, efficiency: 85 },
  { hour: '12 PM', transactionVolume: 180, staffing: 14, efficiency: 25 },
  { hour: '6 PM', transactionVolume: 130, staffing: 10, efficiency: 50 },
  { hour: '10 PM', transactionVolume: 50, staffing: 6, efficiency: 95 },
];

export const AZURE_TELEMETRY = {
  region: 'East US 2',
  computeUsage: '42%',
  latency: '18ms',
  edgeStatus: 'Optimized',
  lastSync: '4s ago'
};

export const DEPARTMENT_METRICS: DepartmentMetric[] = [
  { name: 'Front End', activeStaff: '12/15', sales: '$42,350', extraMetricLabel: 'Queue Optimization', extraMetricValue: '94%', waitTime: '3m 12s' },
  { name: 'Grocery', activeStaff: '8/10', sales: '$31,680', extraMetricLabel: 'Freshness Index', extraMetricValue: '88%', waitTime: '1m 30s' },
];

export const INVENTORY_DATA: Product[] = [
  { id: '1', name: 'Mobile Comms Unit', sku: 'ELEC-001', category: 'Electronics', stock: 45, reorderPoint: 20, status: 'Good' },
];

export const OPERATIONAL_AUDITS: AuditLog[] = [
  { id: 'aud-101', severity: 'info', code: 'POL-01', message: 'Labor Variance: Front End within tolerance', file: 'Dept: Front End', file_path: '', fix: 'No action' },
];

export const VULNERABILITY_DATA: Vulnerability[] = [
  { id: 'vul-001', title: 'Labor Variance Vector', severity: 'Medium', description: 'Minor labor surplus detected.', remediation: 'Shift-Redirect.', status: 'Patching', category: 'Operational' },
];

export const HUBSPOT_METRICS = { activeCampaigns: 4, loyaltySignups: 1250, attributedRevenue: 15400, syncStatus: 'Connected' };
export const SYSTEM_HEALTH = { status: 'Operational', uptime: '99.99%', latency: '24ms', environment: 'Production', railsVersion: '8.0.0', syncCycle: 'Active' };
