from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import json
from datetime import date, timedelta
from decimal import Decimal, getcontext, ROUND_HALF_UP

app = Flask(__name__)
CORS(app)

getcontext().prec = 28 # กำหนดความแม่นยำของ Decimal

# ---------------------------------------------------------------
config = {
    'user': 'root',
    'password': '1234',
    'host': 'localhost',
    'port': '3306',
    'database': 'financial_data'
}
# ---------------------------------------------------------------

def get_db_connection():
    """สร้างและคืนค่าการเชื่อมต่อฐานข้อมูล"""
    try:
        connection = mysql.connector.connect(**config)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def execute_db_query(query, params=None, fetch=False, fetch_one=False):
    """ฟังก์ชันรวมสำหรับการ Execute Query อย่างปลอดภัย"""
    connection = get_db_connection()
    if connection is None:
        return "Database Connection Error" if fetch else False

    cursor = connection.cursor(dictionary=True if fetch else None)
    try:
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)

        if fetch:
            return cursor.fetchone() if fetch_one else cursor.fetchall()
        
        connection.commit()
        return True
    except Error as e:
        print(f"Database Query Error: {e}")
        return str(e) if fetch else False
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

# ---------------------------------------------------------------

@app.route('/', methods=['GET'])
def home():
    return 'Calculate Loan Schedule Program'

@app.route('/api/calculate', methods=['POST'])
def calculate():
    datas = request.json
    result_data = calculate_loan_schedule(**datas) 
    if isinstance(result_data, str) and result_data.startswith("Error"):
        return jsonify({"error": result_data}), 500
    return jsonify(result_data)

@app.route('/api/showdatadb', methods=['GET'])
def showdatadb():
    results = getdatadb()
    if isinstance(results, str):
        return jsonify({"error": results}), 500
    return jsonify(results)

@app.route('/api/insertdata', methods=['POST'])
def insertdatadb():
    datas = request.json
    result = insert_or_update_data(**datas)
    if result is not True:
        return jsonify({"error": result}), 500
    
    results = getdatadb()
    if isinstance(results, str):
        return jsonify({"error": results}), 500
    return jsonify(results)

@app.route('/api/addcolumn', methods=['POST'])
def addcolumn_safe():
    datas = request.json
    result = add_column_safe(**datas)
    if result is not True:
        return jsonify({"error": result}), 500

    results = getdatadb()
    if isinstance(results, str):
        return jsonify({"error": results}), 500
    return jsonify(results)

@app.route('/api/bank-info', methods=['GET'])
def bank_info():
    bank_name = request.args.get('bank')
    if not bank_name:
        return jsonify({"error": "Missing bank parameter"}), 400

    # แมปชื่อธนาคารภาษาไทยกับชื่อใน database
    bank_map = {
        'ธนาคารกสิกรไทย': 'Kbank',
        'ธนาคารไทยพาณิชย์': 'SCB',
        'ธนาคารกรุงไทย': 'KTB',
        'ธนาคารยูโอบี': 'UOB'
    }
    db_bank_name = bank_map.get(bank_name, bank_name)

    query = "SELECT MRR, years_interest, update_MRR FROM interest_rates WHERE bank_name = %s"
    result = execute_db_query(query, (db_bank_name,), fetch=True, fetch_one=True)
    if not result:
        return jsonify({"error": "Bank not found"}), 404

    # คืนค่า fixed_interest จาก years_interest
    return jsonify({
        "MRR": result.get("MRR"),
        "fixed_interest": result.get("years_interest"),
        "update_MRR": result.get("update_MRR")
    })

def days_in_month(month, year):
    """คืนค่าจำนวนวันในเดือน/ปีที่ระบุ"""
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
        return 30

