# Plan de despliegue: Desarrollo en Railway → Producción en DonDominio

Fecha: 27-09-2025

## Objetivo
Mantener el desarrollo actual en Railway y preparar un despliegue simple y estable en DonDominio, conservando las funcionalidades existentes (importación Excel, editor de tabla, tarjetas, carrito, envío de pedidos) y resolviendo la persistencia de imágenes y el envío de correos en producción.

Enlace de referencia del proveedor: https://www.dondominio.com/

## Entornos
- Desarrollo: Railway (preview, logs, pruebas rápidas)
- Producción: DonDominio (hosting compartido con PHP, MySQL opcional, correo y SSL)

## Arquitectura recomendada (simple y viable en DonDominio)
- Frontend: sitio estático (HTML/CSS/JS) igual al actual.
- Endpoints mínimos en PHP (en el mismo dominio) para:
  - Subida de imágenes: `api/upload.php` → guarda archivos en `/images/` y devuelve URL.
  - Envío de pedidos: `api/order.php` → SMTP del hosting (o Mailgun/SendGrid) con los datos del carrito y cliente.
- Persistencia de imágenes: guardar solo URLs en `products[].images` (no blobs/base64 en localStorage).
- Metadatos locales: mantener `localStorage` para estados ligeros; evitar guardar blobs o duplicados.

Nota: Esta arquitectura evita el límite de ~5–10MB de localStorage y aumenta la fiabilidad del correo en producción.

## Fase 1 — Desarrollo en Railway (continuidad)
1) Mantener el repositorio y CI/CD a Railway para ver cambios rápidamente.
2) Implementar integración de subida por HTTP:
   - Cambiar `handleImagesUpload` para enviar `FormData` a `api/upload.php` cuando esté disponible.
   - Guardar en `products[].images` las URLs devueltas.
3) Cambiar envío de pedido:
   - `submitOrder` enviará `POST` a `api/order.php` con el payload actual (cliente + items).
   - Mantener EmailJS como fallback solo en desarrollo si se desea.
4) Eliminar duplicado de imágenes en `catalogTableData` y renderizar la tabla desde `products[].images`.

Resultado: el front seguirá funcionando en Railway y quedará listo para apuntar a los endpoints en DonDominio.

## Fase 2 — Producción en DonDominio
### 2.1 Hosting y estructura
- Carpeta pública: `public_html/`
- Estructura sugerida:
  - `public_html/index.html`
  - `public_html/styles/`
  - `public_html/js/`
  - `public_html/images/` (subidas y estáticos)
  - `public_html/api/upload.php`
  - `public_html/api/order.php`
  - `public_html/.htaccess` (protecciones básicas y límites)
- Activar HTTPS (certificado SSL) desde el panel del hosting.
- PHP: seleccionar versión estable soportada por el hosting (por ej. 8.1+).

### 2.2 Endpoints mínimos PHP
1) `api/upload.php`
   - Acepta `POST multipart/form-data` con campo `file`.
   - Valida MIME y extensión (jpg, jpeg, png, webp), tamaño (ej. ≤ 2–4 MB) y renombra con hash.
   - Guarda en `../images/YYYY/MM/` y devuelve JSON con `{ url: "https://tu-dominio.com/images/YYYY/MM/archivo.ext" }`.
   - Seguridad: validar origen, CSRF simple (token), sanitizar nombres, rechazar PHP/ejecutables.

2) `api/order.php`
   - Acepta `POST application/json` con datos de cliente y carrito.
   - Valida campos requeridos y tamaño del mensaje.
   - Envía correo vía SMTP del hosting o proveedor (Mailgun/SendGrid). Respuesta `{ status: "ok" }`.
   - Seguridad: rate-limit básico por IP (simple lockfile/redis/contador), honeypot opcional.

### 2.3 Cambios en el frontend
- `handleImagesUpload(rowIndex, input)`: enviar `FormData` a `/api/upload.php` y sustituir blobs por la URL devuelta en `products[row].images`.
- `saveTableDataToStorage`: no almacenar blobs/base64; mantener referencias y metadatos.
- `submitOrder()`: enviar `fetch('/api/order.php')` con JSON del pedido; mostrar confirmación al usuario.

### 2.4 Correo
- Opción A: SMTP del hosting DonDominio (creando cuenta de correo en el panel).
- Opción B: Mailgun/SendGrid/SES con credenciales en variables (fuera del repo). Enviar desde `order.php`.

### 2.5 Límites y seguridad
- Tamaño de subida de PHP: configurar `php.ini`/`.user.ini` o `.htaccess` (`upload_max_filesize`, `post_max_size`).
- Proteger `api/` de listados de directorio y deshabilitar ejecución en `images/`.
- Validar estrictamente los archivos subidos y registrar eventos (logs).

## Migración futura a base de datos (opcional pero recomendada)
- Motor: MySQL del hosting.
- Esquema mínimo:
  - `products(id, referencia, name, description, category_id, price, quantity, loc, created_at, updated_at)`
  - `categories(id, name, slug)`
  - `product_images(id, product_id, url, sort_order)`
- API: ampliar `api/` con endpoints PHP o migrar a Laravel cuando sea oportuno.
- Importación Excel: procesar server-side y guardar en DB.

## Gestión de imágenes
- Redimensionar y comprimir en el cliente (canvas) o servidor (Imagick/GD) para thumbnails.
- Estructura por fecha para evitar demasiados archivos en un solo directorio.
- Limitar a 3 imágenes por producto inicialmente.

## Checklist de despliegue (producción)
1) Subir front a `public_html/` (FTP o gestor de archivos).
2) Crear `api/upload.php` y `api/order.php` con credenciales/SMTP en variables.
3) Crear `images/` con permisos correctos y deshabilitar ejecución de scripts.
4) Configurar PHP versión y límites de subida.
5) Activar SSL y forzar HTTPS.
6) Probar: subida de imagen, render en tarjeta, envío de pedido (SMTP real), impresión PDF.
7) Hacer backup inicial y programar backups periódicos.

## Plan de rollback
- Mantener copia ZIP de la versión estable anterior en el hosting.
- Si hay incidencia crítica, restaurar `public_html/` completo y validar endpoints.

## KPIs y pruebas
- Tasa de éxito de subida de imágenes ≥ 99%.
- Tasa de éxito de envío de pedidos ≥ 99%.
- Tiempo de primera carga < 2.5s (con caché/compresión activas).

---
Notas:
- DonDominio ofrece hosting con PHP/MySQL y correo/SSL apto para este enfoque. Ver planes: https://www.dondominio.com/
- Esta guía mantiene el front actual y solo añade dos endpoints mínimos, con una ruta clara a DB cuando sea necesario.


