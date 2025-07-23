/* ======================================
   GLOBAL.JS - SISTEMA UNIVERSAL OPTIMIZADO
   Versión mejorada post-auditoría con optimizaciones de performance
   ====================================== */

/* ======================================
   UTILITARIOS UNIVERSALES MEJORADOS
   ====================================== */

// Debounce universal - Una sola implementación para todo el proyecto
function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle universal para scroll events con leading y trailing options
function throttle(func, limit, options = {}) {
    const { leading = true, trailing = true } = options;
    let inThrottle;
    let lastFunc;
    let lastRan;
    
    return function() {
        const args = arguments;
        const context = this;
        
        if (!inThrottle) {
            if (leading) func.apply(context, args);
            lastRan = Date.now();
            inThrottle = true;
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if (Date.now() - lastRan >= limit) {
                    if (trailing) func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

// Utility para crear elementos DOM optimizado
function createElement(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) {
        if (typeof content === 'string') {
            element.innerHTML = content;
        } else {
            element.appendChild(content);
        }
    }
    return element;
}

// RequestAnimationFrame optimizado con fallback
const raf = window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame || 
            function(callback) { setTimeout(callback, 16); };

const cancelRaf = window.cancelAnimationFrame || 
                  window.webkitCancelAnimationFrame || 
                  window.mozCancelAnimationFrame || 
                  clearTimeout;

/* ======================================
   CACHE DE SELECTORES DOM OPTIMIZADO
   ====================================== */

const DOMCache = {
    // Cache principal
    _cache: new Map(),
    
    // Elementos frecuentemente utilizados
    header: null,
    progressBar: null,
    body: null,
    documentElement: null,
    
    // Inicialización
    init() {
        this.body = document.body;
        this.documentElement = document.documentElement;
        this.header = document.getElementById('header');
        
        console.log('✅ DOM Cache initialized');
    },
    
    // Getter optimizado con cache automático
    get(selector) {
        if (!this._cache.has(selector)) {
            const element = document.querySelector(selector);
            if (element) {
                this._cache.set(selector, element);
            }
        }
        return this._cache.get(selector) || null;
    },
    
    // Getter para múltiples elementos
    getAll(selector) {
        const cacheKey = `all:${selector}`;
        if (!this._cache.has(cacheKey)) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                this._cache.set(cacheKey, elements);
            }
        }
        return this._cache.get(cacheKey) || [];
    },
    
    // Limpiar cache cuando sea necesario
    clear(selector = null) {
        if (selector) {
            this._cache.delete(selector);
            this._cache.delete(`all:${selector}`);
        } else {
            this._cache.clear();
        }
    },
    
    // Invalidar cache cuando se añaden elementos dinámicamente
    invalidate() {
        this._cache.clear();
        console.log('🔄 DOM Cache invalidated');
    }
};

/* ======================================
   DETECCIÓN DE CAPACIDADES MEJORADA
   ====================================== */

const DeviceCapabilities = {
    // Capacidades básicas
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    highContrast: window.matchMedia('(prefers-contrast: high)').matches,
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    
    // Hardware
    lowPowerMode: navigator.hardwareConcurrency < 4,
    memoryLimited: navigator.deviceMemory && navigator.deviceMemory < 4,
    slowConnection: navigator.connection && navigator.connection.effectiveType === 'slow-2g',
    
    // Dispositivo
    isMobile: window.innerWidth <= 848,
    isTablet: window.innerWidth <= 1312 && window.innerWidth > 848,
    isTouch: 'ontouchstart' in window,
    
    // Soporte de características
    supportsBackdropFilter: CSS.supports('backdrop-filter', 'blur(10px)'),
    supportsGridGap: CSS.supports('gap', '1rem'),
    supportsIntersectionObserver: 'IntersectionObserver' in window,
    supportsResizeObserver: 'ResizeObserver' in window,
    
    // Actualizar capacidades dinámicamente
    update() {
        this.isMobile = window.innerWidth <= 848;
        this.isTablet = window.innerWidth <= 1312 && window.innerWidth > 848;
        
        // Aplicar clases al documentElement
        DOMCache.documentElement.classList.toggle('mobile', this.isMobile);
        DOMCache.documentElement.classList.toggle('tablet', this.isTablet);
        DOMCache.documentElement.classList.toggle('desktop', !this.isMobile && !this.isTablet);
        DOMCache.documentElement.classList.toggle('touch-device', this.isTouch);
        DOMCache.documentElement.classList.toggle('low-power', this.lowPowerMode);
        DOMCache.documentElement.classList.toggle('reduced-motion', this.reducedMotion);
    }
};

/* ======================================
   HEADER Y NAVEGACIÓN OPTIMIZADA
   ====================================== */

// Header scroll effect optimizado con cache
const optimizedScrollHandler = throttle(() => {
    if (DOMCache.header) {
        const scrolled = window.scrollY > 100;
        DOMCache.header.classList.toggle('scrolled', scrolled);
    }
}, 16, { leading: true, trailing: true });

// Navigation active state universal optimizada
function setActiveNavLink() {
    const navLinks = DOMCache.getAll('.nav-link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        link.classList.toggle('active', linkPath === currentPath);
    });
    
    console.log(`🔗 Active nav link set: ${currentPath}`);
}

