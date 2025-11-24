FROM node:20-alpine AS base

# Установка рабочей директории
WORKDIR /app

# Установка зависимостей
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# Сборка приложения
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Запуск приложения
FROM base AS runner
ENV NODE_ENV production
ENV PORT 3001

# Копирование необходимых файлов
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Открытие порта
EXPOSE 3001

# Запуск приложения
CMD ["node", "server.js"] 