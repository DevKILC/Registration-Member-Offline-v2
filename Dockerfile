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

# Build dengan ARG untuk build-time variables
ARG NODE_ENV=production
ARG DATABASE_URL
ARG NEXTAUTH_SECRET
ARG NEXT_PUBLIC_API_URL

# Set as ENV untuk build process
ENV NODE_ENV=$NODE_ENV
ENV DATABASE_URL=$DATABASE_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build aplikasi
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

# Copy built application
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public

# Copy next.config.js jika ada
COPY --from=builder /app/next.config.js ./next.config.js

# Set proper permissions
RUN chown -R node:node /app

EXPOSE 3000

USER node

# Start dengan explicit config
CMD ["npm", "start"]