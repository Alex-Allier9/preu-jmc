// 🏔️ SISTEMA DE GALERÍA DINÁMICO - PREUNIVERSITARIO JMC
// Generador dinámico de cards y sistema de filtros

class GalleryCards {
    constructor(detectedPhotos) {
        this.detectedPhotos = detectedPhotos;
        this.currentFilter = 'all';
        this.currentSort = 'name'; // Cambiar default a orden alfabético
        this.container = null;
        this.filterButtons = null;
        this.expeditionsGrid = null;
    }

    init() {
        console.log('🎴 Inicializando generador de cards...');
        
        // Encontrar contenedor principal
        this.container = document.querySelector('#mountaineering-gallery');
        if (!this.container) {
            console.error('❌ Error: No se encontró el contenedor de la galería');
            return;
        }

        // Generar estructura completa
        this.generateGalleryStructure();
        
        // Configurar eventos
        this.setupEvents();
        
        // Generar cards iniciales
        this.renderExpeditions();
        
        console.log('✅ Generador de cards inicializado');
    }

    generateGalleryStructure() {
        this.container.innerHTML = `
            <!-- Header de la galería -->
            <div class="gallery-header">
                <h2 class="gallery-main-title">Expediciones Montañísticas</h2>
                <p class="gallery-subtitle">Momentos capturados en las cumbres más desafiantes de la cordillera chilena e internacional</p>
                
                <!-- Controles en una línea -->
                <div class="gallery-controls-inline">
                    <!-- Filtros por categoría (botones) -->
                    <div class="gallery-filters">
                        <span class="control-label">Filtrar:</span>
                        <div class="filter-buttons">
                            <button class="filter-btn active" data-filter="all">Todos</button>
                            <button class="filter-btn" data-filter="cerros">Cerros</button>
                            <button class="filter-btn" data-filter="volcanes">Volcanes</button>
                            <button class="filter-btn" data-filter="sierras">Sierras</button>
                        </div>
                    </div>
                    
                    <!-- Separador visual -->
                    <div class="controls-separator"></div>
                    
                    <!-- Control de ordenamiento (dropdown) -->
                    <div class="gallery-sort-dropdown">
                        <span class="control-label">Ordenar:</span>
                        <div class="dropdown-container">
                            <button class="dropdown-toggle" data-dropdown="sort">
                                <span class="dropdown-text">
                                    <span class="material-symbols-rounded">sort_by_alpha</span>
                                    Nombre (A-Z)
                                </span>
                                <span class="material-symbols-rounded dropdown-arrow">expand_more</span>
                            </button>
                            <div class="dropdown-menu" data-dropdown-menu="sort">
                                <button class="dropdown-item" data-sort="altitude-desc">
                                    <span class="material-symbols-rounded">trending_up</span>
                                    Altura ↓ (Mayor primero)
                                </button>
                                <button class="dropdown-item" data-sort="altitude-asc">
                                    <span class="material-symbols-rounded">trending_down</span>
                                    Altura ↑ (Menor primero)
                                </button>
                                <button class="dropdown-item" data-sort="difficulty-desc">
                                    <span class="material-symbols-rounded">emergency</span>
                                    Dificultad ↓ (Más difícil)
                                </button>
                                <button class="dropdown-item" data-sort="difficulty-asc">
                                    <span class="material-symbols-rounded">hiking</span>
                                    Dificultad ↑ (Más fácil)
                                </button>
                                <button class="dropdown-item active" data-sort="name">
                                    <span class="material-symbols-rounded">sort_by_alpha</span>
                                    Nombre (A-Z)
                                </button>
                                <button class="dropdown-item" data-sort="photos">
                                    <span class="material-symbols-rounded">photo_library</span>
                                    Fotos (Más fotos)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Grid de expediciones -->
            <div class="expeditions-grid"></div>
        `;

        // Obtener referencias
        this.filterButtons = this.container.querySelectorAll('.filter-btn');
        this.sortDropdown = this.container.querySelector('[data-dropdown="sort"]');
        this.sortMenu = this.container.querySelector('[data-dropdown-menu="sort"]');
        this.sortItems = this.container.querySelectorAll('[data-sort]');
        this.expeditionsGrid = this.container.querySelector('.expeditions-grid');
    }

