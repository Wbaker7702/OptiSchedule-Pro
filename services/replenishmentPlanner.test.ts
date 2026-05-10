import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateReplenishmentPlan, ReplenishmentProduct } from './replenishmentPlanner';

const product = (overrides: Partial<ReplenishmentProduct>): ReplenishmentProduct => ({
  id: 'test-1',
  name: 'Test SKU',
  sku: 'TEST-001',
  category: 'Test',
  stock: 10,
  reorderPoint: 10,
  status: 'Good',
  averageDailyDemand: 5,
  leadTimeDays: 3,
  safetyStock: 5,
  casePackSize: 1,
  maxShelfCapacity: 100,
  warehouseAvailable: 100,
  supplierAvailable: true,
  unitCost: 10,
  ...overrides,
});

test('flags zero-stock products as critical and eligible from numeric inventory levels', () => {
  const plan = calculateReplenishmentPlan([product({ stock: 0, reorderPoint: 10, status: 'Good' })], { reviewPeriodDays: 0 });

  assert.equal(plan.items.length, 1);
  assert.equal(plan.items[0].sku, 'TEST-001');
  assert.equal(plan.items[0].currentStock, 0);
  assert.equal(plan.items[0].priority, 'Critical');
  assert.equal(plan.items[0].recommendedQuantity, 20);
  assert.equal(plan.items[0].blocked, false);
  assert.ok(plan.items[0].reasonCodes.includes('ZERO_STOCK'));
  assert.ok(plan.items[0].reasonCodes.includes('AT_OR_BELOW_REORDER_POINT'));
});

test('includes stock exactly at the reorder point', () => {
  const plan = calculateReplenishmentPlan([product({ stock: 10, reorderPoint: 10, averageDailyDemand: 4, leadTimeDays: 5, safetyStock: 0 })], { reviewPeriodDays: 0 });

  assert.equal(plan.items.length, 1);
  assert.equal(plan.items[0].currentStock, 10);
  assert.equal(plan.items[0].reorderPoint, 10);
  assert.equal(plan.items[0].recommendedQuantity, 10);
  assert.equal(plan.items[0].priority, 'High');
});

test('marks insufficient warehouse availability as a partial fill', () => {
  const plan = calculateReplenishmentPlan([product({ stock: 4, reorderPoint: 10, averageDailyDemand: 8, leadTimeDays: 5, warehouseAvailable: 12 })], { reviewPeriodDays: 0 });

  assert.equal(plan.items[0].recommendedQuantity, 12);
  assert.equal(plan.items[0].partialFill, true);
  assert.equal(plan.items[0].blocked, false);
  assert.ok(plan.items[0].reasonCodes.includes('WAREHOUSE_LIMITED'));
  assert.equal(plan.partialFillItems.length, 1);
});

test('rounds replenishment quantities up to case pack size', () => {
  const plan = calculateReplenishmentPlan([product({ stock: 10, reorderPoint: 10, averageDailyDemand: 3, leadTimeDays: 7, safetyStock: 0, casePackSize: 6 })], { reviewPeriodDays: 0 });

  assert.equal(plan.items[0].requestedQuantity, 12);
  assert.equal(plan.items[0].recommendedQuantity, 12);
  assert.ok(plan.items[0].reasonCodes.includes('CASE_PACK_ROUNDING'));
});

test('applies budget limits in priority order and case-pack increments', () => {
  const plan = calculateReplenishmentPlan([
    product({ sku: 'LOW-001', stock: 10, reorderPoint: 10, averageDailyDemand: 6, leadTimeDays: 5, casePackSize: 4, unitCost: 10 }),
    product({ sku: 'ZERO-001', stock: 0, reorderPoint: 10, averageDailyDemand: 5, leadTimeDays: 3, casePackSize: 5, unitCost: 20 }),
  ], { budget: 260, reviewPeriodDays: 0 });

  assert.deepEqual(plan.items.map(item => item.sku), ['ZERO-001', 'LOW-001']);
  assert.equal(plan.items[0].recommendedQuantity, 10);
  assert.equal(plan.items[0].estimatedCost, 200);
  assert.equal(plan.items[0].partialFill, true);
  assert.ok(plan.items[0].reasonCodes.includes('BUDGET_LIMITED'));
  assert.equal(plan.items[1].recommendedQuantity, 4);
  assert.equal(plan.items[1].estimatedCost, 40);
  assert.equal(plan.items[1].partialFill, true);
  assert.equal(plan.estimatedTotalCost, 240);
  assert.equal(plan.remainingBudget, 20);
});
