<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
    exit;
}

if (!isset($_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Archivo no recibido']);
    exit;
}

$file = $_FILES['file'];
$maxSize = 4 * 1024 * 1024; // 4MB
$allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
$allowedExt = ['jpg', 'jpeg', 'png', 'webp'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Error de subida: ' . $file['error']]);
    exit;
}

if ($file['size'] > $maxSize) {
    http_response_code(413);
    echo json_encode(['ok' => false, 'error' => 'Archivo demasiado grande']);
    exit;
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
$mime = $mime ?: $file['type'];
if (!in_array($mime, $allowedMime, true)) {
    http_response_code(415);
    echo json_encode(['ok' => false, 'error' => 'Tipo de archivo no permitido']);
    exit;
}

$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($ext, $allowedExt, true)) {
    $map = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
    ];
    $ext = $map[$mime] ?? 'jpg';
}

$baseDir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'images';
$subDir = date('Y') . DIRECTORY_SEPARATOR . date('m');
$targetDir = $baseDir . DIRECTORY_SEPARATOR . $subDir;
if (!is_dir($targetDir)) {
    if (!mkdir($targetDir, 0755, true) && !is_dir($targetDir)) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'No se pudo crear el directorio']);
        exit;
    }
}

$hash = bin2hex(random_bytes(16));
$filename = $hash . '.' . $ext;
$targetPath = $targetDir . DIRECTORY_SEPARATOR . $filename;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'No se pudo guardar el archivo']);
    exit;
}

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$publicPath = 'images/' . str_replace(DIRECTORY_SEPARATOR, '/', $subDir) . '/' . $filename;
$url = $protocol . $host . '/' . $publicPath;

echo json_encode(['ok' => true, 'url' => $url, 'path' => $publicPath]);
exit;
