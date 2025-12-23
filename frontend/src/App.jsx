import React, { useState, useCallback } from "react";
import Swal from "sweetalert2";
// Import components from organized structure
import {
  Header,
  Footer,
  ErrorAlert,
  ApiStatus,
  BankInputForm,
  ComparisonTable,
  ConsolidatedResults,
  AppInput,
  AppDate,
} from "./components";
import { API_CONFIG, UI_CONFIG, THAI_BANKS } from "./constants";
import apiService from "./services/apiService";
import { AccountBalance, Payments, DateRange } from "@mui/icons-material";

// Component หลัก
const App = () => {
  // ----------------------------------------------------
  // 1. STATE MANAGEMENT
  // ----------------------------------------------------
  // const today = new Date();

  // Shared inputs (ใช้ร่วมกันทุกธนาคาร)
  const [sharedInputs, setSharedInputs] = useState({
    initial_loan: "",
    monthly_payment: "",
    // start_date: today.toISOString().substring(0, 10), // YYYY-MM-DD
    // start_date เป็นค่าว่างเพื่อให้ถ้าไม่มีการเลือก 
    start_date: "",
  });

  // Bank inputs array (รองรับ 4 ธนาคาร)
  const [banks, setBanks] = useState([
    {
      bank: "",
      MRR: 0,
      fixed_interest: 0,
      update_MRR: "",
      fixed_year: 0,
      chang_interest_discount1: 0,
      chang_interest_discount2: 0,
      schedule: [],
      summary: { total_principal: 0, total_interest: 0, remaining_balance: 0 },
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ----------------------------------------------------
  // 2. HANDLERS & API CALL
  // ----------------------------------------------------
  const handleSharedInputChange = (e) => {
    const { name, value, type } = e.target;
    setSharedInputs((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? (value === "" || value === null || value === undefined
              ? ""
              : parseFloat(value))
          : value,
    }));
  };

  const handleBankDataChange = (index, field, value) => {
    setBanks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // const addBank = () => {
  //     if (banks.length < 4) {
  //         // สลับธนาคารเริ่มต้นเป็นธนาคารอื่นๆ
  //         const nextBanks = ['','KTB', 'SCB', 'UOB'];
  //         const nextBank = nextBanks[banks.length - 1] || 'OTHER';

  //         setBanks(prev => [...prev, {
  //             bank: nextBank,
  //             MRR: 0,
  //             fixed_interest: 0,
  //             update_MRR: '',
  //             fixed_year: 0,
  //             chang_interest_discount1: 0,
  //             chang_interest_discount2: 0,
  //             schedule: [],
  //             summary: { total_principal: 0, total_interest: 0, remaining_balance: 0 }
  //         }]);
  //     }
  // };
  const addBank = () => {
    if (banks.length < 4) {
      setBanks((prev) => [
        ...prev,
        {
          bank: "", // ✅ เป็นค่าว่างตามที่ต้องการ
          MRR: 0,
          fixed_interest: 0,
          update_MRR: "",
          fixed_year: 0,
          chang_interest_discount1: 0,
          chang_interest_discount2: 0,
          schedule: [],
          summary: {
            total_principal: 0,
            total_interest: 0,
            remaining_balance: 0,
          },
        },
      ]);
    }
  };

  const removeBank = (index) => {
    if (banks.length > 1) {
      setBanks((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const calculateAllMortgages = useCallback(async () => {
    // Validate inputs first
    if (!sharedInputs.initial_loan || sharedInputs.initial_loan <= 0) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกข้อมูล",
        text: "กรุณาระบุวงเงินสินเชื่อ",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    if (!sharedInputs.monthly_payment || sharedInputs.monthly_payment <= 0) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกข้อมูล",
        text: "กรุณาระบุงวดผ่อนชำระต่อเดือน",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    // Check if at least one bank is configured
    console.log("=== DEBUG BANK VALIDATION ===");
    console.log("Current banks array length:", banks.length);
    console.log("Current banks data:", JSON.stringify(banks, null, 2)); // Debug: ดูข้อมูลธนาคารทั้งหมดแบบละเอียด

    // const configuredBanks = banks.filter((bank, index) => {
    //     const hasBank = !!bank.bank;
    //     const hasMRR = bank.MRR > 0;
    //     const hasFixedInterest = bank.fixed_interest > 0;
    //     const hasFixedYear = bank.fixed_year > 0;

    //     console.log(`Bank ${index + 1}:`, {
    //         bank: bank.bank,
    //         hasBank,
    //         MRR: bank.MRR,
    //         hasMRR,
    //         fixed_interest: bank.fixed_interest,
    //         hasFixedInterest,
    //         fixed_year: bank.fixed_year,
    //         hasFixedYear
    //     });

    //     return hasBank && hasMRR && hasFixedInterest && hasFixedYear;
    // });
    const configuredBanks = banks.filter((bank, index) => {
      const hasBank = bank.bank !== "";
      const hasMRR = Number(bank.MRR) > 0;
      const hasFixedInterest = Number(bank.fixed_interest) >= 0; // ✅ แก้ตรงนี้
      const hasFixedYear = Number(bank.fixed_year) >= 0; // ✅ และตรงนี้

      console.log(`Bank ${index + 1}:`, {
        bank: bank.bank,
        hasBank,
        MRR: bank.MRR,
        hasMRR,
        fixed_interest: bank.fixed_interest,
        hasFixedInterest,
        fixed_year: bank.fixed_year,
        hasFixedYear,
      });

      return hasBank && hasMRR && hasFixedInterest && hasFixedYear;
    });

    console.log("Configured banks count:", configuredBanks.length);
    console.log("Configured banks count:", configuredBanks);
    console.log("=== END DEBUG ===");

    if (configuredBanks.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "ยังไม่พร้อมคำนวณ",
        text: "กรุณาตั้งค่าธนาคารอย่างน้อย 1 ธนาคารให้ครบถ้วน",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    Swal.fire({
      title: "กำลังคำนวณ...",
      text: `กำลังคำนวณสินเชื่อสำหรับ ${configuredBanks.length} ธนาคาร`,
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
        // Add timeout to prevent infinite loading
        setTimeout(() => {
          if (Swal.isLoading()) {
            Swal.close();
            Swal.fire({
              icon: "warning",
              title: "คำนวณนานเกินไป",
              text: "การคำนวณใช้เวลานานกว่าที่คาดไว้ กรุณาลองใหม่อีกครั้ง",
              confirmButtonText: "ตกลง",
              confirmButtonColor: "#f59e0b",
            });
            setIsLoading(false);
          }
        }, 30000); // 30 seconds timeout
      },
    });

    setIsLoading(true);
    setError(null);

    // ตรวจสอบวันที่เริ่มต้นผ่อน
    if (!sharedInputs.start_date || sharedInputs.start_date.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "กรุณาระบุวันที่เริ่มต้นผ่อน",
        text: "วันที่เริ่มต้นผ่อนเป็นข้อมูลจำเป็น กรุณาระบุวันที่ก่อนคำนวณ",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#6366f1",
      });
      setIsLoading(false);
      return;
    }

    // ตรวจสอบรูปแบบวันที่ (YYYY-MM-DD)
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(sharedInputs.start_date)) {
      Swal.fire({
        icon: "warning",
        title: "รูปแบบวันที่ไม่ถูกต้อง",
        text: "กรุณาใช้ date picker เพื่อเลือกวันที่",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#f59e0b",
      });
      setIsLoading(false);
      return;
    }

    // ตรวจสอบความถูกต้องของวันที่
    const dateParts = sharedInputs.start_date.split("-");
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);

    if (month < 1 || month > 12) {
      Swal.fire({
        icon: "error",
        title: "เดือนไม่ถูกต้อง",
        text: "เดือนต้องอยู่ระหว่าง 1-12",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#ef4444",
      });
      setIsLoading(false);
      return;
    }

    if (day < 1 || day > 31) {
      Swal.fire({
        icon: "error",
        title: "วันที่ไม่ถูกต้อง",
        text: "วันที่ต้องอยู่ระหว่าง 1-31",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#ef4444",
      });
      setIsLoading(false);
      return;
    }

    // ตรวจสอบปี ไม่ควรเกินเกิน
    const currentYear = new Date().getFullYear();
    if (year < currentYear - 100 || year > currentYear + 100) {
      Swal.fire({
        icon: "warning",
        title: "ปีที่เลือกไม่เหมาะสม",
        text: "กรุณาเลือกปีที่ใกล้เคียาปีปัจจุบัน",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#f59e0b",
      });
      setIsLoading(false);
      return;
    }

    // ล้างข้อมูลเก่า
    setBanks((prev) =>
      prev.map((bank) => ({
        ...bank,
        schedule: [],
        summary: {
          total_principal: 0,
          total_interest: 0,
          remaining_balance: 0,
        },
        error: null,
      }))
    );

    // แปลงวันที่จาก YYYY-MM-DD เป็น พ.ศ.
    const startYear = year + 543; // แปลงเป็นพ.ศ.
    const startMonth = month;

    try {
      const results = await Promise.all(
        banks.map(async (bank) => {
          if (!bank.bank || bank.MRR === 0 || bank.fixed_interest === 0) {
            return { index: banks.indexOf(bank), data: null };
          }

          // เตรียม chang_interest สำหรับแต่ละธนาคาร
          let chang_interest_for_backend = [];
          if (bank.fixed_year === 1) {
            chang_interest_for_backend = [
              bank.chang_interest_discount1 / 100,
              bank.chang_interest_discount2 / 100,
            ];
          } else if (bank.fixed_year === 2) {
            chang_interest_for_backend = [bank.chang_interest_discount1 / 100];
          } else {
            chang_interest_for_backend = [
              bank.chang_interest_discount1 / 100,
              bank.chang_interest_discount2 / 100,
            ];
          }

          const payload = {
            start_month: startMonth,
            start_year: startYear,
            initial_loan: sharedInputs.initial_loan,
            monthly_payment: sharedInputs.monthly_payment,
            bank: bank.bank,
            fixed_interest: bank.fixed_interest / 100,
            MRR: bank.MRR / 100,
            fixed_year: bank.fixed_year,
            chang_interest: chang_interest_for_backend,
          };

          try {
            const data = await apiService.calculateLoan(payload);
            return { index: banks.indexOf(bank), data };
          } catch (err) {
            console.error(`Calculation Error for ${bank.bank}:`, err);
            return { index: banks.indexOf(bank), error: err.message };
          }
        })
      );

      // อัพเดตผลลัพธ์
      const updatedBanks = [...banks];
      let successCount = 0;
      let errorCount = 0;
      const errorDetails = []; // เก็บรายละเอียด error ทั้งหมด

      results.forEach((result) => {
        if (result.data) {
          const bankKey = Object.keys(result.data)[0];
          const resultSchedule = result.data[bankKey];

          if (resultSchedule && Array.isArray(resultSchedule)) {
            const totalPrincipal = resultSchedule.reduce(
              (sum, item) => sum + item.balance,
              0
            );
            const totalInterest = resultSchedule.reduce(
              (sum, item) => sum + item.interest,
              0
            );
            const remainingBalance =
              resultSchedule.length > 0
                ? resultSchedule[resultSchedule.length - 1].remaining
                : sharedInputs.initial_loan;

            updatedBanks[result.index] = {
              ...updatedBanks[result.index],
              schedule: resultSchedule,
              summary: {
                total_principal: totalPrincipal,
                total_interest: totalInterest,
                remaining_balance: remainingBalance,
              },
            };
            successCount++;
          }
        } else if (result.error) {
          // แสดง error แต่ยังคงข้อมูลเดิมไว้
          updatedBanks[result.index] = {
            ...updatedBanks[result.index],
            error: result.error,
          };
          errorCount++;
          // เก็บรายละเอียด error พร้อมชื่อธนาคาร
          const bankName = THAI_BANKS.find(b => b.value === banks[result.index].bank)?.label || banks[result.index].bank;
          errorDetails.push(`${bankName}: ${result.error}`);
        }
      });

      setBanks(updatedBanks);
      setError(null);

      // Show success or partial success message
      if (successCount > 0) {
        if (errorCount === 0) {
          Swal.fire({
            icon: "success",
            title: "คำนวณสำเร็จ!",
            text: `คำนวณสินเชื่อสำเร็จ ${successCount} ธนาคาร`,
            confirmButtonText: "ดูผลลัพธ์",
            confirmButtonColor: "#10b981",
            timer: 2000,
            timerProgressBar: true,
          });
        } else {
          Swal.fire({
            icon: "warning",
            title: "คำนวณเสร็จสิ้น (มีข้อผิดพลาดบางส่วน)",
            html: `คำนวณสำเร็จ ${successCount} ธนาคาร<br>เกิดข้อผิดพลาด ${errorCount} ธนาคาร<br><br>
                   <div style="text-align: left; background: #fff3cd; padding: 10px; border-radius: 5px; font-size: 12px;">
                     <strong>รายละเอียดข้อผิดพลาด:</strong><br>
                     ${errorDetails.join('<br>')}
                   </div>`,
            confirmButtonText: "ดูผลลัพธ์",
            confirmButtonColor: "#f59e0b",
          });
        }
      } else if (successCount === 0 && errorCount > 0) {
        // All calculations failed - check if it's connection error
        const firstError = errorDetails[0] || '';
        const isConnectionError =
          firstError.includes("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้") ||
          firstError.includes("การเชื่อมต่อหมดเวลา") ||
          firstError.includes("Failed to fetch") ||
          firstError.includes("NetworkError");

        Swal.fire({
          icon: isConnectionError ? "warning" : "error",
          title: isConnectionError ? "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์" : "คำนวณล้มเหลวทั้งหมด",
          html: isConnectionError
            ? `กรุณาตรวจสอบ:<br>
               <div style="text-align: left; display: inline-block; margin-top: 10px;">
                 1. เซิร์ฟเวอร์ backend ทำงานอยู่หรือไม่<br>
                 2. อินเทอร์เน็ตเชื่อมต่ออยู่หรือไม่<br>
                 3. URL เซิร์ฟเวอร์ถูกต้องหรือไม่<br>
                 <br>
                 <small style="color: #666;">รายละเอียด: ${firstError}</small>
               </div>`
            : `ไม่สามารถคำนวณสินเชื่อได้สำหรับธนาคารที่เลือกทั้งหมด<br><br>
               <div style="text-align: left; background: #fee2e2; padding: 10px; border-radius: 5px; font-size: 12px;">
                 <strong>รายละเอียดข้อผิดพลาด:</strong><br>
                 ${errorDetails.join('<br>')}
               </div>`,
          confirmButtonText: "ตกลง",
          confirmButtonColor: isConnectionError ? "#f59e0b" : "#ef4444",
        });
      } else {
        // No banks configured at all
        Swal.fire({
          icon: "info",
          title: "ไม่มีข้อมูลสำหรับคำนวณ",
          text: "กรุณาตั้งค่าธนาคารและข้อมูลที่จำเป็นก่อนคำนวณ",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#6366f1",
        });
      }
    } catch (err) {
      console.error("Calculation Error:", err);
      setError(err.message);

      // Check for connection-related errors
      const isConnectionError =
        err.message.includes("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้") ||
        err.message.includes("การเชื่อมต่อหมดเวลา") ||
        err.message.includes("Failed to fetch") ||
        err.message.includes("NetworkError");

      Swal.fire({
        icon: isConnectionError ? "warning" : "error",
        title: isConnectionError ? "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์" : "เกิดข้อผิดพลาด",
        html: isConnectionError
          ? `กรุณาตรวจสอบ:<br>
             <div style="text-align: left; display: inline-block; margin-top: 10px;">
               1. เซิร์ฟเวอร์ backend ทำงานอยู่หรือไม่<br>
               2. อินเทอร์เน็ตเชื่อมต่ออยู่หรือไม่<br>
               3. URL เซิร์ฟเวอร์ถูกต้องหรือไม่<br>
               <br>
               <small style="color: #666;">รายละเอียด: ${err.message}</small>
             </div>`
          : err.message || "ไม่สามารถคำนวณได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
        confirmButtonText: "ตกลง",
        confirmButtonColor: isConnectionError ? "#f59e0b" : "#ef4444",
      });
    } finally {
      setIsLoading(false);
      Swal.close();
    }
  }, [banks, sharedInputs]);

  // Reset all data function
  const resetAllData = useCallback(async () => {
    const result = await Swal.fire({
      title: 'ยืนยันการรีเซ็ตข้อมูล',
      text: 'คุณต้องการล้างข้อมูลทั้งหมดและเริ่มใหม่หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'ยืนยันรีเซ็ต',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      // Reset shared inputs to default values
      // const today = new Date();
      setSharedInputs({
        initial_loan: "",
        monthly_payment: "",
        // start_date: today.toISOString().substring(0, 10),
        start_date: "",
      });

      // Reset banks to initial state with one empty bank
      setBanks([{
        bank: "",
        MRR: 0,
        fixed_interest: 0,
        update_MRR: "",
        fixed_year: 0,
        chang_interest_discount1: 0,
        chang_interest_discount2: 0,
        schedule: [],
        summary: { total_principal: 0, total_interest: 0, remaining_balance: 0 },
      }]);

      // Clear any errors
      setError(null);
      setIsLoading(false);

      // Show success message
      await Swal.fire({
        title: 'รีเซ็ตข้อมูลสำเร็จ',
        text: 'ข้อมูลทั้งหมดถูกล้างเรียบร้อยแล้ว',
        icon: 'success',
        confirmButtonColor: '#10b981',
        confirmButtonText: 'ตกลง',
        timer: 2000,
        timerProgressBar: true
      });
    }
  }, []);

  // ----------------------------------------------------
  // 3. UI RENDERING
  // ----------------------------------------------------
  // เตรียมข้อมูลธนาคารสำหรับแสดงผล
  const banksWithLabels = banks.map((bank) => ({
    ...bank,
    bankLabel:
      THAI_BANKS.find((b) => b.value === bank.bank)?.label || bank.bank,
  }));

  return (
    <div className="min-h-screen bg-gray-50" data-theme="light">
      <Header />
      <ApiStatus />
      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              {/* Main Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* Background Circle */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-2xl opacity-20 transform scale-110"></div>
                  {/* Icon Container */}
                  <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center shadow-2xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 sm:h-12 sm:w-12 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    {/* Small calculator badge */}
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shadow-lg border-2 border-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                คำนวณสินเชื่อบ้าน
                <span className="block text-blue-600 mt-2">
                  เครื่องมือทางการเงินที่เชื่อถือได้
                </span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                เครื่องมือคำนวณเงินผ่อนบ้านที่แม่นยำ รองรับดอกเบี้ยแบบลอยตาม MRR
                ของธนาคารชั้นนำ
                วางแผนการเงินของคุณอย่างมั่นใจและตัดสินใจได้อย่างชาญฉลาด
              </p>
              <div className="mt-8 flex justify-center flex-wrap gap-3 sm:gap-4">
                {/* Feature 1: แม่นยำ */}
                <div className="flex items-center px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-100">
                  <div className="bg-emerald-100 rounded-full p-1 mr-2">
                    <svg
                      className="w-4 h-4 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">แม่นยำ</span>
                </div>

                {/* Feature 2: รวดเร็ว */}
                <div className="flex items-center px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-100">
                  <div className="bg-blue-100 rounded-full p-1 mr-2">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">รวดเร็ว</span>
                </div>

                {/* Feature 3: ฟรี */}
                <div className="flex items-center px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-100">
                  <div className="bg-purple-100 rounded-full p-1 mr-2">
                    <svg
                      className="w-4 h-4 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">ฟรี</span>
                </div>

                {/* Feature 4: เปรียบเทียบได้ */}
                <div className="flex items-center px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-100">
                  <div className="bg-orange-100 rounded-full p-1 mr-2">
                    <svg
                      className="w-4 h-4 text-orange-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">เปรียบเทียบได้</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ErrorAlert
            error={error}
            onRetry={() => {
              if (error && error.toLowerCase().includes("คำนวณ")) {
                calculateAllMortgages();
              }
              setError(null);
            }}
            showRetry={error && error.toLowerCase().includes("คำนวณ")}
          />

          {/* Shared Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1 space-y-4 sticky top-4 self-start">
              {/* Hero Card - Shared Inputs */}
              <div className="card bg-white shadow-lg border border-gray-200">
                <div className="card-body p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        ข้อมูลเงินกู้
                      </h3>
                      <p className="text-gray-500 text-sm">
                        ระบุวงเงินและเงินผ่อนที่ต้องการ
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <AppInput
                      label="จำนวนเงินกู้ (บาท)"
                      type="number"
                      decimal={2}
                      name="initial_loan"
                      value={sharedInputs.initial_loan}
                      onChange={(value) => {
                        // Convert to number for proper storage
                        handleSharedInputChange({
                          target: {
                            name: "initial_loan",
                            value: value,
                            type: "text",
                          },
                        });
                      }}
                      placeholder="3,000,000.00"
                      icon={<AccountBalance />}
                      color="blue"
                      helperText="วงเงินสินเชื่อที่ต้องการกู้"
                      required
                    />

                    <AppInput
                      label="เงินผ่อนต่อเดือน (บาท)"
                      type="number"
                      decimal={2}
                      name="monthly_payment"
                      value={sharedInputs.monthly_payment}
                      onChange={(value) => {
                        // Convert to number for proper storage
                        handleSharedInputChange({
                          target: {
                            name: "monthly_payment",
                            value: value,
                            type: "text",
                          },
                        });
                      }}
                      placeholder="15,000.00"
                      icon={<Payments />}
                      color="indigo"
                      helperText="งวดผ่อนชำระต่อเดือนที่ต้องการจ่าย"
                      required
                    />

                    <AppDate
                      label="วันเริ่มต้นผ่อนชำระ"
                      name="start_date"
                      value={sharedInputs.start_date}
                      onChange={(value) => {
                        handleSharedInputChange({
                          target: { name: "start_date", value, type: "text" },
                        });
                      }}
                      helperText="จำเป็นต้องระบุ (เลือกจากปฏิทิน)"
                      color="purple"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {/* Calculate Button */}
                <button
                  className="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 text-white font-semibold disabled:from-gray-400 disabled:to-gray-500 disabled:transform-none"
                  onClick={calculateAllMortgages}
                  disabled={
                    isLoading ||
                    !sharedInputs.initial_loan ||
                    sharedInputs.initial_loan <= 0 ||
                    !sharedInputs.monthly_payment ||
                    sharedInputs.monthly_payment <= 0
                  }
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      <span className="text-sm">กำลังคำนวณ...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm">คำนวณเปรียบเทียบ</span>
                    </>
                  )}
                </button>

                {/* Reset Button */}
                <button
                  className="btn shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0 text-white font-semibold disabled:from-gray-400 disabled:to-gray-500 disabled:transform-none"
                  onClick={resetAllData}
                  disabled={isLoading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="text-sm">รีเซ็ตข้อมูล</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-2">
              {/* Bank Selection Header */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      เลือกธนาคารที่ต้องการเปรียบเทียบ
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      เลือกได้สูงสุด 4 ธนาคารเพื่อเปรียบเทียบเงื่อนไขสินเชื่อ
                    </p>
                  </div>
                  <button
                    onClick={addBank}
                    disabled={banks.length >= 4}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg 
             bg-green-500 hover:bg-green-600 
             text-white text-sm font-medium
             shadow-sm hover:shadow-md
             transition-all duration-200
             disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    เพิ่มธนาคาร
                  </button>
                </div>

                {/* Bank Counter */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          i < banks.length ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {banks.length}/4 ธนาคาร
                  </span>
                </div>
              </div>

              {/* Bank Forms Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banks.map((bank, index) => (
                  <BankInputForm
                    key={index}
                    bankData={bank}
                    index={index}
                    onBankDataChange={handleBankDataChange}
                    onRemoveBank={removeBank}
                    canRemove={banks.length > 1}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          {banks.some((bank) => bank.schedule && bank.schedule.length > 0) && (
            <div className="space-y-8">
              {/* Results Header */}
              <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-bold text-lg">ผลการคำนวณสินเชื่อ</span>
                </div>
                <p className="text-gray-500 mt-2">
                  เปรียบเทียบเงื่อนไขสินเชื่อจาก{" "}
                  {
                    banks.filter(
                      (bank) => bank.schedule && bank.schedule.length > 0
                    ).length
                  }{" "}
                  ธนาคาร
                </p>
              </div>

              {/* Comparison Table */}
              <div className="mb-8">
                <div className="card bg-white shadow-2xl border-2 border-indigo-100 rounded-3xl overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white px-8 py-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">ตารางเปรียบเทียบรายละเอียด</h3>
                          <p className="text-indigo-100 text-sm mt-0.5">เปรียบเทียบเงื่อนไขและดอกเบี้ยของแต่ละธนาคาร</p>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">{banks.filter(b => b.schedule && b.schedule.length > 0).length} ธนาคาร</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-white to-indigo-50/30">
                    <ComparisonTable banks={banksWithLabels} />
                  </div>
                </div>
              </div>

              {/* Consolidated Results - All 3 main components in one */}
              <ConsolidatedResults
                banks={banks}
                monthly_payment={sharedInputs.monthly_payment}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
