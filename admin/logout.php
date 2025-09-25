<?php
/**
 * Cierre de sesión de administrador
 * Destruye la sesión y redirige al login
 * 
 * @author Desarrollador Senior
 * @since 1.0.0
 */

session_start();

// Destruir toda la información de la sesión
session_destroy();

// Redirigir al login
header('Location: login.php');
exit;
?>

