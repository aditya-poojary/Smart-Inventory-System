import { useState, useCallback } from "react";
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle,
  X,
  Download,
  FileText
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UploadedFile {
  name: string;
  size: string;
  status: "uploading" | "success" | "error";
  rows?: number;
}

const IngestPage = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = (file: File) => {
    const newFile: UploadedFile = {
      name: file.name,
      size: formatFileSize(file.size),
      status: "uploading",
    };
    
    setUploadedFiles(prev => [...prev, newFile]);

    // Simulate processing
    setTimeout(() => {
      setUploadedFiles(prev => 
        prev.map(f => 
          f.name === file.name 
            ? { ...f, status: "success" as const, rows: Math.floor(Math.random() * 500) + 100 }
            : f
        )
      );
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been processed.`,
      });
    }, 1500);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        processFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload CSV files only.",
          variant: "destructive",
        });
      }
    });
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        processFile(file);
      }
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
        <h2 className="text-3xl font-bold text-foreground">Upload CSV</h2>
        <p className="text-muted-foreground mt-1">
          Import your inventory data from CSV files for AI-powered analysis.
        </p>
      </div>

      {/* Upload Zone */}
      <div 
        className="mt-8 opacity-0 animate-slide-up"
        style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
      >
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`upload-zone ${isDragging ? "upload-zone-active" : ""}`}
        >
          <input
            type="file"
            accept=".csv"
            multiple
            onChange={handleFileInput}
            className="hidden"
            id="file-input"
          />
          <label htmlFor="file-input" className="cursor-pointer">
            <div className="flex flex-col items-center gap-4">
              <div className={`p-4 rounded-2xl transition-all duration-300 ${
                isDragging ? "gradient-bg scale-110" : "bg-primary/10"
              }`}>
                <Upload className={`transition-colors ${isDragging ? "text-primary-foreground" : "text-primary"}`} size={40} />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">
                  {isDragging ? "Drop your files here" : "Drag & drop your CSV files"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse from your computer
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileSpreadsheet size={14} />
                <span>Supports: .csv files up to 10MB</span>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div 
          className="mt-8 glass-card p-6 opacity-0 animate-slide-up"
          style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Uploaded Files</h3>
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 animate-scale-in"
              >
                <div className={`p-2.5 rounded-lg ${
                  file.status === "success" ? "bg-success/15" :
                  file.status === "error" ? "bg-destructive/15" :
                  "bg-primary/15"
                }`}>
                  <FileSpreadsheet className={
                    file.status === "success" ? "text-success" :
                    file.status === "error" ? "text-destructive" :
                    "text-primary"
                  } size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {file.size}
                    {file.rows && <span className="ml-2">• {file.rows} rows</span>}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {file.status === "uploading" && (
                    <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full gradient-bg animate-pulse" style={{ width: "60%" }} />
                    </div>
                  )}
                  {file.status === "success" && (
                    <CheckCircle className="text-success" size={20} />
                  )}
                  {file.status === "error" && (
                    <AlertCircle className="text-destructive" size={20} />
                  )}
                  <button
                    onClick={() => removeFile(file.name)}
                    className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Template Download */}
      <div 
        className="mt-8 glass-card p-6 opacity-0 animate-slide-up"
        style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-accent/10">
            <FileText className="text-accent" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">Need a template?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Download our CSV template to ensure your data is formatted correctly for import.
            </p>
            <button className="mt-4 flex items-center gap-2 px-4 py-2 gradient-bg text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
              <Download size={16} />
              Download Template
            </button>
          </div>
        </div>
      </div>

      {/* Format Guide */}
      <div 
        className="mt-8 glass-card p-6 opacity-0 animate-slide-up"
        style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Expected Format</h3>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Column</th>
                <th>Type</th>
                <th>Example</th>
                <th>Required</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-mono text-sm">sku</td>
                <td className="text-muted-foreground">String</td>
                <td className="text-muted-foreground">SKU-001234</td>
                <td><span className="status-badge status-success">Yes</span></td>
              </tr>
              <tr>
                <td className="font-mono text-sm">name</td>
                <td className="text-muted-foreground">String</td>
                <td className="text-muted-foreground">Widget Pro X1000</td>
                <td><span className="status-badge status-success">Yes</span></td>
              </tr>
              <tr>
                <td className="font-mono text-sm">quantity</td>
                <td className="text-muted-foreground">Number</td>
                <td className="text-muted-foreground">150</td>
                <td><span className="status-badge status-success">Yes</span></td>
              </tr>
              <tr>
                <td className="font-mono text-sm">price</td>
                <td className="text-muted-foreground">Number</td>
                <td className="text-muted-foreground">29.99</td>
                <td><span className="status-badge status-info">Optional</span></td>
              </tr>
              <tr>
                <td className="font-mono text-sm">category</td>
                <td className="text-muted-foreground">String</td>
                <td className="text-muted-foreground">Electronics</td>
                <td><span className="status-badge status-info">Optional</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IngestPage;
