import { Product } from '../types';

export type ReplenishmentPriority = 'Critical' | 'High' | 'Medium';

export type ReplenishmentReasonCode =
  | 'ZERO_STOCK'
  | 'AT_OR_BELOW_REORDER_POINT'
  | 'LEAD_TIME_COVERAGE'
  | 'SAFETY_STOCK_BUFFER'
  | 'CASE_PACK_ROUNDING'
  | 'WAREHOUSE_LIMITED'
  | 'SUPPLIER_UNAVAILABLE'
  | 'SHELF_CAPACITY_LIMITED'
  | 'BUDGET_LIMITED';

export interface ReplenishmentPlanningInputs {
  averageDailyDemand: number;
  leadTimeDays: number;
  safetyStock: number;
  casePackSize: number;
  maxShelfCapacity: number;
  warehouseAvailable: number;
  supplierAvailable: boolean;
  unitCost: number;
}

export type ReplenishmentProduct = Product & ReplenishmentPlanningInputs;

export interface ReplenishmentPlannerOptions {
  budget?: number;
  reviewPeriodDays?: number;
}

export interface ReplenishmentPlanItem {
  sku: string;
  name: string;
  currentStock: number;
  reorderPoint: number;
  recommendedQuantity: number;
  priority: ReplenishmentPriority;
  reasonCodes: ReplenishmentReasonCode[];
  blocked: boolean;
  partialFill: boolean;
  requestedQuantity: number;
  estimatedCost: number;
  casePackSize: number;
}

export interface ReplenishmentPlan {
  items: ReplenishmentPlanItem[];
  blockedItems: ReplenishmentPlanItem[];
  partialFillItems: ReplenishmentPlanItem[];
  totalRecommendedQuantity: number;
  estimatedTotalCost: number;
  remainingBudget?: number;
}

const positiveOrZero = (value: number) => Math.max(0, Number.isFinite(value) ? value : 0);

const addReason = (reasons: ReplenishmentReasonCode[], reason: ReplenishmentReasonCode) => {
  if (!reasons.includes(reason)) reasons.push(reason);
};

const roundUpToCasePack = (quantity: number, casePackSize: number) => {
  const pack = Math.max(1, Math.floor(casePackSize));
  return Math.ceil(quantity / pack) * pack;
};

const roundDownToCasePack = (quantity: number, casePackSize: number) => {
  const pack = Math.max(1, Math.floor(casePackSize));
  return Math.floor(quantity / pack) * pack;
};

const comparePriority = (a: ReplenishmentPlanItem, b: ReplenishmentPlanItem) => {
  const priorityRank: Record<ReplenishmentPriority, number> = { Critical: 0, High: 1, Medium: 2 };
  return priorityRank[a.priority] - priorityRank[b.priority] || a.currentStock - b.currentStock || a.sku.localeCompare(b.sku);
};

export const calculateReplenishmentPlan = (
  products: ReplenishmentProduct[],
  options: ReplenishmentPlannerOptions = {},
): ReplenishmentPlan => {
  const reviewPeriodDays = positiveOrZero(options.reviewPeriodDays ?? 7);
  let remainingBudget = options.budget === undefined ? undefined : positiveOrZero(options.budget);

  const candidates = products
    .filter((product) => product.stock <= product.reorderPoint)
    .map<ReplenishmentPlanItem>((product) => {
      const reasonCodes: ReplenishmentReasonCode[] = ['AT_OR_BELOW_REORDER_POINT'];
      if (product.stock === 0) addReason(reasonCodes, 'ZERO_STOCK');

      const leadTimeDemand = positiveOrZero(product.averageDailyDemand) * (positiveOrZero(product.leadTimeDays) + reviewPeriodDays);
      const targetStock = Math.min(
        positiveOrZero(product.maxShelfCapacity),
        Math.ceil(leadTimeDemand + positiveOrZero(product.safetyStock)),
      );
      addReason(reasonCodes, 'LEAD_TIME_COVERAGE');
      if (positiveOrZero(product.safetyStock) > 0) addReason(reasonCodes, 'SAFETY_STOCK_BUFFER');

      const requestedQuantity = positiveOrZero(targetStock - product.stock);
      const roundedQuantity = roundUpToCasePack(requestedQuantity, product.casePackSize);
      if (roundedQuantity > requestedQuantity) addReason(reasonCodes, 'CASE_PACK_ROUNDING');

      const shelfRoom = positiveOrZero(product.maxShelfCapacity - product.stock);
      let recommendedQuantity = Math.min(roundedQuantity, shelfRoom, positiveOrZero(product.warehouseAvailable));
      let blocked = false;
      let partialFill = recommendedQuantity < roundedQuantity;

      if (!product.supplierAvailable) {
        addReason(reasonCodes, 'SUPPLIER_UNAVAILABLE');
        recommendedQuantity = 0;
        blocked = true;
        partialFill = false;
      }

      if (product.warehouseAvailable < roundedQuantity && product.supplierAvailable) addReason(reasonCodes, 'WAREHOUSE_LIMITED');
      if (shelfRoom < roundedQuantity && product.supplierAvailable) addReason(reasonCodes, 'SHELF_CAPACITY_LIMITED');
      if (recommendedQuantity === 0 && product.supplierAvailable) blocked = true;

      return {
        sku: product.sku,
        name: product.name,
        currentStock: product.stock,
        reorderPoint: product.reorderPoint,
        recommendedQuantity,
        priority: product.stock === 0 || product.stock <= product.reorderPoint / 2 ? 'Critical' : 'High',
        reasonCodes,
        blocked,
        partialFill,
        requestedQuantity: roundedQuantity,
        estimatedCost: recommendedQuantity * positiveOrZero(product.unitCost),
        casePackSize: Math.max(1, Math.floor(product.casePackSize)),
      };
    })
    .sort(comparePriority);

  const items = candidates.map((item) => {
    if (remainingBudget === undefined || item.blocked || item.recommendedQuantity === 0) return item;

    const unitCost = item.recommendedQuantity > 0 ? item.estimatedCost / item.recommendedQuantity : 0;
    if (unitCost <= 0) return item;

    const affordableQuantity = Math.min(item.recommendedQuantity, Math.floor(remainingBudget / unitCost));
    const budgetedQuantity = affordableQuantity >= item.recommendedQuantity
      ? item.recommendedQuantity
      : roundDownToCasePack(affordableQuantity, item.casePackSize);

    const nextItem = { ...item };
    if (budgetedQuantity < item.recommendedQuantity) {
      addReason(nextItem.reasonCodes, 'BUDGET_LIMITED');
      nextItem.recommendedQuantity = budgetedQuantity;
      nextItem.estimatedCost = budgetedQuantity * unitCost;
      nextItem.partialFill = budgetedQuantity > 0;
      nextItem.blocked = budgetedQuantity === 0;
    }
    remainingBudget -= nextItem.estimatedCost;
    return nextItem;
  });

  const totalRecommendedQuantity = items.reduce((total, item) => total + item.recommendedQuantity, 0);
  const estimatedTotalCost = items.reduce((total, item) => total + item.estimatedCost, 0);

  return {
    items,
    blockedItems: items.filter((item) => item.blocked),
    partialFillItems: items.filter((item) => item.partialFill),
    totalRecommendedQuantity,
    estimatedTotalCost,
    remainingBudget,
  };
};
