<?php
session_start();
require_once '../config/email.php';

// Verificar que el usuario esté logueado
if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in']) {
    header('Location: login.html');
    exit;
}

// Función para enviar código de verificación para cambios
function sendVerificationCode($email, $type) {
    $code = generateVerificationCode();
    $expiry = date('Y-m-d H:i:s', strtotime('+1 hour'));
    
    // Guardar código en archivo temporal
    $verificationFile = 'data/verification_codes.json';
    $codes = [];
    
    if (file_exists($verificationFile)) {
        $codes = json_decode(file_get_contents($verificationFile), true) ?: [];
    }
    
    $codes[$email] = [
        'code' => $code,
        'type' => $type,
        'expiry' => $expiry,
        'used' => false,
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    file_put_contents($verificationFile, json_encode($codes, JSON_PRETTY_PRINT));
    
    // Enviar email
    $subject = 'Código de Verificación - ' . EmailConfig::APP_NAME;
    $action = $type === 'username' ? 'cambio de usuario' : 'cambio de contraseña';
    
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
                <h1>🔐 Código de Verificación</h1>
            </div>
            <div class='content'>
                <h2>Hola,</h2>
                <p>Has solicitado un <strong>" . $action . "</strong> en el panel de administración de <strong>" . EmailConfig::APP_NAME . "</strong>.</p>
                
                <p>Utiliza el siguiente código para confirmar el cambio:</p>
                
                <div class='code'>" . $code . "</div>
                
                <p><strong>Importante:</strong></p>
                <ul>
                    <li>Este código expira en 1 hora</li>
                    <li>Solo puede ser usado una vez</li>
                    <li>Si no solicitaste este cambio, ignora este email</li>
                </ul>
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

// Función para verificar código de verificación
function verifyCode($email, $code, $type) {
    $verificationFile = 'data/verification_codes.json';
    
    if (!file_exists($verificationFile)) {
        return false;
    }
    
    $codes = json_decode(file_get_contents($verificationFile), true) ?: [];
    
    if (!isset($codes[$email])) {
        return false;
    }
    
    $userCode = $codes[$email];
    
    // Verificar si el código expiró
    if (strtotime($userCode['expiry']) < time()) {
        unset($codes[$email]);
        file_put_contents($verificationFile, json_encode($codes, JSON_PRETTY_PRINT));
        return false;
    }
    
    // Verificar si ya fue usado
    if ($userCode['used']) {
        return false;
    }
    
    // Verificar tipo y código
    if ($userCode['type'] !== $type || $userCode['code'] !== $code) {
        return false;
    }
    
    return true;
}

// Función para marcar código como usado
function markVerificationCodeAsUsed($email) {
    $verificationFile = 'data/verification_codes.json';
    $codes = json_decode(file_get_contents($verificationFile), true) ?: [];
    
    if (isset($codes[$email])) {
        $codes[$email]['used'] = true;
        file_put_contents($verificationFile, json_encode($codes, JSON_PRETTY_PRINT));
    }
}

// Función para actualizar datos del admin
function updateAdminData($field, $value) {
    $adminFile = '../data/admin.json';
    
    if (!file_exists($adminFile)) {
        return false;
    }
    
    $adminData = json_decode(file_get_contents($adminFile), true);
    
    if ($field === 'username') {
        $adminData['username'] = $value;
    } elseif ($field === 'password') {
        $adminData['password'] = password_hash($value, PASSWORD_DEFAULT);
        $adminData['password_changed_at'] = date('Y-m-d H:i:s');
    }
    
    return file_put_contents($adminFile, json_encode($adminData, JSON_PRETTY_PRINT));
}

// Procesar solicitudes AJAX
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';
    
    if ($action === 'send_code') {
        $type = $input['type'] ?? '';
        $email = $input['email'] ?? '';
        
        if (!checkAttemptLimit($email)) {
            echo json_encode(['success' => false, 'message' => 'Demasiados intentos. Intenta en una hora.']);
            exit;
        }
        
        if (sendVerificationCode($email, $type)) {
            recordAttempt($email);
            echo json_encode(['success' => true, 'message' => 'Código enviado a tu email']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error enviando código']);
        }
        exit;
    }
    
    if ($action === 'update_username') {
        $email = $input['email'] ?? '';
        $code = $input['code'] ?? '';
        $newUsername = $input['username'] ?? '';
        
        if (empty($newUsername)) {
            echo json_encode(['success' => false, 'message' => 'El usuario no puede estar vacío']);
            exit;
        }
        
        if (!verifyCode($email, $code, 'username')) {
            echo json_encode(['success' => false, 'message' => 'Código inválido o expirado']);
            exit;
        }
        
        if (updateAdminData('username', $newUsername)) {
            markVerificationCodeAsUsed($email);
            echo json_encode(['success' => true, 'message' => 'Usuario actualizado correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error actualizando usuario']);
        }
        exit;
    }
    
    if ($action === 'update_password') {
        $email = $input['email'] ?? '';
        $code = $input['code'] ?? '';
        $newPassword = $input['password'] ?? '';
        $confirmPassword = $input['confirm_password'] ?? '';
        
        if ($newPassword !== $confirmPassword) {
            echo json_encode(['success' => false, 'message' => 'Las contraseñas no coinciden']);
            exit;
        }
        
        if (strlen($newPassword) < 6) {
            echo json_encode(['success' => false, 'message' => 'La contraseña debe tener al menos 6 caracteres']);
            exit;
        }
        
        if (!verifyCode($email, $code, 'password')) {
            echo json_encode(['success' => false, 'message' => 'Código inválido o expirado']);
            exit;
        }
        
        if (updateAdminData('password', $newPassword)) {
            markVerificationCodeAsUsed($email);
            echo json_encode(['success' => true, 'message' => 'Contraseña actualizada correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error actualizando contraseña']);
        }
        exit;
    }
}

// Leer datos del admin
$adminFile = '../data/admin.json';
$adminData = json_decode(file_get_contents($adminFile), true);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Cuenta - Catálogo Digital</title>
    <link rel="stylesheet" href="../styles/main.css">
    <style>
        .account-container {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }
        .account-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
        }
        .account-header h1 {
            color: #ff6b35;
            margin-bottom: 10px;
        }
        .account-section {
            margin-bottom: 40px;
            padding: 20px;
            border: 1px solid #e1e5e9;
            border-radius: 8px;
        }
        .section-title {
            color: #333;
            margin-bottom: 20px;
            font-size: 18px;
            font-weight: 600;
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
            box-sizing: border-box;
        }
        .form-group input:focus {
            outline: none;
            border-color: #ff6b35;
        }
        .form-row {
            display: flex;
            gap: 15px;
        }
        .form-row .form-group {
            flex: 1;
        }
        .btn {
            background: #ff6b35;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .btn:hover {
            background: #e55a2b;
        }
        .btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .btn-secondary {
            background: #6c757d;
        }
        .btn-secondary:hover {
            background: #545b62;
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
        .code-input {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 2px;
        }
        .current-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .current-info strong {
            color: #333;
        }
    </style>
</head>
<body>
    <div class="account-container">
        <div class="account-header">
            <h1>👤 Mi Cuenta</h1>
            <p>Gestiona tu información de administrador</p>
        </div>
        
        <div id="message"></div>
        
        <!-- Información Actual -->
        <div class="account-section">
            <h3 class="section-title">📋 Información Actual</h3>
            <div class="current-info">
                <p><strong>Usuario:</strong> <?php echo htmlspecialchars($adminData['username']); ?></p>
                <p><strong>Email:</strong> <?php echo htmlspecialchars($adminData['email']); ?></p>
                <p><strong>Último cambio de contraseña:</strong> <?php echo htmlspecialchars($adminData['password_changed_at']); ?></p>
            </div>
        </div>
        
        <!-- Cambiar Usuario -->
        <div class="account-section">
            <h3 class="section-title">🔄 Cambiar Usuario</h3>
            <form id="usernameForm">
                <div class="form-group">
                    <label for="newUsername">Nuevo Usuario:</label>
                    <input type="text" id="newUsername" name="username" required>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="usernameCode">Código de Verificación:</label>
                        <input type="text" id="usernameCode" name="code" class="code-input" maxlength="6" required>
                    </div>
                    <div class="form-group">
                        <label>&nbsp;</label>
                        <button type="button" class="btn btn-secondary" id="sendUsernameCode">
                            Enviar Código
                        </button>
                    </div>
                </div>
                
                <button type="submit" class="btn" id="updateUsernameBtn">
                    Actualizar Usuario
                </button>
            </form>
        </div>
        
        <!-- Cambiar Contraseña -->
        <div class="account-section">
            <h3 class="section-title">🔑 Cambiar Contraseña</h3>
            <form id="passwordForm">
                <div class="form-group">
                    <label for="newPassword">Nueva Contraseña:</label>
                    <input type="password" id="newPassword" name="password" required>
                </div>
                
                <div class="form-group">
                    <label for="confirmNewPassword">Confirmar Nueva Contraseña:</label>
                    <input type="password" id="confirmNewPassword" name="confirm_password" required>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="passwordCode">Código de Verificación:</label>
                        <input type="text" id="passwordCode" name="code" class="code-input" maxlength="6" required>
                    </div>
                    <div class="form-group">
                        <label>&nbsp;</label>
                        <button type="button" class="btn btn-secondary" id="sendPasswordCode">
                            Enviar Código
                        </button>
                    </div>
                </div>
                
                <button type="submit" class="btn" id="updatePasswordBtn">
                    Actualizar Contraseña
                </button>
            </form>
        </div>
        
        <div class="back-link">
            <a href="dashboard.php">← Volver al Panel de Administración</a>
        </div>
    </div>

    <script>
        const adminEmail = '<?php echo $adminData['email']; ?>';
        
        // Función para mostrar mensajes
        function showMessage(message, type) {
            const messageDiv = document.getElementById('message');
            messageDiv.innerHTML = `<div class="message ${type}">${message}</div>`;
        }
        
        // Enviar código para cambio de usuario
        document.getElementById('sendUsernameCode').addEventListener('click', async function() {
            const btn = this;
            btn.disabled = true;
            btn.textContent = 'Enviando...';
            
            try {
                const response = await fetch('account.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        action: 'send_code',
                        type: 'username',
                        email: adminEmail
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage(result.message, 'success');
                } else {
                    showMessage(result.message, 'error');
                }
            } catch (error) {
                showMessage('Error de conexión', 'error');
            }
            
            btn.disabled = false;
            btn.textContent = 'Enviar Código';
        });
        
        // Enviar código para cambio de contraseña
        document.getElementById('sendPasswordCode').addEventListener('click', async function() {
            const btn = this;
            btn.disabled = true;
            btn.textContent = 'Enviando...';
            
            try {
                const response = await fetch('account.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        action: 'send_code',
                        type: 'password',
                        email: adminEmail
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage(result.message, 'success');
                } else {
                    showMessage(result.message, 'error');
                }
            } catch (error) {
                showMessage('Error de conexión', 'error');
            }
            
            btn.disabled = false;
            btn.textContent = 'Enviar Código';
        });
        
        // Actualizar usuario
        document.getElementById('usernameForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('newUsername').value;
            const code = document.getElementById('usernameCode').value;
            const btn = document.getElementById('updateUsernameBtn');
            
            btn.disabled = true;
            btn.textContent = 'Actualizando...';
            
            try {
                const response = await fetch('account.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        action: 'update_username',
                        email: adminEmail,
                        code: code,
                        username: username
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage(result.message, 'success');
                    document.getElementById('usernameForm').reset();
                } else {
                    showMessage(result.message, 'error');
                }
            } catch (error) {
                showMessage('Error de conexión', 'error');
            }
            
            btn.disabled = false;
            btn.textContent = 'Actualizar Usuario';
        });
        
        // Actualizar contraseña
        document.getElementById('passwordForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const password = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmNewPassword').value;
            const code = document.getElementById('passwordCode').value;
            const btn = document.getElementById('updatePasswordBtn');
            
            btn.disabled = true;
            btn.textContent = 'Actualizando...';
            
            try {
                const response = await fetch('account.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        action: 'update_password',
                        email: adminEmail,
                        code: code,
                        password: password,
                        confirm_password: confirmPassword
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage(result.message, 'success');
                    document.getElementById('passwordForm').reset();
                } else {
                    showMessage(result.message, 'error');
                }
            } catch (error) {
                showMessage('Error de conexión', 'error');
            }
            
            btn.disabled = false;
            btn.textContent = 'Actualizar Contraseña';
        });
        
        // Auto-formatear códigos
        document.querySelectorAll('.code-input').forEach(input => {
            input.addEventListener('input', function(e) {
                e.target.value = e.target.value.replace(/\D/g, '').substring(0, 6);
            });
        });
    </script>
</body>
</html>
