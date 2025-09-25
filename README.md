# 🛍️ Catálogo Online con Panel de Administración

Sistema completo de catálogo de productos con panel de administración seguro, compatible con cualquier hosting PHP/Node.js.

## 🚀 Características

- **Frontend Público**: Catálogo de productos con filtros por categoría
- **Panel de Administración**: Gestión segura de productos (requiere login)
- **Editor de Tabla**: Interfaz tipo Excel para editar productos
- **Importación Excel**: Carga masiva de productos desde archivos Excel/CSV
- **Gestión de Categorías**: Administración dinámica de categorías
- **Subida de Imágenes**: Hasta 3 imágenes por producto
- **Exportación**: Descarga de datos en formato Excel

## 🔐 Seguridad

- **Autenticación**: Login requerido para administración
- **Sesiones**: Timeout automático de 2 horas
- **Validación**: Sanitización de datos de entrada
- **Acceso Restringido**: Solo admin puede modificar productos

## 📁 Estructura del Proyecto

```
├── index.html              # Frontend público
├── styles/main.css         # Estilos principales
├── js/main.js             # JavaScript del frontend
├── images/                # Imágenes del catálogo
├── admin/                 # Panel de administración
│   ├── login.php          # Sistema de login
│   ├── dashboard.php      # Panel principal
│   ├── editor.php         # Editor de productos
│   ├── api.php            # API REST
│   └── logout.php         # Cierre de sesión
├── data/                  # Base de datos (JSON)
│   ├── products.json      # Productos
│   └── categories.json    # Categorías
├── server.js              # Servidor Node.js (Railway)
├── package.json           # Dependencias Node.js
└── README.md              # Este archivo
```

## 🛠️ Instalación

### Opción 1: Hosting PHP (Recomendado)

1. **Subir archivos** al directorio web del hosting
2. **Configurar permisos**:
   ```bash
   chmod 755 data/
   chmod 644 data/*.json
   ```
3. **Cambiar credenciales** en `admin/login.php`:
   ```php
   $ADMIN_USER = 'tu_usuario';
   $ADMIN_PASS = 'tu_contraseña_segura';
   ```
4. **Acceder** a `tudominio.com/admin`

### Opción 2: Railway (Node.js)

1. **Instalar dependencias**:
   ```bash
   npm install
   ```
2. **Iniciar servidor**:
   ```bash
   npm start
   ```
3. **Desplegar en Railway**:
   - Conectar repositorio GitHub
   - Railway detectará automáticamente el proyecto
   - Configurar variables de entorno si es necesario

## 🔧 Configuración

### Credenciales de Administrador

**Archivo**: `admin/login.php`
```php
$ADMIN_USER = 'admin';           // Cambiar por tu usuario
$ADMIN_PASS = 'catalogo2024';    // Cambiar por contraseña segura
```

### Categorías por Defecto

**Archivo**: `data/categories.json`
```json
[
    {"id": "all", "name": "Todas"},
    {"id": "ktm", "name": "KTM"},
    {"id": "boutique", "name": "Boutique"},
    {"id": "frenos", "name": "Frenos"},
    {"id": "bujias", "name": "Bujías"},
    {"id": "recgeneral", "name": "Rec General"}
]
```

## 📊 API Endpoints

### Públicos (Sin autenticación)
- `GET /admin/api.php/products` - Obtener todos los productos
- `GET /admin/api.php/categories` - Obtener categorías

### Privados (Requieren login)
- `POST /admin/api.php/products` - Crear/actualizar productos
- `POST /admin/api.php/categories` - Actualizar categorías
- `DELETE /admin/api.php/products` - Eliminar todos los productos

## 🎨 Personalización

### Colores
**Archivo**: `styles/main.css`
```css
:root {
    --primary-color: #ff6b35;    /* Color principal */
    --secondary-color: #f7931e;  /* Color secundario */
    --accent-color: #ffd23f;     /* Color de acento */
}
```

### Logo
Reemplazar `images/logo.png` con tu logo personalizado.

## 🔒 Consideraciones de Seguridad

1. **Cambiar credenciales** por defecto
2. **Usar HTTPS** en producción
3. **Backup regular** de `data/products.json`
4. **Monitorear logs** de acceso
5. **Actualizar contraseñas** periódicamente

## 🚨 Limitaciones

- **Base de datos JSON**: Máximo ~1000 productos
- **Sin HTTPS**: Datos en texto plano (usar SSL)
- **Escalabilidad**: Máximo 100 usuarios concurrentes
- **Backup manual**: No hay backup automático

## 📞 Soporte

Para problemas técnicos o mejoras, contactar al desarrollador.

---

**Desarrollado con ❤️ para máxima compatibilidad y simplicidad**