import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Upload,
  // Package,
  // TrendingUp,
  Activity,
  Menu,
  X,
  Edit,
} from "lucide-react";
import Dashboard from "./pages/Dashboard";
import IngestPage from "./pages/IngestPage";
// import InventoryPage from "./pages/InventoryPage";
// import ForecastsPage from "./pages/ForecastsPage";
import ManualEntryPage from "./pages/ManualEntryPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

type Page = "dashboard" | "ingest" | "manual-entry"; // | "inventory" | "forecasts";

interface NavItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { id: "ingest", label: "Upload CSV", icon: <Upload size={20} /> },
  { id: "manual-entry", label: "Manual Entry", icon: <Edit size={20} /> },
  // { id: "inventory", label: "Inventory", icon: <Package size={20} /> },
  // { id: "forecasts", label: "Forecasts", icon: <TrendingUp size={20} /> },
];

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "ingest":
        return <IngestPage />;
      case "manual-entry":
        return <ManualEntryPage />;
      // case "inventory":
      //   return <InventoryPage />;
      // case "forecasts":
      //   return <ForecastsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Activity className="text-primary-600" size={32} />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Smart Inventory System
                  </h1>
                  <p className="text-xs text-gray-500">
                    AI-Powered Demand Forecasting
                  </p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      currentPage === item.id
                        ? "bg-primary-100 text-primary-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <nav className="px-4 py-2 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                      currentPage === item.id
                        ? "bg-primary-100 text-primary-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-4rem)]">{renderPage()}</main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
            Smart Inventory System • Powered by Boltic & AI • Built for
            Hackathon 2025
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

export default App;
