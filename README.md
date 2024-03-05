# Project Cloud App 2023 : เว็บแอปพลิเคชั่นจำลองการผ่อนบ้าน
  This project is created for the EN814710 course within GitHub as a repository. It serves as a space to store data, comprising frontend, backend, and database folders. Each folder contains a Dockerfile ready for use, and Docker-Compose that can create a "เว็บแอปพลิเคชั่นจำลองการผ่อนบ้าน" for immediate use.
  - app : backend
  - db : database
  - frontend : frontend
  ### Member
  - นายกฤษณะ  พุ่มพยอม  633040145-9
  - นายกิตินันท์  กุณโฮง   633040148-3
  - นายตรีเพชร ตรีจันทร์   633040156-4
  - นายเสฎฐวุฒิ นัตธิลม    633040607-7
  ### เริ่มต้นติดตั้ง Docker
  ```sh
  sudo apt-get update
  ```
  ```sh
  sudo apt-get install docker.io
  ```
  ```sh
  docker --version
  ```
  ```sh
  git clone https://github.com/Gunn-Treepaech/Project_Cloud_App_2023.git
  cd Project_Cloud_App_2023
  ```
  ### เริ่มต้นและรันแอปพลิเคชันที่ได้กำหนดไว้ใน Docker Compose configuration file
  ```sh
  sudo docker-compose up -d --build
  ```
  ### หรือ
  ```sh
  sudo docker-compose up --build
  ```
  ### Check image
  ```sh
  docker image ls
  ```
  ### Check container 
  ```sh
  docker container ls 
  ```
  ### Check network 
  ```sh
  docker network ls
  ```
  ### Check volumn 
  ```sh
  docker volumn ls
  ```
  ### Enter the website
  ```sh
  localhost:5173
  ```
  ### shut down Docker Compose
  ```sh
  docker-compose down
  ```
# อธิบายการทำงานแต่ละ Path
  ### "/" - GET
  - การใช้งาน: เป็นหน้าหลักของแอปพลิเคชัน
  - วิธีใช้: เมื่อเข้าถึงหน้าหลักด้วยเมทอด GET จะแสดงข้อความ "Calculate Loan Schedule Program"
  ### "api/calculate" - POST
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
  ### "api/showdatadb" - GET
  - การใช้งาน: แสดงข้อมูลทั้งหมดในฐานข้อมูล
  - วิธีใช้: เมื่อทำการเข้าถึงเส้นทางนี้ด้วยเมทอด GET จะแสดงข้อมูลทั้งหมดในฐานข้อมูลเป็น JSON
  ### "api/inserdata" - POST
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
  ### "api/addcolumn" - POST
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