/* ======================================
   SISTEMA DE ANIMACIONES UNIVERSAL MEJORADO
   ====================================== */

// Factory para crear observers optimizados
const createOptimizedObserver = (callback, options = {}) => {
    const defaultOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        ...options
    };
    
    if (!DeviceCapabilities.supportsIntersectionObserver) {
        console.warn('⚠️ IntersectionObserver not supported, using fallback');
        // Fallback para navegadores antiguos
        return {
            observe: (element) => {
                setTimeout(() => callback([{ target: element, isIntersecting: true }]), 100);
            },
            unobserve: () => {},
            disconnect: () => {}
        };
    }
    
    return new IntersectionObserver(callback, defaultOptions);
};

// Sistema de animaciones universal optimizado
function initUniversalAnimations() {
    const observer = createOptimizedObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger evento personalizado
                entry.target.dispatchEvent(new CustomEvent('elementVisible', {
                    detail: { element: entry.target }
                }));
                
                // Auto-unobserve para performance
                if (!entry.target.hasAttribute('data-keep-observing')) {
                    observer.unobserve(entry.target);
                }
            }
        });
    });
    
    // Observar TODOS los elementos con fade-in
    const elements = DOMCache.getAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right, .fade-in-scale');
    elements.forEach(el => observer.observe(el));
    
    console.log(`✅ Universal animations initialized for ${elements.length} elements`);
    return observer;
}

// Animaciones escalonadas mejoradas
function initStaggeredAnimations() {
    const observer = createOptimizedObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.querySelectorAll('.fade-in, .card, [data-animate]');
                
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0) scale(1)';
                        child.classList.add('visible');
                    }, index * 100);
                });
                
                observer.unobserve(entry.target);
            }
        });
    });
    
    // Detectar automáticamente contenedores
    const containers = DOMCache.getAll('[data-stagger], .grid, .cards-container');
    containers.forEach(container => observer.observe(container));
    
    console.log(`✅ Staggered animations initialized for ${containers.length} containers`);
}

/* ======================================
   SISTEMA DE CONTADORES UNIVERSAL MEJORADO
   ====================================== */

// Función optimizada para animar valores numéricos
function animateValue(element, start, end, duration, options = {}) {
    const { prefix = '', suffix = '', decimals = 0, easing = 'easeOutQuart' } = options;
    
    // Easing functions
    const easingFunctions = {
        linear: t => t,
        easeOutQuart: t => 1 - (--t) * t * t * t,
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    };
    
    const easingFunction = easingFunctions[easing] || easingFunctions.easeOutQuart;
    let startTimestamp = null;
    let animationId;
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easedProgress = easingFunction(progress);
        const current = start + (easedProgress * (end - start));
        
        element.textContent = prefix + current.toFixed(decimals) + suffix;
        
        if (progress < 1) {
            animationId = raf(step);
        } else {
            // Trigger evento de completado
            element.dispatchEvent(new CustomEvent('counterComplete', {
                detail: { finalValue: end }
            }));
        }
    };
    
    animationId = raf(step);
    
    // Retornar función para cancelar animación
    return () => cancelRaf(animationId);
}

