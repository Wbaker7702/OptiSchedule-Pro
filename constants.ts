
import { Employee, Product, HeatmapDataPoint, DepartmentMetric, IngressDataPoint, Vulnerability, AuditLog, LaborLawConfig, SystemPlugin, StoreRatingData, ScheduleLogEntry, SecurityThreat, SecurityIncident, SecurityPolicy, SecurityMetricTimeline, ComplianceFramework, NetworkSegment } from './types';

export const CURRENT_USER = "Wesley Baker";
export const STORE_NUMBER = "5065";
export const COMPARISON_STORE = "2080";
export const APP_VERSION = "v4.2.0"; 
export const SENTINEL_VERSION = "v3.1";
export const CURRENT_STATE = "MI";

export const WEEKLY_REVENUE_TARGET = 90000;
export const TARGET_LABOR_PCT = 0.18;
export const TARGET_SPLH = 150.00;

export interface StorePerformance {
  id: string;
  name: string;
  laborEfficiency: number;
  shrinkRate: number;
  adherence: number;
}

export const STORE_PERFORMANCE_DATA: StorePerformance[] = [
  { id: '12', name: 'Store #12 - Downtown', laborEfficiency: 96.1, shrinkRate: 1.2, adherence: 94.5 },
  { id: '7', name: 'Store #7 - Westfield', laborEfficiency: 89.3, shrinkRate: 2.4, adherence: 87.2 },
  { id: '23', name: 'Store #23 - Mall East', laborEfficiency: 93.7, shrinkRate: 1.6, adherence: 92.1 },
  { id: '3', name: 'Store #3 - Harbor', laborEfficiency: 85.2, shrinkRate: 3.1, adherence: 81.4 },
  { id: '15', name: 'Store #15 - Uptown', laborEfficiency: 91.8, shrinkRate: 1.9, adherence: 90.3 },
];

export const REVENUE_RECOVERY_DATA = [
  { day: 'Mon', target: 12850, realized: 12100 },
  { day: 'Tue', target: 25700, realized: 23400 },
  { day: 'Wed', target: 38550, realized: 35200 },
  { day: 'Thu', target: 51400, realized: 46800 },
  { day: 'Fri', target: 64250, realized: 58500 },
  { day: 'Sat', target: 77100, realized: 70100 },
  { day: 'Sun', target: 90000, realized: 82450 },
];

export const REVENUE_VS_LABOR = [
  { month: 'Jan', revenue: 4200, laborCost: 1800, target: 1600 },
  { month: 'Feb', revenue: 4500, laborCost: 1850, target: 1700 },
  { month: 'Mar', revenue: 4800, laborCost: 1950, target: 1800 },
  { month: 'Apr', revenue: 4700, laborCost: 1900, target: 1800 },
  { month: 'May', revenue: 5100, laborCost: 2050, target: 1950 },
  { month: 'Jun', revenue: 5400, laborCost: 2100, target: 2000 },
];

export const WEEKLY_HEATMAP = [
  { day: 'Mon', hours: [5, 5, 3, 5, 5, 8, 8, 9] },
  { day: 'Tue', hours: [7, 4, 7, 5, 4, 9, 10, 8] },
  { day: 'Wed', hours: [4, 6, 4, 5, 6, 9, 8, 9] },
  { day: 'Thu', hours: [4, 4, 6, 6, 6, 8, 10, 7] },
  { day: 'Fri', hours: [4, 6, 4, 4, 6, 9, 9, 11] },
  { day: 'Sat', hours: [8, 7, 5, 7, 7, 11, 12, 11] },
  { day: 'Sun', hours: [7, 7, 5, 6, 5, 11, 12, 11] },
];

