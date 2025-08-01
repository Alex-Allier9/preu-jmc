/* ======================================
   GALLERY-CARDS.JS - GENERADOR DINÁMICO DE CARDS
   Preuniversitario JMC - Sistema de Expediciones
   ====================================== */

/**
 * GalleryCards - Maneja la generación y comportamiento de las cards de expediciones
 */
class GalleryCards {
    constructor(gallerySystem) {
        this.gallery = gallerySystem;
        this.container = null;
        this.currentFilter = 'all';
        this.currentSort = 'featured';
        this.animations = [];
        
        console.log('🃏 GalleryCards inicializando...');
    }

    /**
     * Renderiza todas las cards en el grid
     */
    render() {
        this.container = this.gallery.container.querySelector('#grid-2-2-1');
        if (!this.container) {
            console.error('❌ Grid container no encontrado');
            return;
        }

        console.log('🎨 Renderizando cards dinámicamente...');

        // Obtener expediciones filtradas y ordenadas
        const expeditions = this.gallery.getFilteredExpeditions(this.currentFilter, this.currentSort);

        // Limpiar contenedor
        this.container.innerHTML = '';

        // Crear y agregar cards
        expeditions.forEach((expedition, index) => {
            const cardElement = this.createCard(expedition, index);
            this.container.appendChild(cardElement);
        });

        // Configurar eventos
        this.setupCardEvents();

        // Animar entrada
        this.animateCardsEntrance();

        console.log(`✅ ${expeditions.length} cards renderizadas`);
    }

    /**
     * Crea una card de expedición
     */
    createCard(expedition, index = 0) {
        const card = document.createElement('div');
        card.className = 'expedition-card fade-in';
        card.dataset.expedition = expedition.id;
        card.dataset.category = expedition.category;
        card.dataset.index = index;

        // Verificar si es nueva
        const isNew = this.gallery.isNewExpedition(expedition);

        // Crear badges de logros
        const achievementBadges = this.createAchievementBadges(expedition.achievements || []);

        // Crear imagen con manejo de errores
        const imageElement = this.createImageElement(expedition);

        // Crear contenido
        const content = this.createCardContent(expedition);

        // Ensamblar card
        card.innerHTML = `
            ${isNew ? `<div class="new-badge">${this.gallery.config.ui.newBadgeText}</div>` : ''}
            ${achievementBadges}
            ${imageElement}
            ${content}
        `;

        // Agregar eventos específicos de la card
        this.setupSingleCardEvents(card, expedition);

        return card;
    }

    /**
     * Crea el elemento de imagen con lazy loading y manejo de errores
     */
    createImageElement(expedition) {
        const basePath = this.gallery.config.gallery.basePath;
        const imagePath = `${basePath}${expedition.id}/${expedition.coverImage}`;
        
        return `
            <div class="expedition-image-container">
                <img src="${imagePath}" 
                     alt="${expedition.name}" 
                     class="expedition-image"
                     loading="lazy"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW4gbm8gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4='">
                
                <!-- Overlay de hover -->
                <div class="expedition-image-overlay">
                    <span class="material-symbols-rounded">zoom_in</span>
                </div>
            </div>
        `;
    }

    /**
     * Crea los badges de logros
     */
    createAchievementBadges(achievements) {
        if (!achievements.length) return '';

        const badges = achievements.slice(0, 3).map(achievement => `
            <span class="achievement-badge material-symbols-rounded" 
                  title="${achievement.description}">
                ${achievement.icon}
            </span>
        `).join('');

        return `<div class="achievement-badges">${badges}</div>`;
    }

    /**
     * Crea el contenido principal de la card
     */
    createCardContent(expedition) {
        const difficultyIcon = this.gallery.getDifficultyIcon(expedition.type);
        const stats = this.createStatsSection(expedition);

        return `
            <div class="expedition-content">
                <h3 class="expedition-title">${expedition.name}</h3>
                <p class="expedition-description">${expedition.shortDescription}</p>
                
                <div class="expedition-meta">
                    <div class="expedition-difficulty">
                        <span class="difficulty-icon">${difficultyIcon}</span>
                        ${expedition.difficulty.grade} - ${expedition.difficulty.name}
                    </div>
                    <span class="expedition-altitude">
                        ${expedition.altitude.toLocaleString()} ${expedition.altitudeUnit}
                    </span>
                </div>
                
                ${stats}
            </div>
        `;
    }

