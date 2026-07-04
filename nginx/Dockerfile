FROM nginx:alpine

# สร้าง self-signed certificate ตอน build image (ใช้สำหรับ local/dev เท่านั้น)
RUN apk add --no-cache openssl && \
    mkdir -p /etc/nginx/certs && \
    openssl req -x509 -nodes -days 825 \
      -newkey rsa:2048 \
      -keyout /etc/nginx/certs/selfsigned.key \
      -out /etc/nginx/certs/selfsigned.crt \
      -subj "/C=TH/ST=Bangkok/L=Bangkok/O=MortgageCalculatorPro/CN=localhost" \
      -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 443
