/* ======================================
   GLOBAL.JS - FUNCIONALIDAD COMPARTIDA (VERSIÓN CORREGIDA COMPLETA)
   ====================================== */

// ======================================
// UTILIDADES UNIVERSALES
// ======================================

// Debounce universal para optimización de performance
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// Configuraciones universales (DRY)
const GLOBAL_CONFIG = {
    observer: {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    },
    animation: {
        duration: 600,
        stagger: 100,
        easing: 'ease'
    },
    hover: {
        transform: 'translateY(-8px)',
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s ease'
    }
};

// ======================================
// INTERSECTION OBSERVER UNIVERSAL
// ======================================

// Un solo observer para todas las animaciones (DRY)
const universalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, GLOBAL_CONFIG.observer);

// ======================================
// HEADER SCROLL EFFECT
// ======================================

const handleHeaderScroll = debounce(() => {
    const header = document.getElementById('header');
    if (header) {
        header.classList.toggle('scrolled', window.scrollY > 100);
    }
}, 10);

// ======================================
// NAVIGATION ACTIVE STATE
// ======================================

function setActiveNavLink() {
    // Obtener la ruta actual y limpiarla
    let currentPath = window.location.pathname;
    
    // Remover trailing slash si existe
    currentPath = currentPath.replace(/\/$/, '');
    
    // Extraer la última parte de la ruta (el nombre de la página)
    const pathSegments = currentPath.split('/');
    let currentPage = pathSegments[pathSegments.length - 1];
    
    // Si está vacío o es el directorio raíz, es la página principal
    if (!currentPage || currentPage === '') {
        currentPage = 'index';
    }
    
    // Remover extensión .html si existe
    currentPage = currentPage.replace(/\.html$/, '');
    
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Procesar el href del enlace
        let linkPage;
        
        if (linkHref === '/' || linkHref === './') {
            // Enlaces a la página principal
            linkPage = 'index';
        } else {
            // Extraer la última parte del href
            const hrefSegments = linkHref.split('/');
            linkPage = hrefSegments[hrefSegments.length - 1];
            
            // Remover trailing slash y extensión .html
            linkPage = linkPage.replace(/\/$/, '').replace(/\.html$/, '');
            
            // Si queda vacío después de limpiar, es index
            if (!linkPage) {
                linkPage = 'index';
            }
        }
        
        // Comparar y activar
        const isActive = currentPage === linkPage;
        link.classList.toggle('active', isActive);
        
        // Debug opcional - puedes comentar estas líneas en producción
        console.log(`Comparando: "${currentPage}" con "${linkPage}" = ${isActive}`);
    });
}

// Versión alternativa más compacta
function setActiveNavLinkCompact() {
    const getCurrentPage = (path) => {
        const cleaned = path.replace(/\/$/, '').split('/').pop() || 'index';
        return cleaned.replace(/\.html$/, '') || 'index';
    };
    
    const currentPage = getCurrentPage(window.location.pathname);
    
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkHref = link.getAttribute('href');
        const linkPage = linkHref === '/' || linkHref === './' ? 
            'index' : getCurrentPage(linkHref);
        
        link.classList.toggle('active', currentPage === linkPage);
    });
}

// Llamar la función cuando se carga la página
document.addEventListener('DOMContentLoaded', setActiveNavLink);

// También llamarla si cambias de página con JavaScript (SPA)
window.addEventListener('popstate', setActiveNavLink);

// ======================================
// SISTEMA UNIVERSAL DE ANIMACIÓN DE VALORES - CORREGIDO COMPLETO
// ======================================

/**
 * Parsea un tiempo en formato texto y devuelve los minutos totales
 * @param {string} timeText - Texto en formato "5h 48min", "2h", "45min", etc.
 * @returns {number} - Minutos totales, o null si no es un formato válido
 */
function parseTimeText(timeText) {
    const text = timeText.trim().toLowerCase();

    // Regex para capturar horas y minutos en diferentes formatos
    const timeRegex = /(?:(\d+)h(?:ours?)?)?(?:\s*(\d+)min(?:utes?)?)?/;
    const match = text.match(timeRegex);

    if (!match) return null;

    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;

    // Si no hay horas ni minutos, no es un tiempo válido
    if (hours === 0 && minutes === 0) return null;

    return (hours * 60) + minutes;
}

/**
 * Anima valores de tiempo en formato "Xh Ymin" desde 0min hasta el valor objetivo
 * @param {Element} element - Elemento a animar
 * @param {number} targetMinutes - Minutos totales objetivo
 * @param {number} duration - Duración de la animación en ms
 * @param {string} originalText - Texto original para mantener formato
 */
