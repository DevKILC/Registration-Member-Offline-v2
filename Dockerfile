# -------------------------
# Stage 1: Build
# -------------------------
    FROM node:18-alpine AS builder

    WORKDIR /app
    
    # Copy package files and install dependencies
    COPY package.json package-lock.json ./
    RUN npm ci
    
    # Copy seluruh source code (termasuk public, dll)
    COPY . .
    
    # ⬇️ Auto-generate .env.production from all NEXT_PUBLIC_ envs
    # Gunakan shell untuk filter semua variabel NEXT_PUBLIC_
    RUN printenv | grep NEXT_PUBLIC_ > .env.production
    
    # Debug (optional): lihat isi .env.production
    # RUN cat .env.production
    
    # Build
    RUN npm run build
    
    # Prune devDependencies
    RUN npm prune --production
    
    # -------------------------
    # Stage 2: Production
    # -------------------------
    FROM node:18-alpine AS runner
    
    WORKDIR /app
    
    COPY --from=builder /app/package.json /app/
    COPY --from=builder /app/package-lock.json /app/
    COPY --from=builder /app/.next /app/.next
    COPY --from=builder /app/node_modules /app/node_modules
    COPY --from=builder /app/public /app/public
    
    ENV NODE_ENV=production
    
    EXPOSE 3000
    
    USER node
    
    CMD ["node", "node_modules/.bin/next", "start"]
    