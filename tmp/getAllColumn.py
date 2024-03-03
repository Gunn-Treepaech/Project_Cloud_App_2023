import mysql.connector
import json

def get_column_names(host, user, password, database, table):
    # ติดต่อฐานข้อมูล
    connection = mysql.connector.connect(
        host=host,
        user=user,
        password=password,
        database=database,
        port=32000
    )

    cursor = connection.cursor()

    # ดึงข้อมูล column name จาก INFORMATION_SCHEMA
    query = f"SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '{database}' AND TABLE_NAME = '{table}'"
    cursor.execute(query)

    # ดึงผลลัพธ์
    column_names = [column[0] for column in cursor.fetchall()]

    # ปิดการเชื่อมต่อ
    cursor.close()
    connection.close()

    return column_names

def main():
    # ป้อนข้อมูลเชื่อมต่อ MySQL
    host = "10.161.112.161"
    user = "user"
    password = "user"
    database = "financial_data"
    table = "interest_rates"

    # ดึงชื่อคอลัมน์
    column_names = get_column_names(host, user, password, database, table)

    # แปลงเป็น JSON
    column_names_json = json.dumps(column_names, indent=2)
    
    print("Column Names in JSON format:")
    print(column_names_json)

if __name__ == "__main__":
    main()