// Sistema de contadores automático mejorado
function initUniversalCounters() {
    const observer = createOptimizedObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const targetText = element.textContent.trim();
                const hasPlus = targetText.includes('+');
                const hasPercent = targetText.includes('%');
                const targetNumber = parseInt(targetText.replace(/[^\d]/g, ''));
                
                if (!isNaN(targetNumber) && targetNumber > 0) {
                    element.textContent = '0';
                    
                    // Animar con duración variable según el número
                    const duration = Math.min(Math.max(targetNumber * 20, 800), 2400);
                    
                    animateValue(element, 0, targetNumber, duration, {
                        prefix: '',
                        suffix: hasPercent ? '%' : (hasPlus ? '+' : ''),
                        easing: 'easeOutQuart'
                    });
                }
                
                observer.unobserve(element);
            }
        });
    });
    
    // Detectar automáticamente elementos con números
    const counters = DOMCache.getAll('[data-count], .stat-number, .counter');
    counters.forEach(element => observer.observe(element));
    
    console.log(`✅ Universal counters initialized for ${counters.length} elements`);
}

/* ======================================
   SISTEMA DE CARDS UNIVERSAL MEJORADO
   ====================================== */

// Detección optimizada de tipos de card
function detectCardType(card) {
    const computedStyle = getComputedStyle(card);
    
    return {
        hasIcon: card.querySelector('.material-symbols-rounded, .icon, [class*="icon"]') !== null,
        hasGlass: computedStyle.backdropFilter !== 'none',
        hasBorder: computedStyle.borderImageSource !== 'none' || 
                  card.classList.contains('gradient-border'),
        isTransparent: card.classList.contains('transparent') || 
                      computedStyle.backgroundColor.includes('rgba'),
        isInteractive: card.hasAttribute('data-interactive') || 
                      card.classList.contains('interactive')
    };
}

// Sistema de hover universal optimizado
function applyUniversalHoverEffect(card) {
    const { hasIcon, hasGlass, isTransparent, isInteractive } = detectCardType(card);
    
    // Configuración de estados
    const hoverState = {
        transform: 'translateY(-8px)',
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
        background: hasGlass ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.95)'
    };
    
    const restState = {
        transform: 'translateY(0)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        background: hasGlass ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)'
    };
    
    // Cache de elementos para performance
    let iconElements = null;
    let containerElements = null;
    
    if (hasIcon) {
        iconElements = card.querySelectorAll('.material-symbols-rounded, .icon, [class*="icon"]');
        containerElements = card.querySelectorAll('[class*="icon-container"], [class*="-icon"]');
    }
    
    card.addEventListener('mouseenter', function() {
        // Aplicar estado hover
        Object.assign(this.style, hoverState);
        
        // Efectos en iconos (cached)
        if (hasIcon && iconElements) {
            iconElements.forEach(icon => {
                icon.style.transform = 'scale(1.1)';
                icon.style.transition = 'all 0.3s ease';
            });
            
            containerElements.forEach(container => {
                if (container !== this) {
                    container.style.transform = 'scale(1.1)';
                    container.style.transition = 'all 0.3s ease';
                }
            });
        }
        
        // Trigger evento personalizado
        this.dispatchEvent(new CustomEvent('cardHover', { 
            detail: { state: 'enter', cardType: { hasIcon, hasGlass, isTransparent } } 
        }));
    }, { passive: true });
    
    card.addEventListener('mouseleave', function() {
        // Restaurar estado
        Object.assign(this.style, restState);
        
        // Restaurar iconos
        if (hasIcon && iconElements) {
            iconElements.forEach(icon => {
                icon.style.transform = 'scale(1)';
            });
            
            containerElements.forEach(container => {
                if (container !== this) {
                    container.style.transform = 'scale(1)';
                }
            });
        }
        
        // Trigger evento personalizado
        this.dispatchEvent(new CustomEvent('cardHover', { 
            detail: { state: 'leave', cardType: { hasIcon, hasGlass, isTransparent } } 
        }));
    }, { passive: true });
}

// Sistema de cards universal optimizado
function initUniversalCardSystem() {
    // Selectores universales optimizados
    const cardSelectors = [
        '.card',
        '[class*="-card"]',
        '[data-card]',
        '.quote-card',
        '.proceso-card-full'
    ].join(', ');
    
    const allCards = DOMCache.getAll(cardSelectors);
    
    // Aplicar efectos usando DocumentFragment para performance
    allCards.forEach(card => {
        // Verificar si ya fue procesada
        if (card.hasAttribute('data-universal-card')) return;
        
        // Aplicar efectos hover universales
        applyUniversalHoverEffect(card);
        
        // Marcar como procesada
        card.setAttribute('data-universal-card', 'true');
    });
    
    console.log(`✅ Universal card system initialized for ${allCards.length} cards`);
    return allCards.length;
}

