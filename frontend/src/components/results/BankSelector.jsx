import React from 'react';
import { THAI_BANKS } from '../../constants';
import { BeautifulSelect } from '../common';

const BankSelector = ({ banks, selectedBankIndex, onBankChange }) => {
    const banksWithResults = banks.filter(bank => bank.schedule && bank.schedule.length > 0);

    if (banksWithResults.length === 0) {
        return null;
    }

    // Create options for BeautifulSelect
    const bankOptions = banksWithResults.map((bank) => {
        const originalIndex = banks.indexOf(bank);
        const bankLabel = THAI_BANKS.find(b => b.value === bank.bank)?.label || bank.bank;

        return {
            value: originalIndex,
            label: bankLabel,
            description: `MRR ${bank.MRR}% | ดอกเบี้ย ${bank.fixed_interest}%`,
            badge: 'ผลลัพธ์'
        };
    });

    return (
        <div className="flex justify-center mb-6">
            <div className="w-full max-w-md">
                <BeautifulSelect
                    value={selectedBankIndex}
                    onChange={onBankChange}
                    options={bankOptions}
                    label="เลือกธนาคารเพื่อดูรายละเอียด"
                    placeholder="เลือกธนาคารที่ต้องการดูผลลัพธ์"
                    required={false}
                />
            </div>
        </div>
    );
};

export default BankSelector;