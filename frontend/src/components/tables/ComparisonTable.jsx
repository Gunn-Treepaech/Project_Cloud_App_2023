import React from "react";
import { formatCurrency } from "../../utils";
import { THAI_BANKS } from "../../constants";
import { Trophy, TrendingUp, TrendingDown } from "lucide-react";

const ComparisonTable = ({ banks, initialLoan, monthly_payment }) => {
  if (!banks || banks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        ไม่มีข้อมูลการเปรียบเทียบ
      </div>
    );
  }

  const filteredBanks = banks
    .map((bank, index) => ({ ...bank, originalIndex: index }))
    .filter((bank) => bank.summary && bank.schedule && bank.schedule.length > 0)
    .sort((a, b) => a.originalIndex - b.originalIndex);

  return (
    <div className="overflow-x-auto">
      <table className="table table-compact w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left">ธนาคาร</th>
            <th className="text-center">MRR (%)</th>
            <th className="text-center">ดอกเบี้ยคงที่ (%)</th>
            <th className="text-center">Fixed Rate (ปี)</th>
            <th className="text-right">เงินผ่อนทั้งหมด</th>
            <th className="text-right">ชำระเงินกู้</th>
            <th className="text-right">ชำระดอกเบี้ย</th>
            <th className="text-right">ยอดคงเหลือ</th>
            <th className="text-center min-w-[140px]">สถานะการเงิน</th>
          </tr>
        </thead>
        <tbody>
          {filteredBanks.map((bank, index) => {
            const monthlyPaymentNumber =
              typeof monthly_payment === "string"
                ? parseFloat(monthly_payment) || 0
                : monthly_payment || 0;

            const totalPaid = bank.schedule.length * monthlyPaymentNumber;

            // --- หัวใจสำคัญของ Logic ที่คุณต้องการ ---
            // คำนวณส่วนต่างระหว่าง ยอดหนี้คงเหลือสุดท้าย กับ ยอดเงินกู้เริ่มต้น
            const finalRemainingBalance = bank.summary.remaining_balance;
            const balanceDifference = finalRemainingBalance - initialLoan;

            // หนี้ลดลง คือ ยอดคงเหลือสุดท้าย น้อยกว่า ยอดเริ่มต้น (ค่า difference จะเป็นลบ)
            // const isDebtReduced = finalRemainingBalance < initialLoan;
            // หนี้เพิ่มขึ้น คือ ยอดคงเหลือสุดท้าย มากกว่า ยอดเริ่มต้น (ค่า difference จะเป็นบวก)
            const isDebtIncreased = finalRemainingBalance > initialLoan;

            const displayLabel = (
              bank.bankLabel ||
              THAI_BANKS.find((b) => b.value === bank.bank)?.label ||
              bank.bank
            )?.replace(/^\d+\.\s*/, "");

            return (
              <tr
                key={bank.originalIndex}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="font-medium">{displayLabel}</td>
                <td className="text-center">{bank.MRR || 0}</td>
                <td className="text-center">{bank.fixed_interest || 0}</td>
                <td className="text-center">{bank.fixed_year || 0}</td>
                <td className="text-right font-mono text-black">
                  {formatCurrency(totalPaid)}
                </td>
                <td className="text-right font-mono text-blue-700">
                  {formatCurrency(bank.summary.total_principal)}
                </td>
                <td
                  className="text-right font-mono text-[#FBBF24]"
                  // style={{ color: "#FBBF24" }}
                >
                  {formatCurrency(bank.summary.total_interest)}
                </td>

                {/* ช่อง ยอดคงเหลือ: แสดงยอดคงเหลือจริง */}
                <td className="text-right font-mono">
                  {formatCurrency(finalRemainingBalance)}
                </td>

                {/* ช่อง สถานะการเงิน: แสดงจำนวนเงินกู้ที่ลด/เพิ่ม */}
                {/* <td className="text-center">
                  {finalRemainingBalance <= 0 ? (
                    <div className="flex flex-col items-center gap-1">
                      <span className="badge badge-success text-white">ชำระทั้งหมด</span>
                    </div>
                  ) : isDebtIncreased ? (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-red-500 font-semibold">
                        จำนวนเงินกู้ ∧ {formatCurrency(balanceDifference)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-green-600 font-semibold">
                        จำนวนเงินกู้ ∨ {formatCurrency(Math.abs(balanceDifference))}
                      </span>
                    </div>
                  )}
                </td> */}
                <td className="text-center">
                  {finalRemainingBalance <= 0 ? (
                    /* สถานะเมื่อปิดยอดหนี้ได้สำเร็จ */
                    <div className="flex flex-col items-center gap-1">
                      <span className="badge badge-success text-white py-3 px-4 font-semibold flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        ปิดยอดเงินกู้สมบูรณ์
                      </span>
                    </div>
                  ) : isDebtIncreased ? (
                    /* สถานะเมื่อดอกเบี้ยสูงจนยอดกู้เพิ่มขึ้น */
                    <div className="flex flex-col items-center gap-1">
                      <span className="badge badge-error text-white text-[10px] px-2 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        ภาระเงินกู้เพิ่มขึ้น
                      </span>
                      <div className="flex flex-col items-center">
                        <span className="text-[13px] text-red-600 font-bold">
                          {formatCurrency(balanceDifference)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* สถานะปกติเมื่อการผ่อนชำระสามารถลดเงินกู้ลงได้ */
                    <div className="flex flex-col items-center gap-1">
                      <span className="badge badge-info text-white text-[10px] px-2 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        ภาระเงินกู้ลดลง
                      </span>
                      <div className="flex flex-col items-center">
                        <span className="text-[13px] text-green-700 font-bold">
                          {formatCurrency(Math.abs(balanceDifference))}
                        </span>
                      </div>
                    </div>
                  )}
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
