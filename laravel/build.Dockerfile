# api本番環境用
# ビルダー
FROM php:8.2 as builder

WORKDIR /app
COPY ./src /app/

COPY --from=composer /usr/bin/composer /usr/bin/composer
RUN composer self-update --2

RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip

ENV COMPOSER_ALLOW_SUPERUSER 1
# メモリ不足の対策に、一時的にCOMPOSER_MEMORY_LIMIT
RUN COMPOSER_MEMORY_LIMIT=-1 $(which composer) install
# オートローダー最適化
RUN composer install --optimize-autoloader --no-dev

# 実行環境
FROM php:8.2-apache

ARG FRONT_ORIGIN
ARG APP_KEY
ARG DB_CONNECTION
ARG DB_HOST
ARG DB_PORT
ARG DB_DATABASE
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_SCHEMA

ENV FRONT_ORIGIN $FRONT_ORIGIN
ENV APP_ENV production
ENV APP_DEBUG false
ENV APP_KEY $APP_KEY
ENV DB_CONNECTION $DB_CONNECTION
ENV DB_HOST $DB_HOST
ENV DB_PORT $DB_PORT
ENV DB_DATABASE $DB_DATABASE
ENV DB_USERNAME $DB_USERNAME
ENV DB_PASSWORD $DB_PASSWORD
ENV DB_SCHEMA $DB_SCHEMA
ENV SESSION_DRIVER=file

RUN apt-get update && apt-get install -y libpq-dev && \
    docker-php-ext-install pdo_pgsql

COPY --from=builder /app /var/www
COPY ./apache2/ /etc/apache2

RUN chmod 777 -R /var/www/public && \
    chmod 777 -R /var/www/storage && \
    a2enmod rewrite

WORKDIR /var/www
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    mv .env.example .env

WORKDIR /var/www/public
