import { Employee, Product, HeatmapDataPoint, DepartmentMetric, IngressDataPoint, Vulnerability, AuditLog } from './types';

// Helper for relative dates
const getRelativeDate = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().split('T')[0];
};

export const CURRENT_USER = "Wesley Baker";
export const STORE_NUMBER = "5065";
// Dynamic Date: Always current
export const DATE_STRING = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
export const APP_VERSION = "v3.4.0-Sentinel-AI-Live";
export const BRAND_NAME = "OptiSchedule Pro";

export const SYSTEM_HEALTH = {
  status: 'Critical Failure',
  uptime: 'Service Degraded',
  latency: 'ERR_QUOTA',
  environment: 'us-west1 (Quota Exceeded)',
  railsVersion: '8.0.0-Sentinel-Patch',
  syncCycle: 'Halted (ProjectInitFailed)'
};

export const FISCAL_METRICS = {
  avgPayRate: 14.00,
  targetWeeklyHoursRecapture: 186,
  executionLeakage: 90000,
  currentROI: 10.3,
  annualRecoveryTarget: 4.68,
  vision2028: 491,
  laborSurplusPct: 15,
};

export const OPERATIONAL_AUDITS: AuditLog[] = [
  { id: 'aud-101', severity: 'error', code: 'POL-01', message: 'Compliance Breach: Variance > 15% in Front End Protocol', file: 'Dept: Front End', file_path: 'Dept: Front End', fix: 'Deploy Sentinel Protocol' },
  { id: 'aud-102', severity: 'warning', code: 'SEC-04', message: 'Unauthorized Sync Latency (240ms) - Buffer Threat', file: 'Node: D365_Ingress', file_path: 'Node: D365_Ingress', fix: 'Purge Sync Cache' },
  { id: 'aud-103', severity: 'info', code: 'OPT_09', message: 'Optimal staffing achieved for peak hour', file: 'Schedule: Current_Cycle', file_path: 'Schedule: Current_Cycle', fix: 'No action' },
  { id: 'aud-104', severity: 'error', code: 'FIS-02', message: 'Asset Depletion Risk: Critical Inventory Gap', file: 'Dept: Grocery', file_path: 'Dept: Grocery', fix: 'Force Re-stocking' },
  { id: 'aud-105', severity: 'warning', code: 'LAB-02', message: 'Protocol Deviation: 12.5 surplus hrs unallocated', file: 'Dept: Apparel', file_path: 'Dept: Apparel', fix: 'Re-deploy Assets' },
  { id: 'aud-106', severity: 'info', code: 'CRM-01', message: 'HubSpot Data Ingress: 1250 Loyalty Signups Synced', file: 'Node: HubSpot_CRM', file_path: 'Node: HubSpot_CRM', fix: 'No action' },
];

export const VULNERABILITY_DATA: Vulnerability[] = [
  { 
    id: 'vul-004', 
    title: 'Cloud Run Quota Breach', 
    severity: 'Critical', 
    description: 'Project initialization failed in us-west1 due to quota limits. Service optischedule-pro-walmart-store-5065 RoutesReady=False.', 
    remediation: 'Request Quota Increase for Cloud Run API in us-west1.',
    status: 'Detected',
    category: 'Digital'
  },
  { 
    id: 'vul-001', 
    title: 'Workforce Leakage Vector', 
    severity: 'Critical', 
    description: '15% labor surplus unallocated in Apparel zone during peak surge.', 
    remediation: 'Sentinel-Redirect: Auto-assign assets to Front End.',
    status: 'Detected',
    category: 'Operational'
  },
  { 
    id: 'vul-002', 
    title: 'Sync Latency Drift', 
    severity: 'High', 
    description: 'Dynamics 365 ingress node exhibiting 240ms response jitter.', 
    remediation: 'Patch: Clear D365 Cache & Initialize Sentinel Handshake.',
    status: 'Detected',
    category: 'Digital'
  },
  { 
    id: 'vul-003', 
    title: 'Unauthorized Protocol Bypass', 
    severity: 'Medium', 
    description: 'Manual schedule override detected in Electronics department.', 
    remediation: 'Sentinel-Lock: Revert to ROI-optimized deployment.',
    status: 'Detected',
    category: 'Personnel'
  }
];

