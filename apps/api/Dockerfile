# ── Production Image ──────────────────────────────────────────
# Use the Debian-based slim image instead of Alpine because Prisma's
# query engine expects glibc/OpenSSL libraries that are easier to satisfy
# on Debian. This avoids the common "Unable to require libssl" crash on Render.
FROM node:20-slim
WORKDIR /app

# Install pnpm and Prisma runtime dependencies.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      ca-certificates \
      openssl \
      libc6-dev && \
    rm -rf /var/lib/apt/lists/* && \
    npm install -g pnpm@9.12.0

# Copy workspace/package manifests first for better layer caching.
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/workers/package.json ./apps/workers/
COPY packages/db/package.json ./packages/db/
COPY packages/domain/package.json ./packages/domain/
COPY packages/config/package.json ./packages/config/
COPY packages/api-sdk/package.json ./packages/api-sdk/

# Install all dependencies (dev deps are required for tsx and the build check).
# --ignore-scripts prevents prepare/husky from running, which would fail without a root .env.
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy source files.
COPY . .

# Generate Prisma client for the target platform.
RUN pnpm --filter @eventforge/db exec prisma generate

# Build the API to catch TypeScript errors early.
RUN pnpm --filter @eventforge/api build

ENV NODE_ENV=production
EXPOSE 4000

# Run the API from TypeScript source via tsx. The workspace package exports
# point to .ts files, so the built dist/main.js cannot be executed directly by
# Node. Keeping tsx in the production image is the pragmatic fix for now.
CMD ["pnpm", "--filter", "@eventforge/api", "exec", "tsx", "src/main.ts"]
