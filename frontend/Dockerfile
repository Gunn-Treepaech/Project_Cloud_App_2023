FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

EXPOSE 5173

# Set environment for development
ENV NODE_ENV=development
ENV VITE_API_BASE_URL=http://app:5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5173/ || exit 1

# Start the development server with host binding for container access
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
