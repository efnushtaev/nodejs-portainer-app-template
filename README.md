docker-compose up -d --build

##AI-PROMPT

Есть набор файлов в приложении. При деплое в portainer на удаленный сервер в stack, я ожидаю увидеть фронтенд в "http://<мой-удаленный-сервер>". Но там дефолтное окошко nginx "Welcome to nginx!..."

root/client/dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM alpine:latest AS config-prepare
RUN mkdir -p /etc/nginx/conf.d
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

root/nginx/nginx.conf
server {
    listen 80;
    server_name _;
    
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://portainer:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}

root/docker-compose
version: '3.8'

services:
  frontend-builder:
    build: 
      context: .
      dockerfile: ./client/Dockerfile
    networks:
      - portainer-network
    volumes:
      - frontend-build:/app/build

  web:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - nginx-config:/etc/nginx/conf.d
      - frontend-build:/usr/share/nginx/html:ro
    networks:
      - portainer-network
    depends_on:
      - frontend-builder

  portainer:
    image: portainer/portainer-ce:latest
    command: -H unix:///var/run/docker.sock
    restart: always
    ports:
      - "9443:9443"  # ИЗМЕНЕНО: используем порт 9001
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer-data:/data
    networks:
      - portainer-network

networks:
  portainer-network:
    driver: bridge

volumes:
  frontend-build:
  portainer-data:
  nginx-config:

Как получить фронтенд?