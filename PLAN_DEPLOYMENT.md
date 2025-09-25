# 📋 PLAN DE DESPLIEGUE - CATÁLOGO ONLINE

## 🎯 OBJETIVO
Desplegar el catálogo con backend PHP seguro en Railway, listo para migración al hosting del cliente.

---

## ✅ COMPLETADO

### 🔧 Backend PHP Implementado
- [x] Sistema de autenticación (`admin/login.php`)
- [x] Panel de administración (`admin/dashboard.php`)
- [x] API REST segura (`admin/api.php`)
- [x] Editor integrado (`admin/editor.php`)
- [x] Base de datos JSON (`data/products.json`, `data/categories.json`)
- [x] Servidor Node.js para Railway (`server.js`, `package.json`)
- [x] Documentación completa (`README.md`)

### 🔐 Seguridad Implementada
- [x] Login obligatorio para administración
- [x] Sesiones con timeout (2 horas)
- [x] Validación de datos en endpoints
- [x] Sanitización de entradas
- [x] Acceso restringido solo para admin

---

## 🚨 PENDIENTE - ACCIONES CRÍTICAS

### 1. 🔑 CONFIGURACIÓN DE SEGURIDAD
**PRIORIDAD: ALTA**
- [ ] **Cambiar credenciales por defecto** en `admin/login.php`
  ```php
  $ADMIN_USER = 'admin';           // CAMBIAR
  $ADMIN_PASS = 'catalogo2024';    // CAMBIAR POR CONTRASEÑA SEGURA
  ```
- [ ] **Configurar contraseña segura** (mínimo 12 caracteres, números, símbolos)
- [ ] **Documentar credenciales** en lugar seguro

### 2. 🧪 TESTING LOCAL
**PRIORIDAD: ALTA**
- [ ] **Probar login de administrador**
  - Abrir `http://localhost/admin/login.php`
  - Verificar que funciona con credenciales por defecto
- [ ] **Probar panel de administración**
  - Verificar dashboard carga correctamente
  - Probar editor de productos
  - Verificar que se pueden agregar/editar productos
- [ ] **Probar API endpoints**
  - GET `/admin/api.php/products` (público)
  - POST `/admin/api.php/products` (requiere login)
- [ ] **Probar integración frontend-backend**
  - Verificar que productos se muestran en catálogo público
  - Probar filtros por categoría

### 3. 📦 PREPARACIÓN PARA GIT
**PRIORIDAD: MEDIA**
- [ ] **Verificar .gitignore**
  - Confirmar que `data/products.json` está excluido
  - Confirmar que `data/categories.json` está excluido
  - Verificar que `node_modules/` está excluido
- [ ] **Crear archivos de ejemplo**
  - `data/products.example.json` (con datos de prueba)
  - `data/categories.example.json` (categorías por defecto)
- [ ] **Commit inicial**
  ```bash
  git add .
  git commit -m "feat: Backend PHP con autenticación implementado"
  git push origin main
  ```

### 4. 🚀 DESPLIEGUE EN RAILWAY
**PRIORIDAD: ALTA**
- [ ] **Crear cuenta en Railway**
  - Ir a https://railway.app
  - Conectar con GitHub
- [ ] **Conectar repositorio**
  - Seleccionar repositorio del catálogo
  - Railway detectará automáticamente Node.js
- [ ] **Configurar variables de entorno** (si es necesario)
  - `NODE_ENV=production`
  - `PORT=3000` (automático)
- [ ] **Verificar despliegue**
  - Acceder a URL proporcionada por Railway
  - Probar catálogo público
  - Probar login de administrador
- [ ] **Configurar dominio personalizado** (opcional)
  - Si el cliente tiene dominio específico

### 5. 🔒 CONFIGURACIÓN DE PRODUCCIÓN
**PRIORIDAD: ALTA**
- [ ] **Cambiar credenciales en producción**
  - Editar `admin/login.php` en Railway
  - Usar credenciales seguras
- [ ] **Configurar HTTPS** (Railway lo proporciona automáticamente)
- [ ] **Verificar permisos de archivos**
  - `data/` debe ser escribible
