import React from 'react';

const AppInput = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    step,
    min,
    max,
    disabled = false,
    required = false,
    error = null,
    helperText = '',
    icon = null,
    size = 'normal',
    // variant = 'outlined',
    color = 'indigo',
    useEventObject = false,
    hideSuffix = false,
    decimal = null // เพิ่ม prop สำหรับจำกัดทศนิยม เช่น decimal={2}
}) => {
    const sizeClasses = {
        small: 'px-3 py-2 text-sm',
        normal: 'px-4 py-3 text-base',
        large: 'px-5 py-4 text-lg'
    };

    const colorClasses = {
        indigo: {
            border: 'border-indigo-200 focus:border-indigo-500',
            ring: 'focus:ring-indigo-200',
            text: 'text-indigo-600'
        },
        emerald: {
            border: 'border-emerald-200 focus:border-emerald-500',
            ring: 'focus:ring-emerald-200',
            text: 'text-emerald-600'
        },
        purple: {
            border: 'border-purple-200 focus:border-purple-500',
            ring: 'focus:ring-purple-200',
            text: 'text-purple-600'
        },
        blue: {
            border: 'border-blue-200 focus:border-blue-500',
            ring: 'focus:ring-blue-200',
            text: 'text-blue-600'
        }
    };

    const currentColor = colorClasses[color] || colorClasses.indigo;
    const currentSize = sizeClasses[size] || sizeClasses.normal;

    const displayValue = hideSuffix && typeof value === 'string' && value.includes('.shsojvp')
        ? value.replace('.shsojvp', '')
        : value;

    const inputClasses = `
        w-full ${currentSize}
        bg-white
        border-2 ${currentColor.border}
        rounded-xl
        ${currentColor.ring} focus:ring-2
        transition-all duration-200
        font-medium
        text-gray-900
        placeholder:text-gray-400
        disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
        ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}
    `.trim().replace(/\s+/g, ' ');

    const iconPosition = icon ? (type === 'number' ? 'right-3' : 'left-3') : null;

    // ฟังก์ชันจัดการทศนิยม
    const handleChange = (e) => {
        let newValue = e.target.value;
        
        // ถ้ากำหนด decimal และเป็น type number
        if (type === 'number' && decimal !== null && newValue !== '') {
            const num = parseFloat(newValue);
            if (!isNaN(num)) {
                newValue = num.toFixed(decimal);
            }
        }

        if (useEventObject) {
            onChange(e);
        } else {
            onChange(newValue);
        }
    };

    // ฟังก์ชันจัดการเมื่อ blur (ออกจาก input)
    const handleBlur = (e) => {
        if (type === 'number' && decimal !== null && e.target.value !== '') {
            const num = parseFloat(e.target.value);
            if (!isNaN(num)) {
                const formatted = num.toFixed(decimal);
                if (useEventObject) {
                    onChange({ ...e, target: { ...e.target, value: formatted } });
                } else {
                    onChange(formatted);
                }
            }
        }
    };

    return (
        <div className="form-control">
            {label && (
                <label className="label">
                    <span className={`label-text font-medium text-gray-700 ${size === 'small' ? 'text-xs' : size === 'large' ? 'text-base' : 'text-sm'}`}>
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                </label>
            )}

            <div className="relative">
                {icon && iconPosition === 'left-3' && (
                    <div className={`absolute ${iconPosition} top-1/2 -translate-y-1/2 ${currentColor.text}`}>
                        {icon}
                    </div>
                )}

                <input
                    type={type}
                    value={displayValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    step={step || (decimal !== null ? `0.${'0'.repeat(decimal - 1)}1` : undefined)}
                    min={min}
                    max={max}
                    disabled={disabled}
                    required={required}
                    className={inputClasses}
                    inputMode={type === 'number' ? 'decimal' : undefined}
                    style={{
                        paddingLeft: icon && iconPosition === 'left-3' ? '2.5rem' : undefined,
                        paddingRight: icon && iconPosition === 'right-3' ? '2.5rem' : undefined
                    }}
                />

                {icon && iconPosition === 'right-3' && (
                    <div className={`absolute ${iconPosition} top-1/2 -translate-y-1/2 ${currentColor.text}`}>
                        {icon}
                    </div>
                )}
            </div>

            {(error || helperText) && (
                <label className="label">
                    <span className={`label-text-alt ${error ? 'text-red-500' : 'text-gray-500'}`}>
                        {error || helperText}
                    </span>
                </label>
            )}
        </div>
    );
};

export default AppInput;