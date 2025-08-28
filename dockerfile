# Используем официальный образ Node.js
FROM node:18 AS builder

# Устанавливаем необходимые системные зависимости
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    git

WORKDIR /app
# Увеличиваем лимит памяти для Node.js
ENV NODE_OPTIONS="--max-old-space-size=4096"
# Копируем и проверяем наличие package.json
COPY client/package.json client/yarn.lock ./
RUN ls -la && echo "Проверяем package.json:" && cat package.json

# Устанавливаем зависимости
RUN yarn install --frozen-lockfile

# Копируем и проверяем исходный код
COPY client/ ./
RUN echo "Содержимое src директории:" && ls -la src/ || echo "Нет src директории"
RUN echo "Содержимое public директории:" && ls -la public/ || echo "Нет public директории"

# Пытаемся собрать приложение
RUN yarn build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80