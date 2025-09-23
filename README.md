# 🛍️ Catálogo de Liquidación

## 📋 Descripción del Proyecto

Catálogo web simple y funcional para la gestión de productos en liquidación. Diseñado con inspiración en MercadoLibre y paleta de colores de Facebook, optimizado para impresión en PDF y despliegue en Vercel.

## ✨ Características

### 🎨 **Diseño Visual**
- **Header**: Estilo MercadoLibre con gradiente amarillo/naranja
- **Paleta de colores**: Facebook (azul #1877F2, grises)
- **Layout**: Grid responsive de productos
- **Tipografía**: Roboto (Google Fonts)

### 📱 **Funcionalidades**
- ✅ **6 productos de ejemplo** con datos reales
- ✅ **Categorización** por tipo de producto
- ✅ **Búsqueda en tiempo real** por nombre/marca
- ✅ **Filtros por categoría** con contadores
- ✅ **Imágenes múltiples** por producto (2-3 imágenes)
- ✅ **Sistema de rating** con estrellas
- ✅ **Exportación a PDF** (botón imprimir)
- ✅ **Diseño responsive** (mobile-first)

### 🛠️ **Tecnologías Utilizadas**
- **HTML5**: Estructura semántica
- **CSS3**: Grid, Flexbox, animaciones
- **JavaScript**: Funcionalidad interactiva
- **Font Awesome**: Iconografía
- **Google Fonts**: Tipografía Roboto

## 📁 Estructura del Proyecto

```
catalogo-liquidacion/
├── index.html          # Página principal
├── styles/
│   └── main.css        # Estilos principales
├── js/
│   └── main.js         # Funcionalidad JavaScript
├── images/             # Carpeta para imágenes (futuro)
└── README.md           # Documentación
```

## 🚀 Instalación y Despliegue

### **Despliegue en Vercel (Recomendado)**

1. **Subir archivos a GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Catálogo de liquidación"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/catalogo-liquidacion.git
   git push -u origin main
   ```

2. **Conectar con Vercel**:
   - Ir a [vercel.com](https://vercel.com)
   - Conectar cuenta de GitHub
   - Importar repositorio
   - Desplegar automáticamente

### **Despliegue Local**

1. **Clonar repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/catalogo-liquidacion.git
   cd catalogo-liquidacion
   ```

2. **Servir archivos**:
   ```bash
   # Con Python
   python -m http.server 8000
   
   # Con Node.js
   npx serve .
   
   # Con Live Server (VS Code)
   # Instalar extensión Live Server y hacer clic derecho en index.html
   ```

3. **Abrir en navegador**:
   ```
   http://localhost:8000
   ```

## 📊 Productos Incluidos

| Producto | Categoría | Precio | Rating |
|----------|-----------|--------|--------|
| Freidora Eléctrica Royal 20L | Electrodomésticos | US$ 218.55 | ⭐⭐⭐⭐⭐ |
| Licuadora Oster 1500w | Electrodomésticos | US$ 48.95 | ⭐⭐⭐⭐ |
| Procesador Royal 1.5L | Electrodomésticos | US$ 23.95 | ⭐⭐⭐⭐⭐ |
| Humificador Difusor 150ml | Hogar | US$ 7.44 | ⭐⭐⭐⭐ |
| Mini Aspiradora USB | Limpieza | US$ 6.99 | ⭐⭐⭐⭐ |
| Cuchilla Oster + Acople | Electrodomésticos | US$ 10.00 | ⭐⭐⭐⭐⭐ |

## 🎯 Funcionalidades Implementadas

### **🔍 Búsqueda y Filtros**
- Búsqueda en tiempo real por nombre o marca
- Filtros por categoría con contadores dinámicos
- Animaciones suaves en transiciones

### **🖼️ Gestión de Imágenes**
- Imagen principal de 400x400px
- Thumbnails de 80x80px
- Cambio de imagen al hacer clic en thumbnail
- Efectos de hover y transiciones

### **📄 Exportación PDF**
- Botón "Imprimir PDF" en header
- Estilos optimizados para impresión
- Layout de 2 columnas en PDF
- Información de fecha y título

### **📱 Responsive Design**
- Mobile-first approach
- Breakpoints: 768px, 480px
- Grid adaptativo
- Navegación optimizada para móviles

## 🔧 Personalización

### **Agregar Nuevos Productos**
```javascript
// En js/main.js, agregar al array products
{
    id: 7,
    name: 'Nuevo Producto',
    brand: 'MARCA',
    category: 'categoria',
    price: 'US$ 99.99',
    rating: 4.5,
    reviews: 50,
    shipping: 'Envío gratis',
    description: 'Descripción del producto'
}
```

### **Modificar Categorías**
```javascript
// Actualizar contadores en initializeCategoryCounts()
const counts = [7, 5, 1, 1]; // Nuevo total
```

### **Cambiar Colores**
```css
/* En styles/main.css */
:root {
    --primary-color: #1877f2;    /* Azul Facebook */
    --secondary-color: #fff159;  /* Amarillo MercadoLibre */
    --accent-color: #00a650;     /* Verde envío */
}
```

## 📈 Próximas Mejoras

### **Funcionalidades Futuras**
- [ ] **Importación desde Excel/CSV**
- [ ] **Panel de administración**
- [ ] **Base de datos real**
- [ ] **Sistema de usuarios**
- [ ] **Carrito de compras**
- [ ] **Integración con APIs de pago**

### **Optimizaciones**
- [ ] **Lazy loading** de imágenes
- [ ] **PWA** (Progressive Web App)
- [ ] **SEO** optimizado
- [ ] **Analytics** integrado

## 🐛 Solución de Problemas

### **Imágenes no se muestran**
- Verificar que las URLs de placeholder estén funcionando
- Reemplazar con imágenes reales en carpeta `images/`

### **Estilos no se cargan**
- Verificar rutas en `index.html`
- Asegurar que `styles/main.css` existe

### **JavaScript no funciona**
- Abrir consola del navegador (F12)
- Verificar errores en `js/main.js`

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto:
- **Email**: soporte@catalogo-liquidacion.com
- **GitHub**: [Issues del repositorio](https://github.com/tu-usuario/catalogo-liquidacion/issues)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

**Desarrollado con ❤️ para gestión eficiente de catálogos de liquidación**
