
export enum View {
  DASHBOARD = 'DASHBOARD',
  SCHEDULING = 'SCHEDULING',
  OPERATIONS = 'OPERATIONS',
  ENTERPRISE_SECURITY = 'ENTERPRISE_SECURITY',
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
  GHOST_INVENTORY = 'GHOST_INVENTORY',
  SENTINEL_SECURITY = 'SENTINEL_SECURITY'
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
  source: 'Dynamics 365' | 'HubSpot' | 'Microsoft Sentinel' | 'Azure Edge';
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

export type ThreatSeverity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
export type ThreatStatus = 'Active' | 'Investigating' | 'Contained' | 'Resolved';
export type IncidentCategory = 'Malware' | 'Phishing' | 'Insider Threat' | 'DDoS' | 'Data Exfiltration' | 'Unauthorized Access' | 'Policy Violation' | 'Anomalous Behavior';

export interface SecurityThreat {
  id: string;
  title: string;
  severity: ThreatSeverity;
  category: IncidentCategory;
  status: ThreatStatus;
  source: string;
  target: string;
  detectedAt: string;
  description: string;
  mitreTactic: string;
  confidenceScore: number;
}

export interface SecurityIncident {
  id: string;
  title: string;
  severity: ThreatSeverity;
  status: ThreatStatus;
  assignee: string;
  createdAt: string;
  updatedAt: string;
  affectedAssets: number;
  alertCount: number;
  category: IncidentCategory;
}

export interface SecurityPolicy {
  id: string;
  name: string;
  category: string;
  status: 'Enforced' | 'Monitoring' | 'Disabled';
  lastEvaluated: string;
  complianceRate: number;
  scope: string;
}

export interface SecurityMetricTimeline {
  time: string;
  threats: number;
  blocked: number;
  incidents: number;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  score: number;
  controls: number;
  passing: number;
  failing: number;
  lastAssessment: string;
}

export interface NetworkSegment {
  id: string;
  name: string;
  status: 'Secure' | 'Warning' | 'Breached';
  traffic: number;
  anomalies: number;
  firewallRules: number;
}