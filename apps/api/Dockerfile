# ── Stage 1: Build ─────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm

# Copy all source files
COPY . .

# Install dependencies including devDependencies (ignoring lifecycle scripts)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Generate Prisma client directly (bypassing dotenv-cli which requires a local .env file)
RUN pnpm --filter @eventforge/db exec prisma generate

# Build API
RUN pnpm --filter @eventforge/api build

# ── Stage 2: Production image ──────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

RUN npm install -g pnpm

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/packages ./packages

EXPOSE 4000

CMD ["node", "--enable-source-maps", "apps/api/dist/main.js"]
