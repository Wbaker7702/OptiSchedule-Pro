import { ReplenishmentPlan, ReplenishmentPlanItem } from './replenishmentPlanner';

export interface ProcurementBatchResponse {
  batchId: string;
  acceptedItems: ReplenishmentPlanItem[];
  blockedItems: ReplenishmentPlanItem[];
}

export const submitProcurementBatch = async (plan: ReplenishmentPlan): Promise<ProcurementBatchResponse> => {
  const acceptedItems = plan.items.filter((item) => !item.blocked && item.recommendedQuantity > 0);

  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({
        batchId: `PO-D365-AUTO-${Date.now().toString().slice(-6)}`,
        acceptedItems,
        blockedItems: plan.blockedItems,
      });
    }, 900);
  });
};
