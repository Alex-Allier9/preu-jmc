/* ======================================
   404.JS - FUNCIONALIDADES ESPECÍFICAS DE LA PÁGINA 404
   ====================================== */

/* ======================================
   404.JS - FUNCIONALIDADES ESPECÍFICAS DE LA PÁGINA 404
   ====================================== */

// Nota: La función debounce se usa desde global.js

// Función para inicializar las animaciones fade-in de contenedores
function init404Animations() {
    // Activar fade-in secuencial en contenedores
    setTimeout(() => {
        const glitchContainer = document.querySelector('.glitch-container');
        if (glitchContainer) {
            glitchContainer.classList.add('visible');
        }
    }, 100);

    setTimeout(() => {
        const messageContainer = document.querySelector('.message-container');
        if (messageContainer) {
            messageContainer.classList.add('visible');
        }
    }, 400);

    setTimeout(() => {
        const buttonContainer = document.querySelector('.button-container');
        if (buttonContainer) {
            buttonContainer.classList.add('visible');
        }
    }, 700);
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
        errorButton.addEventListener('click', function (e) {
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
        errorButton.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });

        errorButton.addEventListener('mouseleave', function () {
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

// Inicialización específica de la página 404
document.addEventListener('DOMContentLoaded', function () {
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
window.addEventListener('popstate', function () {
    // Si el usuario usa el botón de retroceso, redirigir a inicio
    if (window.location.pathname === '/404.html' || window.location.pathname.includes('404')) {
        window.location.href = 'index.html';
    }
});