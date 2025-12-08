FROM python:3.11-slim

EXPOSE 5000
WORKDIR /app

# ✅ อยู่โฟลเดอร์เดียวกันแล้ว ไม่ต้องมี path
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ✅ คัดลอกไฟล์ทั้งหมดในโฟลเดอร์ app เข้า container
COPY app/ .

ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/ || exit 1

CMD ["python", "app.py"]
