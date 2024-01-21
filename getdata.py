import mysql.connector

# กำหนดข้อมูลเข้าสู่ระบบ MySQL
host = "10.161.112.161"
user = "user"
password = "user"
database = "financial_data"

# เชื่อมต่อ MySQL
conn = mysql.connector.connect(
    host=host,
    user=user,
    password=password,
    database=database
)

# สร้าง Cursor object เพื่อทำงานกับฐานข้อมูล
cursor = conn.cursor()

# คำสั่ง SQL เพื่อดึงข้อมูล
sql_query = "SELECT * FROM interest_rates;"

# ทำการ execute คำสั่ง SQL
cursor.execute(sql_query)

# ดึงข้อมูลทั้งหมดจาก Cursor
result = cursor.fetchall()

# ปิดการเชื่อมต่อ MySQL
conn.close()

# แสดงผลลัพธ์เป็นคอลัมน์
for row in result:
    print("Bank name:", row[0])
    print("Years interest:", row[1])
    print("MRR:", row[2])
    print("------------")