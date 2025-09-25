const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(express.json());
app.use(express.static('.'));

// Simular autenticación simple
let isAuthenticated = false;

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        port: PORT,
        environment: process.env.NODE_ENV || 'development'
    });
});

// Ruta de login (simula PHP)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'login.html'));
});

// Ruta protegida para el panel de administración
app.get('/admin/dashboard', (req, res) => {
    if (isAuthenticated) {
        res.sendFile(path.join(__dirname, 'index.html'));
    } else {
        res.status(401).json({ status: 'error', message: 'No autorizado' });
    }
});

// Ruta de login POST
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'admin' && password === 'catalogo2024') {
        isAuthenticated = true;
        res.json({ status: 'success', message: 'Login exitoso', redirect: '/admin/dashboard' });
    } else {
        res.status(401).json({ status: 'error', message: 'Credenciales incorrectas' });
    }
});

// Verificar estado de autenticación
app.get('/admin/status', (req, res) => {
    res.json({ authenticated: isAuthenticated });
});

// Ruta de logout
app.post('/admin/logout', (req, res) => {
    isAuthenticated = false;
    res.json({ status: 'success', message: 'Logout exitoso' });
});

// API para productos (simula PHP)
app.get('/admin/api.php', (req, res) => {
    if (!isAuthenticated) {
        return res.status(401).json({ status: 'error', message: 'No autorizado' });
    }
    
    const action = req.query.action;
    
    if (action === 'products') {
        const productsFile = path.join(__dirname, 'data', 'products.json');
        const products = fs.existsSync(productsFile) ? 
            JSON.parse(fs.readFileSync(productsFile, 'utf8')) : [];
        res.json({ status: 'success', data: products });
    } else if (action === 'categories') {
        const categoriesFile = path.join(__dirname, 'data', 'categories.json');
        const categories = fs.existsSync(categoriesFile) ? 
            JSON.parse(fs.readFileSync(categoriesFile, 'utf8')) : [];
        res.json({ status: 'success', data: categories });
    } else {
        res.status(400).json({ status: 'error', message: 'Acción no válida' });
    }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
    console.log(`📱 Catálogo: http://localhost:${PORT}`);
    console.log(`🔧 Admin: http://localhost:${PORT}/admin`);
    console.log(`💚 Health: http://localhost:${PORT}/health`);
});

// Manejo de errores
process.on('uncaughtException', (err) => {
    console.error('❌ Error no capturado:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada no manejada:', reason);
    process.exit(1);
});