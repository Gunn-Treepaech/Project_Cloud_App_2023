import React from "react";
import { DateRange } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField, InputAdornment } from "@mui/material";
import dayjs from "dayjs";

const AppDate = ({
  label,
  value,
  onChange,
  disabled = false,
  required = false,
  error = null,
  helperText = "",
  minDate = null,
  maxDate = null,
}) => {
  const parseDate = (dateString) => (dateString ? dayjs(dateString) : null);

  const handleDateChange = (newValue) => {
    if (newValue && newValue.isValid()) {
      onChange(newValue.format("YYYY-MM-DD"));
    } else {
      onChange("");
    }
  };

  return (
    <div className="form-control space-y-1">
      {label && (
        <label className="label pb-1">
          <span className="label-text font-semibold text-gray-700 text-sm">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
      )}

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          enableAccessibleFieldDOMStructure={false}
          value={parseDate(value)}
          onChange={handleDateChange}
          disabled={disabled}
          minDate={minDate ? dayjs(minDate) : undefined}
          maxDate={maxDate ? dayjs(maxDate) : undefined}
          format="DD/MM/YYYY"
          slots={{ textField: TextField }}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error || helperText,
              placeholder: "วัน/เดือน/ปี",
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRange
                      sx={{
                        color: error ? "error.main" : "primary.main",
                        fontSize: 20,
                      }}
                    />
                  </InputAdornment>
                ),
              },
              sx: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  backgroundColor: disabled ? "#f9fafb" : "#ffffff",
                  transition: "all 0.2s ease",
                  "& fieldset": {
                    borderColor: error ? "error.main" : "grey.300",
                  },
                  "&:hover fieldset": {
                    borderColor: error ? "error.main" : "primary.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderWidth: "2px",
                    borderColor: error ? "error.main" : "primary.main",
                  },
                },
                "& .MuiFormHelperText-root": {
                  marginLeft: "4px",
                },
              },
            },
            actionBar: {
              actions: ["clear", "today", "accept"],
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default AppDate;
