# Mortgage Calculator Pro : เครื่องมือคำนวณสินเชื่อบ้านออนไลน์

เครื่องมือคำนวณสินเชื่อบ้านสำหรับตลาดไทย ช่วยคำนวณตารางผ่อนชำระ เปรียบเทียบเงื่อนไขสินเชื่อได้พร้อมกันสูงสุด 4 ธนาคาร รองรับอัตราดอกเบี้ยแบบผสม (Fixed Rate ตามด้วยดอกเบี้ยลอยตัวอิง MRR) และปฏิทินแบบพุทธศักราช

## ✨ ฟีเจอร์หลัก

- **เปรียบเทียบได้สูงสุด 4 ธนาคาร** พร้อมกัน ด้วยข้อมูลเงินกู้/งวดผ่อนชุดเดียวกัน
- **อัตราดอกเบี้ยแบบไดนามิก** — กำหนดช่วง Fixed Rate (0/1/2/3 ปี) ตามด้วยส่วนลดจาก MRR ในปีถัดไป
- **ตารางผ่อนชำระละเอียดรายงวด** พร้อมกราฟสัดส่วนเงินต้น/ดอกเบี้ย
- **ดาวน์โหลดตารางผ่อนเป็น Excel (.xlsx)** — มีสูตรคำนวณครบทุกช่อง แก้ไขตัวเลข (วงเงินกู้, งวดผ่อน, MRR, ส่วนลดดอกเบี้ย ฯลฯ) แล้วตารางคำนวณใหม่ให้อัตโนมัติ
- **ข้อมูลธนาคารไทยจริง** (SCB, KTB, Kbank, UOB) พร้อมระบบ MRR ที่แก้ไข/เพิ่มคอลัมน์ได้จากฐานข้อมูล
- **ความแม่นยำทางการเงิน** ด้วย Python `Decimal` ทุกขั้นตอนการคำนวณ

## 🏗️ สถาปัตยกรรม

โปรเจกต์เป็น microservices 4 ส่วน รันร่วมกันผ่าน Docker Compose โดยมี **nginx เป็นทางเข้าเดียวผ่าน HTTPS** — `frontend` และ `backend` ไม่เปิดพอร์ตออกสู่ host โดยตรงอีกต่อไป (เข้าถึงได้เฉพาะภายใน Docker network) และ **พอร์ต 80 ปิดสนิท** (nginx ไม่รับฟัง HTTP เลย):

| Service | เทคโนโลยี | พอร์ตที่เปิดสู่ host |
|---|---|---|
| `nginx` | nginx (reverse proxy + TLS termination, self-signed cert) | **443 (HTTPS เท่านั้น)** |
| `frontend` | React 19 + Vite + Tailwind CSS + DaisyUI | ไม่เปิด (internal only) |
| `backend` | Flask 2.3 + Flask-CORS | ไม่เปิด (internal only) |
| `db` | MySQL 8.0 | 32000 (host) → 3306 (container) |

```
backend/app/      Flask API (app.py, database_manager.py, loan_calculator.py)
frontend/src/     React app (components, hooks, services, utils)
nginx/            reverse proxy + TLS (Dockerfile สร้าง self-signed cert ตอน build)
database/         init.sql (schema + ข้อมูล MRR เริ่มต้น)
```

nginx proxy `/api/*` ไปที่ `backend:5000` และ path อื่นทั้งหมดไปที่ `frontend:5173` ภายใน Docker network เดียวกัน

โครงสร้าง component ฝั่ง frontend และรายละเอียดสถาปัตยกรรมเชิงลึกดูได้ที่ [`CLAUDE.md`](CLAUDE.md)

## 🚀 เริ่มต้นใช้งาน (Docker Compose — แนะนำ)

```sh
# ติดตั้ง Docker (ถ้ายังไม่มี)
sudo apt-get update
sudo apt-get install docker.io docker-compose-plugin
docker --version

# โคลนโปรเจกต์
git clone https://github.com/Gunn-Treepaech/Project_Cloud_App_2023.git
cd Project_Cloud_App_2023

# build และรันทั้งหมด
docker compose up -d --build

# เปิดใช้งานที่
# https://localhost
```

