import React from 'react';
import { DateRange } from '@mui/icons-material';

const AppDate = ({
    label,
    value,
    onChange,
    disabled = false,
    required = false,
    error = null,
    helperText = '',
    minDate = null,
    maxDate = null,
    size = 'normal',
    color = 'blue'
}) => {
    const sizeClasses = {
        small: 'px-3 py-2 text-sm',
        normal: 'px-4 py-3 text-base',
        large: 'px-5 py-4 text-lg'
    };

    const colorClasses = {
        blue: {
            border: 'border-blue-200 focus:border-blue-500',
            ring: 'focus:ring-blue-200',
            bg: 'bg-white focus:bg-white',
            text: 'text-blue-600'
        },
        indigo: {
            border: 'border-indigo-200 focus:border-indigo-500',
            ring: 'focus:ring-indigo-200',
            bg: 'bg-white focus:bg-white',
            text: 'text-indigo-600'
        },
        purple: {
            border: 'border-purple-200 focus:border-purple-500',
            ring: 'focus:ring-purple-200',
            bg: 'bg-white focus:bg-white',
            text: 'text-purple-600'
        }
    };

    const currentColor = colorClasses[color] || colorClasses.blue;
    const currentSize = sizeClasses[size] || sizeClasses.normal;

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getMinDate = () => {
        if (minDate) return formatDateForInput(minDate);
        // Default to today
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getMaxDate = () => {
        if (maxDate) return formatDateForInput(maxDate);
        // Default to 1 year from today
        const maxDateObj = new Date();
        maxDateObj.setFullYear(maxDateObj.getFullYear() + 1);
        return formatDateForInput(maxDateObj);
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
                <input
                    type="date"
                    value={formatDateForInput(value)}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    required={required}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className={`
                        w-full ${currentSize} ${currentColor.text}
                        ${currentColor.bg}
                        border-2 ${currentColor.border}
                        rounded-xl
                        ${currentColor.ring} focus:ring-2
                        transition-all duration-200
                        font-medium
                        disabled:bg-gray-100 disabled:cursor-not-allowed
                        ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}
                    `}
                    style={{
                        paddingLeft: '2.5rem'
                    }}
                />

                <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${currentColor.text}`}>
                    <DateRange />
                </div>
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

export default AppDate;