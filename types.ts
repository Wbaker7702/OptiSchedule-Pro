
export enum View {
  DASHBOARD = 'DASHBOARD',
  SCHEDULING = 'SCHEDULING',
  OPERATIONS = 'OPERATIONS',
  INVENTORY = 'INVENTORY',
  ANALYTICS = 'ANALYTICS',
  ENTERPRISE_SKILLS = 'ENTERPRISE_SKILLS',
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

export type EnterpriseSkillCategory = 'Labor' | 'Inventory' | 'Compliance' | 'Revenue' | 'Security';
export type EnterpriseSkillRisk = 'Low' | 'Medium' | 'High';
export type EnterpriseSkillStatus = 'Approved' | 'Review Required' | 'Blocked';
export type PolicyEnforcementMode = 'Monitor' | 'Warn' | 'Block';
export type SkillAuditOutcome = 'Approved' | 'Warned' | 'Blocked';

export interface EnterpriseSkill {
  id: string;
  name: string;
  owner: string;
  category: EnterpriseSkillCategory;
  description: string;
  status: EnterpriseSkillStatus;
  risk: EnterpriseSkillRisk;
  dataScopes: string[];
  approvalGroup: string;
  usageCount: number;
  lastReviewed: string;
}

export interface SkillPolicy {
  id: string;
  name: string;
  scope: string;
  description: string;
  enforcement: PolicyEnforcementMode;
  coverage: number;
  controls: string[];
  exceptions: number;
  lastUpdated: string;
}

export interface SkillAuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  skill: string;
  policy: string;
  outcome: SkillAuditOutcome;
  detail: string;
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

export type InventorySourceSystem = 'Dynamics 365' | 'SAP S/4HANA' | 'FDE' | 'Manual Audit';

export interface InventoryItemDto {
  item_id: string;
  server_id: string;
  external_system_id: string;
  item_name: string;
  sku_code: string;
  category_name: string;
  source_system: InventorySourceSystem;
  last_synced_at: string;
  on_hand_quantity: number;
  available_quantity: number;
  on_order_quantity: number;
  reserved_quantity: number;
  reorder_point: number;
  inventory_status: 'Good' | 'Low' | 'Critical';
  supplier_id?: string;
  warehouse_id?: string;
  average_daily_demand: number;
  lead_time_days: number;
  unit_cost_cents: number;
  case_pack_size: number;
  max_capacity: number;
}

export interface Product {
  id: string;
  serverId: string;
  externalSystemId: string;
  name: string;
  sku: string;
  category: string;
  /** On-hand units currently counted at the store. */
  stock: number;
  availableQuantity: number;
  onOrderQuantity: number;
  reservedQuantity: number;
  reorderPoint: number;
  status: 'Good' | 'Low' | 'Critical';
  averageDailyDemand: number;
  leadTimeDays: number;
  safetyStock: number;
  casePackSize: number;
  maxShelfCapacity: number;
  warehouseAvailable: number;
  supplierAvailable: boolean;
  unitCost: number;
  lastSyncedAt: string;
  sourceSystem: InventorySourceSystem;
  supplierId?: string;
  warehouseId?: string;
  averageDailyDemand: number;
  leadTimeDays: number;
  unitCost: number;
  casePackSize: number;
  maxCapacity: number;
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
  source: 'Dynamics 365' | 'HubSpot' | 'Defender Portal' | 'Azure Edge';
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

export interface StaffingReviewItem {
  id: string;
  week: string;
  varianceSummary: string;
  manualAdjustments: number;
  primaryDriver: string;
  automationRefinement: string;
  owner: string;
  status: 'Queued' | 'In Review' | 'Rule Updated';
}

export interface HardwareFailsafeItem {
  id: string;
  location: string;
  monitor: string;
  failsafes: string[];
  coverageWindow: string;
  risk: 'Low' | 'Medium' | 'High';
  lastChecked: string;
}

export interface TrainingBriefingItem {
  id: string;
  audience: string;
  topic: string;
  schedule: string;
  outcome: string;
  owner: string;
  status: 'Scheduled' | 'Ready' | 'Complete';
}