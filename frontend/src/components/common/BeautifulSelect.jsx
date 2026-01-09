import React, { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Box, Chip } from '@mui/material';
import { ExpandMore, AccountBalance } from '@mui/icons-material';

const BeautifulSelect = ({
    value,
    onChange,
    options,
    label,
    placeholder = "เลือกธนาคาร",
    disabled = false,
    required = false
}) => {
    const [focused, setFocused] = useState(false);

    const handleChange = (event) => {
        onChange(event.target.value);
    };

    return (
        <FormControl
            fullWidth
            variant="outlined"
            required={required}
            disabled={disabled}
            sx={{
                '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    boxShadow: focused ? '0 0 0 3px rgba(99, 102, 241, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: focused ? '2px solid #6366f1' : '1px solid #e5e7eb',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        borderColor: '#6366f1',
                        boxShadow: '0 2px 4px rgba(99, 102, 241, 0.15)',
                    },
                },
                '& .MuiInputLabel-root': {
                    color: '#6b7280',
                    fontWeight: 500,
                    '&.Mui-focused': {
                        color: '#6366f1',
                    },
                },
                '& .MuiSelect-select': {
                    padding: '16.5px 14px',
                    fontSize: '16px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                },
            }}
        >
            <InputLabel>{label}</InputLabel>
            <Select
                value={value}
                onChange={handleChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                displayEmpty
                IconComponent={(props) => (
                    <ExpandMore
                        {...props}
                        sx={{
                            color: '#6366f1',
                            fontSize: '24px',
                            marginRight: '8px'
                        }}
                    />
                )}
                renderValue={(selected) => {
                    if (!selected) {
                        return (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af' }}>
                                <AccountBalance sx={{ fontSize: '20px' }} />
                                {placeholder}
                            </Box>
                        );
                    }

                    const selectedOption = options.find(option => option.value === selected);
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AccountBalance sx={{ fontSize: '20px', color: '#6366f1' }} />
                            <Box>
                                <Box sx={{ fontWeight: 600, color: '#1f2937' }}>
                                    {selectedOption?.label || selected}
                                </Box>
                              </Box>
                        </Box>
                    );
                }}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            borderRadius: '12px',
                            mt: 1,
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                            border: '1px solid #e5e7eb',
                            '& .MuiList-root': {
                                padding: '8px',
                            },
                        }
                    },
                }}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option.value}
                        value={option.value}
                        sx={{
                            borderRadius: '8px',
                            margin: '2px 0',
                            padding: '12px 16px',
                            '&:hover': {
                                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                            },
                            '&.Mui-selected': {
                                backgroundColor: 'rgba(99, 102, 241, 0.12)',
                                '&:hover': {
                                    backgroundColor: 'rgba(99, 102, 241, 0.16)',
                                },
                            },
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                            <AccountBalance sx={{ fontSize: '20px', color: '#6366f1' }} />
                            <Box sx={{ flex: 1 }}>
                                <Box sx={{ fontWeight: 600, color: '#1f2937', fontSize: '14px' }}>
                                    {option.label}
                                </Box>
                                </Box>
                            {option.badge && (
                                <Chip
                                    label={option.badge}
                                    size="small"
                                    sx={{
                                        backgroundColor: '#fef3c7',
                                        color: '#92400e',
                                        fontSize: '10px',
                                        fontWeight: 600,
                                        height: '20px',
                                    }}
                                />
                            )}
                        </Box>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default BeautifulSelect;