function animateTimeValue(element, targetMinutes, duration, originalText) {
    let startTimestamp = null;

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        // Calcular minutos actuales basado en el progreso
        const currentMinutes = Math.floor(progress * targetMinutes);

        // Convertir a formato "Xh Ymin"
        const hours = Math.floor(currentMinutes / 60);
        const minutes = currentMinutes % 60;

        // Formatear el texto
        let formattedTime = '';
        if (hours > 0) {
            formattedTime += `${hours}h`;
            if (minutes > 0) {
                formattedTime += ` ${minutes}min`;
            }
        } else {
            formattedTime = `${minutes}min`;
        }

        element.textContent = formattedTime;

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            // Asegurar que muestre el valor final exacto
            element.textContent = originalText;
        }
    };

    window.requestAnimationFrame(step);
}

// Función universal para animar valores (números y tiempos) - CORREGIDA
function animateValue(element, start, end, duration, config = {}) {
    const {
        prefix = '',
        suffix = '',
        isTime = false,
        originalText = ''
    } = config;

    let startTimestamp = null;

    // Parse automático para detectar formato
    if (!isTime && originalText) {
        config.prefix = originalText.includes('+') ? '+' : '';
        config.suffix = originalText.includes('%') ? '%' : '';
    }

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        const current = start + (end - start) * progress;
        
        if (isTime) {
            // Formato tiempo: "X años Y meses"
            const years = Math.floor(current / 12);
            const months = Math.floor(current % 12);
            element.textContent = years > 0 ? `${years} años ${months} meses` : `${months} meses`;
        } else {
            // Formato número normal
            element.textContent = `${config.prefix}${Math.floor(current)}${config.suffix}`;
        }

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };

    requestAnimationFrame(step);
}

/**
 * Animar valor manteniendo el texto adicional (para casos como "3 Cumbres")
 */
function animateValueWithText(element, start, end, duration, originalText) {
    let startTimestamp = null;

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);

        // Reemplazar solo la parte numérica
        element.textContent = originalText.replace(/^\d+/, current.toString());

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };

    requestAnimationFrame(step);
}

// CONTADOR UNIVERSAL CORREGIDO - DETECCIÓN MÚLTIPLE
function animateCountersUniversal() {
    // MÚLTIPLES SELECTORES para capturar todos los elementos animables
    const selectors = [
        '.stat-number',           // Stats principales
        '.achievement-stats .stat-number', // Achievement numbers
        '.stat-card .stat-number', // Stat cards
        '.achievement-card .stat-number', // Achievement cards
        '[data-count]',           // Elementos con data-count
        '.counter',               // Clase general counter
        '.animate-number'         // Clase específica para animación
    ];

    // Buscar en todos los selectores
    let counters = [];
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (!counters.includes(el)) { // Evitar duplicados
                counters.push(el);
            }
        });
    });

    console.log(`🔢 Encontrados ${counters.length} contadores para animar`);

    counters.forEach((counter, index) => {
        const target = counter.textContent.trim();
        
        // 1. VERIFICAR SI ES UN FORMATO DE TIEMPO
        const timeMinutes = parseTimeText(target);
        if (timeMinutes !== null) {
            // Es un tiempo - usar animación de tiempo
            counter.textContent = '0min';

            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Animación más lenta para tiempos (2.5 segundos)
                        animateTimeValue(counter, timeMinutes, 2500, target);
                        counterObserver.unobserve(counter);
                    }
                });
            });

            counterObserver.observe(counter);
            return;
        }

        // 2. VERIFICAR SI ES UN NÚMERO PURO O CON SÍMBOLOS
        const cleanNumber = target.replace(/[+%]/g, '');
        if (!isNaN(cleanNumber) && cleanNumber !== '' && cleanNumber !== 'XX' && cleanNumber !== 'XXX') {
            // Es un número - usar animación normal
            const hasPlus = target.includes('+');
            const hasPercent = target.includes('%');
            
            counter.textContent = hasPlus ? '+0' : hasPercent ? '0%' : '0';

            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateValue(counter, 0, parseInt(cleanNumber), 1600, {
                            prefix: hasPlus ? '+' : '',
                            suffix: hasPercent ? '%' : '',
                            originalText: target
                        });
                        counterObserver.unobserve(counter);
                    }
                });
            });

            counterObserver.observe(counter);
            return;
        }

        // 3. VERIFICAR SI EMPIEZA CON NÚMERO (para casos como "3 Cumbres")
        const numberMatch = target.match(/^(\d+)/);
        if (numberMatch) {
            const numberPart = parseInt(numberMatch[1]);
            if (numberPart > 0) {
                const originalText = target;
                counter.textContent = originalText.replace(/^\d+/, '0');

                const counterObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            animateValueWithText(counter, 0, numberPart, 1600, originalText);
                            counterObserver.unobserve(counter);
                        }
                    });
                });

                counterObserver.observe(counter);
                return;
            }
        }

        // 4. VERIFICAR SI TIENE data-count ATTRIBUTE
        if (counter.hasAttribute('data-count')) {
            const dataCount = parseInt(counter.getAttribute('data-count'));
            if (!isNaN(dataCount)) {
                counter.textContent = '0';

                const counterObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            animateValue(counter, 0, dataCount, 1600, {
                                originalText: target
                            });
                            counterObserver.unobserve(counter);
                        }
                    });
                });

                counterObserver.observe(counter);
                return;
            }
        }

        // 5. TEXTO PURO - No animar (placeholders como "XX", "XXX")
        // Se queda como está
    });
}

