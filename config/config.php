<?php
/**
 * Configuración centralizada del proyecto
 * Catálogo Digital - Motos Ortiz
 * 
 * @author AMS Desarrollos
 * @since 1.0.0
 */

// Configuración del proyecto
define('PROJECT_NAME', 'Catálogo Motos Ortiz');
define('VERSION', '1.0.0');
define('ADMIN_PATH', 'admin/');
define('DATA_PATH', 'data/');
define('IMAGES_PATH', 'images/');

// Configuración de seguridad
define('SESSION_TIMEOUT', 7200); // 2 horas en segundos
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOGIN_LOCKOUT_TIME', 900); // 15 minutos

// Configuración de archivos
define('PRODUCTS_FILE', DATA_PATH . 'products.json');
define('CATEGORIES_FILE', DATA_PATH . 'categories.json');
define('ADMIN_FILE', DATA_PATH . 'admin.json');

// Configuración de base de datos (para futuras mejoras)
define('DB_HOST', 'localhost');
define('DB_NAME', 'motosortiz_catalog');
define('DB_USER', 'motosortiz_user');
define('DB_PASS', 'motosortiz_pass');

// Configuración de email (para futuras mejoras)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'info@motosortiz.com');
define('SMTP_PASS', '');
define('FROM_EMAIL', 'info@motosortiz.com');
define('FROM_NAME', 'Motos Ortiz');

// Configuración de la aplicación
define('APP_URL', 'https://motosortiz.com');
define('ADMIN_URL', APP_URL . '/' . ADMIN_PATH);
define('API_URL', APP_URL . '/' . ADMIN_PATH . 'api.php');

// Configuración de archivos
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_IMAGE_TYPES', ['jpg', 'jpeg', 'png', 'gif', 'webp']);
define('MAX_IMAGES_PER_PRODUCT', 3);

// Configuración de categorías por defecto
define('DEFAULT_CATEGORIES', [
    ['id' => 'all', 'name' => 'Todas'],
    ['id' => 'ktm', 'name' => 'KTM'],
    ['id' => 'boutique', 'name' => 'Boutique'],
    ['id' => 'frenos', 'name' => 'Frenos'],
    ['id' => 'bujias', 'name' => 'Bujías'],
    ['id' => 'recgeneral', 'name' => 'Rec General']
]);

// Configuración de credenciales (CAMBIAR EN PRODUCCIÓN)
define('ADMIN_USER', 'admin_motos_ortiz_2025');
define('ADMIN_PASS', 'MotosOrtiz2025!Seguro');

// Configuración de errores
define('DEBUG_MODE', false);
define('LOG_ERRORS', true);
define('ERROR_LOG_FILE', 'logs/error.log');

// Configuración de caché
define('CACHE_ENABLED', true);
define('CACHE_TIME', 3600); // 1 hora

// Configuración de backup
define('BACKUP_ENABLED', true);
define('BACKUP_FREQUENCY', 'daily'); // daily, weekly, monthly
define('BACKUP_RETENTION', 30); // días

// Función para obtener configuración
function getConfig($key, $default = null) {
    return defined($key) ? constant($key) : $default;
}

// Función para verificar si estamos en producción
function isProduction() {
    return !DEBUG_MODE && $_SERVER['HTTP_HOST'] === 'motosortiz.com';
}

// Función para obtener la URL base
function getBaseUrl() {
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $path = dirname($_SERVER['SCRIPT_NAME']);
    return $protocol . '://' . $host . $path;
}

// Función para logging
function logError($message, $context = []) {
    if (LOG_ERRORS) {
        $logMessage = date('Y-m-d H:i:s') . ' - ' . $message;
        if (!empty($context)) {
            $logMessage .= ' - Context: ' . json_encode($context);
        }
        $logMessage .= PHP_EOL;
        
        $logFile = ERROR_LOG_FILE;
        $logDir = dirname($logFile);
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }
        
        file_put_contents($logFile, $logMessage, FILE_APPEND | LOCK_EX);
    }
}

// Función para sanitizar datos
function sanitizeInput($data) {
    if (is_array($data)) {
        return array_map('sanitizeInput', $data);
    }
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// Función para validar email
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// Función para generar token seguro
function generateSecureToken($length = 32) {
    return bin2hex(random_bytes($length));
}

// Función para verificar token CSRF
function verifyCSRFToken($token) {
    if (!isset($_SESSION['csrf_token'])) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

// Función para generar token CSRF
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = generateSecureToken();
    }
    return $_SESSION['csrf_token'];
}

// Inicializar configuración
if (!defined('CONFIG_LOADED')) {
    define('CONFIG_LOADED', true);
    
    // Crear directorios necesarios
    $directories = [
        DATA_PATH,
        IMAGES_PATH,
        'logs/',
        'backups/'
    ];
    
    foreach ($directories as $dir) {
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
    }
    
    // Configurar manejo de errores
    if (DEBUG_MODE) {
        error_reporting(E_ALL);
        ini_set('display_errors', 1);
    } else {
        error_reporting(0);
        ini_set('display_errors', 0);
    }
    
    // Configurar zona horaria
    date_default_timezone_set('Europe/Madrid');
}
?>
