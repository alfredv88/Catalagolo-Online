<?php
// Configuración de email para recuperación y cambios de credenciales
class EmailConfig {
    // Configuración SMTP (desde variables de entorno)
    const SMTP_HOST = 'smtp.gmail.com';
    const SMTP_PORT = 587;
    const SMTP_USERNAME = 'tu-email@gmail.com'; // Se sobrescribe con getenv()
    const SMTP_PASSWORD = 'tu-password-app'; // Se sobrescribe con getenv()
    const SMTP_ENCRYPTION = 'tls';
    
    // Configuración del remitente (desde variables de entorno)
    const FROM_EMAIL = 'tu-email@gmail.com'; // Se sobrescribe con getenv()
    const FROM_NAME = 'Catálogo Digital - AMS Desarrollos';
    
    // Configuración de la aplicación (desde variables de entorno)
    const APP_NAME = 'Catálogo Digital';
    const APP_URL = 'http://localhost:8000'; // Se sobrescribe con getenv()
    
    // Métodos para obtener configuración desde variables de entorno
    public static function getSmtpHost() {
        return getenv('SMTP_HOST') ?: self::SMTP_HOST;
    }
    
    public static function getSmtpPort() {
        return getenv('SMTP_PORT') ?: self::SMTP_PORT;
    }
    
    public static function getSmtpUsername() {
        return getenv('SMTP_USERNAME') ?: self::SMTP_USERNAME;
    }
    
    public static function getSmtpPassword() {
        return getenv('SMTP_PASSWORD') ?: self::SMTP_PASSWORD;
    }
    
    public static function getSmtpEncryption() {
        return getenv('SMTP_ENCRYPTION') ?: self::SMTP_ENCRYPTION;
    }
    
    public static function getFromEmail() {
        return getenv('FROM_EMAIL') ?: self::FROM_EMAIL;
    }
    
    public static function getFromName() {
        return getenv('FROM_NAME') ?: self::FROM_NAME;
    }
    
    public static function getAppName() {
        return getenv('APP_NAME') ?: self::APP_NAME;
    }
    
    public static function getAppUrl() {
        return getenv('APP_URL') ?: self::APP_URL;
    }
    
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
        $mail->Host = EmailConfig::getSmtpHost();
        $mail->SMTPAuth = true;
        $mail->Username = EmailConfig::getSmtpUsername();
        $mail->Password = EmailConfig::getSmtpPassword();
        $mail->SMTPSecure = EmailConfig::getSmtpEncryption();
        $mail->Port = EmailConfig::getSmtpPort();
        
        // Remitente y destinatario
        $mail->setFrom(EmailConfig::getFromEmail(), EmailConfig::getFromName());
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
