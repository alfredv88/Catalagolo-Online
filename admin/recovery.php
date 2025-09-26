<?php
session_start();
require_once '../config/email.php';

// Función para generar enlace de recuperación
function generateRecoveryLink($email) {
    $code = generateVerificationCode();
    $expiry = date('Y-m-d H:i:s', strtotime('+' . EmailConfig::CODE_EXPIRY_HOURS . ' hours'));
    
    // Guardar código en archivo temporal
    $recoveryFile = 'data/recovery_codes.json';
    $codes = [];
    
    if (file_exists($recoveryFile)) {
        $codes = json_decode(file_get_contents($recoveryFile), true) ?: [];
    }
    
    $codes[$email] = [
        'code' => $code,
        'expiry' => $expiry,
        'used' => false,
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    file_put_contents($recoveryFile, json_encode($codes, JSON_PRETTY_PRINT));
    
    return $code;
}

// Función para enviar email de recuperación
function sendRecoveryEmail($email, $code) {
    $subject = 'Recuperación de Contraseña - ' . EmailConfig::APP_NAME;
    
    $body = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ff6b35; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .code { background: #333; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>🔐 Recuperación de Contraseña</h1>
            </div>
            <div class='content'>
                <h2>Hola,</h2>
                <p>Has solicitado recuperar tu contraseña para el panel de administración de <strong>" . EmailConfig::APP_NAME . "</strong>.</p>
                
                <p>Utiliza el siguiente código para restablecer tu contraseña:</p>
                
                <div class='code'>" . $code . "</div>
                
                <p><strong>Importante:</strong></p>
                <ul>
                    <li>Este código expira en " . EmailConfig::CODE_EXPIRY_HOURS . " horas</li>
                    <li>Solo puede ser usado una vez</li>
                    <li>Si no solicitaste este cambio, ignora este email</li>
                </ul>
                
                <p>Si tienes problemas, contacta al administrador del sistema.</p>
            </div>
            <div class='footer'>
                <p>Este email fue enviado automáticamente por " . EmailConfig::APP_NAME . "</p>
                <p>Desarrollado por AMS Desarrollos</p>
            </div>
        </div>
    </body>
    </html>";
    
    return sendEmail($email, $subject, $body);
}

// Procesar solicitud de recuperación
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'] ?? '';
    
    // Validar email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Email inválido']);
        exit;
    }
    
    // Verificar límite de intentos
    if (!checkAttemptLimit($email)) {
        echo json_encode(['success' => false, 'message' => 'Demasiados intentos. Intenta en una hora.']);
        exit;
    }
    
    // Leer datos del admin
    $adminFile = '../data/admin.json';
    if (!file_exists($adminFile)) {
        echo json_encode(['success' => false, 'message' => 'Error del sistema']);
        exit;
    }
    
    $adminData = json_decode(file_get_contents($adminFile), true);
    
    // Verificar que el email coincida
    if ($adminData['email'] !== $email) {
        echo json_encode(['success' => false, 'message' => 'Email no registrado']);
        exit;
    }
    
    // Generar código y enviar email
    $code = generateRecoveryLink($email);
    $emailSent = sendRecoveryEmail($email, $code);
    
    if ($emailSent) {
        recordAttempt($email);
        echo json_encode(['success' => true, 'message' => 'Código enviado a tu email']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error enviando email']);
    }
    exit;
}

// Mostrar formulario de recuperación
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperar Contraseña - Catálogo Digital</title>
    <link rel="stylesheet" href="../styles/main.css">
    <style>
        .recovery-container {
            max-width: 400px;
            margin: 100px auto;
            padding: 40px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .recovery-header {
            text-align: center;
            margin-bottom: 30px;
        }
        .recovery-header h1 {
            color: #ff6b35;
            margin-bottom: 10px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #333;
        }
        .form-group input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        .form-group input:focus {
            outline: none;
            border-color: #ff6b35;
        }
        .btn-recovery {
            width: 100%;
            background: #ff6b35;
            color: white;
            border: none;
            padding: 14px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .btn-recovery:hover {
            background: #e55a2b;
        }
        .btn-recovery:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .back-link {
            text-align: center;
            margin-top: 20px;
        }
        .back-link a {
            color: #ff6b35;
            text-decoration: none;
        }
        .back-link a:hover {
            text-decoration: underline;
        }
        .message {
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
        }
        .message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .message.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    </style>
</head>
<body>
    <div class="recovery-container">
        <div class="recovery-header">
            <h1>🔐 Recuperar Contraseña</h1>
            <p>Ingresa tu email para recibir un código de recuperación</p>
        </div>
        
        <div id="message"></div>
        
        <form id="recoveryForm">
            <div class="form-group">
                <label for="email">Email del Administrador:</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <button type="submit" class="btn-recovery" id="submitBtn">
                Enviar Código de Recuperación
            </button>
        </form>
        
        <div class="back-link">
            <a href="login.html">← Volver al Login</a>
        </div>
    </div>

    <script>
        document.getElementById('recoveryForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const submitBtn = document.getElementById('submitBtn');
            const messageDiv = document.getElementById('message');
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            
            try {
                const response = await fetch('recovery.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    messageDiv.innerHTML = `<div class="message success">${result.message}</div>`;
                    messageDiv.innerHTML += '<p>Revisa tu email y usa el código en el <a href="reset-password.php">formulario de restablecimiento</a>.</p>';
                } else {
                    messageDiv.innerHTML = `<div class="message error">${result.message}</div>`;
                }
            } catch (error) {
                messageDiv.innerHTML = '<div class="message error">Error de conexión</div>';
            }
            
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Código de Recuperación';
        });
    </script>
</body>
</html>
