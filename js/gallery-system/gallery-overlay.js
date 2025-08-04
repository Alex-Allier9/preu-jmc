// 🏔️ SISTEMA DE GALERÍA DINÁMICO - PREUNIVERSITARIO JMC
// Sistema de overlay/lightbox con layout 1/3 - 2/3

class GalleryOverlay {
    constructor(detectedPhotos) {
        console.log('🏗️ CONSTRUCTOR GALLERY OVERLAY - Iniciando');
        console.log('📊 Fotos detectadas recibidas:', detectedPhotos?.length || 0);
        
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
        
        // Bind del método handleKeyPress para poder removerlo después
        this.boundHandleKeyPress = this.handleKeyPress.bind(this);
        this.keyboardListenerActive = false;
        this.processingKeyEvent = false;
        
        console.log('✅ Constructor completado - Estado inicial:', {
            detectedPhotosCount: this.detectedPhotos?.length || 0,
            isOpen: this.isOpen,
            isMobile: this.isMobile,
            isUIVisible: this.isUIVisible
        });
    }

    init() {
        console.log('🖼️ Inicializando sistema de overlay...');
        
        // Limpiar overlay existente si ya existe
        this.cleanup();
        
        this.createOverlayStructure();
        console.log('✅ Sistema de overlay inicializado');
    }

    cleanup() {
        console.log('🧹 LIMPIEZA DE OVERLAY - Removiendo instancias anteriores');
        
        // Remover overlay existente del DOM si existe
        const existingOverlay = document.querySelector('.gallery-lightbox');
        if (existingOverlay) {
            console.log('🗑️ Removiendo overlay existente del DOM');
            existingOverlay.remove();
        }
        
        // Remover event listener de teclado
        if (this.boundHandleKeyPress && this.keyboardListenerActive) {
            console.log('⌨️ Removiendo event listener de teclado anterior');
            document.removeEventListener('keydown', this.boundHandleKeyPress);
            this.keyboardListenerActive = false;
        }
        
        // Limpiar timeouts
        if (this.hideUITimeout) {
            clearTimeout(this.hideUITimeout);
            this.hideUITimeout = null;
        }
        
        // Reset estado
        this.overlay = null;
        this.isOpen = false;
        
        console.log('✅ Limpieza completada');
    }

    createOverlayStructure() {
        console.log('🏗️ CREANDO ESTRUCTURA DEL OVERLAY - Inicio');
        
        // Crear overlay en el DOM
        this.overlay = document.createElement('div');
        this.overlay.className = 'gallery-lightbox';
        this.overlay.style.display = 'none';
        
        console.log('📦 Elemento overlay creado:', {
            className: this.overlay.className,
            display: this.overlay.style.display
        });
        
        console.log('🔨 Construyendo HTML interno del overlay...');
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
                            <span class="material-symbols-rounded">arrow_back_ios_new</span>
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

        console.log('🌐 Añadiendo overlay al DOM...');
        document.body.appendChild(this.overlay);
        
        console.log('🎯 Configurando eventos del overlay...');
        this.setupOverlayEvents();
        
        console.log('✅ Estructura del overlay creada exitosamente');
    }

