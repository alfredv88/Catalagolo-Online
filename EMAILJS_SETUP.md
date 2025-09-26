# 📧 CONFIGURACIÓN DE EMAILJS PARA ENVÍO DE PEDIDOS

## 🔧 PASOS PARA CONFIGURAR EMAILJS:

### **1. Crear cuenta en EmailJS:**
- Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
- Regístrate con tu cuenta de Gmail
- Verifica tu email

### **2. Configurar servicio de email:**
- En el dashboard, ve a "Email Services"
- Haz clic en "Add New Service"
- Selecciona "Gmail"
- Conecta tu cuenta de Gmail (alfredv88@gmail.com)
- Copia el **Service ID** (ej: `service_xxxxxxx`)

### **3. Crear template de email:**
- Ve a "Email Templates"
- Haz clic en "Create New Template"
- Usa este template:

```
Subject: 🛒 Nuevo Pedido - Catálogo Digital

Hola,

Has recibido un nuevo pedido desde el Catálogo Digital:

📋 INFORMACIÓN DEL CLIENTE:
- Nombre: {{from_name}}
- Email: {{from_email}}
- Teléfono: {{phone}}
- Fecha: {{order_date}}

🛍️ PRODUCTOS SOLICITADOS:
{{order_items}}

💰 TOTAL: {{order_total}}

💬 COMENTARIOS ADICIONALES:
{{message}}

---
Este pedido fue generado automáticamente desde el Catálogo Digital.
Por favor, contacta al cliente para confirmar disponibilidad.
```

### **4. Obtener claves necesarias:**
- **Public Key:** En "Account" → "General" → "Public Key"
- **Service ID:** Del paso 2
- **Template ID:** Del paso 3

### **5. Actualizar el código:**
Reemplaza en `js/main.js`:
```javascript
// Línea 2019:
emailjs.init("TU_PUBLIC_KEY_AQUI");

// Línea 2056:
emailjs.send('TU_SERVICE_ID_AQUI', 'TU_TEMPLATE_ID_AQUI', emailData)
```

## ✅ RESULTADO:
Una vez configurado, los pedidos se enviarán automáticamente a `alfredv88@gmail.com` cuando los clientes completen el formulario.

## 🔒 SEGURIDAD:
- EmailJS es gratuito hasta 200 emails/mes
- No requiere configuración de servidor
- Funciona directamente desde el navegador
- Los datos se envían de forma segura
