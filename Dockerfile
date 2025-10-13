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

RUN npm run build

# DON'T prune devDependencies yet - TypeScript needed for next.config.ts at runtime

# -------------------------
# Stage 2: Production
# -------------------------
FROM node:18-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Create npm cache directory with proper permissions BEFORE switching to node user
RUN mkdir -p /home/node/.npm && chown -R node:node /home/node/.npm

# Copy necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public

# Copy next.config if exists
COPY --from=builder /app/next.config.* ./

# Set proper permissions for app directory
RUN chown -R node:node /app

# Switch to node user
USER node

EXPOSE 3000

# Start aplikasi
CMD ["npm", "start"]