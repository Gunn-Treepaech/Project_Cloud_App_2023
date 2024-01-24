from flask import Flask, request, jsonify
import mysql.connector
import json
import os

app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    return 'Calculate Loan Schedule Program'

@app.route('/data', methods=['GET'])
def data():
    data = {}
    filename='data.json'
    if os.path.exists(filename):
        with open(filename, 'r') as file:
            data = json.load(file)
    return jsonify(data)

@app.route('/delete_jsonflie', methods=['GET'])
def delete_json_file(file_path='data.json'):
    msg = ""
    try:
        os.remove(file_path)
        msg = f"ลบไฟล์ {file_path} เรียบร้อยแล้ว"
    except FileNotFoundError:
         msg = f"ไม่พบไฟล์ {file_path}"
    except Exception as e:
         msg = f"เกิดข้อผิดพลาดขณะลบไฟล์: {e}"
    return msg

@app.route('/calculate', methods=['POST'])
def calculate():
    test = request.json
    calculate_loan_schedule(**test)
    data = {}
    filename='data.json'
    if os.path.exists(filename):
        with open(filename, 'r') as file:
            data = json.load(file)
    return jsonify(data)

@app.route('/showdatadb', methods=['GET'])
def showdatadb():
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

def calculate_loan_schedule(**config):
    overpayment = 0
    #------------------------------------------------------------
    start_month = config['start_month']
    current_year = config['start_year']
    remaining_principal = config['initial_loan']
    fixed_interest = config['fixed_interest']
    fixed_year = config['fixed_year']
    MRR = config['MRR']
    monthly_payment = config['monthly_payment']
    chang_interest = config['chang_interest']
    bank = config['bank']
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

        interest = (remaining_principal * fixed_interest) / 36500
        interest_money = until_the_day * interest
        balance = monthly_payment - interest_money
        remaining_principal = remaining_principal - balance
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

def write_json(new_data, bank, filename='data.json'):
    data = {}
    if os.path.exists(filename):
        with open(filename, 'r') as file:
            data = json.load(file)
    if bank not in data:
        data[bank] = []
    data[bank].append(new_data)
    with open(filename, 'w') as file:
        json.dump(data, file, indent=2)

def getdatadb():
    config = {
        'user': 'user',
        'password': 'user',
        'host': 'db',
        'port': '3306',
        'database': 'financial_data'
    }
    connection = mysql.connector.connect(**config)
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM interest_rates;')
    results = cursor.fetchall()
    cursor.close()
    connection.close()
    return results

if __name__ == '__main__':
    # -----------------------------------------------------------------------------------------------
    config = {
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
    #calculate_loan_schedule(**config)
    app.run(host='0.0.0.0')