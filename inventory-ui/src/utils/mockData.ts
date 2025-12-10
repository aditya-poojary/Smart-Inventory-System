// Mock data from your existing JSON files
export const mockStores = [
  {
    store_id: "STORE_DELHI_NCR_01",
    store_name: "Delhi NCR Central Fresh Store",
    city: "Delhi NCR",
    region: "North",
  },
  {
    store_id: "STORE_JAIPUR_01",
    store_name: "Jaipur Pink City Fresh Store",
    city: "Jaipur",
    region: "North",
  },
  {
    store_id: "STORE_AHMEDABAD_01",
    store_name: "Ahmedabad City Fresh Store",
    city: "Ahmedabad",
    region: "West",
  },
  {
    store_id: "STORE_KOLKATA_01",
    store_name: "Kolkata Metro Fresh Store",
    city: "Kolkata",
    region: "East",
  },
  {
    store_id: "STORE_PUNE_01",
    store_name: "Pune City Fresh Store",
    city: "Pune",
    region: "West",
  },
  {
    store_id: "STORE_MUMBAI_01",
    store_name: "Mumbai Central Fresh Store",
    city: "Mumbai",
    region: "West",
  },
  {
    store_id: "STORE_THANE_01",
    store_name: "Thane Suburban Fresh Store",
    city: "Thane",
    region: "West",
  },
];

export const mockSKUs = [
  {
    sku_id: "BEV-COC-750",
    sku_name: "Coca-Cola Soft Drink PET Bottle 750ml",
    category: "Beverages",
    uom: "ml",
  },
  {
    sku_id: "BEV-COCZ-750",
    sku_name: "Coca-Cola Zero Sugar Soft Drink PET Bottle 750ml",
    category: "Beverages",
    uom: "ml",
  },
  {
    sku_id: "BEV-THUMSUP-750",
    sku_name: "Thums Up Soft Drink PET Bottle 750ml",
    category: "Beverages",
    uom: "ml",
  },
  {
    sku_id: "SNK-LAYS-CLSC-52",
    sku_name: "Lay's Potato Chips Classic Salted 52g Pouch",
    category: "Snacks",
    uom: "g",
  },
  {
    sku_id: "INST-MAGGI-MAS-70",
    sku_name: "MAGGI 2-Minute Masala Instant Noodles 70g Pouch",
    category: "Instant Foods",
    uom: "g",
  },
  {
    sku_id: "INST-MAGGI-SPC-70",
    sku_name: "MAGGI Special Masala Instant Noodles 70g Pouch",
    category: "Instant Foods",
    uom: "g",
  },
  {
    sku_id: "CONF-SILK-PLN-60",
    sku_name: "Cadbury Dairy Milk Silk Chocolate Bar 60g",
    category: "Confectionery",
    uom: "g",
  },
  {
    sku_id: "CONF-SILK-HAZ-58",
    sku_name: "Cadbury Dairy Milk Silk Hazelnut Chocolate Bar 58g",
    category: "Confectionery",
    uom: "g",
  },
];

export const mockInventory = [
  {
    store_id: "STORE_DELHI_NCR_01",
    sku_id: "BEV-COC-750",
    on_hand_qty: 84,
    safety_stock: 60,
    reorder_multiple: 12,
    vendor_email: "beverages-vendor@wholesale.com",
  },
  {
    store_id: "STORE_DELHI_NCR_01",
    sku_id: "BEV-COCZ-750",
    on_hand_qty: 48,
    safety_stock: 40,
    reorder_multiple: 12,
    vendor_email: "beverages-vendor@wholesale.com",
  },
  {
    store_id: "STORE_DELHI_NCR_01",
    sku_id: "SNK-LAYS-CLSC-52",
    on_hand_qty: 24,
    safety_stock: 30,
    reorder_multiple: 24,
    vendor_email: "snacks-vendor@wholesale.com",
  },
  {
    store_id: "STORE_MUMBAI_01",
    sku_id: "BEV-COC-750",
    on_hand_qty: 156,
    safety_stock: 80,
    reorder_multiple: 12,
    vendor_email: "beverages-vendor@wholesale.com",
  },
  {
    store_id: "STORE_MUMBAI_01",
    sku_id: "CONF-SILK-PLN-60",
    on_hand_qty: 35,
    safety_stock: 40,
    reorder_multiple: 24,
    vendor_email: "confectionery-vendor@wholesale.com",
  },
];

