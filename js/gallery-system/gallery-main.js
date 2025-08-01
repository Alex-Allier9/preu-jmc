// 🏔️ SISTEMA DE GALERÍA DINÁMICO - PREUNIVERSITARIO JMC
// Coordinador principal del sistema de galería
// Maneja la detección automática de fotos y coordinación de componentes

class GallerySystem {
    constructor() {
        this.initialized = false;
        this.detectedPhotos = {};
        this.currentOverlay = null;
        
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        try {
            console.log('🏔️ Inicializando Sistema de Galería JMC...');
            
            // Verificar dependencias
            if (!this.checkDependencies()) {
                return;
            }

            // Detectar fotos automáticamente
            await this.detectAllPhotos();
            
            // Inicializar componentes
            this.initializeComponents();
            
            // Configurar eventos globales
            this.setupGlobalEvents();
            
            this.initialized = true;
            console.log('✅ Sistema de Galería JMC inicializado correctamente');
            
        } catch (error) {
            console.error('❌ Error inicializando Sistema de Galería:', error);
            this.showErrorMessage('Error inicializando la galería. Por favor recarga la página.');
        }
    }

    checkDependencies() {
        const requiredGlobals = [
            'expeditionsData', 
            'galleryConfig', 
            'GalleryCards', 
            'GalleryOverlay'
        ];
        
        const missing = requiredGlobals.filter(dep => !window[dep]);
        
        if (missing.length > 0) {
            console.error('❌ Dependencias faltantes:', missing);
            console.log('🔍 Verificando disponibilidad de objetos globales:');
            requiredGlobals.forEach(dep => {
                console.log(`  - ${dep}:`, window[dep] ? '✅ Disponible' : '❌ Faltante');
            });
            
            // Intentar reinicializar después de un breve delay
            console.log('🔄 Reintentando inicialización en 2 segundos...');
            setTimeout(() => {
                if (this.checkDependencies()) {
                    console.log('🎯 Dependencias ahora disponibles, reinicializando...');
                    this.init();
                } else {
                    this.showErrorMessage(`Error: Faltan archivos del sistema. Verifica que todos los archivos JS se hayan cargado correctamente.`);
                }
            }, 2000);
            
            return false;
        }
        
        console.log('✅ Todas las dependencias están disponibles');
        return true;
    }

    async detectAllPhotos() {
        console.log('📸 Detectando fotos automáticamente...');
        
        const expeditions = Object.keys(window.expeditionsData);
        const detectionPromises = expeditions.map(expeditionId => 
            this.detectExpeditionPhotos(expeditionId)
        );
        
        const results = await Promise.all(detectionPromises);
        
        // Procesar resultados
        expeditions.forEach((expeditionId, index) => {
            this.detectedPhotos[expeditionId] = results[index];
            console.log(`📂 ${expeditionId}: ${results[index].length} fotos detectadas`);
        });
    }

    async detectExpeditionPhotos(expeditionId) {
        const photos = [];
        const basePath = window.galleryConfig.basePath + expeditionId + '/';
        const format = window.galleryConfig.photoFormat;
        
        console.log(`🔍 Detectando fotos para ${expeditionId}: listando archivos en carpeta`);
        
        try {
            // Obtener lista de archivos de la carpeta
            const fileList = await this.fetchDirectoryListing(basePath);
            
            // Filtrar solo las fotos de la expedición (excluir cover)
            const photoFiles = fileList
                .filter(filename => {
                    return filename.startsWith(`${expeditionId}_`) && 
                           filename.endsWith(`.${format}`) &&
                           !filename.includes('cover') &&
                           /\d{4}\.jpg$/.test(filename); // Debe terminar con 4 dígitos + .jpg
                })
                .sort(); // Ordenar alfabéticamente
            
            console.log(`� Archivos encontrados para ${expeditionId}:`, photoFiles);
            
            // Procesar cada archivo encontrado
            photoFiles.forEach(filename => {
                // Extraer número de índice del filename
                const match = filename.match(/_(\d{4})\./);
                const index = match ? parseInt(match[1]) : 0;
                
                photos.push({
                    filename: filename,
                    path: basePath + filename,
                    index: index
                });
            });
            
            // Ordenar por índice para mantener secuencia correcta
            photos.sort((a, b) => a.index - b.index);
            
        } catch (error) {
            console.warn(`⚠️ Error listando archivos para ${expeditionId}, usando método fallback:`, error);
            // Fallback: usar método anterior si falla la lista de archivos
            return await this.detectExpeditionPhotosLegacy(expeditionId);
        }
        
        return photos;
    }

