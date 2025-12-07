import React from 'react';
import { PieChart } from '../../components';
import { formatCurrency } from '../../utils';
import { THAI_BANKS } from '../../constants';

const MultiChartView = ({ banks }) => {
    const banksWithResults = banks.filter(bank => bank.schedule && bank.schedule.length > 0);

    if (banksWithResults.length === 0) {
        return null;
    }

    return (
        <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">สัดส่วนการชำระเงินต่อธนาคาร</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {banksWithResults.map((bank, index) => {
                    const totalRepaid = bank.summary.total_principal + bank.summary.total_interest;
                    const principalPercent = totalRepaid > 0 ? (bank.summary.total_principal / totalRepaid) * 100 : 50;
                    const interestPercent = totalRepaid > 0 ? (bank.summary.total_interest / totalRepaid) * 100 : 50;
                    const bankLabel = THAI_BANKS.find(b => b.value === bank.bank)?.label || bank.bank;

                    return (
                        <div key={index} className="card shadow-lg bg-white rounded-xl border border-gray-200">
                            <div className="card-body p-4">
                                <h4 className="font-semibold text-gray-700 text-center mb-2">{bankLabel}</h4>

                                {/* Chart */}
                                <div className="flex justify-center mb-3">
                                    <PieChart
                                        principalPercent={principalPercent}
                                        interestPercent={interestPercent}
                                    />
                                </div>

                                {/* Legend */}
                                <div className="space-y-1 text-xs">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className="block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                                            <span className="text-gray-600">เงินต้น</span>
                                        </div>
                                        <span className="text-gray-600 font-medium">{formatCurrency(principalPercent)}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className="block w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                                            <span className="text-gray-600">ดอกเบี้ย</span>
                                        </div>
                                        <span className="text-gray-600 font-medium">{formatCurrency(interestPercent)}%</span>
                                    </div>
                                </div>

                                {/* Bank Info */}
                                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 text-center">
                                    MRR {bank.MRR}% | ดอกเบี้ย {bank.fixed_interest}%
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MultiChartView;