# Smart Inventory System - React Frontend

AI-powered inventory management system with demand forecasting, built for the Boltic Hackathon 2025.

## 🚀 Features

### ✅ **Core Capabilities**

- **Real-time Dashboard** - Metrics, alerts, and workflow monitoring
- **CSV Upload & Ingestion** - Drag-and-drop sales data import with validation
- **Inventory Management** - Live stock tracking with inline editing
- **AI Demand Forecasting** - 7-day predictions with explainability
- **Purchase Order Generation** - Automatic replenishment recommendations
- **Workflow Monitoring** - Track Boltic workflow executions

### 🎯 **Key Selling Points for Judges**

1. **Explainable AI** - Shows WHY forecasts are made (avg sales, weather, promos, holidays)
2. **Beautiful UX** - Color-coded alerts, intuitive navigation, responsive design
3. **Mock Mode** - Works without backend for instant demos
4. **Real Integration** - Ready to connect to Boltic APIs

## 📁 Project Structure

```
src/
├── api/
│   └── boltic.ts           # API wrapper (mock + real)
├── components/
│   └── common/
│       ├── Modal.tsx
│       ├── Alert.tsx
│       └── Table.tsx
├── pages/
│   ├── Dashboard.tsx       # Metrics & overview
│   ├── IngestPage.tsx      # CSV upload
│   ├── InventoryPage.tsx   # Stock management
│   └── ForecastsPage.tsx   # AI predictions
├── utils/
│   └── mockData.ts         # Sample data
└── App.tsx                 # Main app with routing
```

## 🛠️ Tech Stack

- **React 18** + **TypeScript**
- **Vite** - Lightning-fast dev server
- **Tailwind CSS** - Utility-first styling
- **React Query** - Data fetching & caching
- **Recharts** - Beautiful charts
- **Papaparse** - CSV parsing
- **Lucide React** - Modern icons

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run in Development Mode (Mock Data)

```bash
npm run dev
```

Visit: `http://localhost:5173`

### 3. Connect to Real Boltic API

Edit `src/api/boltic.ts` and set `USE_MOCK = false`, then create `.env`:

```env
VITE_BOLTIC_BASE_URL=https://your-boltic-instance.com/api
VITE_BOLTIC_TOKEN=your_api_token
```

### 4. Build for Production

```bash
npm run build
npm run preview
```

## 📊 Demo Workflow

### For Hackathon Judges:

1. **Dashboard** - See live metrics (stores, SKUs, alerts)
2. **Upload Sales** - Drag `sales_history_200_rows.csv` → Preview → Upload
3. **Inventory** - View stock levels, edit inline (low stock highlighted)
4. **Forecasts** - See AI predictions with charts and reasoning
   - Click "Create Purchase Order" to generate replenishment
   - View explainability: avg sales, weather impact, promo boost

## 🎨 UI Highlights

### Color-Coded Alerts

- 🔴 **Red** - Critical (below safety stock)
- 🟡 **Amber** - Warning (close to safety stock)
- 🟢 **Green** - Safe

### Explainability Panel

Each forecast shows:

- Daily sales average
- Weekend boost %
- Promo active (Yes/No)
- Weather impact (Hot/Rainy/Cloudy)

### Responsive Design

- Desktop: Full sidebar navigation
- Mobile: Hamburger menu

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
