import { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown,
  Sparkles,
  Calendar,
  Package,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  LineChart as LineChartIcon
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const forecastData = [
  { month: "Jan", actual: 4000, predicted: 4200 },
  { month: "Feb", actual: 3800, predicted: 4000 },
  { month: "Mar", actual: 5200, predicted: 5000 },
  { month: "Apr", actual: 4800, predicted: 4900 },
  { month: "May", actual: 5500, predicted: 5400 },
  { month: "Jun", actual: 6000, predicted: 5800 },
  { month: "Jul", actual: null, predicted: 6200 },
  { month: "Aug", actual: null, predicted: 6500 },
  { month: "Sep", actual: null, predicted: 6800 },
];

const productForecasts = [
  { 
    name: "Widget Pro X1000", 
    currentStock: 150, 
    predictedDemand: 245, 
    daysUntilStockout: 18,
    trend: "up" as const,
    confidence: 94
  },
  { 
    name: "Sensor Module A", 
    currentStock: 12, 
    predictedDemand: 45, 
    daysUntilStockout: 5,
    trend: "critical" as const,
    confidence: 89
  },
  { 
    name: "Power Supply Unit", 
    currentStock: 78, 
    predictedDemand: 35, 
    daysUntilStockout: 67,
    trend: "stable" as const,
    confidence: 91
  },
  { 
    name: "Display Panel 4K", 
    currentStock: 45, 
    predictedDemand: 60, 
    daysUntilStockout: 22,
    trend: "up" as const,
    confidence: 87
  },
];

const timeRanges = ["7 Days", "30 Days", "90 Days", "1 Year"];

const ForecastsPage = () => {
  const [selectedRange, setSelectedRange] = useState("30 Days");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            Forecasts
            <span className="inline-flex items-center gap-1.5 text-sm font-medium gradient-bg text-primary-foreground px-3 py-1 rounded-full">
              <Sparkles size={14} />
              AI-Powered
            </span>
          </h2>
          <p className="text-muted-foreground mt-1">
            Demand predictions and inventory recommendations.
          </p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl">
          {timeRanges.map(range => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedRange === range
                  ? "gradient-bg text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Forecast Chart */}
      <div 
        className="mt-8 glass-card p-6 opacity-0 animate-slide-up"
        style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg gradient-bg">
              <LineChartIcon className="text-primary-foreground" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Demand Forecast</h3>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-muted-foreground">Predicted</span>
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(173, 80%, 40%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(173, 80%, 40%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(220, 9%, 46%)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(220, 9%, 46%)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(220, 13%, 91%)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                }}
                labelStyle={{ color: 'hsl(222, 47%, 11%)', fontWeight: 600 }}
              />
              <Area 
                type="monotone" 
                dataKey="actual" 
                stroke="hsl(221, 83%, 53%)" 
                strokeWidth={2}
                fill="url(#colorActual)"
                dot={{ fill: 'hsl(221, 83%, 53%)', strokeWidth: 2, r: 4 }}
              />
              <Area 
                type="monotone" 
                dataKey="predicted" 
                stroke="hsl(173, 80%, 40%)" 
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="url(#colorPredicted)"
                dot={{ fill: 'hsl(173, 80%, 40%)', strokeWidth: 2, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics */}
      <div 
        className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-0 animate-slide-up"
        style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
      >
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-success/10">
              <TrendingUp className="text-success" size={20} />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Forecast Accuracy</span>
          </div>
          <p className="text-4xl font-bold text-foreground">94.7%</p>
          <p className="text-sm text-success mt-2 flex items-center gap-1">
            <TrendingUp size={14} />
            +2.1% from last month
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-warning/10">
              <Calendar className="text-warning" size={20} />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Avg. Lead Time</span>
          </div>
          <p className="text-4xl font-bold text-foreground">12 days</p>
          <p className="text-sm text-muted-foreground mt-2">
            Across all suppliers
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="text-primary" size={20} />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Expected Demand</span>
          </div>
          <p className="text-4xl font-bold text-foreground">+18%</p>
          <p className="text-sm text-muted-foreground mt-2">
            Next 30 days vs. current
          </p>
        </div>
      </div>

      {/* Product Forecasts */}
      <div 
        className="mt-6 glass-card p-6 opacity-0 animate-slide-up"
        style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-accent/10">
              <Package className="text-accent" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Product-Level Forecasts</h3>
          </div>
          <button className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {productForecasts.map((product, index) => (
            <div 
              key={index}
              className={`p-5 rounded-xl border transition-all hover:shadow-md ${
                product.trend === "critical" 
                  ? "bg-destructive/5 border-destructive/20" 
                  : "bg-secondary/50 border-border/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">{product.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.currentStock} in stock • {product.predictedDemand} predicted demand
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${
                  product.trend === "up" ? "bg-success/15" :
                  product.trend === "critical" ? "bg-destructive/15" :
                  "bg-muted"
                }`}>
                  {product.trend === "up" ? <TrendingUp className="text-success" size={18} /> :
                   product.trend === "critical" ? <AlertTriangle className="text-destructive" size={18} /> :
                   <CheckCircle className="text-muted-foreground" size={18} />}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Days until stockout</p>
                    <p className={`text-lg font-bold ${
                      product.daysUntilStockout < 10 ? "text-destructive" :
                      product.daysUntilStockout < 30 ? "text-warning" :
                      "text-foreground"
                    }`}>
                      {product.daysUntilStockout} days
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">AI Confidence</p>
                    <p className="text-lg font-bold text-foreground">{product.confidence}%</p>
                  </div>
                </div>

                <button className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div 
        className="mt-6 glass-card p-6 opacity-0 animate-slide-up"
        style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg gradient-bg">
            <Sparkles className="text-primary-foreground" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-foreground">AI Recommendations</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
            <div className="flex items-center gap-2 text-destructive font-medium">
              <AlertTriangle size={16} />
              Urgent Reorder Required
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              <span className="font-medium text-foreground">Sensor Module A</span> will run out in 5 days. 
              Recommended order quantity: <span className="font-mono text-foreground">150 units</span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
            <div className="flex items-center gap-2 text-warning font-medium">
              <TrendingUp size={16} />
              Demand Surge Expected
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              <span className="font-medium text-foreground">Widget Pro X1000</span> demand expected to increase 35% next month. 
              Consider increasing safety stock.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="flex items-center gap-2 text-success font-medium">
              <CheckCircle size={16} />
              Overstock Alert
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              <span className="font-medium text-foreground">Mounting Bracket S</span> has 234 units vs 50 reorder point. 
              Consider reducing next order or running promotion.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 text-primary font-medium">
              <BarChart3 size={16} />
              Seasonal Pattern Detected
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Historical data shows 25% demand increase in Q4 for electronics category. 
              Plan inventory buildup by September.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastsPage;
