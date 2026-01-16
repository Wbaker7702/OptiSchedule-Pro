
export enum View {
  DASHBOARD = 'DASHBOARD',
  SCHEDULING = 'SCHEDULING',
  OPERATIONS = 'OPERATIONS',
  INVENTORY = 'INVENTORY',
  ANALYTICS = 'ANALYTICS',
  TEAM = 'TEAM',
  PLAYBOOK = 'PLAYBOOK',
  SETTINGS = 'SETTINGS',
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Training';
  performance: number;
  email: string;
  avatar: string;
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

export type KpiTrend = 'up' | 'down' | 'steady';
export type KpiStatus = 'on_track' | 'watch' | 'critical';

export interface KpiMetric {
  name: string;
  currentValue: string;
  targetValue: string;
  trend: KpiTrend;
  status: KpiStatus;
}
