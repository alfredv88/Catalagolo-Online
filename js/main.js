// Funcionalidad del catálogo de liquidación
document.addEventListener('DOMContentLoaded', function() {
    
    // Variables globales
    let uploadedData = [];
    let currentImages = [];
    
    // Elementos del DOM
    const searchInput = document.getElementById('searchInput');
    const productsGrid = document.getElementById('productsGrid');
    const categoryItems = document.querySelectorAll('.category-item');
    const productCards = document.querySelectorAll('.product-card');
    
    // Datos de productos (simulando base de datos)
    const products = [
        {
            id: 1,
            name: 'Freidora Eléctrica Royal 20 Lts',
            brand: 'ROYAL',
            category: 'electrodomesticos',
            price: 'US$ 218.55',
            rating: 5,
            reviews: 12,
            shipping: 'Envío gratis',
            description: 'Freidora eléctrica de alta capacidad para uso comercial y doméstico'
        },
        {
            id: 2,
            name: 'Licuadora Oster 1500w 1.5L Vidrio 2 Accesorios',
            brand: 'OSTER',
            category: 'electrodomesticos',
            price: 'US$ 48.95',
            rating: 4.5,
            reviews: 171,
            shipping: 'Envío gratis',
            colors: 'Disponible en 3 colores',
            description: 'Licuadora de alta potencia con vaso de vidrio y accesorios incluidos'
        },
        {
            id: 3,
            name: 'Procesador De Alimento Eléctrico Picatodo 1.5 Tazas Original',
            brand: 'ROYAL',
            category: 'electrodomesticos',
            price: 'US$ 23.95',
            rating: 5,
            reviews: 6,
            shipping: 'Envío gratis',
            description: 'Procesador compacto para picar y procesar alimentos'
        },
        {
            id: 4,
            name: 'Humificador Difusor De Aroma 150ml + Esencia Aromática 15ml',
            brand: 'EAGLE STORE',
            category: 'hogar',
            price: 'US$ 7.44',
            originalPrice: 'US$ 8.00',
            discount: '7% OFF',
            rating: 4.5,
            reviews: 63,
            shipping: 'Envío gratis',
            description: 'Humificador con difusor de aromas y esencia incluida'
        },
        {
            id: 5,
            name: 'Mini Aspiradora Sopladora Inalámbrica Recargable 2 En 1 USB',
            brand: 'VACUUM CLEANER',
            category: 'limpieza',
            price: 'US$ 6.99',
            rating: 4.5,
            reviews: 256,
            shipping: 'Envío gratis',
            description: 'Aspiradora inalámbrica con función de soplador, recargable por USB'
        },
        {
            id: 6,
            name: 'Cuchilla Oster + Acople Completo Orig Made In USA',
            brand: 'OSTER',
            category: 'electrodomesticos',
            price: 'US$ 10.00',
            rating: 5,
            reviews: 131,
            shipping: 'Envío gratis',
            description: 'Cuchilla original Oster con acople completo, fabricado en USA'
        }
    ];
    
    // Función para filtrar productos por categoría
    function filterByCategory(category) {
        productCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease-in';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Actualizar contador de productos visibles
        updateProductCount(category);
    }
    
    // Función para actualizar contador de productos
    function updateProductCount(category) {
        const visibleProducts = category === 'all' 
            ? productCards.length 
            : document.querySelectorAll(`[data-category="${category}"]`).length;
        
        // Actualizar el contador en el header si existe
        const countElement = document.querySelector('.products-header p');
        if (countElement) {
            countElement.textContent = `${visibleProducts} productos encontrados`;
        }
    }
    
    // Función para buscar productos
    function searchProducts(query) {
        const searchTerm = query.toLowerCase().trim();
        
        productCards.forEach(card => {
            const productName = card.querySelector('.product-name').textContent.toLowerCase();
            const productBrand = card.querySelector('.product-brand').textContent.toLowerCase();
            
            if (productName.includes(searchTerm) || productBrand.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease-in';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Función para cambiar imagen principal al hacer clic en thumbnail
    function setupImageThumbnails() {
        const thumbnails = document.querySelectorAll('.image-thumbnails img');
        
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                const mainImage = this.closest('.product-card').querySelector('.main-image');
                const tempSrc = mainImage.src;
                mainImage.src = this.src;
                this.src = tempSrc;
                
                // Efecto de transición
                mainImage.style.opacity = '0';
                setTimeout(() => {
                    mainImage.style.opacity = '1';
                }, 150);
            });
        });
    }
    
    // Función para mostrar/ocultar detalles del producto
    function setupProductDetails() {
        productCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // No hacer nada si se hace clic en una imagen thumbnail
                if (e.target.closest('.image-thumbnails')) {
                    return;
                }
                
                // Aquí se podría agregar un modal con más detalles
                console.log('Producto seleccionado:', this.querySelector('.product-name').textContent);
            });
        });
    }
    
    // Función para animar las estrellas de rating
    function animateStars() {
        const stars = document.querySelectorAll('.stars i');
        
        stars.forEach(star => {
            star.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.2)';
                this.style.transition = 'transform 0.2s ease';
            });
            
            star.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
    
    // Función para agregar animación CSS
    function addAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .product-card {
                animation: fadeIn 0.5s ease-out;
            }
            
            .product-card:nth-child(1) { animation-delay: 0.1s; }
            .product-card:nth-child(2) { animation-delay: 0.2s; }
            .product-card:nth-child(3) { animation-delay: 0.3s; }
            .product-card:nth-child(4) { animation-delay: 0.4s; }
            .product-card:nth-child(5) { animation-delay: 0.5s; }
            .product-card:nth-child(6) { animation-delay: 0.6s; }
        `;
        document.head.appendChild(style);
    }
    
    // Event Listeners
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remover clase active de todos los items
            categoryItems.forEach(cat => cat.classList.remove('active'));
            
            // Agregar clase active al item clickeado
            this.classList.add('active');
            
            // Filtrar productos
            const category = this.dataset.category;
            filterByCategory(category);
        });
    });
    
    // Búsqueda en tiempo real
    searchInput.addEventListener('input', function() {
        const query = this.value;
        if (query.length > 0) {
            searchProducts(query);
        } else {
            // Mostrar todos los productos de la categoría activa
            const activeCategory = document.querySelector('.category-item.active').dataset.category;
            filterByCategory(activeCategory);
        }
    });
    
    // Función para manejar el botón de imprimir
    function setupPrintButton() {
        const printBtn = document.querySelector('.print-btn');
        if (printBtn) {
            printBtn.addEventListener('click', function() {
                // Agregar información adicional antes de imprimir
                const printInfo = document.createElement('div');
                printInfo.innerHTML = `
                    <div style="text-align: center; margin-bottom: 20px; padding: 20px; border-bottom: 2px solid #1877f2;">
                        <h1 style="color: #1877f2; margin-bottom: 10px;">Catálogo de Liquidación</h1>
                        <p style="color: #666;">Generado el ${new Date().toLocaleDateString('es-ES')}</p>
                    </div>
                `;
                document.body.insertBefore(printInfo, document.body.firstChild);
                
                // Imprimir
                window.print();
                
                // Remover la información después de imprimir
                setTimeout(() => {
                    if (printInfo.parentNode) {
                        printInfo.parentNode.removeChild(printInfo);
                    }
                }, 1000);
            });
        }
    }
    
    // Función para agregar efectos de hover mejorados
    function setupHoverEffects() {
        productCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });
    }
    
    // Función para inicializar contadores de categorías
    function initializeCategoryCounts() {
        const categories = ['all', 'electrodomesticos', 'hogar', 'limpieza'];
        const counts = [6, 4, 1, 1]; // Contadores reales basados en los productos
        
        categories.forEach((category, index) => {
            const categoryItem = document.querySelector(`[data-category="${category}"]`);
            if (categoryItem) {
                const countElement = categoryItem.querySelector('.count');
                if (countElement) {
                    countElement.textContent = counts[index];
                }
            }
        });
    }
    
    // Inicialización
    function init() {
        setupImageThumbnails();
        setupProductDetails();
        animateStars();
        addAnimations();
        setupPrintButton();
        setupHoverEffects();
        initializeCategoryCounts();
        
        // Mostrar todos los productos por defecto
        filterByCategory('all');
        
        console.log('Catálogo de liquidación inicializado correctamente');
    }
    
    // Ejecutar inicialización
    init();
    
    // Función para exportar datos (útil para futuras integraciones)
    window.exportProductData = function() {
        return products;
    };
    
    // Función para agregar nuevo producto (útil para futuras expansiones)
    window.addProduct = function(productData) {
        products.push(productData);
        console.log('Producto agregado:', productData);
    };
});

// ===== FUNCIONES DEL PANEL DE ADMINISTRACIÓN =====

// Variables para el editor de tabla
let tableData = [];
let currentEditingCell = null;

// Toggle del panel de administración
function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'flex';
        loadProductsManager();
        initializeTableEditor();
    } else {
        panel.style.display = 'none';
    }
}

// Cambiar tabs del panel
function showTab(tabName) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remover active de todos los botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar tab seleccionado
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Activar botón correspondiente
    event.target.classList.add('active');
}

// Manejar subida de archivos Excel/CSV
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    if (file.name.endsWith('.csv')) {
        reader.onload = function(e) {
            parseCSV(e.target.result);
        };
        reader.readAsText(file);
    } else if (file.name.endsWith('.xlsx')) {
        reader.onload = function(e) {
            parseExcel(e.target.result);
        };
        reader.readAsArrayBuffer(file);
    } else {
        alert('Por favor selecciona un archivo Excel (.xlsx) o CSV (.csv)');
    }
}

// Parsear archivo CSV
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Validar headers
    const requiredHeaders = ['Referencia', 'Descripción', 'Cantidad', 'Precio'];
    const hasRequiredHeaders = requiredHeaders.every(header => 
        headers.some(h => h.toLowerCase().includes(header.toLowerCase()))
    );
    
    if (!hasRequiredHeaders) {
        alert('El archivo debe contener las columnas: Referencia, Descripción, Cantidad, Precio');
        return;
    }
    
    uploadedData = [];
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length >= 4) {
                uploadedData.push({
                    referencia: values[0],
                    descripcion: values[1],
                    cantidad: parseInt(values[2]) || 1,
                    precio: parseFloat(values[3]) || 0,
                    imagen1: values[4] || '',
                    imagen2: values[5] || '',
                    imagen3: values[6] || ''
                });
            }
        }
    }
    
    showImportPreview();
}

// Parsear archivo Excel
function parseExcel(arrayBuffer) {
    try {
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
            alert('El archivo Excel debe contener al menos una fila de datos');
            return;
        }
        
        const headers = jsonData[0];
        const requiredHeaders = ['Referencia', 'Descripción', 'Cantidad', 'Precio'];
        const hasRequiredHeaders = requiredHeaders.every(header => 
            headers.some(h => h && h.toLowerCase().includes(header.toLowerCase()))
        );
        
        if (!hasRequiredHeaders) {
            alert('El archivo debe contener las columnas: Referencia, Descripción, Cantidad, Precio');
            return;
        }
        
        uploadedData = [];
        for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (row && row.length >= 4) {
                uploadedData.push({
                    referencia: row[0] || '',
                    descripcion: row[1] || '',
                    cantidad: parseInt(row[2]) || 1,
                    precio: parseFloat(row[3]) || 0,
                    imagen1: row[4] || '',
                    imagen2: row[5] || '',
                    imagen3: row[6] || ''
                });
            }
        }
        
        showImportPreview();
    } catch (error) {
        alert('Error al leer el archivo Excel: ' + error.message);
    }
}

// Mostrar vista previa de datos importados
function showImportPreview() {
    const preview = document.getElementById('importPreview');
    const table = document.getElementById('previewTable');
    
    if (uploadedData.length === 0) {
        alert('No se encontraron datos válidos en el archivo');
        return;
    }
    
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Referencia</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Imagen Portada</th>
                    <th>Imagen 2</th>
                    <th>Imagen 3</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    uploadedData.forEach(item => {
        tableHTML += `
            <tr>
                <td>${item.referencia}</td>
                <td>${item.descripcion}</td>
                <td>${item.cantidad}</td>
                <td>US$ ${item.precio.toFixed(2)}</td>
                <td>${item.imagen1 ? '✅ ' + item.imagen1 : '❌ Sin imagen'}</td>
                <td>${item.imagen2 ? '✅ ' + item.imagen2 : '❌ Sin imagen'}</td>
                <td>${item.imagen3 ? '✅ ' + item.imagen3 : '❌ Sin imagen'}</td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    table.innerHTML = tableHTML;
    preview.style.display = 'block';
}

