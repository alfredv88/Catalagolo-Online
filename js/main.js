// Variables globales
let products = [];

// Cargar productos desde localStorage al inicializar
function loadProductsFromStorage() {
    const savedProducts = localStorage.getItem('catalogProducts');
    if (savedProducts) {
        try {
            products = JSON.parse(savedProducts);
            console.log('Productos cargados desde localStorage:', products.length);
        } catch (error) {
            console.error('Error al cargar productos desde localStorage:', error);
            products = [];
        }
    } else {
        // Si no hay productos guardados, agregar los 6 productos de ejemplo
        products = [
            {
                id: 1,
                referencia: "REF-001",
                name: "Freidora Eléctrica Royal 20Lts - Ideal para restaurantes y cocinas comerciales",
                category: "electrodomesticos",
                quantity: 3,
                price: 89.99,
                images: []
            },
            {
                id: 2,
                referencia: "REF-002",
                name: "Set de Ollas Premium Antiadherentes 6 Piezas - Acero Inoxidable",
                category: "hogar",
                quantity: 2,
                price: 45.50,
                images: []
            },
            {
                id: 3,
                referencia: "REF-003", 
                name: "Aspiradora Industrial Karcher 2000W - Para uso comercial",
                category: "limpieza",
                quantity: 1,
                price: 125.00,
                images: []
            },
            {
                id: 4,
                referencia: "REF-004",
                name: "Microondas Samsung 30Lts - Panel digital y grill",
                category: "electrodomesticos", 
                quantity: 2,
                price: 75.99,
                images: []
            },
            {
                id: 5,
                referencia: "REF-005",
                name: "Juego de Sábanas Premium 4 Piezas - Algodón 100%",
                category: "hogar",
                quantity: 5,
                price: 25.00,
                images: []
            },
            {
                id: 6,
                referencia: "REF-006",
                name: "Lavadora Automática Whirlpool 12Kg - Carga frontal",
                category: "electrodomesticos",
                quantity: 1,
                price: 299.99,
                images: []
            }
        ];
        // Guardar los productos de ejemplo
        saveProductsToStorage();
        console.log('Productos de ejemplo agregados:', products.length);
    }
}

// Guardar productos en localStorage
function saveProductsToStorage() {
    try {
        localStorage.setItem('catalogProducts', JSON.stringify(products));
        console.log('Productos guardados en localStorage:', products.length);
    } catch (error) {
        console.error('Error al guardar productos en localStorage:', error);
    }
}

// Variables globales adicionales
let uploadedData = [];
let currentImages = [];
let tableData = [];
let currentEditingCell = null;

// Cargar datos de la tabla desde localStorage
function loadTableDataFromStorage() {
    const savedTableData = localStorage.getItem('catalogTableData');
    if (savedTableData) {
        try {
            tableData = JSON.parse(savedTableData);
            console.log('Datos de tabla cargados desde localStorage:', tableData.length);
        } catch (error) {
            console.error('Error al cargar datos de tabla desde localStorage:', error);
            tableData = [];
        }
    }
}

// Guardar datos de la tabla en localStorage
function saveTableDataToStorage() {
    try {
        localStorage.setItem('catalogTableData', JSON.stringify(tableData));
        console.log('Datos de tabla guardados en localStorage:', tableData.length);
    } catch (error) {
        console.error('Error al guardar datos de tabla en localStorage:', error);
    }
}

// Categorías disponibles
let availableCategories = [
    { id: 'electrodomesticos', name: 'Electrodomésticos' },
    { id: 'hogar', name: 'Hogar y Decoración' },
    { id: 'limpieza', name: 'Limpieza' },
    { id: 'otros', name: 'Otros' }
];

// Cargar categorías desde localStorage
function loadCategoriesFromStorage() {
    const savedCategories = localStorage.getItem('catalogCategories');
    if (savedCategories) {
        try {
            availableCategories = JSON.parse(savedCategories);
            console.log('Categorías cargadas desde localStorage:', availableCategories.length);
        } catch (error) {
            console.error('Error al cargar categorías desde localStorage:', error);
        }
    }
}

