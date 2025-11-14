import React, { useState, useCallback, useEffect } from 'react';
import PieChart from './components/PieChart';
import SummaryCard from './components/SummaryCard';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ScheduleTable from './components/ScheduleTable';
import { formatCurrency, monthNames } from './utils';
import ErrorAlert from './components/ErrorAlert';

// กำหนด URL ของ Flask API
const API_BASE_URL = 'http://localhost:5000'; 

// Component หลัก
const App = () => {
    // ----------------------------------------------------
    // 1. STATE MANAGEMENT
    // ----------------------------------------------------
    const today = new Date();
    const [inputs, setInputs] = useState({
        initial_loan: 0,
        monthly_payment: 0,
        bank: 'ธนาคารกสิกรไทย',
        MRR: 0,
        fixed_interest: 0,
        start_date: today.toISOString().substring(0, 10), // YYYY-MM-DD
    });

    // Inputs
    const [backendConfigs, setBackendConfigs] = useState({
        fixed_year: 0, // ปีคงที่ของดอกเบี้ย
        // ส่วนลด MRR สำหรับปีถัดไป
        chang_interest_discount1: 0,
        chang_interest_discount2: 0,
    });

    const [schedule, setSchedule] = useState([]);
    const [summary, setSummary] = useState({
        total_principal: 0,
        total_interest: 0,
        remaining_balance: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const [bankInfo, setBankInfo] = useState({ update_MRR: '' });

    // ดึงข้อมูลธนาคารกสิกรไทยตั้งแต่เริ่มต้น
    useEffect(() => {
        fetchBankData('ธนาคารกสิกรไทย');
    }, []);
    // ----------------------------------------------------
    // 2. HANDLERS & API CALL
    // ----------------------------------------------------
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setInputs(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value,
        }));
    };
    
    const handleConfigChange = (e) => {
        const { name, value, type } = e.target;
        setBackendConfigs(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value,
        }));
    };

    const calculateMortgage = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setSchedule([]);
        setSummary({ total_principal: 0, total_interest: 0, remaining_balance: 0 });

        const dateParts = inputs.start_date.split('-');
        const startYear = parseInt(dateParts[0]) + 543; // แปลงเป็น พ.ศ.
        const startMonth = parseInt(dateParts[1]);

        // เตรียม chang_interest
        let chang_interest_for_backend = [];
        if (backendConfigs.fixed_year === 1) {
            chang_interest_for_backend = [
                backendConfigs.chang_interest_discount1 / 100, // Year 2 discount
                backendConfigs.chang_interest_discount2 / 100  // Year 3 discount
            ];
        } else if (backendConfigs.fixed_year === 2) {
            chang_interest_for_backend = [
                backendConfigs.chang_interest_discount1 / 100, // Year 3 discount
            ];
        } else {
            chang_interest_for_backend = [
                backendConfigs.chang_interest_discount1 / 100,
                backendConfigs.chang_interest_discount2 / 100
            ];
        }

        const payload = {
            start_month: startMonth,
            start_year: startYear,
            initial_loan: inputs.initial_loan,
            monthly_payment: inputs.monthly_payment,
            bank: inputs.bank,
            
            // แปลง % เป็นทศนิยมสำหรับ
            fixed_interest: inputs.fixed_interest / 100, 
            MRR: inputs.MRR / 100,
            
            // Backend config
            fixed_year: backendConfigs.fixed_year,
            chang_interest: chang_interest_for_backend,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/calculate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch calculation results.');
            }

            // เนื่องจาก Backend คืนค่าเป็น Object ที่มี Key เป็นชื่อธนาคาร
            const bankKey = Object.keys(data)[0];
            const resultSchedule = data[bankKey];

            // Calculate Summary (from 36-period schedule)
            const totalPrincipal = resultSchedule.reduce((sum, item) => sum + item.balance, 0);
            const totalInterest = resultSchedule.reduce((sum, item) => sum + item.interest, 0);
            const remainingBalance = resultSchedule.length > 0 ? resultSchedule[resultSchedule.length - 1].remaining : inputs.initial_loan;

            setSchedule(resultSchedule);
            setSummary({
                total_principal: totalPrincipal,
                total_interest: totalInterest,
                remaining_balance: remainingBalance,
            });

        } catch (err) {
            console.error('API Error:', err.message);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [inputs, backendConfigs]);

    // ดึงข้อมูลธนาคารจาก backend ทุกครั้งที่เลือกธนาคาร
    const fetchBankData = async (bankName) => {
        if (bankName === 'OTHER') {
            setInputs(prev => ({
                ...prev,
                MRR: '',
                fixed_interest: ''
            }));
            setBankInfo({ update_MRR: '' });
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/api/bank-info?bank=${encodeURIComponent(bankName)}`);
            const data = await response.json();
            setInputs(prev => ({
                ...prev,
                MRR: data.MRR ?? 0,
                fixed_interest: data.fixed_interest ?? 0
            }));
            setBankInfo({
                update_MRR: data.update_MRR ?? ''
            });
        } catch (err) {
            setBankInfo({ update_MRR: '' });
        }
    };
    // ----------------------------------------------------
    // 3. UI RENDERING
    // ----------------------------------------------------
    const displaySchedule = showAll ? schedule : schedule.slice(0, 5);
    // คำนวณเปอร์เซ็นต์สำหรับ Pie Chart
    const totalRepaid = summary.total_principal + summary.total_interest;
    const principalPercent = totalRepaid > 0 ? (summary.total_principal / totalRepaid) * 100 : 50;
    const interestPercent = totalRepaid > 0 ? (summary.total_interest / totalRepaid) * 100 : 50;

    return (
        <div className="min-h-screen bg-gray-50" data-theme="light">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">คำนวณสินเชื่อบ้าน</h1>
                <p className="text-center text-gray-500 mb-10">คำนวณเงินผ่อน ดอกเบี้ย และวางแผนการชำระสินเชื่อบ้านของคุณ</p>
                <ErrorAlert error={error} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Input Form */}
                    <InputForm
                        inputs={inputs}
                        backendConfigs={backendConfigs}
                        handleChange={handleChange}
                        handleConfigChange={handleConfigChange}
                        calculateMortgage={calculateMortgage}
                        isLoading={isLoading}
                        onBankChange={fetchBankData}
                        bankInfo={bankInfo}
                    />
                    {/* Right Columns: Summary and Chart */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <SummaryCard 
                                title="จำนวนเงินต้นที่ตัดได้ (36 งวด)"
                                amount={summary.total_principal}
                                unit="บาท"
                                colorClass="bg-blue-100 text-blue-600"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>}
                            />
                            <SummaryCard 
                                title="จำนวนจ่ายดอกเบี้ย (36 งวด)"
                                amount={summary.total_interest}
                                unit="บาท"
                                colorClass="bg-yellow-100 text-yellow-600"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.88 15.68c-.62-.22-1.27-.47-1.92-.68-.18-.06-.35-.11-.53-.17v-1.77c.33.11.66.21 1 .31.34.1.68.21 1.02.32.34.1.65.22.95.32.3.11.56.24.78.39.22.15.39.34.51.57.12.23.18.49.18.82 0 .42-.14.75-.41 1.02-.27.27-.67.4-1.21.4-.46 0-.87-.14-1.23-.42zm2.14-5.35c-.44-.24-.92-.45-1.42-.64-.5-.18-1-.34-1.5-.48v-2.02c.48.11.96.22 1.44.33.48.11.93.22 1.35.34.42.11.77.26 1.05.45.28.19.45.43.51.72.06.3-.01.54-.23.77-.22.23-.59.39-1.11.48zM12 11.2V7.5h1.25V6H9.5v1.5h1.25V11.2c-1.35.25-2.5.88-3.45 1.9L9 14.5c.87-.7 1.95-1.12 3-1.27 1.05.15 2.13.57 3 1.27l1.2-1.4c-.95-1.02-2.1-1.65-3.45-1.9z"/></svg>}
                            />
                            <SummaryCard 
                                title="ยอดคงเหลือ (หลัง 36 งวด)"
                                amount={summary.remaining_balance}
                                unit="บาท"
                                colorClass="bg-green-100 text-green-600"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15.3l-5-2.14-5 2.14V5h10v13.3z"/></svg>}
                            />
                        </div>

                        {/* Chart Section */}
                        <div className="card shadow-lg bg-white rounded-xl border border-gray-200">
                            <div className="card-body p-6">
                                <h2 className="card-title text-gray-700">สัดส่วนการชำระเงิน (36 งวด)</h2>
                                <div className="flex flex-col md:flex-row items-center justify-around mt-4">
                                    <PieChart 
                                        principalPercent={principalPercent}
                                        interestPercent={interestPercent}
                                    />
                                    <div className="space-y-2 mt-4 md:mt-0">
                                        <div className="flex items-center">
                                            <span className="block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                                            <span className="text-gray-600">เงินต้น ({formatCurrency(principalPercent)}%)</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                                            <span className="text-gray-600">ดอกเบี้ย ({formatCurrency(interestPercent)}%)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Schedule Table */}
                        <ScheduleTable
                            schedule={schedule}
                            displaySchedule={showAll ? schedule : schedule.slice(0, 5)}
                            showAll={showAll}
                            setShowAll={setShowAll}
                            monthly_payment={inputs.monthly_payment}
                        />
                    </div>
                </div>
            </main>
            <footer className="footer footer-center p-4 bg-white text-base-content border-t mt-10">
            </footer>
        </div>
    );
};

export default App;