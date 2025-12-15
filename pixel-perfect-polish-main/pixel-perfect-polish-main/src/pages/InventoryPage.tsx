import { useState } from "react";
import { 
  Search, 
  Filter, 
  Package, 
  AlertTriangle,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus
} from "lucide-react";

interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  reorderPoint: number;
  price: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
  lastUpdated: string;
}

const mockInventory: InventoryItem[] = [
  { id: 1, sku: "SKU-001234", name: "Widget Pro X1000", category: "Electronics", quantity: 150, reorderPoint: 50, price: 29.99, status: "in-stock", lastUpdated: "2 hours ago" },
  { id: 2, sku: "SKU-001235", name: "Sensor Module A", category: "Components", quantity: 12, reorderPoint: 25, price: 45.00, status: "low-stock", lastUpdated: "1 day ago" },
  { id: 3, sku: "SKU-001236", name: "Power Supply Unit", category: "Electronics", quantity: 78, reorderPoint: 30, price: 89.99, status: "in-stock", lastUpdated: "3 hours ago" },
  { id: 4, sku: "SKU-001237", name: "Cable Assembly B2", category: "Accessories", quantity: 0, reorderPoint: 20, price: 15.50, status: "out-of-stock", lastUpdated: "1 week ago" },
  { id: 5, sku: "SKU-001238", name: "Display Panel 4K", category: "Electronics", quantity: 45, reorderPoint: 15, price: 199.99, status: "in-stock", lastUpdated: "5 hours ago" },
  { id: 6, sku: "SKU-001239", name: "Mounting Bracket S", category: "Accessories", quantity: 234, reorderPoint: 50, price: 8.99, status: "in-stock", lastUpdated: "2 days ago" },
  { id: 7, sku: "SKU-001240", name: "Thermal Paste Pro", category: "Components", quantity: 18, reorderPoint: 30, price: 12.00, status: "low-stock", lastUpdated: "4 hours ago" },
  { id: 8, sku: "SKU-001241", name: "LED Strip RGB", category: "Electronics", quantity: 89, reorderPoint: 40, price: 24.99, status: "in-stock", lastUpdated: "6 hours ago" },
];

const categories = ["All", "Electronics", "Components", "Accessories", "Raw Materials"];

const InventoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredInventory = mockInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: InventoryItem["status"]) => {
    switch (status) {
      case "in-stock":
        return <span className="status-badge status-success">In Stock</span>;
      case "low-stock":
        return <span className="status-badge status-warning">Low Stock</span>;
      case "out-of-stock":
        return <span className="status-badge status-danger">Out of Stock</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
        <div>
          <h2 className="text-3xl font-bold text-foreground">Inventory</h2>
          <p className="text-muted-foreground mt-1">
            Manage and track your inventory items.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 gradient-bg text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-glow">
          <Plus size={20} />
          Add Item
        </button>
      </div>

      {/* Filters */}
      <div 
        className="mt-8 glass-card p-4 opacity-0 animate-slide-up"
        style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-11"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            <Filter size={18} className="text-muted-foreground flex-shrink-0" />
            {categories.map(category => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "gradient-bg text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Export */}
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors whitespace-nowrap">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div 
        className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 opacity-0 animate-slide-up"
        style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}
      >
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10">
            <Package className="text-primary" size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{mockInventory.length}</p>
            <p className="text-xs text-muted-foreground">Total Items</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-success/10">
            <Package className="text-success" size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {mockInventory.filter(i => i.status === "in-stock").length}
            </p>
            <p className="text-xs text-muted-foreground">In Stock</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-warning/10">
            <AlertTriangle className="text-warning" size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {mockInventory.filter(i => i.status === "low-stock").length}
            </p>
            <p className="text-xs text-muted-foreground">Low Stock</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-destructive/10">
            <Package className="text-destructive" size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {mockInventory.filter(i => i.status === "out-of-stock").length}
            </p>
            <p className="text-xs text-muted-foreground">Out of Stock</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div 
        className="mt-6 glass-card overflow-hidden opacity-0 animate-slide-up"
        style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
      >
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Status</th>
                <th>Updated</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInventory.map((item) => (
                <tr key={item.id} className="group">
                  <td className="font-medium text-foreground">{item.name}</td>
                  <td className="font-mono text-sm text-muted-foreground">{item.sku}</td>
                  <td className="text-muted-foreground">{item.category}</td>
                  <td>
                    <span className={item.quantity <= item.reorderPoint ? "text-warning font-medium" : "text-foreground"}>
                      {item.quantity}
                    </span>
                    <span className="text-muted-foreground text-xs ml-1">/ {item.reorderPoint}</span>
                  </td>
                  <td className="text-foreground">${item.price.toFixed(2)}</td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td className="text-muted-foreground text-sm">{item.lastUpdated}</td>
                  <td>
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredInventory.length)} of{" "}
              {filteredInventory.length} items
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    currentPage === page
                      ? "gradient-bg text-primary-foreground"
                      : "hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
