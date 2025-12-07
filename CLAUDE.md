# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a professional Thai mortgage loan calculator web application called "Mortgage Calculator Pro" (เครื่องมือคำนวณสินเชื่อบ้าน). It features a microservices architecture with Flask backend, React frontend, and MySQL database, designed for calculating loan payment schedules with dynamic interest rates and financial planning.

## Development Commands

### Docker Development (Recommended)
```bash
# Full stack deployment
docker-compose up -d --build

# Development mode with logs
docker-compose up --build

# Check services
docker container ls
docker network ls
docker volume ls

# Stop services
docker-compose down
```

### Manual Development
```bash
# Backend (Flask)
cd backend/app
pip install -r requirements.txt
python app.py  # Runs on 0.0.0.0:5000

# Frontend (React)
cd frontend
npm install
npm run dev    # Runs on localhost:5173

# Database (MySQL)
# Runs on port 32000 via docker-compose
```

### Frontend Development
```bash
cd frontend
npm install       # Install dependencies (includes @mui/material, @mui/icons-material, sweetalert2)
npm run dev      # Start development server with hot reload (runs on :5173 or :5174 if 5173 occupied)
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint checks
```

### Critical Dependencies
The frontend requires these specific packages for the multi-bank comparison UI:
- `@mui/material` - Material-UI components for beautiful selects
- `@mui/icons-material` - Material-UI icons (ExpandMore, AccountBalance, DateRange, etc.)
- `sweetalert2` - Modal dialogs and loading states

### Backend Development
```bash
cd backend/app
pip install -r requirements.txt
python app.py
```

## Architecture Overview

The application follows a **microservices architecture** with three main components organized in the current directory structure:

### Backend (Flask)
- **Location**: `backend/app/`
- **Framework**: Flask 2.3.2 with Flask-Cors
- **Database**: MySQL 8.3.0 with mysql-connector-python
- **Architecture**: Object-oriented design with separate classes
- **Key Files**:
  - `backend/app/app.py` - Main Flask application with API endpoints
  - `backend/app/database_manager.py` - Database operations and connection management
  - `backend/app/loan_calculator.py` - Loan calculation logic with Decimal precision
  - `backend/app/utils.py` - Utility functions
  - `backend/requirements.txt` - Python dependencies

### Frontend (React)
- **Location**: `frontend/`
- **Framework**: React 19.2.0 with Vite (rolldown-vite)
- **Styling**: Tailwind CSS 3.4.4 + DaisyUI 5.5.3
- **Key Features**: Custom components, charts, Thai localization
- **Entry Point**: `frontend/src/main.jsx`
- **Main Component**: `frontend/src/App.jsx` - Centralized state management
- **Component Architecture**:
  - `InputForm.jsx` - Loan parameter inputs
  - `ScheduleTable.jsx` - Payment schedule display
  - `PieChart.jsx` - Principal vs interest visualization
  - `SummaryCard.jsx` - Financial summary
  - `Header.jsx` - Application header
  - `ErrorAlert.jsx` - Error handling

### Database (MySQL)
- **Location**: `database/`
- **Schema**: `database/init.sql`
- **Database**: `financial_data`
- **Table**: `interest_rates` with Thai bank MRR data (SCB, UOB, KTB, Kbank)
- **Port**: 32000 (exposed from Docker container)

## API Endpoints

1. **`GET /`** - Welcome message
2. **`POST /api/calculate`** - Calculate loan schedule with dynamic interest rates
3. **`GET /api/showdatadb`** - Retrieve all bank interest rates
4. **`POST /api/insertdata`** - Insert/update bank MRR data
5. **`POST /api/addcolumn`** - Dynamically add table columns to interest_rates
6. **`GET /api/bank-info?bank=BANKNAME`** - Get specific bank info (Thai bank names)

## Key Development Patterns

### Backend Patterns
- **Object-Oriented Architecture**: Separated concerns with dedicated classes:
  - `DatabaseManager` - Centralized DB operations with connection handling
  - `LoanCalculator` - Complex financial calculations using Decimal precision
- **Database Manager**: Centralized connection handling with error management
- **Financial Precision**: Uses Python Decimal module for accurate loan calculations
- **SQL Injection Protection**: Parameterized queries and input validation
- **CORS Enabled**: Cross-origin requests from frontend
- **Thai Banking Integration**: Supports MRR (Minimum Retail Rate) system

### Frontend Patterns
- **Centralized State Management**: `App.jsx` manages global application state with multi-bank arrays
- **Component Composition**: Functional components with clear separation of concerns
- **API Service Layer**: Centralized API communication with comprehensive error handling (10s timeout, HTTP status codes)
- **Thai Localization**: Buddhist era date conversion and Thai language support
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS 3.4.4 + DaisyUI 5.5.3
- **Modern React**: Uses React 19.2.0 with hooks, strict mode, and Vite (rolldown-vite) build system
- **Multi-Bank Architecture**: Supports up to 4 simultaneous bank comparisons with shared inputs
- **Custom Input Components**: AppInput, AppSelect, AppDate with hideSuffix functionality

