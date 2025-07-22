/* ======================================
   SERVICIOS.JS - PÁGINA DE SERVICIOS JMC
   ====================================== */

// ======================================
// FUNCIONES ESPECÍFICAS DE LA PÁGINA DE SERVICIOS
// ======================================

// ======================================
// FUNCIONES ESPECÍFICAS DE LA PÁGINA DE SERVICIOS
// ======================================

// Función para registrar cards de servicios en el sistema global
function registerServicesCardsInGlobalSystem() {
    // Asegurar que todas las cards de servicios estén en el sistema global de efectos
    const serviciosCardConfigs = [
        {
            selector: '.service-feature-card',
            hasIcon: true
        },
        {
            selector: '.requisito-card',
            hasIcon: true,
            hoverBackground: 'rgba(255, 255, 255, 0.15)',
            restoreBackground: 'rgba(255, 255, 255, 0.1)'
        },
        {
            selector: '.complementary-card',
            hasIcon: true
        },
        {
            selector: '.financial-card',
            hasIcon: true
        },
        {
            selector: '.practical-card',
            hasIcon: true
        }
    ];

    // Aplicar efectos estándar uniformes
    const standardHover = {
        transform: 'translateY(-8px)',
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)'
    };
    
    const standardRestore = {
        transform: 'translateY(0)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
    };

    serviciosCardConfigs.forEach(config => {
        document.querySelectorAll(config.selector).forEach(card => {
            card.addEventListener('mouseenter', function() {
                // Efecto estándar para todas
                this.style.transform = standardHover.transform;
                this.style.boxShadow = standardHover.boxShadow;
                
                // Backgrounds específicos si los tienen
                if (config.hoverBackground) {
                    this.style.background = config.hoverBackground;
                }
                
                // Efecto de iconos si los tienen
                if (config.hasIcon) {
                    const iconContainer = this.querySelector('.service-icon, .requisito-icon, .complementary-icon, .financial-icon, .practical-icon');
                    const icon = this.querySelector('.material-symbols-rounded');
                    if (iconContainer && icon) {
                        iconContainer.style.transform = 'scale(1.1)';
                        icon.style.transform = 'scale(1.1)';
                    }
                }
            });
            
            card.addEventListener('mouseleave', function() {
                // Restaurar efecto estándar
                this.style.transform = standardRestore.transform;
                this.style.boxShadow = standardRestore.boxShadow;
                
                // Restaurar backgrounds específicos
                if (config.restoreBackground) {
                    this.style.background = config.restoreBackground;
                }
                
                // Restaurar iconos
                if (config.hasIcon) {
                    const iconContainer = this.querySelector('.service-icon, .requisito-icon, .complementary-icon, .financial-icon, .practical-icon');
                    const icon = this.querySelector('.material-symbols-rounded');
                    if (iconContainer && icon) {
                        iconContainer.style.transform = 'scale(1)';
                        icon.style.transform = 'scale(1)';
                    }
                }
            });
        });
    });
}
// Función para manejar interacciones con las cards de proceso
function initProcessStepInteractions() {
    const processCards = document.querySelectorAll('.proceso-card-full');
    
    if (processCards.length === 0) return;
    
    processCards.forEach((card, index) => {
        // Efecto de click mejorado para las cards del proceso
        card.addEventListener('click', function() {
            console.log('Process step clicked:', index + 1);
            
            // Animación de click específica
            this.style.transform = 'translateY(-5px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-8px) scale(1)';
            }, 150);
            
            // Efecto en el icono del proceso
            const stepIcon = this.querySelector('.process-step-icon');
            if (stepIcon) {
                stepIcon.style.transform = 'scale(1.15)';
                setTimeout(() => {
                    stepIcon.style.transform = 'scale(1.1)';
                }, 200);
            }
        });
        
        // Efecto hover específico para información adicional
        card.addEventListener('mouseenter', function() {
            const meta = this.querySelector('.card-meta');
            if (meta) {
                meta.style.opacity = '1';
                meta.style.transform = 'translateY(0)';
            }
        });
    });
}

