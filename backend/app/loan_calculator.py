from decimal import Decimal, getcontext, ROUND_HALF_UP
from utils import days_in_month

# กำหนด precision สำหรับการคำนวณด้วย Decimal
getcontext().prec = 28
TWO_PLACES = Decimal('0.01')

class LoanCalculator:
    def __init__(self, datas):
        # รับข้อมูลสำหรับคำนวณตารางผ่อน
        self.datas = datas

    def normalize_rate(self, r: Decimal) -> Decimal:
        # แปลงอัตราดอกเบี้ยให้เป็นเปอร์เซ็นต์ (เช่น 0.0585 -> 5.85)
        return (r * Decimal('100')) if r < Decimal('1') else r

    def calculate_schedule(self):
        # ฟังก์ชันหลักสำหรับคำนวณตารางผ่อนสินเชื่อ
        datas = self.datas
        start_month = datas.get('start_month')
        current_year = datas.get('start_year')
        try:
            # แปลงข้อมูลที่รับมาเป็น Decimal เพื่อความแม่นยำ
            remaining_principal = Decimal(str(datas.get('initial_loan')))
            fixed_interest = Decimal(str(datas.get('fixed_interest')))
            fixed_year = datas.get('fixed_year')
            MRR = Decimal(str(datas.get('MRR')))
            monthly_payment = Decimal(str(datas.get('monthly_payment')))
            chang_interest_raw = datas.get('chang_interest', []) or []
            chang_interest = [Decimal(str(x)) for x in chang_interest_raw]
            bank = datas.get('bank')
        except Exception as e:
            # ถ้าเกิด error ในการแปลงข้อมูล ส่ง error กลับ
            return f"Error: Invalid input types. {e}"

        # ตรวจสอบว่าข้อมูลที่จำเป็นครบหรือไม่
        if any(v is None for v in [start_month, current_year, remaining_principal,
                                   fixed_interest, MRR, monthly_payment, bank]):
            return "Error: Missing required calculation parameters."

        # กำหนดอัตราดอกเบี้ยเริ่มต้น
        fixed_interest = self.normalize_rate(fixed_interest)
        current_month = start_month
        current_period = 0
        total_periods = 36  # จำนวนงวดที่ต้องคำนวณ

        result_data_local = {}
        for period in range(1, total_periods + 1):
            current_period += 1
            display_month = current_month
            # คำนวณจำนวนวันในเดือนนั้น
            until_the_day = days_in_month(display_month, current_year)

            # เปลี่ยนอัตราดอกเบี้ยตาม fixed_year และ chang_interest
            if fixed_year == 2:
                if current_period == 25:
                    if len(chang_interest) >= 1:
                        new_rate = MRR - chang_interest[0]
                    else:
                        new_rate = MRR
                    fixed_interest = self.normalize_rate(new_rate)
            elif fixed_year == 1:
                if current_period == 13:
                    if len(chang_interest) >= 1:
                        new_rate = MRR - chang_interest[0]
                    else:
                        new_rate = MRR
                    fixed_interest = self.normalize_rate(new_rate)
                elif current_period == 25:
                    if len(chang_interest) >= 2:
                        new_rate = MRR - chang_interest[1]
                    elif len(chang_interest) == 1:
                        new_rate = MRR - chang_interest[0]
                    else:
                        new_rate = MRR
                    fixed_interest = self.normalize_rate(new_rate)
            # ถ้า fixed_year เป็น 3 หรืออื่น ๆ ไม่เปลี่ยนดอกเบี้ย

            # หยุดคำนวณถ้าจ่ายหมด
            if remaining_principal <= Decimal('0'):
                break

            # คำนวณดอกเบี้ยรายวัน
            interest_money = (remaining_principal * fixed_interest / Decimal('100')) * (Decimal(until_the_day) / Decimal('365'))
            # เงินต้นที่ตัดได้ในงวดนี้
            balance = monthly_payment - interest_money
            # ถ้าเงินต้นที่ตัดได้ติดลบ ให้เป็น 0
            if balance <= Decimal('0'):
                balance = Decimal('0')

            # อัปเดตยอดเงินต้นคงเหลือ
            if remaining_principal - balance <= Decimal('0'):
                # งวดสุดท้ายที่จ่ายหมด
                overpayment = balance - remaining_principal
                balance = remaining_principal
                remaining_principal = Decimal('0')
            else:
                overpayment = Decimal('0')
                remaining_principal -= balance

            # สร้างข้อมูลสำหรับแต่ละงวด (ปัดทศนิยม 2 ตำแหน่ง)
            display_result = {
                "month": display_month,
                "year": current_year,
                "remaining": float(remaining_principal.quantize(TWO_PLACES, rounding=ROUND_HALF_UP)),
                "interest": float(interest_money.quantize(TWO_PLACES, rounding=ROUND_HALF_UP)),
                "balance": float(balance.quantize(TWO_PLACES, rounding=ROUND_HALF_UP)),
                "overpayment": float(overpayment.quantize(TWO_PLACES, rounding=ROUND_HALF_UP)),
                "interest_rate": float(fixed_interest)
            }

            # เก็บผลลัพธ์ลงใน dict ตามชื่อธนาคาร
            if bank not in result_data_local:
                result_data_local[bank] = []
            result_data_local[bank].append(display_result)

            # เลื่อนไปเดือนถัดไป
            current_month += 1
            if current_month > 12:
                current_month = 1
                current_year += 1

        # คืนค่าตารางผ่อนทั้งหมด
        return result_data_local
