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

// ======================================
// SISTEMA UNIVERSAL DE ANIMACIÓN DE VALORES Y TIEMPOS
// ======================================

// Animate value function optimizada (números normales)
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
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
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

// ======================================
// UNIVERSAL GALLERY SYSTEM
// ======================================

/**
 * Universal Gallery Lightbox System
 * Sistema de lightbox reutilizable para galerías
 */
class UniversalGallery {
    constructor(options = {}) {
        this.options = {
            gallerySelector: '.gallery-card',
            lightboxId: 'universal-lightbox',
            imageSelector: '.gallery-image',
            titleSelector: '.gallery-title',
            descriptionSelector: '.gallery-description',
            showNavigation: false,
            autoClose: true,
            fadeSpeed: 300,
            keyboardNavigation: true,
            touchNavigation: true,
            ...options
        };
        
        this.currentIndex = 0;
        this.galleryItems = [];
        this.isOpen = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    init() {
        this.createLightbox();
        this.bindEvents();
        this.findGalleryItems();
    }
    
    createLightbox() {
        // Verificar si ya existe
        if (document.getElementById(this.options.lightboxId)) {
            this.lightbox = document.getElementById(this.options.lightboxId);
            return;
        }
        
        // Crear elemento lightbox
        this.lightbox = document.createElement('div');
        this.lightbox.id = this.options.lightboxId;
        this.lightbox.className = 'universal-lightbox';
        
        this.lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                ${this.options.showNavigation ? `
                    <button class="lightbox-nav prev" data-direction="prev">
                        <span class="material-symbols-rounded">chevron_left</span>
                    </button>
                    <button class="lightbox-nav next" data-direction="next">
                        <span class="material-symbols-rounded">chevron_right</span>
                    </button>
                ` : ''}
                <img src="" alt="" class="lightbox-image">
                <div class="lightbox-info">
                    <h4 class="lightbox-title"></h4>
                    <p class="lightbox-description"></p>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.lightbox);
        
        // Referencias a elementos
        this.lightboxContent = this.lightbox.querySelector('.lightbox-content');
        this.lightboxImage = this.lightbox.querySelector('.lightbox-image');
        this.lightboxTitle = this.lightbox.querySelector('.lightbox-title');
        this.lightboxDescription = this.lightbox.querySelector('.lightbox-description');
        this.closeButton = this.lightbox.querySelector('.lightbox-close');
        
        if (this.options.showNavigation) {
            this.prevButton = this.lightbox.querySelector('.lightbox-nav.prev');
            this.nextButton = this.lightbox.querySelector('.lightbox-nav.next');
        }
    }
    
