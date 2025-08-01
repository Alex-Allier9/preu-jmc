/* ======================================
   GALLERY-OVERLAY.JS - SISTEMA DE LIGHTBOX/OVERLAY
   Preuniversitario JMC - Sistema de Expediciones
   ====================================== */

/**
 * GalleryOverlay - Maneja el lightbox/overlay de expediciones
 */
class GalleryOverlay {
    constructor(gallerySystem) {
        this.gallery = gallerySystem;
        this.overlay = null;
        this.isOpen = false;
        this.currentExpedition = null;
        this.currentPhotoIndex = 0;
        this.photos = [];
        this.isLoading = false;
        
        // Mobile touch handling
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.uiVisible = true;
        this.uiHideTimer = null;
        
        console.log('🖼️ GalleryOverlay inicializando...');
        this.createOverlay();
        this.setupEvents();
    }

    /**
     * Crea la estructura del overlay
     */
    createOverlay() {
        // Verificar si ya existe
        let overlay = document.getElementById('gallery-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'gallery-overlay';
            overlay.className = 'gallery-overlay';
            document.body.appendChild(overlay);
        }
        
        this.overlay = overlay;
        console.log('🏗️ Overlay creado');
    }

    /**
     * Abre una expedición en el overlay
     */
    async open(expeditionId) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        console.log(`🚀 Abriendo expedición: ${expeditionId}`);

