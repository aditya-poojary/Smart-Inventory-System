import { useEffect, useState } from "react";
import { TrendingUp, Package, AlertTriangle, Info } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { listTable, insertRows } from "../api/boltic";
import Modal from "../components/common/Modal";
import Alert from "../components/common/Alert";

interface Forecast {
  run_ts: string;
  store_id: string;
  sku_id: string;
  forecast_horizon_days: number;
  recommended_order_qty: number;
  daily_forecast: Array<{ day: string; units: number }>;
  reasoning: {
    avg_daily_sales: number;
    weekend_boost: number;
    promo_active: boolean;
    weather_impact: string;
  };
}

export default function ForecastsPage() {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [selectedForecast, setSelectedForecast] = useState<Forecast | null>(
    null
  );
  const [inventory, setInventory] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [actionResult, setActionResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    loadForecasts();
  }, []);

  async function loadForecasts() {
    try {
      const [forecastData, inventoryData] = await Promise.all([
        listTable("demand_forecast"),
        listTable("inventory_snapshot"),
      ]);

      setForecasts(forecastData.result.data as Forecast[]);

      // Create inventory lookup
      const invMap: Record<string, any> = {};
      inventoryData.result.data.forEach((item: any) => {
        const key = `${item.store_id}_${item.sku_id}`;
        invMap[key] = item;
      });
      setInventory(invMap);

      setLoading(false);
    } catch (error) {
      console.error("Failed to load forecasts:", error);
      setLoading(false);
    }
  }

  async function createPurchaseOrder(forecast: Forecast) {
    try {
      const invKey = `${forecast.store_id}_${forecast.sku_id}`;
      const invItem = inventory[invKey];

      await insertRows("replenishment_actions", [
        {
          action_ts: new Date().toISOString(),
          store_id: forecast.store_id,
          sku_id: forecast.sku_id,
          action_type: "order_request",
          status: "generated",
          details: {
            order_qty: forecast.recommended_order_qty,
            vendor: invItem?.vendor_email || "unknown",
            reason: "AI forecast recommendation",
            forecast_run: forecast.run_ts,
          },
        },
      ]);

      setActionResult({
        success: true,
        message: `Purchase order created for ${forecast.recommended_order_qty} units`,
      });

      setTimeout(() => setActionResult(null), 3000);
    } catch (error: any) {
      setActionResult({
        success: false,
        message: `Failed to create order: ${error.message}`,
      });
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
        <h1 className="text-3xl font-bold text-gray-900">Demand Forecasts</h1>
        <p className="text-gray-600 mt-2">
          AI-powered 7-day demand predictions with explainability
        </p>
      </div>

      {actionResult && (
        <div className="mb-6">
          <Alert
            type={actionResult.success ? "success" : "error"}
            message={actionResult.message}
            onClose={() => setActionResult(null)}
          />
        </div>
      )}

      {/* Forecast Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {forecasts.map((forecast, index) => {
          const invKey = `${forecast.store_id}_${forecast.sku_id}`;
          const invItem = inventory[invKey];
          const needsOrder =
            invItem && invItem.on_hand_qty < invItem.safety_stock;

          return (
            <div
              key={index}
              className={`card border-2 ${
                needsOrder
                  ? "border-warning-300 bg-warning-50"
                  : "border-gray-200"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="text-primary-600" size={20} />
                    <h3 className="font-bold text-gray-900">
                      {forecast.sku_id}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">{forecast.store_id}</p>
                  {invItem && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-600">Current Stock: </span>
                      <span
                        className={`font-medium ${
                          invItem.on_hand_qty < invItem.safety_stock
                            ? "text-warning-700"
                            : "text-success-700"
                        }`}
                      >
                        {invItem.on_hand_qty} units
                      </span>
                      <span className="text-gray-500">
                        {" "}
                        (Safety: {invItem.safety_stock})
                      </span>
                    </div>
                  )}
                </div>
                {needsOrder && (
                  <span className="badge-warning flex items-center gap-1">
                    <AlertTriangle size={14} />
                    Low Stock
                  </span>
                )}
              </div>

              {/* Recommended Order */}
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-primary-700 font-medium">
                      Recommended Order
                    </p>
                    <p className="text-3xl font-bold text-primary-900 mt-1">
                      {forecast.recommended_order_qty}
                      <span className="text-lg ml-1">units</span>
                    </p>
                  </div>
                  <TrendingUp className="text-primary-600" size={40} />
                </div>
              </div>

              {/* Mini Chart */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  7-Day Forecast
                </p>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={forecast.daily_forecast}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" style={{ fontSize: "12px" }} />
                    <YAxis style={{ fontSize: "12px" }} />
                    <Tooltip />
                    <Bar dataKey="units" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Reasoning */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info size={16} className="text-gray-600" />
                  <p className="text-sm font-medium text-gray-700">
                    Why this forecast?
                  </p>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    • Avg daily sales:{" "}
                    <span className="font-medium">
                      {forecast.reasoning.avg_daily_sales} units
                    </span>
                  </p>
                  <p>
                    • Weekend boost:{" "}
                    <span className="font-medium">
                      {((forecast.reasoning.weekend_boost - 1) * 100).toFixed(
                        0
                      )}
                      %
                    </span>
                  </p>
                  <p>
                    • Promo active:{" "}
                    <span className="font-medium">
                      {forecast.reasoning.promo_active ? "Yes" : "No"}
                    </span>
                  </p>
                  <p>
                    • Weather impact:{" "}
                    <span className="font-medium capitalize">
                      {forecast.reasoning.weather_impact}
                    </span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => createPurchaseOrder(forecast)}
                  className="btn-success flex-1"
                >
                  Create Purchase Order
                </button>
                <button
                  onClick={() => setSelectedForecast(forecast)}
                  className="btn-secondary"
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {forecasts.length === 0 && (
        <div className="card text-center py-12">
          <TrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">No forecasts available</p>
          <p className="text-sm text-gray-500 mt-1">
            Run the workflow to generate demand forecasts
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedForecast && (
        <Modal
          isOpen={!!selectedForecast}
          onClose={() => setSelectedForecast(null)}
          title={`Forecast Details: ${selectedForecast.sku_id}`}
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Store & SKU</h4>
              <p className="text-gray-700">
                {selectedForecast.store_id} - {selectedForecast.sku_id}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Full 7-Day Forecast
              </h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={selectedForecast.daily_forecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="units" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Explainability Factors
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700">
                  {JSON.stringify(selectedForecast.reasoning, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
