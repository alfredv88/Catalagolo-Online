<?php
session_start();
require_once '../config/email.php';

// Función para verificar código de recuperación
function verifyRecoveryCode($email, $code) {
    $recoveryFile = 'data/recovery_codes.json';
    
    if (!file_exists($recoveryFile)) {
        return false;
    }
    
    $codes = json_decode(file_get_contents($recoveryFile), true) ?: [];
    
    if (!isset($codes[$email])) {
        return false;
    }
    
    $userCode = $codes[$email];
    
    // Verificar si el código expiró
    if (strtotime($userCode['expiry']) < time()) {
        unset($codes[$email]);
        file_put_contents($recoveryFile, json_encode($codes, JSON_PRETTY_PRINT));
        return false;
    }
    
    // Verificar si ya fue usado
    if ($userCode['used']) {
        return false;
    }
    
    // Verificar código
    if ($userCode['code'] !== $code) {
        return false;
    }
    
    return true;
}

// Función para marcar código como usado
function markCodeAsUsed($email) {
    $recoveryFile = 'data/recovery_codes.json';
    $codes = json_decode(file_get_contents($recoveryFile), true) ?: [];
    
    if (isset($codes[$email])) {
        $codes[$email]['used'] = true;
        file_put_contents($recoveryFile, json_encode($codes, JSON_PRETTY_PRINT));
    }
}

// Función para actualizar contraseña
function updatePassword($email, $newPassword) {
    $adminFile = '../data/admin.json';
    
    if (!file_exists($adminFile)) {
        return false;
    }
    
    $adminData = json_decode(file_get_contents($adminFile), true);
    
    if ($adminData['email'] !== $email) {
        return false;
    }
    
    // Actualizar contraseña
    $adminData['password'] = password_hash($newPassword, PASSWORD_DEFAULT);
    $adminData['password_changed_at'] = date('Y-m-d H:i:s');
    
    return file_put_contents($adminFile, json_encode($adminData, JSON_PRETTY_PRINT));
}

// Procesar restablecimiento de contraseña
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'] ?? '';
    $code = $input['code'] ?? '';
    $newPassword = $input['password'] ?? '';
    $confirmPassword = $input['confirm_password'] ?? '';
    
    // Validaciones
    if (empty($email) || empty($code) || empty($newPassword) || empty($confirmPassword)) {
        echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
        exit;
    }
    
    if ($newPassword !== $confirmPassword) {
        echo json_encode(['success' => false, 'message' => 'Las contraseñas no coinciden']);
        exit;
    }
    
    if (strlen($newPassword) < 6) {
        echo json_encode(['success' => false, 'message' => 'La contraseña debe tener al menos 6 caracteres']);
        exit;
    }
    
    // Verificar código
    if (!verifyRecoveryCode($email, $code)) {
        echo json_encode(['success' => false, 'message' => 'Código inválido o expirado']);
        exit;
    }
    
    // Actualizar contraseña
    if (updatePassword($email, $newPassword)) {
        markCodeAsUsed($email);
        echo json_encode(['success' => true, 'message' => 'Contraseña actualizada correctamente']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error actualizando contraseña']);
    }
    exit;
}

// Mostrar formulario de restablecimiento
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contraseña - Catálogo Digital</title>
    <link rel="stylesheet" href="../styles/main.css">
    <style>
        .reset-container {
            max-width: 400px;
            margin: 100px auto;
            padding: 40px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .reset-header {
            text-align: center;
            margin-bottom: 30px;
        }
        .reset-header h1 {
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
            box-sizing: border-box;
        }
        .form-group input:focus {
            outline: none;
            border-color: #ff6b35;
        }
        .btn-reset {
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
        .btn-reset:hover {
            background: #e55a2b;
        }
        .btn-reset:disabled {
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
        .code-input {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 2px;
        }
    </style>
</head>
<body>
    <div class="reset-container">
        <div class="reset-header">
            <h1>🔑 Restablecer Contraseña</h1>
            <p>Ingresa el código recibido por email y tu nueva contraseña</p>
        </div>
        
        <div id="message"></div>
        
        <form id="resetForm">
            <div class="form-group">
                <label for="email">Email del Administrador:</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="code">Código de Verificación:</label>
                <input type="text" id="code" name="code" class="code-input" maxlength="6" required>
            </div>
            
            <div class="form-group">
                <label for="password">Nueva Contraseña:</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <div class="form-group">
                <label for="confirm_password">Confirmar Contraseña:</label>
                <input type="password" id="confirm_password" name="confirm_password" required>
            </div>
            
            <button type="submit" class="btn-reset" id="submitBtn">
                Restablecer Contraseña
            </button>
        </form>
        
        <div class="back-link">
            <a href="login.html">← Volver al Login</a>
        </div>
    </div>

    <script>
        document.getElementById('resetForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const code = document.getElementById('code').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            const submitBtn = document.getElementById('submitBtn');
            const messageDiv = document.getElementById('message');
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Restableciendo...';
            
            try {
                const response = await fetch('reset-password.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        email: email,
                        code: code,
                        password: password,
                        confirm_password: confirmPassword
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    messageDiv.innerHTML = `<div class="message success">${result.message}</div>`;
                    messageDiv.innerHTML += '<p>Ya puedes <a href="login.html">iniciar sesión</a> con tu nueva contraseña.</p>';
                    document.getElementById('resetForm').reset();
                } else {
                    messageDiv.innerHTML = `<div class="message error">${result.message}</div>`;
                }
            } catch (error) {
                messageDiv.innerHTML = '<div class="message error">Error de conexión</div>';
            }
            
            submitBtn.disabled = false;
            submitBtn.textContent = 'Restablecer Contraseña';
        });
        
        // Auto-formatear código
        document.getElementById('code').addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 6);
        });
    </script>
</body>
</html>