/* ======================================
   SISTEMA DE RIPPLES UNIVERSAL MEJORADO
   ====================================== */

// Pool de elementos ripple para reutilización
const RipplePool = {
    _pool: [],
    _maxSize: 10,
    
    get() {
        return this._pool.pop() || this._create();
    },
    
    release(ripple) {
        if (this._pool.length < this._maxSize) {
            ripple.remove();
            this._pool.push(ripple);
        } else {
            ripple.remove();
        }
    },
    
    _create() {
        const ripple = createElement('div', 'ripple-effect');
        return ripple;
    }
};

// Crear efecto ripple optimizado
function createRippleEffect(event, element) {
    // Verificar si los ripples están habilitados
    if (!window.JMC?.config?.enableRipples) return;
    
    // Crear CSS si no existe (una sola vez)
    if (!DOMCache.get('#ripple-styles')) {
        const style = createElement('style', null, `
            @keyframes ripple-expand {
                0% { 
                    transform: scale(0); 
                    opacity: 1; 
                }
                100% { 
                    transform: scale(4); 
                    opacity: 0; 
                }
            }
            .ripple-effect {
                position: absolute;
                border-radius: 50%;
                background: rgba(65, 182, 230, 0.3);
                pointer-events: none;
                z-index: 1000;
                animation: ripple-expand 0.6s ease-out;
                will-change: transform, opacity;
            }
        `);
        style.id = 'ripple-styles';
        document.head.appendChild(style);
        DOMCache._cache.set('#ripple-styles', style);
    }
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = RipplePool.get();
    
    // Configurar ripple
    ripple.style.cssText += `
        width: ${size}px;
        height: ${size}px;
        left: ${event.clientX - rect.left - size/2}px;
        top: ${event.clientY - rect.top - size/2}px;
    `;
    
    // Preparar elemento contenedor
    element.style.position = element.style.position || 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Remover y reciclar después de la animación
    setTimeout(() => {
        if (ripple.parentNode) {
            RipplePool.release(ripple);
        }
    }, 600);
}

// Inicializar ripples automáticamente optimizado
function initUniversalRipples() {
    // Verificar configuración
    if (!window.JMC?.config?.enableRipples) {
        console.log('⏭️ Ripples disabled by configuration');
        return;
    }
    
    // Selectores optimizados
    const rippleSelector = `
        .btn, [class*="button"], [class*="-button"], 
        .card, [class*="-card"], 
        .nav-link, 
        [data-ripple],
        a[href]:not([href^="#"]):not([href^="mailto:"]),
        button:not([disabled])
    `;
    
    const rippleElements = DOMCache.getAll(rippleSelector);
    
    // Usar delegación de eventos para performance
    document.addEventListener('click', function(e) {
        const target = e.target.closest(rippleSelector);
        if (target && !target.hasAttribute('data-no-ripple')) {
            createRippleEffect(e, target);
        }
    }, { passive: true });
    
    console.log(`✅ Universal ripples initialized with event delegation for ${rippleElements.length} elements`);
}

/* ======================================
   SISTEMA DE SCROLL PROGRESS MEJORADO
   ====================================== */

