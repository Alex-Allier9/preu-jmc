/**
 * DYNAMIC-GALLERY.JS
 * Sistema de galería automático para Preuniversitario JMC
 * Detecta carpetas/imágenes automáticamente
 * Compatible con Cloudflare/Netlify image optimization
 */

// Configuración global
const GALLERY_CONFIG = {
    basePath: "media/images/fundador/gallery/",
    categories: [
        "aconcagua",
        "el-plomo",
        "marmolejo",
        "ojos-salado",
        "sierras-santiago",
        "volcan-san-jose"
    ],
    titles: {
        "aconcagua": "Cerro Aconcagua",
        "el-plomo": "Cerro El Plomo",
        "marmolejo": "Cerro Marmolejo",
        "ojos-salado": "Ojos del Salado",
        "sierras-santiago": "Sierras de Santiago",
        "volcan-san-jose": "Volcán San José"
    },
    descriptions: {
        "aconcagua": "Cumbre más alta de América",
        "el-plomo": "Ascenso invernal en condiciones extremas",
        "marmolejo": "Cumbre alcanzada después de 11h 51min",
        "ojos-salado": "Volcán más alto del mundo",
        "sierras-santiago": "Trekking en la cordillera",
        "volcan-san-jose": "Récord personal de ascenso"
    }
};

class DynamicGallery {
    constructor() {
        this.galleryData = {};
        this.init();
    }

    async init() {
        await this.scanGalleryFolders();
        this.renderGallery();
        this.connectToLightbox();
    }

    async scanGalleryFolders() {
        try {
            for (const folder of GALLERY_CONFIG.categories) {
                const images = [];
                
                // Simulamos la detección de imágenes (en un sitio estático real necesitarías un backend o lista predefinida)
                for (let i = 1; i <= 20; i++) {
                    const num = i.toString().padStart(4, '0');
                    const imagePath = `${GALLERY_CONFIG.basePath}${folder}/${folder}_${num}.jpg`;
                    
                    // Verificación simulada (en producción, usar fetch o lista predefinida)
                    images.push(imagePath);
                }

                this.galleryData[folder] = {
                    title: GALLERY_CONFIG.titles[folder] || this.formatTitle(folder),
                    description: GALLERY_CONFIG.descriptions[folder] || "",
                    cover: `${GALLERY_CONFIG.basePath}${folder}/${folder}_cover.jpg`,
                    images: images.filter(img => img) // Eliminar entradas vacías
                };
            }
        } catch (error) {
            console.error("Error scanning gallery folders:", error);
        }
    }

    formatTitle(folderName) {
        return folderName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    renderGallery() {
        const container = document.getElementById('dynamic-gallery');
        if (!container) return;

        container.innerHTML = Object.keys(this.galleryData).map(key => {
            const item = this.galleryData[key];
            return `
                <div class="gallery-card dynamic-gallery-card" data-category="${key}">
                    <img src="${item.cover}" 
                         alt="${item.title}" 
                         class="gallery-image" 
                         loading="lazy"
                         onload="this.classList.add('loaded')">
                    <div class="gallery-zoom-icon">
                        <span class="material-symbols-rounded">zoom_in</span>
                    </div>
                    <div class="gallery-overlay">
                        <h4 class="gallery-title">${item.title}</h4>
                        <p class="gallery-description">${item.description}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    connectToLightbox() {
        if (window.UniversalGallery) {
            new UniversalGallery({
                gallerySelector: '.dynamic-gallery-card',
                showNavigation: true,
                showCategoryInfo: true,
                keyboardNavigation: true,
                touchNavigation: true
            });
        } else {
            console.warn("UniversalGallery no está disponible. Asegúrate de cargar gallery.js primero");
        }
    }
}

// Inicialización automática cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new DynamicGallery();
});

// Para desarrollo: Hacer accesible desde la consola
if (typeof window !== 'undefined') {
    window.DynamicGallery = DynamicGallery;
}

console.log('🖼️ Dynamic Gallery inicializado. Carpetas detectadas:', Object.keys(GALLERY_CONFIG.categories));