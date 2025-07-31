// ======================================
// UNIVERSAL GALLERY SYSTEM - SISTEMA CATEGORIZADO
// ======================================

/**
 * Universal Gallery Lightbox System con soporte para categorías
 * Compatible con los estilos CSS existentes en cards.css
 */
class UniversalGallery {
    constructor(options = {}) {
        this.options = {
            gallerySelector: '.gallery-card',
            lightboxId: 'lightbox-overlay',
            imageSelector: '.gallery-image',
            titleSelector: '.gallery-title',
            descriptionSelector: '.gallery-description',
            categoryAttribute: 'data-category',
            showNavigation: false,
            showCategoryInfo: true,  // Mostrar info de categoría
            autoClose: true,
            fadeSpeed: 300,
            keyboardNavigation: true,
            touchNavigation: true,
            ...options
        };
        
        this.currentIndex = 0;
        this.currentCategory = null;
        this.galleryItems = [];
        this.categoryItems = [];  // Items filtrados por categoría
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
            this.updateReferences();
            return;
        }
        
        // Crear elemento lightbox usando las clases CSS existentes
        this.lightbox = document.createElement('div');
        this.lightbox.id = this.options.lightboxId;
        this.lightbox.className = 'lightbox-overlay';
        
        this.lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="" alt="" class="lightbox-image">
                <div class="lightbox-info">
                    <h4 class="lightbox-title"></h4>
                    <p class="lightbox-description"></p>
                    ${this.options.showCategoryInfo ? '<p class="lightbox-category-info"></p>' : ''}
                </div>
            </div>
            <span class="lightbox-close" style="position: absolute; top: 2rem; right: 2rem; color: white; font-size: 1.5rem; cursor: pointer; z-index: 10002; background: rgba(16, 24, 32, 0.8); width: 3rem; height: 3rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); transition: all 0.3s ease;">
                <span class="material-symbols-rounded">close_small</span>
            </span>
            ${this.options.showNavigation ? `
                <button class="lightbox-nav prev" data-direction="prev" style="position: absolute; top: 50%; left: 2rem; transform: translateY(-50%); background: rgba(16, 24, 32, 0.8); color: white; border: none; width: 3rem; height: 3rem; border-radius: 50%; cursor: pointer; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; z-index: 10002;">
                    <span class="material-symbols-rounded">chevron_left</span>
                </button>
                <button class="lightbox-nav next" data-direction="next" style="position: absolute; top: 50%; right: 2rem; transform: translateY(-50%); background: rgba(16, 24, 32, 0.8); color: white; border: none; width: 3rem; height: 3rem; border-radius: 50%; cursor: pointer; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; z-index: 10002;">
                    <span class="material-symbols-rounded">chevron_right</span>
                </button>
            ` : ''}
        `;
        
        document.body.appendChild(this.lightbox);
        this.updateReferences();
        
        // Aplicar estilos adicionales para controles externos
        this.applyNavigationStyles();
    }
    
    updateReferences() {
        // Referencias a elementos usando las clases CSS existentes
        this.lightboxContent = this.lightbox.querySelector('.lightbox-content');
        this.lightboxImage = this.lightbox.querySelector('.lightbox-image');
        this.lightboxTitle = this.lightbox.querySelector('.lightbox-title');
        this.lightboxDescription = this.lightbox.querySelector('.lightbox-description');
        this.lightboxCategoryInfo = this.lightbox.querySelector('.lightbox-category-info');
        this.closeButton = this.lightbox.querySelector('.lightbox-close');
        
        if (this.options.showNavigation) {
            this.prevButton = this.lightbox.querySelector('.lightbox-nav.prev');
            this.nextButton = this.lightbox.querySelector('.lightbox-nav.next');
        }
    }
    
    applyNavigationStyles() {
        // Estilos adicionales para los botones de navegación y el botón cerrar
        const style = document.createElement('style');
        style.id = 'lightbox-nav-styles';
        if (!document.querySelector('#lightbox-nav-styles')) {
            style.textContent = `
                .lightbox-close:hover {
                    color: #F4DA40 !important;
                    background: rgba(16, 24, 32, 0.95) !important;
                    transform: scale(1.1) !important;
                }
                
                .lightbox-nav:hover {
                    background: rgba(16, 24, 32, 0.95) !important;
                    color: #F4DA40 !important;
                    transform: translateY(-50%) scale(1.1) !important;
                }
                
