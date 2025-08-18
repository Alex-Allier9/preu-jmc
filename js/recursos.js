/* ======================================
   RECURSOS.JS - SISTEMA DE DESCARGA SIMPLIFICADO
   ====================================== */

const RECURSOS_CONFIG = {
    downloadsPath: 'media/downloads/',
    loadingDelay: 1200
};

let filesData = [];

let loadingSection, errorSection, resourcesSection, emptySection, resourcesGrid;

class RecursosManager {
    constructor() {
        this.init();
    }

    async init() {
        try {
            console.log('📁 Inicializando recursos...');
            
            this.getDOMReferences();
            
            // Mostrar loading
            this.showLoading();
            
            // Cargar archivos con delay
            setTimeout(async () => {
                await this.loadFiles();
                this.renderFiles();
            }, RECURSOS_CONFIG.loadingDelay);
            
        } catch (error) {
            console.error('❌ Error:', error);
            this.showError();
        }
    }

    getDOMReferences() {
        console.log('🔍 Obteniendo referencias DOM...');
        
        loadingSection = document.getElementById('loadingSection');
        errorSection = document.getElementById('errorSection');
        resourcesSection = document.getElementById('resourcesSection');
        emptySection = document.getElementById('emptySection');
        resourcesGrid = document.getElementById('resourcesGrid');
        
        // Debug: verificar que todos los elementos existen
        console.log('Loading:', !!loadingSection);
        console.log('Error:', !!errorSection);
        console.log('Resources:', !!resourcesSection);
        console.log('Empty:', !!emptySection);
        console.log('Grid:', !!resourcesGrid);
        
        if (!resourcesGrid) {
            throw new Error('❌ No se encontró el grid de recursos (#resourcesGrid)');
        }
    }

    async loadFiles() {
        // Lista de archivos conocidos
        const knownFiles = [
            {
                name: 'LIBRO PROPIO - MATEMÁTICAS ENSEÑANZA MEDIA.pdf',
                path: 'media/downloads/LIBRO PROPIO - MATEMÁTICAS ENSEÑANZA MEDIA.pdf',
                type: 'pdf'
            }
        ];

        // En protocolo file://, no podemos hacer fetch HEAD requests
        // Por lo tanto, asumimos que los archivos existen
        filesData = knownFiles;

        console.log(`📄 ${filesData.length} archivos configurados`);
    }

    renderFiles() {
        console.log(`🎨 Renderizando ${filesData.length} archivos...`);
        
        if (filesData.length === 0) {
            console.log('📂 No hay archivos, mostrando estado vacío');
            this.showEmpty();
            return;
        }

        // Limpiar grid
        resourcesGrid.innerHTML = '';

        // Renderizar archivos
        filesData.forEach((file, index) => {
            console.log(`📄 Creando card para: ${file.name}`);
            const fileCard = this.createFileCard(file);
            resourcesGrid.appendChild(fileCard);
        });

        console.log('✅ Archivos renderizados, mostrando sección');
        this.showResources();
    }

    createFileCard(file) {
        const card = document.createElement('div');
    card.className = 'resource-card fade-in';

        const fileType = this.getFileType(file.name);
        const fileIcon = this.getFileIcon(fileType);

        card.innerHTML = `
            <span class="material-symbols-rounded file-icon file-icon--${fileType}">${fileIcon}</span>
            <div class="file-info">
                <h3 class="file-name">${file.name}</h3>
                <span class="file-type">${fileType.toUpperCase()}</span>
            </div>
            <a href="${file.path}" class="download-btn" download>
                <span class="material-symbols-rounded">download</span>
                Descargar
            </a>
        `;

        console.log(`📄 Card creada para ${file.name} con clases: ${card.className}`);
        return card;
    }

    getFileType(fileName) {
        const extension = fileName.toLowerCase().split('.').pop();
        
        switch (extension) {
            case 'pdf': return 'pdf';
            case 'doc':
            case 'docx': return 'doc';
            case 'xls':
            case 'xlsx': return 'excel';
            case 'ppt':
            case 'pptx': return 'powerpoint';
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif': return 'image';
            case 'zip':
            case 'rar': return 'zip';
            case 'txt': return 'text';
            default: return 'file';
        }
    }