// Guardar categorías en localStorage
function saveCategoriesToStorage() {
    try {
        localStorage.setItem('catalogCategories', JSON.stringify(availableCategories));
        console.log('Categorías guardadas en localStorage:', availableCategories.length);
    } catch (error) {
        console.error('Error al guardar categorías en localStorage:', error);
    }
}

// Funcionalidad del catálogo de liquidación
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos del DOM
    const searchInput = document.getElementById('searchInput');
    const productsGrid = document.getElementById('productsGrid');
    const categoryItems = document.querySelectorAll('.category-item');
    const productCards = document.querySelectorAll('.product-card');
    
    // Función para filtrar productos por categoría
    function filterByCategory(category) {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;
        
        // Filtrar productos por categoría
        const filteredProducts = category === 'all' 
            ? products 
            : products.filter(p => p.category === category);
        
        // Limpiar grid
        grid.innerHTML = '';
        
        // Renderizar productos filtrados
        filteredProducts.forEach(product => {
            const productCard = createProductCard(product);
            grid.appendChild(productCard);
        });
        
        // Reconfigurar eventos
        setupImageThumbnails();
        setupProductDetails();
        
        // Actualizar contador de productos visibles
        updateProductCount(category, filteredProducts.length);
    }
    
    // Función para actualizar contador de productos
    function updateProductCount(category, count) {
        // Actualizar el contador en el header si existe
        const countElement = document.querySelector('.products-header p');
        if (countElement) {
            countElement.textContent = `${count} productos encontrados`;
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
        const counts = [
            products.length,
            products.filter(p => p.category === 'electrodomesticos').length,
            products.filter(p => p.category === 'hogar').length,
            products.filter(p => p.category === 'limpieza').length
        ];
        
        console.log('Actualizando contadores:', counts);
        
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
        // Cargar datos desde localStorage
        loadProductsFromStorage();
        loadCategoriesFromStorage();
        loadTableDataFromStorage();
        
        setupImageThumbnails();
        setupProductDetails();
        animateStars();
        addAnimations();
        setupPrintButton();
        setupHoverEffects();
        initializeCategoryCounts();
        
        // Actualizar sidebar con categorías dinámicas
        updateSidebarCategories();
        
        // Renderizar todos los productos
        renderAllProducts();
        
        // Mostrar todos los productos por defecto
        filterByCategory('all');
        
        console.log('Catálogo de liquidación inicializado correctamente');
        console.log('Total de productos:', products.length);
        console.log('Categorías disponibles:', availableCategories.length);
    }
    
    // Función para renderizar todos los productos
    function renderAllProducts() {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;
        
        console.log('Renderizando todos los productos:', products.length);
        grid.innerHTML = '';
        
        products.forEach(product => {
            const productCard = createProductCard(product);
            grid.appendChild(productCard);
        });
        
        // Reconfigurar eventos
        setupImageThumbnails();
        setupProductDetails();
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

// Toggle del panel de administración
function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (panel.style.display === 'none' || panel.style.display === '') {
        // Resetear estilos y mostrar panel
        panel.style.display = 'flex';
        panel.style.visibility = 'visible';
        panel.style.opacity = '1';
        
        loadProductsManager();
        // Cargar datos de la tabla desde localStorage
        loadTableDataFromStorage();
        // Inicializar editor de tabla después de un pequeño delay
        setTimeout(() => {
            initializeTableEditor();
        }, 200);
    } else {
        closeAdminPanel();
    }
}

// Función para cerrar el panel de administración
function closeAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (panel) {
        // Forzar el cierre del panel
        panel.style.display = 'none';
        panel.style.visibility = 'hidden';
        panel.style.opacity = '0';
        
        console.log('Panel de administración cerrado');
        
        // Limpiar cualquier estado del panel
        const categoriesManager = document.getElementById('categoriesManager');
        if (categoriesManager) {
            categoriesManager.style.display = 'none';
        }
        
        // No limpiar la tabla automáticamente, mantener los datos
        
    } else {
        console.log('No se encontró el panel de administración');
    }
}

// Cambiar tabs del panel
function showTab(tabName) {
    // Ocultar todos los tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Mostrar tab seleccionado
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Actualizar botones de tab
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Activar botón correspondiente
    const activeButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Inicializar editor de tabla si es necesario
    if (tabName === 'import') {
        setTimeout(() => {
            initializeTableEditor();
        }, 100);
    }
    
    // Inicializar funcionalidad de Excel si es necesario
    if (tabName === 'excel') {
        setTimeout(() => {
            initializeExcelImport();
        }, 100);
    }
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

// Función simplificada para cargar productos en el manager (ya no se usa)
function loadProductsManager() {
    // Función vacía ya que no se usa
}

// ===== FUNCIONES DE GESTIÓN DE CATEGORÍAS =====

// Toggle del panel de categorías
function toggleCategoriesManager() {
    const panel = document.getElementById('categoriesManager');
    if (panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'flex';
        loadCategoriesList();
    } else {
        panel.style.display = 'none';
    }
}

// Cargar lista de categorías
function loadCategoriesList() {
    const container = document.getElementById('categoriesList');
    container.innerHTML = '';
    
    availableCategories.forEach(category => {
        const tag = document.createElement('div');
        tag.className = 'category-tag';
        tag.innerHTML = `
            <span>${category.name}</span>
            <button class="delete-category" onclick="deleteCategory('${category.id}')" title="Eliminar categoría">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(tag);
    });
}

// Agregar nueva categoría
function addNewCategory() {
    const input = document.getElementById('newCategoryName');
    const name = input.value.trim();
    
    if (!name) {
        alert('Por favor ingresa un nombre para la categoría');
        return;
    }
    
    if (name.length < 2) {
        alert('El nombre debe tener al menos 2 caracteres');
        return;
    }
    
    // Verificar si ya existe
    const exists = availableCategories.some(cat => 
        cat.name.toLowerCase() === name.toLowerCase()
    );
    
    if (exists) {
        alert('Esta categoría ya existe');
        return;
    }
    
    // Crear ID único
    const id = name.toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 20);
    
    // Agregar categoría
    availableCategories.push({ id, name });
    
    // Limpiar input
    input.value = '';
    
    // Guardar en localStorage
    saveCategoriesToStorage();
    
    // Recargar lista
    loadCategoriesList();
    
    // Actualizar sidebar
    updateSidebarCategories();
    
    // Mostrar notificación
    showSuccessNotification(`Categoría "${name}" agregada exitosamente`);
}

// Eliminar categoría
function deleteCategory(categoryId) {
    const category = availableCategories.find(cat => cat.id === categoryId);
    if (!category) return;
    
    // Verificar si hay productos usando esta categoría
    const productsUsingCategory = products.filter(p => p.category === categoryId);
    if (productsUsingCategory.length > 0) {
        alert(`No se puede eliminar la categoría "${category.name}" porque hay ${productsUsingCategory.length} productos que la usan.`);
        return;
    }
    
    if (confirm(`¿Estás seguro de que quieres eliminar la categoría "${category.name}"?`)) {
        availableCategories = availableCategories.filter(cat => cat.id !== categoryId);
        
        // Guardar en localStorage
        saveCategoriesToStorage();
        
        loadCategoriesList();
        updateSidebarCategories();
        showSuccessNotification(`Categoría "${category.name}" eliminada`);
    }
}

// Obtener opciones de categorías para el select
function getCategoryOptions(selectedValue = '') {
    return availableCategories.map(cat => 
        `<option value="${cat.id}" ${cat.id === selectedValue ? 'selected' : ''}>${cat.name}</option>`
    ).join('');
}

// Mostrar productos existentes
function showExistingProducts() {
    if (products.length === 0) {
        alert('No hay productos guardados aún.');
        return;
    }
    
    let message = `PRODUCTOS EXISTENTES (${products.length}):\n\n`;
    
    products.forEach((product, index) => {
        message += `${index + 1}. Ref: "${product.referencia}"\n`;
        message += `   Nombre: ${product.name}\n`;
        message += `   Precio: ${product.price}\n`;
        message += `   Categoría: ${getCategoryName(product.category)}\n\n`;
    });
    
    message += 'Para agregar un nuevo producto, usa una referencia diferente.';
    
    alert(message);
}

// Obtener nombre de categoría por ID
function getCategoryName(categoryId) {
    const category = availableCategories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
}

// ===== FUNCIONES DE IMPORTACIÓN DE EXCEL =====

// Variable para almacenar datos de Excel
let excelData = [];

// Inicializar funcionalidad de importación de Excel
function initializeExcelImport() {
    const fileInput = document.getElementById('excelFileInput');
    const uploadZone = document.getElementById('excelUploadZone');
    
    if (fileInput) {
        fileInput.addEventListener('change', handleExcelFile);
    }
    
    if (uploadZone) {
        // Drag and drop functionality
        uploadZone.addEventListener('dragover', handleDragOver);
        uploadZone.addEventListener('dragleave', handleDragLeave);
        uploadZone.addEventListener('drop', handleDrop);
        uploadZone.addEventListener('click', () => fileInput.click());
    }
}

// Manejar arrastrar archivo sobre la zona
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

// Manejar salir de la zona de arrastre
function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
}

// Manejar soltar archivo
function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleExcelFile({ target: { files: files } });
    }
}

// Manejar archivo Excel seleccionado
function handleExcelFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Verificar que sea un archivo Excel
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
        alert('Por favor selecciona un archivo Excel (.xlsx o .xls)');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            // Para archivos Excel, necesitamos usar una librería como SheetJS
            // Por ahora, vamos a simular la lectura con datos de ejemplo
            parseExcelData(e.target.result, file.name);
        } catch (error) {
            console.error('Error al leer el archivo Excel:', error);
            alert('Error al leer el archivo Excel. Asegúrate de que el formato sea correcto.');
        }
    };
    
    reader.readAsArrayBuffer(file);
}

// Parsear datos de Excel (simulado por ahora)
function parseExcelData(data, fileName) {
    // Por ahora, vamos a usar datos de ejemplo
    // En una implementación real, usarías SheetJS para leer Excel
    excelData = [
        {
            referencia: "REF-007",
            descripcion: "Laptop HP Pavilion 15\" - Intel i5, 8GB RAM, 256GB SSD",
            categoria: "electrodomesticos",
            cantidad: 2,
            precio: 599.99
        },
        {
            referencia: "REF-008",
            descripcion: "Mesa de Oficina Ejecutiva - Madera Roble, 120x80cm",
            categoria: "hogar",
            cantidad: 3,
            precio: 89.50
        },
        {
            referencia: "REF-009",
            descripcion: "Detergente Industrial 5L - Para limpieza pesada",
            categoria: "limpieza",
            cantidad: 10,
            precio: 15.99
        }
    ];
    
    showExcelPreview();
}

// Mostrar vista previa de datos de Excel
function showExcelPreview() {
    const preview = document.getElementById('excelPreview');
    const uploadZone = document.getElementById('excelUploadZone');
    
    if (preview && uploadZone) {
        uploadZone.style.display = 'none';
        preview.style.display = 'block';
        
        // Crear tabla de vista previa
        const tableHead = document.getElementById('previewTableHead');
        const tableBody = document.getElementById('previewTableBody');
        
        if (tableHead && tableBody) {
            // Encabezados
            tableHead.innerHTML = `
                <tr>
                    <th>Referencia</th>
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th>Cantidad</th>
                    <th>Precio (US$)</th>
                </tr>
            `;
            
            // Datos
            tableBody.innerHTML = '';
            excelData.forEach((row, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.referencia}</td>
                    <td>${row.descripcion}</td>
                    <td>${getCategoryName(row.categoria)}</td>
                    <td>${row.cantidad}</td>
                    <td>$${row.precio}</td>
                `;
                tableBody.appendChild(tr);
            });
        }
    }
}

// Importar datos de Excel a la tabla
function importExcelData() {
    if (excelData.length === 0) {
        alert('No hay datos para importar');
        return;
    }
    
    // Agregar datos a la tabla
    excelData.forEach(row => {
        const newRow = {
            id: Date.now() + Math.random(),
            referencia: row.referencia,
            descripcion: row.descripcion,
            categoria: row.categoria,
            cantidad: row.cantidad,
            precio: row.precio,
            imagen1: '',
            imagen2: '',
            imagen3: ''
        };
        tableData.push(newRow);
    });
    
    // Guardar y actualizar
    saveTableDataToStorage();
    renderTable();
    
    // Mostrar notificación
    showSuccessNotification(`Se importaron ${excelData.length} productos desde Excel`);
    
    // Limpiar datos de Excel
    excelData = [];
    
    // Volver a la pestaña de tabla
    showTab('import');
    
    // Resetear vista de Excel
    cancelExcelImport();
}

// Cancelar importación de Excel
function cancelExcelImport() {
    const preview = document.getElementById('excelPreview');
    const uploadZone = document.getElementById('excelUploadZone');
    const fileInput = document.getElementById('excelFileInput');
    
    if (preview && uploadZone) {
        preview.style.display = 'none';
        uploadZone.style.display = 'block';
    }
    
    if (fileInput) {
        fileInput.value = '';
    }
    
    excelData = [];
}

// Descargar plantilla de Excel
function downloadExcelTemplate() {
    // Crear datos de ejemplo para la plantilla
    const templateData = [
        ['Referencia', 'Descripción', 'Categoría', 'Cantidad', 'Precio (US$)'],
        ['REF-001', 'Ejemplo de producto', 'electrodomesticos', '1', '99.99'],
        ['REF-002', 'Otro producto de ejemplo', 'hogar', '2', '49.50']
    ];
    
    // Crear CSV (formato más simple que Excel)
    const csvContent = templateData.map(row => row.join(',')).join('\n');
    
    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'plantilla_productos.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccessNotification('Plantilla descargada exitosamente');
}

// La tabla se limpia automáticamente después de guardar exitosamente
// No hay función manual de limpiar tabla - funciona como base de datos

// Limpiar todos los datos
function clearAllData() {
    if (confirm('¿Estás seguro de que quieres limpiar TODOS los datos? Esta acción no se puede deshacer.')) {
        // Limpiar arrays
        products = [];
        tableData = [];
        
        // Limpiar localStorage
        localStorage.removeItem('catalogProducts');
        localStorage.removeItem('catalogCategories');
        localStorage.removeItem('catalogTableData');
        
        // Resetear categorías a las por defecto
        availableCategories = [
            { id: 'electrodomesticos', name: 'Electrodomésticos' },
            { id: 'hogar', name: 'Hogar y Decoración' },
            { id: 'limpieza', name: 'Limpieza' },
            { id: 'otros', name: 'Otros' }
        ];
        
        // Actualizar interfaz
        updateProductsGrid();
        updateCategoryCounts();
        updateSidebarCategories();
        renderTable();
        
        // Cerrar panel
        closeAdminPanel();
        
        showSuccessNotification('Todos los datos han sido limpiados');
    }
}



// Actualizar grid de productos
function updateProductsGrid() {
    const grid = document.getElementById('productsGrid');
    if (!grid) {
        console.log('No se encontró el grid de productos');
        return;
    }
    
    console.log('Actualizando grid con', products.length, 'productos');
    grid.innerHTML = '';
    
    products.forEach((product, index) => {
        console.log(`Creando tarjeta ${index + 1}:`, product);
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
    
    // Debug: verificar imágenes del producto
    console.log(`Creando tarjeta para: ${product.name}`);
    console.log(`Imágenes disponibles:`, product.images);
    console.log(`Cantidad de imágenes:`, product.images ? product.images.length : 0);
    
    // Imagen principal
    let mainImage;
    if (product.images && product.images.length > 0) {
        mainImage = product.images[0];
    } else {
        // Si no hay imágenes, usar placeholder con el nombre del producto
        const productName = product.name || 'Producto';
        mainImage = `https://via.placeholder.com/400x400/ffffff/333333?text=${encodeURIComponent(productName.substring(0, 20))}`;
    }
    
    // Generar miniaturas solo si hay más de 1 imagen
    let thumbnails = '';
    if (product.images && product.images.length > 1) {
        thumbnails = product.images.slice(1, 3).map((img, index) => 
            `<img src="${img}" alt="Vista ${index + 2}" onclick="changeMainImage(this, '${mainImage}')">`
        ).join('');
    } else {
        // Si solo hay 1 imagen o ninguna, no mostrar miniaturas
        thumbnails = '';
    }
    
    card.innerHTML = `
        <div class="product-images">
            <img src="${mainImage}" alt="${product.name}" class="main-image">
            ${thumbnails ? `<div class="image-thumbnails">${thumbnails}</div>` : ''}
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
    // Actualizar contador de "Todos los productos"
    const allItem = document.querySelector('[data-category="all"]');
    if (allItem) {
        const allCount = allItem.querySelector('.count');
        if (allCount) {
            allCount.textContent = products.length;
        }
    }
    
    // Actualizar contadores de categorías específicas
    availableCategories.forEach(category => {
        const categoryItem = document.querySelector(`[data-category="${category.id}"]`);
        if (categoryItem) {
            const countElement = categoryItem.querySelector('.count');
            if (countElement) {
                const count = products.filter(p => p.category === category.id).length;
                countElement.textContent = count;
            }
        }
    });
}

// Actualizar sidebar con categorías dinámicas
function updateSidebarCategories() {
    const sidebar = document.querySelector('.categories-list');
    if (!sidebar) return;
    
    // Limpiar sidebar (excepto "Todos los productos")
    const existingCategories = sidebar.querySelectorAll('.category-item:not([data-category="all"])');
    existingCategories.forEach(item => item.remove());
    
    // Agregar categorías dinámicas
    availableCategories.forEach(category => {
        const count = products.filter(p => p.category === category.id).length;
        
        const categoryItem = document.createElement('li');
        categoryItem.className = 'category-item';
        categoryItem.setAttribute('data-category', category.id);
        categoryItem.innerHTML = `
            <span>${category.name}</span>
            <span class="count">${count}</span>
        `;
        
        // Agregar evento de clic
        categoryItem.addEventListener('click', function() {
            // Remover active de todos
            document.querySelectorAll('.category-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Agregar active al seleccionado
            this.classList.add('active');
            
            // Filtrar productos
            filterByCategory(category.id);
        });
        
        // Insertar después de "Todos los productos"
        const allItem = sidebar.querySelector('[data-category="all"]');
        if (allItem) {
            allItem.parentNode.insertBefore(categoryItem, allItem.nextSibling);
        }
    });
}

// Función para mostrar notificación de éxito
function showSuccessNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Agregar al body
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Ocultar después de 2 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// ===== FUNCIONES DEL EDITOR DE TABLA =====

// Inicializar editor de tabla
function initializeTableEditor() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    // Solo agregar una fila inicial si no hay datos
    if (tableData.length === 0) {
        addNewRow();
    } else {
        // Renderizar los datos existentes
        renderTable();
    }
}

// Generar referencia única
function generateUniqueReference() {
    let reference;
    let counter = 1;
    
    do {
        reference = `REF-${String(counter).padStart(3, '0')}`;
        counter++;
    } while (products.some(p => p.referencia === reference));
    
    return reference;
}

// Agregar nueva fila
function addNewRow() {
    const newRow = {
        id: Date.now(),
        referencia: generateUniqueReference(), // Generar referencia única automáticamente
        descripcion: '',
        categoria: 'otros', // Categoría por defecto
        cantidad: 1,
        precio: 0,
        imagen1: '',
        imagen2: '',
        imagen3: ''
    };
    
    tableData.push(newRow);
    saveTableDataToStorage(); // Guardar automáticamente
    renderTable();
}

// Renderizar tabla
function renderTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) {
        console.log('No se encontró el tbody');
        return;
    }
    
    console.log('Renderizando tabla con', tableData.length, 'filas');
    tbody.innerHTML = '';
    
    if (tableData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px; color: #666;">No hay productos. Haz clic en "Agregar Fila" para comenzar.</td></tr>';
        return;
    }
    
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
                <div class="editable-cell">
                    <select onchange="saveCellValue(${index}, 'categoria', this.value)" class="category-select">
                        ${getCategoryOptions(row.categoria)}
                    </select>
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
    console.log('Guardando celda:', rowIndex, field, value);
    if (rowIndex >= 0 && rowIndex < tableData.length) {
        if (field === 'cantidad' || field === 'precio') {
            tableData[rowIndex][field] = parseFloat(value) || 0;
        } else {
            tableData[rowIndex][field] = value;
        }
        console.log('Datos actualizados:', tableData[rowIndex]);
        
        // Guardar automáticamente en localStorage
        saveTableDataToStorage();
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
        saveTableDataToStorage(); // Guardar automáticamente
        renderTable();
    };
    reader.readAsDataURL(file);
}

// Eliminar fila
function deleteRow(rowIndex) {
    if (confirm('¿Estás seguro de que quieres eliminar esta fila?')) {
        tableData.splice(rowIndex, 1);
        saveTableDataToStorage(); // Guardar automáticamente
        renderTable();
    }
}

// Guardar todos los productos
function saveAllProducts() {
    console.log('Función saveAllProducts ejecutada');
    console.log('Datos de tabla:', tableData);
    
    if (tableData.length === 0) {
        alert('No hay productos para guardar');
        return;
    }
    
    let savedCount = 0;
    let hasErrors = false;
    
    // Validar todos los productos primero
    for (let index = 0; index < tableData.length; index++) {
        const row = tableData[index];
        if (!row.referencia || !row.descripcion || !row.precio) {
            alert(`Fila ${index + 1}: Faltan datos obligatorios (Referencia, Descripción, Precio)`);
            hasErrors = true;
            break;
        }
        
        // Verificar si ya existe un producto con la misma referencia
        const existingProduct = products.find(p => p.referencia === row.referencia);
        if (existingProduct) {
            alert(`Fila ${index + 1}: Ya existe un producto con la referencia "${row.referencia}"\n\nProducto existente: "${existingProduct.name}"\nPrecio: ${existingProduct.price}\n\nPor favor cambia la referencia o edita el producto existente.`);
            hasErrors = true;
            break;
        }
    }
    
    // Si hay errores, no continuar
    if (hasErrors) {
        return;
    }
    
    // Crear una copia de los datos de la tabla para procesar
    const dataToProcess = [...tableData];
    
    console.log('Procesando productos desde la tabla');
    
    // Guardar todos los productos usando la copia
    dataToProcess.forEach((row, index) => {
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
            category: row.categoria || 'otros',
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
        console.log('Producto agregado:', newProduct);
    });
    
    console.log('Productos guardados:', savedCount);
    console.log('Total de productos en array:', products.length);
    
    // Guardar en localStorage
    saveProductsToStorage();
    
    // Actualizar interfaz
    updateProductsGrid();
    updateCategoryCounts();
    updateSidebarCategories();
    
    // LIMPIAR LA TABLA SOLO DESPUÉS DE GUARDAR EXITOSAMENTE
    tableData = [];
    saveTableDataToStorage();
    renderTable();
    
    console.log('Tabla limpiada DESPUÉS de guardar exitosamente');
    
    // Mostrar notificación de éxito
    showSuccessNotification(`Se guardaron ${savedCount} productos exitosamente`);
    
    // Cerrar panel de administración inmediatamente
    closeAdminPanel();
}
