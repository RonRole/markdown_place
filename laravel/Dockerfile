# api開発環境用docker
FROM php:8.2

RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    # pdo_pgsqlに必要
    libpq-dev

# php->postgres接続用ドライバー
RUN docker-php-ext-install pdo_pgsql

COPY --from=composer /usr/bin/composer /usr/bin/composer
RUN composer self-update --2

WORKDIR /app
COPY ./src /app

ENV COMPOSER_ALLOW_SUPERUSER 1
# メモリ不足の対策に、一時的にCOMPOSER_MEMORY_LIMIT
RUN COMPOSER_MEMORY_LIMIT=-1 $(which composer) install

EXPOSE 8000
CMD ["php", "artisan", "serve", "--host", "0.0.0.0"]