export const AUDIT_LOGS_MOCK = [
  { id: 'AUD-001', date: '2026-02-14', store: 'Store #12 - Downtown', type: 'Safety', status: 'Passed' },
  { id: 'AUD-002', date: '2026-02-13', store: 'Store #7 - Westfield', type: 'Compliance', status: 'Warning' },
  { id: 'AUD-003', date: '2026-02-13', store: 'Store #23 - Mall East', type: 'Inventory', status: 'Passed' },
  { id: 'AUD-004', date: '2026-02-12', store: 'Store #3 - Harbor', type: 'Safety', status: 'Failed' },
  { id: 'AUD-005', date: '2026-02-12', store: 'Store #15 - Uptown', type: 'HR Compliance', status: 'Passed' },
  { id: 'AUD-006', date: '2026-02-11', store: 'Store #9 - Lakeside', type: 'Inventory', status: 'Passed' },
  { id: 'AUD-007', date: '2026-02-11', store: 'Store #31 - Airport', type: 'Compliance', status: 'Passed' },
  { id: 'AUD-008', date: '2026-02-10', store: 'Store #5 - Central', type: 'Safety', status: 'Passed' },
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
    provider: 'Microsoft Sentinel Legal',
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
    status: 'Mounted',
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
  initialWeeklyLoss: 90000,
  executionLeakage: 12500,
  previousROI: 10.3,
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
  { hour: '8 AM', transactionVolume: 16, staffing: 5, efficiency: 98 },
  { hour: '9 AM', transactionVolume: 30, staffing: 6, efficiency: 96 },
  { hour: '10 AM', transactionVolume: 57, staffing: 8, efficiency: 94 },
  { hour: '11 AM', transactionVolume: 74, staffing: 10, efficiency: 92 },
  { hour: '12 PM', transactionVolume: 87, staffing: 14, efficiency: 88 },
  { hour: '1 PM', transactionVolume: 77, staffing: 12, efficiency: 89 },
  { hour: '2 PM', transactionVolume: 64, staffing: 10, efficiency: 93 },
  { hour: '3 PM', transactionVolume: 57, staffing: 8, efficiency: 95 },
  { hour: '4 PM', transactionVolume: 50, staffing: 7, efficiency: 97 },
  { hour: '5 PM', transactionVolume: 40, staffing: 6, efficiency: 98 },
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
  { id: '2', name: 'Premium ANC Headphones', sku: 'AUD-550', category: 'Electronics', stock: 2, reorderPoint: 15, status: 'Critical' },
  { id: '3', name: 'Organic Avocado Mesh', sku: 'GRO-102', category: 'Grocery', stock: 0, reorderPoint: 50, status: 'Critical' },
  { id: '4', name: 'Winter Fleece Jacket', sku: 'APR-880', category: 'Apparel', stock: 12, reorderPoint: 30, status: 'Low' },
  { id: '5', name: '4K OLED Display 55"', sku: 'TV-4K-55', category: 'Electronics', stock: 5, reorderPoint: 8, status: 'Low' },
  { id: '6', name: 'Isotonic Energy Drink', sku: 'bev-ISO', category: 'Grocery', stock: 140, reorderPoint: 40, status: 'Good' },
  { id: '7', name: 'Smart Home Hub v2', sku: 'IOT-HUB', category: 'Electronics', stock: 18, reorderPoint: 25, status: 'Low' },
];

export const OPERATIONAL_AUDITS: AuditLog[] = [
  { id: 'aud-101', severity: 'info', code: 'POL-01', message: 'Labor Variance: Front End within tolerance', file: 'Dept: Front End', file_path: '', fix: 'No action' },
];

export const VULNERABILITY_DATA: Vulnerability[] = [
  { id: 'vul-001', title: 'Labor Variance Vector', severity: 'Medium', description: 'Minor labor surplus detected.', remediation: 'Shift-Redirect.', status: 'Patching', category: 'Operational' },
];

export const HUBSPOT_METRICS = { activeCampaigns: 4, loyaltySignups: 1250, attributedRevenue: 15400, syncStatus: 'Connected' };
export const SYSTEM_HEALTH = { status: 'Operational', uptime: '99.99%', latency: '24ms', environment: 'Production', railsVersion: '8.0.0', syncCycle: 'Active' };

