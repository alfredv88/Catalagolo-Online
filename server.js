const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración para Railway
const isProduction = process.env.NODE_ENV === 'production';
const isRailway = process.env.RAILWAY_ENVIRONMENT === 'production';

// Middleware básico
app.use(express.json());
app.use(express.static('.'));

// Simular autenticación simple para testing
let isAuthenticated = false;

// Ruta principal - servir index.php como HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.php'));
});

// Health check para Railway
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        railway: isRailway,
        production: isProduction,
        version: '1.0.0',
        service: 'Catálogo Digital - Motos Ortiz',
        phase: 'FASE 3 - Testing en Railway'
    });
});

// Ruta de login (simula PHP)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'login.php'));
});

// Ruta protegida para el panel de administración
app.get('/admin/dashboard', (req, res) => {
    if (isAuthenticated) {
        res.sendFile(path.join(__dirname, 'index.php'));
    } else {
        res.status(401).json({ status: 'error', message: 'No autorizado' });
    }
});

// Ruta de login POST (simula PHP)
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    // Usar credenciales de config.php
    if (username === 'admin_motos_ortiz_2025' && password === 'MotosOrtiz2025!Seguro') {
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

// API POST para productos (simula PHP)
app.post('/admin/api.php', (req, res) => {
    if (!isAuthenticated) {
        return res.status(401).json({ status: 'error', message: 'No autorizado' });
    }
    
    const action = req.query.action;
    
    if (action === 'products') {
        const { products } = req.body;
        const productsFile = path.join(__dirname, 'data', 'products.json');
        
        try {
            fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
            res.json({ 
                status: 'success', 
                message: 'Productos guardados correctamente',
                count: products.length 
            });
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Error al guardar productos' });
        }
    } else if (action === 'categories') {
        const { categories } = req.body;
        const categoriesFile = path.join(__dirname, 'data', 'categories.json');
        
        try {
            fs.writeFileSync(categoriesFile, JSON.stringify(categories, null, 2));
            res.json({ status: 'success', message: 'Categorías actualizadas' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Error al guardar categorías' });
        }
    } else {
        res.status(400).json({ status: 'error', message: 'Acción no válida' });
    }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
    console.log(`📱 Catálogo Digital - Motos Ortiz`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🚂 Railway: ${isRailway ? 'YES' : 'NO'}`);
    console.log(`💚 Health Check: /health`);
    console.log(`🔧 FASE 3: Testing en Railway`);
    
    if (isRailway) {
        console.log(`🔗 Railway URL: ${process.env.RAILWAY_PUBLIC_DOMAIN || 'Configurando...'}`);
    } else {
        console.log(`📱 Local: http://localhost:${PORT}`);
        console.log(`🔧 Admin: http://localhost:${PORT}/admin`);
    }
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