    getFileIcon(fileType) {
        const icons = {
            'pdf': 'picture_as_pdf',
            'doc': 'description',
            'excel': 'table_chart',
            'powerpoint': 'slideshow',
            'image': 'image',
            'zip': 'folder_zip',
            'text': 'text_snippet',
            'file': 'insert_drive_file'
        };
        
        return icons[fileType] || 'insert_drive_file';
    }

    showLoading() {
        console.log('⏳ Mostrando estado de carga...');
        loadingSection.style.display = 'block';
        errorSection.style.display = 'none';
        resourcesSection.style.display = 'none';
        emptySection.style.display = 'none';
        
        // Activar animaciones fade-in para skeleton cards con stagger
        setTimeout(() => {
            const skeletonCards = loadingSection.querySelectorAll('.resource-skeleton');
            skeletonCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 150); // 150ms de delay entre cada skeleton
            });
        }, 100);
    }

    showResources() {
        console.log('📁 Mostrando recursos...');
        loadingSection.style.display = 'none';
        errorSection.style.display = 'none';
        resourcesSection.style.display = 'block';
        emptySection.style.display = 'none';
        
        // Activar animación de la sección de recursos
        setTimeout(() => {
            if (!resourcesSection.classList.contains('visible')) {
                resourcesSection.classList.add('visible');
            }
        }, 100);
        
        // Inicializar animaciones fade-in para los recursos con stagger
        setTimeout(() => {
            const resourceCards = resourcesSection.querySelectorAll('.resource-card');
            console.log(`🎨 Activando animaciones para ${resourceCards.length} cards`);
            
            resourceCards.forEach((card, index) => {
                // Verificar que la card tenga la clase fade-in
                if (!card.classList.contains('fade-in')) {
                    card.classList.add('fade-in');
                    console.log(`🎨 Añadida clase fade-in a card ${index + 1}`);
                }
                
                // Asegurar que la card no tenga ya la clase visible
                if (card.classList.contains('visible')) {
                    card.classList.remove('visible');
                }
                
                // Observar el elemento para animación
                if (window.universalObserver) {
                    window.universalObserver.observe(card);
                }
                
                // Activar animación con stagger
                setTimeout(() => {
                    card.classList.add('visible');
                    console.log(`✨ Card ${index + 1} animada`);
                }, index * 150); // 150ms de stagger entre cards
            });
        }, 300); // Más tiempo para asegurar que el DOM esté listo
        
        // Debug: verificar estilos aplicados
        console.log('📊 Estado de elementos:');
        console.log('- Loading display:', loadingSection.style.display);
        console.log('- Resources display:', resourcesSection.style.display);
        console.log('- Grid children:', resourcesGrid.children.length);
    }

    showError() {
        console.log('❌ Mostrando error...');
        loadingSection.style.display = 'none';
        errorSection.style.display = 'block';
        resourcesSection.style.display = 'none';
        emptySection.style.display = 'none';
        
        // Activar animación fade-in para el error
        setTimeout(() => {
            const errorCard = errorSection.querySelector('.recursos-glass-card--error');
            if (errorCard && !errorCard.classList.contains('visible')) {
                errorCard.classList.add('fade-in', 'visible');
            }
        }, 100);
    }

    showEmpty() {
        console.log('📂 Mostrando estado vacío...');
        loadingSection.style.display = 'none';  
        errorSection.style.display = 'none';
        resourcesSection.style.display = 'none';
        emptySection.style.display = 'block';
        
        // Activar animación fade-in para el estado vacío
        setTimeout(() => {
            const emptyCard = emptySection.querySelector('.recursos-glass-card--empty');
            if (emptyCard && !emptyCard.classList.contains('visible')) {
                emptyCard.classList.add('fade-in', 'visible');
            }
        }, 100);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el manager de recursos
    window.recursosManager = new RecursosManager();
    
    // Inicializar sistema de fade-in para elementos estáticos
    setTimeout(() => {
        if (window.universalObserver) {
            document.querySelectorAll('.fade-in').forEach(el => {
                window.universalObserver.observe(el);
            });
            
            // Activar animación del contenedor glass-section inmediatamente
            const glassSection = document.querySelector('.glass-section');
            if (glassSection) {
                setTimeout(() => {
                    glassSection.classList.add('visible');
                }, 300); // Delay para que aparezca después del header
            }
        }
    }, 200);
});

// Debugging
window.recursosDebug = {
    status: () => console.log('� Archivos:', filesData.length),
    reload: () => location.reload(),
    files: () => console.table(filesData)
};
