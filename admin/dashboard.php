<?php
/**
 * Panel de administración del catálogo
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

// Cargar productos existentes
$productsFile = '../data/products.json';
$products = [];
if (file_exists($productsFile)) {
    $products = json_decode(file_get_contents($productsFile), true) ?: [];
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel Administrador - Catálogo</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .header {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header h1 {
            color: #ff6b35;
            margin: 0;
        }
        .logout-btn {
            background: #dc3545;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #ff6b35;
        }
        .stat-label {
            color: #666;
            margin-top: 5px;
        }
        .actions {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .actions h2 {
            color: #333;
            margin-top: 0;
        }
        .action-buttons {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        .action-btn {
            display: block;
            padding: 15px 20px;
            background: #ff6b35;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            transition: background 0.3s;
        }
        .action-btn:hover {
            background: #e55a2b;
        }
        .action-btn.secondary {
            background: #6c757d;
        }
        .action-btn.secondary:hover {
            background: #5a6268;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔧 Panel de Administración</h1>
        <a href="logout.php" class="logout-btn">Cerrar Sesión</a>
    </div>

    <div class="stats">
        <div class="stat-card">
            <div class="stat-number"><?= count($products) ?></div>
            <div class="stat-label">Productos Totales</div>
        </div>
        <div class="stat-card">
            <div class="stat-number"><?= count(array_unique(array_column($products, 'categoria'))) ?></div>
            <div class="stat-label">Categorías</div>
        </div>
        <div class="stat-card">
            <div class="stat-number"><?= array_sum(array_column($products, 'cantidad')) ?></div>
            <div class="stat-label">Stock Total</div>
        </div>
    </div>

    <div class="actions">
        <h2>Gestión de Productos</h2>
        <div class="action-buttons">
            <a href="../index.html" class="action-btn">
                📱 Ver Catálogo Público
            </a>
            <a href="editor.php" class="action-btn">
                ✏️ Editor de Productos
            </a>
            <a href="import.php" class="action-btn">
                📊 Importar Excel
            </a>
            <a href="export.php" class="action-btn secondary">
                💾 Exportar Datos
            </a>
        </div>
    </div>

    <div class="actions" style="margin-top: 20px;">
        <h2>Productos Recientes</h2>
        <?php if (empty($products)): ?>
            <p>No hay productos registrados. <a href="editor.php">Agregar primer producto</a></p>
        <?php else: ?>
            <div style="max-height: 300px; overflow-y: auto;">
                <?php foreach (array_slice($products, -5) as $product): ?>
                    <div style="background: #f8f9fa; padding: 10px; margin: 5px 0; border-radius: 5px; border-left: 4px solid #ff6b35;">
                        <strong><?= htmlspecialchars($product['referencia']) ?></strong> - 
                        <?= htmlspecialchars($product['descripcion']) ?> 
                        <span style="color: #666;">(<?= htmlspecialchars($product['categoria']) ?>)</span>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>

