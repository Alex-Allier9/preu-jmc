/* ======================================
   GLOBAL.JS - CONSOLIDADO Y OPTIMIZADO
   ====================================== */

/* ======================================
   UTILITARIOS UNIVERSALES - CONSOLIDADO
   ====================================== */

// Performance optimization - debounce universal
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

/* ======================================
   HEADER Y NAVEGACIÓN
   ====================================== */

// Header scroll effect optimizado
const debouncedScrollHandler = debounce(() => {
    const header = document.getElementById('header');
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}, 10);

// Navigation link active state management
function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Get current page path
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // Find matching link and set active
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
}

/* ======================================
   SISTEMA DE ANIMACIONES UNIVERSAL - MEJORADO
   ====================================== */

// Intersection Observer para animaciones
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Función universal para inicializar animaciones
function initUniversalAnimations() {
    // Observar todos los elementos fade-in
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Animate value function optimizada
function animateValue(element, start, end, duration, originalText) {
    let startTimestamp = null;
    const prefix = originalText.includes('+') ? '+' : '';
    const suffix = originalText.includes('%') ? '%' : '';
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = prefix + current + suffix;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

// Counter animation for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = counter.textContent;
        
        if (!isNaN(target.replace('+', '').replace('%', ''))) {
            counter.textContent = '0';
            
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateValue(counter, 0, parseInt(target.replace('+', '').replace('%', '')), 1600, target);
                        counterObserver.unobserve(counter);
                    }
                });
            });
            
            counterObserver.observe(counter);
        }
    });
}

/* ======================================
   SISTEMA DE CARDS UNIVERSAL - EXPANDIDO Y CONSOLIDADO
   ====================================== */

// Función universal para efectos hover de tarjetas - EFECTO UNIFORME EXPANDIDO
function addUniversalCardEffects() {
    // Efecto estándar para todas las cards
    const standardHover = {
        transform: 'translateY(-8px)',
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)'
    };
    
    const standardRestore = {
        transform: 'translateY(0)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
    };

    const cardConfigs = [
        // Cards existentes de global
        { selector: '.mvp-card', hasIcon: false },
        { selector: '.program-card', hasIcon: true },
        { selector: '.stat-card', hasIcon: false },
        { selector: '.value-card', hasIcon: true },
        { selector: '.sede-card', hasIcon: true, hoverBackground: 'rgba(255, 255, 255, 0.15)', restoreBackground: 'rgba(255, 255, 255, 0.1)' },
        { selector: '.about-card', hasIcon: false, hoverBackground: 'rgba(255, 255, 255, 0.95)', restoreBackground: 'rgba(255, 255, 255, 0.9)' },
        { selector: '.quote-card', hasIcon: false, hoverBackground: 'rgba(255, 255, 255, 0.15)', restoreBackground: 'rgba(255, 255, 255, 0.1)' },
        
        // Cards de servicios - CONSOLIDADAS AQUÍ
        { selector: '.service-feature-card', hasIcon: true },
        { selector: '.requisito-card', hasIcon: true, hoverBackground: 'rgba(255, 255, 255, 0.15)', restoreBackground: 'rgba(255, 255, 255, 0.1)' },
        { selector: '.complementary-card', hasIcon: true },
        { selector: '.financial-card', hasIcon: true },
        { selector: '.practical-card', hasIcon: true },
        
        // Cards de fundador - CONSOLIDADAS AQUÍ
        { selector: '.achievement-card', hasIcon: true },
        { selector: '.philosophy-card', hasIcon: true, hoverBackground: 'rgba(255, 255, 255, 0.15)', restoreBackground: 'rgba(255, 255, 255, 0.1)' },
        { selector: '.profile-card', hasIcon: false },
        
        // Cards de testimonios - PREPARADAS PARA EL FUTURO
        { selector: '.testimonial-card', hasIcon: false },
        
        // Cards base universales
        { selector: '.card-base', hasIcon: false }
    ];

    cardConfigs.forEach(config => {
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
                    const iconContainers = this.querySelectorAll(
                        '.main-icon-container, .secondary-icon-container, .service-icon, .requisito-icon, .complementary-icon, .financial-icon, .practical-icon, .achievement-icon, .philosophy-icon'
                    );
                    const icons = this.querySelectorAll('.material-symbols-rounded, .instagram-icon');
                    
                    iconContainers.forEach(container => {
                        if (container) container.style.transform = 'scale(1.1)';
                    });
                    icons.forEach(icon => {
                        if (icon) icon.style.transform = 'scale(1.1)';
                    });
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
                    const iconContainers = this.querySelectorAll(
                        '.main-icon-container, .secondary-icon-container, .service-icon, .requisito-icon, .complementary-icon, .financial-icon, .practical-icon, .achievement-icon, .philosophy-icon'
                    );
                    const icons = this.querySelectorAll('.material-symbols-rounded, .instagram-icon');
                    
                    iconContainers.forEach(container => {
                        if (container) container.style.transform = 'scale(1)';
                    });
                    icons.forEach(icon => {
                        if (icon) icon.style.transform = 'scale(1)';
                    });
                }
            });
        });
    });
}

