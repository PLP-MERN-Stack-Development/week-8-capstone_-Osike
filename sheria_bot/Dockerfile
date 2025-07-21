# Multi-stage Dockerfile for SheriaBot

# Frontend build stage
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Backend stage
FROM node:18-alpine AS backend
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ .

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S sheriabot -u 1001

# Copy backend files
COPY --from=backend --chown=sheriabot:nodejs /app ./
COPY --from=frontend-build --chown=sheriabot:nodejs /app/dist ./public

# Create logs directory
RUN mkdir -p logs && chown sheriabot:nodejs logs

USER sheriabot

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]