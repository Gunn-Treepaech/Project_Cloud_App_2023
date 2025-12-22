import React from 'react';

const AppInput = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    min,
    max,
    disabled = false,
    required = false,
    error = null,
    helperText = '',
    icon = null,
    size = 'normal',
    color = 'indigo',
    useEventObject = false,
    hideSuffix = false,
    decimal = null
}) => {
    /* ========================
        DISPLAY VALUE (ใส่ Comma)
    ======================== */
    let displayValue = value ?? '';

    // ฟังก์ชันใส่ Comma
    const formatComma = (val) => {
        if (val === null || val === undefined || val === '') return '';
        let str = val.toString();
        let [intPart, decPart] = str.split('.');
        // ใส่ comma เฉพาะส่วนจำนวนเต็ม
        intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return decPart !== undefined ? `${intPart}.${decPart}` : intPart;
    };

    // ถ้าเป็นสายตัวเลข ให้แสดงผลแบบมี Comma
    if (type === 'number' || type === 'numeric') {
        displayValue = formatComma(displayValue);
    }

    if (hideSuffix && typeof displayValue === 'string') {
        displayValue = displayValue.replace('.shsojvp', '');
    }

    /* ========================
        INPUT FILTERING (ลบ Comma ออกก่อนกรอง)
    ======================== */
    const filterInputValue = (inputValue) => {
        if (type === 'text') return inputValue;
        if (inputValue === '' || inputValue === '-') return inputValue;

        // ลบคอมมาออกก่อน เพื่อเอามาจัดการต่อ
        let cleanValue = inputValue.replace(/,/g, '');
        
        // กรองเอาเฉพาะตัวเลข จุด และ ลบ
        let numericValue = cleanValue.replace(/[^0-9.-]/g, '');

        const parts = numericValue.split('.');
        if (parts.length > 2) {
            numericValue = parts[0] + '.' + parts.slice(1).join('');
        }

        if (decimal !== null && parts.length === 2) {
            const decimalPart = parts[1].slice(0, decimal);
            numericValue = parts[0] + '.' + decimalPart;
        }

        return numericValue;
    };

    const handleChange = (e) => {
        if (type === 'number' || type === 'numeric') {
            const newValue = filterInputValue(e.target.value);
            // ส่งค่าที่ "ไม่มีคอมมา" กลับไปหา State
            useEventObject ? onChange({ ...e, target: { ...e.target, value: newValue } }) : onChange(newValue);
        } else {
            useEventObject ? onChange(e) : onChange(e.target.value);
        }
    };

    const handleBlur = (e) => {
        if (type === 'text') return;

        let val = e.target.value.replace(/,/g, ''); // ลบคอมมาก่อนคำนวณ
        if (val === '' || val === '-') {
            // ถ้าลบข้อมูลจนเป็นค่าว่าง ให้ใส่ 0 แทน (สำหรับ number/numeric)
            if (type === 'number' || type === 'numeric') {
                let finalValue = decimal !== null ? (0).toFixed(decimal) : '0';
                useEventObject ? onChange({ ...e, target: { ...e.target, value: finalValue } }) : onChange(finalValue);
            } else {
                useEventObject ? onChange({ ...e, target: { ...e.target, value: '' } }) : onChange('');
            }
            return;
        }

        let num = parseFloat(val);
        if (!isNaN(num)) {
            // Logic ดอกเบี้ย MRR (ไม่เกิน 9.99)
            if ((label?.includes('MRR') || label?.includes('ดอกเบี้ย')) && num > 9.99) {
                num = 9.99;
            }

            if (min !== undefined && num < parseFloat(min)) num = parseFloat(min);
            if (max !== undefined && num > parseFloat(max)) num = parseFloat(max);

            let formatted = num.toString();
            if (decimal !== null) {
                formatted = num.toFixed(decimal);
            }

            if (formatted !== val) {
                useEventObject
                    ? onChange({ ...e, target: { ...e.target, value: formatted } })
                    : onChange(formatted);
            }
        }
    };

    /* ========================
        STYLE & RENDER
    ======================== */
    const sizeClasses = { small: 'px-3 py-2 text-sm', normal: 'px-4 py-3 text-base', large: 'px-5 py-4 text-lg' };
    const colorClasses = {
        indigo: { border: 'border-indigo-200 focus:border-indigo-500', ring: 'focus:ring-indigo-200', text: 'text-indigo-600' },
        emerald: { border: 'border-emerald-200 focus:border-emerald-500', ring: 'focus:ring-emerald-200', text: 'text-emerald-600' },
        blue: { border: 'border-blue-200 focus:border-blue-500', ring: 'focus:ring-blue-200', text: 'text-blue-600' }
    };

    const currentSize = sizeClasses[size] || sizeClasses.normal;
    const currentColor = colorClasses[color] || colorClasses.indigo;
    const inputClasses = `w-full ${currentSize} bg-white border-2 ${currentColor.border} rounded-xl ${currentColor.ring} focus:ring-2 transition-all duration-200 font-medium text-gray-900 placeholder:text-gray-400 disabled:bg-gray-100 disabled:text-gray-500 ${icon ? 'pl-11' : ''} ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`.trim();

    return (
        <div className="form-control w-full">
            {label && (
                <label className="label mb-1 block">
                    <span className="label-text font-medium text-gray-700 text-sm">{label}{required && <span className="text-red-500 ml-1">*</span>}</span>
                </label>
            )}
            <div className="relative">
                {icon && <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${currentColor.text} pointer-events-none`}>{icon}</div>}
                <input
                    type="text"
                    inputMode={(type === 'numeric' || type === 'number') ? 'decimal' : 'text'}
                    value={displayValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={inputClasses}
                    autoComplete="off"
                />
            </div>
            {(error || helperText) && (
                <label className="label mt-1 block">
                    <span className={`label-text-alt text-xs ${error ? 'text-red-500' : 'text-gray-500'}`}>{error || helperText}</span>
                </label>
            )}
        </div>
    );
};

export default AppInput;