// Performance optimization - debounce scroll events
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

// Header scroll effect optimizado
const debouncedScrollHandler = debounce(() => {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, 10);

// Intersection Observer para animaciones
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

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

// Función universal para efectos hover de tarjetas - EFECTO UNIFORME
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
        {
            selector: '.mvp-card',
            hasIcon: false
        },
        {
            selector: '.program-card',
            hasIcon: true
        },
        {
            selector: '.stat-card',
            hasIcon: false
        },
        {
            selector: '.value-card',
            hasIcon: true
        },
        {
            selector: '.card-services-mixed',
            hasIcon: true,
            hoverBackground: 'rgba(255, 255, 255, 0.15)',
            restoreBackground: 'rgba(255, 255, 255, 0.1)'
        },
        {
            selector: '.about-card',
            hasIcon: false,
            hoverBackground: 'rgba(255, 255, 255, 0.95)',
            restoreBackground: 'rgba(255, 255, 255, 0.9)'
        },
        {
            selector: '.quote-card',
            hasIcon: false,
            hoverBackground: 'rgba(255, 255, 255, 0.15)',
            restoreBackground: 'rgba(255, 255, 255, 0.1)'
        },
        // Cards específicas de servicios (centralizadas aquí)
        {
            selector: '.service-feature-card',
            hasIcon: true
        },
        {
            selector: '.glass-card',
            hasIcon: true
        },
        {
            selector: '.complementary-card',
            hasIcon: true
        },
        {
            selector: '.financial-card',
            hasIcon: true
        },
        {
            selector: '.practical-card',
            hasIcon: true
        }
    ];

    cardConfigs.forEach(config => {
        document.querySelectorAll(config.selector).forEach(card => {
            card.addEventListener('mouseenter', function () {
                // Efecto estándar para todas
                this.style.transform = standardHover.transform;
                this.style.boxShadow = standardHover.boxShadow;

                // Backgrounds específicos si los tienen
                if (config.hoverBackground) {
                    this.style.background = config.hoverBackground;
                }

                // Efecto de iconos si los tienen
                if (config.hasIcon) {
                    const iconContainer = this.querySelector('.main-icon-container, .secondary-icon-container');
                    const icon = this.querySelector('.material-symbols-rounded, .instagram-icon');
                    if (iconContainer && icon) {
                        iconContainer.style.transform = 'scale(1.1)';
                        icon.style.transform = 'scale(1.1)';
                    }
                }
            });

            card.addEventListener('mouseleave', function () {
                // Restaurar efecto estándar
                this.style.transform = standardRestore.transform;
                this.style.boxShadow = standardRestore.boxShadow;

                // Restaurar backgrounds específicos
                if (config.restoreBackground) {
                    this.style.background = config.restoreBackground;
                }

                // Restaurar iconos
                if (config.hasIcon) {
                    const iconContainer = this.querySelector('.main-icon-container, .secondary-icon-container');
                    const icon = this.querySelector('.material-symbols-rounded, .instagram-icon');
                    if (iconContainer && icon) {
                        iconContainer.style.transform = 'scale(1)';
                        icon.style.transform = 'scale(1)';
                    }
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

        card.addEventListener('mouseenter', function () {
            // Mismo efecto estándar que las otras cards
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
            if (stepIcon) {
                stepIcon.style.transform = 'scale(1.1)';
                stepIcon.style.boxShadow = '0 8px 20px rgba(65, 182, 230, 0.4)';
            }
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            if (stepIcon) {
                stepIcon.style.transform = 'scale(1)';
                stepIcon.style.boxShadow = '0 6px 18px rgba(65, 182, 230, 0.3)';
            }
        });

        // Click effect mantenido
        card.addEventListener('click', function () {
            this.style.transform = 'translateY(-5px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-8px) scale(1)';
            }, 150);
        });
    });
}

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
        height: 6px; /* Fixed height */
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
        background: linear-gradient(90deg, var(--primary), var(--accent));
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

// Card reveal animation with stagger - OPTIMIZADA
function addCardRevealAnimation() {
    const cards = document.querySelectorAll('.proceso-card-full, .program-card, .card-services-mixed, .stat-card, .mvp-card, .service-feature-card, .complementary-card, .practical-card, .financial-card, .glass-card');

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

// Initialize on page load - OPTIMIZADA
document.addEventListener('DOMContentLoaded', function () {
    // Activar el scroll listener
    window.addEventListener('scroll', debouncedScrollHandler);

    // Observar todos los elementos fade-in
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Configurar navegación activa
    setActiveNavLink();

    // Inicializar funcionalidades
    initSmoothScroll();
    animateCounters();
    addScrollProgress();

    // Esperar a que las animaciones iniciales se establezcan antes de agregar efectos hover
    setTimeout(() => {
        addUniversalCardEffects();
        addProcessCardEffects();
        addCardRevealAnimation();
    }, 500);
});

// Console log para debugging
console.log('Preuniversitario JMC - Página cargada exitosamente');
console.log('Desarrollado por Alexandre Castillo - ACastillo DG');