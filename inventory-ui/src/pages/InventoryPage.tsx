import { useEffect, useState } from "react";
import { Package, Edit2, Save, X } from "lucide-react";
import { listTable, upsertRows } from "../api/boltic";
import Alert from "../components/common/Alert";

interface InventoryItem {
  store_id: string;
  sku_id: string;
  on_hand_qty: number;
  safety_stock: number;
  reorder_multiple: number;
  vendor_email: string;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stores, setStores] = useState<Record<string, any>>({});
  const [skus, setSKUs] = useState<Record<string, any>>({});
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<InventoryItem>>({});
  const [loading, setLoading] = useState(true);
  const [saveResult, setSaveResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      const [invData, storeData, skuData] = await Promise.all([
        listTable("inventory_snapshot"),
        listTable("store_master"),
        listTable("sku_master"),
      ]);

      setInventory(invData.result.data as InventoryItem[]);

      // Create lookups
      const storeMap: Record<string, any> = {};
      storeData.result.data.forEach((s: any) => {
        storeMap[s.store_id] = s;
      });
      setStores(storeMap);

      const skuMap: Record<string, any> = {};
      skuData.result.data.forEach((s: any) => {
        skuMap[s.sku_id] = s;
      });
      setSKUs(skuMap);

      setLoading(false);
    } catch (error) {
      console.error("Failed to load inventory:", error);
      setLoading(false);
    }
  }

  function startEdit(item: InventoryItem) {
    const key = `${item.store_id}_${item.sku_id}`;
    setEditingRow(key);
    setEditValues({ ...item });
  }

  function cancelEdit() {
    setEditingRow(null);
    setEditValues({});
  }

  async function saveEdit(item: InventoryItem) {
    try {
      const updated = {
        ...item,
        ...editValues,
      };

      await upsertRows("inventory_snapshot", [updated]);

      // Update local state
      setInventory((prev) =>
        prev.map((i) =>
          i.store_id === item.store_id && i.sku_id === item.sku_id ? updated : i
        )
      );

      setSaveResult({
        success: true,
        message: "Inventory updated successfully",
      });

      setEditingRow(null);
      setEditValues({});

      setTimeout(() => setSaveResult(null), 3000);
    } catch (error: any) {
      setSaveResult({
        success: false,
        message: `Failed to save: ${error.message}`,
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
        <h1 className="text-3xl font-bold text-gray-900">Inventory Snapshot</h1>
        <p className="text-gray-600 mt-2">
          Current stock levels across all stores and SKUs
        </p>
      </div>

      {saveResult && (
        <div className="mb-6">
          <Alert
            type={saveResult.success ? "success" : "error"}
            message={saveResult.message}
            onClose={() => setSaveResult(null)}
          />
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Store
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                SKU
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                On Hand
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Safety Stock
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Reorder Multiple
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Vendor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.map((item) => {
              const key = `${item.store_id}_${item.sku_id}`;
              const isEditing = editingRow === key;
              const store = stores[item.store_id];
              const sku = skus[item.sku_id];
              const stockLevel = item.on_hand_qty / item.safety_stock;

              return (
                <tr key={key} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <div className="font-medium text-gray-900">
                        {store?.store_name || item.store_id}
                      </div>
                      <div className="text-gray-500">{store?.city}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <div className="font-medium text-gray-900">
                        {item.sku_id}
                      </div>
                      <div className="text-gray-500">{sku?.sku_name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editValues.on_hand_qty ?? item.on_hand_qty}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            on_hand_qty: Number(e.target.value),
                          })
                        }
                        className="input w-20"
                      />
                    ) : (
                      <span className="font-medium">{item.on_hand_qty}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editValues.safety_stock ?? item.safety_stock}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            safety_stock: Number(e.target.value),
                          })
                        }
                        className="input w-20"
                      />
                    ) : (
                      <span>{item.safety_stock}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{item.reorder_multiple}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {item.vendor_email}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {stockLevel < 1 ? (
                      <span className="badge-danger">Low Stock</span>
                    ) : stockLevel < 1.2 ? (
                      <span className="badge-warning">Warning</span>
                    ) : (
                      <span className="badge-success">Safe</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {isEditing ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => saveEdit(item)}
                          className="p-1 text-success-600 hover:bg-success-50 rounded"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(item)}
                        className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                      >
                        <Edit2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {inventory.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No inventory data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
