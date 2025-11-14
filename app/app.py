from flask import Flask, request, jsonify
from flask_cors import CORS
from database_manager import DatabaseManager
from loan_calculator import LoanCalculator
import re

# สร้าง Flask app และเปิดใช้งาน CORS เพื่อให้ frontend สามารถเรียก API ได้
app = Flask(__name__)
CORS(app)

# กำหนดค่าการเชื่อมต่อฐานข้อมูล MySQL
config = {
    'user': 'root',
    'password': '1234',
    'host': 'localhost',
    'port': '3306',
    'database': 'financial_data'
}
# สร้าง instance ของ DatabaseManager สำหรับจัดการคำสั่ง SQL
db_manager = DatabaseManager(config)

@app.route('/', methods=['GET'])
def home():
    # แสดงข้อความหน้าแรกของ API
    return 'Calculate Loan Schedule Program'

@app.route('/api/calculate', methods=['POST'])
def calculate():
    # รับข้อมูล JSON จาก client สำหรับคำนวณตารางผ่อน
    datas = request.json
    # สร้าง LoanCalculator และคำนวณตารางผ่อน
    result_data = LoanCalculator(datas).calculate_schedule()
    # ถ้ามี error ในการคำนวณ ส่ง error กลับ
    if isinstance(result_data, str) and result_data.startswith("Error"):
        return jsonify({"error": result_data}), 500
    # ส่งผลลัพธ์ตารางผ่อนกลับในรูปแบบ JSON
    return jsonify(result_data)

@app.route('/api/showdatadb', methods=['GET'])
def showdatadb():
    # ดึงข้อมูลอัตราดอกเบี้ยทั้งหมดจากฐานข้อมูล
    results = db_manager.execute_query('SELECT * FROM interest_rates;', fetch=True)
    # ถ้าเกิด error ในการดึงข้อมูล ส่ง error กลับ
    if isinstance(results, str):
        return jsonify({"error": results}), 500
    # ส่งข้อมูลอัตราดอกเบี้ยทั้งหมดกลับ
    return jsonify(results)

@app.route('/api/insertdata', methods=['POST'])
def insertdatadb():
    # รับข้อมูล JSON สำหรับเพิ่มหรืออัปเดตข้อมูลอัตราดอกเบี้ย
    datas = request.json
    bank_name = datas.get('bank_name')
    update_MRR = datas.get('update_MRR')
    years_interest = datas.get('years_interest')
    MRR = datas.get('MRR')

    # ตรวจสอบว่ามี bank_name หรือไม่
    if not bank_name:
        return jsonify({"error": "bank_name is required."}), 400

    # ตรวจสอบว่ามีข้อมูลธนาคารนี้อยู่แล้วหรือไม่
    query_check = "SELECT * FROM interest_rates WHERE bank_name = %s"
    existing_data = db_manager.execute_query(query_check, (bank_name,), fetch=True, fetch_one=True)

    if existing_data:
        # ถ้ามีข้อมูลอยู่แล้ว ให้เตรียมคำสั่ง UPDATE เฉพาะ field ที่มีการส่งมา
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
        # ถ้าไม่มี field ใดเปลี่ยนแปลง ให้คืนค่า True
        if not update_values:
            return jsonify(True)
        # สร้าง query สำหรับ UPDATE
        query_update = f"UPDATE interest_rates SET {', '.join(update_values)} WHERE bank_name = %s"
        params.append(bank_name)
        result = db_manager.execute_query(query_update, tuple(params))
    else:
        # ถ้ายังไม่มีข้อมูลธนาคารนี้ ให้ INSERT ข้อมูลใหม่
        query_insert = "INSERT INTO interest_rates (bank_name, update_MRR, years_interest, MRR) VALUES (%s, %s, %s, %s)"
        params = (bank_name, update_MRR, years_interest, MRR)
        result = db_manager.execute_query(query_insert, params)

    # ถ้าเกิด error ในการ INSERT/UPDATE ส่ง error กลับ
    if result is not True:
        return jsonify({"error": result}), 500

    # ดึงข้อมูลอัตราดอกเบี้ยล่าสุดกลับไปแสดง
    results = db_manager.execute_query('SELECT * FROM interest_rates;', fetch=True)
    if isinstance(results, str):
        return jsonify({"error": results}), 500
    return jsonify(results)

@app.route('/api/addcolumn', methods=['POST'])
def addcolumn_safe():
    # รับข้อมูล JSON สำหรับเพิ่ม column ในตาราง interest_rates
    datas = request.json
    column_name = datas.get('column_name')
    data_type = datas.get('data_type')
    valid_data_types = ['VARCHAR(50)', 'INT', 'DECIMAL(5, 2)', 'DATE']
    # ตรวจสอบความถูกต้องของ column_name และ data_type
    if not column_name or not data_type or data_type.upper() not in [dt.upper() for dt in valid_data_types]:
        return jsonify({"error": "Invalid column_name or data_type provided."}), 400
    # ตรวจสอบรูปแบบ column_name เพื่อป้องกัน SQL injection
    if not re.match(r'^[A-Za-z_][A-Za-z0-9_]*$', column_name):
        return jsonify({"error": "Invalid column name."}), 400
    # สร้าง query สำหรับเพิ่ม column
    query_add_column = f"ALTER TABLE interest_rates ADD COLUMN {column_name} {data_type}"
    result = db_manager.execute_query(query_add_column)
    # ถ้าเกิด error ในการเพิ่ม column ส่ง error กลับ
    if result is not True:
        return jsonify({"error": result}), 500
    # ดึงข้อมูลอัตราดอกเบี้ยล่าสุดกลับไปแสดง
    results = db_manager.execute_query('SELECT * FROM interest_rates;', fetch=True)
    if isinstance(results, str):
        return jsonify({"error": results}), 500
    return jsonify(results)

@app.route('/api/bank-info', methods=['GET'])
def bank_info():
    # รับ parameter bank จาก query string
    bank_name = request.args.get('bank')
    # ตรวจสอบว่ามี bank parameter หรือไม่
    if not bank_name:
        return jsonify({"error": "Missing bank parameter"}), 400
    # แมปชื่อธนาคารภาษาไทยกับชื่อในฐานข้อมูล
    bank_map = {
        'ธนาคารกสิกรไทย': 'Kbank',
        'ธนาคารไทยพาณิชย์': 'SCB',
        'ธนาคารกรุงไทย': 'KTB',
        'ธนาคารยูโอบี': 'UOB'
    }
    db_bank_name = bank_map.get(bank_name, bank_name)
    # สร้าง query สำหรับดึงข้อมูลอัตราดอกเบี้ยของธนาคารที่ระบุ
    query = "SELECT MRR, years_interest, update_MRR FROM interest_rates WHERE bank_name = %s"
    result = db_manager.execute_query(query, (db_bank_name,), fetch=True, fetch_one=True)
    # ถ้าไม่พบธนาคาร ส่ง error กลับ
    if not result:
        return jsonify({"error": "Bank not found"}), 404
    # ส่งข้อมูลอัตราดอกเบี้ยของธนาคารกลับ
    return jsonify({
        "MRR": result.get("MRR"),
        "fixed_interest": result.get("years_interest"),
        "update_MRR": result.get("update_MRR")
    })

# จุดเริ่มต้นของโปรแกรม Flask
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)