// Process card hover effects - EFECTO UNIFORME
function addProcessCardEffects() {
    const processCards = document.querySelectorAll('.proceso-card-full');
    
    processCards.forEach(card => {
        const stepIcon = card.querySelector('.process-step-icon');
        
        card.addEventListener('mouseenter', function() {
            // Mismo efecto estándar que las otras cards
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
            if (stepIcon) {
                stepIcon.style.transform = 'scale(1.1)';
                stepIcon.style.boxShadow = '0 8px 20px rgba(65, 182, 230, 0.4)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            if (stepIcon) {
                stepIcon.style.transform = 'scale(1)';
                stepIcon.style.boxShadow = '0 6px 18px rgba(65, 182, 230, 0.3)';
            }
        });
        
        // Click effect mantenido
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-5px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-8px) scale(1)';
            }, 150);
        });
    });
}

/* ======================================
   PROGRESS BAR DE SCROLL - MEJORADA
   ====================================== */

// Add scroll progress indicator - OPTIMIZADA
function addScrollProgress() {
    // Remove existing progress bar if it exists
    const existingBar = document.getElementById('scroll-progress-bar');
    if (existingBar) {
        existingBar.remove();
    }
    
    // Create new progress bar
    const progressBar = document.createElement('div');
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
    
    // Create the progress indicator element
    const progressIndicator = document.createElement('div');
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
    
    // Smooth scroll animation using requestAnimationFrame
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    const updateProgress = () => {
        const winScroll = window.scrollY || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = Math.min(winScroll / height, 1); // Ensure doesn't exceed 1
        
        progressIndicator.style.transform = `scaleX(${scrolled})`;
        ticking = false;
    };
    
    const onScroll = () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(updateProgress);
            ticking = true;
        }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initialize
    updateProgress();
}

/* ======================================
   ANIMACIONES DE CARDS - MEJORADAS
   ====================================== */

// Card reveal animation with stagger - OPTIMIZADA
function addCardRevealAnimation() {
    const cards = document.querySelectorAll(
        '.proceso-card-full, .program-card, .sede-card, .stat-card, .mvp-card, .service-feature-card, .requisito-card, .complementary-card, .financial-card, .practical-card, .achievement-card, .philosophy-card, .testimonial-card'
    );
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(card);
    });
}

/* ======================================
   SMOOTH SCROLL - OPTIMIZADA
   ====================================== */

// Smooth scroll for anchor links - OPTIMIZADA
function initSmoothScroll() {
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
}

/* ======================================
   RIPPLE EFFECTS UNIVERSALES - NUEVO
   ====================================== */

// Sistema completo de ripples para todos los botones
function initUniversalRipples() {
    const rippleElements = document.querySelectorAll(
        '.cta-button, .error-button, .nav-link, .program-card, .sede-card, .service-feature-card, .requisito-card, .complementary-card, .financial-card, .practical-card, .achievement-card, .philosophy-card'
    );
    
    rippleElements.forEach(element => {
        element.addEventListener('click', function(e) {
            createRipple(e, this);
        });
    });
}

