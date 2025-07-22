/* ======================================
   TEMPLATE.JS - TEMPLATE BASE PARA NUEVAS PÁGINAS
   ====================================== */

// ======================================
// FUNCIONES ESPECÍFICAS DE LA PÁGINA
// ======================================

// Ejemplo: Función para manejar interacciones específicas de cards
function initTemplateCardInteractions() {
    // Ejemplo de interacción específica con content cards
    const contentCards = document.querySelectorAll('.content-card');
    
    if (contentCards.length === 0) return;
    
    contentCards.forEach(card => {
        // Ejemplo: Agregar efecto de click
        card.addEventListener('click', function() {
            console.log('Content card clicked:', this);
            
            // Ejemplo de animación de click
            this.style.transform = 'translateY(-5px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-8px) scale(1)';
            }, 150);
        });
    });
}

// Ejemplo: Función para manejar formularios específicos (si los hay)
function initTemplateFormHandlers() {
    // Ejemplo de manejo de formulario específico de la página
    const templateForm = document.querySelector('.template-form');
    
    if (!templateForm) return;
    
    templateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Ejemplo de validación y manejo
        const formData = new FormData(this);
        console.log('Form submitted:', Object.fromEntries(formData));
        
        // Aquí iría la lógica específica del formulario
    });
}

// Ejemplo: Función para manejar animaciones específicas de la página
function initTemplateAnimations() {
    // Ejemplo: Animación específica para feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    
    if (featureCards.length === 0) return;
    
    // Crear observer específico para feature cards
    const featureObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Animación escalonada para feature cards
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 200);
                featureObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Inicializar estado y observar
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.9)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        featureObserver.observe(card);
    });
}

// Ejemplo: Función para manejar contadores específicos (si los hay)
function initTemplateCounters() {
    const templateCounters = document.querySelectorAll('.template-counter');
    
    if (templateCounters.length === 0) return;
    
    templateCounters.forEach(counter => {
        const target = counter.textContent;
        
        if (!isNaN(target.replace('+', '').replace('%', ''))) {
            counter.textContent = '0';
            
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Usar la función global animateValue
                        animateValue(counter, 0, parseInt(target.replace('+', '').replace('%', '')), 1500, target);
                        counterObserver.unobserve(counter);
                    }
                });
            });
            
            counterObserver.observe(counter);
        }
    });
}

// Ejemplo: Función para manejar modales o lightboxes específicos
function initTemplateLightbox() {
    // Ejemplo de implementación de lightbox específico para la página
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    
    if (lightboxTriggers.length === 0) return;
    
    // Crear lightbox element
    const lightbox = document.createElement('div');
    lightbox.className = 'template-lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="close-lightbox">&times;</span>
            <div class="lightbox-body">
                <!-- Contenido del lightbox -->
            </div>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    // Estilos para el lightbox
    const lightboxStyles = `
        <style>
        .template-lightbox {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(5px);
            justify-content: center;
            align-items: center;
        }
        
        .template-lightbox .lightbox-content {
            position: relative;
            margin: auto;
            padding: 20px;
            width: 90%;
            max-width: 600px;
            background: white;
            border-radius: 15px;
            text-align: center;
        }
        
        .template-lightbox .close-lightbox {
            position: absolute;
            top: 10px;
            right: 15px;
            color: var(--negro);
            font-size: 30px;
            font-weight: bold;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .template-lightbox .close-lightbox:hover {
            color: var(--azul-principal);
        }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', lightboxStyles);
    
    // Funcionalidad del lightbox
    function openLightbox(content) {
        lightbox.querySelector('.lightbox-body').innerHTML = content;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Event listeners
    lightboxTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const content = this.getAttribute('data-lightbox-content') || 'Contenido del lightbox';
            openLightbox(content);
        });
    });
    
    lightbox.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });
}

// Ejemplo: Función para manejar filtros o tabs (si los hay)
function initTemplateFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const filterableItems = document.querySelectorAll('.filterable-item');
    
    if (filterButtons.length === 0 || filterableItems.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Agregar active al botón clickeado
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            filterableItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ======================================
// FUNCIÓN DE INICIALIZACIÓN PRINCIPAL
// ======================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Template page initialized');
    
    // Inicializar todas las funciones específicas de la página
    initTemplateCardInteractions();
    initTemplateFormHandlers();
    initTemplateAnimations();
    initTemplateCounters();
    initTemplateLightbox();
    initTemplateFilters();
    
    // Ejemplo: Manejar eventos específicos de la página
    // (estos son ejemplos, se pueden eliminar si no se necesitan)
    
    // Ejemplo: Scroll específico de la página
    window.addEventListener('scroll', debounce(function() {
        // Ejemplo de funcionalidad específica en scroll
        const scrollPosition = window.scrollY;
        
        // Aquí iría lógica específica de scroll si se necesita
        // Por ejemplo: parallax effects, sticky elements específicos, etc.
    }, 50));
    
    // Ejemplo: Resize específico de la página
    window.addEventListener('resize', debounce(function() {
        // Ejemplo de funcionalidad específica en resize
        // Por ejemplo: recalcular posiciones, ajustar layouts específicos, etc.
    }, 100));
    
    // Log de éxito
    console.log('Template page: All functionality loaded successfully');
});