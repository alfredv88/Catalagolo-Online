<?php
// Configuración de email para recuperación y cambios de credenciales
class EmailConfig {
    // Configuración SMTP
    const SMTP_HOST = 'smtp.gmail.com';
    const SMTP_PORT = 587;
    const SMTP_USERNAME = 'tu-email@gmail.com'; // Cambiar por tu email
    const SMTP_PASSWORD = 'tu-password-app'; // Cambiar por tu contraseña de aplicación
    const SMTP_ENCRYPTION = 'tls';
    
    // Configuración del remitente
    const FROM_EMAIL = 'tu-email@gmail.com';
    const FROM_NAME = 'Catálogo Digital - AMS Desarrollos';
    
    // Configuración de la aplicación
    const APP_NAME = 'Catálogo Digital';
    const APP_URL = 'http://localhost:8000'; // Cambiar por tu URL
    
    // Configuración de códigos
    const CODE_LENGTH = 6;
    const CODE_EXPIRY_HOURS = 24;
    const MAX_ATTEMPTS_PER_HOUR = 3;
}

// Función para enviar email
function sendEmail($to, $subject, $body, $isHTML = true) {
    require_once 'vendor/autoload.php'; // Si usas Composer
    
    try {
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        
        // Configuración SMTP
        $mail->isSMTP();
        $mail->Host = EmailConfig::SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = EmailConfig::SMTP_USERNAME;
        $mail->Password = EmailConfig::SMTP_PASSWORD;
        $mail->SMTPSecure = EmailConfig::SMTP_ENCRYPTION;
        $mail->Port = EmailConfig::SMTP_PORT;
        
        // Remitente y destinatario
        $mail->setFrom(EmailConfig::FROM_EMAIL, EmailConfig::FROM_NAME);
        $mail->addAddress($to);
        
        // Contenido
        $mail->isHTML($isHTML);
        $mail->Subject = $subject;
        $mail->Body = $body;
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Error enviando email: " . $e->getMessage());
        return false;
    }
}

// Función para generar código de verificación
function generateVerificationCode() {
    return str_pad(rand(0, 999999), EmailConfig::CODE_LENGTH, '0', STR_PAD_LEFT);
}

// Función para verificar límite de intentos
function checkAttemptLimit($email) {
    $attemptsFile = 'data/attempts.json';
    $attempts = [];
    
    if (file_exists($attemptsFile)) {
        $attempts = json_decode(file_get_contents($attemptsFile), true) ?: [];
    }
    
    $currentHour = date('Y-m-d H:00:00');
    $userAttempts = $attempts[$email][$currentHour] ?? 0;
    
    return $userAttempts < EmailConfig::MAX_ATTEMPTS_PER_HOUR;
}

// Función para registrar intento
function recordAttempt($email) {
    $attemptsFile = 'data/attempts.json';
    $attempts = [];
    
    if (file_exists($attemptsFile)) {
        $attempts = json_decode(file_get_contents($attemptsFile), true) ?: [];
    }
    
    $currentHour = date('Y-m-d H:00:00');
    $attempts[$email][$currentHour] = ($attempts[$email][$currentHour] ?? 0) + 1;
    
    // Limpiar intentos antiguos (más de 24 horas)
    foreach ($attempts as $userEmail => $hours) {
        foreach ($hours as $hour => $count) {
            if (strtotime($hour) < strtotime('-24 hours')) {
                unset($attempts[$userEmail][$hour]);
            }
        }
        if (empty($attempts[$userEmail])) {
            unset($attempts[$userEmail]);
        }
    }
    
    file_put_contents($attemptsFile, json_encode($attempts, JSON_PRETTY_PRINT));
}
?>
