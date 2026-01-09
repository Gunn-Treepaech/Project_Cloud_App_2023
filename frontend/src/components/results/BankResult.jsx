import React, { useState } from "react";
import { PieChart, SummaryCard } from "../../components";
import ScheduleTable from "../tables/ScheduleTable";
import { formatCurrency } from "../../utils";
import { THAI_BANKS } from "../../constants";

const BankResult = ({ bank, monthly_payment }) => {
  const [showAll, setShowAll] = useState(false);

  if (!bank || !bank.schedule || bank.schedule.length === 0) {
    return null;
  }

  const totalRepaid =
    bank.summary.total_principal + bank.summary.total_interest;
  const principalPercent =
    totalRepaid > 0 ? (bank.summary.total_principal / totalRepaid) * 100 : 50;
  const interestPercent =
    totalRepaid > 0 ? (bank.summary.total_interest / totalRepaid) * 100 : 50;
  const bankLabel =
    THAI_BANKS.find((b) => b.value === bank.bank)?.label || bank.bank;

  return (
    <div className="space-y-6">
      {/* Bank Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">{bankLabel}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>MRR: {bank.MRR}%</span>
          <span>ดอกเบี้ยคงที่: {bank.fixed_interest}%</span>
          <span>Fixed Rate: {bank.fixed_year === 0 ? 'ดอกเบี้ยลอยตลอด' : `${bank.fixed_year} ปี`}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          title="เงินต้นที่ตัดได้"
          amount={bank.summary.total_principal}
          unit="บาท"
          colorClass="bg-blue-100 text-blue-600"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          }
        />
        <SummaryCard
          title="ดอกเบี้ยที่จ่าย"
          amount={bank.summary.total_interest}
          unit="บาท"
          colorClass="bg-yellow-100 text-yellow-600"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.88 15.68c-.62-.22-1.27-.47-1.92-.68-.18-.06-.35-.11-.53-.17v-1.77c.33.11.66.21 1 .31.34.1.68.21 1.02.32.34.1.65.22.95.32.3.11.56.24.78.39.22.15.39.34.51.57.12.23.18.49.18.82 0 .42-.14.75-.41 1.02-.27.27-.67.4-1.21.4-.46 0-.87-.14-1.23-.42zm2.14-5.35c-.44-.24-.92-.45-1.42-.64-.5-.18-1-.34-1.5-.48v-2.02c.48.11.96.22 1.44.33.48.11.93.22 1.35.34.42.11.77.26 1.05.45.28.19.45.43.51.72.06.3-.01.54-.23.77-.22.23-.59.39-1.11.48zM12 11.2V7.5h1.25V6H9.5v1.5h1.25V11.2c-1.35.25-2.5.88-3.45 1.9L9 14.5c.87-.7 1.95-1.12 3-1.27 1.05.15 2.13.57 3 1.27l1.2-1.4c-.95-1.02-2.1-1.65-3.45-1.9z" />
            </svg>
          }
        />
        <SummaryCard
          title="ยอดคงเหลือ"
          amount={bank.summary.remaining_balance}
          unit="บาท"
          colorClass="bg-green-100 text-green-600"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15.3l-5-2.14-5 2.14V5h10v13.3z" />
            </svg>
          }
        />
      </div>

      {/* Chart and Schedule Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="lg:col-span-1">
          <div className="card shadow-lg bg-white rounded-xl border border-gray-200 h-full">
            <div className="card-body p-6">
              <h4 className="card-title text-gray-700 text-center">
                สัดส่วนการชำระเงิน
              </h4>
              <div className="flex flex-col items-center justify-center mt-4">
                <PieChart
                  principalPercent={principalPercent}
                  interestPercent={interestPercent}
                />
                <div className="space-y-2 mt-4 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                      <span className="text-gray-600 text-sm">เงินกู้</span>
                    </div>
                    <span className="text-gray-600 font-medium">
                      {formatCurrency(principalPercent)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                      <span className="text-gray-600 text-sm">ดอกเบี้ย</span>
                    </div>
                    <span className="text-gray-600 font-medium">
                      {formatCurrency(interestPercent)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg h-full">
            <div className="p-6 flex flex-col gap-4">
              {/* ===== Header Row ===== */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* LEFT : Title */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    📄
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">
                      ตารางการผ่อนชำระ
                    </h4>
                    <p className="text-sm text-white/80">
                      รายละเอียดการผ่อนชำระแบบงวดต่องวด
                    </p>
                  </div>
                </div>

                {/* RIGHT : Select + Button */}
                <div className="flex items-center gap-3">
                  <select
                    className="px-4 py-2 rounded-lg bg-white/90 text-gray-800 text-sm
                       focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <option>ธนาคารที่ 1 - KTB</option>
                  </select>

                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="flex items-center gap-2
                       px-4 py-2 rounded-lg
                       bg-white/20 hover:bg-white/30
                       text-white text-sm font-medium
                       transition"
                  >
                    แสดงทั้งหมด
                  </button>
                </div>
              </div>

              {/* ===== Table ===== */}
              <div className="bg-white rounded-xl overflow-x-auto">
                <ScheduleTable
                  schedule={bank.schedule}
                  displaySchedule={
                    showAll ? bank.schedule : bank.schedule.slice(0, 5)
                  }
                  showAll={showAll}
                  setShowAll={setShowAll}
                  monthly_payment={monthly_payment}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankResult;