### Data Flow Architecture
1. User inputs loan parameters in React frontend (loan amount, payment, bank selection)
2. Data validated and sent to Flask `/api/calculate` endpoint as JSON
3. Flask uses `LoanCalculator` class for complex financial calculations with Decimal precision
4. Results formatted and displayed in React components with charts and tables
5. Payment schedule supports dynamic interest rates (fixed period + variable MRR-based rates)

## Important Configuration

### Environment Variables & Configuration
- Frontend: `API_BASE_URL` configured in `frontend/src/constants/index.js` (currently: `http://192.168.1.126:5000`)
- Backend: Database connection parameters in `app.py` (host: 'db', port: 3306)
- Input Suffix Handling: All numeric inputs support ".shsojvp" suffix for processing (hidden from UI)

### Port Configuration
- Frontend: 5173 (development), auto-switches to 5174 if port occupied
- Backend: 5000
- Database: 32000 (external access), 3306 (internal Docker network)

### Immediate Issues to Address
- **Missing Dependency**: Must install `@mui/icons-material` package for BeautifulSelect component
- **API Connection**: Frontend configured to connect to `http://192.168.1.126:5000` - verify backend availability

## Special Features

1. **Dynamic Interest Rates**: Supports changing interest rates based on fixed years plus MRR-based calculations
2. **Thai Bank Integration**: Real Thai bank data with MRR (Minimum Retail Rate) from major banks (SCB, UOB, KTB, Kbank)
3. **Flexible Database Schema**: Dynamic column addition via `/api/addcolumn` endpoint
4. **Financial Accuracy**: Decimal-based calculations for precise loan computations
5. **Responsive Design**: Mobile-friendly UI with Tailwind CSS and DaisyUI components
6. **Thai Localization**: Buddhist era date conversion and Thai language interface

## Key Data Structures

### Loan Calculation API Payload
```json
{
  "start_month": 11,
  "start_year": 2024,
  "initial_loan": 100000000,
  "fixed_interest": 2.95,
  "fixed_year": 3,
  "MRR": 8.8,
  "monthly_payment": 15000,
  "chang_interest": [2.95, 1.95],
  "bank": "UOB"
}
```

### Database Schema
- `interest_rates` table with banks: SCB, UOB, KTB, Kbank
- Fields: bank_name (PK), update_MRR, years_interest, MRR
- Dynamic columns can be added via `/api/addcolumn`

## Testing and Validation

### Loan Calculation Testing
When testing loan calculations, ensure proper handling of:
- Fixed vs variable interest rates with MRR calculations
- Thai Buddhist era date conversion (+543 years)
- Decimal precision for financial calculations
- Edge cases (zero payments, negative values, insufficient payments)
- Bank-specific MRR rates and discount periods

### API Testing
Test all endpoints with proper JSON payloads:
- `/api/calculate` - Complete loan schedule calculations
- `/api/showdatadb` - Verify bank data integrity
- `/api/insertdata` - Test data validation and updates
- `/api/bank-info` - Specific bank information retrieval

## Production Deployment Notes

- The application uses Thai banking terminology (MRR, ดอกเบี้ย, ผ่อนชำระ) and Buddhist era date formats
- Database schema can be extended dynamically via `/api/addcolumn` endpoint for additional features
- When adding new columns, update both the database operations in `database_manager.py` and frontend forms
- Backend expects specific JSON format for loan calculations with Thai bank names
- Frontend uses modern React 19 patterns with strict mode enabled and functional components
- All financial calculations maintain Decimal precision for accuracy in production environments
- Thai bank names: "ธนาคารกสิกรไทย" (Kbank), "ธนาคารกรุงไทย" (KTB), "ธนาคารไทยพาณิชย์" (SCB), "ธนาคารยูโอบี" (UOB)

## Common Troubleshooting

### Frontend Won't Load / Calculation Issues
1. **Missing Dependencies**: Run `npm install @mui/icons-material` if BeautifulSelect fails
2. **API Connection**: Check backend is running and update API_BASE_URL in constants/index.js
3. **Bank Selection Not Working**: Check browser console (F12) for debug messages - shows bank validation details
4. **Input Issues**: Ensure all required fields are filled (bank selection, MRR > 0, fixed interest > 0, fixed year > 0)

### Debug Bank Validation
The app includes detailed console logging. Open browser console and click "Calculate" to see:
- Current bank data state
- Individual field validation results
- Configuration issues

### Component Structure for Multi-Bank Feature
```
frontend/src/components/
├── common/          # AppInput, AppSelect, AppDate (with hideSuffix)
├── forms/           # BankInputForm (per-bank configuration)
├── results/         # MultiSummaryCards, MultiChartView, BankSelector
├── tables/          # SelectableScheduleTable
└── charts/          # Comparison visualizations
```

## Security & Performance

- All API inputs are validated and sanitized
- SQL injection protection through parameterized queries
- CORS properly configured for production domains
- Frontend build optimized for production deployment
- Responsive design works across all device sizes
- API timeout handling (10 seconds) prevents hanging requests