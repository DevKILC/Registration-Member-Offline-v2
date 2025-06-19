# -------------------------
# Stage 1: Build
# -------------------------
    FROM node:18-alpine AS builder

    # Set working directory
    WORKDIR /app
    
    # Copy package.json dan package-lock.json terlebih dahulu
    COPY package.json package-lock.json ./
    
    # Install dependencies termasuk devDependencies (Next.js butuh ini saat build)
    RUN npm ci
    
    # Copy seluruh source code (pastikan tidak ada yang terlewat)
    COPY . .
    
    # Build Next.js
    RUN npm run build
    
    # Remove devDependencies setelah build untuk menghemat ukuran image
    RUN npm prune --production
    
    # -------------------------
    # Stage 2: Production
    # -------------------------
    FROM node:18-alpine AS runner
    
    # Set working directory
    WORKDIR /app
    
    # Copy hanya yang diperlukan dari tahap build
    COPY --from=builder /app/package.json /app/
    COPY --from=builder /app/package-lock.json /app/
    COPY --from=builder /app/.next /app/.next
    COPY --from=builder /app/node_modules /app/node_modules
    COPY --from=builder /app/public /app/public
    
    # Set environment
    ENV NODE_ENV=production
    
    # Berikan hak akses ke user `node`
    RUN chown -R node:node /app/.next
    
    # Expose port
    EXPOSE 3000
    
    # Gunakan user non-root
    USER node
    
    # Start application
    CMD ["node", "node_modules/.bin/next", "start"]
    