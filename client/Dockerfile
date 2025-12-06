FROM node:18 AS builder
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    git

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./

RUN npm ci --include=dev

COPY . ./
RUN npm run build


# Вторая стадия - только копирование статики
# FROM alpine:latest
# RUN apk --no-cache add ca-certificates
# WORKDIR /app
# COPY --from=builder /app/build ./build