# 📝 Manual Sales Entry - Quick Guide

## What's New

A new **Manual Entry** page has been added to directly send sales data to your Boltic workflow!

---

## 🎯 How to Use

### Step 1: Navigate to Manual Entry

Click **"Manual Entry"** in the navigation bar

### Step 2: Fill in Sales Data

For each entry, provide:

- **Date** - Sales date (defaults to today)
- **Store ID** - Select from dropdown
- **SKU ID** - Select from dropdown
- **Units Sold** - Number of units

### Step 3: Add Multiple Entries (Optional)

Click **"+ Add Entry"** to add more rows

### Step 4: Send to Boltic

Click **"Send to Boltic"** button

---

## 📡 What Happens Behind the Scenes

### Payload Sent to Boltic:

```json
{
  "sales_data": [
    {
      "date": "2025-12-10",
      "store_id": "STORE_DELHI_NCR_01",
      "sku_id": "BEV-COC-750",
      "units_sold": 15
    }
  ],
  "source": "manual_entry",
  "timestamp": "2025-12-10T09:57:11.000Z"
}
```

### Boltic Endpoint:

```
POST https://asia-south1.workflow.boltic.app/d5ef14c1-6dff-4e31-b24f-d05eb570a8b4/newsales
```

### Headers:

```
Content-Type: application/json
```

---

## ✅ Features

### 1. **Form Validation**

- All fields are required
- Units must be greater than 0
- Date format validated

### 2. **Dropdown Options**

Pre-populated with:

- **Stores**: STORE_DELHI_NCR_01, STORE_MUMBAI_01, etc.
- **SKUs**: BEV-COC-750, SNK-LAYS-CLSC-52, etc.

### 3. **Multiple Entries**

- Add as many rows as needed
- Remove individual entries (minimum 1)
- All entries sent in single API call

### 4. **Success/Error Feedback**

- Green alert on success
- Red alert with error details on failure
- Form resets after successful submission

---

## 🔧 Technical Details

### Component Location

`src/pages/ManualEntryPage.tsx`

### Key Functions

#### `handleSubmit()`

```typescript
// Validates entries
// Sends POST request to Boltic
// Handles success/error states
// Resets form on success
```

#### Axios Call

```typescript
axios.post(
  BOLTIC_API_URL,
  {
    sales_data: validEntries,
    source: "manual_entry",
    timestamp: new Date().toISOString(),
  },
  {
    headers: { "Content-Type": "application/json" },
  }
);
```

---

## 🎨 UI Components Used

- **Form inputs** - Date picker, dropdowns, number input
- **Alert component** - Success/error messages
- **Icons** - Send, Plus, Trash2, CheckCircle (Lucide)
- **Responsive grid** - Works on mobile/desktop

---

## 📊 Example Usage

### Single Entry:

1. Select store: `STORE_MUMBAI_01`
2. Select SKU: `BEV-COC-750`
3. Enter units: `25`
4. Click Send

### Multiple Entries:

1. Fill first row
2. Click "+ Add Entry"
3. Fill second row
4. Click "+ Add Entry"
5. Fill third row
6. Click "Send to Boltic" → All 3 sent together

---

## 🐛 Troubleshooting

### "Please fill in at least one complete entry"

- Ensure all fields are filled
- Units must be > 0

### "Failed to send data: Network Error"

- Check internet connection
- Verify Boltic endpoint is accessible
- Check browser console for CORS errors

### CORS Issues (if any)

If you get CORS errors, the Boltic endpoint needs to allow requests from your domain. Contact Boltic support or add CORS headers to the workflow trigger.

---

## 🚀 Integration with Workflow

Once data is sent to Boltic:

1. **Boltic receives** the payload at the trigger endpoint
2. **Workflow A** processes the sales data
3. **Enrichment** with weather/holiday signals
4. **Forecasting** generates predictions
5. **Results** appear in Forecasts page

---

## 🎯 Best Practices

### For Testing:

- Start with 1-2 entries
- Verify success message
- Check Boltic workflow logs

### For Production:

- Validate data before sending
- Handle timeouts gracefully
- Log all API responses

---

## 🔗 Navigation Flow

```
Dashboard → Manual Entry → Fill Form → Send to Boltic
                ↓
        Workflow Triggers
                ↓
        Processing Complete
                ↓
        View in Forecasts
```

---

## 📝 Customization

### Change Endpoint URL:

Edit `ManualEntryPage.tsx`:

```typescript
const BOLTIC_API_URL = "your-new-endpoint-url";
```

### Add More Stores/SKUs:

Update the options arrays:

```typescript
const storeOptions = [
  "STORE_DELHI_NCR_01",
  "YOUR_NEW_STORE_01",
  // ... more stores
];
```

---

## ✅ Checklist Before Using

- [ ] Dev server running (`npm run dev`)
- [ ] Navigate to Manual Entry page
- [ ] Check Boltic endpoint is accessible
- [ ] Test with 1 entry first
- [ ] Verify success message
- [ ] Check Boltic workflow logs

---

## 🎉 Summary

You now have a **user-friendly form** to:

- ✅ Enter sales data manually
- ✅ Send directly to Boltic workflow trigger
- ✅ Handle multiple entries at once
- ✅ Get instant success/error feedback
- ✅ Seamlessly integrate with your existing workflow

Perfect for **testing**, **demos**, or **manual data entry** scenarios!