    async fetchDirectoryListing(directoryPath) {
        // Intentar diferentes métodos para obtener lista de archivos
        
        // Método 1: Fetch directo del directorio (funciona en algunos servidores)
        try {
            const response = await fetch(directoryPath);
            if (response.ok) {
                const html = await response.text();
                return this.parseDirectoryHTML(html);
            }
        } catch (error) {
            console.log('Método 1 falló, probando método alternativo...');
        }
        
        // Método 2: Probar archivos secuencialmente pero más eficientemente
        return await this.detectFilesByPattern(directoryPath);
    }

    parseDirectoryHTML(html) {
        const files = [];
        // Patrones comunes para diferentes servidores web
        const patterns = [
            /<a[^>]*href=["']([^"']*\.jpg)["'][^>]*>/gi,  // Apache/Nginx
            /<td><a href="([^"]*\.jpg)">/gi,              // Lighttpd
            /href=["']([^"']*\.jpg)["']/gi                 // General
        ];
        
        for (const pattern of patterns) {
            let match;
            while ((match = pattern.exec(html)) !== null) {
                const filename = match[1];
                if (filename && !filename.includes('/') && filename.endsWith('.jpg')) {
                    files.push(filename);
                }
            }
            if (files.length > 0) break;
        }
        
        return [...new Set(files)]; // Eliminar duplicados
    }

    async detectFilesByPattern(basePath) {
        const files = [];
        const format = window.galleryConfig.photoFormat;
        const maxPhotos = window.galleryConfig.maxPhotosToDetect;
        
        // Extraer expedition ID del path
        const expeditionId = basePath.split('/').slice(-2, -1)[0];
        
        console.log(`🔄 Detectando archivos secuencialmente para ${expeditionId}...`);
        
        // Método secuencial mejorado: continuar buscando después de gaps pequeños
        let consecutiveFailures = 0;
        const maxConsecutiveFailures = 3; // Parar después de 3 fallos consecutivos
        
        for (let i = 1; i <= maxPhotos; i++) {
            const filename = `${expeditionId}_${i.toString().padStart(4, '0')}.${format}`;
            
            try {
                const exists = await this.checkImageExists(basePath + filename);
                if (exists) {
                    files.push(filename);
                    consecutiveFailures = 0; // Reset contador
                    console.log(`✅ Encontrada: ${filename}`);
                } else {
                    consecutiveFailures++;
                    console.log(`❌ No encontrada: ${filename} (fallos consecutivos: ${consecutiveFailures})`);
                    
                    // Solo parar después de varios fallos consecutivos
                    if (consecutiveFailures >= maxConsecutiveFailures) {
                        console.log(`🛑 Deteniendo búsqueda después de ${maxConsecutiveFailures} fallos consecutivos`);
                        break;
                    }
                }
            } catch (error) {
                consecutiveFailures++;
                console.warn(`⚠️ Error verificando ${filename}:`, error);
                
                if (consecutiveFailures >= maxConsecutiveFailures) {
                    console.log(`🛑 Deteniendo búsqueda por errores consecutivos`);
                    break;
                }
            }
        }
        
        console.log(`📊 ${expeditionId}: ${files.length} archivos encontrados`);
        return files;
    }

    // Método legacy como fallback
    async detectExpeditionPhotosLegacy(expeditionId) {
        const photos = [];
        const basePath = window.galleryConfig.basePath + expeditionId + '/';
        const format = window.galleryConfig.photoFormat;
        const maxPhotos = window.galleryConfig.maxPhotosToDetect;
        
        console.log(`� Usando método legacy para ${expeditionId}`);
        
        for (let i = 1; i <= maxPhotos; i++) {
            const filename = `${expeditionId}_${i.toString().padStart(4, '0')}.${format}`;
            const fullPath = basePath + filename;
            
            const exists = await this.checkImageExistsWithRetry(fullPath, 1); // Solo 1 reintento en legacy
            if (exists) {
                photos.push({
                    filename: filename,
                    path: fullPath,
                    index: i
                });
            } else {
                break;
            }
        }
        
        return photos;
    }

    async checkImageExistsWithRetry(imagePath, maxRetries = 2) {
        for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
            try {
                const exists = await this.checkImageExists(imagePath);
                if (exists) {
                    if (attempt > 1) {
                        console.log(`✅ Imagen encontrada en intento ${attempt}: ${imagePath}`);
                    }
                    return true;
                }
                
                // Si no existe en el primer intento, no reintentar (la imagen realmente no existe)
                if (attempt === 1) {
                    return false;
                }
            } catch (error) {
                console.warn(`⚠️ Error en intento ${attempt} para ${imagePath}:`, error);
                
                // Si es el último intento, fallar
                if (attempt === maxRetries + 1) {
                    console.error(`❌ Falló después de ${maxRetries + 1} intentos: ${imagePath}`);
                    return false;
                }
                
                // Esperar un poco antes del siguiente intento (aumenta progresivamente)
                await new Promise(resolve => setTimeout(resolve, attempt * 500));
            }
        }
        
        return false;
    }

    checkImageExists(imagePath) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            const timeout = setTimeout(() => {
                reject(new Error(`Timeout: ${imagePath}`));
            }, 3000);
            
            img.onload = () => {
                clearTimeout(timeout);
                resolve(true);
            };
            
            img.onerror = () => {
                clearTimeout(timeout);
                resolve(false);
            };
            
            img.src = imagePath;
        });
    }

    initializeComponents() {
        console.log('🔧 Inicializando componentes...');
        
        // Inicializar generador de cards
        if (window.GalleryCards) {
            try {
                this.galleryCards = new window.GalleryCards(this.detectedPhotos);
                this.galleryCards.init();
                console.log('✅ GalleryCards inicializado correctamente');
            } catch (error) {
                console.error('❌ Error inicializando GalleryCards:', error);
            }
        } else {
            console.error('❌ GalleryCards no está disponible');
        }
        
        // Inicializar sistema de overlay
        if (window.GalleryOverlay) {
            try {
                this.galleryOverlay = new window.GalleryOverlay(this.detectedPhotos);
                this.galleryOverlay.init();
                console.log('✅ GalleryOverlay inicializado correctamente');
            } catch (error) {
                console.error('❌ Error inicializando GalleryOverlay:', error);
            }
        } else {
            console.error('❌ GalleryOverlay no está disponible');
        }
        
        // Verificar que al menos uno de los componentes se haya inicializado
        if (!this.galleryCards && !this.galleryOverlay) {
            console.error('❌ Ningún componente de galería se pudo inicializar');
            this.showErrorMessage('Error: No se pudieron cargar los componentes de la galería.');
        }
    }

    setupGlobalEvents() {
        // Evento personalizado para abrir galería
        document.addEventListener('openGallery', (event) => {
            const { expeditionId, photoIndex = 0 } = event.detail;
            this.openExpeditionGallery(expeditionId, photoIndex);
        });
        
        // Evento personalizado para cerrar galería
        document.addEventListener('closeGallery', () => {
            this.closeGallery();
        });
        
        // Navegación por teclado global
        document.addEventListener('keydown', (event) => {
            if (this.currentOverlay) {
                this.handleGlobalKeyboard(event);
            }
        });
        
        // Prevenir scroll del body cuando overlay está abierto
        document.addEventListener('overlayOpen', () => {
            document.body.style.overflow = 'hidden';
        });
        
        document.addEventListener('overlayClose', () => {
            document.body.style.overflow = '';
        });
    }

    openExpeditionGallery(expeditionId, photoIndex = 0) {
        if (!this.initialized) {
            console.warn('⚠️ Sistema no inicializado aún');
            return;
        }

        const expedition = window.getExpeditionById(expeditionId);
        const photos = this.detectedPhotos[expeditionId];
        
        if (!expedition || !photos || photos.length === 0) {
            console.error('❌ Error: Expedición o fotos no encontradas', { expeditionId, expedition, photos });
            return;
        }

        // Abrir overlay
        if (this.galleryOverlay) {
            this.currentOverlay = expeditionId;
            this.galleryOverlay.open(expedition, photos, photoIndex);
            
            // Disparar evento
            document.dispatchEvent(new CustomEvent('overlayOpen', {
                detail: { expeditionId, photoIndex }
            }));
        }
    }

    closeGallery() {
        if (this.galleryOverlay && this.currentOverlay) {
            this.galleryOverlay.close();
            this.currentOverlay = null;
            
            // Disparar evento
            document.dispatchEvent(new CustomEvent('overlayClose'));
        }
    }

    handleGlobalKeyboard(event) {
        switch (event.key) {
            case 'Escape':
                event.preventDefault();
                this.closeGallery();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.galleryOverlay?.previousPhoto();
                break;
            case 'ArrowRight':
            case ' ': // Espacio
                event.preventDefault();
                this.galleryOverlay?.nextPhoto();
                break;
        }
    }

    // Métodos de utilidad
    getDetectedPhotos(expeditionId) {
        return this.detectedPhotos[expeditionId] || [];
    }

    getPhotoCount(expeditionId) {
        return this.getDetectedPhotos(expeditionId).length;
    }

    refreshPhotos(expeditionId = null) {
        if (expeditionId) {
            // Refrescar fotos de una expedición específica
            return this.detectExpeditionPhotos(expeditionId).then(photos => {
                this.detectedPhotos[expeditionId] = photos;
                return photos;
            });
        } else {
            // Refrescar todas las fotos
            return this.detectAllPhotos();
        }
    }

    showErrorMessage(message) {
        const container = document.querySelector('#mountaineering-gallery .container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--accent-red);">
                    <h3>⚠️ Error del Sistema</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" style="
                        margin-top: 1rem; 
                        padding: 0.75rem 1.5rem; 
                        background: var(--primary); 
                        color: white; 
                        border: none; 
                        border-radius: 25px; 
                        cursor: pointer;
                        font-family: var(--font-body);
                    ">
                        Recargar Página
                    </button>
                </div>
            `;
        }
    }

    // API pública para debugging
    debug() {
        return {
            initialized: this.initialized,
            detectedPhotos: this.detectedPhotos,
            currentOverlay: this.currentOverlay,
            totalExpeditions: Object.keys(this.detectedPhotos).length,
            totalPhotos: Object.values(this.detectedPhotos).reduce((total, photos) => total + photos.length, 0)
        };
    }
}

// Utilidades globales para el sistema
window.GalleryUtils = {
    // Formatear números con separadores de miles
    formatNumber: (num) => {
        return new Intl.NumberFormat('es-CL').format(num);
    },
    
    // Formatear fecha para mostrar
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // Truncar texto
    truncateText: (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    },
    
    // Generar ID único
    generateId: () => {
        return 'gallery_' + Math.random().toString(36).substr(2, 9);
    },
    
    // Detectar dispositivo móvil
    isMobile: () => {
        return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    // Throttle para eventos
    throttle: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Debounce para eventos
    debounce: (func, wait, immediate) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }
};

// Inicializar sistema automáticamente
const gallerySystem = new GallerySystem();

// Exportar para acceso global
window.GallerySystem = GallerySystem;
window.gallerySystem = gallerySystem;

// 🔍 FUNCIONES DE DEBUGGING (ejecutar desde consola del navegador)
window.debugGallery = {
    // Verificar estado del sistema
    checkStatus: () => {
        console.log('🔍 DIAGNÓSTICO DEL SISTEMA DE GALERÍA');
        console.log('=====================================');
        
        // Verificar dependencias
        const deps = ['expeditionsData', 'galleryConfig', 'GalleryCards', 'GalleryOverlay'];
        console.log('📦 Dependencias:');
        deps.forEach(dep => {
            const status = window[dep] ? '✅' : '❌';
            console.log(`  ${status} ${dep}:`, window[dep]);
        });
        
        // Verificar sistema principal
        console.log('\n🏔️ Sistema Principal:');
        console.log('  Estado:', window.gallerySystem?.initialized ? '✅ Inicializado' : '❌ No inicializado');
        console.log('  Fotos detectadas:', Object.keys(window.gallerySystem?.detectedPhotos || {}).length);
        
        // Verificar componentes
        console.log('\n🔧 Componentes:');
        console.log('  GalleryCards:', window.gallerySystem?.galleryCards ? '✅ OK' : '❌ Falta');
        console.log('  GalleryOverlay:', window.gallerySystem?.galleryOverlay ? '✅ OK' : '❌ Falta');
        
        // Verificar DOM
        console.log('\n📄 Elementos DOM:');
        const containers = document.querySelectorAll('.gallery-grid-container');
        console.log(`  Contenedores de galería: ${containers.length}`);
        
        return {
            dependencies: deps.map(dep => ({ name: dep, available: !!window[dep] })),
            initialized: window.gallerySystem?.initialized || false,
            photosDetected: Object.keys(window.gallerySystem?.detectedPhotos || {}).length,
            components: {
                cards: !!window.gallerySystem?.galleryCards,
                overlay: !!window.gallerySystem?.galleryOverlay
            }
        };
    },
    
    // Forzar reinicialización
    forceRestart: () => {
        console.log('🔄 Forzando reinicialización del sistema...');
        if (window.gallerySystem) {
            window.gallerySystem.initialized = false;
            window.gallerySystem.init();
        } else {
            console.log('⚠️ Sistema no disponible, creando nueva instancia...');
            window.gallerySystem = new GallerySystem();
        }
    },
    
    // Verificar scripts cargados
    checkScripts: () => {
        console.log('📜 Scripts cargados:');
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            const src = script.src;
            if (src.includes('gallery') || src.includes('global')) {
                console.log(`  📄 ${src.split('/').pop()}: ${script.loaded !== false ? '✅' : '❌'}`);
            }
        });
    },
    
    // Test manual de apertura de galería
    testOpen: (expeditionId = 'aconcagua') => {
        console.log(`🧪 Probando apertura de galería: ${expeditionId}`);
        if (window.gallerySystem?.galleryOverlay) {
            const photos = window.gallerySystem.detectedPhotos[expeditionId] || [];
            const expedition = window.expeditionsData[expeditionId];
            
            if (expedition && photos.length > 0) {
                window.gallerySystem.galleryOverlay.open(expedition, photos, 0);
                console.log('✅ Galería abierta correctamente');
            } else {
                console.log('❌ No se encontraron datos o fotos para la expedición');
            }
        } else {
            console.log('❌ GalleryOverlay no está disponible');
        }
    }
};

console.log('🔍 Funciones de debugging disponibles:');
console.log('  - debugGallery.checkStatus() - Verificar estado del sistema');
console.log('  - debugGallery.forceRestart() - Forzar reinicialización');
console.log('  - debugGallery.checkScripts() - Verificar scripts cargados');
console.log('  - debugGallery.testOpen("expeditionId") - Probar apertura manual');