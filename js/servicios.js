/* ======================================
   SERVICIOS.JS - PÁGINA DE SERVICIOS (OPTIMIZADO DRY)
   ====================================== */

// ======================================
// CONFIGURACIONES ESPECÍFICAS DE SERVICIOS
// ======================================

// Configuración unificada para animaciones específicas de servicios (DRY)
const SERVICIOS_CONFIG = {
    animations: {
        stagger: 100,
        duration: 500,
        rippleDuration: 600
    },
    selectors: {
        processCards: '.proceso-card-full',
        glassCards: '.glass-card',
        listItems: '.complementary-card li',
        ctaButton: '.cta-button',
        processLinks: 'a[href^="#proceso"]'
    },
    responsive: {
        mobile: 768,
        cardHeight: { mobile: '160px', desktop: '200px' }
    }
};

// ======================================
// FUNCIONES ESPECÍFICAS OPTIMIZADAS
// ======================================

// Interacciones específicas de process cards (no duplica hover de global.js)
function initProcessStepInteractions() {
    const processCards = document.querySelectorAll(SERVICIOS_CONFIG.selectors.processCards);
    if (processCards.length === 0) return;

    processCards.forEach((card, index) => {
        // Solo efectos específicos de proceso (click y meta info)
        card.addEventListener('click', function() {
            console.log('Process step clicked:', index + 1);
            
            // Animación de click específica (no interfiere con hover de global.js)
            this.style.transform = 'translateY(-5px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-8px) scale(1)';
            }, 150);
        });

        // Efecto específico para mostrar meta información
        card.addEventListener('mouseenter', function() {
            const meta = this.querySelector('.card-meta');
            if (meta) {
                meta.style.opacity = '1';
                meta.style.transform = 'translateY(0)';
            }
        });
    });
}

// Sistema de smooth scroll específico para proceso (DRY)
function initProcessScrollNavigation() {
    document.querySelectorAll(SERVICIOS_CONFIG.selectors.processLinks).forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Highlight temporal del paso
                const originalBg = 'rgba(255, 255, 255, 0.75)';
                const highlightBg = 'rgba(65, 182, 230, 0.1)';
                
                target.style.background = highlightBg;
                setTimeout(() => { target.style.background = originalBg; }, 2000);
            }
        });
    });
}

// Efecto CTA con ripple (sin duplicar animaciones) 
function initCTAEffects() {
    const ctaButton = document.querySelector(SERVICIOS_CONFIG.selectors.ctaButton);
    if (!ctaButton) return;

    ctaButton.addEventListener('click', function(e) {
        // Crear ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect'; // Usar clase CSS en lugar de inline
        
        const rect = this.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left - 50) + 'px';
        ripple.style.top = (e.clientY - rect.top - 50) + 'px';

        this.style.position = 'relative';
        this.appendChild(ripple);

        setTimeout(() => {
            if (this.contains(ripple)) this.removeChild(ripple);
        }, SERVICIOS_CONFIG.animations.rippleDuration);
    });
}

// Animación escalonada para listas (usando observer universal)
function initServiceListAnimations() {
    const listItems = document.querySelectorAll(SERVICIOS_CONFIG.selectors.listItems);
    if (listItems.length === 0) return;

    // Usar observer universal de global.js en lugar de crear uno nuevo
    const { universalObserver } = window; // Acceder al observer global si está disponible
    
    listItems.forEach((item, index) => {
        // Estado inicial
        item.style.cssText = `
            opacity: 0;
            transform: translateX(-20px);
            transition: opacity ${SERVICIOS_CONFIG.animations.duration}ms ease, 
                        transform ${SERVICIOS_CONFIG.animations.duration}ms ease;
        `;

        // Animación escalonada al entrar en viewport
        const itemObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, index * SERVICIOS_CONFIG.animations.stagger);
                    itemObserver.unobserve(entry.target);
                }
            });
        });

        itemObserver.observe(item);

        // Hover effects simples
        item.addEventListener('mouseenter', () => {
            item.style.color = 'var(--primary)';
            item.style.paddingLeft = '2rem';
        });

        item.addEventListener('mouseleave', () => {
            item.style.color = 'var(--primary-dark)';
            item.style.paddingLeft = '1.5rem';
        });
    });
}

// Responsive handler unificado (DRY)
function handleServicesResize() {
    const isMobile = window.innerWidth <= SERVICIOS_CONFIG.responsive.mobile;
    const practicalCards = document.querySelectorAll('.practical-card');
    
    practicalCards.forEach(card => {
        card.style.minHeight = isMobile 
            ? SERVICIOS_CONFIG.responsive.cardHeight.mobile
            : SERVICIOS_CONFIG.responsive.cardHeight.desktop;
    });
}

// ======================================
// ESTILOS CSS ESPECÍFICOS (MOVER A CSS)
// ======================================

// Agregar estilos específicos de servicios una sola vez
function addServiciosStyles() {
    if (document.querySelector('#servicios-styles')) return;

    const serviciosStyles = document.createElement('style');
    serviciosStyles.id = 'servicios-styles';
    serviciosStyles.textContent = `
        /* Ripple effect para CTA */
        .ripple-effect {
            position: absolute;
            width: 100px;
            height: 100px;
            background: rgba(244, 218, 64, 0.5);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        /* Pulse para iconos de requisitos */
        .pulse-icon {
            animation: pulse 0.6s ease-in-out;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(serviciosStyles);
}

// ======================================
// INICIALIZACIÓN OPTIMIZADA
// ======================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 Servicios page - Optimized initialization');

    // Agregar estilos específicos
    addServiciosStyles();

    // Inicializar funcionalidades específicas (NO duplicar global.js)
    initProcessStepInteractions();      // Solo clicks y meta info
    initProcessScrollNavigation();      // Solo smooth scroll específico  
    initCTAEffects();                  // Solo ripple en CTA
    initServiceListAnimations();       // Solo listas con stagger

    // Responsive handler optimizado
    window.addEventListener('resize', debounce(handleServicesResize, 100));
    handleServicesResize(); // Ejecutar inicialmente

    console.log('✅ Servicios: Specific functionality loaded');
    console.log('ℹ️  Global effects handled by global.js');
});

// Función debounce local si no está disponible globalmente
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}