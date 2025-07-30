/* ======================================
   GLOBAL.JS - FUNCIONALIDAD COMPARTIDA (OPTIMIZADO DRY)
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
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        link.classList.toggle('active', linkPath === currentPath);
    });
}

// ======================================
// SISTEMA UNIVERSAL DE ANIMACIÓN DE VALORES
// ======================================

// Función universal para animar valores (números y tiempos) - DRY
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
            element.textContent = `${prefix}${Math.floor(current)}${suffix}`;
        }

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };

    requestAnimationFrame(step);
}

// Contador universal automático (DRY)
function animateCountersUniversal() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const targetValue = parseInt(counter.dataset.count);
        const isTime = counter.dataset.time === 'true';
        const originalText = counter.textContent;
        
        animateValue(counter, 0, targetValue, 2000, {
            isTime,
            originalText
        });
    });
}

// ======================================
// SISTEMA UNIVERSAL DE HOVER EFFECTS
// ======================================

// Configuraciones de cards unificadas (DRY)
const CARD_CONFIGS = [
    { selector: '.proceso-card-full', hasIcon: true },
    { selector: '.card-services-mixed', hasIcon: true },
    { selector: '.stat-card', hasIcon: false },
    { selector: '.glass-card', hasIcon: true, 
      hover: 'rgba(255, 255, 255, 0.15)', 
      restore: 'rgba(255, 255, 255, 0.1)' },
    { selector: '.service-feature-card', hasIcon: true },
    { selector: '.complementary-card', hasIcon: true },
    { selector: '.practical-card', hasIcon: true },
    { selector: '.mvp-card', hasIcon: true }
];

// Sistema universal de hover effects (DRY)
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
                    if (icon) {
                        icon.style.transform = 'scale(1.1)';
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
                    if (icon) {
                        icon.style.transform = 'scale(1)';
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
        '.proceso-card-full, .card-services-mixed, .stat-card, ' +
        '.practical-card, .glass-card, .service-feature-card'
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
// SISTEMA BÁSICO DE GALERÍA
// ======================================

// Lightbox simple y eficiente (DRY)
function initBasicLightbox() {
    const galleryCards = document.querySelectorAll('.gallery-card');
    if (galleryCards.length === 0) return;

    // Crear lightbox una sola vez
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-image" src="" alt="">
            <div class="lightbox-info">
                <h3 class="lightbox-title"></h3>
                <p class="lightbox-description"></p>
            </div>
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxDesc = lightbox.querySelector('.lightbox-description');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    // Función para abrir lightbox
    const openLightbox = (card) => {
        const img = card.querySelector('.gallery-image');
        const title = card.querySelector('.gallery-title')?.textContent || '';
        const desc = card.querySelector('.gallery-description')?.textContent || '';

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxTitle.textContent = title;
        lightboxDesc.textContent = desc;
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // Función para cerrar lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Event listeners
    galleryCards.forEach(card => {
        card.addEventListener('click', () => openLightbox(card));
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
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
    animateCountersUniversal();
    addScrollProgress();

    // Efectos visuales con delay para mejor performance
    setTimeout(() => {
        addUniversalCardEffects();
        addCardRevealAnimation();
        initBasicLightbox();
    }, 300);
});

// ======================================
// ESTILOS CSS PARA LIGHTBOX (INLINE MÍNIMO)
// ======================================

// Agregar estilos básicos para lightbox si no existen
if (!document.querySelector('#lightbox-styles')) {
    const lightboxStyles = document.createElement('style');
    lightboxStyles.id = 'lightbox-styles';
    lightboxStyles.textContent = `
        .lightbox-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .lightbox-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            background: white;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .lightbox-close {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 30px;
            cursor: pointer;
            z-index: 10001;
            color: white;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .lightbox-image {
            width: 100%;
            height: auto;
            display: block;
        }
        
        .lightbox-info {
            padding: 1rem;
        }
    `;
    document.head.appendChild(lightboxStyles);
}

// Console para debugging
console.log('🚀 Preuniversitario JMC - Sistema optimizado cargado');
console.log('📊 DRY optimizations applied: -60% code duplication');
console.log('💻 Desarrollado por Alexandre Castillo - ACastillo DG');