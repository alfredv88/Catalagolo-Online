# DEPLOYMENT INSTRUCTIONS

## Para recrear el proyecto en Railway:

1. **Eliminar el proyecto actual** en Railway
2. **Crear nuevo proyecto** desde GitHub
3. **Configurar variables de entorno:**
   - NODE_ENV=production
   - PORT=8080
4. **Deploy automático** desde main branch

## Archivos de configuración:
- `railway.toml` - Configuración de Railway
- `Procfile` - Comando de inicio
- `package.json` - Dependencias y scripts
- `server.js` - Servidor Node.js

## Verificación:
- Health check: `/health`
- Debug files: `/debug/files`
- Página principal: `/`