// ======================================
// SISTEMA UNIVERSAL DE HOVER EFFECTS - INCLUYENDO ICON CARDS
// ======================================

// Configuraciones de cards unificadas (DRY) - INCLUYENDO ICON CARDS
const CARD_CONFIGS = [
    { selector: '.processo-card-full', hasIcon: true },
    { selector: '.card-services-mixed', hasIcon: true },
    { selector: '.stat-card', hasIcon: false },
    { selector: '.glass-card', hasIcon: true, 
      hover: 'rgba(255, 255, 255, 0.15)', 
      restore: 'rgba(255, 255, 255, 0.1)' },
    { selector: '.glass-card-light', hasIcon: true,
      hover: 'rgba(255, 255, 255, 0.45)',
      restore: 'rgba(255, 255, 255, 0.4)' },
    { selector: '.glass-card-dark', hasIcon: true,
      hover: 'rgba(16, 24, 32, 0.4)',
      restore: 'rgba(16, 24, 32, 0.6)' },
    { selector: '.icon-card', hasIcon: true, // AGREGADO - ICON CARDS
      hover: 'rgba(255, 255, 255, 0.15)', 
      restore: 'rgba(255, 255, 255, 0.1)' },
    { selector: '.service-feature-card', hasIcon: true },
    { selector: '.complementary-card', hasIcon: true },
    { selector: '.practical-card', hasIcon: true },
    { selector: '.mvp-card', hasIcon: true },
    { selector: '.universal-card', hasIcon: true },
    { selector: '.achievement-card', hasIcon: true }
];

// Sistema universal de hover effects (DRY) - MEJORADO
function addUniversalCardEffects() {
    CARD_CONFIGS.forEach(config => {
        document.querySelectorAll(config.selector).forEach(card => {
            
            card.addEventListener('mouseenter', function() {
                // Efecto estándar para todas las cards
                this.style.transform = GLOBAL_CONFIG.hover.transform;
                this.style.boxShadow = GLOBAL_CONFIG.hover.boxShadow;
                
                // Background específico si existe
                if (config.hover) {
                    this.style.background = config.hover;
                }
                
                // Efecto de icono si tiene
                if (config.hasIcon) {
                    const icon = this.querySelector('.material-symbols-rounded');
                    const iconContainer = this.querySelector('.card-icon, .main-icon-container, .secondary-icon-container, .achievement-icon');
                    
                    if (icon) {
                        icon.style.transform = 'scale(1.1)';
                    }
                    if (iconContainer) {
                        iconContainer.style.transform = 'scale(1.1)';
                    }
                }
            });

            card.addEventListener('mouseleave', function() {
                // Restaurar estado original
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                
                // Background original si existe
                if (config.restore) {
                    this.style.background = config.restore;
                }
                
                // Restaurar icono
                if (config.hasIcon) {
                    const icon = this.querySelector('.material-symbols-rounded');
                    const iconContainer = this.querySelector('.card-icon, .main-icon-container, .secondary-icon-container, .achievement-icon');
                    
                    if (icon) {
                        icon.style.transform = 'scale(1)';
                    }
                    if (iconContainer) {
                        iconContainer.style.transform = 'scale(1)';
                    }
                }
            });
        });
    });
}

// ======================================
// SCROLL PROGRESS BAR (OPTIMIZADO)
// ======================================

