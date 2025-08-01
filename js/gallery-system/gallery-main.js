/* ======================================
   GALLERY-MAIN.JS - COORDINADOR PRINCIPAL DEL SISTEMA DE GALERÍA
   Preuniversitario JMC - Sistema Dinámico de Expediciones
   ====================================== */

/**
 * GallerySystem - Coordinador principal del sistema de galería dinámico
 * Maneja la inicialización, datos, y coordinación entre componentes
 */
class GallerySystem {
    constructor(containerId = 'mountaineering-gallery') {
        this.containerId = containerId;
        this.container = null;
        this.expeditions = {};
        this.config = {};
        this.cards = null;
        this.overlay = null;
        this.utils = null;
        this.isInitialized = false;
        
        console.log('🏔️ GallerySystem inicializando...');
    }

    /**
     * Inicialización principal del sistema
     */
    async init() {
        try {
            console.log('📊 Cargando datos y configuración...');
            
            // Cargar datos y configuración en paralelo
            const [expeditionsData, configData] = await Promise.all([
                this.loadJSON('data/expeditions.json'),
                this.loadJSON('data/gallery-config.json')
            ]);

            this.expeditions = expeditionsData.expeditions;
            this.config = configData;
            
            console.log(`✅ Datos cargados: ${Object.keys(this.expeditions).length} expediciones`);

            // Detectar fotos automáticamente
            await this.detectPhotos();

            // Encontrar o crear contenedor
            this.container = document.getElementById(this.containerId);
            if (!this.container) {
                console.warn(`⚠️ Contenedor '${this.containerId}' no encontrado, creando uno nuevo`);
                this.container = this.createContainer();
            }

            // Inicializar componentes
            await this.initializeComponents();

            // Renderizar galería
            this.render();

            this.isInitialized = true;
            console.log('🎉 GallerySystem inicializado exitosamente');

            // Disparar evento personalizado
            this.dispatchEvent('galleryInitialized', {
                expeditions: Object.keys(this.expeditions).length,
                totalPhotos: this.getTotalPhotoCount()
            });

        } catch (error) {
            console.error('❌ Error inicializando GallerySystem:', error);
            this.handleError(error);
        }
    }