function initScrollProgress() {
    // Limpiar barra existente
    const existing = DOMCache.get('#scroll-progress-bar');
    if (existing) {
        existing.remove();
        DOMCache.clear('#scroll-progress-bar');
    }
    
    // Crear nueva barra con mejor estructura
    const progressBar = createElement('div');
    progressBar.id = 'scroll-progress-bar';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 6px;
        background: transparent;
        z-index: var(--z-progress, 9999);
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
        will-change: transform;
    `;
    
    progressBar.appendChild(progressIndicator);
    document.body.appendChild(progressBar);
    
    // Cache del indicador para performance
    DOMCache._cache.set('#scroll-progress-bar', progressBar);
    
    // Handler ultra-optimizado
    let ticking = false;
    const updateProgress = () => {
        const winScroll = window.pageYOffset || DOMCache.documentElement.scrollTop;
        const height = DOMCache.documentElement.scrollHeight - DOMCache.documentElement.clientHeight;
        const scrolled = Math.min(Math.max(winScroll / height, 0), 1);
        
        progressIndicator.style.transform = `scaleX(${scrolled})`;
        ticking = false;
    };
    
    const throttledUpdate = () => {
        if (!ticking) {
            raf(updateProgress);
            ticking = true;
        }
    };
    
    window.addEventListener('scroll', throttledUpdate, { passive: true });
    updateProgress(); // Initial call
    
    console.log('✅ Optimized scroll progress initialized');
}

/* ======================================
   MUTATION OBSERVER PARA CONTENIDO DINÁMICO MEJORADO
   ====================================== */

function initDynamicContentObserver() {
    let observerTimeout;
    
    const handleMutations = debounce((mutations) => {
        let hasNewCards = false;
        let hasNewAnimatedElements = false;
        
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Verificar nuevas cards
                    if (node.matches?.('.card, [class*="-card"]')) {
                        applyUniversalHoverEffect(node);
                        hasNewCards = true;
                    }
                    
                    // Verificar nuevos elementos animados
                    if (node.matches?.('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right')) {
                        hasNewAnimatedElements = true;
                    }
                    
                    // Verificar nuevos botones
                    if (node.matches?.('.btn, [class*="button"]')) {
                        // Los ripples ya están manejados por delegación de eventos
                    }
                }
            });
        });
        
        // Invalidar cache y re-inicializar sistemas si es necesario
        if (hasNewCards || hasNewAnimatedElements) {
            DOMCache.invalidate();
            console.log('🔄 New content detected, systems updated');
        }
    }, 100);
    
    const observer = new MutationObserver(handleMutations);
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('✅ Dynamic content observer initialized');
    return observer;
}

/* ======================================
   SISTEMA DE PERFORMANCE MONITORING
   ====================================== */

const PerformanceMonitor = {
    metrics: {
        initTime: 0,
        cardsProcessed: 0,
        animationsActive: 0,
        observersActive: 0
    },
    
    startTiming(label) {
        this.metrics[`${label}Start`] = performance.now();
    },
    
    endTiming(label) {
        const duration = performance.now() - this.metrics[`${label}Start`];
        this.metrics[`${label}Duration`] = duration;
        console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
        return duration;
    },
    
    logMetrics() {
        console.group('📊 Performance Metrics');
        console.table(this.metrics);
        console.groupEnd();
    }
};

/* ======================================
   API PÚBLICA MEJORADA
   ====================================== */

// Configuración global
const GlobalConfig = {
    enableRipples: true,
    enableAnimations: !DeviceCapabilities.reducedMotion,
    enableBackgroundEffects: true,
    enablePerformanceLogging: false,
    autoInit: true
};

// Sistema de plugins
const PluginSystem = {
    _plugins: new Map(),
    
    register(name, plugin) {
        this._plugins.set(name, plugin);
        console.log(`🔌 Plugin registered: ${name}`);
        
        // Auto-inicializar si está configurado
        if (plugin.autoInit && GlobalConfig.autoInit) {
            plugin.init();
        }
    },
    
    get(name) {
        return this._plugins.get(name);
    },
    
    init(name) {
        const plugin = this._plugins.get(name);
        if (plugin && plugin.init) {
            plugin.init();
        }
    },
    
    initAll() {
        this._plugins.forEach((plugin, name) => {
            if (plugin.init) {
                plugin.init();
            }
        });
    }
};

/* ======================================
   INICIALIZACIÓN UNIVERSAL OPTIMIZADA
   ====================================== */

// Función principal de inicialización optimizada
function initializeUniversalSystems() {
    PerformanceMonitor.startTiming('totalInit');
    console.log('🚀 Initializing Optimized Universal Systems - JMC Preuniversitario');
    
    // 1. Inicializar cache y capacidades del dispositivo
    PerformanceMonitor.startTiming('domCache');
    DOMCache.init();
    DeviceCapabilities.update();
    PerformanceMonitor.endTiming('domCache');
    
    // 2. Sistemas básicos
    PerformanceMonitor.startTiming('basicSystems');
    setActiveNavLink();
    initScrollProgress();
    PerformanceMonitor.endTiming('basicSystems');
    
    // 3. Sistemas de animación
    PerformanceMonitor.startTiming('animations');
    initUniversalAnimations();
    initStaggeredAnimations();
    initUniversalCounters();
    PerformanceMonitor.endTiming('animations');
    
    // 4. Sistemas de interacción
    PerformanceMonitor.startTiming('interactions');
    const cardsCount = initUniversalCardSystem();
    PerformanceMonitor.metrics.cardsProcessed = cardsCount;
    initUniversalRipples();
    PerformanceMonitor.endTiming('interactions');
    
    // 5. Sistemas de contenido dinámico
    PerformanceMonitor.startTiming('observers');
    initDynamicContentObserver();
    PerformanceMonitor.endTiming('observers');
    
    // 6. Event listeners globales optimizados
    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    
    // 7. Resize handler universal optimizado
    const optimizedResizeHandler = debounce(() => {
        DeviceCapabilities.update();
        DOMCache.invalidate(); // Limpiar cache en resize
        
        if (GlobalConfig.enablePerformanceLogging) {
            console.log(`📱 Layout changed: ${DeviceCapabilities.isMobile ? 'Mobile' : DeviceCapabilities.isTablet ? 'Tablet' : 'Desktop'}`);
        }
    }, 250);
    
    window.addEventListener('resize', optimizedResizeHandler, { passive: true });
    
    // 8. Performance y debugging
    PerformanceMonitor.metrics.totalInit = PerformanceMonitor.endTiming('totalInit');
    
    if (GlobalConfig.enablePerformanceLogging) {
        PerformanceMonitor.logMetrics();
    }
    
    console.log('✅ All Optimized Universal Systems initialized successfully');
    console.log('📊 Systems ready with enhanced performance optimizations');
}

/* ======================================
   API PÚBLICA PARA OTROS ARCHIVOS
   ====================================== */

// API principal mejorada
window.JMC = {
    // Versión del sistema
    version: '2.0.0',
    
    // Utilitarios core
    debounce,
    throttle,
    createElement,
    raf,
    cancelRaf,
    
    // Sistemas principales
    DOM: DOMCache,
    Performance: PerformanceMonitor,
    Plugins: PluginSystem,
    Capabilities: DeviceCapabilities,
    
    // Configuración
    config: GlobalConfig,
    
    // Funciones principales
    createRippleEffect,
    applyUniversalHoverEffect,
    animateValue,
    
    // API de control
    reinitialize: initializeUniversalSystems,
    updateCapabilities: () => DeviceCapabilities.update(),
    clearCache: () => DOMCache.clear(),
    
    // Debug utilities
    debug: {
        logCardCount: () => {
            const count = DOMCache.getAll('[class*="-card"], .card').length;
            console.log(`🃏 Cards detected: ${count}`);
            return count;
        },
        showAnimations: () => {
            DOMCache.documentElement.classList.add('debug-animations');
            console.log('🎬 Debug animations enabled');
        },
        hideAnimations: () => {
            DOMCache.documentElement.classList.remove('debug-animations');
            console.log('🎬 Debug animations disabled');
        },
        enablePerformanceLogging: () => {
            GlobalConfig.enablePerformanceLogging = true;
            console.log('📊 Performance logging enabled');
        },
        disablePerformanceLogging: () => {
            GlobalConfig.enablePerformanceLogging = false;
            console.log('📊 Performance logging disabled');
        },
        getMetrics: () => PerformanceMonitor.metrics
    },
    
    // Configuración en vivo
    configure: (options) => {
        Object.assign(GlobalConfig, options);
        console.log('⚙️ Configuration updated:', options);
    },
    
    // Estado del sistema
    getStatus: () => ({
        initialized: true,
        cardsProcessed: PerformanceMonitor.metrics.cardsProcessed,
        deviceType: DeviceCapabilities.isMobile ? 'mobile' : DeviceCapabilities.isTablet ? 'tablet' : 'desktop',
        reducedMotion: DeviceCapabilities.reducedMotion,
        cacheSize: DOMCache._cache.size
    })
};

// Auto-inicialización inteligente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeUniversalSystems);
} else {
    // Si ya está cargado, inicializar en el próximo tick
    setTimeout(initializeUniversalSystems, 0);
}

/* ======================================
   LOGGING Y DEBUGGING MEJORADO
   ====================================== */

console.log('🔧 Global JS Universal System Optimized v2.0 loaded');
console.log('📚 Enhanced API available via window.JMC:', Object.keys(window.JMC || {}));
console.log('⚡ Performance optimizations: DOM Cache, Event Delegation, RAF Throttling');
console.log('🛡️ Feature Detection: Intersection Observer, Backdrop Filter, Hardware Capabilities');
console.log('👨‍💻 Developed by Alexandre Castillo - ACastillo DG');