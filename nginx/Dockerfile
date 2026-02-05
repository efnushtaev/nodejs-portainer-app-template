# nginx/Dockerfile
FROM nginx:alpine

# Удаляем дефолтную конфигурацию nginx
RUN rm /etc/nginx/conf.d/default.conf

# Копируем нашу кастомную конфигурацию
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем статику фронтенда (будет смонтирована через volumes в docker-compose)
COPY --from=portainer-demo-docker-compose-frontend /app/build /usr/share/nginx/html