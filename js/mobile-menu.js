// ======================================
// MENÚ MÓVIL MINIMAL - AGOSTO 2025
// ======================================

class MinimalMobileMenu {
    constructor() {
        this.toggle = document.getElementById('mobileMenuToggle');
        this.closeBtn = document.getElementById('mobileMenuClose');
        this.menu = document.getElementById('mobileMenu');
        this.navLinks = document.querySelectorAll('.mobile-nav-link');
        this.isOpen = false;
        
        this.init();
    }

    init() {
        // Verificar que los elementos existen
        if (!this.toggle || !this.closeBtn || !this.menu) {
            console.warn('Elementos del menú móvil no encontrados');
            return;
        }

        // Event listeners
        this.toggle.addEventListener('click', () => this.toggleMenu());
        this.closeBtn.addEventListener('click', () => this.closeMenu());
        
        // Cerrar al hacer clic en links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Configurar navegación activa
        this.setupActiveNavigation();
    }

    toggleMenu() {
        this.isOpen ? this.closeMenu() : this.openMenu();
    }

    openMenu() {
        this.isOpen = true;
        this.toggle.classList.add('active');
        this.menu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        this.isOpen = false;
        this.toggle.classList.remove('active');
        this.menu.classList.remove('active');
        document.body.style.overflow = '';
    }

    setupActiveNavigation() {
        const currentPath = window.location.pathname.replace(/\/$/, '');
        const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

        allNavLinks.forEach(link => {
            const linkHref = link.getAttribute('href').replace(/\/$/, '');
            link.classList.remove('active');
            // Para la raíz
            if ((currentPath === '' || currentPath === '/') && (linkHref === '' || linkHref === '/')) {
                link.classList.add('active');
            } else if (linkHref !== '' && linkHref === currentPath) {
                link.classList.add('active');
            }
        });
    }
}

// Smooth scrolling para enlaces anchor
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar menú móvil
    new MinimalMobileMenu();
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});