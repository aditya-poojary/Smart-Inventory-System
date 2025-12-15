import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  ShoppingCart,
  BarChart3,
  Zap
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  delay?: number;
}

const StatCard = ({ title, value, change, changeType, icon, delay = 0 }: StatCardProps) => (
  <div 
    className="stat-card opacity-0 animate-slide-up"
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
        <div className="flex items-center gap-1 mt-2">
          {changeType === "positive" ? (
            <ArrowUpRight className="text-success" size={16} />
          ) : changeType === "negative" ? (
            <ArrowDownRight className="text-destructive" size={16} />
          ) : null}
          <span
            className={`text-sm font-medium ${
              changeType === "positive"
                ? "text-success"
                : changeType === "negative"
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          >
            {change}
          </span>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      </div>
      <div className="p-3 rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
    </div>
  </div>
);

interface ActivityItem {
  id: number;
  action: string;
  item: string;
  time: string;
  type: "add" | "update" | "alert" | "forecast";
}

const recentActivity: ActivityItem[] = [
  { id: 1, action: "Stock added", item: "Widget Pro X1000", time: "2 min ago", type: "add" },
  { id: 2, action: "Low stock alert", item: "Sensor Module A", time: "15 min ago", type: "alert" },
  { id: 3, action: "Forecast updated", item: "Q1 2025 Projections", time: "1 hour ago", type: "forecast" },
  { id: 4, action: "Inventory updated", item: "Power Supply Unit", time: "2 hours ago", type: "update" },
  { id: 5, action: "Stock added", item: "Cable Assembly B2", time: "3 hours ago", type: "add" },
];

const topProducts = [
  { name: "Widget Pro X1000", sold: 1234, revenue: "$45,600", trend: "+12%" },
  { name: "Sensor Module A", sold: 987, revenue: "$32,100", trend: "+8%" },
  { name: "Power Supply Unit", sold: 756, revenue: "$28,400", trend: "+5%" },
  { name: "Cable Assembly B2", sold: 543, revenue: "$15,200", trend: "-2%" },
];

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
        <h2 className="text-3xl font-bold text-foreground">
          Welcome back 👋
        </h2>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your inventory today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Products"
          value="2,847"
          change="+12.5%"
          changeType="positive"
          icon={<Package size={24} />}
          delay={100}
        />
        <StatCard
          title="Revenue"
          value="$124,500"
          change="+8.2%"
          changeType="positive"
          icon={<DollarSign size={24} />}
          delay={200}
        />
        <StatCard
          title="Forecast Accuracy"
          value="94.7%"
          change="+2.1%"
          changeType="positive"
          icon={<TrendingUp size={24} />}
          delay={300}
        />
        <StatCard
          title="Low Stock Alerts"
          value="12"
          change="+3"
          changeType="negative"
          icon={<AlertTriangle size={24} />}
          delay={400}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <div 
          className="lg:col-span-2 glass-card p-6 opacity-0 animate-slide-up"
          style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg gradient-bg">
              <Zap className="text-primary-foreground" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">AI Insights</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-success/10 border border-success/20">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-success/20">
                  <TrendingUp className="text-success" size={16} />
                </div>
                <div>
                  <p className="font-medium text-foreground">Demand Surge Predicted</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Widget Pro X1000 expected to see 35% increase in demand next month. Consider increasing safety stock.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-warning/20">
                  <AlertTriangle className="text-warning" size={16} />
                </div>
                <div>
                  <p className="font-medium text-foreground">Stockout Risk</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sensor Module A may run out in 5 days at current consumption rate. Reorder recommended.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-primary/20">
                  <BarChart3 className="text-primary" size={16} />
                </div>
                <div>
                  <p className="font-medium text-foreground">Optimization Opportunity</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Reducing safety stock on slow-moving items could free up $12,400 in working capital.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div 
          className="glass-card p-6 opacity-0 animate-slide-up"
          style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-secondary">
              <Clock className="text-muted-foreground" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`p-1.5 rounded-lg ${
                  activity.type === "add" ? "bg-success/15" :
                  activity.type === "alert" ? "bg-warning/15" :
                  activity.type === "forecast" ? "bg-primary/15" :
                  "bg-secondary"
                }`}>
                  {activity.type === "add" ? <Package className="text-success" size={14} /> :
                   activity.type === "alert" ? <AlertTriangle className="text-warning" size={14} /> :
                   activity.type === "forecast" ? <TrendingUp className="text-primary" size={14} /> :
                   <ShoppingCart className="text-muted-foreground" size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{activity.action}</p>
                  <p className="text-xs text-muted-foreground truncate">{activity.item}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div 
        className="mt-6 glass-card p-6 opacity-0 animate-slide-up"
        style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-accent/10">
              <ShoppingCart className="text-accent" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Top Products</h3>
          </div>
          <button className="text-sm text-primary font-medium hover:underline">
            View all
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Units Sold</th>
                <th>Revenue</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={index}>
                  <td className="font-medium text-foreground">{product.name}</td>
                  <td className="text-muted-foreground">{product.sold.toLocaleString()}</td>
                  <td className="text-foreground">{product.revenue}</td>
                  <td>
                    <span className={`status-badge ${
                      product.trend.startsWith("+") ? "status-success" : "status-danger"
                    }`}>
                      {product.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
