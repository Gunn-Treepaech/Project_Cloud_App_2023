FROM node:22-alpine

WORKDIR /app

# Install wget for healthcheck
RUN apk add --no-cache wget

# Copy package files
COPY package.json package-lock.json* ./

# Install both dependencies + devDependencies (จำเป็นสำหรับ Vite)
RUN npm ci

# Copy source code
COPY . .

EXPOSE 5173

ENV NODE_ENV=development
ENV VITE_API_BASE_URL=http://app:5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5173/ || exit 1

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