export const HUBSPOT_METRICS = {
  activeCampaigns: 4,
  loyaltySignups: 1250,
  attributedRevenue: 15400,
  syncStatus: 'Disconnected'
};

export const DYNAMICS_365_ROI_DATA = {
  marketingLeads: { value: 150, label: "Enterprise Ingress", subtext: "+150% Data Precision" },
  websiteVisitors: { value: 133, label: "Pipeline Velocity", subtext: "Verified Dynamics Flow" },
  dealsCreated: { value: 26, label: "Opportunties Validated", subtext: "ERP Standard" },
  revenue: { value: 150, label: "ERP Integration", subtext: "Dynamics 365 Verified" }
};

export const ENTERPRISE_INGRESS_HISTORY: IngressDataPoint[] = [
  { date: getRelativeDate(0), volume: 1450, source: 'Dynamics 365', growth: 12.4, status: 'Verified' },
  { date: getRelativeDate(1), volume: 1290, source: 'Sentinel Node', growth: 8.1, status: 'Hardened' },
  { date: getRelativeDate(2), volume: 1194, source: 'HubSpot', growth: 15.2, status: 'Verified' },
  { date: getRelativeDate(3), volume: 1036, source: 'Dynamics 365', growth: 5.8, status: 'Verified' },
  { date: getRelativeDate(4), volume: 980, source: 'Sentinel Node', growth: 10.2, status: 'Hardened' },
  { date: getRelativeDate(5), volume: 889, source: 'Dynamics 365', growth: 3.4, status: 'Verified' },
];

