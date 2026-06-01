FROM php:8.4-cli

# Installation des dépendances système et des extensions PHP pour PostgreSQL
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Copier Composer depuis son image officielle
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
