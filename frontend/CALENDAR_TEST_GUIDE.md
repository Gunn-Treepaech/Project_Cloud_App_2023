# 🗓️ MUI DatePicker Calendar Test Guide

## 🚀 Quick Test Instructions

### 1. Open the Website
```
http://localhost:5175
```

### 2. Find Date Input Fields
Look for input fields that have:
- 📅 Date icon on the left
- Placeholder: "วัน/เดือน/ปี (เช่น: 15/12/2024)"
- Rounded corners with Material Design styling

### 3. Test Calendar Popup
1. **Click on the date input field**
2. **Expected:** A calendar popup should appear
3. **Check for:**
   - Month/Year header
   - Navigation arrows (◀ ▶)
   - Day grid with dates
   - Action buttons (Clear, Today)

### 4. Test Manual Input
1. **Click on the date input field**
2. **Type:** `22/12/2024`
3. **Press Enter or Tab**
4. **Expected:** Date should be accepted and formatted

## 🧪 Browser Console Test

### Step 1: Open Developer Tools
- Press `F12` or `Ctrl+Shift+I`
- Go to **Console** tab

### Step 2: Paste Test Script
Copy the content from `test-mui-calendar-final.js` and paste it into the console

### Step 3: Check Results
Look for these success indicators:
```
✅ MUI TextFields found: X
✅ Date inputs found: X
🎉 SUCCESS: Calendar popup appeared!
📅 Calendar popups after click: X
🎨 Calendar Features Check:
  Navigation buttons: X
  Clear buttons: X
  Today buttons: X
  Date cells available: X
```

## 🔍 What to Look For

### ✅ Success Indicators
- Input field with Material Design styling
- DateRange icon on the left
- Rounded corners (12px)
- Hover effects
- Calendar popup when clicked
- Month/Year navigation
- Clear, Today, Accept buttons

### ❌ Failure Indicators
- No calendar popup when clicked
- Regular HTML date input
- JavaScript errors in console
- "Failed to resolve import" errors

## 🎯 Expected Features

### Calendar Popup Features
- **Month/Year Header:** Shows current month and year
- **Navigation:** Arrows to change months
- **Date Grid:** Clickable dates
- **Action Buttons:** Clear, Today, Accept
- **Responsive:** Works on different screen sizes

### Input Field Features
- **Material Design:** Styled with MUI TextField
- **Icon:** DateRange icon on left
- **Placeholder:** "วัน/เดือน/ปี (เช่น: 15/12/2024)"
- **Format:** DD/MM/YYYY
- **Validation:** Proper date formatting

## 🔧 Troubleshooting

### If Calendar Doesn't Appear:
1. Check browser console for errors
2. Verify MUI components are loaded
3. Check if JavaScript is enabled
4. Try refreshing the page

### If Input Field Looks Wrong:
1. Check if MUI styles are loaded
2. Look for CSS errors in console
3. Verify dayjs library is loaded

### Common Console Errors:
- `Failed to resolve import "dayjs/locale/th"` → Expected, Thai locale not included
- `TypeError: Cannot read properties of null` → Check if components are rendered
- `Network error` → Check if server is running on localhost:5175

## 📊 Test Results

When the test runs successfully, you should see:
- MUI DatePicker component
- Calendar popup functionality
- Material Design styling
- Proper date input handling
- Working action buttons

## 🌐 Server Status

The application should be running on:
- **Local:** http://localhost:5175
- **Network:** http://192.168.1.106:5175 (if available)

**Note:** The server automatically switches ports if 5173/5174 are occupied.