/* ======================================
   404.JS - FUNCIONALIDADES ESPECÍFICAS DE LA PÁGINA 404
   ====================================== */

/* ======================================
   404.JS - FUNCIONALIDADES ESPECÍFICAS DE LA PÁGINA 404
   ====================================== */

// Función debounce local para este archivo
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

// Función para inicializar las animaciones fade-in específicas de 404
function init404Animations() {
    // Forzar que los elementos aparezcan con animaciones
    setTimeout(() => {
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('visible');
                
                // Activar animaciones específicas después de la entrada
                if (element.classList.contains('glitch')) {
                    // Activar animaciones glitch después de la entrada
                    setTimeout(() => {
                        element.querySelectorAll('.line').forEach(line => {
                            line.style.animationPlayState = 'running';
                        });
                        // También activar la animación italic del contenedor glitch
                        element.style.animationPlayState = 'running';
                    }, 800);
                }
                
                if (element.classList.contains('error-message')) {
                    // Activar animación crazy text después de la entrada
                    setTimeout(() => {
                        const crazyText = element.querySelector('.crazy-text');
                        if (crazyText) {
                            crazyText.style.animationPlayState = 'running';
                        }
                    }, 600);
                }
            }, index * 200); // Escalonar las animaciones cada 200ms
        });
    }, 100);
}

// Función para controlar la intensidad de las animaciones según el dispositivo
function adjustAnimationsByDevice() {
    const isMobile = window.innerWidth <= 848; // 53rem
    const isSmallMobile = window.innerWidth <= 360;
    
    const glitchLines = document.querySelectorAll('.line');
    const crazyText = document.querySelector('.crazy-text');
    const glitchContainer = document.querySelector('.glitch');
    
    if (isSmallMobile) {
        // Animaciones más suaves en pantallas muy pequeñas
        glitchLines.forEach(line => {
            line.style.animationDuration = '5000ms, 1000ms';
        });
        if (crazyText) {
            crazyText.style.animationDuration = '4s';
        }
        if (glitchContainer) {
            glitchContainer.style.animationDuration = '6s';
        }
    } else if (isMobile) {
        // Animaciones intermedias en mobile
        glitchLines.forEach(line => {
            line.style.animationDuration = '4000ms, 750ms';
        });
        if (crazyText) {
            crazyText.style.animationDuration = '4s';
        }
        if (glitchContainer) {
            glitchContainer.style.animationDuration = '5s';
        }
    }
    // Desktop mantiene las animaciones originales (500ms para glitch, 3s para crazy-text, 4s para glitch italic)
}

// Función para pausar/reanudar animaciones cuando el usuario no está activo
function handleVisibilityChange() {
    const glitchLines = document.querySelectorAll('.line');
    const crazyText = document.querySelector('.crazy-text');
    const glitchContainer = document.querySelector('.glitch');
    
    if (document.hidden) {
        // Pausar animaciones cuando la página no es visible
        glitchLines.forEach(line => {
            line.style.animationPlayState = 'paused';
        });
        if (crazyText) {
            crazyText.style.animationPlayState = 'paused';
        }
        if (glitchContainer) {
            glitchContainer.style.animationPlayState = 'paused';
        }
    } else {
        // Reanudar animaciones cuando la página vuelve a ser visible
        setTimeout(() => {
            glitchLines.forEach(line => {
                line.style.animationPlayState = 'running';
            });
            if (crazyText) {
                crazyText.style.animationPlayState = 'running';
            }
            if (glitchContainer) {
                glitchContainer.style.animationPlayState = 'running';
            }
        }, 1000);
    }
}