- [ ] **Probar funcionalidad completa**
  - Login de administrador
  - Agregar productos
  - Importar Excel
  - Exportar datos
  - Gestión de categorías

### 6. 📊 DATOS INICIALES
**PRIORIDAD: MEDIA**
- [ ] **Agregar productos de prueba**
  - Usar el panel de administración
  - Agregar al menos 5-10 productos
  - Incluir diferentes categorías
- [ ] **Configurar categorías**
  - Verificar que todas las categorías están disponibles
  - Agregar categorías adicionales si es necesario
- [ ] **Probar importación Excel**
  - Crear archivo Excel de prueba
  - Verificar que importa correctamente

### 7. 📚 DOCUMENTACIÓN FINAL
**PRIORIDAD: MEDIA**
- [ ] **Actualizar README.md**
  - Agregar URL de Railway
  - Documentar credenciales de acceso
  - Incluir instrucciones de uso
- [ ] **Crear guía de usuario**
  - Cómo acceder al panel de administración
  - Cómo agregar productos
  - Cómo importar Excel
  - Cómo gestionar categorías
- [ ] **Documentar para migración**
  - Instrucciones para migrar a hosting del cliente
  - Lista de archivos a transferir
  - Configuraciones necesarias

### 8. 🔄 PREPARACIÓN PARA MIGRACIÓN
**PRIORIDAD: BAJA**
- [ ] **Crear script de migración**
  - Exportar todos los datos
  - Lista de archivos a transferir
  - Configuraciones a replicar
- [ ] **Documentar dependencias**
  - PHP 7.4+ requerido
  - Extensiones necesarias
  - Permisos de archivos
- [ ] **Crear backup completo**
  - Código fuente
  - Base de datos (JSON)
  - Configuraciones

---

## 🚨 CHECKLIST CRÍTICO ANTES DE ENTREGAR

### Seguridad
- [ ] Credenciales cambiadas de las por defecto
- [ ] Contraseña segura configurada
- [ ] HTTPS funcionando
- [ ] Sesiones con timeout configurado

### Funcionalidad
- [ ] Login de administrador funciona
- [ ] Se pueden agregar productos
- [ ] Se pueden editar productos
- [ ] Importación Excel funciona
- [ ] Exportación funciona
- [ ] Gestión de categorías funciona
- [ ] Catálogo público muestra productos

### Despliegue
- [ ] Railway desplegado y funcionando
- [ ] URL accesible públicamente
- [ ] Panel de administración accesible
- [ ] Datos persisten entre sesiones

### Documentación
- [ ] README actualizado
- [ ] Credenciales documentadas
- [ ] Instrucciones de uso claras
- [ ] Plan de migración preparado

---

## 📞 CONTACTOS Y RECURSOS

### Railway
- **URL**: https://railway.app
- **Documentación**: https://docs.railway.app
- **Soporte**: https://railway.app/help

### Credenciales por Defecto (CAMBIAR)
- **Usuario**: admin
- **Contraseña**: catalogo2024

### Archivos Críticos
- `admin/login.php` - Credenciales
- `data/products.json` - Base de datos
- `data/categories.json` - Categorías
- `admin/api.php` - API REST

---

## ⏰ TIMELINE ESTIMADO

- **Testing local**: 30 minutos
- **Configuración Git**: 15 minutos
- **Despliegue Railway**: 20 minutos
- **Configuración producción**: 15 minutos
- **Testing completo**: 30 minutos
- **Documentación**: 20 minutos

**TOTAL**: ~2 horas

---

## 🎯 CRITERIOS DE ÉXITO

✅ **El catálogo está desplegado y accesible públicamente**
✅ **El panel de administración funciona con credenciales seguras**
✅ **Se pueden agregar, editar y eliminar productos**
✅ **La importación/exportación Excel funciona**
✅ **Los datos persisten entre sesiones**
✅ **La documentación está completa**
✅ **El sistema está listo para migración al hosting del cliente**

---

**📝 NOTA**: Marcar cada item como completado para no perder el progreso.

