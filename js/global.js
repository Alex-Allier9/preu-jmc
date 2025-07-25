/* ======================================
   GLOBAL.JS - FUNCIONES COMPLETAS HEADER Y FOOTER
   JMC PREUNIVERSITARIO - REPARADO Y COMPLETO
   ====================================== */

/* ======================================
   UTILITARIOS UNIVERSALES
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

// Throttle function para scroll events
function throttle(func, wait) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, wait);
        }
    }
}

/* ======================================
   HEADER Y NAVEGACIÓN - COMPLETO
   ====================================== */

// Header scroll effect optimizado
const debouncedScrollHandler = debounce(() => {
    const header = document.getElementById('header') || document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}, 10);

// Progress bar de scroll optimizada
function addScrollProgress() {
    // Remove existing progress bar if it exists
    const existingBar = document.getElementById('scroll-progress-bar');
    if (existingBar) {
        existingBar.remove();
    }
    
    // Create new progress bar
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress-bar';
    progressBar.innerHTML = '<div></div>';
    document.body.appendChild(progressBar);
    
    let ticking = false;
    
    const updateProgress = () => {
        const winScroll = window.scrollY || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = Math.min(winScroll / height, 1); // Ensure doesn't exceed 1
        
        const progressIndicator = progressBar.querySelector('div');
        if (progressIndicator) {
            progressIndicator.style.transform = `scaleX(${scrolled})`;
        }
        ticking = false;
    };
    
    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(updateProgress);
            ticking = true;
        }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initialize
    updateProgress();
}

// Navegación mobile completa
function initMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navOverlay = document.querySelector('.nav-overlay');
    const navMobile = document.querySelector('.nav-mobile');
    
    // Si no existen los elementos, crear la estructura necesaria
    if (!navToggle || !navOverlay || !navMobile) {
        createMobileNavStructure();
        return;
    }
    
    const toggleMobileNav = () => {
        const isActive = navToggle.classList.contains('active');
        
        navToggle.classList.toggle('active');
        navOverlay.classList.toggle('active');
        navMobile.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (!isActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };
    
    // Toggle button click
    navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileNav();
    });
    
    // Overlay click to close
    navOverlay.addEventListener('click', toggleMobileNav);
    
    // Close menu when clicking nav links
    document.querySelectorAll('.nav-mobile .nav-link').forEach(link => {
        link.addEventListener('click', toggleMobileNav);
    });
    
    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMobile.classList.contains('active')) {
            toggleMobileNav();
        }
    });
    
    // Close menu on window resize to desktop
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 848 && navMobile.classList.contains('active')) {
            toggleMobileNav();
        }
    }, 250));
}

// Crear estructura de navegación mobile si no existe
function createMobileNavStructure() {
    const header = document.querySelector('.header');
    const navContainer = document.querySelector('.nav-container');
    const desktopMenu = document.querySelector('.nav-menu');
    
    if (!header || !navContainer || !desktopMenu) {
        console.warn('Header structure incomplete for mobile navigation');
        return;
    }
    
    // Crear botón hamburger si no existe
    let navToggle = document.querySelector('.nav-toggle');
    if (!navToggle) {
        navToggle = document.createElement('div');
        navToggle.className = 'nav-toggle';
        navToggle.innerHTML = '<span></span><span></span><span></span>';
        navContainer.appendChild(navToggle);
    }
    
    // Crear overlay si no existe
    let navOverlay = document.querySelector('.nav-overlay');
    if (!navOverlay) {
        navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay';
        document.body.appendChild(navOverlay);
    }
    
    // Crear menu mobile si no existe
    let navMobile = document.querySelector('.nav-mobile');
    if (!navMobile) {
        navMobile = document.createElement('nav');
        navMobile.className = 'nav-mobile';
        navMobile.innerHTML = `<ul class="nav-menu">${desktopMenu.innerHTML}</ul>`;
        document.body.appendChild(navMobile);
    }
    
    // Inicializar funcionalidad
    setTimeout(() => initMobileNavigation(), 100);
}

// Set active navigation link
function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Get current page path
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // Find matching link and set active
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath || 
            (currentPath === '' && linkPath === 'index.html') ||
            (currentPath === 'index.html' && linkPath === '') ||
            linkPath === currentPath.replace('.html', '')) {
            link.classList.add('active');
        }
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ======================================
   ANIMACIONES UNIVERSALES
   ====================================== */

// Intersection Observer para animaciones fade-in
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Inicializar animaciones universales
function initUniversalAnimations() {
    // Observar todos los elementos fade-in
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
    
    // Animaciones de footer con delay
    const footerSections = document.querySelectorAll('.footer-section');
    footerSections.forEach((section, index) => {
        section.style.animationDelay = `${(index + 1) * 0.1}s`;
    });
}

/* ======================================
   SISTEMA DE CONTADORES ANIMADOS
   ====================================== */

