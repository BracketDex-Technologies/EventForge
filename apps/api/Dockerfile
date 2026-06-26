# ── Production Image ──────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

RUN npm install -g pnpm

# Copy all source files
COPY . .

# Install all dependencies (including devDependencies needed for build)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Generate Prisma client
RUN pnpm --filter @eventforge/db exec prisma generate

# Build API
RUN pnpm --filter @eventforge/api build

# Set production environment
ENV NODE_ENV=production

EXPOSE 4000

CMD ["npx", "tsx", "apps/api/src/main.ts"]
