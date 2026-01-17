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

# Production stage
FROM node:18-alpine
WORKDIR /app
# Install pnpm globally (needed for runtime)
RUN npm install -g pnpm
# Copy only necessary files from the builder stage
COPY --from=builder /app/.npmrc /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
# Expose the port Next.js runs on
EXPOSE 3000
# Start the app
CMD ["pnpm", "start"]