// Importar productos al catálogo
function importProducts() {
    if (uploadedData.length === 0) {
        alert('No hay datos para importar');
        return;
    }
    
    console.log('Datos a importar:', uploadedData);
    console.log('Productos antes de importar:', products.length);
    
    // Agregar productos importados
    uploadedData.forEach((item, index) => {
        // Procesar imágenes
        const images = [];
        if (item.imagen1) images.push(item.imagen1);
        if (item.imagen2) images.push(item.imagen2);
        if (item.imagen3) images.push(item.imagen3);
        
        const newProduct = {
            id: Date.now() + index,
            name: item.descripcion,
            brand: 'IMPORTADO',
            category: 'otros',
            price: `US$ ${item.precio.toFixed(2)}`,
            quantity: item.cantidad,
            rating: 5,
            reviews: 0,
            shipping: 'Envío gratis',
            description: item.descripcion,
            referencia: item.referencia,
            images: images
        };
        
        products.push(newProduct);
    });
    
    console.log('Productos después de importar:', products.length);
    
    // Actualizar la interfaz
    updateProductsGrid();
    updateCategoryCounts();
    
    // Guardar cantidad antes de limpiar
    const importedCount = uploadedData.length;
    
    // Limpiar datos
    uploadedData = [];
    document.getElementById('importPreview').style.display = 'none';
    document.getElementById('fileInput').value = '';
    
    alert(`Se importaron ${importedCount} productos exitosamente`);
}

