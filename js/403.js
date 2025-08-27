/* ======================================
   403.JS - FUNCIONALIDADES ESPECÍFICAS DE LA PÁGINA 403
   ====================================== */

// Función para inicializar la página 403
function init403Page() {
    // El card ya es visible por defecto, no necesitamos animaciones de entrada
    console.log('403 Page initialized - Content immediately visible');
}

// Función para controlar la intensidad de las animaciones según el dispositivo
function adjust403AnimationsByDevice() {
    const isMobile = window.innerWidth <= 848; // 53rem
    const isSmallMobile = window.innerWidth <= 360;

    const lockIcon = document.querySelector('.lock-icon .material-symbols-rounded');
    const errorCode = document.querySelector('.error-code');

    if (isSmallMobile) {
        // Animaciones más suaves en pantallas muy pequeñas
        if (lockIcon) {
            lockIcon.style.animationDuration = '4s';
        }
        if (errorCode) {
            errorCode.style.animationDuration = '5s';
        }
    } else if (isMobile) {
        // Animaciones intermedias en mobile
        if (lockIcon) {
            lockIcon.style.animationDuration = '3.5s';
        }
        if (errorCode) {
            errorCode.style.animationDuration = '4.5s';
        }
    }
    // Desktop mantiene las animaciones originales
}

// Función para pausar/reanudar animaciones cuando el usuario no está activo
function handle403VisibilityChange() {
    const lockIcon = document.querySelector('.lock-icon .material-symbols-rounded');
    const errorCode = document.querySelector('.error-code');

    if (document.hidden) {
        // Pausar animaciones cuando la página no es visible
        if (lockIcon) {
            lockIcon.style.animationPlayState = 'paused';
        }
        if (errorCode) {
            errorCode.style.animationPlayState = 'paused';
        }
    } else {
        // Reanudar animaciones cuando la página vuelve a ser visible
        setTimeout(() => {
            if (lockIcon) {
                lockIcon.style.animationPlayState = 'running';
            }
            if (errorCode) {
                errorCode.style.animationPlayState = 'running';
            }
        }, 500);
    }
}

// Función para logging de errores 403 (opcional)
function log403Error() {
    // Solo en producción y si hay analytics configurado
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: '403 Forbidden',
            page_location: window.location.href,
            custom_parameter: '403_error'
        });
    }

    // Log en consola para desarrollo
    console.log('🔒 403 Error - Acceso denegado:', window.location.href);
    console.log('🔗 Referrer:', document.referrer || 'Directo');
}

// Inicialización específica de la página 403
document.addEventListener('DOMContentLoaded', function () {
    console.log('403 Page with Lock Effects initialized - JMC Preuniversitario');

    // Inicializar página
    init403Page();

    // Ajustar animaciones según el dispositivo
    adjust403AnimationsByDevice();

    // Configurar control de visibilidad
    document.addEventListener('visibilitychange', handle403VisibilityChange);

    // Reajustar animaciones en resize
    window.addEventListener('resize', debounce(() => {
        adjust403AnimationsByDevice();
    }, 250));

    // Luego inicializar otras funcionalidades
    setTimeout(() => {
        log403Error();
    }, 500);

    // Performance: Reducir animaciones si el usuario prefiere movimiento reducido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const lockIcon = document.querySelector('.lock-icon .material-symbols-rounded');
        const errorCode = document.querySelector('.error-code');
        
        if (lockIcon) {
            lockIcon.style.animationDuration = '5s';
            lockIcon.style.animationIterationCount = '3';
        }
        if (errorCode) {
            errorCode.style.animationDuration = '6s';
            errorCode.style.animationIterationCount = '3';
        }
    }
});

// Mejorar la navegación desde la página 403
window.addEventListener('popstate', function () {
    // Si el usuario usa el botón de retroceso, redirigir a inicio
    if (window.location.pathname === '/403.html' || window.location.pathname.includes('403')) {
        window.location.href = '/';
    }
});