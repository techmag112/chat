FROM php:8.1-fpm
 
# ставим необходимые для нормальной работы модули
RUN apt-get update && apt-get install -y \
        curl \
        wget \
        git \
        libzip-dev \
        zip \
        && docker-php-ext-install mysqli pdo pdo_mysql \
        && docker-php-ext-enable mysqli pdo_mysql \
        && docker-php-ext-install zip \
        && apt-get install -y supervisor

RUN mkdir -p /var/log/supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
# Устанавливаем Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
COPY --from=composer/composer:latest-bin /composer /usr/bin/composer
# Добавим свой php.ini, можем в нем определять свои значения конфига
ADD php.ini /usr/local/etc/php/conf.d/40-custom.ini

COPY composer.json /var/www/html
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN composer install \
    --no-interaction \
    --no-plugins \
    --no-scripts \
    --prefer-dist
## Copy Composer dependencies
WORKDIR /var/www/html
EXPOSE 8090
RUN composer dump-autoload --optimize
 
#CMD ["php-fpm"]
CMD ["/usr/bin/supervisord"]

#EXPOSE 8090
#COPY chat-server.php /var/www/html
#ENTRYPOINT ["/bin/bash", "php-fpm /var/www/html/chat-server.php"]