// Descargar plantilla Excel
function downloadTemplate() {
    const templateData = [
        ['Referencia', 'Descripción', 'Cantidad', 'Precio', 'Imagen Portada', 'Imagen 2', 'Imagen 3'],
        ['REF001', 'Producto de ejemplo 1', '10', '25.99', 'producto1_portada.jpg', 'producto1_vista2.jpg', 'producto1_vista3.jpg'],
        ['REF002', 'Producto de ejemplo 2', '5', '15.50', 'producto2_portada.jpg', 'producto2_vista2.jpg', ''],
        ['REF003', 'Producto de ejemplo 3', '20', '8.75', 'producto3_portada.jpg', '', '']
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    
    XLSX.writeFile(wb, 'plantilla_productos.xlsx');
}

// Preview de imágenes seleccionadas
function previewImages(event) {
    const files = event.target.files;
    const preview = document.getElementById('imagePreview');
    
    preview.innerHTML = '';
    currentImages = [];
    
    if (files.length > 3) {
        alert('Máximo 3 imágenes por producto');
        event.target.value = '';
        return;
    }
    
    Array.from(files).forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = `Imagen ${index + 1}`;
                preview.appendChild(img);
                currentImages.push(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
}

// Limpiar formulario
function clearForm() {
    document.getElementById('productForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    currentImages = [];
}

// Manejar envío del formulario
document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        referencia: document.getElementById('productRef').value,
        brand: document.getElementById('productBrand').value,
        name: document.getElementById('productName').value,
        quantity: parseInt(document.getElementById('productQuantity').value),
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        images: currentImages
    };
    
    // Validar datos
    if (!formData.referencia || !formData.brand || !formData.name || !formData.price) {
        alert('Por favor completa todos los campos obligatorios');
        return;
    }
    
    if (currentImages.length === 0) {
        alert('Por favor selecciona al menos una imagen');
        return;
    }
    
    // Crear nuevo producto
    const newProduct = {
        id: Date.now(),
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        price: `US$ ${formData.price.toFixed(2)}`,
        quantity: formData.quantity,
        rating: 5,
        reviews: 0,
        shipping: 'Envío gratis',
        description: formData.name,
        referencia: formData.referencia,
        images: currentImages
    };
    
    // Agregar a la lista de productos
    products.push(newProduct);
    
    // Actualizar interfaz
    updateProductsGrid();
    updateCategoryCounts();
    loadProductsManager();
    
    // Limpiar formulario
    clearForm();
    
    alert('Producto agregado exitosamente');
});

