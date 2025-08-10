/* ======================================
   INCLUDES.JS - SISTEMA COMPLETO DE CARGA DE HEADER/FOOTER
   ====================================== */

class IncludeSystem {
    constructor() {
        this.currentPage = this.detectCurrentPage();
        this.isInSubfolder = window.location.pathname.includes('./equipo/');
        this.init();
    }

    async init() {
        try {
            await this.loadHeader();
            await this.loadFooter();
            this.updateActiveNavigation();
            this.updateImagePaths();
            this.initializeHeaderEvents();
            console.log('✅ Sistema de includes cargado correctamente');
        } catch (error) {
            console.error('❌ Error cargando includes:', error);
        }
    }

    detectCurrentPage() {
        const path = window.location.pathname;

        // Detectar página actual basado en la URL
        if (path === '/' || path.includes('index')) return 'index';
        if (path.includes('nosotros')) return 'nosotros';
        if (path.includes('equipo/j-cartes')) return 'j-cartes';
        if (path.includes('equipo/m-suazo')) return 'm-suazo';
        if (path.includes('equipo')) return 'equipo';
        if (path.includes('servicios')) return 'servicios';
        if (path.includes('testimonios')) return 'testimonios';
        if (path.includes('contacto')) return 'contacto';
        if (path.includes('recursos')) return 'recursos';

        return 'unknown';
    }

    async loadHeader() {
        try {
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (!headerPlaceholder) {
                console.warn('⚠️ No se encontró #header-placeholder');
                return;
            }

            const headerPath = this.isInSubfolder ? '../includes/header.html' : 'includes/header.html';
            const response = await fetch(headerPath);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const headerContent = await response.text();
            headerPlaceholder.innerHTML = headerContent;

        } catch (error) {
            console.error('Error cargando header:', error);
        }
    }

    async loadFooter() {
        try {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (!footerPlaceholder) {
                console.warn('⚠️ No se encontró #footer-placeholder');
                return;
            }

            const footerPath = this.isInSubfolder ? '../includes/footer.html' : 'includes/footer.html';
            const response = await fetch(footerPath);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const footerContent = await response.text();
            footerPlaceholder.innerHTML = footerContent;

        } catch (error) {
            console.error('Error cargando footer:', error);
        }
    }

    updateActiveNavigation() {
        // Remover clases activas existentes
        document.querySelectorAll('.nav-link, .nav-sublink, .mobile-nav-link, .mobile-nav-sublink').forEach(link => {
            link.classList.remove('active');
        });

        // Agregar clase activa según página actual
        const activeLinks = document.querySelectorAll(`[data-page="${this.currentPage}"]`);
        activeLinks.forEach(link => {
            link.classList.add('active');
        });

        // Si estamos en una subpágina de equipo, marcar equipo como activo también
        if (this.currentPage === 'j-cartes' || this.currentPage === 'm-suazo') {
            const equipoLinks = document.querySelectorAll('[data-page="equipo"]');
            equipoLinks.forEach(link => {
                link.classList.add('active');
            });
        }
    }

    updateImagePaths() {
        // Actualizar rutas de imágenes según profundidad de carpeta
        if (!this.isInSubfolder) return;

        // Actualizar imágenes en header
        const headerImages = document.querySelectorAll('#header-placeholder img');
        headerImages.forEach(img => {
            const currentSrc = img.getAttribute('src');
            if (currentSrc && !currentSrc.startsWith('http') && !currentSrc.startsWith('../')) {
                img.src = '../' + currentSrc;
            }
        });

        // Actualizar imágenes en footer  
        const footerImages = document.querySelectorAll('#footer-placeholder img');
        footerImages.forEach(img => {
            const currentSrc = img.getAttribute('src');
            if (currentSrc && !currentSrc.startsWith('http') && !currentSrc.startsWith('../')) {
                img.src = '../' + currentSrc;
            }
        });
    }

    initializeHeaderEvents() {
        // Scroll effect para header
        this.initializeScrollEffect();

        // Sistema de menú móvil
        this.initializeMobileMenu();

        // Accesibilidad y navegación por teclado
        this.initializeKeyboardNavigation();
    }

    initializeScrollEffect() {
        const header = document.getElementById('header');
        if (!header) return;

        const handleScroll = () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Ejecutar una vez al cargar
    }

    initializeMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');

        if (!mobileMenuToggle || !mobileMenu) return;

        // SOLO el botón hamburguesa puede abrir/cerrar el menú
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            // Toggle: si está activo, cerrar; si no, abrir
            if (mobileMenu.classList.contains('active')) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        });

        // OPCIONAL: Mantener cierre con Escape por accesibilidad
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    openMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');

        if (mobileMenu) mobileMenu.classList.add('active');
        if (mobileMenuToggle) mobileMenuToggle.classList.add('active');
        if (mobileMenuBackdrop) mobileMenuBackdrop.classList.add('active');

        document.body.style.overflow = 'hidden'; // Prevenir scroll

        // Focus en el primer enlace para accesibilidad
        setTimeout(() => {
            const firstLink = document.querySelector('.mobile-nav-link');
            if (firstLink) firstLink.focus();
        }, 300);
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');

        if (mobileMenu) mobileMenu.classList.remove('active');
        if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
        if (mobileMenuBackdrop) mobileMenuBackdrop.classList.remove('active');

        document.body.style.overflow = ''; // Restaurar scroll
    }

    initializeKeyboardNavigation() {
        // Cerrar menú móvil con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            }
        });

        // Navegación por teclado en desplegables
        const navDropdowns = document.querySelectorAll('.nav-dropdown');
        navDropdowns.forEach(dropdown => {
            const mainLink = dropdown.querySelector('.nav-link');
            const submenu = dropdown.querySelector('.nav-submenu');

            if (mainLink && submenu) {
                mainLink.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        const firstSublink = submenu.querySelector('.nav-sublink');
                        if (firstSublink) firstSublink.focus();
                    }
                });
            }
        });
    }
}

// ======================================
// FUNCIONES UTILITARIAS GLOBALES
// ======================================

// Función para actualizar navegación activa desde páginas específicas
window.updateActiveNavigation = (pageName) => {
    if (window.includeSystem) {
        window.includeSystem.currentPage = pageName;
        window.includeSystem.updateActiveNavigation();
    }
};

// Función para debug
window.debugIncludes = () => {
    if (window.includeSystem) {
        console.log('📊 Estado del sistema de includes:');
        console.log('Página actual:', window.includeSystem.currentPage);
        console.log('En subcarpeta:', window.includeSystem.isInSubfolder);
        console.log('URLs detectadas:', window.location.pathname);
    }
};

// ======================================
// INICIALIZACIÓN
// ======================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.includeSystem = new IncludeSystem();
});

// Reinicializar en navegación SPA (si se implementa en el futuro)
window.addEventListener('popstate', () => {
    if (window.includeSystem) {
        window.includeSystem.currentPage = window.includeSystem.detectCurrentPage();
        window.includeSystem.updateActiveNavigation();
    }
});