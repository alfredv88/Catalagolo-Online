<?php
/**
 * Editor de productos integrado con el frontend existente
 * Acceso restringido solo para administradores autenticados
 * 
 * @author Desarrollador Senior
 * @since 1.0.0
 */

session_start();

// Verificar autenticación
if (!isset($_SESSION['admin_logged']) || $_SESSION['admin_logged'] !== true) {
    header('Location: login.php');
    exit;
}

// Verificar timeout de sesión (2 horas)
if (isset($_SESSION['login_time']) && (time() - $_SESSION['login_time']) > 7200) {
    session_destroy();
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editor de Productos - Administrador</title>
    <link rel="stylesheet" href="../styles/main.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .admin-header {
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            color: white;
            padding: 15px 20px;
            margin-bottom: 20px;
            border-radius: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .admin-header h1 {
            margin: 0;
            font-size: 1.5em;
        }
        .admin-nav {
            display: flex;
            gap: 10px;
        }
        .admin-nav a {
            color: white;
            text-decoration: none;
            padding: 8px 15px;
            border-radius: 5px;
            background: rgba(255,255,255,0.2);
            transition: background 0.3s;
        }
        .admin-nav a:hover {
            background: rgba(255,255,255,0.3);
        }
        .admin-container {
            position: relative;
            z-index: 1;
        }
        .api-status {
            background: #d4edda;
            color: #155724;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
            text-align: center;
        }
        .api-status.error {
            background: #f8d7da;
            color: #721c24;
        }
    </style>
</head>
<body>
    <div class="admin-header">
        <h1>🔧 Editor de Productos</h1>
        <div class="admin-nav">
            <a href="dashboard.php">Dashboard</a>
            <a href="../index.html">Ver Catálogo</a>
            <a href="logout.php">Cerrar Sesión</a>
        </div>
    </div>

    <div class="api-status" id="apiStatus">
        🔄 Conectando con la API...
    </div>

    <!-- Usar el mismo HTML del panel admin existente -->
    <div class="admin-container" id="adminPanel">
        <div class="admin-header">
            <h2>Editor de Productos</h2>
            <button class="close-admin-btn" onclick="closeAdminPanel()">
                <i class="fas fa-times"></i>
            </button>
        </div>

        <div class="admin-tabs">
            <button class="tab-btn active" onclick="showTab('import')">
                <i class="fas fa-edit"></i> Editor de Tabla
            </button>
            <button class="tab-btn" onclick="showTab('excel')">
                <i class="fas fa-file-excel"></i> Importar Excel
            </button>
            <button class="tab-btn" onclick="showTab('categories')">
                <i class="fas fa-tags"></i> Categorías
            </button>
        </div>

        <!-- Editor de Tabla -->
        <div id="importTab" class="tab-content active">
            <div class="table-controls">
                <button class="add-row-btn" onclick="addNewRow()">
                    <i class="fas fa-plus"></i> Agregar Fila
                </button>
                <button class="save-all-btn" onclick="saveAllProducts()">
                    <i class="fas fa-save"></i> Guardar Todos
                </button>
                <button class="view-products-btn" onclick="showExistingProducts()">
                    <i class="fas fa-eye"></i> Ver Productos
                </button>
                <button class="download-template-btn" onclick="exportTableToExcel()">
                    <i class="fas fa-download"></i> Exportar / Descargar Plantilla
                </button>
                <button class="clear-all-btn" onclick="clearAllData()">
                    <i class="fas fa-trash"></i> Limpiar Todo
                </button>
            </div>

            <div class="table-container">
                <table class="products-table" id="productsTable">
                    <thead>
                        <tr>
                            <th>Referencia</th>
                            <th>Descripción</th>
                            <th>Categoría</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Imágenes (hasta 3)</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody">
                        <!-- Las filas se generan dinámicamente -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Importar Excel -->
        <div id="excelTab" class="tab-content">
            <div class="excel-import-section">
                <div class="upload-zone" id="uploadZone" 
                     ondrop="handleDrop(event)" 
                     ondragover="handleDragOver(event)" 
                     ondragleave="handleDragLeave(event)">
                    <div class="upload-content">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <h3>Arrastra tu archivo Excel aquí</h3>
                        <p>o haz clic para seleccionar</p>
                        <input type="file" id="excelFile" accept=".xlsx,.xls,.csv" style="display: none;" onchange="handleExcelFile(this)">
                    </div>
                </div>

                <div class="excel-preview" id="excelPreview" style="display: none;">
                    <h3>Vista Previa de Datos</h3>
                    <div class="preview-table" id="previewTable"></div>
                    <div class="import-actions">
                        <button class="import-btn" onclick="importExcelData()">
                            <i class="fas fa-upload"></i> Importar Datos
                        </button>
                        <button class="cancel-btn" onclick="cancelExcelImport()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </div>

                <div class="excel-instructions">
                    <h4>Instrucciones:</h4>
                    <ul>
                        <li>El archivo debe tener las columnas: Referencia, Descripción, Categoría, Cantidad, Precio, Loc</li>
                        <li>La primera fila debe contener los encabezados</li>
                        <li>Formatos soportados: .xlsx, .xls, .csv</li>
                        <li>Las imágenes se pueden agregar después en el editor</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Gestión de Categorías -->
        <div id="categoriesTab" class="tab-content">
            <div class="categories-manager">
                <div class="categories-header">
                    <h3>Gestionar Categorías</h3>
                    <div class="category-input-group">
                        <input type="text" id="newCategoryName" placeholder="Nombre de nueva categoría">
                        <button class="add-category-btn" onclick="addNewCategory()">
                            <i class="fas fa-plus"></i> Agregar
                        </button>
                    </div>
                </div>
                <div class="categories-list" id="categoriesList">
                    <!-- Las categorías se cargan dinámicamente -->
                </div>
            </div>
        </div>
    </div>

    <!-- Notificación de éxito -->
    <div class="success-notification" id="successNotification"></div>

    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script>
        // Variables globales
        let products = [];
        let tableData = [];
        let availableCategories = [];
        let uploadedData = [];

        // Verificar conexión con API
        async function checkApiConnection() {
            try {
                const response = await fetch('api.php/products');
                const result = await response.json();
                
                if (result.success) {
                    document.getElementById('apiStatus').innerHTML = '✅ Conectado a la API - Listo para trabajar';
                    document.getElementById('apiStatus').className = 'api-status';
                    products = result.data;
                    loadTableDataFromAPI();
                } else {
                    throw new Error('API no responde correctamente');
                }
            } catch (error) {
                document.getElementById('apiStatus').innerHTML = '❌ Error de conexión con la API: ' + error.message;
                document.getElementById('apiStatus').className = 'api-status error';
            }
        }

        // Cargar datos desde la API
        async function loadTableDataFromAPI() {
            try {
                const response = await fetch('api.php/products');
                const result = await response.json();
                
                if (result.success) {
                    products = result.data;
                    // Convertir productos a formato de tabla
                    tableData = products.map(product => ({
                        referencia: product.referencia || '',
                        descripcion: product.descripcion || '',
                        categoria: product.categoria || 'KTM',
                        cantidad: product.cantidad || 1,
                        precio: product.precio || 0,
                        imagenes: product.imagenes || [],
                        loc: product.loc || ''
                    }));
                    
                    if (tableData.length === 0) {
                        addNewRow();
                    }
                    renderTable();
                }
            } catch (error) {
                console.error('Error cargando datos:', error);
            }
        }

        // Cargar categorías desde la API
        async function loadCategoriesFromAPI() {
            try {
                const response = await fetch('api.php/categories');
                const result = await response.json();
                
                if (result.success) {
                    availableCategories = result.data;
                    loadCategoriesList();
                }
            } catch (error) {
                console.error('Error cargando categorías:', error);
            }
        }

        // Guardar productos usando la API
        async function saveAllProducts() {
            if (tableData.length === 0) {
                alert('No hay productos para guardar');
                return;
            }

            // Validar datos
            const invalidRows = [];
            tableData.forEach((row, index) => {
                if (!row.referencia || !row.descripcion) {
                    invalidRows.push(index + 1);
                }
            });

            if (invalidRows.length > 0) {
                alert(`Faltan datos en las filas: ${invalidRows.join(', ')}`);
                return;
            }

            try {
                const response = await fetch('api.php/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        products: tableData
                    })
                });

                const result = await response.json();

                if (result.success) {
                    showSuccessNotification('Cambios guardados');
                    // Recargar datos desde la API
                    await loadTableDataFromAPI();
                } else {
                    alert('Error al guardar: ' + result.error);
                }
            } catch (error) {
                console.error('Error guardando:', error);
                alert('Error de conexión al guardar');
            }
        }

        // Inicializar cuando se carga la página
        document.addEventListener('DOMContentLoaded', function() {
            checkApiConnection();
            loadCategoriesFromAPI();
            
            // Inicializar el editor de tabla
            if (tableData.length === 0) {
                addNewRow();
            }
            renderTable();
        });

        // Resto de funciones del editor (addNewRow, renderTable, etc.)
        // ... (incluir todas las funciones del main.js relacionadas con el editor)
    </script>
    <script src="../js/main.js"></script>
</body>
</html>

