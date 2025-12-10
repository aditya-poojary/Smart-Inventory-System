import React, { useEffect, useState } from "react";
import {
  Package,
  Store,
  AlertTriangle,
  TrendingUp,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { listTable, listWorkflowRuns } from "../api/boltic";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  status?: "success" | "warning" | "danger";
}

function MetricCard({ title, value, icon, trend, status }: MetricCardProps) {
  const statusColors = {
    success: "border-success-200 bg-success-50",
    warning: "border-warning-200 bg-warning-50",
    danger: "border-danger-200 bg-danger-50",
  };

  return (
    <div
      className={`card border-2 ${
        status ? statusColors[status] : "border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p
              className={`text-sm mt-1 ${
                trend.isPositive ? "text-success-600" : "text-danger-600"
              }`}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="text-gray-400">{icon}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalStores: 0,
    totalSKUs: 0,
    lowStockItems: 0,
    pendingReplenishments: 0,
  });
  const [workflowRuns, setWorkflowRuns] = useState<any[]>([]);
  const [topSKUs, setTopSKUs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const [stores, skus, inventory, replenishments, workflows] =
        await Promise.all([
          listTable("store_master"),
          listTable("sku_master"),
          listTable("inventory_snapshot"),
          listTable("replenishment_actions"),
          listWorkflowRuns("A_sales_signals_sync", { limit: 5 }),
        ]);

      const lowStock = inventory.result.data.filter(
        (item: any) => item.on_hand_qty < item.safety_stock
      );

      const pending = replenishments.result.data.filter(
        (action: any) =>
          action.status === "generated" || action.status === "pending"
      );

      setMetrics({
        totalStores: stores.result.data.length,
        totalSKUs: skus.result.data.length,
        lowStockItems: lowStock.length,
        pendingReplenishments: pending.length,
      });

      setWorkflowRuns(workflows.result.data);

      // Calculate top SKUs (mock calculation)
      const skuSales: Record<string, number> = {};
      inventory.result.data.forEach((item: any) => {
        skuSales[item.sku_id] =
          (skuSales[item.sku_id] || 0) + (item.safety_stock - item.on_hand_qty);
      });

      const top = Object.entries(skuSales)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([sku_id, sales]) => ({ sku_id, estimated_sales: sales }));

      setTopSKUs(top);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Smart Inventory Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Real-time overview of your inventory system
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Stores"
          value={metrics.totalStores}
          icon={<Store size={40} />}
        />
        <MetricCard
          title="Total SKUs"
          value={metrics.totalSKUs}
          icon={<Package size={40} />}
        />
        <MetricCard
          title="Low Stock Alerts"
          value={metrics.lowStockItems}
          icon={<AlertTriangle size={40} />}
          status={metrics.lowStockItems > 0 ? "warning" : "success"}
        />
        <MetricCard
          title="Pending Orders"
          value={metrics.pendingReplenishments}
          icon={<TrendingUp size={40} />}
          status={metrics.pendingReplenishments > 0 ? "danger" : "success"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Workflow Runs */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-primary-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">
              Recent Workflow Runs
            </h2>
          </div>
          <div className="space-y-3">
            {workflowRuns.map((run) => (
              <div
                key={run.run_id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {run.status === "succeeded" ? (
                    <CheckCircle className="text-success-600" size={20} />
                  ) : run.status === "failed" ? (
                    <XCircle className="text-danger-600" size={20} />
                  ) : (
                    <Clock className="text-warning-600" size={20} />
                  )}
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {run.run_id}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(run.started_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`badge ${
                    run.status === "succeeded"
                      ? "badge-success"
                      : run.status === "failed"
                      ? "badge-danger"
                      : "badge-warning"
                  }`}
                >
                  {run.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top SKUs */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-primary-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">
              High Demand SKUs
            </h2>
          </div>
          <div className="space-y-3">
            {topSKUs.map((sku, index) => (
              <div
                key={sku.sku_id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 rounded-full font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {sku.sku_id}
                    </p>
                    <p className="text-xs text-gray-500">
                      Est. sales: {sku.estimated_sales} units
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="btn-primary text-left p-6">
          <div className="text-lg font-semibold mb-1">Upload Sales Data</div>
          <div className="text-sm opacity-90">Import CSV or trigger sync</div>
        </button>
        <button className="btn-secondary text-left p-6">
          <div className="text-lg font-semibold mb-1 text-gray-900">
            View Forecasts
          </div>
          <div className="text-sm text-gray-600">
            AI-generated demand predictions
          </div>
        </button>
        <button className="btn-success text-left p-6">
          <div className="text-lg font-semibold mb-1">Run Workflow</div>
          <div className="text-sm opacity-90">Execute sales + signals sync</div>
        </button>
      </div>
    </div>
  );
}
