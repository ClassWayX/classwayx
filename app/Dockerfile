# ===== Install Dependencies =====
FROM node:24-alpine AS dependencies
WORKDIR /app

COPY package*.json .
RUN npm ci

# ===== Run Development =====
FROM node:24-alpine AS dev
WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
# Need to mount source code

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "run", "dev"]

# ===== Build Application =====
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ===== Production Runner =====
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]