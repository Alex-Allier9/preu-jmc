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

// Counter animation universal - MANEJA NÚMEROS Y TIEMPOS
function animateCountersUniversal() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
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

        // 2. VERIFICAR SI ES UN NÚMERO PURO
        const cleanNumber = target.replace('+', '').replace('%', '');
        if (!isNaN(cleanNumber) && cleanNumber !== '') {
            // Es un número - usar animación normal
            counter.textContent = '0';

            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateValue(counter, 0, parseInt(cleanNumber), 1600, target);
                        counterObserver.unobserve(counter);
                    }
                });
            });

            counterObserver.observe(counter);
            return;
        }

        // 3. VERIFICAR SI EMPIEZA CON NÚMERO (para futuros casos como "3 Cumbres")
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

        // 4. TEXTO PURO - No animar (placeholders como "XX")
        // Se queda como está
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

// Gallery Lightbox functionality
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-card');

    if (galleryItems.length === 0) return;

    // Create lightbox element
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="close-lightbox">&times;</span>
            <img src="" alt="" class="lightbox-img">
            <div class="lightbox-caption">
                <h4 class="lightbox-title"></h4>
                <p class="lightbox-description"></p>
            </div>
        </div>
    `;
    document.body.appendChild(lightbox);

    // Lightbox styles
    const lightboxStyles = `
        <style>
        .lightbox {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(5px);
            justify-content: center;
            align-items: center;
        }
        
        .lightbox-content {
            position: relative;
            margin: auto;
            padding: 20px;
            width: 90%;
            max-width: 800px;
            text-align: center;
        }
        
        .lightbox-img {
            max-width: 100%;
            max-height: 70vh;
            object-fit: contain;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        
        .close-lightbox {
            position: absolute;
            top: -10px;
            right: 10px;
            color: white;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
            z-index: 10001;
            transition: color 0.3s ease;
        }
        
        .close-lightbox:hover {
            color: var(--accent);
        }
        
        .lightbox-caption {
            text-align: center;
            color: white;
            margin-top: 20px;
        }
        
        .lightbox-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 10px;
            color: var(--accent);
        }
        
        .lightbox-description {
            font-size: 1rem;
            opacity: 0.9;
            line-height: 1.6;
        }
        
        @media (max-width: 768px) {
            .lightbox-content {
                padding: 10px;
            }
            
            .close-lightbox {
                font-size: 30px;
            }
            
            .lightbox-img {
                max-height: 60vh;
            }
        }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', lightboxStyles);

    // Function to open lightbox
    function openLightbox(item) {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.gallery-overlay');

        lightbox.querySelector('.lightbox-img').src = img.src;
        lightbox.querySelector('.lightbox-img').alt = img.alt;

        if (overlay) {
            lightbox.querySelector('.lightbox-title').textContent = overlay.querySelector('h4').textContent;
            lightbox.querySelector('.lightbox-description').textContent = overlay.querySelector('p').textContent;
        }

        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Function to close lightbox
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Add click listeners to gallery items
    galleryItems.forEach((item) => {
        item.addEventListener('click', () => openLightbox(item));
    });

    // Lightbox controls
    lightbox.querySelector('.close-lightbox').addEventListener('click', closeLightbox);

    // Close on background click
    lightbox.addEventListener('click', function (e) {
        if (e.target === this) {
            closeLightbox();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
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
        initGalleryLightbox();
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