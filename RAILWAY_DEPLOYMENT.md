# 🚂 Despliegue en Railway - Catálogo Digital

## 🚀 Configuración del Despliegue

### 1. Preparar el Proyecto

#### Archivos de Configuración Creados:
- `railway.json` - Configuración de Railway
- `railway.toml` - Configuración alternativa
- `.railwayignore` - Archivos a ignorar
- `package.json` - Actualizado para Railway

### 2. Variables de Entorno en Railway

#### Configurar en el Dashboard de Railway:

```bash
# Configuración de la Aplicación
NODE_ENV=production
RAILWAY_ENVIRONMENT=production
PORT=3000

# Configuración de Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=tu-email@gmail.com
SMTP_PASSWORD=tu-password-de-aplicacion
SMTP_ENCRYPTION=tls
FROM_EMAIL=tu-email@gmail.com
FROM_NAME=Catálogo Digital - AMS Desarrollos
APP_URL=https://tu-dominio.railway.app

# Configuración del Administrador
ADMIN_EMAIL=admin@tudominio.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=tu-password-segura

# Configuración de la Aplicación
APP_NAME=Catálogo Digital
APP_VERSION=1.0.0
```

### 3. Pasos para Desplegar

#### Opción A: Desde GitHub
1. **Conectar repositorio** en Railway
2. **Seleccionar rama** `main`
3. **Configurar variables** de entorno
4. **Desplegar automáticamente**

#### Opción B: Desde CLI
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login en Railway
railway login

# Inicializar proyecto
railway init

# Configurar variables
railway variables set NODE_ENV=production
railway variables set SMTP_HOST=smtp.gmail.com
# ... más variables

# Desplegar
railway up
```

### 4. Configuración Post-Despliegue

#### Crear archivos de datos:
```bash
# Crear directorio data
mkdir data

# Crear admin.json
echo '{
  "username": "admin",
  "password": "$2y$10$...",
  "email": "admin@tudominio.com",
  "created_at": "2025-01-01 00:00:00",
  "last_login": null,
  "password_changed_at": "2025-01-01 00:00:00"
}' > data/admin.json
```

#### Configurar email:
1. **Actualizar** `config/email.php` con variables de entorno
2. **Configurar** SMTP con credenciales reales
3. **Probar** envío de emails

### 5. Monitoreo y Logs

#### Health Check:
- **Endpoint:** `/health`
- **Verificación:** Estado de la aplicación
- **Información:** Puerto, entorno, versión

#### Logs en Railway:
```bash
# Ver logs en tiempo real
railway logs

# Ver logs específicos
railway logs --service web
```

### 6. Dominio Personalizado

#### Configurar dominio:
1. **Ir a** Settings → Domains
2. **Agregar** dominio personalizado
3. **Configurar** DNS con Railway
4. **Actualizar** APP_URL en variables

### 7. Solución de Problemas

#### Error: "Build failed"
- Verificar `package.json` y dependencias
- Comprobar versión de Node.js
- Revisar logs de build

#### Error: "Service not starting"
- Verificar variables de entorno
- Comprobar puerto (Railway asigna automáticamente)
- Revisar health check

#### Error: "Email not working"
- Verificar configuración SMTP
- Comprobar credenciales
- Revisar logs de email

### 8. Comandos Útiles

```bash
# Ver estado del servicio
railway status

# Ver variables de entorno
railway variables

# Conectar a la base de datos
railway connect

# Reiniciar servicio
railway restart

# Ver métricas
railway metrics
```

### 9. Estructura del Proyecto en Railway

```
/
├── server.js              # Servidor principal
├── package.json           # Dependencias
├── railway.json           # Configuración Railway
├── railway.toml           # Configuración alternativa
├── .railwayignore         # Archivos ignorados
├── index.html             # Página principal
├── styles/                # Estilos CSS
├── js/                    # JavaScript
├── admin/                 # Panel de administración
├── config/                # Configuración
└── data/                  # Datos (se crean en Railway)
```

### 10. URLs del Servicio

#### En Railway:
- **Principal:** `https://tu-dominio.railway.app`
- **Admin:** `https://tu-dominio.railway.app/admin`
- **Health:** `https://tu-dominio.railway.app/health`

#### Funcionalidades:
- ✅ **Catálogo de productos**
- ✅ **Panel de administración**
- ✅ **Recuperación de contraseña**
- ✅ **Gestión de cuenta**
- ✅ **Sistema de email**

---

**🚀 Desarrollado por AMS Desarrollos**

**📧 Soporte:** Para problemas técnicos, revisar logs de Railway y configuración de variables de entorno.