        try {
            // Obtener datos de la expedición
            this.currentExpedition = this.gallery.getExpedition(expeditionId);
            if (!this.currentExpedition) {
                throw new Error(`Expedición ${expeditionId} no encontrada`);
            }

            // Obtener fotos
            this.photos = this.currentExpedition.photos || [];
            if (this.photos.length === 0) {
                console.warn(`⚠️ No hay fotos para ${expeditionId}`);
            }

            // Reset índice
            this.currentPhotoIndex = 0;

            // Generar contenido del overlay
            this.renderOverlay();

            // Mostrar overlay
            this.showOverlay();

            // Cargar primera foto
            if (this.photos.length > 0) {
                await this.loadPhoto(0);
            }

            this.isOpen = true;
            this.isLoading = false;

            // Bloquear scroll del body
            document.body.style.overflow = 'hidden';

            // Disparar evento
            this.gallery.dispatchEvent('overlayOpened', { expeditionId });

            console.log('✅ Overlay abierto exitosamente');

        } catch (error) {
            console.error('❌ Error abriendo overlay:', error);
            this.handleError(error);
            this.isLoading = false;
        }
    }

    /**
     * Cierra el overlay
     */
    close() {
        if (!this.isOpen) return;

        console.log('🚪 Cerrando overlay...');

        // Ocultar overlay
        this.hideOverlay();

        // Reset estado
        this.isOpen = false;
        this.currentExpedition = null;
        this.currentPhotoIndex = 0;
        this.photos = [];

        // Restaurar scroll del body
        document.body.style.overflow = '';

        // Limpiar timers
        if (this.uiHideTimer) {
            clearTimeout(this.uiHideTimer);
            this.uiHideTimer = null;
        }

        // Disparar evento
        this.gallery.dispatchEvent('overlayClosed');

        console.log('✅ Overlay cerrado');
    }

    /**
     * Renderiza el contenido completo del overlay
     */
    renderOverlay() {
        const expedition = this.currentExpedition;
        const config = this.gallery.config;

        this.overlay.innerHTML = `
            <!-- Botón cerrar -->
            <button class="overlay-close" aria-label="Cerrar galería">
                <span class="material-symbols-rounded">close</span>
            </button>

            <!-- Contenido principal -->
            <div class="overlay-content">
                
                <!-- Panel izquierdo - Información -->
                <div class="info-panel">
                    ${this.renderInfoPanel(expedition)}
                </div>

                <!-- Panel derecho - Fotos -->
                <div class="photos-panel">
                    ${this.renderPhotosPanel(expedition)}
                </div>

            </div>
        `;

        // Configurar eventos específicos del overlay
        this.setupOverlayEvents();
    }

    /**
     * Renderiza el panel de información
     */
    renderInfoPanel(expedition) {
        return `
            <!-- Header de la expedición -->
            <div class="expedition-header">
                <h1 class="expedition-title">${expedition.name}</h1>
                <p class="expedition-location">
                    ${expedition.location.region}, ${expedition.location.country} • ${expedition.type}
                </p>
            </div>

            <!-- Metadatos principales -->
            <div class="main-metadata">
                <div class="metadata-item">
                    <div class="metadata-label">Altitud</div>
                    <div class="metadata-value">${expedition.altitude.toLocaleString()} ${expedition.altitudeUnit}</div>
                </div>
                <div class="metadata-item">
                    <div class="metadata-label">Fotos</div>
                    <div class="metadata-value">${expedition.photoCount} imágenes</div>
                </div>
            </div>

            <!-- Dificultad -->
            <div class="difficulty-display">
                <div class="difficulty-grade">${expedition.difficulty.grade} - ${expedition.difficulty.name}</div>
                <div class="difficulty-description">${expedition.difficulty.system}</div>
            </div>

            <!-- Logros especiales -->
            ${this.renderAchievements(expedition.achievements)}

            <!-- Descripción -->
            <div class="panel-section">
                <h3 class="section-title">
                    <span class="material-symbols-rounded">description</span>
                    Descripción
                </h3>
                <p class="description-text">${expedition.longDescription}</p>
            </div>

            <!-- Información técnica -->
            ${this.renderTechnicalInfo(expedition.technicalInfo)}

            <!-- Botón Google Maps -->
            <button class="maps-button" onclick="window.open('${expedition.location.mapsUrl}', '_blank')">
                <span class="material-symbols-rounded">map</span>
                Ver en Google Maps
            </button>
        `;
    }

    /**
     * Renderiza la sección de logros
     */
    renderAchievements(achievements) {
        if (!achievements || achievements.length === 0) return '';

        const achievementsList = achievements.map(achievement => `
            <div class="achievement-badge-detailed" title="${achievement.description}">
                <span class="material-symbols-rounded achievement-icon">${achievement.icon}</span>
                ${achievement.name}
            </div>
        `).join('');

        return `
            <div class="panel-section">
                <h3 class="section-title">
                    <span class="material-symbols-rounded">emoji_events</span>
                    Logros Destacados
                </h3>
                <div class="achievements-list">
                    ${achievementsList}
                </div>
            </div>
        `;
    }

    /**
     * Renderiza la información técnica
     */
    renderTechnicalInfo(technicalInfo) {
        if (!technicalInfo) return '';

        return `
            <div class="technical-info">
                <h3 class="section-title">
                    <span class="material-symbols-rounded">analytics</span>
                    Información Técnica
                </h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="material-symbols-rounded info-icon">terrain</span>
                        <span>Tipo: ${technicalInfo.climate}</span>
                    </div>
                    <div class="info-item">
                        <span class="material-symbols-rounded info-icon">route</span>
                        <span>Ruta: ${technicalInfo.route}</span>
                    </div>
                    <div class="info-item">
                        <span class="material-symbols-rounded info-icon">schedule</span>
                        <span>Duración: ${technicalInfo.duration}</span>
                    </div>
                    <div class="info-item">
                        <span class="material-symbols-rounded info-icon">fitness_center</span>
                        <span>Preparación: ${technicalInfo.preparation}</span>
                    </div>
                    <div class="info-item">
                        <span class="material-symbols-rounded info-icon">wb_sunny</span>
                        <span>Temporada: ${technicalInfo.season}</span>
                    </div>
                    <div class="info-item">
                        <span class="material-symbols-rounded info-icon">group</span>
                        <span>Modalidad: ${technicalInfo.modality}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza el panel de fotos
     */
    renderPhotosPanel(expedition) {
        const photoCount = this.photos.length;
        const currentIndex = this.currentPhotoIndex + 1;

        return `
            <!-- Contador de fotos -->
            <div class="photo-counter">${currentIndex} / ${photoCount}</div>

            <!-- Contenedor de foto principal -->
            <div class="main-photo-container">
                <!-- Botón anterior -->
                <button class="nav-button prev" ${photoCount <= 1 ? 'disabled' : ''} aria-label="Foto anterior">
                    <span class="material-symbols-rounded">chevron_left</span>
                </button>

                <!-- Foto principal -->
                <div class="main-photo-wrapper">
                    ${photoCount > 0 ? `
                        <img id="main-photo" 
                             src="" 
                             alt="${expedition.name} - Foto ${currentIndex}" 
                             class="main-photo loading-placeholder">
                    ` : `
                        <div class="error-placeholder">
                            Sin fotos disponibles
                        </div>
                    `}
                </div>

                <!-- Botón siguiente -->
                <button class="nav-button next" ${photoCount <= 1 ? 'disabled' : ''} aria-label="Foto siguiente">
                    <span class="material-symbols-rounded">chevron_right</span>
                </button>
            </div>

            <!-- Thumbnails -->
            ${this.renderThumbnails()}
        `;
    }

    /**
     * Renderiza los thumbnails
     */
    renderThumbnails() {
        if (this.photos.length <= 1) return '';

        const thumbnails = this.photos.map((photo, index) => `
            <img src="${photo.path}" 
                 alt="${photo.alt}" 
                 class="thumbnail ${index === this.currentPhotoIndex ? 'active' : ''}"
                 data-index="${index}"
                 loading="lazy">
        `).join('');

        return `
            <div class="thumbnails-container">
                ${thumbnails}
            </div>
        `;
    }

    /**
     * Carga una foto específica
     */
    async loadPhoto(index) {
        if (index < 0 || index >= this.photos.length) return;

        const photo = this.photos[index];
        const mainPhoto = this.overlay.querySelector('#main-photo');
        
        if (!mainPhoto) return;

        console.log(`📸 Cargando foto ${index + 1}/${this.photos.length}: ${photo.filename}`);

        // Mostrar estado de carga
        mainPhoto.classList.add('loading-placeholder');
        mainPhoto.src = '';

        try {
            // Precargar imagen
            await this.preloadImage(photo.path);
            
            // Actualizar imagen principal
            mainPhoto.src = photo.path;
            mainPhoto.alt = photo.alt;
            mainPhoto.classList.remove('loading-placeholder');

            // Actualizar índice
            this.currentPhotoIndex = index;

            // Actualizar contador
            this.updatePhotoCounter();

            // Actualizar thumbnails activos
            this.updateActiveThumbnail();

            // Actualizar botones de navegación
            this.updateNavigationButtons();

            console.log(`✅ Foto ${index + 1} cargada`);

        } catch (error) {
            console.error(`❌ Error cargando foto ${index + 1}:`, error);
            mainPhoto.classList.remove('loading-placeholder');
            mainPhoto.classList.add('error-placeholder');
            mainPhoto.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FcnJvciBjYXJnYW5kbyBpbWFnZW48L3RleHQ+PC9zdmc+';
        }
    }

    /**
     * Precarga una imagen
     */
    preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`No se pudo cargar: ${src}`));
            img.src = src;
        });
    }

    /**
     * Navega a la foto anterior
     */
    previousPhoto() {
        if (this.currentPhotoIndex > 0) {
            this.loadPhoto(this.currentPhotoIndex - 1);
        } else if (this.photos.length > 1) {
            // Ir al final (comportamiento circular)
            this.loadPhoto(this.photos.length - 1);
        }
    }

    /**
     * Navega a la foto siguiente
     */
    nextPhoto() {
        if (this.currentPhotoIndex < this.photos.length - 1) {
            this.loadPhoto(this.currentPhotoIndex + 1);
        } else if (this.photos.length > 1) {
            // Volver al inicio (comportamiento circular)
            this.loadPhoto(0);
        }
    }

    /**
     * Actualiza el contador de fotos
     */
    updatePhotoCounter() {
        const counter = this.overlay.querySelector('.photo-counter');
        if (counter) {
            const current = this.currentPhotoIndex + 1;
            const total = this.photos.length;
            counter.textContent = `${current} / ${total}`;
        }
    }

    /**
     * Actualiza el thumbnail activo
     */
    updateActiveThumbnail() {
        const thumbnails = this.overlay.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            if (index === this.currentPhotoIndex) {
                thumb.classList.add('active');
                // Scroll al thumbnail activo si es necesario
                thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    /**
     * Actualiza los botones de navegación
     */
    updateNavigationButtons() {
        const prevButton = this.overlay.querySelector('.nav-button.prev');
        const nextButton = this.overlay.querySelector('.nav-button.next');

        if (this.photos.length <= 1) {
            if (prevButton) prevButton.disabled = true;
            if (nextButton) nextButton.disabled = true;
        } else {
            if (prevButton) prevButton.disabled = false;
            if (nextButton) nextButton.disabled = false;
        }
    }

    /**
     * Muestra el overlay
     */
    showOverlay() {
        this.overlay.style.display = 'flex';
        
        // Force reflow
        this.overlay.offsetHeight;
        
        // Activar con delay para animación
        setTimeout(() => {
            this.overlay.classList.add('active');
        }, 10);
    }

    /**
     * Oculta el overlay
     */
    hideOverlay() {
        this.overlay.classList.remove('active');
        
        setTimeout(() => {
            this.overlay.style.display = 'none';
            this.overlay.innerHTML = '';
        }, 400);
    }

    /**
     * Configura eventos del sistema
     */
    setupEvents() {
        // Eventos de teclado
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Eventos táctiles para mobile
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    }

    /**
     * Configura eventos específicos del overlay
     */
    setupOverlayEvents() {
        // Botón cerrar
        const closeButton = this.overlay.querySelector('.overlay-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.close());
        }

        // Navegación
        const prevButton = this.overlay.querySelector('.nav-button.prev');
        const nextButton = this.overlay.querySelector('.nav-button.next');
        
        if (prevButton) {
            prevButton.addEventListener('click', () => this.previousPhoto());
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => this.nextPhoto());
        }

        // Thumbnails
        const thumbnails = this.overlay.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => this.loadPhoto(index));
        });

        // Click fuera del contenido para cerrar
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });

        // Mobile: toque en foto para toggle UI
        const mainPhoto = this.overlay.querySelector('#main-photo');
        if (mainPhoto) {
            let tapCount = 0;
            let singleTapTimer = null;

            mainPhoto.addEventListener('click', (e) => {
                tapCount++;
                
                if (tapCount === 1) {
                    singleTapTimer = setTimeout(() => {
                        // Un toque: toggle UI
                        this.toggleMobileUI();
                        tapCount = 0;
                    }, 300);
                } else if (tapCount === 2) {
                    // Doble toque: zoom (implementar si es necesario)
                    clearTimeout(singleTapTimer);
                    this.handleDoubleTab(e);
                    tapCount = 0;
                }
            });
        }
    }

    /**
     * Maneja eventos de teclado
     */
    handleKeyDown(event) {
        if (!this.isOpen) return;

        switch (event.key) {
            case 'Escape':
                this.close();
                event.preventDefault();
                break;
            case 'ArrowLeft':
                this.previousPhoto();
                event.preventDefault();
                break;
            case 'ArrowRight':
                this.nextPhoto();
                event.preventDefault();
                break;
            case ' ':
                this.nextPhoto();
                event.preventDefault();
                break;
        }
    }

    /**
     * Maneja inicio de touch
     */
    handleTouchStart(event) {
        if (!this.isOpen) return;

        this.touchStartX = event.changedTouches[0].screenX;
        this.touchStartY = event.changedTouches[0].screenY;
    }

    /**
     * Maneja fin de touch
     */
    handleTouchEnd(event) {
        if (!this.isOpen) return;

        this.touchEndX = event.changedTouches[0].screenX;
        this.touchEndY = event.changedTouches[0].screenY;
        
        this.handleSwipe();
    }

    /**
     * Maneja gestos de swipe
     */
    handleSwipe() {
        const config = this.gallery.config.mobile;
        const thresholdX = config.swipeThreshold;
        const thresholdY = config.swipeThreshold;
        
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // Determinar dirección principal del swipe
        if (absDeltaX > thresholdX && absDeltaX > absDeltaY) {
            // Swipe horizontal
            if (deltaX > 0) {
                this.previousPhoto(); // Swipe derecha = foto anterior
            } else {
                this.nextPhoto(); // Swipe izquierda = foto siguiente
            }
        } else if (absDeltaY > thresholdY && absDeltaY > absDeltaX) {
            // Swipe vertical
            if (deltaY > 0) {
                // Swipe hacia abajo = mostrar info (en mobile info está abajo)
                this.scrollToInfo();
            } else {
                // Swipe hacia arriba = cerrar galería
                this.close();
            }
        }
    }

    /**
     * Toggle UI en mobile
     */
    toggleMobileUI() {
        const navButtons = this.overlay.querySelectorAll('.nav-button');
        const counter = this.overlay.querySelector('.photo-counter');
        const thumbnails = this.overlay.querySelector('.thumbnails-container');

        const elements = [...navButtons, counter, thumbnails].filter(Boolean);

        if (this.uiVisible) {
            // Ocultar UI
            elements.forEach(el => {
                el.style.opacity = '0';
                el.style.pointerEvents = 'none';
            });
            this.uiVisible = false;
        } else {
            // Mostrar UI
            elements.forEach(el => {
                el.style.opacity = '';
                el.style.pointerEvents = '';
            });
            this.uiVisible = true;
            
            // Auto-ocultar después de un tiempo
            if (this.uiHideTimer) clearTimeout(this.uiHideTimer);
            this.uiHideTimer = setTimeout(() => {
                this.toggleMobileUI();
            }, this.gallery.config.mobile.uiHideDelay);
        }
    }

    /**
     * Maneja doble tap (zoom futuro)
     */
    handleDoubleTab(event) {
        console.log('🔍 Doble tap detectado - zoom no implementado aún');
        // TODO: Implementar zoom si es necesario
    }

    /**
     * Scroll a la información en mobile
     */
    scrollToInfo() {
        const infoPanel = this.overlay.querySelector('.info-panel');
        if (infoPanel && window.innerWidth <= 768) {
            infoPanel.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Maneja errores del overlay
     */
    handleError(error) {
        console.error('❌ GalleryOverlay Error:', error);
        
        this.overlay.innerHTML = `
            <div class="overlay-content">
                <div class="error-message">
                    <h3>Error al cargar la expedición</h3>
                    <p>No se pudo cargar la información de la expedición.</p>
                    <button onclick="window.gallerySystem.overlay.close()" class="btn-primary">Cerrar</button>
                </div>
            </div>
        `;
        
        this.showOverlay();
    }

    /**
     * API pública
     */
    isOverlayOpen() {
        return this.isOpen;
    }

    getCurrentExpedition() {
        return this.currentExpedition;
    }

    getCurrentPhotoIndex() {
        return this.currentPhotoIndex;
    }

    getTotalPhotos() {
        return this.photos.length;
    }
}

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
    window.GalleryOverlay = GalleryOverlay;
}

console.log('🖼️ GalleryOverlay cargado');
console.log('✨ Sistema de Lightbox Avanzado - JMC');