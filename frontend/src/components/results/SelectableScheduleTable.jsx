import React, { useState, useRef, useEffect } from 'react';
import { THAI_BANKS } from '../../constants';
import ScheduleTable from '../tables/ScheduleTable';
import { formatCurrency } from '../../utils';

// Custom Bank Select Component
const CustomBankSelect = ({ banks, selectedIndex, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    const selectedBank = banks[selectedIndex];
    const thaiBankName = THAI_BANKS.find(b => b.value === selectedBank.bank)?.label || selectedBank.bank;

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
                className="relative bg-white text-gray-800 border-0 shadow-lg rounded-xl px-4 py-2.5 pr-10 min-w-[220px] font-medium cursor-pointer hover:shadow-xl focus:ring-2 focus:ring-indigo-300 transition-all duration-200 text-left"
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
                            const bankThaiName = THAI_BANKS.find(b => b.value === bank.bank)?.label || bank.bank;
                            const isSelected = index === selectedIndex;
                            return (
                                <button
                                    key={index}
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

const SelectableScheduleTable = ({ banks, monthly_payment }) => {
    const [selectedBankIndex, setSelectedBankIndex] = useState(0);
    const [showAll, setShowAll] = useState(false);
    const banksWithResults = banks.filter(bank => bank.schedule && bank.schedule.length > 0);

    // Convert monthly_payment to number for proper display
    const monthlyPaymentNumber = typeof monthly_payment === 'string'
        ? parseFloat(monthly_payment) || 0
        : (monthly_payment || 0);

    if (banksWithResults.length === 0) {
        return null;
    }

    const selectedBank = banksWithResults[selectedBankIndex];

    return (
        <div className="card bg-gradient-to-br from-slate-50 to-white shadow-xl border-0 rounded-2xl overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold">ตารางการผ่อนชำระ</h3>
                            <p className="text-indigo-100 text-sm mt-1">ดูรายละเอียดการผ่อนชำระแบบงวดต่องวด</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-indigo-100 text-xs font-medium">เลือกธนาคาร</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-xl blur-sm"></div>
                                <CustomBankSelect
                                    banks={banksWithResults}
                                    selectedIndex={selectedBankIndex}
                                    onChange={(index) => {
                                        setSelectedBankIndex(index);
                                        setShowAll(false);
                                    }}
                                />
                            </div>
                        </div>
                        {/* <button
                            className="btn bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30 backdrop-blur-sm transition-all duration-200"
                            onClick={() => setShowAll(!showAll)}
                        >
                            {showAll ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5v14M5 5v14" />
                                    </svg>
                                    แสดง 5 รายการ
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                    </svg>
                                    แสดงทั้งหมด
                                </>
                            )}
                        </button> */}
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
                {/* Bank Info Header */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 mb-6 border border-indigo-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                                {banks.indexOf(selectedBank) + 1}
                            </div>
                            <div>
                                <span className="font-bold text-gray-800 text-lg">{selectedBank.bank}</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                                        MRR: {selectedBank.MRR}%
                                    </span>
                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                                        ดอกเบี้ย: {selectedBank.fixed_interest}%
                                    </span>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                        Fixed: {selectedBank.fixed_year === 0 ? 'ดอกเบี้ยลอยตลอด' : `${selectedBank.fixed_year} ปี`}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500">เงินผ่อนต่อเดือน</div>
                            <div className="text-xl font-bold text-gray-800">
                                {formatCurrency(monthlyPaymentNumber)} บาท
                            </div>
                        </div>
                    </div>
                </div>

                {/* Schedule Table */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-600">ตารางกำหนดการผ่อนชำระ</span>
                            {!showAll && (
                                <span className="text-xs text-gray-500">(แสดง 10 รายการแรก)</span>
                            )}
                        </div>
                    </div>
                    <div className="overflow-hidden">
                        <ScheduleTable
                            schedule={selectedBank.schedule}
                            displaySchedule={showAll ? selectedBank.schedule : selectedBank.schedule.slice(0, 10)}
                            showAll={showAll}
                            setShowAll={setShowAll}
                            monthly_payment={monthlyPaymentNumber}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectableScheduleTable;