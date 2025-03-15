# -------------------------
# Stage 1: Build
# -------------------------
    FROM node:18-alpine AS builder

    # Set working directory
    WORKDIR /app
    
    # Install dependencies efficiently
    COPY package.json package-lock.json ./
    RUN npm ci --only=production
    
    # Copy source code
    COPY . .
    
    # Build Next.js app
    RUN npm run build
    
    # Remove unnecessary dependencies (clean up)
    RUN npm prune --production
    
    # -------------------------
    # Stage 2: Production
    # -------------------------
    FROM node:18-alpine AS runner
    
    # Set working directory
    WORKDIR /app
    
    # Copy only necessary files from the builder stage
    COPY --from=builder /app/package.json /app/
    COPY --from=builder /app/package-lock.json /app/
    COPY --from=builder /app/.next /app/.next
    COPY --from=builder /app/node_modules /app/node_modules
    COPY --from=builder /app/public /app/public
    
    # Set environment
    ENV NODE_ENV=production
    
    # Expose port 3000
    EXPOSE 3000
    
    # Use non-root user for security
    USER node
    
    # Healthcheck (pastikan service berjalan)
    HEALTHCHECK --interval=30s --timeout=5s --start-period=30s \
      CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1
    
    # Start application
    CMD ["node", "node_modules/.bin/next", "start"]
    