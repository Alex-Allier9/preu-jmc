// 🏔️ SISTEMA DE GALERÍA DINÁMICO - PREUNIVERSITARIO JMC
// Sistema de overlay/lightbox con layout 1/3 - 2/3

class GalleryOverlay {
    constructor(detectedPhotos) {
        this.detectedPhotos = detectedPhotos;
        this.isOpen = false;
        this.currentExpedition = null;
        this.currentPhotos = [];
        this.currentPhotoIndex = 0;
        this.overlay = null;
        this.isMobile = window.GalleryUtils.isMobile();
        
        // Touch handling
        this.touchStart = { x: 0, y: 0 };
        this.touchEnd = { x: 0, y: 0 };
        this.isUIVisible = true;
        this.hideUITimeout = null;
    }

    init() {
        console.log('🖼️ Inicializando sistema de overlay...');
        this.createOverlayStructure();
        console.log('✅ Sistema de overlay inicializado');
    }

    createOverlayStructure() {
        // Crear overlay en el DOM
        this.overlay = document.createElement('div');
        this.overlay.className = 'gallery-lightbox';
        this.overlay.style.display = 'none';
        
        this.overlay.innerHTML = `
            <!-- Botón cerrar -->
            <button class="overlay-close">
                <span class="material-symbols-rounded">close</span>
            </button>

            <!-- Contenido principal -->
            <div class="overlay-content">
                
                <!-- Panel izquierdo - Información (1/3) -->
                <div class="info-panel">
                    <!-- El contenido se genera dinámicamente -->
                </div>

                <!-- Panel derecho - Fotos (2/3) -->
                <div class="photos-panel">
                    
                    <!-- Contador de fotos -->
                    <div class="photo-counter">1 / 1</div>

                    <!-- Contenedor de foto principal -->
                    <div class="main-photo-container">
                        <!-- Botón anterior -->
                        <button class="nav-button prev">
                            <span class="material-symbols-rounded">arrow_back_ios</span>
                        </button>

                        <!-- Foto principal -->
                        <img src="" alt="" class="main-photo">

                        <!-- Botón siguiente -->
                        <button class="nav-button next">
                            <span class="material-symbols-rounded">arrow_forward_ios</span>
                        </button>
                    </div>

                    <!-- Thumbnails -->
                    <div class="thumbnails-container">
                        <!-- Los thumbnails se generan dinámicamente -->
                    </div>

                </div>

            </div>
        `;

        document.body.appendChild(this.overlay);
        this.setupOverlayEvents();
    }

