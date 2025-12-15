import { useState } from "react";
import { 
  Plus, 
  Package, 
  DollarSign, 
  Tag, 
  Hash,
  Save,
  RotateCcw,
  CheckCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FormData {
  sku: string;
  name: string;
  quantity: string;
  price: string;
  category: string;
  supplier: string;
  reorderPoint: string;
  description: string;
}

const initialFormData: FormData = {
  sku: "",
  name: "",
  quantity: "",
  price: "",
  category: "",
  supplier: "",
  reorderPoint: "",
  description: "",
};

const categories = [
  "Electronics",
  "Components",
  "Accessories",
  "Raw Materials",
  "Finished Goods",
  "Packaging",
];

const ManualEntryPage = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successCount, setSuccessCount] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.sku || !formData.name || !formData.quantity) {
      toast({
        title: "Missing required fields",
        description: "Please fill in SKU, Name, and Quantity.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessCount(prev => prev + 1);
      setFormData(initialFormData);
      toast({
        title: "Item added successfully",
        description: `${formData.name} has been added to inventory.`,
      });
    }, 1000);
  };

  const handleReset = () => {
    setFormData(initialFormData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-start justify-between opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
        <div>
          <h2 className="text-3xl font-bold text-foreground">Manual Entry</h2>
          <p className="text-muted-foreground mt-1">
            Add new inventory items manually to the system.
          </p>
        </div>
        {successCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/15 text-success animate-scale-in">
            <CheckCircle size={16} />
            <span className="text-sm font-medium">{successCount} added today</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-8">
        <div 
          className="glass-card p-6 opacity-0 animate-slide-up"
          style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg gradient-bg">
              <Package className="text-primary-foreground" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Product Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SKU */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Hash size={14} className="text-muted-foreground" />
                SKU <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g., SKU-001234"
                className="input-field font-mono"
              />
            </div>

            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Package size={14} className="text-muted-foreground" />
                Product Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Widget Pro X1000"
                className="input-field"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Plus size={14} className="text-muted-foreground" />
                Quantity <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="input-field"
              />
            </div>

            {/* Price */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <DollarSign size={14} className="text-muted-foreground" />
                Unit Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="input-field"
              />
            </div>

            {/* Category */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Tag size={14} className="text-muted-foreground" />
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Supplier */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Supplier
              </label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                placeholder="e.g., Acme Corp"
                className="input-field"
              />
            </div>

            {/* Reorder Point */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Reorder Point
              </label>
              <input
                type="number"
                name="reorderPoint"
                value={formData.reorderPoint}
                onChange={handleChange}
                placeholder="Minimum stock level"
                min="0"
                className="input-field"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Optional product description..."
                rows={3}
                className="input-field resize-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div 
          className="flex flex-col sm:flex-row gap-4 mt-6 opacity-0 animate-slide-up"
          style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
        >
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 gradient-bg text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Save size={20} />
                Add to Inventory
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-semibold hover:bg-secondary/80 transition-colors"
          >
            <RotateCcw size={20} />
            Reset Form
          </button>
        </div>
      </form>

      {/* Quick Tips */}
      <div 
        className="mt-8 glass-card p-6 opacity-0 animate-slide-up"
        style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Tips</h3>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Use consistent SKU formats for easier tracking (e.g., CAT-XXXX)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Set reorder points based on your lead time and average daily consumption
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            For bulk imports, consider using the CSV upload feature instead
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ManualEntryPage;