// Cargar productos en el manager
function loadProductsManager() {
    const manager = document.getElementById('productsManager');
    
    if (products.length === 0) {
        manager.innerHTML = '<p>No hay productos para gestionar</p>';
        return;
    }
    
    let html = '';
    products.forEach(product => {
        html += `
            <div class="product-manager-item">
                <div class="product-manager-info">
                    <h4>${product.name}</h4>
                    <p>${product.brand} - ${product.price} - Ref: ${product.referencia || 'N/A'}</p>
                </div>
                <div class="product-manager-actions">
                    <button class="edit-btn" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="delete-btn" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
    });
    
    manager.innerHTML = html;
}

// Eliminar producto
function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        const index = products.findIndex(p => p.id === productId);
        if (index > -1) {
            products.splice(index, 1);
            updateProductsGrid();
            updateCategoryCounts();
            loadProductsManager();
            alert('Producto eliminado exitosamente');
        }
    }
}

// Editar producto (función básica)
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // Llenar formulario con datos del producto
        document.getElementById('productRef').value = product.referencia || '';
        document.getElementById('productBrand').value = product.brand;
        document.getElementById('productName').value = product.name;
        document.getElementById('productQuantity').value = product.quantity || 1;
        document.getElementById('productPrice').value = parseFloat(product.price.replace('US$ ', ''));
        document.getElementById('productCategory').value = product.category;
        
        // Cambiar a tab de agregar producto
        showTab('add');
        
        alert('Producto cargado para edición. Modifica los datos y guarda los cambios.');
    }
}

// Actualizar grid de productos
function updateProductsGrid() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        grid.appendChild(productCard);
    });
    
    // Reconfigurar eventos después de actualizar
    setupImageThumbnails();
    setupProductDetails();
}

// Crear tarjeta de producto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);
    
    const mainImage = product.images && product.images.length > 0 
        ? product.images[0] 
        : 'https://via.placeholder.com/400x400/ffffff/333333?text=' + encodeURIComponent(product.name);
    
    const thumbnails = product.images && product.images.length > 1 
        ? product.images.slice(1, 3).map((img, index) => 
            `<img src="${img}" alt="Vista ${index + 2}" onclick="changeMainImage(this, '${mainImage}')">`
          ).join('')
        : '<img src="https://via.placeholder.com/80x80/ffffff/333333?text=1" alt="Vista 1"><img src="https://via.placeholder.com/80x80/ffffff/333333?text=2" alt="Vista 2">';
    
    card.innerHTML = `
        <div class="product-images">
            <img src="${mainImage}" alt="${product.name}" class="main-image">
            <div class="image-thumbnails">
                ${thumbnails}
            </div>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-quantity">
                <i class="fas fa-boxes"></i>
                <span class="quantity-available">Cantidad disponible: ${product.quantity || 1}</span>
            </div>
            <div class="product-price">${product.price}</div>
            ${product.referencia ? `<div class="product-ref">Ref: ${product.referencia}</div>` : ''}
        </div>
    `;
    
    return card;
}

// Cambiar imagen principal
function changeMainImage(thumbnail, currentMain) {
    const mainImage = thumbnail.closest('.product-card').querySelector('.main-image');
    const tempSrc = mainImage.src;
    mainImage.src = thumbnail.src;
    thumbnail.src = tempSrc;
    
    mainImage.style.opacity = '0';
    setTimeout(() => {
        mainImage.style.opacity = '1';
    }, 150);
}

// Actualizar contadores de categorías
function updateCategoryCounts() {
    const categories = ['all', 'electrodomesticos', 'hogar', 'limpieza', 'otros'];
    const counts = [
        products.length,
        products.filter(p => p.category === 'electrodomesticos').length,
        products.filter(p => p.category === 'hogar').length,
        products.filter(p => p.category === 'limpieza').length,
        products.filter(p => p.category === 'otros').length
    ];
    
    categories.forEach((category, index) => {
        const categoryItem = document.querySelector(`[data-category="${category}"]`);
        if (categoryItem) {
            const countElement = categoryItem.querySelector('.count');
            if (countElement) {
                countElement.textContent = counts[index];
            }
        }
    });
}

// ===== FUNCIONES DEL EDITOR DE TABLA =====

// Inicializar editor de tabla
function initializeTableEditor() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    // Agregar una fila inicial si no hay datos
    if (tableData.length === 0) {
        addNewRow();
    } else {
        renderTable();
    }
}

// Agregar nueva fila
function addNewRow() {
    const newRow = {
        id: Date.now(),
        referencia: '',
        descripcion: '',
        cantidad: 1,
        precio: 0,
        imagen1: '',
        imagen2: '',
        imagen3: ''
    };
    
    tableData.push(newRow);
    renderTable();
}

// Renderizar tabla
function renderTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    tableData.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="editable-cell" onclick="editCell(this, ${index}, 'referencia')">
                    <input type="text" value="${row.referencia}" onblur="saveCellValue(${index}, 'referencia', this.value)">
                </div>
            </td>
            <td>
                <div class="editable-cell" onclick="editCell(this, ${index}, 'descripcion')">
                    <textarea onblur="saveCellValue(${index}, 'descripcion', this.value)">${row.descripcion}</textarea>
                </div>
            </td>
            <td>
                <div class="editable-cell" onclick="editCell(this, ${index}, 'cantidad')">
                    <input type="number" value="${row.cantidad}" min="1" onblur="saveCellValue(${index}, 'cantidad', this.value)">
                </div>
            </td>
            <td>
                <div class="editable-cell" onclick="editCell(this, ${index}, 'precio')">
                    <input type="number" value="${row.precio}" step="0.01" min="0" onblur="saveCellValue(${index}, 'precio', this.value)">
                </div>
            </td>
            <td class="image-upload-cell">
                <button class="image-upload-btn ${row.imagen1 ? 'has-image' : ''}" onclick="uploadImage(${index}, 1)">
                    <i class="fas fa-image"></i>
                    ${row.imagen1 ? 'Cambiar' : 'Subir'}
                </button>
                ${row.imagen1 ? `<img src="${row.imagen1}" class="image-preview-small" alt="Imagen 1">` : ''}
                <input type="file" id="image1_${index}" accept="image/*" style="display: none;" onchange="handleImageUpload(${index}, 1, this)">
            </td>
            <td class="image-upload-cell">
                <button class="image-upload-btn ${row.imagen2 ? 'has-image' : ''}" onclick="uploadImage(${index}, 2)">
                    <i class="fas fa-image"></i>
                    ${row.imagen2 ? 'Cambiar' : 'Subir'}
                </button>
                ${row.imagen2 ? `<img src="${row.imagen2}" class="image-preview-small" alt="Imagen 2">` : ''}
                <input type="file" id="image2_${index}" accept="image/*" style="display: none;" onchange="handleImageUpload(${index}, 2, this)">
            </td>
            <td class="image-upload-cell">
                <button class="image-upload-btn ${row.imagen3 ? 'has-image' : ''}" onclick="uploadImage(${index}, 3)">
                    <i class="fas fa-image"></i>
                    ${row.imagen3 ? 'Cambiar' : 'Subir'}
                </button>
                ${row.imagen3 ? `<img src="${row.imagen3}" class="image-preview-small" alt="Imagen 3">` : ''}
                <input type="file" id="image3_${index}" accept="image/*" style="display: none;" onchange="handleImageUpload(${index}, 3, this)">
            </td>
            <td>
                <button class="delete-row-btn" onclick="deleteRow(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Editar celda
function editCell(cell, rowIndex, field) {
    const input = cell.querySelector('input, textarea');
    if (input) {
        input.focus();
        input.select();
    }
}

// Guardar valor de celda
function saveCellValue(rowIndex, field, value) {
    if (rowIndex >= 0 && rowIndex < tableData.length) {
        if (field === 'cantidad' || field === 'precio') {
            tableData[rowIndex][field] = parseFloat(value) || 0;
        } else {
            tableData[rowIndex][field] = value;
        }
    }
}

// Subir imagen
function uploadImage(rowIndex, imageNumber) {
    const input = document.getElementById(`image${imageNumber}_${rowIndex}`);
    if (input) {
        input.click();
    }
}

// Manejar subida de imagen
function handleImageUpload(rowIndex, imageNumber, input) {
    const file = input.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        tableData[rowIndex][`imagen${imageNumber}`] = e.target.result;
        renderTable();
    };
    reader.readAsDataURL(file);
}

// Eliminar fila
function deleteRow(rowIndex) {
    if (confirm('¿Estás seguro de que quieres eliminar esta fila?')) {
        tableData.splice(rowIndex, 1);
        renderTable();
    }
}

// Guardar todos los productos
function saveAllProducts() {
    if (tableData.length === 0) {
        alert('No hay productos para guardar');
        return;
    }
    
    let savedCount = 0;
    
    tableData.forEach((row, index) => {
        // Validar datos obligatorios
        if (!row.referencia || !row.descripcion || !row.precio) {
            alert(`Fila ${index + 1}: Faltan datos obligatorios (Referencia, Descripción, Precio)`);
            return;
        }
        
        // Procesar imágenes
        const images = [];
        if (row.imagen1) images.push(row.imagen1);
        if (row.imagen2) images.push(row.imagen2);
        if (row.imagen3) images.push(row.imagen3);
        
        // Crear producto
        const newProduct = {
            id: Date.now() + index,
            name: row.descripcion,
            brand: 'EDITOR',
            category: 'otros',
            price: `US$ ${row.precio.toFixed(2)}`,
            quantity: row.cantidad,
            rating: 5,
            reviews: 0,
            shipping: 'Envío gratis',
            description: row.descripcion,
            referencia: row.referencia,
            images: images
        };
        
        products.push(newProduct);
        savedCount++;
    });
    
    // Actualizar interfaz
    updateProductsGrid();
    updateCategoryCounts();
    loadProductsManager();
    
    // Limpiar tabla
    tableData = [];
    renderTable();
    
    alert(`Se guardaron ${savedCount} productos exitosamente`);
}
