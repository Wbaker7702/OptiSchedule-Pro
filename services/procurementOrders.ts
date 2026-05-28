import type { Product } from '../types';
import { getCsrfHeaders } from './csrf';

export type ProcurementOrderStatus = 'accepted' | 'partial' | 'rejected' | 'pending';

export interface CreateProcurementOrderRequest {
  sku: string;
  quantity: number;
  priority: string;
  storeNumber: string;
  currentStock: number;
  reorderPoint: number;
}

export interface ProcurementOrderResponse {
  orderStatus: ProcurementOrderStatus;
  acceptedQuantity: number;
  rejectedQuantity: number;
  expectedArrivalDate: string | null;
  updatedItemStatus: Product['status'];
  projectedOnHandQuantity: number;
}

type ProcurementOrderApiResponse = Partial<{
  status: string;
  orderStatus: string;
  acceptedQuantity: number | string;
  acceptedQty: number | string;
  rejectedQuantity: number | string;
  rejectedQty: number | string;
  expectedArrivalDate: string;
  eta: string;
  updatedItemStatus: Product['status'];
  itemStatus: Product['status'];
  projectedOnHandQuantity: number | string;
  projectedOnHand: number | string;
  onHandQuantity: number | string;
}>;

const PROCUREMENT_ORDER_ENDPOINT = '/api/procurement/orders';

const toNonNegativeNumber = (value: unknown, fallback = 0): number => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

const normalizeOrderStatus = (status: unknown): ProcurementOrderStatus => {
  const normalized = String(status ?? '').trim().toLowerCase();

  if (['accepted', 'success', 'approved', 'fulfilled'].includes(normalized)) return 'accepted';
  if (['partial', 'partially_accepted', 'partially accepted', 'partial_success'].includes(normalized)) return 'partial';
  if (['rejected', 'denied', 'failed', 'declined'].includes(normalized)) return 'rejected';

  return 'pending';
};

const normalizeItemStatus = (status: unknown, fallback: Product['status']): Product['status'] => {
  if (status === 'Good' || status === 'Low' || status === 'Critical') return status;
  return fallback;
};

const fallbackStatusForProjectedQuantity = (projectedOnHandQuantity: number, reorderPoint: number): Product['status'] => {
  if (projectedOnHandQuantity >= reorderPoint) return 'Good';
  if (projectedOnHandQuantity > 0) return 'Low';
  return 'Critical';
};

export const parseProcurementOrderResponse = (
  response: ProcurementOrderApiResponse,
  request: CreateProcurementOrderRequest,
): ProcurementOrderResponse => {
  const orderStatus = normalizeOrderStatus(response.orderStatus ?? response.status);
  const acceptedQuantity = toNonNegativeNumber(response.acceptedQuantity ?? response.acceptedQty);
  const rejectedQuantity = Math.max(
    0,
    Number(response.rejectedQuantity ?? response.rejectedQty ?? request.quantity - acceptedQuantity) || 0,
  );
  const projectedOnHandQuantity = toNonNegativeNumber(
    response.projectedOnHandQuantity ?? response.projectedOnHand ?? response.onHandQuantity,
    request.currentStock + acceptedQuantity,
  );
  const expectedArrivalDate = response.expectedArrivalDate ?? response.eta ?? null;
  const fallbackStatus = fallbackStatusForProjectedQuantity(projectedOnHandQuantity, request.reorderPoint);
  const updatedItemStatus = normalizeItemStatus(response.updatedItemStatus ?? response.itemStatus, fallbackStatus);

  return {
    orderStatus,
    acceptedQuantity,
    rejectedQuantity,
    expectedArrivalDate,
    updatedItemStatus,
    projectedOnHandQuantity,
  };
};

export const createProcurementOrder = async (
  request: CreateProcurementOrderRequest,
): Promise<ProcurementOrderResponse> => {
  const response = await fetch(PROCUREMENT_ORDER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...await getCsrfHeaders()
    },
    credentials: 'include',
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Procurement order failed with status ${response.status}`);
  }

  const payload = await response.json() as ProcurementOrderApiResponse;
  return parseProcurementOrderResponse(payload, request);
};
