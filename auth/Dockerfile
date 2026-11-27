FROM node:24-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM dependencies AS migrator
COPY prisma ./prisma
COPY prisma7.config.ts ./
CMD ["npx", "prisma", "migrate", "deploy"]

FROM dependencies AS dev
COPY . .
ENV PORT=3000 HOSTNAME=0.0.0.0
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM dev AS builder
RUN mkdir -p public && npm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
