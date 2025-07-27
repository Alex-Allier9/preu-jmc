/* ======================================
   NOSOTROS.JS - FUNCIONALIDADES ESPECÍFICAS DE LA PÁGINA
   ====================================== */

// Función específica para manejar el redimensionamiento de stats grids en nosotros
function handleNosotrosStatsGridResize() {
    const statsGrids = document.querySelectorAll('.stats-grid, .results .stats-grid');
    const windowWidth = window.innerWidth;

    statsGrids.forEach(grid => {
        const cards = grid.querySelectorAll('.stat-card');

        // Vista tablet - asegurar exactamente 4 cards (2x2)
        if (windowWidth <= 1312 && windowWidth > 848) { // 82rem = 1312px, 53rem = 848px
            cards.forEach((card, index) => {
                card.style.display = index < 4 ? 'flex' : 'none';
            });
        }
        // Vista móvil - mostrar todas las cards (1x4)
        else if (windowWidth <= 848) { // 53rem = 848px
            cards.forEach(card => {
                card.style.display = 'flex';
            });
        }
        // Vista desktop - mostrar todas las cards (1x4)
        else {
            cards.forEach(card => {
                card.style.display = 'flex';
            });
        }
    });
}

// Animación específica de contadores para la sección de resultados de nosotros
function initNosotrosSpecificCounters() {
    const pageSpecificCounters = document.querySelectorAll('.results .stat-number');

    if (pageSpecificCounters.length > 0) {
        pageSpecificCounters.forEach(counter => {
            const target = counter.textContent;

            if (!isNaN(target.replace('+', '').replace('%', ''))) {
                counter.textContent = '0';

                const counterObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // Animación más rápida para la sección de resultados
                            animateValue(counter, 0, parseInt(target.replace('+', '').replace('%', '')), 1200, target);
                            counterObserver.unobserve(counter);
                        }
                    });
                });

                counterObserver.observe(counter);
            }
        });
    }
}

// Inicialización específica de la página nosotros
document.addEventListener('DOMContentLoaded', function () {
    console.log('Nosotros page initialized');

    // Inicializar funcionalidades específicas de nosotros
    handleNosotrosStatsGridResize();
    initNosotrosSpecificCounters();

    // Agregar listener para redimensionamiento específico de nosotros
    window.addEventListener('resize', debounce(handleNosotrosStatsGridResize, 100));
});