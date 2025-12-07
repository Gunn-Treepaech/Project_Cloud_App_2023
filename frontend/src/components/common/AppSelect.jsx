import React, { useState } from 'react';
import { ExpandMore, AccountBalance, DateRange } from '@mui/icons-material';

const AppSelect = ({
    value,
    onChange,
    options,
    label,
    placeholder = "เลือก",
    disabled = false,
    required = false,
    error = null,
    helperText = '',
    size = 'normal', // 'small' | 'normal' | 'large'
    variant = 'bank', // 'bank' | 'year' | 'default'
    loading = false,
    icon = null
}) => {
    const [focused, setFocused] = useState(false);

    const handleChange = (event) => {
        onChange(event.target.value);
    };

    const sizeClasses = {
        small: 'px-3 py-2 text-sm',
        normal: 'px-4 py-3 text-base',
        large: 'px-5 py-4 text-lg'
    };

    const variantStyles = {
        bank: {
            container: 'bg-white border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200',
            icon: 'text-indigo-500',
            text: 'text-gray-800'
        },
        year: {
            container: 'bg-white border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200',
            icon: 'text-purple-500',
            text: 'text-gray-800'
        },
        default: {
            container: 'bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
            icon: 'text-blue-500',
            text: 'text-gray-800'
        }
    };

    const currentVariant = variantStyles[variant] || variantStyles.default;
    const currentSize = sizeClasses[size] || sizeClasses.normal;

    const getIcon = () => {
        if (icon) return icon;
        if (variant === 'bank') return <AccountBalance />;
        if (variant === 'year') return <DateRange />;
        return null;
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
                {/* Left Icon */}
                {getIcon() && (
                    <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${currentVariant.icon}`}>
                        {getIcon()}
                    </div>
                )}

                {/* Select Element */}
                <select
                    value={value}
                    onChange={handleChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    disabled={disabled || loading}
                    required={required}
                    className={`
                        w-full ${currentSize} ${currentVariant.text}
                        ${currentVariant.container}
                        rounded-xl
                        font-medium
                        appearance-none
                        cursor-pointer
                        disabled:bg-gray-100 disabled:cursor-not-allowed
                        transition-all duration-200
                        ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}
                        ${focused ? 'shadow-lg' : 'shadow-sm'}
                    `}
                    style={{
                        paddingLeft: getIcon() ? '2.5rem' : '1rem',
                        paddingRight: '2.5rem'
                    }}
                >
                    {!value && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="text-gray-800 font-medium"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Loading Spinner */}
                {loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Expand Icon */}
                {!loading && (
                    <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${currentVariant.icon} transition-transform duration-200 ${focused ? 'rotate-180' : ''}`}>
                        <ExpandMore />
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

export default AppSelect;