// Animate value function optimizada
function animateValue(element, start, end, duration, originalText) {
    let startTimestamp = null;
    const prefix = originalText.includes('+') ? '+' : '';
    const suffix = originalText.includes('%') ? '%' : '';
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * easeOutQuart);
        
        element.textContent = prefix + current.toLocaleString() + suffix;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

// Animate counters automático
function animateCounters() {
    const counterElements = document.querySelectorAll('[data-counter]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const originalText = element.textContent;
                const targetValue = parseInt(element.getAttribute('data-counter')) || parseInt(originalText.replace(/\D/g, ''));
                
                if (targetValue) {
                    animateValue(element, 0, targetValue, 2000, originalText);
                    counterObserver.unobserve(element);
                }
            }
        });
    }, observerOptions);
    
    counterElements.forEach(el => counterObserver.observe(el));
}

/* ======================================
   SISTEMA DE CARDS UNIVERSAL
   ====================================== */

// Efectos universales para cards
function addUniversalCardEffects() {
    const cards = document.querySelectorAll(
        '.card, .card-base, .proceso-card, .program-card, .sede-card, .stat-card, .mvp-card, .service-feature-card, .requisito-card, .complementary-card, .financial-card, .practical-card, .achievement-card, .philosophy-card, .testimonial-card, .profile-card'
    );
    
    cards.forEach(card => {
        // Hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
            
            // Efecto en iconos si existen
            const icon = this.querySelector('.main-icon, .secondary-icon, .process-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
            
            const icon = this.querySelector('.main-icon, .secondary-icon, .process-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
}

/* ======================================
   SISTEMA DE RIPPLES
   ====================================== */

// Crear efecto ripple
function createRipple(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
    `;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Inicializar ripples universales
function initUniversalRipples() {
    const rippleElements = document.querySelectorAll('.cta-button, .contact-item, .footer-nav-link, button, [data-ripple]');
    
    rippleElements.forEach(element => {
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        
        element.addEventListener('click', function(e) {
            createRipple(this, e);
        });
    });
}

/* ======================================
   GESTIÓN DE ESTADOS DE CARGA
   ====================================== */

// Loading states para elementos
function setLoadingState(element, isLoading) {
    if (isLoading) {
        element.classList.add('loading');
        element.setAttribute('aria-busy', 'true');
    } else {
        element.classList.remove('loading');
        element.removeAttribute('aria-busy');
    }
}

/* ======================================
   RESPONSIVE UTILITIES
   ====================================== */

// Detectar breakpoints
function getBreakpoint() {
    const width = window.innerWidth;
    if (width <= 848) return 'mobile';
    if (width <= 1312) return 'tablet';
    return 'desktop';
}

// Ejecutar función según breakpoint
function onBreakpoint(breakpoint, callback) {
    if (getBreakpoint() === breakpoint) {
        callback();
    }
}

/* ======================================
   INICIALIZACIÓN GLOBAL
   ====================================== */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Global JS initialized - JMC Preuniversitario');
    
    // 1. Header y navegación (orden crítico)
    window.addEventListener('scroll', debouncedScrollHandler, { passive: true });
    setActiveNavLink();
    initSmoothScroll();
    addScrollProgress();
    initMobileNavigation();
    
    // 2. Animaciones y efectos visuales
    initUniversalAnimations();
    animateCounters();
    
    // 3. Efectos interactivos (con delay para evitar conflictos)
    setTimeout(() => {
        addUniversalCardEffects();
        initUniversalRipples();
    }, 500);
    
    console.log('✅ Header, footer and global functionalities loaded');
    console.log(`📱 Current breakpoint: ${getBreakpoint()}`);
});

// Resize handler universal
window.addEventListener('resize', debounce(function() {
    const breakpoint = getBreakpoint();
    console.log(`📐 Resized to: ${breakpoint} (${window.innerWidth}px)`);
    
    // Recalcular progress bar
    const progressBar = document.getElementById('scroll-progress-bar');
    if (progressBar) {
        const event = new Event('scroll');
        window.dispatchEvent(event);
    }
}, 250));

/* ======================================
   KEYFRAMES CSS DINÁMICOS
   ====================================== */

// Agregar keyframes para ripple si no existen
if (!document.querySelector('#ripple-keyframes')) {
    const style = document.createElement('style');
    style.id = 'ripple-keyframes';
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

/* ======================================
   EXPORT PARA DEBUGGING
   ====================================== */

// Funciones disponibles globalmente para debugging
window.jmcGlobal = {
    debounce,
    throttle,
    setActiveNavLink,
    animateCounters,
    createRipple,
    setLoadingState,
    getBreakpoint,
    onBreakpoint
};

// Console info
console.log('🔧 JMC Global functions available via window.jmcGlobal');
console.log('📊 Functions: debounce, throttle, setActiveNavLink, animateCounters, createRipple, setLoadingState, getBreakpoint, onBreakpoint');
console.log('🎨 Developed by Alexandre Castillo - ACastillo DG');

/* ======================================
   FIN DEL ARCHIVO GLOBAL.JS
   ====================================== */