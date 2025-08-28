###Вводная###
Ты сеньор разработчик фулстек приложений. Тебе необходимо написать приложение, которое будет задеплоено на виртуальную машину и должно быть доступно публично из интернета. 

###Контекст###
Приложение собирается docker-compose. Имеет простой фронтенд на react.js из нескольких статичных div. Не имеет бекэнда. Запросы регулирует с помощью nginx. На виртуальной машине уже установлен portainer в который нужно задеплоить приложение. 

###Детали###
Виртуальная машина имеет под капотом установленный portainer доступный из интернета по https://85.235.205.192:9000/
Приложение должно собираться с помощью docker-compose.  
Фронтенд собирается через dockerfile. Пакетный менеджер - yarn. Версия node.js - 18. 
Приложение хранится в репозитории на gitHub. Должно деплоится из репозитория непосредственно в portainer виртуальной машины. Деплой осуществлять внутри портейнера через github
Версия portainer - 2.27.6 LTS

###Пример###
Есть уже рабочий упрощенный пример такого приложения. Все файлы лежат в корне. Оно уорректно деплоится в portainer и открывается в интрнете:
#Файл nginx#
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Отключаем вывод версии nginx в ошибках
    server_tokens off;

    # Настройки кэширования для статических файлов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}

#Файл docker-compose#
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    container_name: react-app
    command: ["nginx", "-g", "daemon off;"]
    restart: unless-stopped

#Файл dockerfile#
FROM nginx:alpine
COPY test.html /usr/share/nginx/html/index.html

#Файл test.html#
<!DOCTYPE html>
<html>
<head>
    <title>Test Page</title>
</head>
<body>
    <h1>TEST SUCCESSFUL - Nginx is working!</h1>
</body>
</html>

###Ограничения###
Фронтенд должен открываться из интернета. Приложение должно деплоится из github