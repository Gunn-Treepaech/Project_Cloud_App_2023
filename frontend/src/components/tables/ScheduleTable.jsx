import React from 'react';
import { formatCurrency, monthNames } from '../../utils';

const ScheduleTable = ({
    schedule,
    displaySchedule,
    showAll,
    setShowAll,
    monthly_payment
}) => (
    <div className="card shadow-lg bg-white rounded-xl border border-gray-200">
        <div className="card-body p-6">
            <h2 className="card-title text-gray-700">ตารางการชำระเงิน</h2>
            <div className="overflow-x-auto mt-4">
                <table className="table table-pin-rows w-full text-sm">
                    <thead>
                        <tr className="text-center bg-gray-50">
                            <th>งวดที่</th>
                            <th>เดือน/ปี</th>
                            <th>จ่ายชำระ</th>
                            <th>ชำระเงินกู้</th>
                            <th>ชำระดอกเบี้ย</th>
                            <th>คงเหลือ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.length === 0 && (
                            <tr><td colSpan="6" className="text-center text-gray-400">กรุณากด "คำนวณ" เพื่อดูตาราง</td></tr>
                        )}
                        {displaySchedule.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-100 text-center">
                                <th>{index + 1}</th>
                                <td>{monthNames[item.month - 1]} {item.year}</td>
                                <td className="text-center font-medium">{formatCurrency(monthly_payment)}</td>
                                <td className="text-center text-green-600">{formatCurrency(item.balance)}</td>
                                <td className="text-center text-red-500">{formatCurrency(item.interest)}</td>
                                <td className="text-center">{formatCurrency(item.remaining)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {schedule.length > 10 && (
                <div className="text-center mt-4">
                    <button
                        className="btn btn-sm btn-ghost text-blue-600"
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? 'แสดง 10 งวดแรก' : 'ดูทั้งหมด'}
                    </button>
                </div>
            )}
        </div>
    </div>
);

export default ScheduleTable;
