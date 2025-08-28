FROM node:18 AS builder
WORKDIR /app

# Добавьте пользователя node для избежания проблем с правами
RUN chown -R node:node /app
USER node

COPY client/package.json client/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY ./client .
RUN yarn build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80