export const MOCK_STORES: StoreRatingData[] = [
  { id: '5065', location: 'Battle Creek', state: 'MI', overallScore: 92, customerExperience: 88, operationalEfficiency: 94, laborCompliance: 98, fiscalROI: 91, safetyScore: 99, lastAudit: '2026-02-10' },
  { id: '2080', location: 'Toledo', state: 'OH', overallScore: 89, customerExperience: 85, operationalEfficiency: 91, laborCompliance: 96, fiscalROI: 88, safetyScore: 95, lastAudit: '2026-02-08' },
  { id: '3120', location: 'Indianapolis', state: 'IN', overallScore: 84, customerExperience: 82, operationalEfficiency: 85, laborCompliance: 90, fiscalROI: 83, safetyScore: 92, lastAudit: '2026-02-05' },
  { id: '4050', location: 'Chicago', state: 'IL', overallScore: 87, customerExperience: 86, operationalEfficiency: 88, laborCompliance: 93, fiscalROI: 85, safetyScore: 94, lastAudit: '2026-02-01' },
  { id: '1001', location: 'Detroit', state: 'MI', overallScore: 90, customerExperience: 89, operationalEfficiency: 92, laborCompliance: 95, fiscalROI: 89, safetyScore: 97, lastAudit: '2026-01-28' },
];

export const MOCK_SCHEDULE_LOGS: ScheduleLogEntry[] = [
  { id: 'SL-001', timestamp: '2026-02-15 08:32', manager: 'Wesley Baker', action: 'Increased 9:00 AM Front End Staffing', reason: 'Unplanned High Traffic', impact: 'Efficiency +4%' },
  { id: 'SL-002', timestamp: '2026-02-15 07:15', manager: 'System (Auto)', action: 'Reduced 7:00 AM Grocery Staffing', reason: 'Low Ingress Volume', impact: 'Labor Cost -0.2%' },
];

export const SECURITY_THREATS: SecurityThreat[] = [
  { id: 'THR-001', title: 'Credential Stuffing Attack on POS Gateway', severity: 'Critical', category: 'Unauthorized Access', status: 'Active', source: '185.220.101.xx (TOR Exit)', target: 'POS-Gateway-5065', detectedAt: '2026-02-21 09:14', description: 'Automated credential stuffing detected against POS authentication endpoint. 12,400 attempts in 8 minutes from rotating TOR exit nodes.', mitreTactic: 'T1110 - Brute Force', confidenceScore: 97 },
  { id: 'THR-002', title: 'Anomalous Data Transfer to External S3 Bucket', severity: 'High', category: 'Data Exfiltration', status: 'Investigating', source: 'WORKSTATION-HR-04', target: 's3://ext-bucket-9x2k', detectedAt: '2026-02-21 07:42', description: 'Unusual outbound data transfer of 2.4 GB to unregistered external S3 bucket detected from HR workstation.', mitreTactic: 'T1567 - Exfiltration Over Web Service', confidenceScore: 89 },
  { id: 'THR-003', title: 'Phishing Campaign Targeting Store Managers', severity: 'High', category: 'Phishing', status: 'Contained', source: 'spoofed@wmart-hr.com', target: 'Management Distribution List', detectedAt: '2026-02-20 16:30', description: 'Spear phishing campaign detected using cloned HR portal. 3 of 12 targeted users clicked the link. Credentials rotated.', mitreTactic: 'T1566 - Phishing', confidenceScore: 95 },
  { id: 'THR-004', title: 'Lateral Movement via Compromised Service Account', severity: 'Critical', category: 'Insider Threat', status: 'Investigating', source: 'SVC-INVENTORY-SYNC', target: 'DC-EAST-02', detectedAt: '2026-02-21 03:18', description: 'Service account SVC-INVENTORY-SYNC performing LDAP queries and accessing file shares outside normal scope. Possible credential compromise.', mitreTactic: 'T1021 - Remote Services', confidenceScore: 92 },
  { id: 'THR-005', title: 'Suspicious PowerShell Execution on Edge Server', severity: 'Medium', category: 'Malware', status: 'Resolved', source: 'EDGE-NODE-12', target: 'Local System', detectedAt: '2026-02-19 22:05', description: 'Encoded PowerShell command detected on Azure Edge node. Investigation confirmed false positive from scheduled patching script.', mitreTactic: 'T1059 - Command and Scripting', confidenceScore: 64 },
  { id: 'THR-006', title: 'DDoS Volumetric Spike on API Gateway', severity: 'Medium', category: 'DDoS', status: 'Resolved', source: 'Distributed (Botnet)', target: 'API-GW-PROD', detectedAt: '2026-02-19 14:22', description: 'SYN flood peaking at 4.2 Gbps targeting API gateway. Azure DDoS Protection mitigated within 90 seconds.', mitreTactic: 'T1498 - Network Denial of Service', confidenceScore: 99 },
  { id: 'THR-007', title: 'Policy Violation: Unencrypted PII in Transit', severity: 'High', category: 'Policy Violation', status: 'Active', source: 'APP-LEGACY-03', target: 'DB-ANALYTICS-01', detectedAt: '2026-02-21 06:50', description: 'Legacy application transmitting customer PII over unencrypted HTTP channel to analytics database. GDPR/CCPA exposure risk.', mitreTactic: 'T1040 - Network Sniffing', confidenceScore: 100 },
  { id: 'THR-008', title: 'Anomalous Login Pattern from Geographically Dispersed IPs', severity: 'Low', category: 'Anomalous Behavior', status: 'Resolved', source: 'Multiple GeoIPs', target: 'USER: w.baker', detectedAt: '2026-02-18 11:30', description: 'User account accessed from Michigan and California within 30-minute window. Confirmed VPN usage by legitimate user.', mitreTactic: 'T1078 - Valid Accounts', confidenceScore: 42 },
];

