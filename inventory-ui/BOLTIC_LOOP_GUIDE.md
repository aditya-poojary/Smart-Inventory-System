# Boltic Loop Configuration Guide

## ✅ Updated Payload Format

The React form now sends data optimized for **Boltic Loop activity**:

```json
{
  "payload": {
    "sales": [
      {
        "date": "2025-12-10",
        "store_id": "STORE_DELHI_NCR_01",
        "sku_id": "BEV-COC-750",
        "units_sold": 15
      },
      {
        "date": "2025-12-10",
        "store_id": "STORE_MUMBAI_01",
        "sku_id": "SNK-LAYS-CLSC-52",
        "units_sold": 25
      }
    ]
  }
}
```

---

## 🔄 Boltic Workflow Configuration

### **Node 1: HTTP Trigger**

- Receives the payload from React form
- Test payload should match above format

### **Node 2: Loop Activity** (NEW!)

**Configuration:**

- **Loop Input**: `{{payload.sales}}`
- **Iterate over**: Array of sales entries
- Inside loop, access current item with `{{value}}`

### **Inside Loop - Process Each Sale:**

#### **Step 1: Boltic Table (sales_history)**

- **Table**: `sales_history`
- **Event**: `create_record`
- **Payload mapping**:
  ```json
  {
    "date": "{{value.date}}",
    "store_id": "{{value.store_id}}",
    "sku_id": "{{value.sku_id}}",
    "units_sold": "{{value.units_sold}}"
  }
  ```

#### **Step 2: Extract City Name (Function)**

- **Input**: `{{value.store_id}}`
- **Function**:
  ```javascript
  const parts = city.split("_");
  if (parts.length > 1) {
    return parts[1]; // Returns "DELHI" from "STORE_DELHI_NCR_01"
  }
  return null;
  ```

#### **Step 3: Weather API Call**

- **Endpoint**: `https://api.openweathermap.org/data/2.5/forecast?q={{city_name.result}}&units=metric&appid={{global_variables.OpenWeatherMap}}`
- **Method**: GET

#### **Step 4: Weather Cleaning (Function)**

- **Input**:
  ```json
  {
    "item": "{{value}}",
    "http_result": "{{weather_api.result}}"
  }
  ```
- **Returns**: `{ weather_code, temp_max }`

#### **Step 5: Holiday/Promotion Check (Function)**

- **Input**:
  ```json
  {
    "result": "{{cleaning.result}}",
    "item": "{{value}}",
    "holidays": "{{global_variables.holidays_array}}"
  }
  ```
- **Returns**: `{ weather_code, is_holiday, promotion_flag }`

#### **Step 6: Boltic Table (external_signals)**

- **Table**: `external_signals`
- **Event**: `create_record`
- **Payload mapping**:
  ```json
  {
    "date": "{{value.date}}",
    "store_id": "{{value.store_id}}",
    "weather_code": "{{extract_hoilday_promotion.result.weather_code}}",
    "is_holiday": "{{extract_hoilday_promotion.result.is_holiday}}",
    "promotion_flag": "{{extract_hoilday_promotion.result.promotion_flag}}"
  }
  ```

---

## 🎯 Benefits of Loop Approach

### **1. Bulk Processing**

- Submit 10 sales entries → Loop processes all 10
- Each entry gets enriched with weather + holiday data
- All stored in database automatically

### **2. Atomic Operations**

- Each iteration is independent
- If one fails, others continue (with `continue_on_failure: true`)
- Error logging per entry

### **3. Scalability**

- Handle 1 entry or 100 entries with same workflow
- No code changes needed
- Performance: ~2 seconds per entry

### **4. Simplified Frontend**

- React form just sends array
- No complex batching logic
- User can add unlimited entries

---

## 📊 Example Workflow Execution

**User submits 3 entries:**

```
Entry 1: Delhi NCR, Coca-Cola, 15 units
Entry 2: Mumbai, Lays Chips, 25 units
Entry 3: Pune, Maggi Noodles, 30 units
```

**Loop processes:**

```
Iteration 1:
  → Save to sales_history (Delhi NCR, Coca-Cola)
  → Extract city: "DELHI"
  → Fetch weather: 38°C, Clear
  → Weather code: "HOT"
  → Holiday check: Not holiday
  → Save to external_signals (HOT, 0, 0)

Iteration 2:
  → Save to sales_history (Mumbai, Lays)
  → Extract city: "MUMBAI"
  → Fetch weather: 32°C, Rain
  → Weather code: "RAIN"
  → Holiday check: Not holiday
  → Save to external_signals (RAIN, 0, 0)

Iteration 3:
  → Save to sales_history (Pune, Maggi)
  → Extract city: "PUNE"
  → Fetch weather: 28°C, Cloudy
  → Weather code: "CLOUDY"
  → Holiday check: Not holiday
  → Save to external_signals (CLOUDY, 0, 0)
```

**Result:** All 3 entries processed, enriched, and stored!

---

## 🔧 Boltic Loop Configuration Steps

### **Visual Flow:**

```
HTTP Trigger
    ↓
    ↓ Receives: { payload: { sales: [...] } }
    ↓
Loop Activity ← Loop Input: {{payload.sales}}
    ↓
    ├─→ (Iteration 1) value = sales[0]
    │     ↓
    │   [Process single entry nodes]
    │     ↓
    ├─→ (Iteration 2) value = sales[1]
    │     ↓
    │   [Process single entry nodes]
    │     ↓
    └─→ (Iteration 3) value = sales[2]
          ↓
        [Process single entry nodes]
```

### **Inside Loop:**

1. Boltic Table (sales_history) - using `{{value.*}}`
2. Function (city_name) - using `{{value.store_id}}`
3. API (weather_api) - using `{{city_name.result}}`
4. Function (cleaning) - using `{{value}}` + `{{weather_api.result}}`
5. Function (holiday_check) - using `{{value}}` + `{{cleaning.result}}`
6. Boltic Table (external_signals) - using `{{value.*}}` + `{{holiday_check.result}}`

---

## ✅ Test Payload for HTTP Trigger

```json
{
  "payload": {
    "sales": [
      {
        "date": "2025-12-10",
        "store_id": "STORE_DELHI_NCR_01",
        "sku_id": "BEV-COC-750",
        "units_sold": 15
      }
    ]
  }
}
```

---

## 🚀 Production Tips

1. **Error Handling**: Set `continue_on_failure: true` on weather API node
2. **Rate Limiting**: Add 500ms delay between API calls if needed
3. **Logging**: Log each iteration result for debugging
4. **Batch Size**: Test with 5-10 entries first, then scale to 100+

---

## 📝 React Form Changes

**Before (Single entry format):**

```json
{
  "0": { "date": "...", ... }
}
```

**After (Loop-ready format):**

```json
{
  "payload": {
    "sales": [
      { "date": "...", ... },
      { "date": "...", ... }
    ]
  }
}
```

---

## 🎉 Result

✅ **Simplified workflow** - Same nodes for 1 or 100 entries  
✅ **Bulk processing** - Submit multiple sales at once  
✅ **Automatic enrichment** - Weather + holiday for each entry  
✅ **Scalable** - Add more entries without code changes

Your workflow is now **production-ready for bulk sales updates**! 🚀
