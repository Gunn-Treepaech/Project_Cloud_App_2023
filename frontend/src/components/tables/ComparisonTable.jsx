import React from 'react';
import { formatCurrency } from '../../utils';
import { THAI_BANKS } from '../../constants';

const ComparisonTable = ({ banks }) => {
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
        .filter(bank => bank.summary && bank.schedule && bank.schedule.length > 0)
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
                        <th className="text-right">ยอดคงเหลือ</th>
                        <th className="text-center">% ดอกเบี้ยต่อเงินต้น</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBanks.map((bank, index) => {
                        const interestRatio = bank.summary.total_principal > 0
                            ? (bank.summary.total_interest / bank.summary.total_principal) * 100
                            : 0;
                        const bankLabel = THAI_BANKS.find(b => b.value === bank.bank)?.label?.replace(/^\d+\.\s*/, '') || bank.bank;

                        return (
                            <tr key={bank.originalIndex} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="font-medium">
                                    {bankLabel}
                                </td>
                                <td className="text-center">{bank.MRR || 0}</td>
                                <td className="text-center">{bank.fixed_interest || 0}</td>
                                <td className="text-center">{bank.fixed_year || 0}</td>
                                <td className="text-right font-mono">{formatCurrency(bank.summary.total_principal)}</td>
                                <td className="text-right font-mono text-yellow-600">{formatCurrency(bank.summary.total_interest)}</td>
                                <td className="text-right font-mono">{formatCurrency(bank.summary.remaining_balance)}</td>
                                <td className="text-center">
                                    <span className={`badge ${interestRatio > 50 ? 'badge-error' : interestRatio > 30 ? 'badge-warning' : 'badge-success'}`}>
                                        {formatCurrency(interestRatio)}%
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