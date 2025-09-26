<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// Obtener datos del pedido
$input = file_get_contents('php://input');
$orderData = json_decode($input, true);

if (!$orderData) {
    echo json_encode(['success' => false, 'message' => 'Datos de pedido inválidos']);
    exit;
}

// Validar datos requeridos
if (empty($orderData['firstName']) || empty($orderData['lastName']) || empty($orderData['email'])) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios']);
    exit;
}

// Configuración de email
$to = 'alfredv88@gmail.com';
$subject = 'Nuevo Pedido - Catálogo Digital';

// Construir el mensaje del email
$message = "
<html>
<head>
    <title>Nuevo Pedido - Catálogo Digital</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #007bff; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .customer-info { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .items-table th { background: #f8f9fa; font-weight: bold; }
        .total { background: #e9ecef; font-weight: bold; font-size: 18px; }
        .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class='header'>
        <h1>🛒 Nuevo Pedido - Catálogo Digital</h1>
        <p>Fecha: " . date('d/m/Y H:i:s') . "</p>
    </div>
    
    <div class='content'>
        <div class='customer-info'>
            <h3>📋 Información del Cliente</h3>
            <p><strong>Nombre:</strong> " . htmlspecialchars($orderData['firstName']) . " " . htmlspecialchars($orderData['lastName']) . "</p>
            <p><strong>Email:</strong> " . htmlspecialchars($orderData['email']) . "</p>
            <p><strong>Teléfono:</strong> " . htmlspecialchars($orderData['phone'] ?: 'No proporcionado') . "</p>
        </div>
        
        <h3>🛍️ Productos Solicitados</h3>
        <table class='items-table'>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Referencia</th>
                    <th>Precio Unit.</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>";

$total = 0;
foreach ($orderData['items'] as $item) {
    $subtotal = $item['price'] * $item['quantity'];
    $total += $subtotal;
    
    $message .= "
                <tr>
                    <td>" . htmlspecialchars($item['name']) . "</td>
                    <td>" . htmlspecialchars($item['referencia'] ?? 'N/A') . "</td>
                    <td>" . number_format($item['price'], 2) . "€</td>
                    <td>" . $item['quantity'] . "</td>
                    <td>" . number_format($subtotal, 2) . "€</td>
                </tr>";
}

$message .= "
            </tbody>
            <tfoot>
                <tr class='total'>
                    <td colspan='4'><strong>TOTAL</strong></td>
                    <td><strong>" . number_format($total, 2) . "€</strong></td>
                </tr>
            </tfoot>
        </table>";

if (!empty($orderData['message'])) {
    $message .= "
        <div class='customer-info'>
            <h3>💬 Comentarios Adicionales</h3>
            <p>" . htmlspecialchars($orderData['message']) . "</p>
        </div>";
}

$message .= "
    </div>
    
    <div class='footer'>
        <p>Este pedido fue generado automáticamente desde el Catálogo Digital</p>
        <p>Por favor, contacta al cliente para confirmar disponibilidad y coordinar la entrega</p>
    </div>
</body>
</html>";

// Configurar headers del email
$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: Catálogo Digital <noreply@catalagolo-online-production.up.railway.app>',
    'Reply-To: ' . $orderData['email'],
    'X-Mailer: PHP/' . phpversion()
];

// Enviar email
$mailSent = mail($to, $subject, $message, implode("\r\n", $headers));

if ($mailSent) {
    echo json_encode([
        'success' => true, 
        'message' => 'Pedido enviado exitosamente'
    ]);
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'Error al enviar el email. Por favor, inténtalo de nuevo.'
    ]);
}
?>
