# Project Cloud App 2023
  ### เริ่มต้นและรันแอปพลิเคชันที่ได้กำหนดไว้ใน Docker Compose configuration file
  ```sh
  sudo docker-compose up -d --build
  ```
  ### หรือ
  ```sh
  sudo docker-compose up --build
  ```
# อธิบายการทำงานแต่ละ Path
  ### "/" - GET
  - การใช้งาน: เป็นหน้าหลักของแอปพลิเคชัน
  - วิธีใช้: เมื่อเข้าถึงหน้าหลักด้วยเมทอด GET จะแสดงข้อความ "Calculate Loan Schedule Program"
  ### "/calculate" - POST
  - การใช้งาน: ใช้สำหรับคำนวณตารางผ่อนชำระสินเชื่อ
  - วิธีใช้: รับข้อมูลที่ส่งมาเป็น JSON จาก HTTP POST request แล้วเรียกใช้ฟังก์ชัน calculate_loan_schedule และส่งข้อมูลเข้าไป จากนั้นจะคืนค่าผลลัพธ์เป็น JSON ผ่าน HTTP response
  - ตัวอย่างการส่งข้อมูลเข้าไปใน "/calculate"
  ```sh
  {
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
  ```
  ### "/showdatadb" - GET
  - การใช้งาน: แสดงข้อมูลทั้งหมดในฐานข้อมูล
  - วิธีใช้: เมื่อทำการเข้าถึงเส้นทางนี้ด้วยเมทอด GET จะแสดงข้อมูลทั้งหมดในฐานข้อมูลเป็น JSON
  ### "/inserdata" - POST
  - การใช้งาน: ใช้สำหรับเพิ่มหรืออัปเดตข้อมูลในฐานข้อมูล
  - วิธีใช้: รับข้อมูลที่ส่งมาเป็น JSON จาก HTTP POST request แล้วเรียกใช้ฟังก์ชัน insert_or_update_data และส่งข้อมูลเข้าไป จากนั้นจะคืนค่าข้อมูลทั้งหมดในฐานข้อมูลเป็น JSON ผ่าน HTTP response
  - ตัวอย่างการส่งข้อมูลเข้าไปใน "/inserdata"
  ```sh
  {
    "MRR": "8.00",
    "bank_name": "SCB",
    "update_MRR": "02/10/2566",
    "years_interest": "0.00"
  }
  ```
  ### "/addcolumn" - POST
  - การใช้งาน: ใช้สำหรับเพิ่มคอลัมน์ในฐานข้อมูล
  - วิธีใช้: รับข้อมูลที่ส่งมาเป็น JSON จาก HTTP POST request แล้วเรียกใช้ฟังก์ชัน add_column และส่งข้อมูลเข้าไป จากนั้นจะคืนค่าข้อมูลทั้งหมดในฐานข้อมูลเป็น JSON ผ่าน HTTP response
  - ❌ข้อควรระวัง❌ ถ้าเพิ่ม column แล้วต้องไปเปลี่ยน code ใน inserdata ด้วยถ้าจะอยากให้ column ใหม่มีการอัพเดทข้อมูล
  - ตัวอย่างการแก้ code ใน inserdata จะเป็นดังนี้
  ```sh
  query_update = f"UPDATE interest_rates SET update_MRR = '{update_MRR}', years_interest = {years_interest}, MRR = {MRR}, column_name = '{column_name}' WHERE bank_name = '{bank_name}'"
  ```
  - ตัวอย่างการส่งข้อมูลเข้าไปใน "/addcolumn"
  ```sh
  {
    "column_name": "column_name" ,
    "data_type": "VARCHAR(50)"
  }
  ```