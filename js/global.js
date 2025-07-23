/* ======================================
   GLOBAL.JS - SISTEMA UNIVERSAL REDISEÑADO
   Elimina TODA la duplicación funcional
   ====================================== */

/* ======================================
   UTILITARIOS UNIVERSALES
   ====================================== */

// Debounce universal - Una sola implementación para todo el proyecto
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

// Throttle universal para scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Utility para crear elementos DOM
function createElement(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.innerHTML = content;
    return element;
}

/* ======================================
   HEADER Y NAVEGACIÓN UNIVERSAL
   ====================================== */

// Header scroll effect optimizado con throttle
const throttledScrollHandler = throttle(() => {
    const header = document.getElementById('header');
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}, 16); // ~60fps

// Navigation active state universal
function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
}

/* ======================================
   SISTEMA DE ANIMACIONES UNIVERSAL
   ====================================== */

// Intersection Observer universal para todos los elementos animados
const createUniversalObserver = (options = {}) => {
    const defaultOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        ...options
    };
    
    return new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Auto-unobserve después de animación
                if (!entry.target.hasAttribute('data-keep-observing')) {
                    entry.target.observer?.unobserve(entry.target);
                }
            }
        });
    }, defaultOptions);
};

// Sistema de animaciones fade-in universal
function initUniversalAnimations() {
    const observer = createUniversalObserver();
    
    // Observar TODOS los elementos con fade-in
    document.querySelectorAll('.fade-in').forEach(el => {
        el.observer = observer;
        observer.observe(el);
    });
    
    console.log('✅ Universal animations initialized');
}

// Animaciones escalonadas universales para contenedores
function initStaggeredAnimations() {
    const observer = createUniversalObserver();
    
    // Detectar automáticamente contenedores con elementos animables
    const containers = document.querySelectorAll('[data-stagger], .grid, .cards-container');
    
    containers.forEach(container => {
        const children = container.querySelectorAll('.fade-in, .card, [data-animate]');
        
        observer.observe(container);
        container.addEventListener('animationstart', () => {
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0) scale(1)';
                }, index * 100);
            });
        });
    });
}

/* ======================================
   SISTEMA DE CONTADORES UNIVERSAL
   ====================================== */