export const EMPLOYEES: Employee[] = [
  { id: '1', name: 'John Smith', role: 'Security Ops Lead', department: 'Front End', status: 'Active', performance: 4.8, email: 'john.smith@optischedule.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  { id: '2', name: 'Maria Chen', role: 'Protocol Manager', department: 'Grocery', status: 'Active', performance: 4.6, email: 'maria.chen@optischedule.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { id: '3', name: 'Alex Davis', role: 'Systems Specialist', department: 'Electronics', status: 'Training', performance: 4.3, email: 'alex.davis@optischedule.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: '4', name: 'Sarah Johnson', role: 'Asset Protection', department: 'Front End', status: 'Active', performance: 4.5, email: 'sarah.j@optischedule.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
  { id: '5', name: 'Kevin Lee', role: 'Resource Agent', department: 'Apparel', status: 'Active', performance: 4.1, email: 'kevin.lee@optischedule.com', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop' },
  { id: '6', name: 'Lisa Wilson', role: 'Inventory Control', department: 'Grocery', status: 'On Leave', performance: 4.4, email: 'lisa.w@optischedule.com', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop' },
  { id: '7', name: 'Robert Brown', role: 'Logistics Lead', department: 'Home Goods', status: 'Active', performance: 4.7, email: 'robert.b@optischedule.com', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop' },
  { id: '8', name: 'Tom Garcia', role: 'Compliance Officer', department: 'Pharmacy', status: 'Active', performance: 4.9, email: 'tom.garcia@optischedule.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  { id: '9', name: 'Emma Wilson', role: 'Security Agent', department: 'Front End', status: 'Active', performance: 4.2, email: 'emma.w@optischedule.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' },
  { id: '10', name: 'Michael Scott', role: 'Regional Oversight', department: 'Electronics', status: 'Active', performance: 3.9, email: 'michael.s@optischedule.com', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop' },
  { id: '11', name: 'Pam Beesly', role: 'Admin Protocol', department: 'Front End', status: 'Active', performance: 4.7, email: 'pam.b@optischedule.com', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop' },
  { id: '12', name: 'Dwight Schrute', role: 'Director of Compliance', department: 'Operations', status: 'Active', performance: 5.0, email: 'dwight.s@optischedule.com', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop' },
  { id: '13', name: 'Jim Halpert', role: 'Strategy Analyst', department: 'Home Goods', status: 'Active', performance: 4.5, email: 'jim.h@optischedule.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  { id: '14', name: 'Stanley Hudson', role: 'Efficiency Agent', department: 'Apparel', status: 'Active', performance: 3.2, email: 'stanley.h@optischedule.com', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&h=100&fit=crop' },
  { id: '15', name: 'Angela Martin', role: 'Audit Specialist', department: 'Pharmacy', status: 'Active', performance: 4.8, email: 'angela.m@optischedule.com', avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop' },
];

export const INVENTORY_DATA: Product[] = [
  { id: '1', name: 'Mobile Comms Unit', sku: 'ELEC-001', category: 'Electronics', stock: 45, reorderPoint: 20, status: 'Good' },
  { id: '2', name: 'Nutrient Supply Pack', sku: 'GROC-105', category: 'Grocery', stock: 12, reorderPoint: 25, status: 'Low' },
  { id: '3', name: 'Personnel Uniforms', sku: 'APPR-055', category: 'Apparel', stock: 120, reorderPoint: 50, status: 'Good' },
  { id: '4', name: 'Surveillance Node 55"', sku: 'ELEC-022', category: 'Electronics', stock: 8, reorderPoint: 10, status: 'Low' },
  { id: '5', name: 'Logistics Asset V3', sku: 'HOME-003', category: 'Home Goods', stock: 200, reorderPoint: 30, status: 'Good' },
  { id: '6', name: 'Medical Restoration Unit', sku: 'PHAR-112', category: 'Pharmacy', stock: 5, reorderPoint: 15, status: 'Critical' },
  { id: '7', name: 'Encrypted Audio Link', sku: 'ELEC-089', category: 'Electronics', stock: 35, reorderPoint: 15, status: 'Good' },
  { id: '8', name: 'Tactical Footwear', sku: 'APPR-201', category: 'Apparel', stock: 18, reorderPoint: 20, status: 'Low' },
  { id: '9', name: 'Environmental Control Pack', sku: 'HOME-101', category: 'Home Goods', stock: 65, reorderPoint: 25, status: 'Good' },
  { id: '10', name: 'High-Value Sustenance', sku: 'GROC-330', category: 'Grocery', stock: 4, reorderPoint: 10, status: 'Critical' },
];

export const HEATMAP_DATA: HeatmapDataPoint[] = [
  { hour: '8 AM', transactionVolume: 45, staffing: 8, efficiency: 85 },
  { hour: '9 AM', transactionVolume: 65, staffing: 10, efficiency: 75 },
  { hour: '10 AM', transactionVolume: 120, staffing: 12, efficiency: 45 },
  { hour: '11 AM', transactionVolume: 150, staffing: 12, efficiency: 30 },
  { hour: '12 PM', transactionVolume: 180, staffing: 14, efficiency: 25 },
  { hour: '1 PM', transactionVolume: 160, staffing: 14, efficiency: 35 },
  { hour: '2 PM', transactionVolume: 110, staffing: 12, efficiency: 55 },
  { hour: '3 PM', transactionVolume: 90, staffing: 10, efficiency: 70 },
  { hour: '4 PM', transactionVolume: 140, staffing: 10, efficiency: 40 },
  { hour: '5 PM', transactionVolume: 170, staffing: 12, efficiency: 30 },
];

export const DEPARTMENT_METRICS: DepartmentMetric[] = [
  { 
    name: 'Front End', 
    activeStaff: '12/15', 
    sales: '$42,350', 
    extraMetricLabel: 'Queue Optimization', 
    extraMetricValue: '94%',
    waitTime: '3m 12s' 
  },
  { 
    name: 'Electronics', 
    activeStaff: '4/5', 
    sales: '$28,920', 
    extraMetricLabel: 'High-Ticket Ingress', 
    extraMetricValue: '28%',
    waitTime: '5m 45s' 
  },
  { 
    name: 'Grocery', 
    activeStaff: '8/10', 
    sales: '$31,680', 
    extraMetricLabel: 'Freshness Index', 
    extraMetricValue: '88%',
    waitTime: '1m 30s'
  },
  { 
    name: 'Apparel', 
    activeStaff: '3/4', 
    sales: '$15,240', 
    extraMetricLabel: 'Style Integrity', 
    extraMetricValue: '92%',
    waitTime: '4m 15s'
  },
  { 
    name: 'Home Goods', 
    activeStaff: '2/3', 
    sales: '$5,890', 
    extraMetricLabel: 'Display Fidelity', 
    extraMetricValue: '98%',
    waitTime: '2m 50s'
  },
  { 
    name: 'Pharmacy', 
    activeStaff: '2/2', 
    sales: '$1,350', 
    extraMetricLabel: 'Fill Velocity', 
    extraMetricValue: '142',
    waitTime: '8m 20s'
  },
];