# Используем Node.js как базовый образ
FROM node:20-alpine

# Устанавливаем необходимые пакеты
RUN apk add --no-cache netcat-openbsd

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Генерируем Prisma Client
RUN npx prisma generate

# Создаем production build
ENV NODE_ENV=production
ENV SKIP_ENV_VALIDATION=1
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Делаем init.sh исполняемым
RUN chmod +x init.sh

# Открываем порт 3000
EXPOSE 3000

# Запускаем init.sh вместо прямого запуска приложения
CMD ["./init.sh"] 