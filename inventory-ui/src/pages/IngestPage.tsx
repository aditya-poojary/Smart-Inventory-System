import React, { useState } from "react";
import Papa from "papaparse";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import Alert from "../components/common/Alert";
import Table from "../components/common/Table";
import { upsertRows, triggerWorkflow } from "../api/boltic";

interface CSVRow {
  date: string;
  store_id: string;
  sku_id: string;
  units_sold: number;
  [key: string]: any;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export default function IngestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<CSVRow[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploadResult(null);

    Papa.parse(selectedFile, {
      header: true,
      preview: 20,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as CSVRow[];
        const validationErrors: ValidationError[] = [];

        // Validate each row
        data.forEach((row, index) => {
          if (!row.date || isNaN(Date.parse(row.date))) {
            validationErrors.push({
              row: index + 1,
              field: "date",
              message: "Invalid or missing date",
            });
          }
          if (!row.store_id) {
            validationErrors.push({
              row: index + 1,
              field: "store_id",
              message: "Missing store_id",
            });
          }
          if (!row.sku_id) {
            validationErrors.push({
              row: index + 1,
              field: "sku_id",
              message: "Missing sku_id",
            });
          }
          if (!row.units_sold || isNaN(Number(row.units_sold))) {
            validationErrors.push({
              row: index + 1,
              field: "units_sold",
              message: "Invalid units_sold",
            });
          }
        });

        setPreview(data);
        setErrors(validationErrors);
      },
      error: (error) => {
        console.error("CSV parse error:", error);
        setUploadResult({
          success: false,
          message: `Failed to parse CSV: ${error.message}`,
        });
      },
    });
  };

  const handleUpload = async () => {
    if (!file || preview.length === 0) return;

    setUploading(true);
    setUploadResult(null);

    try {
      // Parse full file
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const data = results.data as CSVRow[];

          // Normalize data
          const normalized = data
            .filter(
              (row) => row.date && row.store_id && row.sku_id && row.units_sold
            )
            .map((row) => ({
              date: row.date,
              store_id: row.store_id.trim(),
              sku_id: row.sku_id.trim(),
              units_sold: Number(row.units_sold),
              updated_at: new Date().toISOString(),
            }));

          if (normalized.length === 0) {
            setUploadResult({
              success: false,
              message: "No valid rows found in CSV",
            });
            setUploading(false);
            return;
          }

          // Upsert to sales_history
          const result = await upsertRows("sales_history", normalized);

          if (result.success) {
            setUploadResult({
              success: true,
              message: `Successfully ingested ${
                result.inserted + result.updated
              } rows (${result.inserted} new, ${result.updated} updated)`,
            });

            // Optionally trigger workflow
            try {
              await triggerWorkflow("A_sales_signals_sync", {
                source: "csv_upload",
                rows_count: normalized.length,
              });
            } catch (wfError) {
              console.warn("Workflow trigger failed:", wfError);
            }
          } else {
            setUploadResult({
              success: false,
              message: `Upload failed: ${result.errors.length} errors`,
            });
          }

          setUploading(false);
        },
      });
    } catch (error: any) {
      setUploadResult({
        success: false,
        message: `Error: ${error.message}`,
      });
      setUploading(false);
    }
  };

  const columns = [
    { key: "date", label: "Date" },
    { key: "store_id", label: "Store ID" },
    { key: "sku_id", label: "SKU ID" },
    {
      key: "units_sold",
      label: "Units Sold",
      render: (value: any) => <span className="font-medium">{value}</span>,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Sales Data Ingestion
        </h1>
        <p className="text-gray-600 mt-2">
          Upload CSV files to sync sales history
        </p>
      </div>

      {/* Upload Area */}
      <div className="card mb-6">
        <label className="block">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary-400 transition-colors cursor-pointer">
            <Upload className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop CSV file here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Expected columns: date, store_id, sku_id, units_sold
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </label>

        {file && (
          <div className="mt-4 flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <FileText className="text-primary-600" size={24} />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            {errors.length === 0 ? (
              <CheckCircle className="text-success-600" size={24} />
            ) : (
              <AlertCircle className="text-warning-600" size={24} />
            )}
          </div>
        )}
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="mb-6">
          <Alert
            type="warning"
            message={`Found ${errors.length} validation errors. Please review before uploading.`}
          />
          <div className="mt-4 card max-h-60 overflow-y-auto">
            {errors.map((error, index) => (
              <div key={index} className="py-2 border-b last:border-b-0">
                <span className="text-sm text-gray-700">
                  Row {error.row}:{" "}
                  <span className="font-medium">{error.field}</span> -{" "}
                  {error.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview */}
      {preview.length > 0 && (
        <div className="card mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Preview (first 20 rows)
          </h3>
          <Table columns={columns} data={preview} />
        </div>
      )}

      {/* Upload Result */}
      {uploadResult && (
        <div className="mb-6">
          <Alert
            type={uploadResult.success ? "success" : "error"}
            message={uploadResult.message}
          />
        </div>
      )}

      {/* Actions */}
      {preview.length > 0 && (
        <div className="flex gap-4">
          <button
            onClick={handleUpload}
            disabled={uploading || errors.length > 0}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading..." : "Upload & Ingest Data"}
          </button>
          <button
            onClick={() => {
              setFile(null);
              setPreview([]);
              setErrors([]);
              setUploadResult(null);
            }}
            className="btn-secondary"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
