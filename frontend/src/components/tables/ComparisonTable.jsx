import React from "react";
import { formatCurrency } from "../../utils";
import { THAI_BANKS } from "../../constants";

const ComparisonTable = ({ banks, initialLoan }) => {
  if (!banks || banks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        ไม่มีข้อมูลการเปรียบเทียบ
      </div>
    );
  }

  // Filter banks with results and sort by their original order (1, 2, 3, ...)
  const filteredBanks = banks
    .map((bank, index) => ({ ...bank, originalIndex: index }))
    .filter((bank) => bank.summary && bank.schedule && bank.schedule.length > 0)
    .sort((a, b) => a.originalIndex - b.originalIndex);

  if (filteredBanks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        กรุณาคำนวณข้อมูลธนาคารอย่างน้อย 1 ธนาคาร
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-compact w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left">ธนาคาร</th>
            <th className="text-center">MRR (%)</th>
            <th className="text-center">ดอกเบี้ยคงที่ (%)</th>
            <th className="text-center">Fixed Rate (ปี)</th>
            <th className="text-right">เงินต้นที่ตัด (36 งวด)</th>
            <th className="text-right">ดอกเบี้ยที่จ่าย (36 งวด)</th>
            <th className="text-right">ส่วนต่างยอดคงเหลือ</th>
            <th className="text-center">% ดอกเบี้ยต่อเงินต้น</th>
          </tr>
        </thead>
        <tbody>
          {filteredBanks.map((bank, index) => {
            // const interestRatio =
            //   bank.summary.total_principal > 0
            //     ? (bank.summary.total_interest / bank.summary.total_principal) *
            //       100
            //     : 0;
            const interestRatioRaw =
              bank.summary.total_principal > 0
                ? (bank.summary.total_interest / bank.summary.total_principal) *
                  100
                : 0;

            // cap แสดงผลไม่เกิน 999% เพื่อไม่ให้ UI แตก
            const interestRatio = Math.min(interestRatioRaw, 999);

            // Use bankLabel if available (for custom banks), otherwise use bank value, then remove numbering
            const displayLabel = (
              bank.bankLabel ||
              THAI_BANKS.find((b) => b.value === bank.bank)?.label ||
              bank.bank
            )?.replace(/^\d+\.\s*/, "");

            // Calculate difference: remaining balance - initial loan
            const balanceDifference =
              bank.summary.remaining_balance - initialLoan;
            const isPaidDown = balanceDifference < 0; // Negative means debt decreased
            console.log({
  initialLoan,
  remaining_balance: bank.summary.remaining_balance,
  balanceDifference
});

            return (
              <tr
                key={bank.originalIndex}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="font-medium">{displayLabel}</td>
                <td className="text-center">{bank.MRR || 0}</td>
                <td className="text-center">{bank.fixed_interest || 0}</td>
                <td className="text-center">{bank.fixed_year || 0}</td>
                <td className="text-right font-mono">
                  {formatCurrency(bank.summary.total_principal)}
                </td>
                <td className="text-right font-mono text-yellow-600">
                  {formatCurrency(bank.summary.total_interest)}
                </td>
                {/* <td className="text-right font-mono">
                  {balanceDifference === 0 ? (
                    <span className="text-gray-500">
                      <div className="text-xs">ไม่เปลี่ยนแปลง</div>
                      <div className="font-semibold">{formatCurrency(0)}</div>
                    </span>
                  ) : isPaidDown ? (
                    <div className="text-green-600">
                      <div className="text-xs">หนี้ลด</div>
                      <div className="font-semibold">
                        {formatCurrency(Math.abs(balanceDifference))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      <div className="text-xs">หนี้เพิ่ม</div>
                      <div className="font-semibold">
                        {formatCurrency(balanceDifference)}
                      </div>
                    </div>
                  )}
                </td> */}
                <td className="text-right font-mono">
                  {balanceDifference === 0 ? (
                    <div className="text-gray-500">
                      <div className="text-xs">ไม่เปลี่ยนแปลง</div>
                      <div className="font-semibold">{formatCurrency(0)}</div>
                    </div>
                  ) : isPaidDown ? (
                    <div className="text-green-600">
                      <div className="text-xs">หนี้ลด</div>
                      <div className="font-semibold">
                        {formatCurrency(Math.abs(balanceDifference))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      <div className="text-xs">หนี้เพิ่ม</div>
                      <div className="font-semibold">
                        {formatCurrency(balanceDifference)}
                      </div>
                    </div>
                  )}
                </td>

                <td className="text-center">
                  {/* <span
                    className={`badge ${
                      interestRatio > 50
                        ? "badge-error"
                        : interestRatio > 30
                        ? "badge-warning"
                        : "badge-success"
                    }`}
                  >
                    {formatCurrency(interestRatio)}%
                  </span> */}
                  <span
                    className={`badge ${
                      interestRatioRaw > 100
                        ? "badge-error"
                        : interestRatioRaw > 50
                        ? "badge-warning"
                        : "badge-success"
                    }`}
                    title="คำนวณจาก ดอกเบี้ยที่จ่าย ÷ เงินต้นที่ตัดได้"
                  >
                    {interestRatio.toFixed(2)}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
