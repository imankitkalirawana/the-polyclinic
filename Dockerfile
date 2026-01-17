# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy .npmrc, package.json, and pnpm-lock.yaml for caching
COPY .npmrc package.json pnpm-lock.yaml ./
# Install dependencies
RUN pnpm install --frozen-lockfile
# Copy the rest of the application code
COPY . .
# Build the Next.js app
RUN pnpm build

EXPOSE 3000
# Start the app
CMD ["pnpm", "start"]