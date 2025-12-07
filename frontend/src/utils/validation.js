// Input validation utilities

/**
 * Safely parse float value with validation
 * @param {string|number} value - Input value to parse
 * @param {Object} options - Validation options
 * @returns {Object} Validation result with value and error
 */
export const parseSafeFloat = (value, options = {}) => {
    const {
        min = 0,
        max = Number.MAX_SAFE_INTEGER,
        allowNegative = false,
        defaultValue = 0
    } = options;

    const num = parseFloat(value);

    // Check if valid number
    if (isNaN(num)) {
        return {
            isValid: false,
            value: defaultValue,
            error: 'กรุณากรอกตัวเลข'
        };
    }

    // Check negative values
    if (!allowNegative && num < 0) {
        return {
            isValid: false,
            value: defaultValue,
            error: 'ค่าต้องไม่ติดลบ'
        };
    }

    // Check range
    if (num < min) {
        return {
            isValid: false,
            value: defaultValue,
            error: `ค่าต้องมากกว่าหรือเท่ากับ ${min}`
        };
    }

    if (num > max) {
        return {
            isValid: false,
            value: defaultValue,
            error: `ค่าต้องไม่เกิน ${max.toLocaleString('th-TH')}`
        };
    }

    return {
        isValid: true,
        value: num,
        error: null
    };
};

/**
 * Validate loan amount input
 * @param {string|number} value - Loan amount
 * @returns {Object} Validation result
 */
export const validateLoanAmount = (value) => {
    return parseSafeFloat(value, {
        min: 10000, // Minimum 10,000 Baht
        max: 100000000, // Maximum 100 Million Baht
        defaultValue: 0
    });
};

/**
 * Validate monthly payment input
 * @param {string|number} value - Monthly payment amount
 * @returns {Object} Validation result
 */
export const validateMonthlyPayment = (value) => {
    return parseSafeFloat(value, {
        min: 1000, // Minimum 1,000 Baht
        max: 1000000, // Maximum 1 Million Baht
        defaultValue: 0
    });
};

/**
 * Validate interest rate input
 * @param {string|number} value - Interest rate
 * @returns {Object} Validation result
 */
export const validateInterestRate = (value) => {
    return parseSafeFloat(value, {
        min: 0,
        max: 100, // Maximum 100%
        defaultValue: 0
    });
};

/**
 * Sanitize and format currency input
 * @param {string} value - Currency input
 * @returns {string} Sanitized and formatted value
 */
export const sanitizeCurrencyInput = (value) => {
    // Remove non-digit and non-decimal characters except dots
    let sanitized = value.replace(/[^\d.]/g, '');

    // Ensure only one decimal point
    const parts = sanitized.split('.');
    if (parts.length > 2) {
        sanitized = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limit decimal places to 2
    if (parts.length === 2 && parts[1].length > 2) {
        sanitized = parts[0] + '.' + parts[1].substring(0, 2);
    }

    return sanitized;
};

/**
 * Validate date input
 * @param {string} date - Date string
 * @returns {Object} Validation result
 */
export const validateDate = (date) => {
    if (!date) {
        return {
            isValid: false,
            value: null,
            error: 'กรุณาเลือกวันที่'
        };
    }

    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if date is valid and not in the past
    if (isNaN(inputDate.getTime()) || inputDate < today) {
        return {
            isValid: false,
            value: null,
            error: 'กรุณาเลือกวันที่ที่ไม่ในอดาจ'
        };
    }

    // Check if date is not too far in the future (max 1 year)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    if (inputDate > maxDate) {
        return {
            isValid: false,
            value: null,
            error: 'กรุณาเลือกวันที่ภายใน 1 ปีข้างหน้า'
        };
    }

    return {
        isValid: true,
        value: date,
        error: null
    };
};