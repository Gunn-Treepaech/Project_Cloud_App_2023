import mysql.connector

def update_or_insert_data(data):
    # เชื่อมต่อ MySQL Database
    connection = mysql.connector.connect(
        host='your_host',
        user='user',
        password='user',
        database='your_database'
    )

    # สร้าง Cursor object เพื่อทำงานกับฐานข้อมูล
    cursor = connection.cursor()

    for entry in data:
        # ตรวจสอบว่าข้อมูลนี้มีอยู่แล้วหรือไม่
        query = f"SELECT * FROM your_table WHERE MRR = '{entry['MRR']}' AND bank_name = '{entry['bank_name']}'"
        cursor.execute(query)
        existing_data = cursor.fetchone()

        if existing_data:
            # ถ้าข้อมูลมีอยู่แล้ว ให้อัปเดตข้อมูล
            update_query = f"UPDATE your_table SET years_interest = '{entry['years_interest']}' WHERE MRR = '{entry['MRR']}' AND bank_name = '{entry['bank_name']}'"
            cursor.execute(update_query)
        else:
            # ถ้าข้อมูลไม่มีอยู่ ให้เพิ่มข้อมูลใหม่
            insert_query = f"INSERT INTO your_table (MRR, bank_name, years_interest) VALUES ('{entry['MRR']}', '{entry['bank_name']}', '{entry['years_interest']}')"
            cursor.execute(insert_query)

    # ทำการ Commit การเปลี่ยนแปลงในฐานข้อมูล
    connection.commit()

    # ปิดการเชื่อมต่อ
    cursor.close()
    connection.close()

# ตัวอย่างข้อมูลที่ต้องการเพิ่มหรืออัปเดต
data_to_update = [{"MRR": "7.30", "bank_name": "Kbank", "years_interest": "2.95"},
                  {"MRR": "9.36", "bank_name": "test", "years_interest": "2.98"}]

# เรียกใช้ฟังก์ชัน
update_or_insert_data(data_to_update)
