
export enum View {
  DASHBOARD = 'DASHBOARD',
  SCHEDULING = 'SCHEDULING',
  OPERATIONS = 'OPERATIONS',
  INVENTORY = 'INVENTORY',
  ANALYTICS = 'ANALYTICS',
  TEAM = 'TEAM',
  PLAYBOOK = 'PLAYBOOK',
  SETTINGS = 'SETTINGS',
  COMPARISON = 'COMPARISON',
}

export type ERPProvider = 'Dynamics 365' | 'SAP S/4HANA' | 'FDE' | 'HubSpot';
export type IntegrationStatus = 'connected' | 'disconnected';

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Training';
  performance: number;
  email: string;
  avatar: string;
  age: number; // Added for labor law logic
  isMinor: boolean;
}

export interface LaborLawConfig {
  state: string;
  maxShiftAdult: number;
  maxShiftMinor1617: number;
  maxShiftMinor1415: number;
  curfewMinor1617: string;
  curfewMinor1415: string;
  mandatoryBreakThreshold: number; // Hours
  mandatoryBreakDuration: number; // Minutes
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  reorderPoint: number;
  status: 'Good' | 'Low' | 'Critical';
}

export interface HeatmapDataPoint {
  hour: string;
  transactionVolume: number;
  staffing: number;
  efficiency: number; // 0-100 scale for color
}

export interface DepartmentMetric {
  name: string;
  activeStaff: string;
  sales: string;
  extraMetricLabel: string;
  extraMetricValue: string;
  waitTime: string;
}

export interface IngressDataPoint {
  date: string;
  volume: number;
  source: 'Dynamics 365' | 'HubSpot' | 'Sentinel Node';
  growth: number;
  status: 'Verified' | 'Syncing' | 'Hardened';
}

export interface Vulnerability {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  remediation: string;
  status: 'Detected' | 'Patching' | 'Patched';
  category: 'Operational' | 'Digital' | 'Personnel';
}

export interface AuditLog {
  id: string;
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  file: string; // Maps to 'Entity' in CSV
  file_path: string; // Kept for compatibility
  fix: string; // Maps to 'Fix Action' in CSV
}