    setupOverlayEvents() {
        // Botón cerrar
        const closeButton = this.overlay.querySelector('.overlay-close');
        closeButton.addEventListener('click', () => this.close());

        // Botones de navegación
        const prevButton = this.overlay.querySelector('.nav-button.prev');
        const nextButton = this.overlay.querySelector('.nav-button.next');
        
        prevButton.addEventListener('click', () => this.previousPhoto());
        nextButton.addEventListener('click', () => this.nextPhoto());

        // Click en overlay para cerrar (solo en el fondo)
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });

        // Touch events para móviles
        this.setupTouchEvents();
    }

    setupTouchEvents() {
        const photoContainer = this.overlay.querySelector('.main-photo-container');
        const mainPhoto = this.overlay.querySelector('.main-photo');

        // Touch events en el contenedor de fotos
        photoContainer.addEventListener('touchstart', (e) => {
            this.touchStart.x = e.touches[0].clientX;
            this.touchStart.y = e.touches[0].clientY;
        }, { passive: true });

        photoContainer.addEventListener('touchend', (e) => {
            this.touchEnd.x = e.changedTouches[0].clientX;
            this.touchEnd.y = e.changedTouches[0].clientY;
            this.handleTouchGesture();
        }, { passive: true });

        // Tap en foto principal
        mainPhoto.addEventListener('click', () => {
            if (this.isMobile) {
                this.toggleUI();
            }
        });

        // Double tap para zoom (implementación básica)
        let tapCount = 0;
        mainPhoto.addEventListener('touchend', (e) => {
            tapCount++;
            if (tapCount === 1) {
                setTimeout(() => {
                    if (tapCount === 1) {
                        // Single tap - toggle UI
                        this.toggleUI();
                    } else if (tapCount === 2) {
                        // Double tap - zoom
                        this.toggleZoom();
                    }
                    tapCount = 0;
                }, 300);
            }
        }, { passive: true });
    }

    handleTouchGesture() {
        const deltaX = this.touchEnd.x - this.touchStart.x;
        const deltaY = this.touchEnd.y - this.touchStart.y;
        const minSwipeDistance = 50;

        // Swipe horizontal (cambiar foto)
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.previousPhoto(); // Swipe derecha
                } else {
                    this.nextPhoto(); // Swipe izquierda
                }
            }
        }
        // Swipe vertical
        else if (Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0) {
                // Swipe hacia abajo - scroll hacia información
                this.scrollToInfo();
            } else {
                // Swipe hacia arriba - cerrar galería
                this.close();
            }
        }
    }

    toggleUI() {
        this.isUIVisible = !this.isUIVisible;
        const uiElements = this.overlay.querySelectorAll('.nav-button, .photo-counter, .thumbnails-container');
        
        uiElements.forEach(el => {
            el.style.opacity = this.isUIVisible ? '1' : '0';
            el.style.pointerEvents = this.isUIVisible ? 'auto' : 'none';
        });

        // Auto-mostrar UI después de 3 segundos si está oculta
        if (!this.isUIVisible) {
            clearTimeout(this.hideUITimeout);
            this.hideUITimeout = setTimeout(() => {
                this.isUIVisible = true;
                uiElements.forEach(el => {
                    el.style.opacity = '1';
                    el.style.pointerEvents = 'auto';
                });
            }, 3000);
        }
    }

    toggleZoom() {
        const mainPhoto = this.overlay.querySelector('.main-photo');
        const isZoomed = mainPhoto.style.transform.includes('scale');
        
        if (isZoomed) {
            mainPhoto.style.transform = '';
            mainPhoto.style.cursor = '';
        } else {
            mainPhoto.style.transform = 'scale(1.5)';
            mainPhoto.style.cursor = 'zoom-out';
        }
    }

    scrollToInfo() {
        if (this.isMobile) {
            const infoPanel = this.overlay.querySelector('.info-panel');
            infoPanel.scrollIntoView({ behavior: 'smooth' });
        }
    }

    open(expedition, photos, photoIndex = 0) {
        this.currentExpedition = expedition;
        this.currentPhotos = photos;
        this.currentPhotoIndex = photoIndex;
        this.isOpen = true;

        // Generar contenido
        this.renderExpeditionInfo();
        this.renderThumbnails();
        this.showPhoto(photoIndex);

        // Mostrar overlay
        this.overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Animación de entrada usando la clase CSS
        requestAnimationFrame(() => {
            this.overlay.classList.add('show');
        });

        // Precargar próxima imagen
        this.preloadNextImage();
    }

    close() {
        if (!this.isOpen) return;

        this.isOpen = false;
        this.overlay.classList.remove('show');
        
        setTimeout(() => {
            this.overlay.style.display = 'none';
            document.body.style.overflow = '';
            
            // Limpiar zoom si existe
            const mainPhoto = this.overlay.querySelector('.main-photo');
            mainPhoto.style.transform = '';
            mainPhoto.style.cursor = '';
        }, 300);

        // Limpiar timeouts
        clearTimeout(this.hideUITimeout);
    }

    renderExpeditionInfo() {
        const infoContent = this.overlay.querySelector('.info-panel');
        const expedition = this.currentExpedition;
        const photoCount = this.currentPhotos.length;

        // Generar badges de logros
        const achievementBadges = expedition.achievements.map(achievement => `
            <div class="achievement-badge">
                <span class="material-symbols-rounded gallery-badge-icon">${achievement.icon}</span>
                ${achievement.name}
            </div>
        `).join('');

        infoContent.innerHTML = `
            <!-- Header de la expedición -->
            <div class="expedition-header">
                <h1 class="expedition-title">${expedition.name}</h1>
                <p class="expedition-location">${expedition.location.fullLocation}</p>
            </div>

            <!-- Metadatos principales -->
            <div class="gallery-main-metadata">
                <div class="gallery-metadata-item">
                    <div class="metadata-label">Altitud</div>
                    <div class="metadata-value">${window.GalleryUtils.formatNumber(expedition.altitude)} ${expedition.altitudeUnit}</div>
                </div>
                <div class="gallery-metadata-item">
                    <div class="metadata-label">Fotos</div>
                    <div class="metadata-value">${photoCount} imágenes</div>
                </div>
            </div>

            <!-- Dificultad -->
            <div class="difficulty-display difficulty-${expedition.difficulty.grade}">
                <div class="difficulty-grade">${expedition.difficulty.grade} - ${expedition.difficulty.name}</div>
                <div class="difficulty-description">${expedition.difficulty.system}</div>
            </div>

            ${expedition.achievements.length > 0 ? `
            <!-- Logros especiales -->
            <div class="achievements-section">
                <h3 class="gallery-section-title">
                    <span class="material-symbols-rounded">trophy</span>
                    Logros Destacados
                </h3>
                <div class="achievements-list">
                    ${achievementBadges}
                </div>
            </div>
            ` : ''}

            <!-- Descripción -->
            <div class="description-section">
                <h3 class="gallery-section-title">
                    <span class="material-symbols-rounded">description</span>
                    Descripción
                </h3>
                <div class="description-text">${this.formatDescription(expedition.longDescription)}</div>
            </div>

            <!-- Información técnica -->
            <div class="technical-info">
                <h3 class="gallery-section-title">
                    <span class="material-symbols-rounded">analytics</span>
                    Información Técnica
                </h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="material-symbols-rounded info-icon">terrain</span>
                        <span>Tipo: ${expedition.type}</span>
                    </div>
                    <div class="info-item">
                        <span class="material-symbols-rounded info-icon">thermostat</span>
                        <span>Clima: ${expedition.technicalInfo.climate}</span>
                    </div>
                    <div class="info-item">
                        <span class="material-symbols-rounded info-icon">route</span>
                        <span>Ruta: ${expedition.technicalInfo.route}</span>
                    </div>
                    <div class="info-item">
                        <span class="material-symbols-rounded info-icon">schedule</span>
                        <span>Duración: ${expedition.technicalInfo.duration}</span>
                    </div>
                    <div class="info-item">
                        <span class="material-symbols-rounded info-icon">fitness_center</span>
                        <span>Preparación: ${expedition.technicalInfo.preparation}</span>
                    </div>
                    <div class="info-item">
                        <span class="material-symbols-rounded info-icon">group</span>
                        <span>Modalidad: ${expedition.technicalInfo.modality}</span>
                    </div>
                </div>
            </div>

            <!-- Botón Google Maps -->
            <button class="maps-button" onclick="window.open('${expedition.location.mapsUrl}', '_blank')">
                <span class="material-symbols-rounded">location_on</span>
                Ver en Google Maps
            </button>
        `;
    }

    renderThumbnails() {
        const container = this.overlay.querySelector('.thumbnails-container');
        const thumbnailsHTML = this.currentPhotos.map((photo, index) => `
            <img src="${photo.path}" 
                 alt="Foto ${index + 1}" 
                 class="thumbnail ${index === this.currentPhotoIndex ? 'active' : ''}"
                 data-index="${index}">
        `).join('');

        container.innerHTML = thumbnailsHTML;

        // Eventos de thumbnails
        container.querySelectorAll('.thumbnail').forEach((thumb, index) => {
            thumb.addEventListener('click', () => this.showPhoto(index));
        });
    }

    showPhoto(index) {
        if (index < 0 || index >= this.currentPhotos.length) return;

        this.currentPhotoIndex = index;
        const photo = this.currentPhotos[index];

        // Actualizar foto principal
        const mainPhoto = this.overlay.querySelector('.main-photo');
        mainPhoto.src = photo.path;
        mainPhoto.alt = `${this.currentExpedition.name} - Foto ${index + 1}`;

        // Actualizar contador
        const counter = this.overlay.querySelector('.photo-counter');
        counter.textContent = `${index + 1} / ${this.currentPhotos.length}`;

        // Actualizar thumbnails activos
        const thumbnails = this.overlay.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });

        // Actualizar estado de botones de navegación (carrusel infinito - siempre activos)
        const prevButton = this.overlay.querySelector('.nav-button.prev');
        const nextButton = this.overlay.querySelector('.nav-button.next');
        
        // Los botones siempre están activos en carrusel infinito
        prevButton.style.opacity = '1';
        nextButton.style.opacity = '1';

        // Precargar próxima imagen
        this.preloadNextImage();

        // Scroll thumbnail activo a la vista
        this.scrollThumbnailIntoView(index);
    }

    scrollThumbnailIntoView(index) {
        const container = this.overlay.querySelector('.thumbnails-container');
        const activeThumb = container.querySelector('.thumbnail.active');
        
        if (activeThumb) {
            activeThumb.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }

    nextPhoto() {
        // Carrusel infinito: si estamos en la última foto, volver a la primera
        if (this.currentPhotoIndex < this.currentPhotos.length - 1) {
            this.showPhoto(this.currentPhotoIndex + 1);
        } else {
            this.showPhoto(0); // Volver al inicio
        }
    }

    previousPhoto() {
        // Carrusel infinito: si estamos en la primera foto, ir a la última
        if (this.currentPhotoIndex > 0) {
            this.showPhoto(this.currentPhotoIndex - 1);
        } else {
            this.showPhoto(this.currentPhotos.length - 1); // Ir al final
        }
    }

    preloadNextImage() {
        // Precargar siguiente imagen para navegación más fluida
        const nextIndex = this.currentPhotoIndex + 1;
        if (nextIndex < this.currentPhotos.length) {
            const img = new Image();
            img.src = this.currentPhotos[nextIndex].path;
        }

        // También precargar la anterior si existe
        const prevIndex = this.currentPhotoIndex - 1;
        if (prevIndex >= 0) {
            const img = new Image();
            img.src = this.currentPhotos[prevIndex].path;
        }
    }

    formatDescription(description) {
        // Si ya tiene saltos de línea dobles, usar esos como separadores de párrafo
        if (description.includes('\n\n')) {
            const paragraphs = description.split('\n\n').filter(p => p.trim().length > 0);
            return paragraphs.map(paragraph => {
                const formattedParagraph = paragraph.trim().replace(/\n/g, '<br>');
                return `<p>${formattedParagraph}</p>`;
            }).join('');
        }
        
        // Si no hay saltos dobles, dividir automáticamente por oraciones
        // Buscar puntos seguidos de espacios y mayúsculas para crear párrafos lógicos
        const sentences = description.split(/\. (?=[A-Z])/);
        const paragraphs = [];
        let currentParagraph = [];
        
        sentences.forEach((sentence, index) => {
            // Agregar el punto de vuelta excepto en la última oración
            const fullSentence = index < sentences.length - 1 ? sentence + '.' : sentence;
            currentParagraph.push(fullSentence);
            
            // Crear nuevo párrafo cada 2-3 oraciones o cuando la longitud sea considerable
            if (currentParagraph.length >= 2 && currentParagraph.join(' ').length > 200) {
                paragraphs.push(currentParagraph.join(' '));
                currentParagraph = [];
            }
        });
        
        // Agregar el último párrafo si tiene contenido
        if (currentParagraph.length > 0) {
            paragraphs.push(currentParagraph.join(' '));
        }
        
        // Si solo hay un párrafo muy largo, dividirlo por la mitad aproximadamente
        if (paragraphs.length === 1 && paragraphs[0].length > 400) {
            const text = paragraphs[0];
            const midPoint = Math.floor(text.length / 2);
            const splitPoint = text.indexOf('. ', midPoint);
            
            if (splitPoint !== -1) {
                paragraphs = [
                    text.substring(0, splitPoint + 1),
                    text.substring(splitPoint + 2)
                ];
            }
        }
        
        return paragraphs.map(paragraph => `<p>${paragraph.trim()}</p>`).join('');
    }

    // API pública para debugging
    debug() {
        return {
            isOpen: this.isOpen,
            currentExpedition: this.currentExpedition?.name,
            currentPhotoIndex: this.currentPhotoIndex,
            totalPhotos: this.currentPhotos.length,
            isMobile: this.isMobile,
            isUIVisible: this.isUIVisible
        };
    }
}

// Exportar clase
window.GalleryOverlay = GalleryOverlay;