// Thai Banks Configuration
export const THAI_BANKS = [
  { label: 'เลือกธนาคาร...', value: '', disabled: true },
  { label: '1. ธนาคารกสิกรไทย (Kbank)', value: 'Kbank', description: 'อัตราดอกเบี้ย MRR: 7.30%' },
  { label: '2. ธนาคารกรุงไทย (KTB)', value: 'KTB', description: 'อัตราดอกเบี้ย MRR: 7.125%' },
  { label: '3. ธนาคารไทยพาณิชย์ (SCB)', value: 'SCB', description: 'อัตราดอกเบี้ย MRR: 7.125%' },
  { label: '4. ธนาคารยูโอบี (UOB)', value: 'UOB', description: 'อัตราดอกเบี้ย MRR: 6.875%' },
  // { label: '5. ธนาคารอื่นๆ', value: 'OTHER' }
];

// API Configuration
export const API_CONFIG = {
  // BASE_URL: 'http://localhost:5000',
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://loan-calculator-api.example.com',
  ENDPOINTS: {
    CALCULATE: '/api/calculate',
    BANK_INFO: '/api/bank-info',
    SHOW_DATA: '/api/showdatadb'
  }
};

// UI Configuration
export const UI_CONFIG = {
  DEFAULT_SCHEDULE_ROWS: 36,
  CURRENCY: 'THB',
  LOCALE: 'th-TH'
};