// Función para manejar el formulario de consulta rápida (si se agrega en el futuro)
function initQuickConsultationForm() {
    const quickForm = document.querySelector('.quick-consultation-form');
    
    if (!quickForm) return;
    
    quickForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const formData = new FormData(this);
        const consultationData = Object.fromEntries(formData);
        
        console.log('Quick consultation submitted:', consultationData);
        
        // Simular envío exitoso
        showConsultationSuccess();
    });
}

// Función para mostrar mensaje de éxito en consulta
function showConsultationSuccess() {
    // Crear mensaje de éxito temporal
    const successMessage = document.createElement('div');
    successMessage.className = 'consultation-success';
    successMessage.innerHTML = `
        <div class="success-content">
            <span class="material-symbols-rounded">check_circle</span>
            <p>¡Consulta enviada exitosamente! Te contactaremos pronto.</p>
        </div>
    `;
    
    // Estilos para el mensaje
    successMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: var(--azul-principal);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(successMessage);
    
    // Animación de entrada
    setTimeout(() => {
        successMessage.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        successMessage.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(successMessage);
        }, 300);
    }, 4000);
}

// Función para manejar animaciones específicas de las cards de servicios - SIMPLIFICADA
function initServiceCardAnimations() {
    const serviceCards = document.querySelectorAll('.service-feature-card, .complementary-card, .practical-card, .financial-card, .requisito-card');
    
    if (serviceCards.length === 0) return;
    
    // Crear observer específico para cards de servicios con animación escalonada
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Animación escalonada más dramática para servicios
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 150);
                serviceObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Inicializar estado y observar
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px) scale(0.9)';
        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        serviceObserver.observe(card);
    });
}

// Función para efectos específicos de requisitos - SIMPLIFICADA (efectos principales en sistema global)
function initRequirementCardEffects() {
    const reqCards = document.querySelectorAll('.requisito-card');
    
    if (reqCards.length === 0) return;
    
    // Solo agregar el efecto de pulso adicional (el hover principal está en sistema global)
    reqCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.material-symbols-rounded');
            if (icon) {
                // Crear efecto de pulso adicional
                icon.style.animation = 'pulse 0.6s ease-in-out';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.material-symbols-rounded');
            if (icon) {
                icon.style.animation = 'none';
            }
        });
    });
    
    // Agregar keyframes para el efecto de pulso
    const pulseKeyframes = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    
    if (!document.querySelector('#pulse-animation')) {
        const style = document.createElement('style');
        style.id = 'pulse-animation';
        style.textContent = pulseKeyframes;
        document.head.appendChild(style);
    }
}

// Función para manejar el scroll específico de servicios
function initServicesScrollEffects() {
    let lastScrollY = window.scrollY;
    
    const servicesScrollHandler = debounce(function() {
        const scrollY = window.scrollY;
        const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
        
        // Efecto parallax suave en las secciones de background
        const backgroundElements = document.querySelectorAll('.mountain-background, .secondary-background');
        backgroundElements.forEach(bg => {
            const translateY = scrollY * 0.3;
            bg.style.transform = `translateX(-50%) translateY(${translateY}px)`;
        });
        
        // Efecto especial en las cards cuando se hace scroll hacia arriba
        if (scrollDirection === 'up') {
            const visibleCards = document.querySelectorAll('.service-feature-card:hover, .practical-card:hover');
            visibleCards.forEach(card => {
                card.style.transform = 'translateY(-12px)';
                setTimeout(() => {
                    card.style.transform = 'translateY(-8px)';
                }, 200);
            });
        }
        
        lastScrollY = scrollY;
    }, 10);
    
    window.addEventListener('scroll', servicesScrollHandler, { passive: true });
}