// Función para agregar efecto hover al botón
function enhance404Button() {
    const errorButton = document.querySelector('.error-button');
    
    if (errorButton) {
        // Efecto de ondas al hacer clic
        errorButton.addEventListener('click', function(e) {
            // Crear elemento de onda
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${e.clientX - rect.left - size / 2}px;
                top: ${e.clientY - rect.top - size / 2}px;
                pointer-events: none;
            `;
            
            // Agregar animación CSS si no existe
            if (!document.querySelector('#ripple-style')) {
                const style = document.createElement('style');
                style.id = 'ripple-style';
                style.textContent = `
                    @keyframes ripple {
                        0% { transform: scale(0); opacity: 1; }
                        100% { transform: scale(4); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Asegurar posición relativa
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            
            this.appendChild(ripple);
            
            // Remover el elemento después de la animación
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
        
        // Efecto de partículas al hover (opcional)
        errorButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        errorButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
}

// Función para logging de errores 404 (opcional)
function log404Error() {
    // Solo en producción y si hay analytics configurado
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: '404 Error',
            page_location: window.location.href,
            custom_parameter: '404_error'
        });
    }
    
    // Log en consola para desarrollo
    console.log('📍 404 Error - Página no encontrada:', window.location.href);
    console.log('🔗 Referrer:', document.referrer || 'Directo');
}

// Función para sugerir páginas alternativas basadas en la URL
function suggestAlternativePages() {
    const currentPath = window.location.pathname.toLowerCase();
    const suggestions = {
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
    };
    
    // Buscar coincidencias en la URL
    for (const [keyword, page] of Object.entries(suggestions)) {
        if (currentPath.includes(keyword)) {
            console.log(`💡 Sugerencia: ¿Buscabas ${page}?`);
            
            // Opcional: mostrar sugerencia en la página
            const errorMessage = document.querySelector('.error-message');
            if (errorMessage) {
                const suggestion = document.createElement('p');
                suggestion.style.cssText = `
                    margin-top: 1rem;
                    font-size: 0.9rem;
                    color: var(--azul-oscuro);
                    font-style: normal;
                `;
                suggestion.innerHTML = `¿Tal vez buscabas <a href="${page}" style="color: var(--azul-principal); text-decoration: underline;">${page.replace('.html', '')}?</a>`;
                errorMessage.appendChild(suggestion);
            }
            break;
        }
    }
}

// Función para mejorar la experiencia de búsqueda
function enhanceSearchExperience() {
    // Precargar páginas principales para navegación más rápida
    const mainPages = ['index.html', 'nosotros.html', 'fundador.html', 'servicios.html', 'testimonios.html', 'contacto.html'];
    
    mainPages.forEach(page => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        document.head.appendChild(link);
    });
}

// Inicialización específica de la página 404
document.addEventListener('DOMContentLoaded', function() {
    console.log('404 Page with Glitch Effects initialized - JMC Preuniversitario');
    
    // Inicializar animaciones PRIMERO
    init404Animations();
    
    // Ajustar animaciones según el dispositivo
    adjustAnimationsByDevice();
    
    // Configurar control de visibilidad
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Reajustar animaciones en resize
    window.addEventListener('resize', debounce(() => {
        adjustAnimationsByDevice();
    }, 250));
    
    // Luego inicializar otras funcionalidades
    setTimeout(() => {
        enhance404Button();
        log404Error();
        suggestAlternativePages();
        enhanceSearchExperience();
    }, 500);
    
    // Performance: Reducir animaciones si el usuario prefiere movimiento reducido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const allAnimatedElements = document.querySelectorAll('.line, .crazy-text, .glitch');
        allAnimatedElements.forEach(element => {
            if (element.classList.contains('line')) {
                element.style.animationDuration = '8s, 1000ms';
                element.style.animationIterationCount = '3';
            } else if (element.classList.contains('glitch')) {
                element.style.animationDuration = '10s';
                element.style.animationIterationCount = '2';
            } else {
                element.style.animationDuration = '6s';
                element.style.animationIterationCount = '2';
            }
        });
    }
});

// Mejorar la navegación desde la página 404
window.addEventListener('popstate', function() {
    // Si el usuario usa el botón de retroceso, redirigir a inicio
    if (window.location.pathname === '/404.html' || window.location.pathname.includes('404')) {
        window.location.href = 'index.html';
    }
});