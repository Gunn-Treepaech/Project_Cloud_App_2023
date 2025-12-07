# API Error Handling & User Notification System

## 🔍 Overview

This application now includes a comprehensive API error handling and user notification system that provides clear feedback when API calls fail, network issues occur, or servers are unavailable.

## 🛡️ Error Handling Features

### 1. **Enhanced API Service (`apiService.js`)**

#### **Timeout Handling**
- 10-second timeout for all API requests
- Automatic request cancellation on timeout
- Clear timeout error messages in Thai

#### **HTTP Status Code Handling**
Specific error messages for different HTTP status codes:
- **400 Bad Request**: "ข้อมูลที่ส่งไม่ถูกต้อง กรุณาตรวจสอบข้อมูลอีกครั้ง"
- **401 Unauthorized**: "ไม่มีสิทธิ์เข้าถึงข้อมูล กรุณาติดต่อผู้ดูแลระบบ"
- **403 Forbidden**: "การเข้าถึงถูกปฏิเสธ กรุณาติดต่อผู้ดูแลระบบ"
- **404 Not Found**: "ไม่พบข้อมูลที่ต้องการ กรุณาลองใหม่อีกครั้ง"
- **500 Internal Server Error**: "เซิร์ฟเวอร์ขัดข้อง กรุณาลองใหม่ภายหลัง"
- **502 Bad Gateway**: "เซิร์ฟเวอร์ไม่พร้อมใช้งาน กรุณาลองใหม่ภายหลัง"
- **503 Service Unavailable**: "บริการชั่วคราวไม่พร้อมใช้งาน กรุณาลองใหม่ภายหลัง"

#### **Network Error Detection**
- Automatic detection of connection failures
- Network connectivity error messages
- Server availability checking

### 2. **Intelligent Error Alert System**

#### **Error Type Classification**
The system categorizes errors into different types with appropriate styling:

- **🔴 Network Errors**: Connection issues, server unavailable
- **🟡 Server Errors**: HTTP 5xx errors, server-side issues
- **🔵 Calculation Errors**: Issues with loan calculation requests
- **⚪ General Errors**: Other unexpected errors

#### **Visual Error Indicators**
- Color-coded alerts (red for critical, yellow for warnings, blue for info)
- Contextual icons for different error types
- Detailed error descriptions and user guidance

#### **Smart Retry Functionality**
- Automatic retry button for retryable errors
- Context-aware retry based on error type
- Clear success/error feedback

### 3. **Real-time API Status Monitor**

#### **ApiStatus Component**
- Continuous background API health checks (every 30 seconds)
- Visual indicator when server is offline
- Last check timestamp display
- Non-intrusive positioning in top-right corner

#### **Status States**
- **Loading**: Shows spinner while checking connection
- **Online**: Hidden (no notification needed)
- **Offline**: Red alert with server status

## 🎯 User Experience Improvements

### **Clear Error Messages**
All error messages are in Thai and provide:
- Specific problem description
- Suggested actions or solutions
- Contextual guidance

### **Error Recovery Options**
- **Retry Buttons**: For retryable operations
- **Auto-clear**: Success operations clear previous errors
- **Graceful Degradation**: App remains usable during partial outages

### **Visual Feedback**
- Loading states during API calls
- Progress indicators for long operations
- Success confirmation for completed actions

## 🔧 Implementation Details

### **Error Handling Flow**

1. **API Request Made** → Service layer with timeout and error catching
2. **Error Detected** → Categorized and formatted with user-friendly message
3. **Error Displayed** → Smart alert with contextual information
4. **User Action** → Retry option or manual intervention
5. **Success Recovery** → Error cleared and normal operation resumed

### **Component Integration**

```jsx
// In App.jsx
<ErrorAlert
    error={error}
    onRetry={() => handleRetry()}
    showRetry={isRetryableError}
/>
<ApiStatus /> {/* Automatic connection monitoring */}
```

### **API Service Usage**

```jsx
// Before: Basic fetch with minimal error handling
const response = await fetch(url, options);

// After: Enhanced service with comprehensive error handling
const data = await apiService.calculateLoan(payload);
// Automatically handles timeouts, network errors, and HTTP status codes
```

## 🚀 Error Scenarios Covered

### **Network Issues**
- Internet connection lost
- Server not reachable
- DNS resolution failures
- Request timeouts

### **Server Problems**
- Server crashes or restarts
- Database connection issues
- Internal server errors
- Service overload

### **Data Validation**
- Invalid API parameters
- Malformed request data
- Missing required fields
- Data type mismatches

### **Business Logic Errors**
- Invalid loan calculation parameters
- Bank data not found
- Calculation result validation failures

## 🔍 Debugging & Monitoring

### **Console Logging**
- Detailed error logging for developers
- Request/response debugging information
- Network status tracking

### **User-Facing Messages**
- Simplified error messages for end users
- Actionable guidance for common issues
- Context-appropriate suggestions

## 📱 Mobile & Accessibility

### **Responsive Design**
- Error alerts work on all screen sizes
- Touch-friendly retry buttons
- Readable text sizes

### **Accessibility**
- Proper ARIA labels for screen readers
- Keyboard navigation support
- High contrast error indicators

## 🛠️ Maintenance & Extensibility

### **Easy Error Message Updates**
- Centralized error message management
- Simple Thai translation system
- Consistent error formatting

### **Expandable Error Types**
- Easy addition of new error categories
- Custom error handling for specific endpoints
- Flexible retry logic implementation

This comprehensive error handling system ensures users are always informed about API issues and provides clear paths to resolution, significantly improving the user experience and reliability of the mortgage calculator application.