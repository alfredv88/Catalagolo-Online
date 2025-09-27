# Imagen base con Apache + PHP 8.2
FROM php:8.2-apache

# Habilitar mod_rewrite (opcional)
RUN a2enmod rewrite

# Copiar el proyecto al DocumentRoot
COPY . /var/www/html/

# Crear carpeta de imágenes con permisos
RUN mkdir -p /var/www/html/images && chown -R www-data:www-data /var/www/html/images

# Exponer el puerto 80
EXPOSE 80

# Apache por defecto
