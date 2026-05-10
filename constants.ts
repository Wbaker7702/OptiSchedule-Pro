
import { Employee, Product, HeatmapDataPoint, DepartmentMetric, IngressDataPoint, Vulnerability, AuditLog, LaborLawConfig, SystemPlugin, StoreRatingData, ScheduleLogEntry, StaffingReviewItem, HardwareFailsafeItem, TrainingBriefingItem, EnterpriseSkill, SkillPolicy, SkillAuditEvent } from './types';
import type { AuditLog, DepartmentMetric, Employee, EnterpriseSkill, HardwareFailsafeItem, HeatmapDataPoint, IngressDataPoint, LaborLawConfig, Product, ScheduleLogEntry, SkillAuditEvent, SkillPolicy, StaffingReviewItem, StoreRatingData, SystemPlugin, TrainingBriefingItem, Vulnerability } from './types';
import {
  Employee,
  Product,
  InventoryItemDto,
  HeatmapDataPoint,
  DepartmentMetric,
  IngressDataPoint,
  Vulnerability,
  AuditLog,
  LaborLawConfig,
  SystemPlugin,
  StoreRatingData,
  ScheduleLogEntry,
  EnterpriseSkill,
  SkillPolicy,
  SkillAuditEvent,
  StaffingReviewItem,
  HardwareFailsafeItem,
  TrainingBriefingItem
} from './types';

import { Employee, Product, HeatmapDataPoint, DepartmentMetric, IngressDataPoint, Vulnerability, AuditLog, LaborLawConfig, SystemPlugin, StoreRatingData, ScheduleLogEntry, EnterpriseSkill, SkillPolicy, SkillAuditEvent, StaffingReviewItem, HardwareFailsafeItem, TrainingBriefingItem } from './types';

export const CURRENT_USER = "Wesley Baker";
export const STORE_NUMBER = "5065";
export const COMPARISON_STORE = "2080";
export const APP_VERSION = "v4.2.0"; 
export const DEFENDER_PORTAL_VERSION = "v3.1";
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