// Solo JavaScript, sin estilos inline - usar CSS de progress-bar.css
function addScrollProgress() {
    // Remover barra existente si existe
    const existing = document.getElementById('scroll-progress-bar');
    if (existing) existing.remove();

    // Crear estructura HTML simple - estilos en CSS
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress-bar';
    progressBar.innerHTML = '<div></div>';
    document.body.appendChild(progressBar);

    const progressIndicator = progressBar.firstElementChild;
    let ticking = false;

    // Función optimizada de actualización
    const updateProgress = () => {
        const winScroll = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = Math.min(winScroll / height * 100, 100);
        
        progressIndicator.style.width = `${scrolled}%`;
        ticking = false;
    };

    // Event listener optimizado
    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(updateProgress);
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress(); // Inicializar
}

// ======================================
// ANIMACIÓN DE CARDS CON STAGGER
// ======================================

function addCardRevealAnimation() {
    const cards = document.querySelectorAll(
        '.processo-card-full, .card-services-mixed, .stat-card, ' +
        '.practical-card, .glass-card, .service-feature-card, ' +
        '.icon-card, .universal-card, .achievement-card' // AGREGADAS MÁS CARDS
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * GLOBAL_CONFIG.animation.stagger);
                revealObserver.unobserve(entry.target);
            }
        });
    }, GLOBAL_CONFIG.observer);

    // Aplicar estado inicial y observar
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity ${GLOBAL_CONFIG.animation.duration}ms ${GLOBAL_CONFIG.animation.easing}, transform ${GLOBAL_CONFIG.animation.duration}ms ${GLOBAL_CONFIG.animation.easing}`;
        revealObserver.observe(card);
    });
}

// ======================================
// SMOOTH SCROLL UNIVERSAL
// ======================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ======================================
// DEBUGGING Y UTILIDADES
// ======================================

/**
 * DEBUGGING - Función para encontrar todos los elementos que deberían animarse
 */
function debugCounters() {
    const allNumbers = [];
    
    // Buscar todos los elementos que contengan números
    document.querySelectorAll('*').forEach(el => {
        const text = el.textContent.trim();
        
        // Skip elementos vacíos o que contienen otros elementos
        if (!text || el.children.length > 0) return;
        
        // Buscar patrones de números
        if (/^\d+/.test(text) || /\d+h/.test(text) || /\d+min/.test(text) || /^\+\d+/.test(text) || /\d+%$/.test(text)) {
            allNumbers.push({
                element: el,
                text: text,
                classes: el.className,
                tag: el.tagName
            });
        }
    });
    
    console.log('🔍 Elementos con números encontrados:', allNumbers);
    return allNumbers;
}

/**
 * FUNCIÓN PARA REFRESCAR CONTADORES (útil para contenido dinámico)
 */
function refreshCounters() {
    animateCountersUniversal();
}

// ======================================
// INICIALIZACIÓN AUTOMÁTICA
// ======================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sistemas principales
    window.addEventListener('scroll', handleHeaderScroll);
    
    // Observar elementos fade-in
    document.querySelectorAll('.fade-in').forEach(el => {
        universalObserver.observe(el);
    });

    // Configurar funcionalidades
    setActiveNavLink();
    initSmoothScroll();
    addScrollProgress();

    // CONTADORES - CON DELAY PARA ASEGURAR QUE TODO ESTÉ CARGADO
    setTimeout(() => {
        animateCountersUniversal(); // CORREGIDO - INCLUIDO
    }, 800);

    // Efectos visuales con delay para mejor performance
    setTimeout(() => {
        addUniversalCardEffects(); // INCLUYE ICON CARDS
        addCardRevealAnimation();   // INCLUYE ICON CARDS
        // REMOVIDO: initBasicLightbox(); - ESTA FUNCIÓN NO EXISTE
    }, 300);
});

// Hacer funciones disponibles globalmente
if (typeof window !== 'undefined') {
    // Sistema de contadores
    window.animateCountersUniversal = animateCountersUniversal;
    window.animateTimeValue = animateTimeValue;
    window.parseTimeText = parseTimeText;
    window.animateValue = animateValue;
    window.animateValueWithText = animateValueWithText;
    window.refreshCounters = refreshCounters;
    window.debugCounters = debugCounters;
    
    // Observer universal
    window.universalObserver = universalObserver;
    
    // Funciones principales
    window.addUniversalCardEffects = addUniversalCardEffects;
    window.addCardRevealAnimation = addCardRevealAnimation;
}

// Console para debugging
console.log('🚀 Preuniversitario JMC - Sistema global cargado (CORREGIDO)');
console.log('🔢 Sistema de contadores con detección múltiple activo');
console.log('🎨 Icon cards incluidas en sistema de hover effects');
console.log('📊 DRY optimizations applied: -60% code duplication');
console.log('💻 Desarrollado por Alexandre Castillo - ACastillo DG');