// Función para manejar información adicional de las modalidades de pago
function initPaymentInfoToggle() {
    const paymentItems = document.querySelectorAll('.payment-item');
    
    if (paymentItems.length === 0) return;
    
    paymentItems.forEach(item => {
        item.addEventListener('click', function() {
            // Efecto visual al hacer click
            this.style.transform = 'scale(0.98)';
            this.style.background = 'rgba(65, 182, 230, 0.15)';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.style.background = 'rgba(65, 182, 230, 0.05)';
            }, 200);
            
            console.log('Payment info clicked:', this.querySelector('strong').textContent);
        });
        
        // Efecto hover mejorado
        item.addEventListener('mouseenter', function() {
            this.style.borderLeftColor = '#F4DA40';
            this.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.borderLeftColor = '#41B6E6';
            this.style.transform = 'translateX(0)';
        });
    });
}

// Función para manejar efectos de las listas en servicios complementarios
function initComplementaryServiceLists() {
    const listItems = document.querySelectorAll('.complementary-card li');
    
    if (listItems.length === 0) return;
    
    listItems.forEach((item, index) => {
        // Animación escalonada de aparición
        const listObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, index * 100);
                    listObserver.unobserve(entry.target);
                }
            });
        });
        
        // Estado inicial
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        listObserver.observe(item);
        
        // Efecto hover individual
        item.addEventListener('mouseenter', function() {
            this.style.color = 'var(--azul-principal)';
            this.style.paddingLeft = '2rem';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.color = 'var(--azul-oscuro)';
            this.style.paddingLeft = '1.5rem';
        });
    });
}

// Función para crear un indicador de progreso de lectura específico de servicios
// ELIMINADA - Usar solo la barra global con gradiente

// ======================================
// FUNCIÓN DE INICIALIZACIÓN PRINCIPAL
// ======================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Servicios page initialized');
    
    // Inicializar todas las funciones específicas de servicios
    registerServicesCardsInGlobalSystem();
    initProcessStepInteractions();
    initQuickConsultationForm();
    initServiceCardAnimations();
    initRequirementCardEffects();
    initServicesScrollEffects();
    initPaymentInfoToggle();
    initComplementaryServiceLists();
    // initServicesReadingProgress(); - ELIMINADA, usar solo barra global
    
    // Event listeners específicos de servicios
    
    // Smooth scroll mejorado para los pasos del proceso
    document.querySelectorAll('a[href^="#proceso"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Destacar temporalmente el paso
                target.style.background = 'rgba(65, 182, 230, 0.1)';
                setTimeout(() => {
                    target.style.background = 'rgba(255, 255, 255, 0.75)';
                }, 2000);
            }
        });
    });
    
    // Efecto especial cuando se hace click en "CONTACTAR AHORA"
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            // Efecto de ondas
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                width: 100px;
                height: 100px;
                background: rgba(244, 218, 64, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            ripple.style.left = (e.clientX - rect.left - 50) + 'px';
            ripple.style.top = (e.clientY - rect.top - 50) + 'px';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                this.removeChild(ripple);
            }, 600);
        });
        
        // Agregar keyframes para el efecto de ondas
        const rippleKeyframes = `
            @keyframes rippleEffect {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = rippleKeyframes;
            document.head.appendChild(style);
        }
    }
    
    // Resize específico para ajustar elementos de servicios
    window.addEventListener('resize', debounce(function() {
        // Reajustar grids en caso de cambio de tamaño
        const practicalCards = document.querySelectorAll('.practical-card');
        const isMobile = window.innerWidth <= 768;
        
        practicalCards.forEach(card => {
            if (isMobile) {
                card.style.minHeight = '160px';
            } else {
                card.style.minHeight = '200px';
            }
        });
    }, 100));
    
    // Log de éxito
    console.log('Servicios page: All functionality loaded successfully');
    console.log('Process steps, payment info, and service cards are interactive');
});