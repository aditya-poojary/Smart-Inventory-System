import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Upload,
  Package,
  TrendingUp,
  Activity,
  Menu,
  X,
  Edit,
  Sparkles,
} from "lucide-react";
import Dashboard from "./pages/Dashboard";
import IngestPage from "./pages/IngestPage";
import InventoryPage from "./pages/InventoryPage";
import ForecastsPage from "./pages/ForecastsPage";
import ManualEntryPage from "./pages/ManualEntryPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

type Page = "dashboard" | "ingest" | "manual-entry" | "inventory" | "forecasts";

interface NavItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { id: "ingest", label: "Upload CSV", icon: <Upload size={20} /> },
  { id: "manual-entry", label: "Manual Entry", icon: <Edit size={20} /> },
  { id: "inventory", label: "Inventory", icon: <Package size={20} /> },
  { id: "forecasts", label: "Forecasts", icon: <TrendingUp size={20} /> },
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
      case "inventory":
        return <InventoryPage />;
      case "forecasts":
        return <ForecastsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="glass-card sticky top-0 z-40 border-b border-border/50 rounded-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 gradient-bg rounded-lg blur-lg opacity-50" />
                    <div className="relative gradient-bg p-2 rounded-lg">
                      <Activity className="text-primary-foreground" size={24} />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                      Smart Inventory
                      <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium gradient-bg text-primary-foreground px-2 py-0.5 rounded-full">
                        <Sparkles size={10} />
                        AI
                      </span>
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      Demand Forecasting System
                    </p>
                  </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1 bg-secondary/50 p-1 rounded-xl">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id)}
                      className={`nav-item ${
                        currentPage === item.id
                          ? "nav-item-active"
                          : "nav-item-inactive"
                      }`}
                    >
                      {item.icon}
                      <span className="text-sm">{item.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-border/50 bg-card animate-slide-up">
                <nav className="px-4 py-3 space-y-1">
                  {navItems.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentPage(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full nav-item animate-fade-in ${
                        currentPage === item.id
                          ? "nav-item-active"
                          : "nav-item-inactive"
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
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
          <main className="min-h-[calc(100vh-8rem)]">{renderPage()}</main>

          {/* Footer */}
          <footer className="glass-card border-t border-border/50 py-6 rounded-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-sm text-muted-foreground">
                Smart Inventory System • Powered by{" "}
                <span className="gradient-text font-semibold">Boltic & AI</span>{" "}
                • Built for Hackathon 2025
              </p>
            </div>
          </footer>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