    findGalleryItems() {
        this.galleryItems = Array.from(document.querySelectorAll(this.options.gallerySelector));
        
        this.galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.openLightbox(index);
            });
        });
    }
    
    bindEvents() {
        // Cerrar lightbox
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });
        
        // Botón cerrar
        this.lightbox.addEventListener('click', (e) => {
            if (e.target.classList.contains('lightbox-close')) {
                this.closeLightbox();
            }
        });
        
        // Navegación con botones
        if (this.options.showNavigation) {
            this.lightbox.addEventListener('click', (e) => {
                if (e.target.closest('.lightbox-nav')) {
                    const direction = e.target.closest('.lightbox-nav').dataset.direction;
                    if (direction === 'prev') {
                        this.previousImage();
                    } else if (direction === 'next') {
                        this.nextImage();
                    }
                }
            });
        }
        
        // Navegación con teclado
        if (this.options.keyboardNavigation) {
            document.addEventListener('keydown', (e) => {
                if (!this.isOpen) return;
                
                switch (e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        if (this.options.showNavigation) this.previousImage();
                        break;
                    case 'ArrowRight':
                        if (this.options.showNavigation) this.nextImage();
                        break;
                }
            });
        }
        
        // Navegación táctil
        if (this.options.touchNavigation) {
            this.lightbox.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            });
            
            this.lightbox.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            });
        }
    }
    
    openLightbox(index) {
        this.currentIndex = index;
        this.isOpen = true;
        
        const item = this.galleryItems[index];
        const image = item.querySelector(this.options.imageSelector);
        const title = item.querySelector(this.options.titleSelector);
        const description = item.querySelector(this.options.descriptionSelector);
        
        // Actualizar contenido
        this.lightboxImage.src = image.src;
        this.lightboxImage.alt = image.alt || '';
        
        if (title) {
            this.lightboxTitle.textContent = title.textContent;
            this.lightboxTitle.style.display = 'block';
        } else {
            this.lightboxTitle.style.display = 'none';
        }
        
        if (description) {
            this.lightboxDescription.textContent = description.textContent;
            this.lightboxDescription.style.display = 'block';
        } else {
            this.lightboxDescription.style.display = 'none';
        }
        
        // Mostrar lightbox
        this.lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Añadir clase active con delay para animación
        setTimeout(() => {
            this.lightbox.classList.add('active');
        }, 10);
        
        // Actualizar navegación
        if (this.options.showNavigation) {
            this.updateNavigation();
        }
    }
    
    closeLightbox() {
        this.isOpen = false;
        this.lightbox.classList.remove('active');
        
        setTimeout(() => {
            this.lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, this.options.fadeSpeed);
    }
    
    nextImage() {
        if (this.currentIndex < this.galleryItems.length - 1) {
            this.openLightbox(this.currentIndex + 1);
        } else if (this.galleryItems.length > 1) {
            this.openLightbox(0); // Volver al principio
        }
    }
    
    previousImage() {
        if (this.currentIndex > 0) {
            this.openLightbox(this.currentIndex - 1);
        } else if (this.galleryItems.length > 1) {
            this.openLightbox(this.galleryItems.length - 1); // Ir al final
        }
    }
    
    updateNavigation() {
        if (!this.options.showNavigation) return;
        
        // Mostrar/ocultar botones según disponibilidad
        if (this.galleryItems.length <= 1) {
            if (this.prevButton) this.prevButton.style.display = 'none';
            if (this.nextButton) this.nextButton.style.display = 'none';
        } else {
            if (this.prevButton) this.prevButton.style.display = 'flex';
            if (this.nextButton) this.nextButton.style.display = 'flex';
        }
    }
    
    handleSwipe() {
        if (!this.options.touchNavigation || !this.options.showNavigation) return;
        
        const swipeThreshold = 50;
        const swipeDistance = this.touchEndX - this.touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                this.previousImage(); // Swipe derecha = imagen anterior
            } else {
                this.nextImage(); // Swipe izquierda = imagen siguiente
            }
        }
    }
    
    // Método para refrescar la galería (útil para contenido dinámico)
    refresh() {
        this.findGalleryItems();
    }
    
    // Método para destruir la instancia
    destroy() {
        if (this.lightbox && this.lightbox.parentNode) {
            this.lightbox.parentNode.removeChild(this.lightbox);
        }
        this.galleryItems = [];
        this.isOpen = false;
    }
}

// ======================================
// HELPER FUNCTIONS
// ======================================

/**
 * Inicializar galería automáticamente
 * @param {Object} options - Opciones de configuración
 */
function initUniversalGallery(options = {}) {
    return new UniversalGallery(options);
}

/**
 * Crear estructura HTML para una galería
 * @param {Array} images - Array de objetos con información de imágenes
 * @param {Object} options - Opciones de configuración
 */
