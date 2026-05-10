import { Product } from '../types';

const INVENTORY_API_BASE = '/api/inventory';
const PRODUCT_STATUSES = new Set<Product['status']>(['Good', 'Low', 'Critical']);

export interface ProcurementOrderPayload {
  storeNumber: string;
  sku: string;
  quantity: number;
  priority: string;
}

export interface ReplenishmentBatchPayload {
  storeNumber: string;
  items: Array<{
    sku: string;
    requestedQuantity: number;
    currentStock: number;
    reorderPoint: number;
  }>;
}

export interface BackendMutationResponse {
  id?: string;
  status?: string;
  message?: string;
}

export class InventoryApiError extends Error {
  status?: number;
  unavailable: boolean;

  constructor(message: string, options: { status?: number; unavailable?: boolean } = {}) {
    super(message);
    this.name = 'InventoryApiError';
    this.status = options.status;
    this.unavailable = Boolean(options.unavailable);
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const requireString = (value: unknown, field: string): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new InventoryApiError(`Invalid inventory response: ${field} must be a non-empty string.`);
  }

  return value;
};

const requireNumber = (value: unknown, field: string): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new InventoryApiError(`Invalid inventory response: ${field} must be a finite number.`);
  }

  return value;
};

export const mapInventoryProduct = (dto: unknown): Product => {
  if (!isRecord(dto)) {
    throw new InventoryApiError('Invalid inventory response: product must be an object.');
  }

  const status = dto.status;
  if (!PRODUCT_STATUSES.has(status as Product['status'])) {
    throw new InventoryApiError('Invalid inventory response: status must be Good, Low, or Critical.');
  }

  return {
    id: requireString(dto.id, 'id'),
    name: requireString(dto.name, 'name'),
    sku: requireString(dto.sku, 'sku'),
    category: requireString(dto.category, 'category'),
    stock: requireNumber(dto.stock, 'stock'),
    reorderPoint: requireNumber(dto.reorderPoint, 'reorderPoint'),
    status: status as Product['status']
  };
};

const extractInventoryItems = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (isRecord(payload) && Array.isArray(payload.items)) {
    return payload.items;
  }

  throw new InventoryApiError('Invalid inventory response: expected an array or an object with an items array.');
};

const parseJsonResponse = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new InventoryApiError('Inventory backend returned a non-JSON response.', {
      status: response.status,
      unavailable: response.status === 404
    });
  }

  return response.json();
};

const requestJson = async (url: string, init?: RequestInit): Promise<unknown> => {
  let response: Response;

  try {
    response = await fetch(url, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers
      },
      credentials: 'same-origin'
    });
  } catch (error) {
    throw new InventoryApiError('Inventory backend is unavailable.', { unavailable: true });
  }

  if (!response.ok) {
    let message = `Inventory backend request failed with status ${response.status}.`;

    try {
      const body = await parseJsonResponse(response);
      if (isRecord(body) && typeof body.message === 'string') {
        message = body.message;
      }
    } catch {
      // Preserve the HTTP failure message when the error body is unavailable or invalid.
    }

    throw new InventoryApiError(message, {
      status: response.status,
      unavailable: response.status === 404 || response.status === 501 || response.status === 503
    });
  }

  return parseJsonResponse(response);
};

export const getInventory = async (storeNumber: string): Promise<Product[]> => {
  const payload = await requestJson(`${INVENTORY_API_BASE}/${encodeURIComponent(storeNumber)}`);
  return extractInventoryItems(payload).map(mapInventoryProduct);
};

export const createProcurementOrder = async (
  payload: ProcurementOrderPayload
): Promise<BackendMutationResponse> => {
  const response = await requestJson(`${INVENTORY_API_BASE}/procurement-orders`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return isRecord(response) ? response : {};
};

export const createReplenishmentBatch = async (
  payload: ReplenishmentBatchPayload
): Promise<BackendMutationResponse> => {
  const response = await requestJson(`${INVENTORY_API_BASE}/replenishment-batches`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return isRecord(response) ? response : {};
};

export const isInventoryBackendUnavailable = (error: unknown): boolean =>
  error instanceof InventoryApiError && error.unavailable;

export const getInventoryErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Inventory request failed unexpectedly.';
