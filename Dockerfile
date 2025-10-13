# -------------------------
# Stage 1: Build
# -------------------------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set build environment
ENV NODE_ENV=production

# Add memory optimization for build
ENV NODE_OPTIONS=--max_old_space_size=4096

# Build aplikasi - env vars akan diambil dari runtime di CapRover
# Hanya NEXT_PUBLIC_* yang benar-benar perlu di build time
RUN npm run build

# Remove devDependencies
RUN npm prune --production

# -------------------------
# Stage 2: Production
# -------------------------
FROM node:18-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public

# Copy next.config if exists
COPY --from=builder /app/next.config.* ./

# Set proper permissions
RUN chown -R node:node /app

EXPOSE 3000

USER node

# Start aplikasi
CMD ["npm", "start"]