export const SECURITY_INCIDENTS: SecurityIncident[] = [
  { id: 'INC-2026-001', title: 'POS Gateway Credential Attack', severity: 'Critical', status: 'Active', assignee: 'Sentinel AI Auto-Response', createdAt: '2026-02-21 09:15', updatedAt: '2026-02-21 09:45', affectedAssets: 4, alertCount: 12, category: 'Unauthorized Access' },
  { id: 'INC-2026-002', title: 'HR Workstation Data Exfiltration', severity: 'High', status: 'Investigating', assignee: 'SOC Analyst - T. Rodriguez', createdAt: '2026-02-21 07:45', updatedAt: '2026-02-21 08:30', affectedAssets: 2, alertCount: 5, category: 'Data Exfiltration' },
  { id: 'INC-2026-003', title: 'Manager Phishing Campaign', severity: 'High', status: 'Contained', assignee: 'Sentinel AI Auto-Response', createdAt: '2026-02-20 16:32', updatedAt: '2026-02-21 06:00', affectedAssets: 3, alertCount: 8, category: 'Phishing' },
  { id: 'INC-2026-004', title: 'Service Account Lateral Movement', severity: 'Critical', status: 'Investigating', assignee: 'SOC Lead - M. Patel', createdAt: '2026-02-21 03:20', updatedAt: '2026-02-21 09:00', affectedAssets: 6, alertCount: 15, category: 'Insider Threat' },
  { id: 'INC-2026-005', title: 'Unencrypted PII Transmission', severity: 'High', status: 'Active', assignee: 'Compliance Team', createdAt: '2026-02-21 06:52', updatedAt: '2026-02-21 07:15', affectedAssets: 2, alertCount: 3, category: 'Policy Violation' },
];

export const SECURITY_POLICIES: SecurityPolicy[] = [
  { id: 'POL-001', name: 'Zero Trust Network Access', category: 'Network', status: 'Enforced', lastEvaluated: '2026-02-21 09:00', complianceRate: 98.2, scope: 'All Endpoints' },
  { id: 'POL-002', name: 'Multi-Factor Authentication', category: 'Identity', status: 'Enforced', lastEvaluated: '2026-02-21 09:00', complianceRate: 99.8, scope: 'All Users' },
  { id: 'POL-003', name: 'Data Loss Prevention (DLP)', category: 'Data', status: 'Enforced', lastEvaluated: '2026-02-21 08:45', complianceRate: 94.5, scope: 'PII/PCI Endpoints' },
  { id: 'POL-004', name: 'Endpoint Detection & Response', category: 'Endpoint', status: 'Enforced', lastEvaluated: '2026-02-21 09:00', complianceRate: 97.1, scope: 'All Devices' },
  { id: 'POL-005', name: 'Encryption at Rest (AES-256)', category: 'Data', status: 'Enforced', lastEvaluated: '2026-02-20 23:00', complianceRate: 100.0, scope: 'All Databases' },
  { id: 'POL-006', name: 'Privileged Access Management', category: 'Identity', status: 'Monitoring', lastEvaluated: '2026-02-21 08:30', complianceRate: 91.3, scope: 'Admin Accounts' },
  { id: 'POL-007', name: 'Cloud Security Posture (CSPM)', category: 'Cloud', status: 'Enforced', lastEvaluated: '2026-02-21 09:00', complianceRate: 96.7, scope: 'Azure Tenant' },
  { id: 'POL-008', name: 'Legacy System Isolation', category: 'Network', status: 'Monitoring', lastEvaluated: '2026-02-21 07:00', complianceRate: 85.0, scope: 'Legacy Applications' },
];