export const mockSalesHistory = [
  {
    date: "2025-11-25",
    store_id: "STORE_DELHI_NCR_01",
    sku_id: "BEV-COC-750",
    units_sold: 3,
  },
  {
    date: "2025-11-26",
    store_id: "STORE_DELHI_NCR_01",
    sku_id: "BEV-COC-750",
    units_sold: 5,
  },
  {
    date: "2025-11-27",
    store_id: "STORE_DELHI_NCR_01",
    sku_id: "BEV-COC-750",
    units_sold: 8,
  },
];

export const mockForecasts = [
  {
    run_ts: "2025-12-09T10:00:00Z",
    store_id: "STORE_DELHI_NCR_01",
    sku_id: "SNK-LAYS-CLSC-52",
    forecast_horizon_days: 7,
    recommended_order_qty: 48,
    daily_forecast: [
      { day: "Mon", units: 6 },
      { day: "Tue", units: 7 },
      { day: "Wed", units: 8 },
      { day: "Thu", units: 7 },
      { day: "Fri", units: 9 },
      { day: "Sat", units: 12 },
      { day: "Sun", units: 10 },
    ],
    reasoning: {
      avg_daily_sales: 7,
      weekend_boost: 1.3,
      promo_active: false,
      weather_impact: "neutral",
    },
  },
  {
    run_ts: "2025-12-09T10:00:00Z",
    store_id: "STORE_MUMBAI_01",
    sku_id: "CONF-SILK-PLN-60",
    forecast_horizon_days: 7,
    recommended_order_qty: 24,
    daily_forecast: [
      { day: "Mon", units: 3 },
      { day: "Tue", units: 4 },
      { day: "Wed", units: 4 },
      { day: "Thu", units: 3 },
      { day: "Fri", units: 5 },
      { day: "Sat", units: 6 },
      { day: "Sun", units: 5 },
    ],
    reasoning: {
      avg_daily_sales: 4,
      weekend_boost: 1.4,
      promo_active: false,
      weather_impact: "hot",
    },
  },
];

export const mockWorkflowRuns = [
  {
    run_id: "run_20251209_001",
    workflow_slug: "A_sales_signals_sync",
    status: "succeeded",
    started_at: "2025-12-09T01:00:00Z",
    completed_at: "2025-12-09T01:02:34Z",
    duration_ms: 154000,
    nodes_executed: 8,
    rows_processed: 200,
  },
  {
    run_id: "run_20251208_001",
    workflow_slug: "A_sales_signals_sync",
    status: "succeeded",
    started_at: "2025-12-08T01:00:00Z",
    completed_at: "2025-12-08T01:02:12Z",
    duration_ms: 132000,
    nodes_executed: 8,
    rows_processed: 195,
  },
  {
    run_id: "run_20251207_001",
    workflow_slug: "A_sales_signals_sync",
    status: "failed",
    started_at: "2025-12-07T01:00:00Z",
    completed_at: "2025-12-07T01:01:45Z",
    duration_ms: 105000,
    nodes_executed: 5,
    error: "Weather API timeout",
  },
];

export const mockReplenishmentActions = [
  {
    action_ts: "2025-12-09T10:05:00Z",
    store_id: "STORE_DELHI_NCR_01",
    sku_id: "SNK-LAYS-CLSC-52",
    action_type: "order_request",
    status: "generated",
    details: {
      order_qty: 48,
      vendor: "snacks-vendor@wholesale.com",
      reason: "Below safety stock",
    },
  },
  {
    action_ts: "2025-12-09T10:05:30Z",
    store_id: "STORE_MUMBAI_01",
    sku_id: "CONF-SILK-PLN-60",
    action_type: "email",
    status: "sent",
    details: {
      order_qty: 24,
      vendor: "confectionery-vendor@wholesale.com",
      email_sent_at: "2025-12-09T10:06:00Z",
    },
  },
];

export const mockExternalSignals = [
  {
    date: "2025-12-09",
    store_id: "STORE_DELHI_NCR_01",
    weather_code: "CLOUDY",
    is_holiday: 0,
    promotion_flag: 0,
  },
  {
    date: "2025-12-09",
    store_id: "STORE_MUMBAI_01",
    weather_code: "HOT",
    is_holiday: 0,
    promotion_flag: 1,
  },
];