function createGalleryHTML(images, options = {}) {
    const config = {
        containerClass: 'gallery-container',
        gridClass: 'gallery-grid',
        title: '',
        subtitle: '',
        showZoomIcon: true,
        ...options
    };
    
    const galleryHTML = `
        <div class="${config.containerClass}">
            ${config.title || config.subtitle ? `
                <div class="gallery-header">
                    ${config.title ? `<h3 class="gallery-main-title">${config.title}</h3>` : ''}
                    ${config.subtitle ? `<p class="gallery-subtitle">${config.subtitle}</p>` : ''}
                </div>
            ` : ''}
            <div class="${config.gridClass}">
                ${images.map(image => `
                    <div class="gallery-card">
                        <img src="${image.src}" alt="${image.alt || ''}" class="gallery-image">
                        ${config.showZoomIcon ? `
                            <div class="gallery-zoom-icon">
                                <span class="material-symbols-rounded">zoom_in</span>
                            </div>
                        ` : ''}
                        ${image.title || image.description ? `
                            <div class="gallery-overlay">
                                ${image.title ? `<h4 class="gallery-title">${image.title}</h4>` : ''}
                                ${image.description ? `<p class="gallery-description">${image.description}</p>` : ''}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    return galleryHTML;
}

/**
 * Agregar efectos hover universales a gallery cards
 */
function addGalleryCardEffects() {
    const galleryCards = document.querySelectorAll('.gallery-card');
    
    galleryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 25px 70px rgba(0, 0, 0, 0.15)';
            
            const image = this.querySelector('.gallery-image');
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
            
            const overlay = this.querySelector('.gallery-overlay');
            if (overlay) {
                overlay.style.transform = 'translateY(0)';
            }
            
            const zoomIcon = this.querySelector('.gallery-zoom-icon');
            if (zoomIcon) {
                zoomIcon.style.opacity = '1';
                zoomIcon.style.transform = 'scale(1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            
            const image = this.querySelector('.gallery-image');
            if (image) {
                image.style.transform = 'scale(1)';
            }
            
            const overlay = this.querySelector('.gallery-overlay');
            if (overlay) {
                overlay.style.transform = 'translateY(100%)';
            }
            
            const zoomIcon = this.querySelector('.gallery-zoom-icon');
            if (zoomIcon) {
                zoomIcon.style.opacity = '0';
                zoomIcon.style.transform = 'scale(0.8)';
            }
        });
    });
}

// ======================================
// AUTO INITIALIZATION
// ======================================

// Función para inicializar automáticamente cuando el DOM esté listo
function autoInitGallery() {
    // Verificar si hay gallery cards en la página
    const galleryCards = document.querySelectorAll('.gallery-card');
    
    if (galleryCards.length > 0) {
        // Configuración por defecto
        const defaultOptions = {
            showNavigation: galleryCards.length > 1,
            keyboardNavigation: true,
            touchNavigation: true
        };
        
        // Inicializar galería
        const gallery = new UniversalGallery(defaultOptions);
        
        // Agregar efectos hover
        addGalleryCardEffects();
        
        console.log(`Universal Gallery initialized with ${galleryCards.length} images`);
        
        return gallery;
    }
}

/**
 * Función helper para crear galerías desde JavaScript
 * Útil para páginas que cargan contenido dinámicamente
 */
function createDynamicGallery(containerId, images, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id "${containerId}" not found`);
        return;
    }
    
    const defaultOptions = {
        title: 'Galería',
        subtitle: '',
        showZoomIcon: true,
        showNavigation: true
    };
    
    const config = { ...defaultOptions, ...options };
    
    // Crear HTML de la galería
    const galleryHTML = createGalleryHTML(images, config);
    container.innerHTML = galleryHTML;
    
    // Inicializar la galería
    const gallery = new UniversalGallery({
        showNavigation: config.showNavigation,
        keyboardNavigation: true,
        touchNavigation: true
    });
    
    // Agregar efectos hover
    addGalleryCardEffects();
    
    return gallery;
}

/**
 * Configuraciones predefinidas para diferentes tipos de galerías
 */
const galleryPresets = {
    // Galería básica sin navegación
    basic: {
        showNavigation: false,
        keyboardNavigation: false,
        touchNavigation: false
    },
    
    // Galería completa con todas las funciones
    full: {
        showNavigation: true,
        keyboardNavigation: true,
        touchNavigation: true
    },
    
    // Galería para portfolios
    portfolio: {
        showNavigation: true,
        keyboardNavigation: true,
        touchNavigation: true,
        autoClose: false
    },
    
    // Galería para móviles optimizada
    mobile: {
        showNavigation: false,
        keyboardNavigation: false,
        touchNavigation: true
    }
};

/**
 * Inicializar galería con preset
 */
function initGalleryWithPreset(presetName, customOptions = {}) {
    const preset = galleryPresets[presetName] || galleryPresets.basic;
    const options = { ...preset, ...customOptions };
    
    return new UniversalGallery(options);
}

// ======================================
// UNIVERSAL STATS GRID SYSTEM
// ======================================

/**
 * Maneja el comportamiento responsive de stats grids
 * En tablet muestra máximo 4 cards (2x2), en mobile y desktop todas
 */
