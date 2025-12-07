import React from 'react';
import { SummaryCard } from '../../components';
import { THAI_BANKS } from '../../constants';

const MultiSummaryCards = ({ banks }) => {
    const banksWithResults = banks.filter(bank => bank.schedule && bank.schedule.length > 0);

    if (banksWithResults.length === 0) {
        return null;
    }

    // Group by metric type
    const allPrincipals = banksWithResults.map(bank => ({
        amount: bank.summary.total_principal,
        bankName: THAI_BANKS.find(b => b.value === bank.bank)?.label || bank.bank
    }));

    const allInterests = banksWithResults.map(bank => ({
        amount: bank.summary.total_interest,
        bankName: THAI_BANKS.find(b => b.value === bank.bank)?.label || bank.bank
    }));

    const allBalances = banksWithResults.map(bank => ({
        amount: bank.summary.remaining_balance,
        bankName: THAI_BANKS.find(b => b.value === bank.bank)?.label || bank.bank
    }));

    return (
        <div className="space-y-6">
            {/* Principal Cards */}
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">เงินต้นที่ตัดได้ (36 งวด) ต่อธนาคาร</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {allPrincipals.map((item, index) => (
                        <SummaryCard
                            key={index}
                            title="เงินต้นที่ตัดได้"
                            amount={item.amount}
                            unit="บาท"
                            colorClass="bg-blue-100 text-blue-600"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>}
                            bankName={item.bankName}
                        />
                    ))}
                </div>
            </div>

            {/* Interest Cards */}
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">ดอกเบี้ยที่จ่าย (36 งวด) ต่อธนาคาร</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {allInterests.map((item, index) => (
                        <SummaryCard
                            key={index}
                            title="ดอกเบี้ยที่จ่าย"
                            amount={item.amount}
                            unit="บาท"
                            colorClass="bg-yellow-100 text-yellow-600"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.88 15.68c-.62-.22-1.27-.47-1.92-.68-.18-.06-.35-.11-.53-.17v-1.77c.33.11.66.21 1 .31.34.1.68.21 1.02.32.34.1.65.22.95.32.3.11.56.24.78.39.22.15.39.34.51.57.12.23.18.49.18.82 0 .42-.14.75-.41 1.02-.27.27-.67.4-1.21.4-.46 0-.87-.14-1.23-.42zm2.14-5.35c-.44-.24-.92-.45-1.42-.64-.5-.18-1-.34-1.5-.48v-2.02c.48.11.96.22 1.44.33.48.11.93.22 1.35.34.42.11.77.26 1.05.45.28.19.45.43.51.72.06.3-.01.54-.23.77-.22.23-.59.39-1.11.48zM12 11.2V7.5h1.25V6H9.5v1.5h1.25V11.2c-1.35.25-2.5.88-3.45 1.9L9 14.5c.87-.7 1.95-1.12 3-1.27 1.05.15 2.13.57 3 1.27l1.2-1.4c-.95-1.02-2.1-1.65-3.45-1.9z"/></svg>}
                            bankName={item.bankName}
                        />
                    ))}
                </div>
            </div>

            {/* Balance Cards */}
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">ยอดคงเหลือต่อธนาคาร</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {allBalances.map((item, index) => (
                        <SummaryCard
                            key={index}
                            title="ยอดคงเหลือ"
                            amount={item.amount}
                            unit="บาท"
                            colorClass="bg-green-100 text-green-600"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15.3l-5-2.14-5 2.14V5h10v13.3z"/></svg>}
                            bankName={item.bankName}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MultiSummaryCards;