from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import json

app = Flask(__name__)
CORS(app)

# ---------------------------------------------------------------
config = {
        'user': 'user',
        'password': 'user',
        'host': 'db',
        'port': '3306',
        'database': 'financial_data'
    }
# ---------------------------------------------------------------

@app.route('/', methods=['GET'])
def home():
    return 'Calculate Loan Schedule Program'

@app.route('/api/calculate', methods=['POST'])
def calculate():
    global result_data
    result_data = {}
    datas = request.json
    calculate_loan_schedule(**datas)
    return jsonify(result_data)

@app.route('/api/showdatadb', methods=['GET'])
def showdatadb():
    return jsonify(getdatadb())

@app.route('/api/inserdata', methods=['POST'])
def insertdatadb():
    datas = request.json
    insert_or_update_data(**datas)
    return jsonify(getdatadb())

@app.route('/api/addcolumn', methods=['POST'])
def addcolumn():
    datas = request.json
    add_column(**datas)
    return jsonify(getdatadb())

def days_in_month(month, year):
    if month == 2 and ((year % 4 == 0) or ((year % 100 == 0) and (year % 400 == 0))):
        day = 29
    elif month == 2:
        day = 28
    elif month in [1, 3, 5, 7, 8, 10, 12]:
        day = 31
    else:
        day = 30
    return day

def calculate_loan_schedule(**datas):
    overpayment = 0
    #------------------------------------------------------------
    start_month = datas['start_month']
    current_year = datas['start_year']
    remaining_principal = datas['initial_loan']
    fixed_interest = datas['fixed_interest']
    fixed_year = datas['fixed_year']
    MRR = datas['MRR']
    monthly_payment = datas['monthly_payment']
    chang_interest = datas['chang_interest']
    bank = datas['bank']
   #------------------------------------------------------------
    for month in range(start_month, start_month + 36):
        until_the_day = days_in_month(start_month, current_year)
        
        display_month = month % 12
        if month % 12 == 0:
            display_month = 12
        
        if fixed_year is not None:
            if fixed_year == 1:
                if month == start_month + 12:
                    fixed_interest = MRR - chang_interest[0]
                if month == start_month + 24:
                    fixed_interest = MRR - chang_interest[1]
            if fixed_year == 2:
                if month == start_month + 24:
                    fixed_interest = MRR - chang_interest[0]  
        #print(f'Month ({display_month}, {current_year}): interest == {fixed_interest}')
            
        if remaining_principal <= 0:
            print(f"Loan fully repaid. Exiting calculation.")
            break

        interest = (remaining_principal * fixed_interest) / 36500 #ดอกเบี้ย = เงินทั้งหมด * ดอกเบี้ยคงที่ 
        interest_money = until_the_day * interest #จ่ายดอกเบี้ย = วัน * ดอกเบี้ย
        balance = monthly_payment - interest_money #จ่ายยอด = จ่าย - จ่ายดอกเบี้ย
        remaining_principal = remaining_principal - balance  #ยอดคงเหลือ = เงินทั้งหมด - จ่ายยอด
        initial_loan = remaining_principal

        if initial_loan <= 0:
            overpayment = abs(remaining_principal)
            remaining_principal = 0
            result = {
                "month":display_month,
                "year":current_year,
                "remaining":remaining_principal,
                "interest":interest_money,
                "balance":balance,
                "overpayment":overpayment,
            }
            write_json(result,bank)
            break

        result = {
                "month":display_month,
                "year":current_year,
                "remaining":remaining_principal,
                "interest":interest_money,
                "balance":balance,
                "overpayment":overpayment,
        }
        write_json(result,bank)
        
        if month % 12 == 0:
            current_year += 1

def write_json(new_data, bank):
    if bank not in result_data:
        result_data[bank] = []
    result_data[bank].append(new_data)
    
def getdatadb():
    connection = mysql.connector.connect(**config)
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM interest_rates;')
    results = cursor.fetchall()
    cursor.close()
    connection.close()
    return results

def insert_or_update_data(**datas):
    # --------------------------------------------
    bank_name = datas['bank_name']
    update_MRR = datas.get('update_MRR', None)
    years_interest = datas.get('years_interest', None)
    MRR = datas.get('MRR', None)
    # --------------------------------------------
    try:
        connection = mysql.connector.connect(**config)
        if connection.is_connected():
            cursor = connection.cursor()
            # Check if data exists in the database
            query_check = f"SELECT * FROM interest_rates WHERE bank_name = '{bank_name}'"
            cursor.execute(query_check)
            existing_data = cursor.fetchone()
            if existing_data:
                # Update only the provided values
                update_values = []
                if update_MRR is not None:
                    update_values.append(f"update_MRR = '{update_MRR}'")
                if years_interest is not None:
                    update_values.append(f"years_interest = {years_interest}")
                if MRR is not None:
                    update_values.append(f"MRR = {MRR}")
                # Build the update query
                query_update = f"UPDATE interest_rates SET {', '.join(update_values)} WHERE bank_name = '{bank_name}'"
                cursor.execute(query_update)
            else:
                # Insert new data
                query_insert = f"INSERT INTO interest_rates (bank_name, update_MRR, years_interest, MRR) VALUES ('{bank_name}', '{update_MRR}', {years_interest}, {MRR})"
                cursor.execute(query_insert)

            # Confirm the transaction
            connection.commit()
    except Error as e:
        return e
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
    return 0

def add_column(**datas):
    # --------------------------------------------
    column_name = datas['column_name']
    data_type = datas['data_type']
    # --------------------------------------------
    try:
        # ทำการเชื่อมต่อกับฐานข้อมูล
        connection = mysql.connector.connect(**config)
        if connection.is_connected():
            cursor = connection.cursor()
            # สร้างคอลัมน์ใหม่
            query_add_column = f"ALTER TABLE interest_rates ADD COLUMN {column_name} {data_type}"
            cursor.execute(query_add_column)
            # ยืนยันการทำรายการ
            connection.commit()
    except Error as e:
        return e
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
    return 0

if __name__ == '__main__':
    # -----------------------------------------------------------------------------------------------
    test = {
    "start_month": 11,
    "start_year": 2024,
    "initial_loan": 100000000,
    "fixed_interest": 2.95,
    "fixed_year": 3,
    "MRR": 8.8,
    "monthly_payment": 15000,
    "chang_interest": [2.95, 1.95],
    "bank": "UOB"
}
    # ------------------------------------------------------------------------------------------------
    app.run(host='0.0.0.0')
