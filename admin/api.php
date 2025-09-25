<?php
/**
 * API REST para gestión de productos
 * Endpoints seguros con autenticación de administrador
 * 
 * @author Desarrollador Senior
 * @since 1.0.0
 */

session_start();
header('Content-Type: application/json');

// Verificar autenticación para operaciones de escritura
function requireAuth() {
    if (!isset($_SESSION['admin_logged']) || $_SESSION['admin_logged'] !== true) {
        http_response_code(401);
        echo json_encode(['error' => 'No autorizado']);
        exit;
    }
}

// Verificar timeout de sesión
if (isset($_SESSION['login_time']) && (time() - $_SESSION['login_time']) > 7200) {
    session_destroy();
    http_response_code(401);
    echo json_encode(['error' => 'Sesión expirada']);
    exit;
}

// Configuración de archivos
$productsFile = '../data/products.json';
$categoriesFile = '../data/categories.json';

// Crear directorio data si no existe
if (!file_exists('../data')) {
    mkdir('../data', 0755, true);
}

// Función para cargar productos
function loadProducts() {
    global $productsFile;
    if (file_exists($productsFile)) {
        $data = file_get_contents($productsFile);
        return json_decode($data, true) ?: [];
    }
    return [];
}

// Función para guardar productos
function saveProducts($products) {
    global $productsFile;
    return file_put_contents($productsFile, json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Función para cargar categorías
function loadCategories() {
    global $categoriesFile;
    if (file_exists($categoriesFile)) {
        $data = file_get_contents($categoriesFile);
        return json_decode($data, true) ?: [];
    }
    // Categorías por defecto
    return [
        ['id' => 'all', 'name' => 'Todas'],
        ['id' => 'ktm', 'name' => 'KTM'],
        ['id' => 'boutique', 'name' => 'Boutique'],
        ['id' => 'frenos', 'name' => 'Frenos'],
        ['id' => 'bujias', 'name' => 'Bujías'],
        ['id' => 'recgeneral', 'name' => 'Rec General']
    ];
}

// Función para guardar categorías
function saveCategories($categories) {
    global $categoriesFile;
    return file_put_contents($categoriesFile, json_encode($categories, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$pathParts = explode('/', trim($path, '/'));

// Routing básico
$endpoint = end($pathParts);

try {
    switch ($method) {
        case 'GET':
            switch ($endpoint) {
                case 'products':
                    // GET /api.php/products - Obtener todos los productos (público)
                    $products = loadProducts();
                    echo json_encode(['success' => true, 'data' => $products]);
                    break;
                    
                case 'categories':
                    // GET /api.php/categories - Obtener categorías (público)
                    $categories = loadCategories();
                    echo json_encode(['success' => true, 'data' => $categories]);
                    break;
                    
                default:
                    http_response_code(404);
                    echo json_encode(['error' => 'Endpoint no encontrado']);
            }
            break;
            
        case 'POST':
            requireAuth(); // Requiere autenticación para escritura
            
            switch ($endpoint) {
                case 'products':
                    // POST /api.php/products - Crear/actualizar productos
                    $input = json_decode(file_get_contents('php://input'), true);
                    
                    if (!$input || !isset($input['products'])) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Datos inválidos']);
                        break;
                    }
                    
                    $newProducts = $input['products'];
                    $existingProducts = loadProducts();
                    
                    // Validar y procesar productos
                    $processedProducts = [];
                    foreach ($newProducts as $product) {
                        // Validaciones básicas
                        if (empty($product['referencia']) || empty($product['descripcion'])) {
                            continue; // Saltar productos inválidos
                        }
                        
                        // Buscar si ya existe
                        $existingIndex = -1;
                        foreach ($existingProducts as $index => $existing) {
                            if ($existing['referencia'] === $product['referencia']) {
                                $existingIndex = $index;
                                break;
                            }
                        }
                        
                        // Preparar producto
                        $processedProduct = [
                            'referencia' => trim($product['referencia']),
                            'descripcion' => trim($product['descripcion']),
                            'categoria' => trim($product['categoria'] ?? 'KTM'),
                            'cantidad' => intval($product['cantidad'] ?? 1),
                            'precio' => floatval($product['precio'] ?? 0),
                            'imagenes' => $product['imagenes'] ?? [],
                            'loc' => trim($product['loc'] ?? ''),
                            'updated_at' => date('Y-m-d H:i:s')
                        ];
                        
                        if ($existingIndex >= 0) {
                            // Actualizar existente
                            $existingProducts[$existingIndex] = $processedProduct;
                        } else {
                            // Agregar nuevo
                            $processedProduct['created_at'] = date('Y-m-d H:i:s');
                            $existingProducts[] = $processedProduct;
                        }
                    }
                    
                    // Guardar productos
                    if (saveProducts($existingProducts)) {
                        echo json_encode([
                            'success' => true, 
                            'message' => 'Productos guardados correctamente',
                            'count' => count($newProducts)
                        ]);
                    } else {
                        http_response_code(500);
                        echo json_encode(['error' => 'Error al guardar productos']);
                    }
                    break;
                    
                case 'categories':
                    // POST /api.php/categories - Actualizar categorías
                    $input = json_decode(file_get_contents('php://input'), true);
                    
                    if (!$input || !isset($input['categories'])) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Datos inválidos']);
                        break;
                    }
                    
                    if (saveCategories($input['categories'])) {
                        echo json_encode(['success' => true, 'message' => 'Categorías actualizadas']);
                    } else {
                        http_response_code(500);
                        echo json_encode(['error' => 'Error al guardar categorías']);
                    }
                    break;
                    
                default:
                    http_response_code(404);
                    echo json_encode(['error' => 'Endpoint no encontrado']);
            }
            break;
            
        case 'DELETE':
            requireAuth(); // Requiere autenticación para eliminación
            
            switch ($endpoint) {
                case 'products':
                    // DELETE /api.php/products - Eliminar todos los productos
                    if (saveProducts([])) {
                        echo json_encode(['success' => true, 'message' => 'Todos los productos eliminados']);
                    } else {
                        http_response_code(500);
                        echo json_encode(['error' => 'Error al eliminar productos']);
                    }
                    break;
                    
                default:
                    http_response_code(404);
                    echo json_encode(['error' => 'Endpoint no encontrado']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor: ' . $e->getMessage()]);
}
?>