    /**
     * Crea la sección de estadísticas
     */
    createStatsSection(expedition) {
        return `
            <div class="expedition-stats">
                <div class="stat-item">
                    <span class="material-symbols-rounded stat-icon">photo_camera</span>
                    <span>${expedition.photoCount} fotos</span>
                </div>
                <div class="stat-item">
                    <span class="material-symbols-rounded stat-icon">trending_up</span>
                    <span>${expedition.ascents} ${expedition.ascents === 1 ? 'ascenso' : 'ascensos'}</span>
                </div>
            </div>
        `;
    }

    /**
     * Configura eventos para todas las cards
     */
    setupCardEvents() {
        const cards = this.container.querySelectorAll('.expedition-card');
        
        cards.forEach(card => {
            // Click para abrir overlay
            card.addEventListener('click', (e) => this.handleCardClick(e));
            
            // Hover effects mejorados
            this.setupCardHoverEffects(card);
        });

        console.log(`🎯 Eventos configurados para ${cards.length} cards`);
    }

    /**
     * Configura eventos específicos de una card
     */
    setupSingleCardEvents(card, expedition) {
        // Hover personalizado con información adicional
        card.addEventListener('mouseenter', () => {
            this.showCardTooltip(card, expedition);
        });

        card.addEventListener('mouseleave', () => {
            this.hideCardTooltip(card);
        });

        // Accesibilidad: navegación por teclado
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Ver expedición ${expedition.name}`);

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleCardClick(e);
            }
        });
    }

    /**
     * Configura efectos de hover avanzados
     */
    setupCardHoverEffects(card) {
        if (!this.gallery.config.animations.cardHover.enabled) return;

        const image = card.querySelector('.expedition-image');
        const overlay = card.querySelector('.expedition-image-overlay');
        const achievements = card.querySelectorAll('.achievement-badge');

        card.addEventListener('mouseenter', () => {
            // Efecto de imagen
            if (image) {
                image.style.transform = 'scale(1.05)';
            }
            
            // Mostrar overlay
            if (overlay) {
                overlay.style.opacity = '1';
                overlay.style.transform = 'scale(1)';
            }

            // Animar badges
            achievements.forEach((badge, index) => {
                setTimeout(() => {
                    badge.style.transform = 'scale(1.1) rotate(5deg)';
                }, index * 100);
            });
        });

        card.addEventListener('mouseleave', () => {
            // Resetear imagen
            if (image) {
                image.style.transform = 'scale(1)';
            }
            
            // Ocultar overlay
            if (overlay) {
                overlay.style.opacity = '0';
                overlay.style.transform = 'scale(0.8)';
            }

            // Resetear badges
            achievements.forEach(badge => {
                badge.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }

    /**
     * Maneja clicks en las cards
     */
    handleCardClick(event) {
        const card = event.currentTarget;
        const expeditionId = card.dataset.expedition;
        
        // Efecto visual de click
        this.animateCardClick(card);
        
        // Abrir expedición
        if (expeditionId) {
            this.gallery.openExpedition(expeditionId);
        }

        console.log(`🖱️ Card clickeada: ${expeditionId}`);
    }

    /**
     * Anima el click en una card
     */
    animateCardClick(card) {
        card.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }

    /**
     * Muestra tooltip con información adicional
     */
    showCardTooltip(card, expedition) {
        // Implementación simple de tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'card-tooltip';
        tooltip.innerHTML = `
            <strong>${expedition.name}</strong><br>
            Dificultad: ${expedition.difficulty.name}<br>
            Última actualización: ${new Date(expedition.lastUpdate).toLocaleDateString()}
        `;
        
        card.appendChild(tooltip);
        
        // Posicionar tooltip
        setTimeout(() => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(-10px)';
        }, 10);
    }

    /**
     * Oculta tooltip
     */
    hideCardTooltip(card) {
        const tooltip = card.querySelector('.card-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    /**
     * Anima la entrada de las cards
     */
    animateCardsEntrance() {
        const cards = this.container.querySelectorAll('.expedition-card');
        
        // Limpiar animaciones anteriores
        this.clearAnimations();

        cards.forEach((card, index) => {
            // Estado inicial
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            // Animar con delay escalonado
            const delay = index * 100;
            
            const animation = setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, delay);
            
            this.animations.push(animation);
        });

        console.log('✨ Animaciones de entrada iniciadas');
    }

    /**
     * Limpia las animaciones activas
     */
    clearAnimations() {
        this.animations.forEach(animation => clearTimeout(animation));
        this.animations = [];
    }

    /**
     * Filtra cards por categoría
     */
    filter(category) {
        this.currentFilter = category;
        
        const cards = this.container.querySelectorAll('.expedition-card');
        
        cards.forEach(card => {
            const cardCategory = card.dataset.category;
            const shouldShow = category === 'all' || category === cardCategory;
            
            if (shouldShow) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, 10);
            } else {
                card.classList.remove('fade-in');
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });

        console.log(`🔍 Filtro aplicado: ${category}`);
    }

    /**
     * Ordena cards según criterio
     */
    sort(criteria) {
        this.currentSort = criteria;
        this.render(); // Re-renderizar con nuevo orden
        
        console.log(`📊 Ordenamiento aplicado: ${criteria}`);
    }

    /**
     * Busca expediciones por texto
     */
    search(query) {
        if (!query || query.length < 2) {
            this.showAllCards();
            return;
        }

        const cards = this.container.querySelectorAll('.expedition-card');
        const searchTerm = query.toLowerCase();
        
        cards.forEach(card => {
            const expeditionId = card.dataset.expedition;
            const expedition = this.gallery.getExpedition(expeditionId);
            
            const searchableText = [
                expedition.name,
                expedition.shortDescription,
                expedition.location.country,
                expedition.location.region,
                expedition.difficulty.name,
                expedition.type
            ].join(' ').toLowerCase();
            
            const matches = searchableText.includes(searchTerm);
            
            card.style.display = matches ? 'block' : 'none';
            
            if (matches) {
                card.classList.add('search-highlight');
            } else {
                card.classList.remove('search-highlight');
            }
        });

        console.log(`🔎 Búsqueda realizada: "${query}"`);
    }

    /**
     * Muestra todas las cards
     */
    showAllCards() {
        const cards = this.container.querySelectorAll('.expedition-card');
        
        cards.forEach(card => {
            card.style.display = 'block';
            card.classList.remove('search-highlight');
        });
    }

    /**
     * Obtiene estadísticas de las cards
     */
    getStats() {
        const cards = this.container.querySelectorAll('.expedition-card');
        const visibleCards = this.container.querySelectorAll('.expedition-card[style*="block"], .expedition-card:not([style*="none"])');
        
        return {
            total: cards.length,
            visible: visibleCards.length,
            filter: this.currentFilter,
            sort: this.currentSort
        };
    }

    /**
     * Actualiza una card específica
     */
    updateCard(expeditionId) {
        const card = this.container.querySelector(`[data-expedition="${expeditionId}"]`);
        const expedition = this.gallery.getExpedition(expeditionId);
        
        if (card && expedition) {
            const newCard = this.createCard(expedition);
            card.replaceWith(newCard);
            this.setupSingleCardEvents(newCard, expedition);
            
            console.log(`🔄 Card actualizada: ${expeditionId}`);
        }
    }

    /**
     * Destructor del componente
     */
    destroy() {
        this.clearAnimations();
        
        if (this.container) {
            this.container.innerHTML = '';
        }
        
        console.log('🗑️ GalleryCards destruido');
    }
}

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
    window.GalleryCards = GalleryCards;
}

console.log('🃏 GalleryCards cargado');
console.log('✨ Generador Dinámico de Cards - Sistema JMC');