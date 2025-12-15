import { useState } from "react";
import { Send, Plus, Trash2, CheckCircle } from "lucide-react";
import Alert from "../components/common/Alert";
import axios from "axios";

interface SalesEntry {
  date: string;
  store_id: string;
  sku_id: string;
  units_sold: number;
}

const BOLTIC_API_URL =
  "https://asia-south1.workflow.boltic.app/8d321f41-0f56-44e7-b790-db8f2fa0dba1/newsales";

export default function ManualEntryPage() {
  const [entries, setEntries] = useState<SalesEntry[]>([
    {
      date: new Date().toISOString().split("T")[0],
      store_id: "",
      sku_id: "",
      units_sold: 0,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        date: new Date().toISOString().split("T")[0],
        store_id: "",
        sku_id: "",
        units_sold: 0,
      },
    ]);
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const updateEntry = (
    index: number,
    field: keyof SalesEntry,
    value: string | number
  ) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Validate entries
      const validEntries = entries.filter(
        (entry) =>
          entry.date && entry.store_id && entry.sku_id && entry.units_sold > 0
      );

      if (validEntries.length === 0) {
        setResult({
          success: false,
          message: "Please fill in at least one complete entry",
        });
        setLoading(false);
        return;
      }

      // Format for Boltic Loop activity - array wrapped in payload object
      const loopPayload = {
        payload: {
          sales: validEntries.map((entry) => ({
            date: entry.date,
            store_id: entry.store_id,
            sku_id: entry.sku_id,
            units_sold: entry.units_sold,
          })),
        },
      };

      console.log(
        "Sending to Boltic Loop:",
        JSON.stringify(loopPayload, null, 2)
      );

      // Send to Boltic API
      const response = await axios.post(BOLTIC_API_URL, loopPayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Boltic Response:", response.data);

      setResult({
        success: true,
        message: `Successfully sent ${validEntries.length} sales entries to Boltic workflow!`,
      });

      // Reset form
      setEntries([
        {
          date: new Date().toISOString().split("T")[0],
          store_id: "",
          sku_id: "",
          units_sold: 0,
        },
      ]);
    } catch (error: any) {
      console.error("Boltic API Error:", error);
      setResult({
        success: false,
        message: `Failed to send data: ${
          error.response?.data?.message || error.message
        }`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Common store and SKU options (from your mock data)
  const storeOptions = [
    "STORE_DELHI_NCR_01",
    "STORE_JAIPUR_01",
    "STORE_AHMEDABAD_01",
    "STORE_KOLKATA_01",
    "STORE_PUNE_01",
    "STORE_MUMBAI_01",
    "STORE_THANE_01",
  ];

  const skuOptions = [
    "BEV-COC-750",
    "BEV-COCZ-750",
    "BEV-THUMSUP-750",
    "SNK-LAYS-CLSC-52",
    "INST-MAGGI-MAS-70",
    "INST-MAGGI-SPC-70",
    "CONF-SILK-PLN-60",
    "CONF-SILK-HAZ-58",
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manual Sales Entry</h1>
        <p className="text-gray-600 mt-2">
          Enter sales data and send directly to Boltic workflow
        </p>
      </div>

      {result && (
        <div className="mb-6">
          <Alert
            type={result.success ? "success" : "error"}
            message={result.message}
            onClose={() => setResult(null)}
          />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Sales Entries</h2>
            <button
              type="button"
              onClick={addEntry}
              className="btn-secondary flex items-center gap-2"
            >
              <Plus size={18} />
              Add Entry
            </button>
          </div>

          <div className="space-y-4">
            {entries.map((entry, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg"
              >
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={entry.date}
                    onChange={(e) => updateEntry(index, "date", e.target.value)}
                    className="input"
                    required
                  />
                </div>

                {/* Store ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store ID
                  </label>
                  <select
                    value={entry.store_id}
                    onChange={(e) =>
                      updateEntry(index, "store_id", e.target.value)
                    }
                    className="input"
                    required
                  >
                    <option value="">Select Store</option>
                    {storeOptions.map((store) => (
                      <option key={store} value={store}>
                        {store}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SKU ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU ID
                  </label>
                  <select
                    value={entry.sku_id}
                    onChange={(e) =>
                      updateEntry(index, "sku_id", e.target.value)
                    }
                    className="input"
                    required
                  >
                    <option value="">Select SKU</option>
                    {skuOptions.map((sku) => (
                      <option key={sku} value={sku}>
                        {sku}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Units Sold */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Units Sold
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={entry.units_sold}
                    onChange={(e) =>
                      updateEntry(
                        index,
                        "units_sold",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="input"
                    required
                  />
                </div>

                {/* Remove Button */}
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeEntry(index)}
                    disabled={entries.length === 1}
                    className="btn-danger w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Section */}
        <div className="card bg-primary-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Ready to send {entries.length}{" "}
                {entries.length === 1 ? "entry" : "entries"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Data will be sent to Boltic workflow trigger
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send to Boltic
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* API Endpoint Info */}
      <div className="mt-6 card bg-gray-50">
        <div className="flex items-start gap-3">
          <CheckCircle className="text-success-600 mt-1" size={20} />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">
              Boltic Endpoint
            </h4>
            <p className="text-sm text-gray-600 break-all">{BOLTIC_API_URL}</p>
            <p className="text-xs text-gray-500 mt-2">
              Payload format:{" "}
              {`{ payload: { sales: [{ date, store_id, sku_id, units_sold }] } }`}
            </p>
            <p className="text-xs text-primary-700 mt-1 font-medium">
              ✓ Optimized for Boltic Loop - processes multiple entries
              automatically
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
