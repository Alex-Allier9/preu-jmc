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
 */
function initUniversalGallery(options = {}) {
    return new UniversalGallery(options);
}

/**
 * Crear estructura HTML para una galería
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
 * Auto-inicialización cuando el DOM esté listo
 */
function autoInitGallery() {
    const galleryCards = document.querySelectorAll('.gallery-card');
    
    if (galleryCards.length > 0) {
        const defaultOptions = {
            showNavigation: galleryCards.length > 1,
            keyboardNavigation: true,
            touchNavigation: true
        };
        
        const gallery = new UniversalGallery(defaultOptions);
        console.log(`Universal Gallery initialized with ${galleryCards.length} images`);
        
        return gallery;
    }
}

// Configuraciones predefinidas
const galleryPresets = {
    basic: {
        showNavigation: false,
        keyboardNavigation: false,
        touchNavigation: false
    },
    full: {
        showNavigation: true,
        keyboardNavigation: true,
        touchNavigation: true
    },
    mobile: {
        showNavigation: false,
        keyboardNavigation: false,
        touchNavigation: true
    }
};