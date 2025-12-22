import React, { useState } from 'react';
import ScheduleTable from '../tables/ScheduleTable';

const SelectableScheduleTable = ({ banks, monthly_payment }) => {
    const [selectedBankIndex, setSelectedBankIndex] = useState(0);
    const [showAll, setShowAll] = useState(false);
    const banksWithResults = banks.filter(bank => bank.schedule && bank.schedule.length > 0);

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
                                <select
                                    value={selectedBankIndex}
                                    onChange={(e) => {
                                        setSelectedBankIndex(parseInt(e.target.value));
                                        setShowAll(false);
                                    }}
                                    className="select select-bordered bg-white/10 backdrop-blur-sm text-white border-white/20 focus:border-white/50 focus:bg-white/20 appearance-none pr-10 min-w-[200px]"
                                >
                                    {banksWithResults.map((bank, index) => {
                                        const bankLabel = bank.bank;
                                        return (
                                            <option key={index} value={index} className="text-gray-800">
                                                ธนาคารที่ {index + 1} - {bankLabel}
                                            </option>
                                        );
                                    })}
                                </select>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-white/70">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
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
                                {monthly_payment ? monthly_payment.toLocaleString('th-TH') : '0'} บาท
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
                                <span className="text-xs text-gray-500">(แสดง 5 รายการแรก)</span>
                            )}
                        </div>
                    </div>
                    <div className="overflow-hidden">
                        <ScheduleTable
                            schedule={selectedBank.schedule}
                            displaySchedule={showAll ? selectedBank.schedule : selectedBank.schedule.slice(0, 5)}
                            showAll={showAll}
                            setShowAll={setShowAll}
                            monthly_payment={monthly_payment}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectableScheduleTable;