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
        const seedFlag = localStorage.getItem('catalogSeeded');
        if (seedFlag === 'true') {
            products = [];
            console.log('Catálogo sin productos (seed deshabilitado)');
        } else {
            products = [
                {
                    id: 1,
                    referencia: "REF-001",
                    name: "Freidora Eléctrica Royal 20Lts - Ideal para restaurantes y cocinas comerciales",
                    category: "ktm",
                    quantity: 3,
                    price: 89.99,
                    images: []
                },
                {
                    id: 2,
                    referencia: "REF-002",
                    name: "Set de Ollas Premium Antiadherentes 6 Piezas - Acero Inoxidable",
                    category: "boutique",
                    quantity: 2,
                    price: 45.50,
                    images: []
                },
                {
                    id: 3,
                    referencia: "REF-003",
                    name: "Aspiradora Industrial Karcher 2000W - Para uso comercial",
                    category: "frenos",
                    quantity: 1,
                    price: 125.00,
                    images: []
                },
                {
                    id: 4,
                    referencia: "REF-004",
                    name: "Microondas Samsung 30Lts - Panel digital y grill",
                    category: "bujias",
                    quantity: 2,
                    price: 75.99,
                    images: []
                },
                {
                    id: 5,
                    referencia: "REF-005",
                    name: "Juego de Sábanas Premium 4 Piezas - Algodón 100%",
                    category: "recgeneral",
                    quantity: 5,
                    price: 25.00,
                    images: []
                },
                {
                    id: 6,
                    referencia: "REF-006",
                    name: "Lavadora Automática Whirlpool 12Kg - Carga frontal",
                    category: "ktm",
                    quantity: 1,
                    price: 299.99,
                    images: []
                }
            ];
            saveProductsToStorage();
            localStorage.setItem('catalogSeeded', 'true');
            console.log('Productos de ejemplo agregados:', products.length);
        }
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
    { id: 'all', name: 'Todas' },
    { id: 'ktm', name: 'KTM' },
    { id: 'boutique', name: 'Boutique' },
    { id: 'frenos', name: 'Frenos' },
    { id: 'bujias', name: 'Bujías' },
    { id: 'recgeneral', name: 'Rec General' }
];