    setupEvents() {
        // Eventos de filtros (botones)
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.setFilter(filter);
            });
        });
        
        // Eventos de dropdown de ordenamiento
        this.setupDropdownEvents();
        
        // Eventos de ordenamiento
        this.sortItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const sort = e.currentTarget.dataset.sort;
                this.setSort(sort);
            });
        });
    }

    setupDropdownEvents() {
        // Eventos para abrir/cerrar dropdown de ordenamiento
        this.sortDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });
        
        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', () => {
            this.closeDropdown();
        });
        
        // Prevenir que el menú se cierre al hacer clic dentro
        this.sortMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    toggleDropdown() {
        const isOpen = this.sortMenu.classList.contains('show');
        if (isOpen) {
            this.sortMenu.classList.remove('show');
            this.sortDropdown.classList.remove('active');
        } else {
            this.sortMenu.classList.add('show');
            this.sortDropdown.classList.add('active');
        }
    }

    closeDropdown() {
        this.sortMenu.classList.remove('show');
        this.sortDropdown.classList.remove('active');
    }

    setFilter(filter) {
        if (this.currentFilter === filter) return;
        
        this.currentFilter = filter;
        
        // Actualizar botones activos
        this.filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        // Re-renderizar expediciones
        this.renderExpeditions();
    }
    
    setSort(sort) {
        if (this.currentSort === sort) return;
        
        this.currentSort = sort;
        
        // Actualizar items activos en dropdown
        this.sortItems.forEach(item => {
            item.classList.toggle('active', item.dataset.sort === sort);
        });
        
        // Actualizar texto del dropdown - extraer solo el texto visible
        const activeItem = this.container.querySelector(`[data-sort="${sort}"]`);
        const sortToggle = this.sortDropdown.querySelector('.dropdown-text');
        if (activeItem && sortToggle) {
            const icon = activeItem.querySelector('.material-symbols-rounded');
            
            // Obtener solo el texto visible (no el contenido del ícono)
            let text = '';
            activeItem.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    text += node.textContent.trim();
                }
            });
            
            // Si no hay texto directo, usar textContent y limpiar
            if (!text) {
                text = activeItem.textContent.trim();
                // Remover texto de iconos material symbols comunes
                text = text.replace(/^(trending_up|trending_down|emergency|hiking|sort_by_alpha|photo_library)\s*/, '');
            }
            
            // Limpiar el contenido anterior
            sortToggle.innerHTML = '';
            
            // Agregar icono clonado
            if (icon) {
                const newIcon = icon.cloneNode(true);
                sortToggle.appendChild(newIcon);
            }
            
            // Agregar texto limpio
            const textNode = document.createTextNode(text);
            sortToggle.appendChild(textNode);
        }
        
        // Cerrar dropdown
        this.closeDropdown();
        
        // Re-renderizar expediciones
        this.renderExpeditions();
    }

    renderExpeditions() {
        const expeditions = this.getFilteredExpeditions();
        const expeditionsHTML = expeditions.map(expedition => 
            this.generateExpeditionCard(expedition)
        ).join('');
        
        this.expeditionsGrid.innerHTML = expeditionsHTML;
        
        // Configurar eventos de cards
        this.setupCardEvents();
    }

    getFilteredExpeditions() {
        let expeditions = Object.values(window.expeditionsData);
        
        // Filtrar por categoría
        if (this.currentFilter !== 'all') {
            expeditions = expeditions.filter(exp => exp.category === this.currentFilter);
        }
        
        // Ordenar según el criterio seleccionado
        expeditions.sort((a, b) => {
            switch (this.currentSort) {
                case 'altitude-desc':
                    // Mayor altitud primero
                    return b.altitude - a.altitude;
                
                case 'altitude-asc':
                    // Menor altitud primero
                    return a.altitude - b.altitude;
                
                case 'difficulty-desc':
                    // Más difícil primero
                    const diffA = this.getDifficultyLevel(a.difficulty.grade);
                    const diffB = this.getDifficultyLevel(b.difficulty.grade);
                    if (diffB !== diffA) {
                        return diffB - diffA;
                    }
                    // En caso de empate, ordenar por altitud descendente
                    return b.altitude - a.altitude;
                
                case 'difficulty-asc':
                    // Más fácil primero
                    const diffAsc_A = this.getDifficultyLevel(a.difficulty.grade);
                    const diffAsc_B = this.getDifficultyLevel(b.difficulty.grade);
                    if (diffAsc_A !== diffAsc_B) {
                        return diffAsc_A - diffAsc_B;
                    }
                    // En caso de empate, ordenar por altitud descendente
                    return b.altitude - a.altitude;
                
                case 'name':
                    // Orden alfabético
                    return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
                
                case 'photos':
                    // Mayor cantidad de fotos primero
                    const photosA = this.detectedPhotos[a.id]?.length || 0;
                    const photosB = this.detectedPhotos[b.id]?.length || 0;
                    if (photosB !== photosA) {
                        return photosB - photosA;
                    }
                    // En caso de empate, ordenar por altitud descendente
                    return b.altitude - a.altitude;
                
                default:
                    return 0;
            }
        });
        
        return expeditions;
    }

    // Convertir grado de dificultad a número para ordenamiento
    getDifficultyLevel(grade) {
        const difficultyMap = {
            'F': 1,     // Fácil
            'PD': 2,    // Poco Difícil
            'AD': 3,    // Algo Difícil
            'D': 4,     // Difícil
            'TD': 5,    // Muy Difícil
            'ED': 6     // Extremadamente Difícil
        };
        return difficultyMap[grade] || 0;
    }

    generateExpeditionCard(expedition) {
        const photoCount = this.detectedPhotos[expedition.id]?.length || 0;
        const isNew = window.isNewItem(expedition.lastUpdate);
        const difficulty = expedition.difficulty;
        const achievements = expedition.achievements || [];
        
        // Generar badges de logros
        const achievementBadges = achievements.slice(0, 2).map(achievement => `
            <span class="achievement-badge material-symbols-rounded" title="${achievement.description}">
                ${achievement.icon}
            </span>
        `).join('');

        return `
            <div class="expedition-card" 
                 data-category="${expedition.category}" 
                 data-expedition="${expedition.id}"
                 data-photos="${photoCount}">
                
                ${isNew ? '<div class="new-badge">NUEVO</div>' : ''}
                
                ${achievementBadges ? `<div class="achievement-badges">${achievementBadges}</div>` : ''}
                
                <img src="${window.galleryConfig.basePath}${expedition.id}/${expedition.coverImage}" 
                     alt="${expedition.name}" 
                     class="expedition-image"
                     onerror="this.src='https://images.unsplash.com/photo-1464822759844-d150df1ca4b8?w=600&h=400&fit=crop'">
                
                <div class="expedition-content">
                    <h3 class="expedition-title">${expedition.name}</h3>
                    <p class="expedition-description">${expedition.shortDescription}</p>
                    
                    <div class="expedition-meta">
                        <div class="expedition-difficulty difficulty-${difficulty.grade}">
                            <span class="difficulty-icon">${this.getDifficultyIcon(difficulty.grade)}</span>
                            ${difficulty.grade} - ${difficulty.name}
                        </div>
                        <span class="expedition-altitude">${window.GalleryUtils.formatNumber(expedition.altitude)} ${expedition.altitudeUnit}</span>
                    </div>
                    
                    <div class="expedition-stats">
                        <div class="stat-item">
                            <span class="material-symbols-rounded stat-icon">photo_camera</span>
                            <span>${photoCount} fotos</span>
                        </div>
                        <div class="stat-item">
                            <span class="material-symbols-rounded stat-icon">location_on</span>
                            <span>${expedition.location.country}</span>
                        </div>
                        ${expedition.ascents >= 1 ? `
                        <div class="stat-item">
                            <span class="material-symbols-rounded stat-icon">flag</span>
                            <span>${expedition.ascents} ${expedition.ascents === 1 ? 'ascenso' : 'ascensos'}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    getDifficultyIcon(grade) {
        const icons = {
            'F': '🥾',
            'PD': '⛰️',
            'AD': '🧗',
            'D': '⚡',
            'TD': '🔥',
            'ED': '💀'
        };
        return icons[grade] || '⛰️';
    }

    setupCardEvents() {
        const cards = this.expeditionsGrid.querySelectorAll('.expedition-card');
        
        cards.forEach(card => {
            const expeditionId = card.dataset.expedition;
            const photoCount = parseInt(card.dataset.photos);
            
            // Click en la card
            card.addEventListener('click', () => {
                if (photoCount > 0) {
                    // Abrir galería
                    document.dispatchEvent(new CustomEvent('openGallery', {
                        detail: { expeditionId, photoIndex: 0 }
                    }));
                } else {
                    // Mostrar mensaje si no hay fotos
                    this.showNoPhotosMessage(expeditionId);
                }
            });
            
            // Hover effects adicionales
            card.addEventListener('mouseenter', () => {
                this.handleCardHover(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.handleCardHover(card, false);
            });
        });
    }

    handleCardHover(card, isHovering) {
        // Animaciones adicionales si se requieren
        if (isHovering) {
            card.style.transform = 'translateY(-8px)';
        } else {
            card.style.transform = '';
        }
    }

    showNoPhotosMessage(expeditionId) {
        const expedition = window.getExpeditionById(expeditionId);
        alert(`Lo sentimos, aún no hay fotos disponibles para ${expedition.name}. ¡Pronto subiremos más contenido!`);
    }

    // Método para refrescar cards (útil después de detectar nuevas fotos)
    refresh() {
        this.renderExpeditions();
    }

    // Método para obtener estadísticas
    getStats() {
        const expeditions = Object.values(window.expeditionsData);
        const totalPhotos = Object.values(this.detectedPhotos)
            .reduce((total, photos) => total + photos.length, 0);
        
        return {
            totalExpeditions: expeditions.length,
            totalPhotos: totalPhotos,
            byCategory: {
                cerros: expeditions.filter(e => e.category === 'cerros').length,
                volcanes: expeditions.filter(e => e.category === 'volcanes').length,
                sierras: expeditions.filter(e => e.category === 'sierras').length
            },
            featured: expeditions.filter(e => e.featured).length,
            newItems: expeditions.filter(e => window.isNewItem(e.lastUpdate)).length
        };
    }
}

// Exportar clase sin estilos CSS inlineados
window.GalleryCards = GalleryCards;