// Función universal para animar valores numéricos
function animateValue(element, start, end, duration, options = {}) {
    const { prefix = '', suffix = '', decimals = 0 } = options;
    let startTimestamp = null;
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = start + (progress * (end - start));
        
        element.textContent = prefix + current.toFixed(decimals) + suffix;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

// Sistema de contadores automático universal
function initUniversalCounters() {
    const observer = createUniversalObserver();
    
    // Detectar automáticamente elementos con números
    document.querySelectorAll('[data-count], .stat-number, .counter').forEach(element => {
        const targetText = element.textContent.trim();
        const hasPlus = targetText.includes('+');
        const hasPercent = targetText.includes('%');
        const targetNumber = parseInt(targetText.replace(/[^\d]/g, ''));
        
        if (!isNaN(targetNumber)) {
            element.textContent = '0';
            
            observer.observe(element);
            element.addEventListener('visible', () => {
                animateValue(element, 0, targetNumber, 1600, {
                    prefix: hasPlus ? '+' : '',
                    suffix: hasPercent ? '%' : (hasPlus ? '+' : '')
                });
            });
        }
    });
    
    console.log('✅ Universal counters initialized');
}

/* ======================================
   SISTEMA DE CARDS UNIVERSAL - REDISEÑADO COMPLETO
   ====================================== */

// Detección automática de tipos de card
function detectCardType(card) {
    const hasIcon = card.querySelector('.material-symbols-rounded, .icon, [class*="icon"]');
    const hasGlass = card.classList.contains('glassmorphism') || 
                    getComputedStyle(card).backdropFilter !== 'none';
    const hasBorder = card.classList.contains('bordered') || 
                     getComputedStyle(card).borderImageSource !== 'none';
    
    return { hasIcon, hasGlass, hasBorder };
}

// Sistema de hover universal que funciona automáticamente
function applyUniversalHoverEffect(card) {
    const { hasIcon, hasGlass } = detectCardType(card);
    
    card.addEventListener('mouseenter', function() {
        // Efecto base para TODAS las cards
        this.style.transform = 'translateY(-8px)';
        this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
        
        // Efecto específico para glassmorphism
        if (hasGlass) {
            this.style.background = 'rgba(255, 255, 255, 0.15)';
        } else {
            this.style.background = 'rgba(255, 255, 255, 0.95)';
        }
        
        // Efecto de iconos automático
        if (hasIcon) {
            const icons = this.querySelectorAll('.material-symbols-rounded, .icon, [class*="icon"]');
            const containers = this.querySelectorAll('[class*="icon-container"], [class*="-icon"]');
            
            icons.forEach(icon => {
                icon.style.transform = 'scale(1.1)';
                icon.style.transition = 'all 0.3s ease';
            });
            
            containers.forEach(container => {
                if (container !== this) { // Evitar aplicar al card mismo
                    container.style.transform = 'scale(1.1)';
                    container.style.transition = 'all 0.3s ease';
                }
            });
        }
        
        // Trigger evento personalizado
        this.dispatchEvent(new CustomEvent('cardHover', { detail: { state: 'enter' } }));
    });
    
    card.addEventListener('mouseleave', function() {
        // Restaurar efecto base
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        
        // Restaurar background
        if (hasGlass) {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        } else {
            this.style.background = 'rgba(255, 255, 255, 0.9)';
        }
        
        // Restaurar iconos
        if (hasIcon) {
            const icons = this.querySelectorAll('.material-symbols-rounded, .icon, [class*="icon"]');
            const containers = this.querySelectorAll('[class*="icon-container"], [class*="-icon"]');
            
            icons.forEach(icon => {
                icon.style.transform = 'scale(1)';
            });
            
            containers.forEach(container => {
                if (container !== this) {
                    container.style.transform = 'scale(1)';
                }
            });
        }
        
        // Trigger evento personalizado
        this.dispatchEvent(new CustomEvent('cardHover', { detail: { state: 'leave' } }));
    });
}

// Sistema de cards universal que detecta TODO automáticamente
function initUniversalCardSystem() {
    // Selectores universales - detecta CUALQUIER elemento que parezca una card
    const cardSelectors = [
        '.card', // Nuevo sistema universal
        '[class*="-card"]', // Cualquier clase que termine en -card
        '[data-card]', // Elementos marcados como card
        '.quote-card', // Específicos que mantienen compatibilidad
        '.proceso-card-full'
    ];
    
    const allCards = document.querySelectorAll(cardSelectors.join(', '));
    
    allCards.forEach(card => {
        // Aplicar efectos hover universales
        applyUniversalHoverEffect(card);
        
        // Aplicar ripple effect automático
        card.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
        
        // Marcar como procesada para evitar duplicación
        card.setAttribute('data-universal-card', 'true');
    });
    
    console.log(`✅ Universal card system initialized for ${allCards.length} cards`);
}

/* ======================================
   SISTEMA DE RIPPLES UNIVERSAL
   ====================================== */

// Crear efecto ripple universal
function createRippleEffect(event, element) {
    // Crear CSS si no existe
    if (!document.querySelector('#ripple-styles')) {
        const style = createElement('style', null, `
            @keyframes ripple-expand {
                0% { transform: scale(0); opacity: 1; }
                100% { transform: scale(4); opacity: 0; }
            }
            .ripple-effect {
                position: absolute;
                border-radius: 50%;
                background: rgba(65, 182, 230, 0.3);
                pointer-events: none;
                z-index: 1000;
                animation: ripple-expand 0.6s ease-out;
            }
        `);
        style.id = 'ripple-styles';
        document.head.appendChild(style);
    }
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = createElement('div', 'ripple-effect');
    
    ripple.style.cssText += `
        width: ${size}px;
        height: ${size}px;
        left: ${event.clientX - rect.left - size/2}px;
        top: ${event.clientY - rect.top - size/2}px;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Inicializar ripples automáticamente
function initUniversalRipples() {
    // Detectar automáticamente elementos clickeables
    const rippleElements = document.querySelectorAll(`
        .btn, [class*="button"], [class*="-button"], 
        .card, [class*="-card"], 
        .nav-link, 
        [data-ripple],
        a[href]:not([href^="#"]),
        button:not([disabled])
    `);
    
    rippleElements.forEach(element => {
        // Evitar duplicados
        if (!element.hasAttribute('data-ripple-initialized')) {
            element.addEventListener('click', function(e) {
                createRippleEffect(e, this);
            });
            element.setAttribute('data-ripple-initialized', 'true');
        }
    });
    
    console.log(`✅ Universal ripples initialized for ${rippleElements.length} elements`);
}

/* ======================================
   SISTEMA DE LOADING STATES UNIVERSAL
   ====================================== */

// Crear estilos de loading si no existen
function ensureLoadingStyles() {
    if (!document.querySelector('#loading-styles')) {
        const style = createElement('style', null, `
            .loading-overlay {
                position: relative;
                overflow: hidden;
                pointer-events: none;
            }
            
            .loading-overlay::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(255, 255, 255, 0.4),
                    transparent
                );
                animation: shimmer 2s infinite;
                z-index: 1000;
            }
            
            @keyframes shimmer {
                100% { left: 100%; }
            }
            
            .skeleton-text {
                background: linear-gradient(
                    90deg,
                    rgba(255, 255, 255, 0.1) 25%,
                    rgba(255, 255, 255, 0.2) 50%,
                    rgba(255, 255, 255, 0.1) 75%
                );
                background-size: 200% 100%;
                animation: skeleton-pulse 1.5s infinite;
                border-radius: 4px;
                height: 1rem;
                margin-bottom: 0.5rem;
            }
            
            @keyframes skeleton-pulse {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `);
        style.id = 'loading-styles';
        document.head.appendChild(style);
    }
}

// API universal para loading states
const LoadingSystem = {
    show: (element) => {
        element.classList.add('loading-overlay');
        element.setAttribute('data-loading', 'true');
    },
    
    hide: (element) => {
        element.classList.remove('loading-overlay');
        element.removeAttribute('data-loading');
    },
    
    createSkeleton: (container, lines = 3) => {
        container.innerHTML = '';
        for (let i = 0; i < lines; i++) {
            const skeleton = createElement('div', 'skeleton-text');
            skeleton.style.width = `${Math.random() * 40 + 60}%`;
            container.appendChild(skeleton);
        }
    }
};

/* ======================================
   SISTEMA DE SCROLL PROGRESS UNIVERSAL
   ====================================== */

function initScrollProgress() {
    // Limpiar barra existente
    const existing = document.getElementById('scroll-progress-bar');
    if (existing) existing.remove();
    
    // Crear nueva barra
    const progressBar = createElement('div');
    progressBar.id = 'scroll-progress-bar';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 6px;
        background: transparent;
        z-index: 9999;
        pointer-events: none;
    `;
    
    const progressIndicator = createElement('div');
    progressIndicator.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, var(--azul-principal), var(--amarillo));
        transform-origin: left center;
        transform: scaleX(0);
        transition: transform 0.1s linear;
        box-shadow: 0 2px 4px rgba(65, 182, 230, 0.3);
    `;
    
    progressBar.appendChild(progressIndicator);
    document.body.appendChild(progressBar);
    
    // Handler optimizado con throttle
    const updateProgress = throttle(() => {
        const winScroll = window.scrollY || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = Math.min(winScroll / height, 1);
        
        progressIndicator.style.transform = `scaleX(${scrolled})`;
    }, 16);
    
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress(); // Initial call
    
    console.log('✅ Scroll progress initialized');
}

/* ======================================
   SISTEMA DE SMOOTH SCROLL UNIVERSAL
   ====================================== */

function initUniversalSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
    
    console.log('✅ Universal smooth scroll initialized');
}

/* ======================================
   SISTEMA DE GRIDS RESPONSIVE UNIVERSAL
   ====================================== */

function initUniversalGridSystem() {
    // Auto-detectar grids y aplicar comportamiento responsive
    const grids = document.querySelectorAll('[class*="grid"], [class*="-grid"], .grid');
    
    grids.forEach(grid => {
        // Determinar número de columnas original
        const computedStyle = getComputedStyle(grid);
        const columns = computedStyle.gridTemplateColumns.split(' ').length;
        
        // Agregar clase universal para responsive
        if (!grid.classList.contains('grid')) {
            grid.classList.add('grid');
        }
        
        // Agregar clase de columnas
        if (columns >= 4) grid.classList.add('cols-4');
        else if (columns === 3) grid.classList.add('cols-3');
        else if (columns === 2) grid.classList.add('cols-2');
        
        // Marcar como procesado
        grid.setAttribute('data-universal-grid', 'true');
    });
    
    console.log(`✅ Universal grid system applied to ${grids.length} grids`);
}

/* ======================================
   SISTEMA DE EVENTOS PERSONALIZADOS
   ====================================== */

// Event system para comunicación entre componentes
const EventSystem = {
    emit: (element, eventName, data = {}) => {
        element.dispatchEvent(new CustomEvent(eventName, { detail: data }));
    },
    
    on: (element, eventName, callback) => {
        element.addEventListener(eventName, callback);
    },
    
    off: (element, eventName, callback) => {
        element.removeEventListener(eventName, callback);
    }
};

/* ======================================
   MUTATION OBSERVER PARA CONTENIDO DINÁMICO
   ====================================== */

function initDynamicContentObserver() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Re-inicializar sistemas para nuevos elementos
                    if (node.matches?.('.card, [class*="-card"]')) {
                        applyUniversalHoverEffect(node);
                    }
                    
                    if (node.matches?.('.fade-in')) {
                        const observer = createUniversalObserver();
                        observer.observe(node);
                    }
                    
                    // Ripples para nuevos elementos
                    if (node.matches?.('.btn, [class*="button"]')) {
                        node.addEventListener('click', function(e) {
                            createRippleEffect(e, this);
                        });
                    }
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('✅ Dynamic content observer initialized');
}

/* ======================================
   DETECCIÓN DE DISPOSITIVO Y PERFORMANCE
   ====================================== */

// Detectar capacidades del dispositivo
const DeviceCapabilities = {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    lowPowerMode: navigator.hardwareConcurrency < 4,
    isMobile: window.innerWidth <= 768,
    isTablet: window.innerWidth <= 1024 && window.innerWidth > 768,
    supportsBackdropFilter: CSS.supports('backdrop-filter', 'blur(10px)')
};

// Ajustar funcionalidades según el dispositivo
function optimizeForDevice() {
    if (DeviceCapabilities.reducedMotion) {
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        console.log('🔧 Reduced motion detected - animations minimized');
    }
    
    if (DeviceCapabilities.lowPowerMode) {
        // Reducir efectos pesados en dispositivos con pocos recursos
        document.documentElement.classList.add('low-power-mode');
        console.log('🔧 Low power device detected - effects optimized');
    }
    
    if (!DeviceCapabilities.supportsBackdropFilter) {
        // Fallback para navegadores sin soporte de backdrop-filter
        document.documentElement.classList.add('no-backdrop-filter');
        console.log('🔧 No backdrop-filter support - using fallbacks');
    }
}

/* ======================================
   INICIALIZACIÓN UNIVERSAL PRINCIPAL
   ====================================== */

// Función principal de inicialización
function initializeUniversalSystems() {
    console.log('🚀 Initializing Universal Systems - JMC Preuniversitario');
    
    // 1. Preparar entorno
    ensureLoadingStyles();
    optimizeForDevice();
    
    // 2. Sistemas básicos
    setActiveNavLink();
    initUniversalSmoothScroll();
    initScrollProgress();
    
    // 3. Sistemas de animación
    initUniversalAnimations();
    initStaggeredAnimations();
    initUniversalCounters();
    
    // 4. Sistemas de interacción
    initUniversalCardSystem();
    initUniversalRipples();
    initUniversalGridSystem();
    
    // 5. Sistemas de contenido dinámico
    initDynamicContentObserver();
    
    // 6. Event listeners globales
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    // 7. Resize handler universal
    window.addEventListener('resize', debounce(() => {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
        
        document.documentElement.classList.toggle('mobile', isMobile);
        document.documentElement.classList.toggle('tablet', isTablet);
        document.documentElement.classList.toggle('desktop', !isMobile && !isTablet);
        
        // Re-optimizar para el nuevo tamaño
        optimizeForDevice();
        
        console.log(`📱 Layout changed: ${isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}`);
    }, 250));
    
    console.log('✅ All Universal Systems initialized successfully');
    console.log('📊 Performance optimized for:', DeviceCapabilities);
}

// Auto-inicialización cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeUniversalSystems);
} else {
    initializeUniversalSystems();
}

/* ======================================
   API PÚBLICA PARA OTROS ARCHIVOS
   ====================================== */

// Exponer funciones útiles globalmente
window.JMC = {
    // Utilitarios
    debounce,
    throttle,
    createElement,
    
    // Sistemas
    LoadingSystem,
    EventSystem,
    DeviceCapabilities,
    
    // Funciones principales
    createRippleEffect,
    applyUniversalHoverEffect,
    
    // Para debugging
    reinitializeAll: initializeUniversalSystems
};

/* ======================================
   LOGGING Y DEBUGGING
   ====================================== */

console.log('🔧 Global JS Universal System loaded');
console.log('📚 Available via window.JMC:', Object.keys(window.JMC));
console.log('👨‍💻 Developed by Alexandre Castillo - ACastillo DG');