// Cargar categorías desde localStorage
function loadCategoriesFromStorage() {
    const savedCategories = localStorage.getItem('catalogCategories');
    if (savedCategories) {
        try {
            availableCategories = JSON.parse(savedCategories);
            // Asegurar que la categoría "Todas" siempre exista
            if (!availableCategories.some(cat => cat.id === 'all')) {
                availableCategories.unshift({ id: 'all', name: 'Todas' });
            } else {
                availableCategories = availableCategories.map(cat =>
                    cat.id === 'all' ? { id: 'all', name: 'Todas' } : cat
                );
            }

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
        
        // Actualizar contador visible
        const categoryItem = document.querySelector(`.category-item[data-category="${category}"]`);
        if (categoryItem) {
            const countElement = categoryItem.querySelector('.count');
            if (countElement) {
                countElement.textContent = filteredProducts.length;
            }
        }

        const totalLabel = document.querySelector('.products-header p');
        if (totalLabel) {
            totalLabel.textContent = `${filteredProducts.length} existentes`;
        }
    }
    
    // Función para actualizar contador de productos
    function updateProductCount(category, count) {
        const categoryItem = document.querySelector(`.category-item[data-category="${category}"]`);
        if (categoryItem) {
            const countElement = categoryItem.querySelector('.count');
            if (countElement) {
                countElement.textContent = count;
            }
        }
    }
    
    // Función para buscar productos
    function searchProducts(query) {
        const searchTerm = query.toLowerCase().trim();
        const cards = document.querySelectorAll('.product-card');

        cards.forEach(card => {
            const productName = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
            const productReference = card.querySelector('.product-ref')?.textContent.toLowerCase() || '';

            if (productName.includes(searchTerm) || productReference.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease-in';
            } else {
                card.style.display = 'none';
            }
        });

        const visibleCards = Array.from(cards).filter(card => card.style.display !== 'none');
        const countLabel = document.querySelector('.products-header p');
        if (countLabel) {
            countLabel.textContent = `${visibleCards.length} existentes`;
        }
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
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value;
            if (query.length > 0) {
                searchProducts(query);
            } else {
                const activeCategory = document.querySelector('.category-item.active')?.dataset.category || 'all';
                filterByCategory(activeCategory);
            }
        });
    }
    
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
        const categoryCounts = availableCategories.reduce((acc, category) => {
            const count = category.id === 'all'
                ? products.length
                : products.filter(p => p.category === category.id).length;
            acc[category.id] = count;
            return acc;
        }, {});

        Object.entries(categoryCounts).forEach(([categoryId, count]) => {
            const categoryItem = document.querySelector(`[data-category="${categoryId}"]`);
            if (categoryItem) {
                const countElement = categoryItem.querySelector('.count');
                if (countElement) {
                    countElement.textContent = count;
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
    
    // Si la tabla está vacía pero hay productos guardados, precargar filas
    if (tableData.length === 0 && products.length > 0) {
        tableData = products.map(product => {
            const images = (product.images || []).slice(0, 3);
            return {
                id: product.id || Date.now(),
                referencia: product.referencia || '',
                descripcion: product.name || '',
                categoria: product.category || 'recgeneral',
                cantidad: product.quantity || 0,
                precio: product.price || 0,
                loc: product.loc || '',
                imagenes: images,
                imagen1: images[0] || '',
                imagen2: images[1] || '',
                imagen3: images[2] || ''
            };
        });
        saveTableDataToStorage();
    }
    
    // ACTUALIZAR CONTADORES INMEDIATAMENTE después de cargar datos
    updateCategoryCounts();
        
    setupPrintButton();
    initializeCategoryCounts();
    
    // Renderizar productos
    updateProductsGrid();
        
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
    
    // Verificar si debe auto-abrir el panel de administración
    checkAutoOpenAdmin();
});

// Función para verificar si debe auto-abrir el panel de administración
async function checkAutoOpenAdmin() {
    // Verificar si hay parámetro admin=true en la URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
        // Limpiar el parámetro de la URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Verificar autenticación y abrir panel
        try {
            const response = await fetch('/admin/status');
            const result = await response.json();
            
            if (result.authenticated) {
                // Auto-abrir el panel de administración
                setTimeout(() => {
                    toggleAdminPanel();
                }, 500); // Pequeño delay para asegurar que todo esté cargado
            } else {
                // Si no está autenticado, redirigir al login
                window.location.href = '/admin';
            }
        } catch (error) {
            console.error('Error verificando autenticación:', error);
            // En caso de error, redirigir al login por seguridad
            window.location.href = '/admin';
        }
    }
}

// ===== FUNCIONES DEL PANEL DE ADMINISTRACIÓN =====

// Toggle del panel de administración
async function toggleAdminPanel() {
    // Verificar autenticación antes de mostrar el panel
    try {
        const response = await fetch('/admin/status');
        const result = await response.json();
        
        if (!result.authenticated) {
            // Si no está autenticado, redirigir al login
            window.location.href = '/admin';
            return;
        }
    } catch (error) {
        console.error('Error verificando autenticación:', error);
        // En caso de error, redirigir al login por seguridad
        window.location.href = '/admin';
        return;
    }
    
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

// Función para cerrar sesión de administración
async function logoutAdmin() {
    try {
        const response = await fetch('/admin/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            // Cerrar el panel de administración
            closeAdminPanel();
            
            // Mostrar notificación de logout
            showSuccessNotification('Sesión cerrada correctamente');
            
            // Redirigir a la página principal después de un momento
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } else {
            showErrorNotification('Error al cerrar sesión');
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        showErrorNotification('Error de conexión al cerrar sesión');
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
    const requiredHeaders = ['Referencia', 'Descripción', 'Cantidad', 'Loc', 'Precio', 'Categoría'];
    const hasRequiredHeaders = requiredHeaders.every(header => 
        headers.some(h => h.toLowerCase().includes(header.toLowerCase()))
    );
    
    if (!hasRequiredHeaders) {
        alert('El archivo debe contener las columnas: Referencia, Descripción, Cantidad, Loc, Precio, Categoría');
        return;
    }
    
    uploadedData = [];
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length >= 6) {
                uploadedData.push({
                    referencia: values[0],
                    descripcion: values[1],
                    cantidad: parseInt(values[2]) || 1,
                    loc: values[3] || '',
                    precio: parseFloat(values[4]) || 0,
                    categoria: normalizeCategory(values[5])
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
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
        
        if (jsonData.length < 2) {
            alert('El archivo Excel debe contener al menos una fila de datos');
            return;
        }
        
        const headers = jsonData[0].map(header => header.toString().trim());
        const requiredHeaders = ['Referencia', 'Descripción', 'Stock', 'Loc', 'PVP', 'CATEGORIA'];
        const hasRequiredHeaders = requiredHeaders.every(header => 
            headers.some(h => h && h.toLowerCase().includes(header.toLowerCase()))
        );
        
        if (!hasRequiredHeaders) {
            alert('El archivo debe contener las columnas: Referencia, Descripción, Stock, Loc, PVP, CATEGORIA');
            return;
        }
        const dataRows = jsonData.slice(1);
        const validationErrors = validateExcelData(dataRows);
        if (validationErrors.length > 0) {
            alert('Se encontraron errores en el archivo:\n\n' + validationErrors.join('\n'));
            return;
        }

        uploadedData = dataRows
            .filter(row => row && row.length >= 6)
            .map(row => ({
                referencia: row[0].toString().trim(),
                descripcion: row[1].toString().trim(),
                stock: parseInt(row[2]) || 1,
                cantidad: parseInt(row[2]) || 1, // Compatibilidad
                loc: row[3].toString().trim(),
                pvp: row[4].toString().trim(),
                precio: parseEuropeanPrice(row[4].toString()), // Convertir a número
                categoria: normalizeCategory(row[5])
            }));

        if (uploadedData.length === 0) {
            alert('No se encontraron registros válidos para importar');
            return;
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
                    <th>Loc</th>
                    <th>Precio (€)</th>
                    <th>Categoría</th>
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
                <td>${item.loc || '-'}</td>
                <td>${formatPrice(item.precio)}</td>
                <td>${getCategoryName(item.categoria)}</td>
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
        const categoryExists = availableCategories.some(cat => cat.id === item.categoria);
        const categoryId = categoryExists ? item.categoria : 'recgeneral';

        const newProduct = {
            id: Date.now() + index,
            referencia: item.referencia,
            name: item.descripcion,
            description: item.descripcion,
            quantity: item.cantidad,
            loc: item.loc || '',
            price: item.precio,
            category: categoryId,
            images: [],
            rating: 0,
            reviews: 0
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
        ['Referencia', 'Descripción', 'Stock', 'Loc', 'PVP', 'CATEGORIA'],
        ['11/0402041580', 'PASADOR NRB4X15,8 G2 KTM LC8', '1', '4H8', '1,30€', 'KTM'],
        ['11/0625060058', 'RODAMIENTO KTM 6005 2RS C3 RUEDA TRASERA', '2', 'MB1', '9,60€', 'KTM'],
        ['11/59009062016', 'TORNILLO KTM M6X16 SW=8 10.9', '3', 'MB4', '1,25€', 'KTM']
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
        closeCategoriesManager();
    }
}

// Función para cerrar el modal de categorías
function closeCategoriesManager() {
    const panel = document.getElementById('categoriesManager');
    if (panel) {
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
        message += `   Precio: ${formatPrice(product.price)}\n`;
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

// Función para parsear precios en formato europeo (1,30 € o 1,30)
function parseEuropeanPrice(priceStr) {
    if (!priceStr || typeof priceStr !== 'string') return 0;
    
    // Remover símbolo € y espacios, reemplazar coma por punto
    const cleanPrice = priceStr.replace(/€/g, '').replace(/\s/g, '').replace(',', '.');
    const price = parseFloat(cleanPrice);
    
    return isNaN(price) ? 0 : price;
}

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
            // Usar SheetJS para leer el archivo Excel real
            const workbook = XLSX.read(e.target.result, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
            
            if (jsonData.length === 0) {
                alert('El archivo Excel está vacío o no contiene datos válidos');
                return;
            }
            
            // Procesar datos reales del Excel
            processRealExcelData(jsonData, file.name);
        } catch (error) {
            console.error('Error al leer el archivo Excel:', error);
            alert('Error al leer el archivo Excel. Asegúrate de que el formato sea correcto.');
        }
    };
    
    reader.readAsArrayBuffer(file);
}

// Procesar datos reales de Excel
function processRealExcelData(jsonData, fileName) {
    console.log('Procesando archivo Excel real:', fileName);
    console.log('Datos del Excel:', jsonData);
    
    if (jsonData.length < 2) {
        alert('El archivo Excel debe contener al menos una fila de encabezados y una fila de datos');
        return;
    }
    
    const headers = jsonData[0].map(header => header.toString().trim());
    const requiredHeaders = ['Referencia', 'Descripción', 'Stock', 'Loc', 'PVP', 'CATEGORIA'];
    
    // Verificar que tenga los encabezados requeridos
    const hasRequiredHeaders = requiredHeaders.every(header => 
        headers.some(h => h && h.toLowerCase().includes(header.toLowerCase()))
    );
    
    if (!hasRequiredHeaders) {
        alert('El archivo debe contener las columnas: Referencia, Descripción, Stock, Loc, PVP, CATEGORIA');
        return;
    }
    
    const dataRows = jsonData.slice(1);
    const validationErrors = validateExcelData(dataRows);
    
    if (validationErrors.length > 0) {
        const errorCount = validationErrors.length;
        const proceed = confirm(`Se encontraron ${errorCount} errores en el archivo.\n\n¿Deseas continuar importando solo las filas válidas?\n\nErrores encontrados:\n${validationErrors.slice(0, 10).join('\n')}${errorCount > 10 ? '\n... y más errores' : ''}`);
        
        if (!proceed) {
            return;
        }
    }
    
    // Procesar filas con datos básicos (solo omitir filas completamente vacías)
    excelData = dataRows
        .filter(row => {
            // Verificar que la fila tenga al menos datos básicos
            if (!row || row.length < 6) return false;
            
            const referencia = row[0] && row[0].toString().trim();
            const descripcion = row[1] && row[1].toString().trim();
            
            // Solo incluir filas que tengan al menos referencia O descripción
            return referencia || descripcion;
        })
        .map(row => ({
            referencia: (row[0] && row[0].toString().trim()) || '',
            descripcion: (row[1] && row[1].toString().trim()) || '',
            stock: parseInt(row[2]) || 0,
            cantidad: parseInt(row[2]) || 0, // Compatibilidad
            loc: (row[3] && row[3].toString().trim()) || '',
            pvp: (row[4] && row[4].toString().trim()) || '0',
            precio: parseEuropeanPrice((row[4] && row[4].toString()) || '0'),
            categoria: normalizeCategory(row[5] || 'recgeneral')
        }));
    
    // Auto-crear categorías nuevas encontradas en el Excel
    autoCreateNewCategories(excelData);
    
    console.log('Datos procesados:', excelData);
    
    // Mostrar resumen de importación
    const totalRows = dataRows.length;
    const validRows = excelData.length;
    const invalidRows = totalRows - validRows;
    
    if (invalidRows > 0) {
        alert(`Importación completada:\n\n✅ ${validRows} filas válidas procesadas\n❌ ${invalidRows} filas omitidas (datos incompletos)\n\nTotal: ${totalRows} filas en el archivo`);
    } else {
        alert(`✅ Todas las ${validRows} filas fueron procesadas correctamente`);
    }
    
    showExcelPreview();
}

// Parsear datos de Excel (simulado por ahora) - MANTENER PARA COMPATIBILIDAD
function parseExcelData(data, fileName) {
    // Por ahora, vamos a usar datos de ejemplo
    // En una implementación real, usarías SheetJS para leer Excel
    excelData = [
        {
            referencia: "REF-007",
            descripcion: "Laptop HP Pavilion 15\" - Intel i5, 8GB RAM, 256GB SSD",
            cantidad: 2,
            loc: "A1",
            precio: 599.99,
            categoria: "ktm"
        },
        {
            referencia: "REF-008",
            descripcion: "Mesa de Oficina Ejecutiva - Madera Roble, 120x80cm",
            cantidad: 3,
            loc: "B2",
            precio: 89.50,
            categoria: "boutique"
        },
        {
            referencia: "REF-009",
            descripcion: "Detergente Industrial 5L - Para limpieza pesada",
            cantidad: 10,
            loc: "C3",
            precio: 15.99,
            categoria: "recgeneral"
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
                    <th>Precio (€)</th>
                </tr>
            `;
            
            // Datos
            tableBody.innerHTML = '';
            excelData.forEach((row, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.referencia}</td>
                    <td>${row.descripcion}</td>
                    <td>${row.stock || row.cantidad}</td>
                    <td>${row.loc}</td>
                    <td>${formatPrice(row.precio)}</td>
                    <td>${getCategoryName(row.categoria)}</td>
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
            cantidad: row.stock || row.cantidad,
            loc: row.loc || '',
            precio: parseEuropeanPrice(row.pvp || row.precio),
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

// Descargar plantilla de Excel o exportar datos actuales
function exportTableToExcel() {
    let dataForExport = [];
    const headers = ['Referencia', 'Descripción', 'Stock', 'Loc', 'PVP', 'CATEGORIA'];
    dataForExport.push(headers);

    if (tableData.length > 0) {
        // Usar los datos de la tabla si existen
        tableData.forEach(row => {
            dataForExport.push([
                row.referencia,
                row.descripcion,
                getCategoryName(row.categoria),
                row.cantidad,
                formatPrice(row.precio),
                row.loc || ''
            ]);
        });
        showSuccessNotification('Exportando datos actuales a Excel...');
    } else {
        // Usar datos de ejemplo si la tabla está vacía
        dataForExport.push(['11/0402041580', 'PASADOR NRB4X15,8 G2 KTM LC8', '1', '4H8', '1,30€', 'KTM']);
        dataForExport.push(['11/0625060058', 'RODAMIENTO KTM 6005 2RS C3', '2', 'MB1', '9,60€', 'KTM']);
        showSuccessNotification('La tabla está vacía. Descargando plantilla de ejemplo.');
    }

    const ws = XLSX.utils.aoa_to_sheet(dataForExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    
    // Generar nombre de archivo dinámico
    const fileName = `catalogo_productos_${new Date().toLocaleDateString('es-ES').replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(wb, fileName);
}

// La tabla se limpia automáticamente después de guardar exitosamente
// No hay función manual de limpiar tabla - funciona como base de datos

// Limpiar todos los datos
function clearAllData() {
    if (confirm('¿Estás seguro de que quieres limpiar TODOS los datos? Esta acción no se puede deshacer.')) {
        products = [];
        tableData = [];

        localStorage.removeItem('catalogProducts');
        localStorage.removeItem('catalogCategories');
        localStorage.removeItem('catalogTableData');
        localStorage.setItem('catalogSeeded', 'true');

        availableCategories = [
            { id: 'all', name: 'Todas' },
            { id: 'ktm', name: 'KTM' },
            { id: 'boutique', name: 'Boutique' },
            { id: 'frenos', name: 'Frenos' },
            { id: 'bujias', name: 'Bujías' },
            { id: 'recgeneral', name: 'Rec General' }
        ];

        updateProductsGrid();
        updateCategoryCounts();
        updateSidebarCategories();
        renderTable();

        closeAdminPanel();

        showSuccessNotification('Todos los datos han sido limpiados');
    }
}



// Actualizar grid de productos
function updateProductsGrid() {
    const grid = document.getElementById('productsGrid');
    const countLabel = document.querySelector('.products-header .products-count');

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
    
    // Actualizar el contador de productos en el encabezado
    if (countLabel) {
        countLabel.textContent = `${products.length} existentes`;
    }

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
    
    // Contador de imágenes
    const imageCount = product.images ? product.images.length : 0;
    const imageCountDisplay = imageCount > 1 ? `<div class="image-count">${imageCount} fotos</div>` : '';

    card.innerHTML = `
        <div class="product-images">
            <img src="${mainImage}" alt="${product.name}" class="main-image">
            ${imageCountDisplay}
            ${thumbnails ? `<div class="image-thumbnails">${thumbnails}</div>` : ''}
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-quantity">
                <i class="fas fa-boxes"></i>
                <span class="quantity-available">Disponibles: ${product.quantity || 1}</span>
            </div>
            <div class="product-price">${formatPrice(product.price)}</div>
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
    console.log('Mostrando notificación:', message);
    
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
    console.log('Notificación agregada al DOM');
    
    // Mostrar con animación inmediatamente
    requestAnimationFrame(() => {
        notification.classList.add('show');
        console.log('Clase show agregada');
    });
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
                console.log('Notificación removida del DOM');
            }
        }, 300);
    }, 3000);
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
                <div class="image-upload-group">
                    <div class="image-preview-list">
                        ${(row.imagenes || []).map((img, imgIndex) => `
                            <div class="image-slot ${imgIndex === 0 ? 'primary' : ''}">
                                <img src="${img}" class="image-preview-small" alt="Imagen ${imgIndex + 1}">
                                <button type="button" class="image-remove-btn" onclick="removeImage(${index}, ${imgIndex})">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <button class="image-upload-btn" onclick="triggerImagesUpload(${index})">
                        <i class="fas fa-plus"></i>
                    </button>
                    <input type="file" id="images_${index}" accept="image/*" multiple style="display: none;" onchange="handleImagesUpload(${index}, this)">
                </div>
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

// Mover después del DOMContentLoaded para que sea global

// Función para normalizar texto (quitar acentos)
function normalizeText(text) {
    if (!text) return '';
    return text.normalize('NFD')
               .replace(/[\u0300-\u036f]/g, '')
               .toLowerCase()
               .trim();
}

// Función para formatear precio en Euros
function formatPrice(price) {
    const numPrice = parseFloat(price) || 0;
    return `${numPrice.toFixed(2)}€`;
}

// Función para auto-crear categorías nuevas durante la importación
function autoCreateNewCategories(excelData) {
    const newCategories = [];
    const existingCategoryIds = availableCategories.map(cat => cat.id);
    
    // Recopilar categorías únicas del Excel
    const uniqueCategories = [...new Set(excelData.map(row => row.categoria))];
    
    uniqueCategories.forEach(categoryId => {
        // Si la categoría no existe, crear una nueva
        if (!existingCategoryIds.includes(categoryId)) {
            const categoryName = getCategoryDisplayName(categoryId);
            const newCategory = {
                id: categoryId,
                name: categoryName,
                count: 0
            };
            
            availableCategories.push(newCategory);
            newCategories.push(categoryName);
        }
    });
    
    // Si se crearon categorías nuevas, guardar y notificar
    if (newCategories.length > 0) {
        saveCategoriesToStorage();
        showSuccessNotification(`✅ Se crearon ${newCategories.length} categorías nuevas: ${newCategories.join(', ')}`);
        
        // Actualizar la UI de categorías si está visible
        if (document.getElementById('categoriesList')) {
            updateCategoryCounts();
            renderCategoriesList();
        }
    }
}

// Función para obtener nombre de display de categoría
function getCategoryDisplayName(categoryId) {
    const displayNames = {
        'all': 'Todas',
        'ktm': 'KTM',
        'boutique': 'Boutique',
        'frenos': 'Frenos',
        'bujias': 'Bujías',
        'recgeneral': 'Rec General'
    };
    
    return displayNames[categoryId] || categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
}

function normalizeCategory(value) {
    if (!value) return 'recgeneral';
    const normalized = normalizeText(value.toString());

    const mapping = {
        'todas': 'all',
        'all': 'all',
        'ktm': 'ktm',
        'boutique': 'boutique',
        'frenos': 'frenos',
        'freno': 'frenos',
        'bujias': 'bujias',
        'bujia': 'bujias',
        'bujía': 'bujias',
        'bujías': 'bujias',
        'rec general': 'recgeneral',
        'recgeneral': 'recgeneral',
        'repuestos generales': 'recgeneral',
        'general': 'recgeneral'
    };

    // Si no está en el mapeo, usar el valor normalizado como ID de categoría
    return mapping[normalized] || normalized;
}

function validateExcelData(rows) {
    const errors = [];

    rows.forEach((row, index) => {
        const rowNumber = index + 2; // header = 1
        const referencia = row[0] && row[0].toString().trim();
        const descripcion = row[1] && row[1].toString().trim();
        const stock = row[2];
        const loc = row[3] && row[3].toString().trim();
        const pvp = row[4];
        const categoria = row[5] && row[5].toString().trim();

        // Solo validar campos críticos, advertir sobre campos opcionales
        if (!referencia && !descripcion) {
            errors.push(`Fila ${rowNumber}: debe tener al menos referencia o descripción`);
        }
        
        // Advertencias para campos opcionales (no bloquean importación)
        if (stock !== undefined && stock !== null && stock !== '' && (isNaN(parseInt(stock)) || parseInt(stock) < 0)) {
            errors.push(`Fila ${rowNumber}: Stock inválido, se usará 0`);
        }
        if (pvp && pvp !== '' && (isNaN(parseEuropeanPrice(pvp.toString())) || parseEuropeanPrice(pvp.toString()) < 0)) {
            errors.push(`Fila ${rowNumber}: PVP inválido, se usará 0`);
        }
        if (categoria && categoria !== '') {
            const mapped = normalizeCategory(categoria);
            const exists = availableCategories.some(cat => cat.id === mapped);
            if (!exists) {
                errors.push(`Fila ${rowNumber}: categoría "${categoria}" no válida, se usará "Rec General"`);
            }
        }
    });

    return errors;
}

function triggerImagesUpload(rowIndex) {
    const input = document.getElementById(`images_${rowIndex}`);
    if (input) {
        input.click();
    }
}

function handleImagesUpload(rowIndex, input) {
    const files = Array.from(input.files || []).slice(0, 3);
    if (files.length === 0) return;

    const readers = files.map(file => {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                reject(new Error('Archivo no válido'));
                return;
            }
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    });

    Promise.all(readers)
        .then(images => {
            const existing = tableData[rowIndex].imagenes || [];
            tableData[rowIndex].imagenes = images;
            tableData[rowIndex].imagen1 = images[0] || existing[0] || '';
            tableData[rowIndex].imagen2 = images[1] || '';
            tableData[rowIndex].imagen3 = images[2] || '';
            saveTableDataToStorage();
            renderTable();
        })
        .catch(() => {
            alert('Hubo un problema al leer las imágenes seleccionadas.');
        })
        .finally(() => {
            input.value = '';
        });
}

function removeImage(rowIndex, imageIndex) {
    const row = tableData[rowIndex];
    if (!row) return;

    const images = row.imagenes || [];
    images.splice(imageIndex, 1);
    row.imagenes = images;
    row.imagen1 = images[0] || '';
    row.imagen2 = images[1] || '';
    row.imagen3 = images[2] || '';

    saveTableDataToStorage();
    renderTable();
}

// ===== FUNCIONES GLOBALES =====

// Guardar todos los productos - FUNCIÓN GLOBAL
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
        if (!row.referencia || !row.descripcion || row.precio === undefined || row.precio === null || isNaN(parseFloat(row.precio))) {
            alert(`Fila ${index + 1}: Faltan datos obligatorios (Referencia, Descripción, Precio válido)`);
            hasErrors = true;
            break;
        }
    }

    if (hasErrors) {
        return;
    }

    const dataToProcess = [...tableData];

    console.log('Procesando productos desde la tabla');

    dataToProcess.forEach((row, index) => {
        const normalizedCategory = row.categoria || 'recgeneral';
        const existingIndex = products.findIndex(p => p.referencia === row.referencia);
        const payload = {
            referencia: row.referencia,
            name: row.descripcion,
            description: row.descripcion,
            quantity: parseInt(row.cantidad, 10) || 0,
            loc: row.loc || '',
            price: parseFloat(row.precio) || 0,
            category: normalizedCategory,
            images: (row.imagenes && row.imagenes.length)
                ? row.imagenes.slice(0, 3)
                : [row.imagen1, row.imagen2, row.imagen3].filter(Boolean)
        };

        if (!row.imagenes || !row.imagenes.length) {
            row.imagenes = payload.images;
        }

        if (existingIndex >= 0) {
            products[existingIndex] = {
                ...products[existingIndex],
                ...payload
            };
        } else {
            products.push({
                id: Date.now() + index,
                rating: 0,
                reviews: 0,
                ...payload
            });
        }

        savedCount++;
    });

    console.log('Productos guardados o actualizados:', savedCount);
    console.log('Total de productos en array:', products.length);

    saveProductsToStorage();
    updateProductsGrid();
    updateCategoryCounts();
    updateSidebarCategories();
    saveTableDataToStorage();
    renderTable();

    // Mostrar notificación INMEDIATAMENTE
    showSuccessNotification('Cambios guardados');
    
    // Cerrar panel después de un breve delay para ver la notificación
    setTimeout(() => {
        closeAdminPanel();
    }, 2000);
}

// ===== FUNCIONES GLOBALES PARA IMÁGENES =====

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
    const cards = document.querySelectorAll('.product-card');
    console.log(`Configurando eventos para ${cards.length} tarjetas`);
    
    cards.forEach((card, index) => {
        card.addEventListener('click', function(e) {
            console.log(`Click en tarjeta ${index + 1}`);
            
            if (e.target.closest('.image-thumbnails')) {
                console.log('Click en thumbnail, ignorando');
                return;
            }
            
            // Obtener datos del producto desde la tarjeta
            const productData = getProductDataFromCard(this);
            console.log('Datos del producto:', productData);
            
            if (productData) {
                console.log('Mostrando modal...');
                showProductModal(productData);
            } else {
                console.log('No se encontraron datos del producto');
            }
        });
    });
}

// Función para extraer datos del producto desde la tarjeta
function getProductDataFromCard(card) {
    const name = card.querySelector('.product-name')?.textContent || '';
    const reference = card.querySelector('.product-ref')?.textContent || '';
    const price = card.querySelector('.product-price')?.textContent || '';
    const category = card.getAttribute('data-category') || '';
    const image = card.querySelector('.main-image')?.src || '';
    
    // Buscar el producto completo en el array de productos
    const product = products.find(p => p.referencia === reference || p.name === name);
    
    if (product) {
        return product;
    }
    
    // Si no se encuentra, crear objeto con datos de la tarjeta
    return {
        name: name,
        referencia: reference,
        price: parseFloat(price.replace(/[^0-9.-]+/g, '')) || 0,
        category: category,
        images: image ? [image] : [],
        description: name, // Usar nombre como descripción por defecto
        quantity: 0,
        loc: ''
    };
}

// Función para mostrar el modal de producto
function showProductModal(product) {
    console.log('showProductModal llamada con:', product);
    const modal = document.getElementById('productModal');
    console.log('Modal encontrado:', modal);
    if (!modal) {
        console.error('Modal productModal no encontrado en el DOM');
        return;
    }
    
    // Llenar datos del modal
    document.getElementById('modalTitle').textContent = product.name || product.description || 'Producto';
    document.getElementById('modalDescription').textContent = product.description || product.name || 'Sin descripción disponible';
    document.getElementById('modalCategory').textContent = getCategoryName(product.category) || 'Sin categoría';
    document.getElementById('modalQuantity').textContent = product.quantity || 0;
    document.getElementById('modalLocation').textContent = product.loc || 'No especificada';
    document.getElementById('modalRef').textContent = product.referencia || 'N/A';
    document.getElementById('modalPrice').textContent = formatPrice(product.price);
    
    // Configurar galería de imágenes
    const modalMainImage = document.getElementById('modalMainImage');
    const modalThumbnails = document.getElementById('modalThumbnails');
    
    if (product.images && product.images.length > 0) {
        // Imagen principal
        modalMainImage.src = product.images[0];
        modalMainImage.alt = product.name || 'Producto';
        
        // Miniaturas
        modalThumbnails.innerHTML = '';
        product.images.forEach((image, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image;
            thumbnail.alt = `${product.name || 'Producto'} - Imagen ${index + 1}`;
            thumbnail.className = index === 0 ? 'active' : '';
            thumbnail.onclick = () => changeModalMainImage(image, thumbnail);
            modalThumbnails.appendChild(thumbnail);
        });
    } else {
        // Imagen placeholder mejorada si no hay imagen
        const placeholderSrc = `https://via.placeholder.com/400x300/f8f9fa/6c757d?text=${encodeURIComponent((product.name || 'Producto').substring(0, 15))}`;
        modalMainImage.src = placeholderSrc;
        modalMainImage.alt = product.name || 'Producto';
        modalThumbnails.innerHTML = '';
    }
    
    // Mostrar modal
    modal.style.display = 'flex';
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
}

// Función para cambiar imagen principal en el modal
function changeModalMainImage(imageSrc, clickedThumbnail) {
    const modalMainImage = document.getElementById('modalMainImage');
    if (modalMainImage) {
        modalMainImage.src = imageSrc;
        
        // Actualizar clase activa en miniaturas
        const thumbnails = document.querySelectorAll('.modal-thumbnails img');
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        clickedThumbnail.classList.add('active');
    }
}

// Función para cerrar el modal de producto
function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.style.display = 'none';
        // Restaurar scroll del body
        document.body.style.overflow = 'auto';
    }
}

