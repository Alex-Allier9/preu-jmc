/* ======================================
   404.JS - PÁGINA DE ERROR 404 (OPTIMIZADO DRY)
   ====================================== */

// ======================================
// CONFIGURACIONES UNIFICADAS
// ======================================

// Configuración central para 404 (DRY)
const ERROR_404_CONFIG = {
    animations: {
        containers: [
            { selector: '.glitch-container', delay: 100 },
            { selector: '.message-container', delay: 400 },
            { selector: '.button-container', delay: 700 }
        ],
        deviceSettings: {
            smallMobile: {
                breakpoint: 360,
                glitchDuration: '6s',
                lineDuration: '5000ms, 1000ms',
                textDuration: '4s'
            },
            mobile: {
                breakpoint: 848, // 53rem
                glitchDuration: '8s',
                lineDuration: '4000ms, 1500ms',
                textDuration: '6s'
            }
        }
    },
    suggestions: {
        'inicio': 'index.html',
        'home': 'index.html',
        'nosotros': 'nosotros.html',
        'about': 'nosotros.html',
        'fundador': 'fundador.html',
        'founder': 'fundador.html',
        'servicios': 'servicios.html',
        'services': 'servicios.html',
        'testimonios': 'testimonios.html',
        'testimonials': 'testimonios.html',
        'contacto': 'contacto.html',
        'contact': 'contacto.html'
    },
    preloadPages: ['index.html', 'nosotros.html', 'fundador.html', 'servicios.html', 'testimonios.html', 'contacto.html']
};

// ======================================
// FUNCIONES OPTIMIZADAS
// ======================================

// Animaciones secuenciales optimizadas (DRY)
function init404Animations() {
    // Usar forEach en lugar de setTimeout repetitivos
    ERROR_404_CONFIG.animations.containers.forEach(({ selector, delay }) => {
        setTimeout(() => {
            const container = document.querySelector(selector);
            if (container) {
                container.classList.add('visible');
            }
        }, delay);
    });
}

// Ajustes de dispositivo unificados (DRY)
function adjustAnimationsByDevice() {
    const windowWidth = window.innerWidth;
    const { smallMobile, mobile } = ERROR_404_CONFIG.animations.deviceSettings;
    
    // Determinar configuración según dispositivo
    let config = null;
    if (windowWidth <= smallMobile.breakpoint) {
        config = smallMobile;
    } else if (windowWidth <= mobile.breakpoint) {
        config = mobile;
    }
    
    if (!config) return; // Desktop - sin cambios
    
    // Aplicar configuración unificada
    const elements = {
        glitchLines: document.querySelectorAll('.line'),
        crazyText: document.querySelector('.crazy-text'),
        glitchContainer: document.querySelector('.glitch')
    };
    
    // Aplicar animaciones con configuración unificada
    if (elements.glitchLines.length) {
        elements.glitchLines.forEach(line => {
            line.style.animationDuration = config.lineDuration;
        });
    }
    
    if (elements.crazyText) {
        elements.crazyText.style.animationDuration = config.textDuration;
    }
    
    if (elements.glitchContainer) {
        elements.glitchContainer.style.animationDuration = config.glitchDuration;
    }
}

// Sistema de sugerencias optimizado (DRY)
function suggestAlternativePages() {
    const currentPath = window.location.pathname.toLowerCase();
    
    // Buscar coincidencia usando Object.entries (más eficiente)
    const match = Object.entries(ERROR_404_CONFIG.suggestions)
        .find(([keyword]) => currentPath.includes(keyword));
    
    if (!match) return;
    
    const [keyword, page] = match;
    console.log(`💡 Sugerencia: ¿Buscabas ${page}?`);
    
    // Mostrar sugerencia en la página
    const errorMessage = document.querySelector('.error-message');
    if (errorMessage) {
        const suggestion = createSuggestionElement(page, keyword);
        errorMessage.appendChild(suggestion);
    }
}

// Helper para crear elemento de sugerencia (DRY)
function createSuggestionElement(page, keyword) {
    const suggestion = document.createElement('p');
    suggestion.style.cssText = `
        margin-top: 1rem;
        font-size: 0.9rem;
        color: var(--primary-dark);
        font-style: normal;
    `;
    suggestion.innerHTML = `¿Tal vez buscabas <a href="${page}" style="color: var(--primary); text-decoration: underline;">${page.replace('.html', '')}?</a>`;
    return suggestion;
}

// Preloading optimizado (DRY)
function enhanceSearchExperience() {
    // Crear fragment para optimizar DOM manipulation
    const fragment = document.createDocumentFragment();
    
    ERROR_404_CONFIG.preloadPages.forEach(page => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        fragment.appendChild(link);
    });
    
    document.head.appendChild(fragment);
    console.log(`🚀 Preloaded ${ERROR_404_CONFIG.preloadPages.length} pages for faster navigation`);
}

// Logging optimizado (DRY)
function log404Error() {
    const errorData = {
        url: window.location.href,
        referrer: document.referrer || 'Directo',
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
    };
    
    console.log('📍 404 Error Details:', errorData);
    
    // Opcional: enviar a analytics
    // analytics.track('404_error', errorData);
}

// Optimización para navegadores antiguos (DRY)
function handleLegacySupport() {
    // Verificar soporte para Intersection Observer
    if (!window.IntersectionObserver) {
        // Fallback para navegadores antiguos
        document.querySelectorAll('.fade-in').forEach(el => {
            el.classList.add('visible');
        });
        console.log('⚠️ Legacy browser detected - using fallback animations');
    }
}

// Handler de resize optimizado
function handle404Resize() {
    adjustAnimationsByDevice();
}

// ======================================
// INICIALIZACIÓN OPTIMIZADA
// ======================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚨 404 Page - Optimized initialization');
    
    // Funcionalidades específicas de 404
    init404Animations();
    adjustAnimationsByDevice();
    suggestAlternativePages();
    enhanceSearchExperience();
    log404Error();
    handleLegacySupport();
    
    // Event listeners optimizados
    window.addEventListener('resize', debounce(handle404Resize, 100));
    
    console.log('✅ 404: Error page functionality loaded');
    console.log('🔍 Alternative page suggestions active');
});

// Función debounce local (reutilizable)
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