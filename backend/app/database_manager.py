import mysql.connector
from mysql.connector import Error

class DatabaseManager:
    def __init__(self, config):
        # รับ config สำหรับเชื่อมต่อฐานข้อมูล MySQL
        self.config = config

    def get_connection(self):
        # สร้างและคืนค่าการเชื่อมต่อฐานข้อมูล
        try:
            connection = mysql.connector.connect(**self.config)
            return connection
        except Error as e:
            print(f"Error connecting to MySQL: {e}")
            return None

    def execute_query(self, query, params=None, fetch=False, fetch_one=False):
        # รวมฟังก์ชันสำหรับ execute query ทั้ง SELECT, INSERT, UPDATE, ALTER
        connection = self.get_connection()
        if connection is None:
            # ถ้าเชื่อมต่อไม่ได้ คืน error
            return "Database Connection Error" if fetch else False

        # ใช้ dictionary cursor ถ้าต้องการ fetch ข้อมูล
        cursor = connection.cursor(dictionary=True if fetch else None)
        try:
            # execute query พร้อม parameter ถ้ามี
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)

            # ถ้า fetch=True คืนข้อมูลที่ได้จาก SELECT
            if fetch:
                return cursor.fetchone() if fetch_one else cursor.fetchall()
            
            # ถ้าไม่ใช่ SELECT ให้ commit การเปลี่ยนแปลง
            connection.commit()
            return True
        except Error as e:
            # ถ้าเกิด error ใน query คืน error
            print(f"Database Query Error: {e}")
            return str(e) if fetch else False
        finally:
            # ปิด cursor และ connection ทุกครั้ง
            if connection.is_connected():
                cursor.close()
                connection.close()