    /**
     * Carga archivos JSON con manejo de errores
     */
    async loadJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`❌ Error cargando ${url}:`, error);
            throw new Error(`No se pudo cargar ${url}: ${error.message}`);
        }
    }

    /**
     * Detecta automáticamente las fotos en cada expedición
     */
    async detectPhotos() {
        console.log('🔍 Detectando fotos automáticamente...');
        
        for (const [expeditionId, expedition] of Object.entries(this.expeditions)) {
            try {
                const photos = await this.detectExpeditionPhotos(expeditionId);
                expedition.photos = photos;
                expedition.photoCount = photos.length;
                
                console.log(`📸 ${expeditionId}: ${photos.length} fotos detectadas`);
            } catch (error) {
                console.warn(`⚠️ Error detectando fotos para ${expeditionId}:`, error);
                expedition.photos = [];
                expedition.photoCount = 0;
            }
        }
    }

    /**
     * Detecta fotos de una expedición específica
     */
    async detectExpeditionPhotos(expeditionId) {
        const basePath = this.config.gallery.basePath;
        const expeditionPath = `${basePath}${expeditionId}/`;
        const supportedFormats = this.config.gallery.supportedFormats;
        const photoPattern = new RegExp(this.config.gallery.photoFilePattern);
        
        const photos = [];
        
        // Intentar detectar fotos con diferentes patrones
        for (let i = 1; i <= 50; i++) { // Máximo 50 fotos por expedición
            const paddedNumber = i.toString().padStart(4, '0');
            
            for (const format of supportedFormats) {
                const filename = `${expeditionId}_${paddedNumber}.${format}`;
                const fullPath = `${expeditionPath}${filename}`;
                
                // Verificar si la imagen existe
                if (await this.imageExists(fullPath)) {
                    photos.push({
                        id: `${expeditionId}_${paddedNumber}`,
                        filename: filename,
                        path: fullPath,
                        alt: `${this.expeditions[expeditionId].name} - Foto ${i}`,
                        index: i
                    });
                    break; // Solo agregar una vez por número
                }
            }
        }
        
        return photos.sort((a, b) => a.index - b.index);
    }

    /**
     * Verifica si una imagen existe sin generar errores en consola
     */
    async imageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    /**
     * Inicializa los componentes del sistema
     */
    async initializeComponents() {
        console.log('🔧 Inicializando componentes...');

        // Importar dinámicamente los componentes (si están en módulos separados)
        // Por ahora los incluiremos como clases globales

        if (typeof GalleryCards !== 'undefined') {
            this.cards = new GalleryCards(this);
        }

        if (typeof GalleryOverlay !== 'undefined') {
            this.overlay = new GalleryOverlay(this);
        }

        if (typeof GalleryUtils !== 'undefined') {
            this.utils = new GalleryUtils(this);
        }

        console.log('✅ Componentes inicializados');
    }

    /**
     * Crea el contenedor principal si no existe
     */
    createContainer() {
        const section = document.createElement('section');
        section.id = this.containerId;
        section.className = 'section mountaineering-section';
        
        // Buscar donde insertar (después de achievement cards si existen)
        const achievementSection = document.querySelector('.achievement-card');
        if (achievementSection && achievementSection.parentNode) {
            const parentSection = achievementSection.closest('.section');
            if (parentSection && parentSection.parentNode) {
                parentSection.parentNode.insertBefore(section, parentSection.nextSibling);
            }
        } else {
            // Fallback: agregar al final del container principal
            const container = document.querySelector('.container');
            if (container) {
                container.appendChild(section);
            }
        }

        return section;
    }

    /**
     * Renderiza la galería completa
     */
    render() {
        if (!this.container) {
            console.error('❌ No se puede renderizar: contenedor no disponible');
            return;
        }

        console.log('🎨 Renderizando galería...');

        // Limpiar contenedor
        this.container.innerHTML = '';

        // Crear estructura HTML
        const galleryHTML = this.createGalleryHTML();
        this.container.innerHTML = galleryHTML;

        // Renderizar cards si el componente está disponible
        if (this.cards) {
            this.cards.render();
        } else {
            console.warn('⚠️ GalleryCards no disponible, renderizando fallback');
            this.renderFallback();
        }

        // Configurar eventos
        this.setupEvents();

        console.log('✅ Galería renderizada exitosamente');
    }

    /**
     * Crea la estructura HTML base de la galería
     */
    createGalleryHTML() {
        const config = this.config;
        
        return `
            <div class="container">
                <!-- Header de la galería -->
                <div class="gallery-header">
                    <h2 class="gallery-main-title fade-in">${config.gallery.title}</h2>
                    <p class="gallery-subtitle fade-in">${config.gallery.subtitle}</p>
                    
                    <!-- Filtros -->
                    <div class="gallery-filters fade-in">
                        ${config.filters.buttons.map(button => `
                            <button class="filter-btn ${button.id === config.filters.defaultFilter ? 'active' : ''}" 
                                    data-filter="${button.category || 'all'}">
                                ${button.label}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Grid de expediciones -->
                <div class="expeditions-grid" id="expeditions-grid">
                    <!-- Las cards se generan dinámicamente -->
                </div>
                
                <!-- Overlay del lightbox (se genera dinámicamente) -->
                <div id="gallery-overlay" class="gallery-overlay" style="display: none;">
                    <!-- El contenido se genera dinámicamente -->
                </div>
            </div>
        `;
    }

    /**
     * Renderiza una versión fallback sin componentes avanzados
     */
    renderFallback() {
        const grid = this.container.querySelector('#expeditions-grid');
        if (!grid) return;

        const expeditions = this.getFilteredExpeditions();
        
        grid.innerHTML = expeditions.map(expedition => this.createBasicCard(expedition)).join('');
        
        console.log('📦 Renderizado fallback completado');
    }

    /**
     * Crea una card básica de expedición
     */
    createBasicCard(expedition) {
        const isNew = this.isNewExpedition(expedition);
        const achievementBadges = expedition.achievements ? 
            expedition.achievements.slice(0, 2).map(achievement => 
                `<span class="achievement-badge material-symbols-rounded">${achievement.icon}</span>`
            ).join('') : '';

        return `
            <div class="expedition-card fade-in" 
                 data-expedition="${expedition.id}" 
                 data-category="${expedition.category}">
                ${isNew ? '<div class="new-badge">NUEVO</div>' : ''}
                ${achievementBadges ? `<div class="achievement-badges">${achievementBadges}</div>` : ''}
                
                <img src="${this.config.gallery.basePath}${expedition.id}/${expedition.coverImage}" 
                     alt="${expedition.name}" 
                     class="expedition-image"
                     loading="lazy">
                
                <div class="expedition-content">
                    <h3 class="expedition-title">${expedition.name}</h3>
                    <p class="expedition-description">${expedition.shortDescription}</p>
                    
                    <div class="expedition-meta">
                        <div class="expedition-difficulty">
                            <span class="difficulty-icon">${this.getDifficultyIcon(expedition.type)}</span>
                            ${expedition.difficulty.grade} - ${expedition.difficulty.name}
                        </div>
                        <span class="expedition-altitude">${expedition.altitude.toLocaleString()} ${expedition.altitudeUnit}</span>
                    </div>
                    
                    <div class="expedition-stats">
                        <div class="stat-item">
                            <span class="material-symbols-rounded stat-icon">photo_camera</span>
                            <span>${expedition.photoCount} fotos</span>
                        </div>
                        <div class="stat-item">
                            <span class="material-symbols-rounded stat-icon">trending_up</span>
                            <span>${expedition.ascents} ascensos</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Configura los eventos del sistema
     */
    setupEvents() {
        // Filtros
        const filterButtons = this.container.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleFilterClick(e));
        });

        // Cards
        const cards = this.container.querySelectorAll('.expedition-card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => this.handleCardClick(e));
        });

        // Overlay close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay && this.overlay.isOpen) {
                this.overlay.close();
            }
        });

        console.log('🎯 Eventos configurados');
    }

    /**
     * Maneja clicks en botones de filtro
     */
    handleFilterClick(event) {
        const button = event.target;
        const filter = button.dataset.filter;

        // Actualizar botones activos
        this.container.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        // Filtrar expediciones
        this.filterExpeditions(filter);

        console.log(`🔍 Filtro aplicado: ${filter}`);
    }

    /**
     * Maneja clicks en cards de expedición
     */
    handleCardClick(event) {
        const card = event.currentTarget;
        const expeditionId = card.dataset.expedition;
        
        if (expeditionId && this.expeditions[expeditionId]) {
            this.openExpedition(expeditionId);
        }
    }

    /**
     * Abre una expedición en el overlay
     */
    openExpedition(expeditionId) {
        console.log(`🖼️ Abriendo expedición: ${expeditionId}`);
        
        if (this.overlay) {
            this.overlay.open(expeditionId);
        } else {
            console.warn('⚠️ GalleryOverlay no disponible');
            // Fallback: alert básico
            const expedition = this.expeditions[expeditionId];
            alert(`${expedition.name}\n${expedition.shortDescription}`);
        }
    }

    /**
     * Filtra las expediciones por categoría
     */
    filterExpeditions(filter) {
        const cards = this.container.querySelectorAll('.expedition-card');
        
        cards.forEach(card => {
            const category = card.dataset.category;
            const shouldShow = filter === 'all' || filter === category;
            
            if (shouldShow) {
                card.style.display = 'block';
                card.classList.add('fade-in');
            } else {
                card.style.display = 'none';
                card.classList.remove('fade-in');
            }
        });
    }

    /**
     * Obtiene expediciones filtradas y ordenadas
     */
    getFilteredExpeditions(filter = 'all', sort = 'featured') {
        let expeditions = Object.values(this.expeditions)
            .filter(exp => exp.status === 'active');

        // Aplicar filtro
        if (filter && filter !== 'all') {
            expeditions = expeditions.filter(exp => exp.category === filter);
        }

        // Aplicar ordenamiento
        expeditions = this.sortExpeditions(expeditions, sort);

        return expeditions;
    }

    /**
     * Ordena las expediciones según criterio
     */
    sortExpeditions(expeditions, sortBy) {
        const sortConfig = this.config.sorting.options.find(opt => opt.id === sortBy);
        
        if (!sortConfig) {
            return expeditions;
        }

        return expeditions.sort((a, b) => {
            let valueA = this.getNestedValue(a, sortConfig.field);
            let valueB = this.getNestedValue(b, sortConfig.field);

            // Manejar valores especiales
            if (sortConfig.field === 'featured') {
                valueA = a.featured ? 1 : 0;
                valueB = b.featured ? 1 : 0;
            }

            // Ordenar
            if (sortConfig.direction === 'desc') {
                return valueB > valueA ? 1 : -1;
            } else {
                return valueA > valueB ? 1 : -1;
            }
        });
    }

    /**
     * Obtiene valor anidado de un objeto (ej: "difficulty.grade")
     */
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }

    /**
     * Verifica si una expedición es nueva
     */
    isNewExpedition(expedition) {
        if (!expedition.lastUpdate) return false;
        
        const updateDate = new Date(expedition.lastUpdate);
        const now = new Date();
        const daysDiff = (now - updateDate) / (1000 * 60 * 60 * 24);
        
        return daysDiff <= this.config.ui.newBadgeDuration;
    }

    /**
     * Obtiene el icono según el tipo de expedición
     */
    getDifficultyIcon(type) {
        const icons = {
            'Cerro': '⛰️',
            'Volcán': '🌋',
            'Sierra': '🏔️'
        };
        return icons[type] || '🥾';
    }

    /**
     * Obtiene el total de fotos en todas las expediciones
     */
    getTotalPhotoCount() {
        return Object.values(this.expeditions)
            .reduce((total, exp) => total + (exp.photoCount || 0), 0);
    }

    /**
     * Maneja errores del sistema
     */
    handleError(error) {
        console.error('❌ GallerySystem Error:', error);
        
        if (this.container) {
            this.container.innerHTML = `
                <div class="container">
                    <div class="error-message">
                        <h3>Error al cargar la galería</h3>
                        <p>No se pudieron cargar las expediciones. Por favor, intenta recargar la página.</p>
                        <button onclick="window.location.reload()" class="btn-primary">Recargar</button>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Dispara eventos personalizados
     */
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(`gallery:${eventName}`, {
            detail: detail,
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    /**
     * API pública del sistema
     */
    getExpedition(id) {
        return this.expeditions[id];
    }

    getAllExpeditions() {
        return this.expeditions;
    }

    getConfig() {
        return this.config;
    }

    isReady() {
        return this.isInitialized;
    }

    refresh() {
        if (this.isInitialized) {
            this.render();
        }
    }

    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.isInitialized = false;
        console.log('🗑️ GallerySystem destruido');
    }
}

/* ======================================
   INICIALIZACIÓN AUTOMÁTICA
   ====================================== */

// Inicializar automáticamente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Solo inicializar si estamos en la página del fundador
    if (document.body.contains(document.querySelector('.mountaineering-section')) || 
        window.location.pathname.includes('fundador')) {
        
        console.log('🏔️ Inicializando sistema de galería automáticamente...');
        
        // Crear instancia global del sistema
        window.gallerySystem = new GallerySystem();
        
        // Inicializar con delay para asegurar que otros scripts estén listos
        setTimeout(() => {
            window.gallerySystem.init().catch(error => {
                console.error('❌ Error en inicialización automática:', error);
            });
        }, 500);
    }
});

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
    window.GallerySystem = GallerySystem;
}

console.log('📦 GallerySystem cargado y listo');
console.log('🏔️ Sistema de Galería Dinámico - Preuniversitario JMC');
console.log('💻 Desarrollado por Alexandre Castillo - ACastillo DG');