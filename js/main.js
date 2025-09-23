// Funcionalidad del catálogo de liquidación
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos del DOM
    const searchInput = document.getElementById('searchInput');
    const productsGrid = document.getElementById('productsGrid');
    const categoryItems = document.querySelectorAll('.category-item');
    const productCards = document.querySelectorAll('.product-card');
    
    // Datos de productos (simulando base de datos)
    const products = [
        {
            id: 1,
            name: 'Freidora Eléctrica Royal 20 Lts',
            brand: 'ROYAL',
            category: 'electrodomesticos',
            price: 'US$ 218.55',
            rating: 5,
            reviews: 12,
            shipping: 'Envío gratis',
            description: 'Freidora eléctrica de alta capacidad para uso comercial y doméstico'
        },
        {
            id: 2,
            name: 'Licuadora Oster 1500w 1.5L Vidrio 2 Accesorios',
            brand: 'OSTER',
            category: 'electrodomesticos',
            price: 'US$ 48.95',
            rating: 4.5,
            reviews: 171,
            shipping: 'Envío gratis',
            colors: 'Disponible en 3 colores',
            description: 'Licuadora de alta potencia con vaso de vidrio y accesorios incluidos'
        },
        {
            id: 3,
            name: 'Procesador De Alimento Eléctrico Picatodo 1.5 Tazas Original',
            brand: 'ROYAL',
            category: 'electrodomesticos',
            price: 'US$ 23.95',
            rating: 5,
            reviews: 6,
            shipping: 'Envío gratis',
            description: 'Procesador compacto para picar y procesar alimentos'
        },
        {
            id: 4,
            name: 'Humificador Difusor De Aroma 150ml + Esencia Aromática 15ml',
            brand: 'EAGLE STORE',
            category: 'hogar',
            price: 'US$ 7.44',
            originalPrice: 'US$ 8.00',
            discount: '7% OFF',
            rating: 4.5,
            reviews: 63,
            shipping: 'Envío gratis',
            description: 'Humificador con difusor de aromas y esencia incluida'
        },
        {
            id: 5,
            name: 'Mini Aspiradora Sopladora Inalámbrica Recargable 2 En 1 USB',
            brand: 'VACUUM CLEANER',
            category: 'limpieza',
            price: 'US$ 6.99',
            rating: 4.5,
            reviews: 256,
            shipping: 'Envío gratis',
            description: 'Aspiradora inalámbrica con función de soplador, recargable por USB'
        },
        {
            id: 6,
            name: 'Cuchilla Oster + Acople Completo Orig Made In USA',
            brand: 'OSTER',
            category: 'electrodomesticos',
            price: 'US$ 10.00',
            rating: 5,
            reviews: 131,
            shipping: 'Envío gratis',
            description: 'Cuchilla original Oster con acople completo, fabricado en USA'
        }
    ];
    
    // Función para filtrar productos por categoría
    function filterByCategory(category) {
        productCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease-in';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Actualizar contador de productos visibles
        updateProductCount(category);
    }
    
    // Función para actualizar contador de productos
    function updateProductCount(category) {
        const visibleProducts = category === 'all' 
            ? productCards.length 
            : document.querySelectorAll(`[data-category="${category}"]`).length;
        
        // Actualizar el contador en el header si existe
        const countElement = document.querySelector('.products-header p');
        if (countElement) {
            countElement.textContent = `${visibleProducts} productos encontrados`;
        }
    }
    
    // Función para buscar productos
    function searchProducts(query) {
        const searchTerm = query.toLowerCase().trim();
        
        productCards.forEach(card => {
            const productName = card.querySelector('.product-name').textContent.toLowerCase();
            const productBrand = card.querySelector('.product-brand').textContent.toLowerCase();
            
            if (productName.includes(searchTerm) || productBrand.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease-in';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Función para cambiar imagen principal al hacer clic en thumbnail
    function setupImageThumbnails() {
        const thumbnails = document.querySelectorAll('.image-thumbnails img');
        
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                const mainImage = this.closest('.product-card').querySelector('.main-image');
                const tempSrc = mainImage.src;
                mainImage.src = this.src;
                this.src = tempSrc;
                
                // Efecto de transición
                mainImage.style.opacity = '0';
                setTimeout(() => {
                    mainImage.style.opacity = '1';
                }, 150);
            });
        });
    }
    
    // Función para mostrar/ocultar detalles del producto
    function setupProductDetails() {
        productCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // No hacer nada si se hace clic en una imagen thumbnail
                if (e.target.closest('.image-thumbnails')) {
                    return;
                }
                
                // Aquí se podría agregar un modal con más detalles
                console.log('Producto seleccionado:', this.querySelector('.product-name').textContent);
            });
        });
    }
    
    // Función para animar las estrellas de rating
    function animateStars() {
        const stars = document.querySelectorAll('.stars i');
        
        stars.forEach(star => {
            star.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.2)';
                this.style.transition = 'transform 0.2s ease';
            });
            
            star.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
    
    // Función para agregar animación CSS
    function addAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .product-card {
                animation: fadeIn 0.5s ease-out;
            }
            
            .product-card:nth-child(1) { animation-delay: 0.1s; }
            .product-card:nth-child(2) { animation-delay: 0.2s; }
            .product-card:nth-child(3) { animation-delay: 0.3s; }
            .product-card:nth-child(4) { animation-delay: 0.4s; }
            .product-card:nth-child(5) { animation-delay: 0.5s; }
            .product-card:nth-child(6) { animation-delay: 0.6s; }
        `;
        document.head.appendChild(style);
    }
    
    // Event Listeners
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remover clase active de todos los items
            categoryItems.forEach(cat => cat.classList.remove('active'));
            
            // Agregar clase active al item clickeado
            this.classList.add('active');
            
            // Filtrar productos
            const category = this.dataset.category;
            filterByCategory(category);
        });
    });
    
    // Búsqueda en tiempo real
    searchInput.addEventListener('input', function() {
        const query = this.value;
        if (query.length > 0) {
            searchProducts(query);
        } else {
            // Mostrar todos los productos de la categoría activa
            const activeCategory = document.querySelector('.category-item.active').dataset.category;
            filterByCategory(activeCategory);
        }
    });
    
    // Función para manejar el botón de imprimir
    function setupPrintButton() {
        const printBtn = document.querySelector('.print-btn');
        if (printBtn) {
            printBtn.addEventListener('click', function() {
                // Agregar información adicional antes de imprimir
                const printInfo = document.createElement('div');
                printInfo.innerHTML = `
                    <div style="text-align: center; margin-bottom: 20px; padding: 20px; border-bottom: 2px solid #1877f2;">
                        <h1 style="color: #1877f2; margin-bottom: 10px;">Catálogo de Liquidación</h1>
                        <p style="color: #666;">Generado el ${new Date().toLocaleDateString('es-ES')}</p>
                    </div>
                `;
                document.body.insertBefore(printInfo, document.body.firstChild);
                
                // Imprimir
                window.print();
                
                // Remover la información después de imprimir
                setTimeout(() => {
                    if (printInfo.parentNode) {
                        printInfo.parentNode.removeChild(printInfo);
                    }
                }, 1000);
            });
        }
    }
    
    // Función para agregar efectos de hover mejorados
    function setupHoverEffects() {
        productCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });
    }
    
    // Función para inicializar contadores de categorías
    function initializeCategoryCounts() {
        const categories = ['all', 'electrodomesticos', 'hogar', 'limpieza'];
        const counts = [6, 4, 1, 1]; // Contadores reales basados en los productos
        
        categories.forEach((category, index) => {
            const categoryItem = document.querySelector(`[data-category="${category}"]`);
            if (categoryItem) {
                const countElement = categoryItem.querySelector('.count');
                if (countElement) {
                    countElement.textContent = counts[index];
                }
            }
        });
    }
    
    // Inicialización
    function init() {
        setupImageThumbnails();
        setupProductDetails();
        animateStars();
        addAnimations();
        setupPrintButton();
        setupHoverEffects();
        initializeCategoryCounts();
        
        // Mostrar todos los productos por defecto
        filterByCategory('all');
        
        console.log('Catálogo de liquidación inicializado correctamente');
    }
    
    // Ejecutar inicialización
    init();
    
    // Función para exportar datos (útil para futuras integraciones)
    window.exportProductData = function() {
        return products;
    };
    
    // Función para agregar nuevo producto (útil para futuras expansiones)
    window.addProduct = function(productData) {
        products.push(productData);
        console.log('Producto agregado:', productData);
    };
});