export const SECURITY_TIMELINE: SecurityMetricTimeline[] = [
  { time: '00:00', threats: 2, blocked: 12, incidents: 0 },
  { time: '02:00', threats: 1, blocked: 8, incidents: 0 },
  { time: '04:00', threats: 5, blocked: 22, incidents: 1 },
  { time: '06:00', threats: 3, blocked: 18, incidents: 1 },
  { time: '08:00', threats: 8, blocked: 45, incidents: 2 },
  { time: '10:00', threats: 12, blocked: 67, incidents: 3 },
  { time: '12:00', threats: 6, blocked: 34, incidents: 1 },
  { time: '14:00', threats: 4, blocked: 28, incidents: 0 },
  { time: '16:00', threats: 7, blocked: 41, incidents: 2 },
  { time: '18:00', threats: 9, blocked: 52, incidents: 1 },
  { time: '20:00', threats: 3, blocked: 19, incidents: 0 },
  { time: '22:00', threats: 5, blocked: 31, incidents: 1 },
];

export const COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  { id: 'CF-001', name: 'PCI DSS 4.0', score: 96, controls: 312, passing: 300, failing: 12, lastAssessment: '2026-02-15' },
  { id: 'CF-002', name: 'SOC 2 Type II', score: 98, controls: 64, passing: 63, failing: 1, lastAssessment: '2026-02-10' },
  { id: 'CF-003', name: 'NIST CSF 2.0', score: 92, controls: 108, passing: 99, failing: 9, lastAssessment: '2026-02-12' },
  { id: 'CF-004', name: 'ISO 27001:2022', score: 94, controls: 93, passing: 87, failing: 6, lastAssessment: '2026-02-08' },
  { id: 'CF-005', name: 'GDPR / CCPA', score: 89, controls: 48, passing: 43, failing: 5, lastAssessment: '2026-02-14' },
];

export const NETWORK_SEGMENTS: NetworkSegment[] = [
  { id: 'NET-001', name: 'POS Network', status: 'Warning', traffic: 2400, anomalies: 3, firewallRules: 142 },
  { id: 'NET-002', name: 'Corporate LAN', status: 'Secure', traffic: 8900, anomalies: 0, firewallRules: 256 },
  { id: 'NET-003', name: 'IoT / Edge Devices', status: 'Secure', traffic: 1200, anomalies: 1, firewallRules: 89 },
  { id: 'NET-004', name: 'Guest Wi-Fi', status: 'Secure', traffic: 3400, anomalies: 0, firewallRules: 42 },
  { id: 'NET-005', name: 'Cloud DMZ (Azure)', status: 'Secure', traffic: 15600, anomalies: 0, firewallRules: 198 },
  { id: 'NET-006', name: 'Warehouse OT Network', status: 'Warning', traffic: 780, anomalies: 2, firewallRules: 67 },
];

export const SENTINEL_SECURITY_STATS = {
  totalThreatsToday: 58,
  threatsBlocked: 52,
  activeIncidents: 5,
  meanTimeToDetect: '4.2 min',
  meanTimeToRespond: '11.8 min',
  securityScore: 87,
  assetsMonitored: 1248,
  alertsTriaged: 342,
  falsePositiveRate: 3.2,
  automatedResponseRate: 78,
  endpointsProtected: 892,
  dataSourcesIngested: 24,
};