export const WEEKLY_SALES_HEATMAP = [
  { day: 'Mon', sales: [1200, 1500, 800, 2200, 3100, 4500, 4800, 4200] },
  { day: 'Tue', sales: [1100, 1400, 900, 2100, 3000, 4400, 4700, 4100] },
  { day: 'Wed', sales: [1300, 1600, 1000, 2300, 3200, 4600, 4900, 4300] },
  { day: 'Thu', sales: [1400, 1700, 1100, 2400, 3300, 4700, 5000, 4400] },
  { day: 'Fri', sales: [1800, 2200, 1500, 3500, 4500, 6200, 6800, 7200] },
  { day: 'Sat', sales: [2500, 3000, 2000, 4500, 5500, 7500, 8200, 8500] },
  { day: 'Sun', sales: [2200, 2800, 1800, 4000, 5000, 7000, 7800, 8000] },
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
    provider: 'Microsoft Defender',
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

export const ENTERPRISE_SKILL_CATALOG: EnterpriseSkill[] = [
  {
    id: 'skill-labor-forecast',
    name: 'Labor Forecast Optimizer',
    owner: 'Workforce Systems',
    category: 'Labor',
    description: 'Projects demand curves and recommends weekly coverage changes before publishing schedules.',
    status: 'Approved',
    risk: 'Medium',
    dataScopes: ['labor.hours', 'sales.forecast', 'employee.availability'],
    approvalGroup: 'Regional Operations Council',
    usageCount: 1840,
    lastReviewed: '2026-05-01'
  },
  {
    id: 'skill-minor-compliance',
    name: 'Minor Labor Compliance Guard',
    owner: 'People Compliance',
    category: 'Compliance',
    description: 'Blocks schedule drafts that violate jurisdictional curfew, shift-length, or break thresholds.',
    status: 'Approved',
    risk: 'High',
    dataScopes: ['employee.age_band', 'schedule.shift', 'jurisdiction.rules'],
    approvalGroup: 'Legal + HR Policy',
    usageCount: 926,
    lastReviewed: '2026-04-28'
  },
  {
    id: 'skill-inventory-variance',
    name: 'Inventory Variance Explainer',
    owner: 'Asset Protection',
    category: 'Inventory',
    description: 'Summarizes shrink anomalies and suggests reconciliation steps using POS and receiving deltas.',
    status: 'Review Required',
    risk: 'Medium',
    dataScopes: ['inventory.counts', 'pos.voids', 'receiving.manifest'],
    approvalGroup: 'Asset Protection Review',
    usageCount: 311,
    lastReviewed: '2026-03-19'
  },
  {
    id: 'skill-revenue-recovery',
    name: 'Revenue Recovery Coach',
    owner: 'Finance Operations',
    category: 'Revenue',
    description: 'Generates manager playbooks for recovering labor leakage and missed sales velocity.',
    status: 'Approved',
    risk: 'Low',
    dataScopes: ['sales.summary', 'labor.cost', 'store.performance'],
    approvalGroup: 'Store Finance',
    usageCount: 1404,
    lastReviewed: '2026-04-24'
  },
  {
    id: 'skill-open-web-agent',
    name: 'Open Web Procurement Agent',
    owner: 'Pilot Programs',
    category: 'Security',
    description: 'Autonomously researches external vendors and drafts purchase recommendations.',
    status: 'Blocked',
    risk: 'High',
    dataScopes: ['vendor.search', 'budget.requests', 'external.web'],
    approvalGroup: 'Security Architecture Board',
    usageCount: 0,
    lastReviewed: '2026-05-03'
  }
];

export const ENTERPRISE_SKILL_POLICIES: SkillPolicy[] = [
  {
    id: 'policy-data-minimization',
    name: 'Data Minimization Boundary',
    scope: 'All AI-assisted skills',
    description: 'Restricts each skill to approved data scopes and prevents free-form access to personnel, POS, or vendor systems.',
    enforcement: 'Block',
    coverage: 98,
    controls: ['Scope allowlist required', 'PII fields masked by default', 'Cross-system joins require approval'],
    exceptions: 1,
    lastUpdated: '2026-05-06'
  },
  {
    id: 'policy-human-approval',
    name: 'High-Risk Human Approval',
    scope: 'High-risk labor, finance, and security skills',
    description: 'Requires named approvers before a skill can publish schedules, modify budgets, or trigger external actions.',
    enforcement: 'Block',
    coverage: 94,
    controls: ['Two-person approval', 'Justification capture', 'Manager override audit trail'],
    exceptions: 2,
    lastUpdated: '2026-05-04'
  },
  {
    id: 'policy-model-provenance',
    name: 'Model and Prompt Provenance',
    scope: 'Mounted and marketplace skills',
    description: 'Tracks model versions, prompt bundles, and policy hashes for every enterprise skill execution.',
    enforcement: 'Warn',
    coverage: 89,
    controls: ['Prompt hash logged', 'Model version pinned', 'Skill release notes required'],
    exceptions: 3,
    lastUpdated: '2026-04-30'
  },
  {
    id: 'policy-jurisdiction-lock',
    name: 'Jurisdiction Policy Lock',
    scope: 'Labor and compliance skills',
    description: 'Prevents skills from applying labor rules outside the selected state and flags stale regulatory packs.',
    enforcement: 'Monitor',
    coverage: 100,
    controls: ['State pack checksum', 'Effective date validation', 'Curfew rule regression checks'],
    exceptions: 0,
    lastUpdated: '2026-05-07'
  }
];

export const ENTERPRISE_SKILL_AUDIT_EVENTS: SkillAuditEvent[] = [
  {
    id: 'SKA-1042',
    timestamp: '2026-05-10 08:12',
    actor: 'Wesley Baker',
    skill: 'Labor Forecast Optimizer',
    policy: 'High-Risk Human Approval',
    outcome: 'Approved',
    detail: 'Schedule recommendation sent to manager queue after council approval.'
  },
  {
    id: 'SKA-1041',
    timestamp: '2026-05-10 07:54',
    actor: 'Defender Policy Engine',
    skill: 'Open Web Procurement Agent',
    policy: 'Data Minimization Boundary',
    outcome: 'Blocked',
    detail: 'External web action denied until vendor data scope is reviewed.'
  },
  {
    id: 'SKA-1038',
    timestamp: '2026-05-09 18:33',
    actor: 'Asset Protection Lead',
    skill: 'Inventory Variance Explainer',
    policy: 'Model and Prompt Provenance',
    outcome: 'Warned',
    detail: 'Prompt bundle v2.1 lacks reviewer notes for the latest shrink workflow.'
  },
  {
    id: 'SKA-1035',
    timestamp: '2026-05-09 15:10',
    actor: 'People Compliance',
    skill: 'Minor Labor Compliance Guard',
    policy: 'Jurisdiction Policy Lock',
    outcome: 'Approved',
    detail: 'Michigan rule pack checksum verified before schedule validation.'
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
  { id: '1', name: 'Mobile Comms Unit', sku: 'ELEC-001', category: 'Electronics', stock: 45, reorderPoint: 20, status: 'Good', averageDailyDemand: 3, leadTimeDays: 5, safetyStock: 8, casePackSize: 5, maxShelfCapacity: 80, warehouseAvailable: 60, supplierAvailable: true, unitCost: 129.99 },
  { id: '2', name: 'Premium ANC Headphones', sku: 'AUD-550', category: 'Electronics', stock: 2, reorderPoint: 15, status: 'Critical', averageDailyDemand: 4, leadTimeDays: 6, safetyStock: 10, casePackSize: 6, maxShelfCapacity: 60, warehouseAvailable: 42, supplierAvailable: true, unitCost: 79.95 },
  { id: '3', name: 'Organic Avocado Mesh', sku: 'GRO-102', category: 'Grocery', stock: 0, reorderPoint: 50, status: 'Critical', averageDailyDemand: 18, leadTimeDays: 2, safetyStock: 25, casePackSize: 24, maxShelfCapacity: 220, warehouseAvailable: 120, supplierAvailable: true, unitCost: 2.35 },
  { id: '4', name: 'Winter Fleece Jacket', sku: 'APR-880', category: 'Apparel', stock: 12, reorderPoint: 30, status: 'Low', averageDailyDemand: 5, leadTimeDays: 8, safetyStock: 15, casePackSize: 12, maxShelfCapacity: 96, warehouseAvailable: 36, supplierAvailable: true, unitCost: 24.5 },
  { id: '5', name: '4K OLED Display 55"', sku: 'TV-4K-55', category: 'Electronics', stock: 5, reorderPoint: 8, status: 'Low', averageDailyDemand: 1, leadTimeDays: 10, safetyStock: 3, casePackSize: 2, maxShelfCapacity: 18, warehouseAvailable: 8, supplierAvailable: true, unitCost: 389.99 },
  { id: '6', name: 'Isotonic Energy Drink', sku: 'BEV-ISO', category: 'Grocery', stock: 140, reorderPoint: 40, status: 'Good', averageDailyDemand: 22, leadTimeDays: 3, safetyStock: 40, casePackSize: 24, maxShelfCapacity: 220, warehouseAvailable: 160, supplierAvailable: true, unitCost: 1.15 },
  { id: '7', name: 'Smart Home Hub v2', sku: 'IOT-HUB', category: 'Electronics', stock: 18, reorderPoint: 25, status: 'Low', averageDailyDemand: 2, leadTimeDays: 7, safetyStock: 6, casePackSize: 4, maxShelfCapacity: 48, warehouseAvailable: 12, supplierAvailable: false, unitCost: 54.25 },
export const INVENTORY_ITEM_DTOS: InventoryItemDto[] = [
  {
    item_id: '1',
    server_id: 'd365-inv-5065-0001',
    external_system_id: 'D365-US-MI-5065-ELEC-001',
    item_name: 'Mobile Comms Unit',
    sku_code: 'ELEC-001',
    category_name: 'Electronics',
    source_system: 'Dynamics 365',
    last_synced_at: '2026-05-10T13:42:00Z',
    on_hand_quantity: 45,
    available_quantity: 39,
    on_order_quantity: 24,
    reserved_quantity: 6,
    reorder_point: 20,
    inventory_status: 'Good',
    supplier_id: 'SUP-MOB-118',
    warehouse_id: 'WH-MI-DET-02',
    average_daily_demand: 6.5,
    lead_time_days: 4,
    unit_cost_cents: 18450,
    case_pack_size: 6,
    max_capacity: 120
  },
  {
    item_id: '2',
    server_id: 'd365-inv-5065-0002',
    external_system_id: 'D365-US-MI-5065-AUD-550',
    item_name: 'Premium ANC Headphones',
    sku_code: 'AUD-550',
    category_name: 'Electronics',
    source_system: 'Dynamics 365',
    last_synced_at: '2026-05-10T13:38:00Z',
    on_hand_quantity: 2,
    available_quantity: 1,
    on_order_quantity: 36,
    reserved_quantity: 1,
    reorder_point: 15,
    inventory_status: 'Critical',
    supplier_id: 'SUP-AUD-442',
    warehouse_id: 'WH-MI-DET-02',
    average_daily_demand: 8.2,
    lead_time_days: 6,
    unit_cost_cents: 7250,
    case_pack_size: 12,
    max_capacity: 90
  },
  {
    item_id: '3',
    server_id: 'd365-inv-5065-0003',
    external_system_id: 'D365-US-MI-5065-GRO-102',
    item_name: 'Organic Avocado Mesh',
    sku_code: 'GRO-102',
    category_name: 'Grocery',
    source_system: 'Dynamics 365',
    last_synced_at: '2026-05-10T13:35:00Z',
    on_hand_quantity: 0,
    available_quantity: 0,
    on_order_quantity: 96,
    reserved_quantity: 0,
    reorder_point: 50,
    inventory_status: 'Critical',
    supplier_id: 'SUP-FRESH-021',
    warehouse_id: 'WH-MI-FRESH-01',
    average_daily_demand: 22.4,
    lead_time_days: 2,
    unit_cost_cents: 425,
    case_pack_size: 24,
    max_capacity: 180
  },
  {
    item_id: '4',
    server_id: 'd365-inv-5065-0004',
    external_system_id: 'D365-US-MI-5065-APR-880',
    item_name: 'Winter Fleece Jacket',
    sku_code: 'APR-880',
    category_name: 'Apparel',
    source_system: 'Dynamics 365',
    last_synced_at: '2026-05-10T13:29:00Z',
    on_hand_quantity: 12,
    available_quantity: 9,
    on_order_quantity: 48,
    reserved_quantity: 3,
    reorder_point: 30,
    inventory_status: 'Low',
    supplier_id: 'SUP-APP-340',
    warehouse_id: 'WH-MI-GRN-04',
    average_daily_demand: 5.1,
    lead_time_days: 8,
    unit_cost_cents: 1425,
    case_pack_size: 12,
    max_capacity: 144
  },
  {
    item_id: '5',
    server_id: 'd365-inv-5065-0005',
    external_system_id: 'D365-US-MI-5065-TV-4K-55',
    item_name: '4K OLED Display 55"',
    sku_code: 'TV-4K-55',
    category_name: 'Electronics',
    source_system: 'Dynamics 365',
    last_synced_at: '2026-05-10T13:31:00Z',
    on_hand_quantity: 5,
    available_quantity: 4,
    on_order_quantity: 10,
    reserved_quantity: 1,
    reorder_point: 8,
    inventory_status: 'Low',
    supplier_id: 'SUP-HOME-910',
    warehouse_id: 'WH-MI-DET-02',
    average_daily_demand: 1.4,
    lead_time_days: 5,
    unit_cost_cents: 31800,
    case_pack_size: 2,
    max_capacity: 30
  },
  {
    item_id: '6',
    server_id: 'd365-inv-5065-0006',
    external_system_id: 'D365-US-MI-5065-BEV-ISO',
    item_name: 'Isotonic Energy Drink',
    sku_code: 'BEV-ISO',
    category_name: 'Grocery',
    source_system: 'Dynamics 365',
    last_synced_at: '2026-05-10T13:40:00Z',
    on_hand_quantity: 140,
    available_quantity: 126,
    on_order_quantity: 72,
    reserved_quantity: 14,
    reorder_point: 40,
    inventory_status: 'Good',
    supplier_id: 'SUP-BEV-602',
    warehouse_id: 'WH-MI-FRESH-01',
    average_daily_demand: 18.6,
    lead_time_days: 3,
    unit_cost_cents: 118,
    case_pack_size: 24,
    max_capacity: 260
  },
  {
    item_id: '7',
    server_id: 'd365-inv-5065-0007',
    external_system_id: 'D365-US-MI-5065-IOT-HUB',
    item_name: 'Smart Home Hub v2',
    sku_code: 'IOT-HUB',
    category_name: 'Electronics',
    source_system: 'Dynamics 365',
    last_synced_at: '2026-05-10T13:33:00Z',
    on_hand_quantity: 18,
    available_quantity: 15,
    on_order_quantity: 24,
    reserved_quantity: 3,
    reorder_point: 25,
    inventory_status: 'Low',
    supplier_id: 'SUP-IOT-778',
    warehouse_id: 'WH-MI-DET-02',
    average_daily_demand: 4.6,
    lead_time_days: 7,
    unit_cost_cents: 3895,
    case_pack_size: 6,
    max_capacity: 72
  }
];

const mapInventoryItemDtoToProduct = (dto: InventoryItemDto): Product => ({
  id: dto.item_id,
  serverId: dto.server_id,
  externalSystemId: dto.external_system_id,
  name: dto.item_name,
  sku: dto.sku_code,
  category: dto.category_name,
  stock: dto.on_hand_quantity,
  availableQuantity: dto.available_quantity,
  onOrderQuantity: dto.on_order_quantity,
  reservedQuantity: dto.reserved_quantity,
  reorderPoint: dto.reorder_point,
  status: dto.inventory_status,
  lastSyncedAt: dto.last_synced_at,
  sourceSystem: dto.source_system,
  supplierId: dto.supplier_id,
  warehouseId: dto.warehouse_id,
  averageDailyDemand: dto.average_daily_demand,
  leadTimeDays: dto.lead_time_days,
  unitCost: dto.unit_cost_cents / 100,
  casePackSize: dto.case_pack_size,
  maxCapacity: dto.max_capacity
});

export const INVENTORY_DATA: Product[] = INVENTORY_ITEM_DTOS.map(mapInventoryItemDtoToProduct);

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

export const WEEKLY_STAFFING_REVIEWS: StaffingReviewItem[] = [
  {
    id: 'WR-2026-07',
    week: 'Feb 9 - Feb 15',
    varianceSummary: 'System planned 2,811 hours; actual landed at 2,847 hours.',
    manualAdjustments: 14,
    primaryDriver: 'Weekend front-end demand and same-day call-outs',
    automationRefinement: 'Increase Saturday cashier buffer by 1.5 FTE from 10:00-13:00.',
    owner: 'Store Ops + People Lead',
    status: 'In Review',
  },
  {
    id: 'WR-2026-06',
    week: 'Feb 2 - Feb 8',
    varianceSummary: 'Actual stocking hours exceeded the system plan by 22 hours.',
    manualAdjustments: 9,
    primaryDriver: 'Late inbound freight created overnight recovery work.',
    automationRefinement: 'Tie dock delay signals to grocery stocking reserve hours.',
    owner: 'Automation Steward',
    status: 'Rule Updated',
  },
  {
    id: 'WR-2026-08',
    week: 'Feb 16 - Feb 22',
    varianceSummary: 'Pending closeout after Sunday labor reconciliation.',
    manualAdjustments: 0,
    primaryDriver: 'Collecting override reason codes',
    automationRefinement: 'Review manager-discretion overrides before publishing next forecast.',
    owner: 'Shift Lead Council',
    status: 'Queued',
  },
];

export const MONITORING_FAILSAFES: HardwareFailsafeItem[] = [
  {
    id: 'EDGE-FE-01',
    location: 'Front End Queue Monitor',
    monitor: 'Localized traffic camera + counter node',
    failsafes: ['Passive heat sink', '45-minute UPS', 'Local buffer storage'],
    coverageWindow: '09:00-14:00 critical checkout window',
    risk: 'Low',
    lastChecked: '2026-02-15 06:45',
  },
  {
    id: 'EDGE-DOCK-02',
    location: 'Receiving Dock Sensor',
    monitor: 'Dock ingress scanner gateway',
    failsafes: ['Ventilated enclosure', '30-minute UPS', 'Offline replay queue'],
    coverageWindow: '08:00-15:00 freight intake window',
    risk: 'Medium',
    lastChecked: '2026-02-15 07:05',
  },
  {
    id: 'EDGE-GROC-03',
    location: 'Grocery Demand Beacon',
    monitor: 'Aisle traffic telemetry hub',
    failsafes: ['Heat spreader plate', 'Spare battery pack', 'Nightly health ping'],
    coverageWindow: '10:00-13:00 replenishment window',
    risk: 'Low',
    lastChecked: '2026-02-15 06:50',
  },
];

export const SHIFT_LEAD_BRIEFINGS: TrainingBriefingItem[] = [
  {
    id: 'BRF-101',
    audience: 'Front End Shift Leads',
    topic: 'Why forecasted checkout buffers appear before peak traffic',
    schedule: 'Monday huddle, 08:45',
    outcome: 'Manual cuts require a demand-gap note and coach approval.',
    owner: 'People Lead',
    status: 'Ready',
  },
  {
    id: 'BRF-102',
    audience: 'Stocking and Grocery Leads',
    topic: 'How freight signals convert into reserve stocking hours',
    schedule: 'Wednesday pre-shift, 13:30',
    outcome: 'Leads can explain protected recovery hours without technical terms.',
    owner: 'Operations Coach',
    status: 'Scheduled',
  },
  {
    id: 'BRF-103',
    audience: 'Closing Shift Leads',
    topic: 'When a manual override improves the automation model',
    schedule: 'Friday closeout, 16:00',
    outcome: 'Every override includes a reason code that feeds weekly rule review.',
    owner: 'Automation Steward',
    status: 'Scheduled',
  },
];