> ⚠️ ใบรับรองเป็นแบบ **self-signed** (สร้างขึ้นตอน build image ของ `nginx/`) เหมาะสำหรับใช้งาน local/dev เท่านั้น — เบราว์เซอร์จะเตือนว่าใบรับรองไม่น่าเชื่อถือ ให้กด "Advanced" → "Proceed to localhost" เพื่อเข้าใช้งาน ถ้าต้องการใช้จริงบน production ให้เปลี่ยนไปใช้ใบรับรองจาก Let's Encrypt หรือ CA ที่เชื่อถือได้แทน

คำสั่งที่ใช้บ่อย:

```sh
docker compose ps              # ดูสถานะ container
docker compose logs -f         # ดู log แบบ real-time
docker compose down            # ปิดการทำงานทั้งหมด
docker compose up -d --build   # rebuild หลังแก้โค้ด
```

## 🛠️ พัฒนาแบบ Manual (ไม่ผ่าน Docker)

```sh
# Backend (Flask) — ต้องมี MySQL รันอยู่แล้วที่ host: db, port: 3306
cd backend/app
pip install -r ../requirements.txt
python app.py            # รันที่ 0.0.0.0:5000

# Frontend (React)
cd frontend
npm install
npm run dev               # รันที่ 0.0.0.0:5173 พร้อม proxy /api ไปที่ backend:5000
```

คำสั่งอื่นของ frontend: `npm run build` (build production), `npm run lint` (ตรวจ ESLint), `npm run preview` (พรีวิว production build)

## 📡 API Endpoints

### `GET /`
คืนข้อความต้อนรับ `"Calculate Loan Schedule Program"`

### `POST /api/calculate`
คำนวณตารางผ่อนชำระของ 1 ธนาคาร ตามพารามิเตอร์ที่ส่งมา

```json
{
  "start_month": 11,
  "start_year": 2024,
  "initial_loan": 3000000,
  "fixed_interest": 2.95,
  "fixed_year": 3,
  "MRR": 8.8,
  "monthly_payment": 15000,
  "chang_interest": [2.95, 1.95],
  "bank": "UOB"
}
```

คืนค่าตารางผ่อนชำระ (สูงสุด 36 งวด) แยกตามชื่อธนาคาร แต่ละงวดมี `month`, `year`, `remaining`, `interest`, `balance`, `overpayment`, `interest_rate`

### `GET /api/showdatadb`
ดึงข้อมูลอัตราดอกเบี้ยของทุกธนาคารจากตาราง `interest_rates`

### `POST /api/insertdata`
เพิ่ม/อัปเดตข้อมูลอัตราดอกเบี้ยของธนาคาร (`bank_name`, `update_MRR`, `years_interest`, `MRR`)

```json
{
  "bank_name": "SCB",
  "update_MRR": "02/10/2566",
  "years_interest": "0.00",
  "MRR": "8.00"
}
```

### `POST /api/addcolumn`
เพิ่มคอลัมน์ใหม่ในตาราง `interest_rates` (รองรับเฉพาะ `VARCHAR(50)`, `INT`, `DECIMAL(5,2)`, `DATE`)

```json
{
  "column_name": "column_name",
  "data_type": "VARCHAR(50)"
}
```

> ⚠️ หลังเพิ่มคอลัมน์ใหม่ ต้องแก้โค้ดใน `database_manager.py`/`app.py` ส่วน `insertdata` เพิ่มเติม ถ้าต้องการให้คอลัมน์นั้นอัปเดตค่าได้ด้วย

### `GET /api/bank-info?bank=<ชื่อธนาคารภาษาไทย>`
ดึงข้อมูล MRR และดอกเบี้ยคงที่ของธนาคารที่ระบุ (รองรับชื่อธนาคารภาษาไทย เช่น `ธนาคารกสิกรไทย`)

## 📝 เอกสารอื่นในโปรเจกต์

- [`CLAUDE.md`](CLAUDE.md) — สถาปัตยกรรม, pattern การเขียนโค้ด, และ context สำหรับ Claude Code
- [`API_ERROR_HANDLING.md`](API_ERROR_HANDLING.md) — รายละเอียดระบบจัดการ error/timeout ฝั่ง frontend
- [`SECURITY_AUDIT.md`](SECURITY_AUDIT.md) — รายงานตรวจสอบความปลอดภัยและข้อเสนอแนะ
