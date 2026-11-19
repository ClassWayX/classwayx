# ===== Install Dependencies =====
FROM node:24-alpine AS dependencies
WORKDIR /app

COPY package*.json .
RUN npm ci

# ===== Database Migrations =====
FROM dependencies AS migrator
COPY prisma ./prisma
COPY prisma7.config.ts ./prisma7.config.ts

# ===== Run Development =====
FROM dependencies AS dev
COPY . .
# Need to mount source code

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN npx prisma generate

CMD ["npm", "run", "dev"]

# ===== Build Application =====
FROM dependencies AS builder
COPY . .

RUN npx prisma generate

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
COPY --from=builder /app/app/generated/prisma ./app/generated/prisma

EXPOSE 3000

CMD ["node", "server.js"]
