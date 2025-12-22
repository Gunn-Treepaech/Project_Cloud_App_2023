import React from 'react';
import { THAI_BANKS } from '../../constants';

const formatInputNumber = (value) => {
    // ลบทุก non-digit ออกก่อน
    const num = value.replace(/,/g, '');
    if (!num) return '';
    // แปลงเป็นตัวเลขแล้ว format
    const n = parseFloat(num);
    if (isNaN(n)) return '';
    return n.toLocaleString('th-TH');
};

const InputForm = ({
    inputs,
    backendConfigs,
    handleChange,
    handleConfigChange,
    calculateMortgage,
    isLoading,
    onBankChange,
    bankInfo
}) => {

    // handler สำหรับเปลี่ยนธนาคาร
    const handleBankChange = (e) => {
        handleChange({ target: { name: 'bank', value: e.target.value } });
        if (onBankChange) {
            onBankChange(e.target.value);
        }
    };

    const isOtherBank = inputs.bank === 'OTHER';

    return (
        <div className="lg:col-span-1 p-6 bg-white shadow-lg rounded-xl border border-gray-200 h-fit">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">ข้อมูลสินเชื่อ</h2>
            
            <label className="form-control w-full mb-3">
                <div className="label"><span className="label-text">จำนวนเงินกู้</span></div>
                <div className="join w-full">
                    <input
                        type="text"
                        name="initial_loan"
                        value={inputs.initial_loan ? formatInputNumber(inputs.initial_loan.toString()) : ''}
                        onChange={e => {
                            // ลบ , แล้วแปลงเป็นตัวเลข
                            const raw = e.target.value.replace(/,/g, '');
                            const num = parseFloat(raw) || 0;
                            handleChange({ target: { name: 'initial_loan', value: num, type: 'number' } });
                        }}
                        className="input input-bordered border-gray-300 pl-4 pr-4 py-2 shadow-md w-full join-item"
                        placeholder="3,000,000"
                        min="1"
                        inputMode="numeric"
                        pattern="[0-9,]*"
                    />
                    <span className="btn btn-ghost join-item pointer-events-none">บาท</span>
                </div>
            </label>

            <label className="form-control w-full mb-3">
                <div className="label"><span className="label-text">จำนวนเงินผ่อนต่อเดือน</span></div>
                <div className="join w-full">
                    <input
                        type="text"
                        name="monthly_payment"
                        value={inputs.monthly_payment ? formatInputNumber(inputs.monthly_payment.toString()) : ''}
                        onChange={e => {
                            const raw = e.target.value.replace(/,/g, '');
                            const num = parseFloat(raw) || 0;
                            handleChange({ target: { name: 'monthly_payment', value: num, type: 'number' } });
                        }}
                        className="input input-bordered border-gray-300 pl-4 pr-4 py-2 shadow-md w-full join-item"
                        placeholder="15,000"
                        min="1"
                        inputMode="numeric"
                        pattern="[0-9,]*"
                    />
                    <span className="btn btn-ghost join-item pointer-events-none">บาท</span>
                </div>
            </label>
            
            <label className="form-control w-full mb-3">
                <div className="label flex items-center justify-between">
                    <span className="label-text">ธนาคาร</span>
                    {bankInfo?.update_MRR && (
                        <span className="text-xs text-gray-500 ml-2">อัพเดตล่าสุด: {bankInfo.update_MRR}</span>
                    )}
                </div>
                <select 
                    name="bank"
                    value={inputs.bank}
                    onChange={handleBankChange}
                    className="select select-bordered border-gray-300 pl-4 pr-4 py-2 shadow-md"
                >
                    {THAI_BANKS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </label>
            <div className="grid grid-cols-2 gap-3 mb-3">
                <label className="form-control">
                    <div className="label"><span className="label-text">MRR</span></div>
                    <div className="join w-full">
                        <input
                            type="number"
                            name="MRR"
                            value={inputs.MRR}
                            onChange={handleChange}
                            className="input input-bordered border-gray-300 pl-4 pr-4 py-2 shadow-md w-full join-item"
                            step="0.01" min="0"
                            placeholder={isOtherBank ? "0" : ""}
                        />
                        <span className="btn btn-ghost join-item pointer-events-none">%</span>
                    </div>
                </label>
                <label className="form-control">
                    <div className="label"><span className="label-text">อัตราดอกเบี้ยคงที่</span></div>
                    <div className="join w-full">
                        <input
                            type="number"
                            name="fixed_interest"
                            value={inputs.fixed_interest}
                            onChange={handleChange}
                            className="input input-bordered border-gray-300 pl-4 pr-4 py-2 shadow-md w-full join-item"
                            step="0.01" min="0"
                            placeholder={isOtherBank ? "0" : ""}
                        />
                        <span className="btn btn-ghost join-item pointer-events-none">%</span>
                    </div>
                </label>
            </div>
            
            {/* ตั้งค่าการเปลี่ยนดอกเบี้ย */}
            <div className="p-4 border rounded-xl bg-gray-50 mb-4 shadow-sm">

                <h3 className="font-semibold text-gray-700 mb-3">
                    ตั้งค่าการเปลี่ยนดอกเบี้ย
                </h3>

                {/* Dropdown Fixed Year */}
                <label className="form-control mb-4">
                    <div><span className="label-text text-sm text-gray-600">
                        Fixed Rate นาน (ปี)
                    </span></div>

                    <select
                        name="fixed_year"
                        value={backendConfigs.fixed_year}
                        onChange={(e) => {
                            const v = parseInt(e.target.value);
                            handleConfigChange({
                                target: { name: "fixed_year", value: v, type: "number" }
                            });

                            // reset ช่องเมื่อเปลี่ยนปี
                            handleConfigChange({
                                target: { name: "chang_interest_discount1", value: 0, type: "number" }
                            });
                            handleConfigChange({
                                target: { name: "chang_interest_discount2", value: 0, type: "number" }
                            });
                        }}
                        className="select select-bordered border-gray-300 shadow-sm px-4 py-2"
                    >
                        <option value={0}>ไม่มี Fixed Rate (ดอกเบี้ยลอยตลอด)</option>
                        <option value={1}>1 ปี</option>
                        <option value={2}>2 ปี</option>
                        <option value={3}>3 ปี</option>
                    </select>
                </label>

                {/* fixed_year = 1 → 2 ช่อง */}
                {backendConfigs.fixed_year === 1 && (
                    <>
                        <label className="form-control mb-3">
                            <div><span className="label-text text-xs text-gray-500">
                                ส่วนลด MRR ในปีที่ 2
                            </span></div>
                            <input
                                type="number"
                                name="chang_interest_discount1"
                                value={backendConfigs.chang_interest_discount1}
                                onChange={handleConfigChange}
                                className="input input-bordered input-sm shadow px-4 py-2"
                                step="0.01"
                                min="0"
                            />
                        </label>

                        <label className="form-control mb-3">
                            <div><span className="label-text text-xs text-gray-500">
                                ส่วนลด MRR ในปีที่ 3
                            </span></div>
                            <input
                                type="number"
                                name="chang_interest_discount2"
                                value={backendConfigs.chang_interest_discount2}
                                onChange={handleConfigChange}
                                className="input input-bordered input-sm shadow px-4 py-2"
                                step="0.01"
                                min="0"
                            />
                        </label>
                    </>
                )}

                {/* fixed_year = 2 → 1 ช่อง */}
                {backendConfigs.fixed_year === 2 && (
                    <label className="form-control mb-3">
                        <div><span className="label-text text-xs text-gray-500">
                            ส่วนลด MRR ในปีที่ 3
                        </span></div>
                        <input
                            type="number"
                            name="chang_interest_discount1"
                            value={backendConfigs.chang_interest_discount1}
                            onChange={handleConfigChange}
                            className="input input-bordered input-sm shadow px-4 py-2"
                            step="0.01"
                            min="0"
                        />
                    </label>
                )}

                {/* fixed_year = 3 → ไม่ต้องใส่อะไร */}
                {backendConfigs.fixed_year === 3 && (
                    <p className="text-xs text-gray-400">
                        อัตราดอกเบี้ยคงที่ครบ 3 ปี — ไม่มีการเปลี่ยนดอกเบี้ย
                    </p>
                )}

            </div>

            <label className="form-control w-full mb-6">
                <div className="label"><span className="label-text">เริ่มต้น</span></div>
                <input
                    type="date"
                    name="start_date"
                    value={inputs.start_date}
                    onChange={handleChange}
                    className="input input-bordered border-gray-300 pl-4 pr-4 py-2 shadow-md"
                />
            </label>

            <button
                className="w-full py-2 mt-4 bg-blue-600 text-white text-lg rounded shadow-md"
                onClick={calculateMortgage}
                disabled={isLoading}
            >
                {isLoading ? (
                    <span className="loading loading-spinner"></span>
                ) : (
                    'คำนวณ'
                )}
            </button>
        </div>
    );
};

export default InputForm;