def calculate_loan_schedule(**datas):
    result_data_local = {}
    # ------------------------------------------------------------
    # รับข้อมูล
    # ------------------------------------------------------------
    start_month = datas.get('start_month')
    current_year = datas.get('start_year')

    remaining_principal = Decimal(str(datas.get('initial_loan')))
    fixed_interest = Decimal(str(datas.get('fixed_interest')))  # 2.85 → frontend ส่ง 0.0285
    fixed_year = datas.get('fixed_year')
    MRR = Decimal(str(datas.get('MRR')))                        # 8.88 → frontend ส่ง 0.088
    monthly_payment = Decimal(str(datas.get('monthly_payment')))
    chang_interest = [Decimal(str(i)) for i in datas.get('chang_interest', [])]
    bank = datas.get('bank')

    if any(v is None for v in [start_month, current_year, remaining_principal,
                               fixed_interest, MRR, monthly_payment, bank]):
        return "Error: Missing required calculation parameters."
    # ------------------------------------------------------------
    # Helper: แปลงทศนิยม → เปอร์เซ็นต์
    # ------------------------------------------------------------
    def normalize_rate(r: Decimal) -> Decimal:
        # frontend ส่ง 0.0285 → backend ต้องใช้ 2.85
        return (r * Decimal('100')) if r < Decimal('1') else r

    # อัตราเริ่มต้น
    fixed_interest = normalize_rate(fixed_interest)

    current_month = start_month
    current_period = 0
    total_periods = 36

    TWO_PLACES = Decimal('0.01')

    for period in range(1, total_periods + 1):
        current_period += 1
        display_month = current_month
        # ------------------------------------------------------------
        # จำนวนวันในเดือน
        # ------------------------------------------------------------
        until_the_day = days_in_month(display_month, current_year)
        # ------------------------------------------------------------
        # เปลี่ยนอัตราดอกเบี้ยตามปีที่กำหนด
        # ------------------------------------------------------------
        # fixed_year = 2 → ปี 1–2 fixed | ปี 3 MRR - discount1
        if fixed_year == 2:
            if current_period == 25:
                new_rate = MRR - chang_interest[0]
                fixed_interest = normalize_rate(new_rate)

        # fixed_year = 1 → ปี 1 fixed | ปี 2 MRR - disc1 | ปี 3 MRR - disc2
        elif fixed_year == 1:
            if current_period == 13:
                new_rate = MRR - chang_interest[0]
                fixed_interest = normalize_rate(new_rate)

            elif current_period == 25:
                if len(chang_interest) > 1:
                    new_rate = MRR - chang_interest[1]
                else:
                    new_rate = MRR
                fixed_interest = normalize_rate(new_rate)
        # หาก fixed_year = 0 หรือ None: ไม่เปลี่ยนอะไร
        # ------------------------------------------------------------
        # จบถ้าจ่ายหมด
        # ------------------------------------------------------------
        if remaining_principal <= 0:
            break
        # ------------------------------------------------------------
        # คำนวณดอกเบี้ยต่อเดือน ด้วย Decimal
        # สูตร: principal * (rate%) / 365 * days
        # ------------------------------------------------------------
        interest_per_day = (remaining_principal * fixed_interest) / Decimal('36500')
        interest_money = interest_per_day * Decimal(until_the_day)
        # ------------------------------------------------------------
        # เงินต้นที่ตัดได้
        # ------------------------------------------------------------
        balance = monthly_payment - interest_money

        if balance <= 0:
            balance = Decimal('0')
        # คงเหลือ
        if remaining_principal - balance <= 0:
            overpayment = balance - remaining_principal
            balance = remaining_principal
            remaining_principal = Decimal('0')
        else:
            overpayment = Decimal('0')
            remaining_principal -= balance
        # ------------------------------------------------------------
        # ปัดเฉพาะค่าแสดงผล
        # ------------------------------------------------------------
        result = {
            "month": display_month,
            "year": current_year,
            "remaining": float(remaining_principal.quantize(TWO_PLACES, rounding=ROUND_HALF_UP)),
            "interest": float(interest_money.quantize(TWO_PLACES, rounding=ROUND_HALF_UP)),
            "balance": float(balance.quantize(TWO_PLACES, rounding=ROUND_HALF_UP)),
            "overpayment": float(overpayment.quantize(TWO_PLACES, rounding=ROUND_HALF_UP)),
            "interest_rate": float(fixed_interest)
        }
        if bank not in result_data_local:
            result_data_local[bank] = []
        result_data_local[bank].append(result)
        # ------------------------------------------------------------
        # เดือนถัดไป
        # ------------------------------------------------------------
        current_month += 1
        if current_month > 12:
            current_month = 1
            current_year += 1

    return result_data_local
# ---------------------------------------------------------------
# Database Logic (Security Fixes)
# ---------------------------------------------------------------

def getdatadb():
    """ดึงข้อมูลอัตราดอกเบี้ยทั้งหมด"""
    query = 'SELECT * FROM interest_rates;'
    return execute_db_query(query, fetch=True)

def insert_or_update_data(**datas):
    bank_name = datas.get('bank_name')
    update_MRR = datas.get('update_MRR')
    years_interest = datas.get('years_interest')
    MRR = datas.get('MRR')

    if not bank_name:
        return "Error: bank_name is required."

    query_check = "SELECT * FROM interest_rates WHERE bank_name = %s"
    existing_data = execute_db_query(query_check, (bank_name,), fetch=True, fetch_one=True)

    if existing_data:
        update_values = []
        params = []
        
        if update_MRR is not None:
            update_values.append("update_MRR = %s")
            params.append(update_MRR)
        if years_interest is not None:
            update_values.append("years_interest = %s")
            params.append(years_interest)
        if MRR is not None:
            update_values.append("MRR = %s")
            params.append(MRR)
            
        if not update_values:
            return True

        query_update = f"UPDATE interest_rates SET {', '.join(update_values)} WHERE bank_name = %s"
        params.append(bank_name)
        
        return execute_db_query(query_update, tuple(params))
        
    else:
        query_insert = "INSERT INTO interest_rates (bank_name, update_MRR, years_interest, MRR) VALUES (%s, %s, %s, %s)"
        params = (bank_name, update_MRR, years_interest, MRR)
        return execute_db_query(query_insert, params)

def add_column_safe(**datas):
    column_name = datas.get('column_name')
    data_type = datas.get('data_type')
    valid_data_types = ['VARCHAR(50)', 'INT', 'DECIMAL(5, 2)', 'DATE']
    
    if not column_name or not data_type or data_type.upper() not in [dt.upper() for dt in valid_data_types]:
        return "Error: Invalid column_name or data_type provided."
    query_add_column = f"ALTER TABLE interest_rates ADD COLUMN {column_name} {data_type}"
    return execute_db_query(query_add_column)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)