# 📧 Configuración del Sistema de Email

## 🚀 Instalación y Configuración

### 1. Instalar PHPMailer
```bash
composer install
```

### 2. Configurar Email en `config/email.php`

#### Para Gmail:
```php
const SMTP_HOST = 'smtp.gmail.com';
const SMTP_PORT = 587;
const SMTP_USERNAME = 'tu-email@gmail.com';
const SMTP_PASSWORD = 'tu-password-de-aplicacion'; // NO tu contraseña normal
const SMTP_ENCRYPTION = 'tls';
```

#### Para Outlook/Hotmail:
```php
const SMTP_HOST = 'smtp-mail.outlook.com';
const SMTP_PORT = 587;
const SMTP_USERNAME = 'tu-email@outlook.com';
const SMTP_PASSWORD = 'tu-password';
const SMTP_ENCRYPTION = 'tls';
```

#### Para Yahoo:
```php
const SMTP_HOST = 'smtp.mail.yahoo.com';
const SMTP_PORT = 587;
const SMTP_USERNAME = 'tu-email@yahoo.com';
const SMTP_PASSWORD = 'tu-password';
const SMTP_ENCRYPTION = 'tls';
```

### 3. Configurar Email del Administrador

Editar `data/admin.json`:
```json
{
    "username": "admin",
    "password": "$2y$10$...",
    "email": "admin@tudominio.com",
    "created_at": "2025-01-01 00:00:00",
    "last_login": null,
    "password_changed_at": "2025-01-01 00:00:00"
}
```

### 4. Configurar URL de la Aplicación

En `config/email.php`:
```php
const APP_URL = 'https://tudominio.com'; // Cambiar por tu URL real
```

## 🔐 Configuración de Gmail (Recomendado)

### 1. Habilitar Verificación en 2 Pasos
1. Ve a tu cuenta de Google
2. Seguridad → Verificación en 2 pasos
3. Activar la verificación

### 2. Generar Contraseña de Aplicación
1. Seguridad → Contraseñas de aplicaciones
2. Seleccionar "Correo" y "Otro"
3. Escribir "Catálogo Digital"
4. Copiar la contraseña generada
5. Usar esta contraseña en `SMTP_PASSWORD`

## 🛡️ Seguridad

### Archivos a Proteger:
- `data/admin.json` - Datos del administrador
- `data/recovery_codes.json` - Códigos temporales
- `data/verification_codes.json` - Códigos de verificación
- `data/attempts.json` - Intentos de login

### Configuración del Servidor:
```apache
# .htaccess
<Files "*.json">
    Order Allow,Deny
    Deny from all
</Files>
```

## 📋 Funcionalidades Implementadas

### ✅ Recuperación de Contraseña
- Formulario de solicitud con email
- Código de 6 dígitos por email
- Expiración en 24 horas
- Límite de 3 intentos por hora

### ✅ Cambio de Credenciales
- Cambio de usuario con verificación
- Cambio de contraseña con verificación
- Códigos de verificación por email
- Expiración en 1 hora

### ✅ Seguridad
- Códigos únicos de un solo uso
- Límite de intentos por IP/email
- Logs de intentos y cambios
- Encriptación de contraseñas

## 🔧 Archivos del Sistema

```
config/
├── email.php              # Configuración SMTP
data/
├── admin.json             # Datos del administrador
├── recovery_codes.json    # Códigos de recuperación
├── verification_codes.json # Códigos de verificación
└── attempts.json          # Intentos de login
admin/
├── recovery.php           # Recuperación de contraseña
├── reset-password.php     # Restablecimiento
├── account.php            # Gestión de cuenta
└── login.html             # Login actualizado
```

## 🚨 Solución de Problemas

### Error: "SMTP Error"
- Verificar credenciales
- Comprobar contraseña de aplicación (Gmail)
- Verificar puerto y encriptación

### Error: "Código no enviado"
- Verificar configuración SMTP
- Comprobar logs del servidor
- Verificar límites de envío

### Error: "Código expirado"
- Los códigos expiran en 24h (recuperación) o 1h (verificación)
- Generar nuevo código

## 📞 Soporte

Para problemas técnicos:
- Verificar logs de PHP
- Comprobar configuración SMTP
- Validar archivos de datos

---

**Desarrollado por AMS Desarrollos** 🚀
