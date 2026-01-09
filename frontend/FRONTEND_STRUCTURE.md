# Mortgage Calculator Frontend Documentation

## 📁 Professional Application Structure

This mortgage calculator application has been built following React best practices with a scalable, maintainable architecture suitable for production use.

### Directory Structure

```
frontend/src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (ErrorAlert, SummaryCard)
│   ├── charts/          # Chart components (PieChart)
│   ├── forms/           # Form components (InputForm)
│   ├── layout/          # Layout components (Header)
│   ├── tables/          # Table components (ScheduleTable)
│   └── index.js         # Centralized exports
├── hooks/               # Custom React hooks
│   ├── index.js
│   ├── useBankData.js
│   └── useLoanCalculation.js
├── services/            # API services
│   └── apiService.js    # Centralized API communication
├── constants/           # Application constants
│   └── index.js         # API URLs, Thai banks, UI config
├── utils/               # Utility functions
│   └── index.js         # Formatters, helpers
├── App.jsx              # Main application component
├── main.jsx             # Application entry point
└── ...
```

## 🏗️ Component Architecture

### Component Categories

#### 1. Layout Components (`/layout`)
- **Header.jsx** - Application header and navigation
- Purpose: Structural layout components that wrap main content

#### 2. Common Components (`/common`)
- **ErrorAlert.jsx** - Error message display
- **SummaryCard.jsx** - Financial summary cards
- Purpose: Reusable UI elements used across multiple screens

#### 3. Form Components (`/forms`)
- **InputForm.jsx** - Loan calculation input form
- Purpose: Form handling and user input management

#### 4. Chart Components (`/charts`)
- **PieChart.jsx** - Principal vs interest pie chart
- Purpose: Data visualization components

#### 5. Table Components (`/tables`)
- **ScheduleTable.jsx** - Payment schedule table
- Purpose: Tabular data display components

## 🎯 Key Improvements

### 1. **Separation of Concerns**
- Components are organized by functionality
- Clear separation between UI, business logic, and data management

### 2. **Centralized Configuration**
- `constants/index.js` - API endpoints, Thai banks, UI settings
- Easy to modify configuration without touching components

### 3. **Custom Hooks**
- `useBankData.js` - Bank data fetching logic
- `useLoanCalculation.js` - Loan calculation state management
- Reusable business logic extracted from components

### 4. **API Service Layer**
- `apiService.js` - Centralized HTTP client
- Consistent error handling and request formatting
- Easy to mock for testing

### 5. **Clean Imports**
- Index files provide clean import statements
- Barrel exports for better tree-shaking
- Simplified component imports

## 📦 Import Patterns

### Before (Scattered imports):
```javascript
import PieChart from './components/PieChart';
import SummaryCard from './components/SummaryCard';
import Header from './components/Header';
import InputForm from './components/InputForm';
```

### After (Organized imports):
```javascript
import {
  PieChart,
  SummaryCard,
  Header,
  InputForm,
  ScheduleTable,
  ErrorAlert
} from './components';
```

## 🔧 Usage Guidelines

### Adding New Components

1. **Choose the right category** based on component purpose
2. **Create in appropriate folder** (`common/`, `forms/`, `charts/`, `tables/`, `layout/`)
3. **Export from index.js** in the component folder
4. **Add to main components/index.js** for centralized exports

### Using Constants

```javascript
import { THAI_BANKS, API_CONFIG } from '../constants';

// Thai bank options
THAI_BANKS.map(bank => ({...}))

// API endpoints
API_CONFIG.ENDPOINTS.CALCULATE
```

### Custom Hooks

```javascript
import { useBankData } from '../hooks';

const { bankInfo, fetchBankData, isLoading } = useBankData();
```

### API Service

```javascript
import apiService from '../services/apiService';

const result = await apiService.calculateLoan(payload);
```

## 🎨 Benefits

1. **Maintainability**: Easy to find and modify components
2. **Scalability**: Clear structure for adding new features
3. **Reusability**: Common components easily shared
4. **Testing**: Isolated components are easier to test
5. **Team Collaboration**: Clear organization helps developers understand the codebase
6. **Performance**: Better tree-shaking and code splitting opportunities

## 🚀 Next Steps

1. **Add component documentation** using JSDoc
2. **Implement unit tests** for each component
3. **Add Storybook** for component development
4. **Consider TypeScript** migration for better type safety
5. **Implement error boundaries** for better error handling

This structure provides a solid foundation for scaling the mortgage calculator application with additional features while maintaining code quality and developer productivity.