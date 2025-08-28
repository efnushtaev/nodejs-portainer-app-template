# Используем официальный образ Node.js
FROM node:18 AS builder

# Устанавливаем необходимые системные зависимости
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    git

WORKDIR /app
COPY client/package.json ./
COPY client/package-lock.json ./

# Устанавливаем зависимости через npm
RUN npm ci --only=production

COPY client/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80