function createRipple(event, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    // Crear la animación CSS si no existe
    if (!document.querySelector('#ripple-animation')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation';
        style.textContent = `
            @keyframes ripple-expand {
                0% { transform: scale(0); opacity: 1; }
                100% { transform: scale(4); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(65, 182, 230, 0.3);
        transform: scale(0);
        animation: ripple-expand 0.6s ease-out;
        width: ${size}px;
        height: ${size}px;
        left: ${event.clientX - rect.left - size/2}px;
        top: ${event.clientY - rect.top - size/2}px;
        pointer-events: none;
        z-index: 1000;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

/* ======================================
   LOADING STATES - NUEVO
   ====================================== */

// Crear loading states con shimmer para elementos que cargan contenido
function addLoadingStates() {
    // Crear CSS para loading states si no existe
    if (!document.querySelector('#loading-states-css')) {
        const style = document.createElement('style');
        style.id = 'loading-states-css';
        style.textContent = `
            /* Loading shimmer para cards que cargan contenido */
            .card-loading {
                position: relative;
                overflow: hidden;
            }

            .card-loading::before {
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
                z-index: 1;
            }

            @keyframes shimmer {
                100% { left: 100%; }
            }

            /* Skeleton loading para texto */
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
        `;
        document.head.appendChild(style);
    }
}

/* ======================================
   FUNCIONES AUXILIARES
   ====================================== */

// Función para aplicar clase de loading a un elemento
function setLoadingState(element, isLoading) {
    if (isLoading) {
        element.classList.add('card-loading');
    } else {
        element.classList.remove('card-loading');
    }
}

// Función para crear skeleton text
function createSkeletonText(container, lines = 3) {
    container.innerHTML = '';
    for (let i = 0; i < lines; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-text';
        skeleton.style.width = `${Math.random() * 40 + 60}%`;
        container.appendChild(skeleton);
    }
}

/* ======================================
   INICIALIZACIÓN UNIVERSAL - CONSOLIDADA
   ====================================== */

// Initialize on page load - OPTIMIZADA Y EXPANDIDA
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Global JS initialized - JMC Preuniversitario');
    
    // 1. Funcionalidades básicas existentes
    window.addEventListener('scroll', debouncedScrollHandler);
    setActiveNavLink();
    initSmoothScroll();
    
    // 2. Animaciones y efectos visuales
    initUniversalAnimations();
    animateCounters();
    addScrollProgress();
    addLoadingStates();
    
    // 3. Efectos interactivos (con delay para evitar conflictos)
    setTimeout(() => {
        addUniversalCardEffects();
        addProcessCardEffects();
        addCardRevealAnimation();
        initUniversalRipples();
    }, 500);
    
    // 4. Log de éxito
    console.log('✅ All global functionalities loaded successfully');
    console.log('📱 Responsive design: 82rem (tablet), 53rem (mobile)');
    console.log('🎨 Universal card effects, ripples, and animations active');
});

/* ======================================
   RESIZE HANDLER UNIVERSAL
   ====================================== */

// Manejo universal de resize
window.addEventListener('resize', debounce(function() {
    // Reajustar elementos que dependen del tamaño de pantalla
    const isMobile = window.innerWidth <= 848; // 53rem
    const isTablet = window.innerWidth <= 1312 && window.innerWidth > 848; // 82rem
    
    // Log para debugging
    if (isMobile) {
        console.log('📱 Mobile layout active');
    } else if (isTablet) {
        console.log('📟 Tablet layout active');
    } else {
        console.log('💻 Desktop layout active');
    }
    
    // Reajustar scroll progress bar si es necesario
    const progressBar = document.getElementById('scroll-progress-bar');
    if (progressBar) {
        // Forzar recálculo del progress
        const event = new Event('scroll');
        window.dispatchEvent(event);
    }
}, 250));

/* ======================================
   EXPORT PARA DEBUGGING
   ====================================== */

// Console log para debugging
console.log('🔧 Global JS functions available:');
console.log('- debounce(): Universal debounce utility');
console.log('- setLoadingState(): Add/remove loading states');
console.log('- createSkeletonText(): Create skeleton loading text');
console.log('- createRipple(): Manual ripple effect');
console.log('📊 Developed by Alexandre Castillo - ACastillo DG');