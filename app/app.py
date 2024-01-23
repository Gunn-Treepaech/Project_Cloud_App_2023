from flask import Flask, jsonify
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
    return 'Calculate Loan Schedule Program'

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

def calculate_loan_schedule(initial_loan, years_interest, total_payment, MRR, start_year, start_month, bank = "SCB"):
    overpayment = 0
    remaining_principal = initial_loan
    current_year = start_year

    for month in range(start_month, start_month + 36):
        until_the_day = days_in_month(start_month, current_year)

        display_month = month % 12
        if month % 12 == 0:
            display_month = 12
        if month == start_month + 23:
            years_interest = MRR - years_interest
        if remaining_principal <= 0:
            print(f"Loan fully repaid. Exiting calculation.")
            break

        interest = (remaining_principal * years_interest) / 36500
        interest_money = until_the_day * interest
        balance = total_payment - interest_money
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
        'host': '10.161.112.161',
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
    #calculate_loan_schedule(100000,2.95,15000,8.8,2024,11)
    app.run()