function handleUniversalStatsGridResize() {
    const statsGrids = document.querySelectorAll('.stats-grid, .results .stats-grid, .grid-4-2-1 .stat-card');
    const windowWidth = window.innerWidth;

    statsGrids.forEach(grid => {
        // Si es un grid container, buscar las cards dentro
        const cards = grid.classList.contains('stat-card') 
            ? [grid] 
            : grid.querySelectorAll('.stat-card');

        // Vista tablet - asegurar exactamente 4 cards (2x2)
        if (windowWidth <= 1312 && windowWidth > 848) { // var(--tablet) y var(--mobile)
            cards.forEach((card, index) => {
                card.style.display = index < 4 ? 'flex' : 'none';
            });
        }
        // Vista móvil y desktop - mostrar todas las cards
        else {
            cards.forEach(card => {
                card.style.display = 'flex';
            });
        }
    });
}

/**
 * Sistema universal para cualquier grid que necesite limitar elementos en tablet
 * @param {string} gridSelector - Selector del grid container
 * @param {string} itemSelector - Selector de los elementos dentro del grid  
 * @param {number} tabletLimit - Número máximo de elementos en tablet
 */
function handleCustomGridResize(gridSelector, itemSelector, tabletLimit = 4) {
    const grids = document.querySelectorAll(gridSelector);
    const windowWidth = window.innerWidth;

    grids.forEach(grid => {
        const items = grid.querySelectorAll(itemSelector);

        // Vista tablet - limitar elementos
        if (windowWidth <= 1312 && windowWidth > 848) {
            items.forEach((item, index) => {
                item.style.display = index < tabletLimit ? 'flex' : 'none';
            });
        }
        // Vista móvil y desktop - mostrar todos
        else {
            items.forEach(item => {
                item.style.display = 'flex';
            });
        }
    });
}

/**
 * Auto-detectar y aplicar comportamiento responsive a grids comunes
 */
function initUniversalGridBehaviors() {
    // Stats grids
    handleUniversalStatsGridResize();
    
    // Achievement grids (para fundador)
    handleCustomGridResize('.achievements-grid', '.achievement-card', 3);
    
    // Gallery grids ya tienen su propio sistema responsive
    
    // Agregar listener para resize
    window.addEventListener('resize', debounce(() => {
        handleUniversalStatsGridResize();
        handleCustomGridResize('.achievements-grid', '.achievement-card', 3);
        // Agregar más grids según necesidad
    }, 100));
}

// Initialize on page load - OPTIMIZADA CON TODOS LOS SISTEMAS
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
    animateCountersUniversal(); // CAMBIADO: Ahora incluye animación de tiempos
    addScrollProgress();

    // Esperar a que las animaciones iniciales se establezcan antes de agregar efectos hover
    setTimeout(() => {
        addUniversalCardEffects();
        addProcessCardEffects();
        addCardRevealAnimation();
        
        // Sistema universal de galería
        autoInitGallery();
        
        // Sistema universal de grids responsivos
        initUniversalGridBehaviors();
        
    }, 500);
});

// Si se está usando en el navegador, hacer disponible globalmente
if (typeof window !== 'undefined') {
    // Gallery system
    window.UniversalGallery = UniversalGallery;
    window.initUniversalGallery = initUniversalGallery;
    window.createGalleryHTML = createGalleryHTML;
    window.addGalleryCardEffects = addGalleryCardEffects;
    window.autoInitGallery = autoInitGallery;
    window.createDynamicGallery = createDynamicGallery;
    window.initGalleryWithPreset = initGalleryWithPreset;
    
    // Grid system
    window.handleUniversalStatsGridResize = handleUniversalStatsGridResize;
    window.handleCustomGridResize = handleCustomGridResize;
    window.initUniversalGridBehaviors = initUniversalGridBehaviors;
    
    // Animation system (nuevas funciones)
    window.animateTimeValue = animateTimeValue;
    window.parseTimeText = parseTimeText;
    window.animateCountersUniversal = animateCountersUniversal;
}

// Console log para debugging
console.log('Preuniversitario JMC - Página cargada exitosamente');
console.log('Universal Gallery System - Disponible globalmente');
console.log('Universal Grid System - Disponible globalmente');
console.log('Universal Time Animation System - Disponible globalmente');
console.log('Desarrollado por Alexandre Castillo - ACastillo DG');