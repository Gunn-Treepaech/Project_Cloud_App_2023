from datetime import date, timedelta

def days_in_month(month, year):
    # คืนค่าจำนวนวันในเดือน/ปีที่ระบุ
    if month == 12:
        next_month = 1
        next_year = year + 1
    else:
        next_month = month + 1
        next_year = year
    try:
        # วันที่ 1 ของเดือนถัดไป ลบด้วย 1 วัน คือวันสุดท้ายของเดือนปัจจุบัน
        return (date(next_year, next_month, 1) - timedelta(days=1)).day
    except ValueError:
        # กรณีข้อมูลผิดพลาด คืนค่า 30 วัน
        return 30
