<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!$data) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'JSON inválido']);
    exit;
}

$firstName = trim($data['firstName'] ?? '');
$lastName = trim($data['lastName'] ?? '');
$email = trim($data['email'] ?? '');
$phone = trim($data['phone'] ?? '');
$message = trim($data['message'] ?? '');
$items = $data['items'] ?? [];
$total = $data['total'] ?? 0;

if ($firstName === '' || $lastName === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Datos del cliente inválidos']);
    exit;
}

if (!is_array($items) || count($items) === 0) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Carrito vacío']);
    exit;
}

// Construir cuerpo del email
$subject = 'Nuevo pedido desde el catálogo';
$lines = [];
$lines[] = 'Cliente: ' . $firstName . ' ' . $lastName;
$lines[] = 'Email: ' . $email;
$lines[] = 'Teléfono: ' . ($phone !== '' ? $phone : 'No proporcionado');
$lines[] = 'Mensaje: ' . ($message !== '' ? $message : 'Sin mensaje');
$lines[] = '';
$lines[] = 'Productos:';
foreach ($items as $it) {
    $nm = $it['name'] ?? 'Producto';
    $ref = $it['referencia'] ?? 'N/A';
    $qty = (int)($it['quantity'] ?? 1);
    $price = (float)($it['price'] ?? 0);
    $lines[] = '- ' . $nm . ' (Ref: ' . $ref . ') x' . $qty . ' = ' . number_format($price * $qty, 2, ',', '.') . '€';
}
$lines[] = '';
$lines[] = 'Total: ' . number_format((float)$total, 2, ',', '.') . '€';
$body = implode("\n", $lines);

// Configuración de envío (usar mail() del hosting o SMTP si está configurado)
$to = 'alfredv88@gmail.com';
$headers = [];
$headers[] = 'From: "Pedido Catálogo" <no-reply@' . ($_SERVER['HTTP_HOST'] ?? 'localhost') . '>';
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

$sent = @mail($to, '=?UTF-8?B?'.base64_encode($subject).'?=', $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(500);
echo json_encode(['ok' => false, 'error' => 'No se pudo enviar el correo']);
exit;
