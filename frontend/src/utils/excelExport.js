import * as XLSX from 'xlsx';

// สร้างไฟล์ Excel ตารางผ่อนชำระพร้อมสูตรคำนวณ เพื่อให้ผู้ใช้แก้ไขตัวเลขได้ภายหลัง
export const exportScheduleToExcel = (bank, monthlyPayment, initialLoan) => {
    if (!bank || !bank.schedule || bank.schedule.length === 0) return;

    const schedule = bank.schedule;
    const firstItem = schedule[0];
    const fixedYear = Number(bank.fixed_year) || 0;
    const discount1 = Number(bank.chang_interest_discount1) || 0;
    const discount2 = Number(bank.chang_interest_discount2) || 0;
    const bankLabel = bank.bankLabel || bank.bank || 'ธนาคาร';

    const ASSUMPTIONS_ROW = {
        initialLoan: 4,
        monthlyPayment: 5,
        mrr: 6,
        fixedInterest: 7,
        fixedYearRow: 8,
        discount1: 9,
        discount2: 10,
        startMonth: 11,
        startYear: 12,
    };

    const aoa = [];
    aoa[0] = [`ตารางการผ่อนชำระสินเชื่อบ้าน - ${bankLabel}`];
    aoa[1] = ['กรุณาแก้ไขค่าในช่องสีเหลือง แล้วตารางด้านล่างจะคำนวณใหม่โดยอัตโนมัติ'];
    aoa[2] = [];
    aoa[3] = ['จำนวนเงินกู้เริ่มต้น (บาท)', Number(initialLoan) || 0];
    aoa[4] = ['เงินผ่อนต่อเดือน (บาท)', Number(monthlyPayment) || 0];
    aoa[5] = ['MRR (%)', Number(bank.MRR) || 0];
    aoa[6] = ['ดอกเบี้ยคงที่เริ่มต้น (%)', Number(bank.fixed_interest) || 0];
    aoa[7] = ['จำนวนปีดอกเบี้ยคงที่ (0=ลอยตัวตลอด)', fixedYear];
    aoa[8] = ['ส่วนลดดอกเบี้ยช่วงที่ 1 จาก MRR (%)', discount1];
    aoa[9] = ['ส่วนลดดอกเบี้ยช่วงที่ 2 จาก MRR (%)', discount2];
    aoa[10] = ['เดือนเริ่มผ่อนชำระ (1-12)', firstItem.month];
    aoa[11] = ['ปีเริ่มผ่อนชำระ (พ.ศ.)', firstItem.year];
    aoa[12] = [];

    const HEADER_ROW = 14; // 1-indexed excel row of the table header
    const FIRST_DATA_ROW = HEADER_ROW + 1;

    aoa[13] = [
        'งวดที่', 'เดือน', 'ปี (พ.ศ.)', 'จำนวนวันในเดือน',
        'อัตราดอกเบี้ย (%)', 'ยอดผ่อนต่อเดือน', 'ชำระดอกเบี้ย',
        'ชำระเงินกู้', 'จ่ายเกิน', 'เงินต้นคงเหลือ'
    ];

    const col = (letter, row) => `${letter}${row}`;
    const B = (row) => `$B$${row}`;

    // จำนวนวันในเดือนของปี พ.ศ. that รับมาจากตารางจริง (ปี ค.ศ. = ปี พ.ศ. - 543)
    const daysInMonth = (buddhistYear, month) => new Date(buddhistYear - 543, month, 0).getDate();

    for (let i = 0; i < schedule.length; i++) {
        const row = FIRST_DATA_ROW + i;
        const item = schedule[i];
        const prevRemainingRef = i === 0 ? B(ASSUMPTIONS_ROW.initialLoan) : col('J', row - 1);

        const periodRef = col('A', row);
        const monthFormula = `IF(MOD(${B(ASSUMPTIONS_ROW.startMonth)}+${periodRef}-2,12)+1=0,12,MOD(${B(ASSUMPTIONS_ROW.startMonth)}+${periodRef}-2,12)+1)`;
        const yearFormula = `${B(ASSUMPTIONS_ROW.startYear)}+INT((${B(ASSUMPTIONS_ROW.startMonth)}+${periodRef}-2)/12)`;
        const daysFormula = `DAY(EOMONTH(DATE(${col('C', row)}-543,${col('B', row)},1),0))`;
        const rateFormula = `IF(${B(ASSUMPTIONS_ROW.fixedYearRow)}=2,IF(${periodRef}>=25,${B(ASSUMPTIONS_ROW.mrr)}-${B(ASSUMPTIONS_ROW.discount1)},${B(ASSUMPTIONS_ROW.fixedInterest)}),IF(${B(ASSUMPTIONS_ROW.fixedYearRow)}=1,IF(${periodRef}>=25,IF(${B(ASSUMPTIONS_ROW.discount2)}<>0,${B(ASSUMPTIONS_ROW.mrr)}-${B(ASSUMPTIONS_ROW.discount2)},${B(ASSUMPTIONS_ROW.mrr)}-${B(ASSUMPTIONS_ROW.discount1)}),IF(${periodRef}>=13,${B(ASSUMPTIONS_ROW.mrr)}-${B(ASSUMPTIONS_ROW.discount1)},${B(ASSUMPTIONS_ROW.fixedInterest)})),${B(ASSUMPTIONS_ROW.fixedInterest)}))`;
        const paymentFormula = `${B(ASSUMPTIONS_ROW.monthlyPayment)}`;
        const interestFormula = `ROUND(${prevRemainingRef}*${col('E', row)}/100*${col('D', row)}/365,2)`;
        const rawExpr = `(${col('F', row)}-${col('G', row)})`;
        const principalFormula = `IF(${rawExpr}<0,0,IF(${prevRemainingRef}-${rawExpr}<=0,${prevRemainingRef},${rawExpr}))`;
        const overpaymentFormula = `IF(${rawExpr}<0,0,IF(${prevRemainingRef}-${rawExpr}<=0,${rawExpr}-${prevRemainingRef},0))`;
        const remainingFormula = `IF(${rawExpr}<0,${prevRemainingRef}-${rawExpr},IF(${prevRemainingRef}-${rawExpr}<=0,0,${prevRemainingRef}-${rawExpr}))`;

        // แนบค่าที่คำนวณไว้แล้ว (v) คู่กับสูตร (f) เพื่อให้เปิดไฟล์ครั้งแรกเห็นตัวเลขทันที
        // และ Excel จะคำนวณสูตรใหม่ให้อัตโนมัติเมื่อผู้ใช้แก้ไขค่าใน Assumptions
        aoa[row - 1] = [
            i + 1,
            { f: monthFormula, v: item.month },
            { f: yearFormula, v: item.year },
            { f: daysFormula, v: daysInMonth(item.year, item.month) },
            { f: rateFormula, v: item.interest_rate },
            { f: paymentFormula, v: Number(monthlyPayment) || 0 },
            { f: interestFormula, v: item.interest },
            { f: principalFormula, v: item.balance },
            { f: overpaymentFormula, v: item.overpayment },
            { f: remainingFormula, v: item.remaining },
        ];
    }

    const lastRow = FIRST_DATA_ROW + schedule.length - 1;
    const ws = {};
    const range = { s: { r: 0, c: 0 }, e: { r: lastRow - 1, c: 9 } };

    aoa.forEach((rowArr, r) => {
        (rowArr || []).forEach((cellValue, c) => {
            if (cellValue === undefined || cellValue === null || cellValue === '') return;
            const addr = XLSX.utils.encode_cell({ r, c });
            if (cellValue && typeof cellValue === 'object' && 'f' in cellValue) {
                ws[addr] = { t: 'n', f: cellValue.f, v: cellValue.v };
            } else if (typeof cellValue === 'number') {
                ws[addr] = { t: 'n', v: cellValue };
            } else {
                ws[addr] = { t: 's', v: String(cellValue) };
            }
        });
    });

    ws['!ref'] = XLSX.utils.encode_range(range);
    ws['!cols'] = [
        { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 14 }, { wch: 14 },
        { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 12 }, { wch: 16 },
    ];
    ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 9 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 9 } },
    ];

    const wb = XLSX.utils.book_new();
    wb.Workbook = { CalcPr: { fullCalcOnLoad: true } };
    XLSX.utils.book_append_sheet(wb, ws, 'ตารางผ่อนชำระ'.slice(0, 31));

    const fileName = `ตารางผ่อนชำระ_${bankLabel}`.replace(/[\\/:*?"<>|]/g, '_') + '.xlsx';
    XLSX.writeFile(wb, fileName, { cellFormula: true });
};