                .lightbox-category-info {
                    font-size: 0.9rem !important;
                    opacity: 0.8 !important;
                    color: #F4DA40 !important;
                    margin-top: 0.5rem !important;
                    font-weight: 600 !important;
                }
                
                @media (max-width: 53rem) {
                    .lightbox-close {
                        top: 1rem !important;
                        right: 1rem !important;
                        width: 2.5rem !important;
                        height: 2.5rem !important;
                        font-size: 1.2rem !important;
                    }
                    
                    .lightbox-close .material-symbols-rounded {
                        font-size: 1.2rem !important;
                    }
                    
                    .lightbox-nav {
                        width: 2.5rem !important;
                        height: 2.5rem !important;
                        font-size: 1.2rem !important;
                    }
                    
                    .lightbox-nav.prev {
                        left: 1rem !important;
                    }
                    
                    .lightbox-nav.next {
                        right: 1rem !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    findGalleryItems() {
        this.galleryItems = Array.from(document.querySelectorAll(this.options.gallerySelector));
        
        console.log(`🖼️ Gallery encontró ${this.galleryItems.length} imágenes`);
        
        // Mapear categorías disponibles
        const categories = new Set();
        this.galleryItems.forEach(item => {
            const category = item.getAttribute(this.options.categoryAttribute);
            if (category) categories.add(category);
        });
        
        console.log(`📂 Categorías encontradas: ${Array.from(categories).join(', ')}`);
        
        this.galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const category = item.getAttribute(this.options.categoryAttribute);
                this.openCategorizedLightbox(item, category);
            });
            
            // Agregar cursor pointer si no existe
            if (!item.style.cursor) {
                item.style.cursor = 'pointer';
            }
        });
    }
    
    openCategorizedLightbox(clickedItem, category) {
        // Filtrar items por categoría
        if (category) {
            this.categoryItems = this.galleryItems.filter(item => 
                item.getAttribute(this.options.categoryAttribute) === category
            );
            this.currentCategory = category;
        } else {
            // Si no hay categoría, usar todos los items
            this.categoryItems = [...this.galleryItems];
            this.currentCategory = null;
        }
        
        // Encontrar el índice del item clickeado dentro de la categoría
        this.currentIndex = this.categoryItems.indexOf(clickedItem);
        
        console.log(`🖼️ Abriendo galería categorizada: ${category || 'todas'}`);
        console.log(`📸 Imágenes en esta categoría: ${this.categoryItems.length}`);
        console.log(`🎯 Imagen actual: ${this.currentIndex + 1}/${this.categoryItems.length}`);
        
        this.openLightbox(this.currentIndex);
    }
    
    openLightbox(index) {
        this.isOpen = true;
        
        const item = this.categoryItems[index];
        const image = item.querySelector(this.options.imageSelector);
        const title = item.querySelector(this.options.titleSelector);
        const description = item.querySelector(this.options.descriptionSelector);
        
        // Actualizar contenido
        this.lightboxImage.src = image.src;
        this.lightboxImage.alt = image.alt || '';
        
        if (title && title.textContent.trim()) {
            this.lightboxTitle.textContent = title.textContent;
            this.lightboxTitle.style.display = 'block';
        } else {
            this.lightboxTitle.style.display = 'none';
        }
        
        if (description && description.textContent.trim()) {
            this.lightboxDescription.textContent = description.textContent;
            this.lightboxDescription.style.display = 'block';
        } else {
            this.lightboxDescription.style.display = 'none';
        }
        
        // Mostrar información de categoría
        if (this.lightboxCategoryInfo && this.options.showCategoryInfo) {
            const categoryName = this.formatCategoryName(this.currentCategory);
            const categoryInfo = this.categoryItems.length > 1 
                ? `${index + 1} de ${this.categoryItems.length} - ${categoryName}`
                : categoryName;
            this.lightboxCategoryInfo.textContent = categoryInfo;
            this.lightboxCategoryInfo.style.display = 'block';
        }
        
        // Si no hay título ni descripción, ocultar info
        if ((!title || !title.textContent.trim()) && (!description || !description.textContent.trim()) && !this.options.showCategoryInfo) {
            this.lightbox.querySelector('.lightbox-info').style.display = 'none';
        } else {
            this.lightbox.querySelector('.lightbox-info').style.display = 'block';
        }
        
        // Mostrar lightbox usando las clases CSS existentes
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
    
    formatCategoryName(category) {
        if (!category) return 'Galería';
        
        // Convertir de kebab-case a Title Case
        return category
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    
    bindEvents() {
        // Cerrar lightbox al hacer click fuera
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });
        
        // Botón cerrar (ahora está fuera del lightbox-content)
        if (this.closeButton) {
            this.closeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeLightbox();
            });
        }
        
        // Navegación con botones (ahora están fuera del lightbox-content)
        if (this.options.showNavigation) {
            if (this.prevButton) {
                this.prevButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.previousImage();
                });
            }
            
            if (this.nextButton) {
                this.nextButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.nextImage();
                });
            }
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
    
    closeLightbox() {
        this.isOpen = false;
        this.lightbox.classList.remove('active');
        
        console.log('🖼️ Cerrando lightbox');
        
        setTimeout(() => {
            this.lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
            // Limpiar categoría actual
            this.currentCategory = null;
            this.categoryItems = [];
        }, this.options.fadeSpeed);
    }
    
    nextImage() {
        if (this.currentIndex < this.categoryItems.length - 1) {
            this.currentIndex++;
            this.openLightbox(this.currentIndex);
        } else if (this.categoryItems.length > 1) {
            this.currentIndex = 0;
            this.openLightbox(this.currentIndex); // Volver al principio de la categoría
        }
    }
    
    previousImage() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.openLightbox(this.currentIndex);
        } else if (this.categoryItems.length > 1) {
            this.currentIndex = this.categoryItems.length - 1;
            this.openLightbox(this.currentIndex); // Ir al final de la categoría
        }
    }
    
    updateNavigation() {
        if (!this.options.showNavigation) return;
        
        // Mostrar/ocultar botones según disponibilidad en la categoría actual
        if (this.categoryItems.length <= 1) {
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
        
        // Remover estilos de navegación si existen
        const navStyles = document.querySelector('#lightbox-nav-styles');
        if (navStyles && navStyles.parentNode) {
            navStyles.parentNode.removeChild(navStyles);
        }
        
        this.galleryItems = [];
        this.categoryItems = [];
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
 * Auto-inicialización cuando el DOM esté listo - COMPATIBLE CON CATEGORÍAS
 */
function autoInitGallery() {
    const galleryCards = document.querySelectorAll('.gallery-card');
    
    console.log(`🖼️ Auto-inicializando galería categorizada con ${galleryCards.length} elementos`);
    
    if (galleryCards.length > 0) {
        // Verificar si hay categorías
        const hasCategories = Array.from(galleryCards).some(card => 
            card.hasAttribute('data-category')
        );
        
        const defaultOptions = {
            showNavigation: galleryCards.length > 1,
            showCategoryInfo: hasCategories,
            keyboardNavigation: true,
            touchNavigation: true
        };
        
        const gallery = new UniversalGallery(defaultOptions);
        console.log(`✅ Universal Gallery categorizada inicializada con ${galleryCards.length} imágenes`);
        
        if (hasCategories) {
            console.log('📂 Sistema de categorías detectado y activado');
        }
        
        // Hacer disponible globalmente para debugging
        window.universalGallery = gallery;
        
        return gallery;
    } else {
        console.log('⚠️ No se encontraron elementos .gallery-card para inicializar');
    }
}

// ======================================
// AUTO-INICIALIZACIÓN AUTOMÁTICA
// ======================================

// Inicialización automática al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🖼️ Gallery.js categorizado cargado - iniciando auto-detección...');
    
    // Delay corto para asegurar que todo el HTML esté renderizado
    setTimeout(() => {
        autoInitGallery();
    }, 100);
});

// También intentar inicialización si el DOM ya está cargado
if (document.readyState === 'loading') {
    // DOM aún cargando, usar DOMContentLoaded (arriba)
    console.log('🖼️ DOM aún cargando, esperando DOMContentLoaded...');
} else {
    // DOM ya cargado, inicializar inmediatamente
    console.log('🖼️ DOM ya cargado, inicializando galería inmediatamente...');
    setTimeout(() => {
        autoInitGallery();
    }, 100);
}

// Hacer funciones disponibles globalmente
if (typeof window !== 'undefined') {
    window.UniversalGallery = UniversalGallery;
    window.initUniversalGallery = initUniversalGallery;
    window.autoInitGallery = autoInitGallery;
}

console.log('🖼️ Universal Gallery System CATEGORIZADO cargado');
console.log('✨ Auto-inicialización configurada y activa');
console.log('📂 Sistema de categorías: data-category="nombre-categoria"');
console.log('🎯 Navegación por categorías individuales activada');
console.log('💻 Desarrollado por Alexandre Castillo - ACastillo DG');