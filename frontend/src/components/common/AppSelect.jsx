import React from 'react';
import {
  Autocomplete,
  TextField,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { AccountBalance, DateRange } from '@mui/icons-material';

const AppSelect = ({
  value,
  onChange,
  options = [],
  label,
  placeholder = 'เลือก',
  disabled = false,
  required = false,
  error = null,
  helperText = '',
  variant = 'bank', // bank | year | default
  loading = false,
  icon = null
}) => {
  const getIcon = () => {
    if (icon) return icon;
    if (variant === 'bank') return <AccountBalance fontSize="small" />;
    if (variant === 'year') return <DateRange fontSize="small" />;
    return null;
  };

  const selectedOption =
    options.find((opt) => opt.value === value) || 0 ;

  return (
    <Autocomplete
      fullWidth
      options={options}
      value={selectedOption}
      disabled={disabled}
      loading={loading}
      isOptionEqualToValue={(opt, val) => opt.value === val.value}
      getOptionLabel={(opt) => opt?.label || ''}
      onChange={(_, newValue) => {
        onChange?.(newValue?.value ?? '');
      }}
      renderOption={(props, option) => (
        <li
          {...props}
          className="flex items-center gap-3 px-3 py-2 hover:bg-indigo-50"
        >
          {getIcon() && (
            <span className="text-indigo-500">{getIcon()}</span>
          )}
          <span className="font-medium text-gray-800">
            {option.label}
          </span>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={
            <>
              {label}
              {required && <span style={{ color: 'red' }}> *</span>}
            </>
          }
          placeholder={placeholder}
          error={!!error}
          helperText={error || helperText}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                {getIcon() && (
                  <InputAdornment position="start">
                    {getIcon()}
                  </InputAdornment>
                )}
                {params.InputProps.startAdornment}
              </>
            ),
            endAdornment: (
              <>
                {loading && (
                  <CircularProgress color="primary" size={18} />
                )}
                {params.InputProps.endAdornment}
              </>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              fontWeight: 500
            }
          }}
        />
      )}
    />
  );
};

export default AppSelect;
