import axios from "axios";

const USE_MOCK = true; // Toggle this to switch between mock and real API

const client = axios.create({
  baseURL: import.meta.env.VITE_BOLTIC_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    ...(import.meta.env.VITE_BOLTIC_TOKEN && {
      Authorization: `Bearer ${import.meta.env.VITE_BOLTIC_TOKEN}`,
    }),
  },
});

// Types
export interface TableRow {
  [key: string]: any;
}

export interface TableResponse {
  result: {
    data: TableRow[];
    pagination?: {
      total: number;
      page: number;
      limit: number;
    };
  };
}

export interface UpsertResponse {
  success: boolean;
  inserted: number;
  updated: number;
  errors: any[];
}

export interface WorkflowRunResponse {
  run_id: string;
  status: "started" | "running" | "succeeded" | "failed";
  started_at?: string;
  completed_at?: string;
}

// API Functions
export async function listTable(
  tableName: string,
  params: Record<string, any> = {}
): Promise<TableResponse> {
  if (USE_MOCK) {
    // Return mock data
    const mockData = await import("../utils/mockData");
    const dataMap: Record<string, any> = {
      store_master: mockData.mockStores,
      sku_master: mockData.mockSKUs,
      inventory_snapshot: mockData.mockInventory,
      sales_history: mockData.mockSalesHistory,
      demand_forecast: mockData.mockForecasts,
      replenishment_actions: mockData.mockReplenishmentActions,
      external_signals: mockData.mockExternalSignals,
    };

    return {
      result: {
        data: dataMap[tableName] || [],
        pagination: {
          total: (dataMap[tableName] || []).length,
          page: 1,
          limit: 100,
        },
      },
    };
  }

  const res = await client.get(`/tables/${tableName}/rows`, { params });
  return res.data;
}

export async function upsertRows(
  tableName: string,
  rows: TableRow[]
): Promise<UpsertResponse> {
  if (USE_MOCK) {
    // Simulate success
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      inserted: rows.length,
      updated: 0,
      errors: [],
    };
  }

  const res = await client.post(`/tables/${tableName}/upsert`, { rows });
  return res.data;
}

export async function insertRows(
  tableName: string,
  rows: TableRow[]
): Promise<UpsertResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      inserted: rows.length,
      updated: 0,
      errors: [],
    };
  }

  const res = await client.post(`/tables/${tableName}/insert`, { rows });
  return res.data;
}

export async function deleteRows(
  tableName: string,
  ids: any[]
): Promise<{ success: boolean; deleted: number }> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      deleted: ids.length,
    };
  }

  const res = await client.post(`/tables/${tableName}/delete`, { ids });
  return res.data;
}

export async function triggerWorkflow(
  slug: string,
  payload: Record<string, any> = {}
): Promise<WorkflowRunResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      run_id: `run_${Date.now()}`,
      status: "started",
      started_at: new Date().toISOString(),
    };
  }

  const res = await client.post(`/workflows/${slug}/runs`, { input: payload });
  return res.data;
}

export async function getWorkflowRun(
  slug: string,
  runId: string
): Promise<any> {
  if (USE_MOCK) {
    const { mockWorkflowRuns } = await import("../utils/mockData");
    const run = mockWorkflowRuns.find((r) => r.run_id === runId);
    return run || mockWorkflowRuns[0];
  }

  const res = await client.get(`/workflows/${slug}/runs/${runId}`);
  return res.data;
}

export async function listWorkflowRuns(
  slug: string,
  params: Record<string, any> = {}
): Promise<any> {
  if (USE_MOCK) {
    const { mockWorkflowRuns } = await import("../utils/mockData");
    return {
      result: {
        data: mockWorkflowRuns,
        pagination: {
          total: mockWorkflowRuns.length,
          page: 1,
          limit: 10,
        },
      },
    };
  }

  const res = await client.get(`/workflows/${slug}/runs`, { params });
  return res.data;
}

export default client;
