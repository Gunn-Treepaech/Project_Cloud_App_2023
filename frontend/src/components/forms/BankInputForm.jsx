import React, { useState } from "react";
import { THAI_BANKS } from "../../constants";
import apiService from "../../services/apiService";
import { BeautifulSelect, AppInput, AppSelect } from "../common";
import { AccountBalance, TrendingUp, Percent } from "@mui/icons-material";

const BankInputForm = ({
  bankData,
  index,
  onBankDataChange,
  onRemoveBank,
  canRemove,
}) => {
  const [isFetchingBankData, setIsFetchingBankData] = useState(false);

  const handleInputChange = (field, value) => {
    onBankDataChange(index, field, value);
  };

  const handleConfigChange = (e) => {
    const { name, value, type } = e.target;
    onBankDataChange(
      index,
      name,
      type === "number" ? parseFloat(value) : value
    );
  };

  const handleBankChange = async (value) => {
    // ✅ เปลี่ยนจาก (e) เป็น (value)
    const newBank = value; // ✅ ใช้ value โดยตรง
    handleInputChange("bank", newBank);

    // ถ้าเลือก OTHER ไม่ต้องดึงข้อมูล
    if (newBank === "OTHER") {
      // Set default values for OTHER bank
      handleInputChange("MRR", 7.3);
      handleInputChange("fixed_interest", 2.95);
      handleInputChange("update_MRR", "");
      return;
    }

    if (newBank) {
      // ✅ เช็ค newBank ไม่เป็น empty
      setIsFetchingBankData(true);

      // Mock bank data for testing
      const mockBankData = {
        Kbank: { MRR: 7.3, fixed_interest: 6.5, update_MRR: "2024-12-07" },
        KTB: { MRR: 7.125, fixed_interest: 6.25, update_MRR: "2024-12-07" },
        SCB: { MRR: 7.125, fixed_interest: 6.75, update_MRR: "2024-12-07" },
        UOB: { MRR: 6.875, fixed_interest: 6.0, update_MRR: "2024-12-07" },
      };

      try {
        console.log("Fetching bank data for:", newBank); // Debug

        // Try API first
        const data = await apiService.getBankInfo(newBank);
        console.log("Received bank data:", data); // Debug

        if (data && typeof data === "object" && data.MRR) {
          // ✅ เช็คว่าได้ object ที่ถูกต้องกลับมา
          handleInputChange("MRR", data.MRR);
          handleInputChange("fixed_interest", data.fixed_interest ?? 2.95);
          handleInputChange("update_MRR", data.update_MRR ?? "");
          console.log("Bank data set successfully from API:", {
            MRR: data.MRR,
            fixed_interest: data.fixed_interest ?? 2.95,
          });
        } else {
          console.log("API failed, using mock data for:", newBank);
          // Use mock data if API fails
          const mockData = mockBankData[newBank] || {
            MRR: 7.3,
            fixed_interest: 2.95,
            update_MRR: "",
          };
          handleInputChange("MRR", mockData.MRR);
          handleInputChange("fixed_interest", mockData.fixed_interest);
          handleInputChange("update_MRR", mockData.update_MRR);
          console.log("Bank data set successfully from mock:", mockData);
        }
      } catch (err) {
        console.error("Bank data fetch error:", err);
        alert("ไม่สามารถดึงข้อมูลธนาคารได้: " + err.message);
      } finally {
        setIsFetchingBankData(false);
      }
    }
  };

  const isOtherBank = bankData.bank === "OTHER";

  // Show bank selection prompt if no bank is selected
  if (!bankData.bank || bankData.bank === "") {
    return (
      <div className="card bg-gradient-to-br from-blue-50 to-indigo-100 shadow-md border border-blue-200 hover:shadow-lg transition-all duration-200">
        <div className="card-body p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                {index + 1}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">
                  เลือกธนาคารที่ {index + 1}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  กรุณาเลือกธนาคารเพื่อดูตัวเลือกดอกเบี้ย
                </p>
              </div>
            </div>
            {canRemove && (
              <button
                onClick={() => onRemoveBank(index)}
                className="btn btn-sm btn-circle btn-ghost text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="ลบธนาคาร"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="mb-6">
            <BeautifulSelect
              value={bankData.bank || ""}
              onChange={handleBankChange}
              options={THAI_BANKS}
              // label="เลือกธนาคาร"
              // placeholder="กรุณาเลือกธนาคาร"
              required={true}
              disabled={isFetchingBankData}
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 text-blue-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm font-medium">
                เลือกธนาคารเพื่อดูอัตราดอกเบี้ยปัจจุบัน
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-white shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
      <div className="card-body p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              {index + 1}
            </div>
            <div>
              <h3 className="font-bold text-gray-800">ธนาคารที่ {index + 1}</h3>
              {bankData?.update_MRR && !isFetchingBankData && (
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  อัพเดต: {bankData.update_MRR}
                </p>
              )}
            </div>
          </div>
          {canRemove && (
            <button
              onClick={() => onRemoveBank(index)}
              className="btn btn-sm btn-circle btn-ghost text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="ลบธนาคาร"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Bank Selection */}
        <div className="form-control mb-4">
          <div className="label">
            <span className="label-text font-medium text-gray-700">
              เลือกธนาคาร
            </span>
          </div>
          <BeautifulSelect
            value={bankData.bank}
            onChange={handleBankChange}
            options={THAI_BANKS}
            // label="เลือกธนาคาร"
            // placeholder="เลือกธนาคาร"
            disabled={isFetchingBankData}
          />
        </div>

        {/* Interest Rates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <AppInput
            type="numeric" // แนะนำให้ใช้ numeric เพื่อความชัดเจน
            decimal={2}
            label="อัตราดอกเบี้ย MRR"
            value={bankData.MRR}
            onChange={(value) => handleInputChange("MRR", value)} // ส่ง string ไปเลย
            placeholder="0.00"
            icon={<TrendingUp />}
            color="emerald"
            helperText="อัตราดอกเบี้ยเฉลี่ยปัจจุบัน"
            required={!isOtherBank}
          />

          <AppInput
            type="numeric"
            decimal={2}
            label="ดอกเบี้ยคงที่"
            value={bankData.fixed_interest}
            onChange={(value) => handleInputChange("fixed_interest", value)} // ส่ง string ไปเลย
            placeholder="0.00"
            icon={<Percent />}
            color="blue"
            helperText="ดอกเบี้ยในช่วง Fixed Rate"
            required={!isOtherBank}
          />
        </div>

        {/* Interest Settings */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5 border-2 border-purple-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-lg">
                การตั้งค่าระยะเวลาดอกเบี้ย
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                กำหนดระยะเวลาอัตราดอกเบี้ยคงที่
              </p>
            </div>
          </div>

          <div className="mb-4">
            <AppSelect
              value={bankData.fixed_year}
              onChange={(value) => {
                // Auto-set to 0 when user deletes/clears the selection
                const v = value === '' || value === null || value === undefined ? 0 : parseInt(value);
                handleConfigChange({
                  target: { name: "fixed_year", value: v, type: "number" },
                });
                handleConfigChange({
                  target: {
                    name: "chang_interest_discount1",
                    value: 0,
                    type: "number",
                  },
                });
                handleConfigChange({
                  target: {
                    name: "chang_interest_discount2",
                    value: 0,
                    type: "number",
                  },
                });
              }}
              options={[
                { label: "ไม่มี Fixed Rate (ดอกเบี้ยลอยตลอด)", value: 0 },
                { label: "1 ปี - Fixed Rate", value: 1 },
                { label: "2 ปี - Fixed Rate", value: 2 },
                { label: "3 ปี - Fixed Rate", value: 3 },
              ]}
              label="ระยะเวลา Fixed Rate"
              placeholder="เลือกระยะเวลา"
              variant="year"
              size="normal"
              required
            />
          </div>

          {bankData.fixed_year === 1 && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-purple-200 space-y-3">
              <p className="text-sm font-semibold text-purple-700 mb-2">
                ส่วนลดดอกเบี้ยหลัง Fixed Rate
              </p>
              <div className="grid grid-cols-1 gap-3">
                <AppInput
                  label="ส่วนลด MRR ปีที่ 2"
                  type="numeric"
                  decimal={2}
                  value={bankData.chang_interest_discount1}
                  onChange={(value) => handleConfigChange({
                    target: {
                      name: "chang_interest_discount1",
                      value: value,
                      type: "string",
                    },
                  })}
                  placeholder="0.00"
                  icon={<Percent />}
                  color="purple"
                  size="small"
                  helperText="ส่วนลดจากอัตรา MRR"
                />

                <AppInput
                  label="ส่วนลด MRR ปีที่ 3+"
                  type="numeric"
                  decimal={2}
                  value={bankData.chang_interest_discount2}
                  onChange={(value) => handleConfigChange({
                    target: {
                      name: "chang_interest_discount2",
                      value: value,
                      type: "string",
                    },
                  })}
                  placeholder="0.00"
                  icon={<Percent />}
                  color="purple"
                  size="small"
                  helperText="ส่วนลดจากปีที่ 3 เป็นต้นไป"
                />
              </div>
            </div>
          )}

          {bankData.fixed_year === 2 && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-purple-200">
              <p className="text-sm font-semibold text-purple-700 mb-3">
                ส่วนลดดอกเบี้ยหลัง Fixed Rate
              </p>
              <AppInput
                label="ส่วนลด MRR ปีที่ 3+"
                type="numeric"
                decimal={2}
                value={bankData.chang_interest_discount1}
                onChange={(value) => handleConfigChange({
                  target: {
                    name: "chang_interest_discount1",
                    value: value,
                    type: "string",
                  },
                })}
                placeholder="0.00"
                icon={<Percent />}
                color="purple"
                size="small"
                helperText="ส่วนลดจากปีที่ 3 เป็นต้นไป"
              />
            </div>
          )}

          {bankData.fixed_year === 3 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-300">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-green-800">
                    Fixed Rate 3 ปีเต็ม
                  </p>
                  <p className="text-xs text-green-600">
                    อัตราดอกเบี้ยคงที่ตลอดระยะเวลา 3 ปี ไม่มีการเปลี่ยนแปลง
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankInputForm;
