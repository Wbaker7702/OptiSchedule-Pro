import { Employee, Product, HeatmapDataPoint, DepartmentMetric, IngressDataPoint, Vulnerability, AuditLog, LaborLawConfig } from './types';

// Helper for relative dates
const getRelativeDate = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().split('T')[0];
};

export const CURRENT_USER = "Wesley Baker";
export const STORE_NUMBER = "5065";
export const COMPARISON_STORE = "2080";
export const CURRENT_STATE = "MI"; // Default Jurisdiction

/**
 * Jurisdictional Labor Law Registry
 * MICHIGAN STANDARDS (MI P.A. 90):
 * - Minors 14-15: 8h/day max (non-school), 3h/day max (school). 40h/week max.
 * - Minors 16-17: 10h/day max. 24h/week max (school). 48h/week max (non-school).
 * - Curfews: 7PM (14-15), 10:30PM (16-17 on school nights).
 * - Mandatory Break: 30 minutes for every 5 continuous hours worked for MINORS.
 */
export const LABOR_REGULATIONS: Record<string, LaborLawConfig> = {
  "MI": {
    state: "Michigan",
    maxShiftAdult: 12,
    maxShiftMinor1617: 10,
    maxShiftMinor1415: 8,
    curfewMinor1617: "10:30 PM", 
    curfewMinor1415: "7:00 PM",
    mandatoryBreakThreshold: 5, // Hours worked before break
    mandatoryBreakDuration: 30, // Minutes of break
  },
  // White Space for future state modules (OH, IN, IL)
  "OH": {
    state: "Ohio",
    maxShiftAdult: 14,
    maxShiftMinor1617: 0,
    maxShiftMinor1415: 0,
    curfewMinor1617: "",
    curfewMinor1415: "",
    mandatoryBreakThreshold: 0,
    mandatoryBreakDuration: 0,
  },
  "IN": {
    state: "Indiana",
    maxShiftAdult: 0,
    maxShiftMinor1617: 0,
    maxShiftMinor1415: 0,
    curfewMinor1617: "",
    curfewMinor1415: "",
    mandatoryBreakThreshold: 0,
    mandatoryBreakDuration: 0,
  }
};

export const DATE_STRING = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
export const APP_VERSION = "v3.5.0-Compliance-Engine";
export const BRAND_NAME = "OptiSchedule Pro";

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
  { id: '2', name: 'Robert Miles', role: 'Digital Coach', department: 'Operations', status: 'Active', performance: 4.6, email: 'r.miles@walmart-5065.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', age: 29, isMinor: false },
  { id: '3', name: 'Angela White', role: 'Stocking Coach', department: 'Grocery', status: 'Active', performance: 4.7, email: 'a.white@walmart-5065.com', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', age: 41, isMinor: false },
  { id: '11', name: 'Leo Thompson', role: 'Front End Associate', department: 'Front End', status: 'Active', performance: 4.2, email: 'l.thompson@walmart-5065.com', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop', age: 16, isMinor: true },
  { id: '12', name: 'Chloe Davis', role: 'Cart Attendant', department: 'Front End', status: 'Active', performance: 4.5, email: 'c.davis@walmart-5065.com', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop', age: 17, isMinor: true },
  { id: '13', name: 'Ethan Hunt', role: 'Stocking Associate', department: 'Grocery', status: 'Active', performance: 4.1, email: 'e.hunt@walmart-5065.com', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop', age: 15, isMinor: true },
];

export const HEATMAP_DATA: HeatmapDataPoint[] = [
  { hour: '8 AM', transactionVolume: 45, staffing: 8, efficiency: 85 },
  { hour: '10 AM', transactionVolume: 120, staffing: 12, efficiency: 45 },
  { hour: '12 PM', transactionVolume: 180, staffing: 14, efficiency: 25 },
  { hour: '2 PM', transactionVolume: 110, staffing: 12, efficiency: 55 },
  { hour: '4 PM', transactionVolume: 140, staffing: 10, efficiency: 40 },
  { hour: '6 PM', transactionVolume: 130, staffing: 10, efficiency: 50 },
  { hour: '8 PM', transactionVolume: 90, staffing: 8, efficiency: 80 },
  { hour: '10 PM', transactionVolume: 50, staffing: 6, efficiency: 95 },
];

export const SYSTEM_HEALTH = {
  status: 'Operational',
  uptime: '99.99%',
  latency: '24ms',
  environment: 'us-west1 (Stable)',
  railsVersion: '8.0.0-Sentinel-Patch',
  syncCycle: 'Active (Real-time)'
};

export const STORE_2080_METRICS = {
  executionLeakage: 4200, 
  currentROI: 15.8,
  laborSurplusPct: 4,
  staffingEfficiency: 96,
  weeklyTraffic: 48000,
  hubspotGrowth: 8.2
};

export const OPERATIONAL_AUDITS: AuditLog[] = [
  { id: 'aud-101', severity: 'info', code: 'POL-01', message: 'Labor Variance: Front End within tolerance (<2%)', file: 'Dept: Front End', file_path: 'Dept: Front End', fix: 'No action' },
  { id: 'aud-106', severity: 'info', code: 'CRM-01', message: 'HubSpot Data Ingress: 1250 Loyalty Signups Synced', file: 'Node: HubSpot_CRM', file_path: 'Node: HubSpot_CRM', fix: 'No action' },
];

export const VULNERABILITY_DATA: Vulnerability[] = [
  { id: 'vul-001', title: 'Labor Variance Vector', severity: 'Medium', description: 'Minor labor surplus detected in Apparel zone.', remediation: 'Shift-Redirect: Optimization advised.', status: 'Patching', category: 'Operational' },
];

export const HUBSPOT_METRICS = { activeCampaigns: 4, loyaltySignups: 1250, attributedRevenue: 15400, syncStatus: 'Connected' };

export const DEPARTMENT_METRICS: DepartmentMetric[] = [
  { name: 'Front End', activeStaff: '12/15', sales: '$42,350', extraMetricLabel: 'Queue Optimization', extraMetricValue: '94%', waitTime: '3m 12s' },
  { name: 'Grocery', activeStaff: '8/10', sales: '$31,680', extraMetricLabel: 'Freshness Index', extraMetricValue: '88%', waitTime: '1m 30s' },
];

export const INVENTORY_DATA: Product[] = [
  { id: '1', name: 'Mobile Comms Unit', sku: 'ELEC-001', category: 'Electronics', stock: 45, reorderPoint: 20, status: 'Good' },
];