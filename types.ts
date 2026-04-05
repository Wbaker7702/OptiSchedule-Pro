
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
  METRICS_REPORT = 'METRICS_REPORT',
  ROYALTY_DASHBOARD = 'ROYALTY_DASHBOARD',
  STORE_RATINGS = 'STORE_RATINGS',
  LOGISTICS = 'LOGISTICS',
  GHOST_INVENTORY = 'GHOST_INVENTORY'
}

export type PluginCategory = 'CRM' | 'ERP' | 'Jurisdiction' | 'AI_Agent' | 'Vision' | 'Cloud';

export interface SystemPlugin {
  id: string;
  name: string;
  category: PluginCategory;
  provider: string;
  description: string;
  version: string;
  status: 'Mounted' | 'Available' | 'Locked';
  iconName: string;
}

export type ERPProvider = 'Dynamics 365' | 'SAP S/4HANA' | 'FDE' | 'HubSpot' | 'Azure';
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
  age: number;
  isMinor: boolean;
}

export interface LaborLawConfig {
  state: string;
  maxShiftAdult: number;
  maxShiftMinor1617: number;
  maxShiftMinor1415: number;
  curfewMinor1617: string;
  curfewMinor1415: string;
  mandatoryBreakThreshold: number;
  mandatoryBreakDuration: number;
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
  efficiency: number;
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
  source: 'Dynamics 365' | 'HubSpot' | 'Sentinel Node' | 'Azure Edge';
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
  file: string;
  file_path: string;
  fix: string;
}

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

export interface ScheduleLogEntry {
  id: string;
  timestamp: string;
  manager: string;
  action: string;
  reason: string;
  impact: string;
}