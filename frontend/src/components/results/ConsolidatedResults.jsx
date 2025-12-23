import React, { useState, useRef, useEffect } from "react";
import { PieChart, SummaryCard } from "../../components";
import ScheduleTable from "../tables/ScheduleTable";
import { formatCurrency } from "../../utils";
import { THAI_BANKS } from "../../constants";

// Custom Bank Select Component
const CustomBankSelect = ({ banks, selectedIndex, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    const selectedBank = banks[selectedIndex];
    const thaiBankName = THAI_BANKS.find(b => b.value === selectedBank.bank)?.label?.replace(/^\d+\.\s*/, "") || selectedBank.bank;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={selectRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white/95 backdrop-blur-sm text-gray-800 border-0 shadow-lg rounded-xl px-4 py-2.5 pr-10 min-w-[240px] font-medium cursor-pointer hover:shadow-xl hover:bg-white focus:ring-2 focus:ring-white/50 transition-all duration-200 text-left"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                            {selectedIndex + 1}
                        </div>
                        <div className="font-semibold text-gray-900">{thaiBankName}</div>
                    </div>
                    <svg
                        className={`w-5 h-5 text-indigo-600 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="py-1 max-h-64 overflow-y-auto">
                        {banks.map((bank, index) => {
                            const bankThaiName = THAI_BANKS.find(b => b.value === bank.bank)?.label?.replace(/^\d+\.\s*/, "") || bank.bank;
                            const isSelected = index === selectedIndex;
                            return (
                                <button
                                    key={bank.originalIndex}
                                    onClick={() => {
                                        onChange(index);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full px-4 py-3 text-left transition-all duration-150 ${
                                        isSelected
                                            ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-600'
                                            : 'hover:bg-gray-50 border-l-4 border-transparent'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow-md flex-shrink-0 ${
                                                isSelected
                                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                                                    : 'bg-gray-200 text-gray-600'
                                            }`}>
                                                {index + 1}
                                            </div>
                                            <div className={`font-semibold text-sm ${isSelected ? 'text-indigo-700' : 'text-gray-800'}`}>
                                                {bankThaiName}
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <div className="ml-3 flex-shrink-0">
                                                <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const ConsolidatedResults = ({ banks, monthly_payment }) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedBankIndex, setSelectedBankIndex] = useState(0);

  // Filter banks with results and sort by their order in the banks array (1, 2, 3, ...)
  const banksWithResults = banks
    .map((bank, index) => ({ ...bank, originalIndex: index }))
    .filter((bank) => bank.schedule && bank.schedule.length > 0)
    .sort((a, b) => a.originalIndex - b.originalIndex);

  if (banksWithResults.length === 0) {
    return null;
  }

  const selectedBank =
    banksWithResults[selectedBankIndex] || banksWithResults[0];

  // Calculate totals for all banks
  const totalPrincipal = banksWithResults.reduce(
    (sum, bank) => sum + bank.summary.total_principal,
    0
  );
  const totalInterest = banksWithResults.reduce(
    (sum, bank) => sum + bank.summary.total_interest,
    0
  );
  const totalBalance = banksWithResults.reduce(
    (sum, bank) => sum + bank.summary.remaining_balance,
    0
  );

  return (
    <div className="space-y-8">
      {/* Component 1: Summary Cards - Combined View with Percentages */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          สรุปการชำระเงินทั้งหมด (36 งวด)
        </h2>

        {/* Bank-wise Summary with Percentages */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-6">
            {banksWithResults.map((bank, index) => {
              const bankLabel =
                THAI_BANKS.find((b) => b.value === bank.bank)?.label?.replace(
                  /^\d+\.\s*/,
                  ""
                ) || bank.bank;

              const totalRepaid =
                bank.summary.total_principal + bank.summary.total_interest;

              const principalPercent =
                totalRepaid > 0
                  ? (bank.summary.total_principal / totalRepaid) * 100
                  : 50;

              const interestPercent =
                totalRepaid > 0
                  ? (bank.summary.total_interest / totalRepaid) * 100
                  : 50;

              return (
                <div
                  key={index}
                  className="flex justify-center w-full sm:w-[48%] lg:w-1/4"
                >
                  <div className="card w-full max-w-[320px] shadow-lg bg-white rounded-xl border border-gray-200">
                    <div className="card-body p-6">
                      {/* Bank Header */}
                      <div className="text-center mb-4">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">
                          {bankLabel}
                        </h3>
                        <div className="flex justify-center gap-2 text-xs flex-wrap">
                          <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                            MRR {bank.MRR}%
                          </span>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            ดอกเบี้ย {bank.fixed_interest}%
                          </span>
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            {bank.fixed_year === 0
                              ? "ดอกเบี้ยลอยตลอด"
                              : `Fixed ${bank.fixed_year}ปี`}
                          </span>
                        </div>
                      </div>

                      {/* Pie Chart */}
                      <div className="flex justify-center mb-4">
                        <PieChart
                          principalPercent={principalPercent}
                          interestPercent={interestPercent}
                        />
                      </div>

                      {/* Percentages */}
                      <div className="flex justify-center gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {formatCurrency(principalPercent)}%
                          </div>
                          <div className="text-xs text-gray-600">เงินต้น</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-yellow-600">
                            {formatCurrency(interestPercent)}%
                          </div>
                          <div className="text-xs text-gray-600">ดอกเบี้ย</div>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="space-y-2 border-t pt-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">เงินต้นที่ตัด:</span>
                          <span className="font-bold text-blue-600">
                            {formatCurrency(bank.summary.total_principal)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            ดอกเบี้ยที่จ่าย:
                          </span>
                          <span className="font-bold text-yellow-600">
                            {formatCurrency(bank.summary.total_interest)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t">
                          <span className="text-gray-600">ยอดคงเหลือ:</span>
                          <span className="font-bold text-green-600">
                            {formatCurrency(bank.summary.remaining_balance)}
                          </span>
                        </div>
                      </div>

                      {/* Interest Discount */}
                      {(bank.chang_interest_discount1 !== null ||
                        bank.chang_interest_discount2 !== null) && (
                        <div className="text-xs text-gray-500 mt-3 pt-3 border-t text-center">
                          <div className="flex justify-center gap-2">
                            {bank.chang_interest_discount1 > 0 && (
                              <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded">
                                ปีที่ 2 ลดดอกเบี้ย{" "}
                                {bank.chang_interest_discount1}%
                              </span>
                            )}

                            {bank.chang_interest_discount2 > 0 && (
                              <span className="bg-red-50 text-red-600 px-2 py-1 rounded">
                                ปีที่ 3 ขึ้นไป ลดดอกเบี้ย{" "}
                                {bank.chang_interest_discount2}%
                              </span>
                            )}

                            {bank.chang_interest_discount1 === 0 &&
                              bank.chang_interest_discount2 === 0 && (
                                <span className="bg-gray-50 text-gray-600 px-2 py-1 rounded">
                                  ไม่มีส่วนลดดอกเบี้ย
                                </span>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            title="รวมเงินต้นที่ตัดได้"
            amount={totalPrincipal}
            unit="บาท"
            colorClass="bg-blue-100 text-blue-600"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            }
          />
          <SummaryCard
            title="รวมดอกเบี้ยที่จ่าย"
            amount={totalInterest}
            unit="บาท"
            colorClass="bg-yellow-100 text-yellow-600"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.88 15.68c-.62-.22-1.27-.47-1.92-.68-.18-.06-.35-.11-.53-.17v-1.77c.33.11.66.21 1 .31.34.1.68.21 1.02.32.34.1.65.22.95.32.3.11.56.24.78.39.22.15.39.34.51.57.12.23.18.49.18.82 0 .42-.14.75-.41 1.02-.27.27-.67.4-1.21.4-.46 0-.87-.14-1.23-.42zm2.14-5.35c-.44-.24-.92-.45-1.42-.64-.5-.18-1-.34-1.5-.48v-2.02c.48.11.96.22 1.44.33.48.11.93.22 1.35.34.42.11.77.26 1.05.45.28.19.45.43.51.72.06.3-.01.54-.23.77-.22.23-.59.39-1.11.48zM12 11.2V7.5h1.25V6H9.5v1.5h1.25V11.2c-1.35.25-2.5.88-3.45 1.9L9 14.5c.87-.7 1.95-1.12 3-1.27 1.05.15 2.13.57 3 1.27l1.2-1.4c-.95-1.02-2.1-1.65-3.45-1.9z" />
              </svg>
            }
          />
          <SummaryCard
            title="รวมยอดคงเหลือ"
            amount={totalBalance}
            unit="บาท"
            colorClass="bg-green-100 text-green-600"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15.3l-5-2.14-5 2.14V5h10v13.3z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Component 2: Payment Schedule Table */}
      <div>
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              {/* Left: Title */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v1a2 2 0 002 2h2a2 2 0 002-2v-1m3-3V8a2 2 0 00-2-2H8a2 2 0 00-2 2v6m8-6h4m-4 0H8"
                    />
                  </svg>
                </div>
                <div className="text-white">
                  <h3 className="text-xl font-bold">ตารางการผ่อนชำระ</h3>
                  <p className="text-sm text-white/80">
                    รายละเอียดการผ่อนชำระแบบงวดต่องวด
                  </p>
                </div>
              </div>

              {/* Right: Bank Selector and Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <CustomBankSelect
                  banks={banksWithResults}
                  selectedIndex={selectedBankIndex}
                  onChange={setSelectedBankIndex}
                />

                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition flex items-center gap-2"
                >
                  {showAll ? "แสดง 5 งวดแรก" : "แสดงทั้งหมด"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {/* <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    /> */}
                  </svg>
                </button>
              </div>
            </div>

            {/* Selected Bank Info */}
            {selectedBank && (
              <div className="bg-white/10 rounded-xl p-4 mb-6 text-white">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <h4 className="font-bold text-lg">
                      {THAI_BANKS.find(
                        (b) => b.value === selectedBank.bank
                      )?.label?.replace(/^\d+\.\s*/, "") || selectedBank.bank}
                    </h4>
                    <div className="flex gap-2 text-xs">
                      <span className="bg-emerald-100/20 text-emerald-100 px-2 py-1 rounded">
                        MRR {selectedBank.MRR}%
                      </span>
                      <span className="bg-blue-100/20 text-blue-100 px-2 py-1 rounded">
                        ดอกเบี้ย {selectedBank.fixed_interest}%
                      </span>
                      <span className="bg-purple-100/20 text-purple-100 px-2 py-1 rounded">
                        {selectedBank.fixed_year === 0
                          ? "ดอกเบี้ยลอยตลอด"
                          : `Fixed ${selectedBank.fixed_year}ปี`}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-white/80">รวมจ่าย:</span>
                    <span className="font-bold ml-1">
                      {formatCurrency(
                        selectedBank.summary.total_principal +
                          selectedBank.summary.total_interest
                      )}{" "}
                      บาท
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl overflow-hidden">
              <ScheduleTable
                schedule={selectedBank.schedule}
                displaySchedule={
                  showAll
                    ? selectedBank.schedule
                    : selectedBank.schedule.slice(0, 10)
                }
                showAll={showAll}
                setShowAll={setShowAll}
                monthly_payment={monthly_payment}
                bankLabel={
                  THAI_BANKS.find(
                    (b) => b.value === selectedBank.bank
                  )?.label?.replace(/^\d+\.\s*/, "") || selectedBank.bank
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedResults;