    setupOverlayEvents() {
        console.log('🎯 CONFIGURANDO EVENTOS DEL OVERLAY - Inicio');
        
        try {
            // Botón cerrar
            const closeButton = this.overlay.querySelector('.overlay-close');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    console.log('🖱️ Click en botón cerrar');
                    this.close();
                });
                console.log('✅ Evento de botón cerrar configurado');
            } else {
                console.error('❌ No se encontró el botón cerrar');
            }

            // Botones de navegación
            const prevButton = this.overlay.querySelector('.nav-button.prev');
            const nextButton = this.overlay.querySelector('.nav-button.next');
            
            if (prevButton && nextButton) {
                prevButton.addEventListener('click', () => {
                    console.log('🖱️ Click en botón anterior');
                    this.previousPhoto();
                });
                nextButton.addEventListener('click', () => {
                    console.log('🖱️ Click en botón siguiente');
                    this.nextPhoto();
                });
                console.log('✅ Eventos de navegación configurados');
            } else {
                console.error('❌ No se encontraron botones de navegación');
            }

            // Click en overlay para cerrar (solo en el fondo)
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    console.log('🖱️ Click en fondo del overlay - Cerrar');
                    this.close();
                }
            });

            // Touch events para móviles
            console.log('📱 Configurando eventos táctiles...');
            this.setupTouchEvents();
            
            // Eventos de teclado - Remover listener anterior si existe
            console.log('⌨️ Configurando eventos de teclado...');
            
            // Verificar si ya existe el listener
            if (this.keyboardListenerActive) {
                console.log('⚠️ Listener de teclado ya activo, removiendo anterior...');
                document.removeEventListener('keydown', this.boundHandleKeyPress);
            }
            
            document.addEventListener('keydown', this.boundHandleKeyPress);
            this.keyboardListenerActive = true;
            console.log('✅ Event listener de teclado configurado (único)');
            
            console.log('✅ Todos los eventos del overlay configurados exitosamente');
            
        } catch (error) {
            console.error('❌ Error configurando eventos del overlay:', error);
            console.error('📊 Stack trace:', error.stack);
        }
    }

    handleKeyPress(event) {
        if (!this.isOpen) return;
        
        // Prevenir procesamiento múltiple del mismo evento
        if (this.processingKeyEvent) {
            console.log('⚠️ Evento de teclado ya siendo procesado, ignorando duplicado');
            return;
        }
        
        this.processingKeyEvent = true;
        
        console.log('⌨️ TECLA PRESIONADA:', {
            key: event.key,
            code: event.code,
            overlayAbierto: this.isOpen,
            timestamp: Date.now()
        });
        
        switch(event.key) {
            case 'Escape':
                console.log('🚪 Tecla Escape - Cerrando overlay');
                this.close();
                break;
            case 'ArrowLeft':
                console.log('⬅️ Flecha izquierda - Foto anterior');
                this.previousPhoto();
                break;
            case 'ArrowRight':
                console.log('➡️ Flecha derecha - Siguiente foto');
                this.nextPhoto();
                break;
            default:
                console.log('ℹ️ Tecla no manejada:', event.key);
        }
        
        // Limpiar flag después de un breve delay
        setTimeout(() => {
            this.processingKeyEvent = false;
        }, 100);
    }

    setupTouchEvents() {
        console.log('📱 CONFIGURANDO EVENTOS TÁCTILES - Inicio');
        
        const photoContainer = this.overlay.querySelector('.main-photo-container');
        const mainPhoto = this.overlay.querySelector('.main-photo');

        if (!photoContainer || !mainPhoto) {
            console.error('❌ No se encontraron elementos para eventos táctiles:', {
                photoContainer: !!photoContainer,
                mainPhoto: !!mainPhoto
            });
            return;
        }

        // Touch events en el contenedor de fotos
        photoContainer.addEventListener('touchstart', (e) => {
            this.touchStart.x = e.touches[0].clientX;
            this.touchStart.y = e.touches[0].clientY;
            console.log('👆 Touch start:', {
                x: this.touchStart.x,
                y: this.touchStart.y
            });
        }, { passive: true });

        photoContainer.addEventListener('touchend', (e) => {
            this.touchEnd.x = e.changedTouches[0].clientX;
            this.touchEnd.y = e.changedTouches[0].clientY;
            console.log('👆 Touch end:', {
                startX: this.touchStart.x,
                endX: this.touchEnd.x,
                startY: this.touchStart.y,
                endY: this.touchEnd.y
            });
            this.handleTouchGesture();
        }, { passive: true });

        // Tap en foto principal
        mainPhoto.addEventListener('click', () => {
            if (this.isMobile) {
                console.log('👆 Tap en foto principal - Toggle UI');
                this.toggleUI();
            }
        });

        // Double tap para zoom (implementación básica)
        let tapCount = 0;
        mainPhoto.addEventListener('touchend', (e) => {
            tapCount++;
            console.log('👆 Touch en foto principal - Tap count:', tapCount);
            
            if (tapCount === 1) {
                setTimeout(() => {
                    if (tapCount === 1) {
                        // Single tap - toggle UI
                        console.log('👆 Single tap detectado - Toggle UI');
                        this.toggleUI();
                    } else if (tapCount === 2) {
                        // Double tap - zoom
                        console.log('👆 Double tap detectado - Toggle Zoom');
                        this.toggleZoom();
                    }
                    tapCount = 0;
                }, 300);
            }
        }, { passive: true });
        
        console.log('✅ Eventos táctiles configurados exitosamente');
    }

    handleTouchGesture() {
        console.log('🤏 PROCESANDO GESTO TÁCTIL - Analizando movimiento');
        
        const deltaX = this.touchEnd.x - this.touchStart.x;
        const deltaY = this.touchEnd.y - this.touchStart.y;
        const minSwipeDistance = 50;

        console.log('📊 Datos del gesto:', {
            deltaX: deltaX,
            deltaY: deltaY,
            minSwipeDistance: minSwipeDistance,
            isHorizontal: Math.abs(deltaX) > Math.abs(deltaY),
            isVertical: Math.abs(deltaY) > Math.abs(deltaX)
        });

        // Swipe horizontal (cambiar foto)
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            console.log('↔️ Gesto horizontal detectado');
            
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    console.log('➡️ Swipe derecha - Foto anterior');
                    this.previousPhoto(); // Swipe derecha
                } else {
                    console.log('⬅️ Swipe izquierda - Siguiente foto');
                    this.nextPhoto(); // Swipe izquierda
                }
            } else {
                console.log('ℹ️ Movimiento horizontal muy pequeño, ignorando');
            }
        }
        // Swipe vertical
        else if (Math.abs(deltaY) > minSwipeDistance) {
            console.log('↕️ Gesto vertical detectado');
            
            if (deltaY > 0) {
                // Swipe hacia abajo - scroll hacia información
                console.log('⬇️ Swipe hacia abajo - Scroll a información');
                this.scrollToInfo();
            } else {
                // Swipe hacia arriba - cerrar galería
                console.log('⬆️ Swipe hacia arriba - Cerrar galería');
                this.close();
            }
        } else {
            console.log('ℹ️ Gesto no reconocido o muy pequeño');
        }
    }

    toggleUI() {
        console.log('🎮 TOGGLE UI - Cambiar visibilidad de controles');
        console.log('📊 Estado actual UI:', this.isUIVisible);
        
        this.isUIVisible = !this.isUIVisible;
        const uiElements = this.overlay.querySelectorAll('.nav-button, .photo-counter, .thumbnails-container');
        
        console.log('🎯 Elementos UI encontrados:', uiElements.length);
        
        uiElements.forEach((el, index) => {
            el.style.opacity = this.isUIVisible ? '1' : '0';
            el.style.pointerEvents = this.isUIVisible ? 'auto' : 'none';
            console.log(`🔄 Elemento UI ${index + 1} actualizado:`, {
                className: el.className,
                opacity: el.style.opacity,
                pointerEvents: el.style.pointerEvents
            });
        });

        console.log('✅ Nuevo estado UI:', this.isUIVisible);

        // Auto-mostrar UI después de 3 segundos si está oculta
        if (!this.isUIVisible) {
            console.log('⏱️ UI oculta - Configurando auto-mostrar en 3 segundos');
            clearTimeout(this.hideUITimeout);
            this.hideUITimeout = setTimeout(() => {
                console.log('⏱️ Timeout alcanzado - Auto-mostrando UI');
                this.isUIVisible = true;
                uiElements.forEach(el => {
                    el.style.opacity = '1';
                    el.style.pointerEvents = 'auto';
                });
                console.log('✅ UI auto-mostrada');
            }, 3000);
        } else {
            console.log('🔄 UI visible - Cancelando auto-mostrar');
            clearTimeout(this.hideUITimeout);
        }
    }

    toggleZoom() {
        console.log('🔍 TOGGLE ZOOM - Cambiar zoom de la foto');
        
        const mainPhoto = this.overlay.querySelector('.main-photo');
        if (!mainPhoto) {
            console.error('❌ No se encontró la foto principal para zoom');
            return;
        }
        
        const isZoomed = mainPhoto.style.transform.includes('scale');
        console.log('📊 Estado actual zoom:', isZoomed);
        
        if (isZoomed) {
            console.log('🔍 Removiendo zoom...');
            mainPhoto.style.transform = '';
            mainPhoto.style.cursor = '';
        } else {
            console.log('🔍 Aplicando zoom 1.5x...');
            mainPhoto.style.transform = 'scale(1.5)';
            mainPhoto.style.cursor = 'zoom-out';
        }
        
        console.log('✅ Zoom actualizado - Nuevo estado:', !isZoomed);
    }

    scrollToInfo() {
        console.log('📜 SCROLL TO INFO - Scroll hacia información');
        
        if (this.isMobile) {
            console.log('📱 Dispositivo móvil detectado - Ejecutando scroll');
            const infoPanel = this.overlay.querySelector('.info-panel');
            
            if (infoPanel) {
                infoPanel.scrollIntoView({ behavior: 'smooth' });
                console.log('✅ Scroll hacia información ejecutado');
            } else {
                console.error('❌ No se encontró el panel de información');
            }
        } else {
            console.log('🖥️ Dispositivo desktop - Scroll no aplicable');
        }
    }

    open(expedition, photos, photoIndex = 0) {
        console.log('🔓 ABRIENDO OVERLAY - Inicio del proceso');
        console.log('📊 Datos recibidos:', {
            expeditionName: expedition?.name,
            photosCount: photos?.length,
            requestedPhotoIndex: photoIndex
        });

        this.currentExpedition = expedition;
        this.currentPhotos = photos;
        this.currentPhotoIndex = photoIndex;
        this.isOpen = true;

        console.log('✅ Estado interno actualizado:', {
            isOpen: this.isOpen,
            currentExpeditionName: this.currentExpedition?.name,
            totalPhotos: this.currentPhotos?.length,
            startingPhotoIndex: this.currentPhotoIndex
        });

        // Generar contenido
        console.log('🏗️ Generando contenido del overlay...');
        this.renderExpeditionInfo();
        this.renderThumbnails();
        this.showPhoto(photoIndex);

        // Mostrar overlay
        console.log('👁️ Mostrando overlay...');
        this.overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Animación de entrada usando la clase CSS
        requestAnimationFrame(() => {
            console.log('🎬 Aplicando animación de entrada...');
            this.overlay.classList.add('show');
        });

        // Precargar próxima imagen
        console.log('🔄 Precargando siguiente imagen...');
        this.preloadNextImage();
        
        console.log('✅ OVERLAY ABIERTO COMPLETAMENTE');
    }

    close() {
        console.log('🔒 CERRANDO OVERLAY - Inicio del proceso');
        
        if (!this.isOpen) {
            console.log('⚠️ Overlay ya estaba cerrado, cancelando operación');
            return;
        }

        console.log('🎬 Iniciando animación de cierre...');
        this.isOpen = false;
        
        if (this.overlay) {
            this.overlay.classList.remove('show');
            
            setTimeout(() => {
                if (this.overlay) {
                    console.log('👁️ Ocultando overlay del DOM...');
                    this.overlay.style.display = 'none';
                    document.body.style.overflow = '';
                    
                    // Limpiar zoom si existe
                    const mainPhoto = this.overlay.querySelector('.main-photo');
                    if (mainPhoto && mainPhoto.style.transform) {
                        console.log('🔍 Limpiando zoom de la foto...');
                        mainPhoto.style.transform = '';
                        mainPhoto.style.cursor = '';
                    }
                    
                    console.log('✅ OVERLAY CERRADO COMPLETAMENTE');
                }
            }, 300);
        }

        // Limpiar timeouts
        console.log('🧹 Limpiando timeouts...');
        clearTimeout(this.hideUITimeout);
    }

    renderExpeditionInfo() {
        console.log('📝 RENDERIZANDO INFORMACIÓN DE EXPEDICIÓN - Inicio');
        
        const infoContent = this.overlay.querySelector('.info-panel');
        if (!infoContent) {
            console.error('❌ No se encontró el panel de información (.info-panel)');
            return;
        }

        const expedition = this.currentExpedition;
        const photoCount = this.currentPhotos.length;

        console.log('📊 Datos para renderizar:', {
            expeditionName: expedition?.name,
            location: expedition?.location?.fullLocation,
            coordinates: expedition?.location?.coordinates,
            achievements: expedition?.achievements?.length,
            photoCount: photoCount
        });

        // Generar badges de logros
        console.log('🏆 Generando badges de logros...');
        const achievementBadges = expedition.achievements.map((achievement, index) => {
            console.log(`🎖️ Badge ${index + 1}:`, achievement);
            return `
            <div class="achievement-badge">
                <span class="material-symbols-rounded gallery-badge-icon">${achievement.icon}</span>
                ${achievement.name}
            </div>
        `;
        }).join('');

        console.log('🏗️ Construyendo HTML del panel de información...');
        infoContent.innerHTML = `
            <!-- Header de la expedición -->
            <div class="expedition-header">
                <h1 class="expedition-title">${expedition.name}</h1>
                <p class="expedition-location">${expedition.location.fullLocation}</p>
                <p class="expedition-coordinates">
                    <span class="material-symbols-rounded">globe_location_pin</span>
                    ${expedition.location.coordinates}
                </p>
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

            <!-- Botón Google Maps -->
            <button class="maps-button" onclick="window.open('${expedition.location.mapsUrl}', '_blank')">
                <span class="material-symbols-rounded">location_on</span>
                Ver en Google Maps
            </button>
        `;
        
        console.log('✅ Información de expedición renderizada exitosamente');
    }

    renderThumbnails() {
        console.log('🖼️ RENDERIZANDO THUMBNAILS - Inicio');
        
        const container = this.overlay.querySelector('.thumbnails-container');
        if (!container) {
            console.error('❌ No se encontró el contenedor de thumbnails (.thumbnails-container)');
            return;
        }

        console.log('📊 Generando thumbnails para', this.currentPhotos.length, 'fotos');
        console.log('🎯 Foto activa inicial:', this.currentPhotoIndex);

        const thumbnailsHTML = this.currentPhotos.map((photo, index) => {
            const isActive = index === this.currentPhotoIndex;
            console.log(`🖼️ Thumbnail ${index + 1}:`, {
                path: photo.path,
                isActive: isActive
            });
            
            return `
            <img src="${photo.path}" 
                 alt="Foto ${index + 1}" 
                 class="thumbnail ${isActive ? 'active' : ''}"
                 data-index="${index}">
        `;
        }).join('');

        console.log('🏗️ Insertando HTML de thumbnails...');
        container.innerHTML = thumbnailsHTML;

        // Eventos de thumbnails
        console.log('🎯 Configurando eventos de click en thumbnails...');
        const thumbnails = container.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                console.log(`🖱️ Click en thumbnail ${index + 1}`);
                this.showPhoto(index);
            });
        });

        console.log('✅ Thumbnails renderizados exitosamente:', thumbnails.length, 'elementos');
    }

    showPhoto(index) {
        console.log('📸 MOSTRANDO FOTO - Inicio del proceso');
        console.log('📊 Parámetros recibidos:', {
            requestedIndex: index,
            currentIndex: this.currentPhotoIndex,
            totalPhotos: this.currentPhotos.length
        });

        if (index < 0 || index >= this.currentPhotos.length) {
            console.error('❌ Índice de foto inválido:', {
                requestedIndex: index,
                validRange: `0 - ${this.currentPhotos.length - 1}`
            });
            return;
        }

        console.log('✅ Actualizando índice de foto actual:', index);
        this.currentPhotoIndex = index;
        const photo = this.currentPhotos[index];

        console.log('🖼️ Datos de la foto a mostrar:', {
            index: index,
            path: photo.path,
            expeditionName: this.currentExpedition?.name
        });

        // Actualizar foto principal
        console.log('🎯 Actualizando foto principal...');
        const mainPhoto = this.overlay.querySelector('.main-photo');
        if (!mainPhoto) {
            console.error('❌ No se encontró el elemento de foto principal (.main-photo)');
            return;
        }

        mainPhoto.src = photo.path;
        mainPhoto.alt = `${this.currentExpedition.name} - Foto ${index + 1}`;
        console.log('✅ Foto principal actualizada');

        // Actualizar contador
        console.log('🔢 Actualizando contador de fotos...');
        const counter = this.overlay.querySelector('.photo-counter');
        if (counter) {
            const counterText = `${index + 1} / ${this.currentPhotos.length}`;
            counter.textContent = counterText;
            console.log('✅ Contador actualizado:', counterText);
        } else {
            console.error('❌ No se encontró el contador de fotos (.photo-counter)');
        }

        // Actualizar thumbnails activos
        console.log('🖼️ Actualizando estado de thumbnails...');
        const thumbnails = this.overlay.querySelectorAll('.thumbnail');
        if (thumbnails.length > 0) {
            thumbnails.forEach((thumb, i) => {
                const wasActive = thumb.classList.contains('active');
                const shouldBeActive = i === index;
                
                thumb.classList.toggle('active', shouldBeActive);
                
                if (wasActive !== shouldBeActive) {
                    console.log(`🔄 Thumbnail ${i + 1} cambió estado:`, {
                        wasActive: wasActive,
                        nowActive: shouldBeActive
                    });
                }
            });
            console.log('✅ Thumbnails actualizados');
        } else {
            console.error('❌ No se encontraron thumbnails');
        }

        // Actualizar estado de botones de navegación (carrusel infinito - siempre activos)
        console.log('🎮 Verificando botones de navegación...');
        const prevButton = this.overlay.querySelector('.nav-button.prev');
        const nextButton = this.overlay.querySelector('.nav-button.next');
        
        if (prevButton && nextButton) {
            // Los botones siempre están activos en carrusel infinito
            prevButton.style.opacity = '1';
            nextButton.style.opacity = '1';
            console.log('✅ Botones de navegación activos (carrusel infinito)');
        } else {
            console.error('❌ No se encontraron botones de navegación');
        }

        // Precargar próxima imagen
        console.log('🔄 Iniciando precarga de próxima imagen...');
        this.preloadNextImage();

        // Scroll thumbnail activo a la vista
        console.log('📜 Haciendo scroll del thumbnail activo...');
        this.scrollThumbnailIntoView(index);

        console.log('✅ FOTO MOSTRADA EXITOSAMENTE - Proceso completado');
    }

    scrollThumbnailIntoView(index) {
        console.log('📜 SCROLL THUMBNAIL - Haciendo scroll al thumbnail activo');
        console.log('🎯 Thumbnail objetivo:', index + 1);
        
        const container = this.overlay.querySelector('.thumbnails-container');
        if (!container) {
            console.error('❌ No se encontró el contenedor de thumbnails');
            return;
        }

        const activeThumb = container.querySelector('.thumbnail.active');
        
        if (activeThumb) {
            console.log('✅ Thumbnail activo encontrado, haciendo scroll...');
            activeThumb.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
            console.log('✅ Scroll de thumbnail completado');
        } else {
            console.error('❌ No se encontró el thumbnail activo para hacer scroll');
        }
    }

    nextPhoto() {
        console.log('➡️ NAVEGACIÓN - Siguiente foto');
        console.log('📊 Estado actual:', {
            currentIndex: this.currentPhotoIndex,
            totalPhotos: this.currentPhotos.length,
            isLastPhoto: this.currentPhotoIndex >= this.currentPhotos.length - 1
        });

        // Carrusel infinito: si estamos en la última foto, volver a la primera
        if (this.currentPhotoIndex < this.currentPhotos.length - 1) {
            const nextIndex = this.currentPhotoIndex + 1;
            console.log('➡️ Avanzando a foto', nextIndex + 1);
            this.showPhoto(nextIndex);
        } else {
            console.log('🔄 Fin del carrusel - Volviendo al inicio (foto 1)');
            this.showPhoto(0); // Volver al inicio
        }
    }

    previousPhoto() {
        console.log('⬅️ NAVEGACIÓN - Foto anterior');
        console.log('📊 Estado actual:', {
            currentIndex: this.currentPhotoIndex,
            totalPhotos: this.currentPhotos.length,
            isFirstPhoto: this.currentPhotoIndex <= 0
        });

        // Carrusel infinito: si estamos en la primera foto, ir a la última
        if (this.currentPhotoIndex > 0) {
            const prevIndex = this.currentPhotoIndex - 1;
            console.log('⬅️ Retrocediendo a foto', prevIndex + 1);
            this.showPhoto(prevIndex);
        } else {
            const lastIndex = this.currentPhotos.length - 1;
            console.log('🔄 Inicio del carrusel - Saltando al final (foto', lastIndex + 1, ')');
            this.showPhoto(lastIndex); // Ir al final
        }
    }

    preloadNextImage() {
        console.log('🔄 PRECARGA - Iniciando precarga de imágenes');
        
        // Precargar siguiente imagen para navegación más fluida
        const nextIndex = this.currentPhotoIndex + 1;
        if (nextIndex < this.currentPhotos.length) {
            const nextPhoto = this.currentPhotos[nextIndex];
            console.log('⏭️ Precargando siguiente imagen:', {
                index: nextIndex + 1,
                path: nextPhoto.path
            });
            
            const img = new Image();
            img.onload = () => console.log('✅ Siguiente imagen precargada exitosamente');
            img.onerror = () => console.error('❌ Error precargando siguiente imagen:', nextPhoto.path);
            img.src = nextPhoto.path;
        } else {
            console.log('ℹ️ No hay siguiente imagen para precargar (última foto)');
        }

        // También precargar la anterior si existe
        const prevIndex = this.currentPhotoIndex - 1;
        if (prevIndex >= 0) {
            const prevPhoto = this.currentPhotos[prevIndex];
            console.log('⏮️ Precargando imagen anterior:', {
                index: prevIndex + 1,
                path: prevPhoto.path
            });
            
            const img = new Image();
            img.onload = () => console.log('✅ Imagen anterior precargada exitosamente');
            img.onerror = () => console.error('❌ Error precargando imagen anterior:', prevPhoto.path);
            img.src = prevPhoto.path;
        } else {
            console.log('ℹ️ No hay imagen anterior para precargar (primera foto)');
        }
        
        console.log('✅ Proceso de precarga completado');
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
        const debugInfo = {
            isOpen: this.isOpen,
            currentExpedition: this.currentExpedition?.name,
            currentPhotoIndex: this.currentPhotoIndex,
            totalPhotos: this.currentPhotos.length,
            isMobile: this.isMobile,
            isUIVisible: this.isUIVisible,
            overlayExists: !!this.overlay,
            overlayVisible: this.overlay?.style.display !== 'none'
        };
        
        console.log('🐛 DEBUG INFO OVERLAY:', debugInfo);
        return debugInfo;
    }

    // Método para destruir completamente la instancia
    destroy() {
        console.log('💥 DESTRUYENDO OVERLAY - Limpieza completa');
        
        // Cerrar si está abierto
        if (this.isOpen) {
            this.close();
        }
        
        // Limpiar completamente
        this.cleanup();
        
        console.log('✅ Overlay destruido completamente');
    }
}

// Exportar clase
window.GalleryOverlay = GalleryOverlay;