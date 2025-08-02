/* ======================================
   TESTIMONIOS.JS - SISTEMA DE TESTIMONIOS CON GOOGLE SHEETS
   ====================================== */

// Configuración de Google Sheets
const TESTIMONIOS_CONFIG = {
    // URL del Google Sheet público en formato CSV
    // Cambiar SHEET_ID por el ID real del Google Sheet
    SHEET_ID: '1Wxd2scUSncOjcP-ONMaK2VsaRxVYYh3uuOavUKsq_5c',
    SHEET_URL: 'https://docs.google.com/spreadsheets/d/1Wxd2scUSncOjcP-ONMaK2VsaRxVYYh3uuOavUKsq_5c/export?format=csv&gid=0',
    
    // Configuración de filtros
    filters: {
        current: 'recientes',
        available: ['recientes', 'maximos', 'universidad', 'carrera', 'puntaje-desc']
    }
};

// Estado global de testimonios
let testimoniosData = [];
let filteredTestimonios = [];

// Clase principal para manejar testimonios
class TestimoniosManager {
    constructor() {
        this.initialized = false;
        this.loading = false;
        this.error = null;
        
        // Referencias DOM
        this.loadingElement = null;
        this.errorElement = null;
        this.gridElement = null;
        this.filterButtons = null;
        
        // Bind de métodos
        this.init = this.init.bind(this);
        this.loadTestimonios = this.loadTestimonios.bind(this);
        this.renderTestimonios = this.renderTestimonios.bind(this);
    }

    async init() {
        try {
            console.log('🎓 Inicializando sistema de testimonios...');
            
            // Obtener referencias DOM
            this.getDOMReferences();
            
            // Configurar eventos
            this.setupEvents();
            
            // Cargar testimonios desde Google Sheets
            await this.loadTestimonios();
            
            this.initialized = true;
            console.log('✅ Sistema de testimonios inicializado correctamente');
            
        } catch (error) {
            console.error('❌ Error inicializando testimonios:', error);
            this.showError('Error inicializando el sistema de testimonios');
        }
    }

    getDOMReferences() {
        this.loadingElement = document.getElementById('testimoniosLoading');
        this.errorElement = document.getElementById('testimoniosError');
        this.gridElement = document.getElementById('testimoniosGrid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        
        // Verificar que existen los elementos necesarios
        if (!this.gridElement) {
            throw new Error('No se encontró el contenedor de testimonios');
        }
    }

    setupEvents() {
        // Eventos de filtros
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.setFilter(filter);
            });
        });
        
        console.log('✅ Eventos configurados');
    }

    async loadTestimonios() {
        try {
            this.showLoading();
            console.log('📊 Cargando testimonios...');
            
            // Cargar datos desde Google Sheets
            const response = await fetch(TESTIMONIOS_CONFIG.SHEET_URL);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const csvText = await response.text();
            console.log('✅ Datos CSV recibidos:', csvText.substring(0, 200) + '...');
            
            // Parsear CSV usando Papa Parse (si está disponible) o método manual
            const parsedData = this.parseCSV(csvText);
            console.log('📋 Datos parseados:', parsedData.length, 'testimonios');
            
            // Procesar y validar datos
            testimoniosData = this.processTestimoniosData(parsedData);
            
            // Aplicar filtros iniciales (esto ordenará los datos por defecto)
            this.applyCurrentFilters();
            
            // Renderizar testimonios
            this.hideLoading();
            this.renderTestimonios();
            
            console.log('✅ Testimonios cargados exitosamente:', testimoniosData.length);
            
        } catch (error) {
            console.error('❌ Error cargando testimonios:', error);
            this.showError('No se pudieron cargar los testimonios. Verifica la conexión de Internet.');
        }
    }

    parseCSV(csvText) {
        // Usar Papa Parse si está disponible, sino usar método manual
        if (typeof Papa !== 'undefined') {
            const result = Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true
            });
            return result.data;
        } else {
            // Método manual de parseo CSV
            return this.parseCSVManual(csvText);
        }
    }

    parseCSVManual(csvText) {
        console.log('📊 Parseando CSV manualmente...');
        const lines = csvText.split('\n');
        
        if (lines.length < 2) {
            console.log('❌ CSV inválido: menos de 2 líneas');
            return [];
        }
        
        // Parsear headers
        const headers = this.parseCSVLine(lines[0]);
        console.log('📋 Headers encontrados:', headers);
        
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            const values = this.parseCSVLine(lines[i]);
            
            // Asegurar que tenemos el mismo número de valores que headers
            while (values.length < headers.length) {
                values.push('');
            }
            
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            
            data.push(row);
        }

        console.log('✅ CSV parseado:', data.length, 'filas');
        return data;
    }

    // Nuevo método para parsear líneas CSV respetando comillas
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    }

    processTestimoniosData(rawData) {
        console.log('🔍 Datos raw recibidos:', rawData);
        console.log('📋 Headers encontrados:', Object.keys(rawData[0] || {}));
        
        return rawData.map(row => {
            console.log('📝 Procesando fila:', row);
            
            // Procesar y validar cada testimonio
            const puntajeM1 = parseInt(row.puntajeM1) || null;
            const puntajeM2 = parseInt(row.puntajeM2) || null;
            
            const testimonio = {
                id: this.generateId(),
                nombre: row.nombre || '',
                carrera: row.carrera || '',
                universidad: row.universidad || '',
                año: this.parseYear(row.año || row.ano), // Maneja tanto 'año' como 'ano' y limpia valores nulos
                testimonio: row.testimonio || '',
                puntajeM1: puntajeM1,
                puntajeM2: puntajeM2,
                // Verificar si existe puntajeLenguaje o usar un campo alternativo
                puntajeLenguaje: parseInt(row.puntajeLenguaje || row.lenguaje) || null,
                // Determinar Máximo Nacional automáticamente: M1 = 1000 y/o M2 = 1000
                maximoNacional: (puntajeM1 === 1000) || (puntajeM2 === 1000),
                foto: (row.foto && String(row.foto).trim() && String(row.foto).trim() !== '') ? String(row.foto).trim() : null,
                fechaTestimonio: row.fechaTestimonio || new Date().toISOString(),
                categoria: '', // Se determinará después
                isRecent: this.isRecentTestimonio(row.fechaTestimonio)
            };
            
            // Determinar categoría basada en la nueva lógica
            testimonio.categoria = this.determineCategory(testimonio);
            
            console.log('✅ Testimonio procesado:', testimonio);
            return testimonio;
        }).filter(testimonio => {
            // Filtrar testimonios válidos (deben tener al menos nombre y testimonio)
            const isValid = testimonio.nombre && testimonio.testimonio;
            if (!isValid) {
                console.log('❌ Testimonio inválido filtrado:', testimonio);
            }
            return isValid;
        });
    }

    determineCategory(testimonio) {
        // Categoría basada únicamente en puntajes automáticamente
        if (testimonio.maximoNacional) {
            return 'maximo';
        }
        return 'regular';
    }

    isRecentTestimonio(fechaTestimonio) {
        if (!fechaTestimonio) return false;
        
        const testimonioDate = new Date(fechaTestimonio);
        const now = new Date();
        const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
        
        return testimonioDate > sixMonthsAgo;
    }

    generateId() {
        return 'testimonio_' + Math.random().toString(36).substr(2, 9);
    }

    parseYear(yearValue) {
        // Si no hay valor o es explícitamente null/undefined
        if (!yearValue || yearValue === null || yearValue === undefined) {
            return null;
        }
        
        // Convertir a string para verificar casos problemáticos
        const yearStr = String(yearValue).trim().toLowerCase();
        
        // Si es "null" como string o está vacío
        if (yearStr === 'null' || yearStr === '' || yearStr === 'undefined') {
            return null;
        }
        
        // Intentar parsear como número
        const yearNum = parseInt(yearStr);
        
        // Verificar que sea un año válido (entre 2000 y año actual + 5)
        const currentYear = new Date().getFullYear();
        if (isNaN(yearNum) || yearNum < 2000 || yearNum > currentYear + 5) {
            return null;
        }
        
        return yearNum;
    }

    setFilter(filter) {
        if (TESTIMONIOS_CONFIG.filters.current === filter) return;
        
        TESTIMONIOS_CONFIG.filters.current = filter;
        
        // Actualizar botones activos
        this.filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        // Aplicar filtro
        this.applyCurrentFilters();
        this.renderTestimonios();
        
        console.log('🔍 Filtro aplicado:', filter);
    }

    applyCurrentFilters() {
        let filtered = [...testimoniosData];
        
        // Aplicar filtro
        const currentFilter = TESTIMONIOS_CONFIG.filters.current;
        
        switch (currentFilter) {
            case 'recientes':
                // Mostrar todos los testimonios ordenados por año (mayor a menor)
                // Los años vacíos/inválidos van al final
                filtered.sort((a, b) => {
                    const yearA = a.año && !isNaN(a.año) ? a.año : 0;
                    const yearB = b.año && !isNaN(b.año) ? b.año : 0;
                    
                    // Si ambos tienen años válidos, ordenar de mayor a menor
                    if (yearA > 0 && yearB > 0) {
                        return yearB - yearA;
                    }
                    // Si solo A tiene año válido, A va primero
                    if (yearA > 0 && yearB === 0) {
                        return -1;
                    }
                    // Si solo B tiene año válido, B va primero
                    if (yearA === 0 && yearB > 0) {
                        return 1;
                    }
                    // Si ambos son inválidos, mantener orden original
                    return 0;
                });
                break;
            case 'maximos':
                filtered = filtered.filter(t => t.maximoNacional);
                filtered.sort((a, b) => {
                    const yearA = a.año && !isNaN(a.año) ? a.año : 0;
                    const yearB = b.año && !isNaN(b.año) ? b.año : 0;
                    
                    if (yearA > 0 && yearB > 0) {
                        return yearB - yearA;
                    }
                    if (yearA > 0 && yearB === 0) {
                        return -1;
                    }
                    if (yearA === 0 && yearB > 0) {
                        return 1;
                    }
                    return 0;
                });
                break;
            case 'universidad':
                // Mostrar todos ordenados por año
                filtered.sort((a, b) => {
                    const yearA = a.año && !isNaN(a.año) ? a.año : 0;
                    const yearB = b.año && !isNaN(b.año) ? b.año : 0;
                    
                    if (yearA > 0 && yearB > 0) {
                        return yearB - yearA;
                    }
                    if (yearA > 0 && yearB === 0) {
                        return -1;
                    }
                    if (yearA === 0 && yearB > 0) {
                        return 1;
                    }
                    return 0;
                });
                break;
            case 'carrera':
                // Mostrar todos ordenados por año
                filtered.sort((a, b) => {
                    const yearA = a.año && !isNaN(a.año) ? a.año : 0;
                    const yearB = b.año && !isNaN(b.año) ? b.año : 0;
                    
                    if (yearA > 0 && yearB > 0) {
                        return yearB - yearA;
                    }
                    if (yearA > 0 && yearB === 0) {
                        return -1;
                    }
                    if (yearA === 0 && yearB > 0) {
                        return 1;
                    }
                    return 0;
                });
                break;
            case 'puntaje-desc':
                // Ordenar por puntaje de mayor a menor
                filtered.sort((a, b) => {
                    const puntajeA = Math.max(a.puntajeM1 || 0, a.puntajeM2 || 0, a.puntajeLenguaje || 0);
                    const puntajeB = Math.max(b.puntajeM1 || 0, b.puntajeM2 || 0, b.puntajeLenguaje || 0);
                    return puntajeB - puntajeA;
                });
                break;
            default:
                // Por defecto ordenar por año
                filtered.sort((a, b) => {
                    const yearA = a.año && !isNaN(a.año) ? a.año : 0;
                    const yearB = b.año && !isNaN(b.año) ? b.año : 0;
                    
                    if (yearA > 0 && yearB > 0) {
                        return yearB - yearA;
                    }
                    if (yearA > 0 && yearB === 0) {
                        return -1;
                    }
                    if (yearA === 0 && yearB > 0) {
                        return 1;
                    }
                    return 0;
                });
                break;
        }
        
        filteredTestimonios = filtered;
    }

    renderTestimonios() {
        if (!this.gridElement) return;
        
        if (filteredTestimonios.length === 0) {
            this.gridElement.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <h3>No se encontraron testimonios</h3>
                    <p>Prueba con otros filtros o verifica la conexión.</p>
                </div>
            `;
            return;
        }
        
        const testimoniosHTML = filteredTestimonios.map(testimonio => 
            this.generateTestimonioHTML(testimonio)
        ).join('');
        
        this.gridElement.innerHTML = testimoniosHTML;
        
        // Configurar animaciones de entrada
        this.setupCardAnimations();
        
        console.log('✅ Testimonios renderizados:', filteredTestimonios.length);
    }

    generateTestimonioHTML(testimonio) {
        const badgeClass = testimonio.maximoNacional ? 'badge-maximo-nacional' : 
                          testimonio.isRecent ? 'badge-reciente' : '';
        
        const badgeText = testimonio.maximoNacional ? 
            '<span class="material-symbols-rounded trophy-icon">trophy</span>Máximo Nacional' : 
            testimonio.isRecent ? 'Reciente' : '';
        
        // Determinar si hay una foto válida
        const hasValidPhoto = testimonio.foto && 
                             testimonio.foto.trim() !== '' && 
                             (testimonio.foto.startsWith('http') || testimonio.foto.startsWith('/') || testimonio.foto.startsWith('media/'));
        
        const photoHTML = hasValidPhoto ? 
            `<img src="${testimonio.foto}" alt="${testimonio.nombre}" class="student-photo" 
                 onerror="this.style.display='none'; this.parentElement.querySelector('.avatar-fallback').style.display='flex';">
             <div class="student-photo avatar-fallback ${this.getRandomAvatarClass(testimonio.nombre)}" style="display: none;">
                ${this.generateInitials(testimonio.nombre)}
             </div>` :
            `<div class="student-photo ${this.getRandomAvatarClass(testimonio.nombre)}">
                ${this.generateInitials(testimonio.nombre)}
            </div>`;
        
        const scoresHTML = this.generateScoresHTML(testimonio);
        
        return `
            <div class="testimonio-card ${testimonio.maximoNacional ? 'maximo-nacional' : ''} ${badgeText ? 'has-badge' : ''}" data-categoria="${testimonio.categoria}" data-universidad="${testimonio.universidad}" data-carrera="${testimonio.carrera}">
                ${badgeText ? `<div class="testimonio-badge ${badgeClass}">${badgeText}</div>` : ''}
                
                <div class="testimonio-header">
                    ${photoHTML}
                    <h3 class="student-name">${testimonio.nombre}</h3>
                    <p class="student-info">${testimonio.carrera}</p>
                    <p class="student-university">${testimonio.universidad}</p>
                    <div class="header-metadata">
                        <div class="metadata-scores">
                            ${scoresHTML}
                        </div>
                        ${testimonio.año ? `<div class="metadata-year">${testimonio.año}</div>` : ''}
                    </div>
                </div>
                
                <div class="testimonio-content">
                    <div class="testimonio-text">
                        ${this.formatTestimonioText(testimonio.testimonio)}
                    </div>
                </div>
            </div>
        `;
    }

    generateScoresHTML(testimonio) {
        const scores = [];
        
        if (testimonio.puntajeM1) {
            scores.push(`
                <div class="score-item">
                    <span class="material-symbols-rounded score-icon">calculate</span>
                    <span>M1: ${testimonio.puntajeM1}</span>
                </div>
            `);
        }
        
        if (testimonio.puntajeM2) {
            scores.push(`
                <div class="score-item">
                    <span class="material-symbols-rounded score-icon">functions</span>
                    <span>M2: ${testimonio.puntajeM2}</span>
                </div>
            `);
        }
        
        if (testimonio.puntajeLenguaje) {
            scores.push(`
                <div class="score-item">
                    <span class="material-symbols-rounded score-icon">book</span>
                    <span>LEN: ${testimonio.puntajeLenguaje}</span>
                </div>
            `);
        }
        
        return scores.join('');
    }

    formatTestimonioText(text) {
        // Agregar saltos de línea y formato básico
        return text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    // Generar iniciales del nombre completo
    generateInitials(fullName) {
        if (!fullName) return 'UN';
        
        const names = fullName.trim().split(' ');
        
        if (names.length === 1) {
            // Si solo hay un nombre, tomar las dos primeras letras
            return names[0].substring(0, 2).toUpperCase();
        } else {
            // Tomar primera letra del primer nombre y primera del último
            const firstName = names[0];
            const lastName = names[names.length - 1];
            return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
        }
    }

    // Obtener clase de avatar aleatoria basada en el nombre
    getRandomAvatarClass(name) {
        if (!name) return 'avatar-1';
        
        // Crear un hash simple del nombre para consistencia
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            const char = name.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convertir a 32bit integer
        }
        
        // Usar el hash para seleccionar una clase de avatar (1-8)
        const avatarNumber = (Math.abs(hash) % 8) + 1;
        return `avatar-${avatarNumber}`;
    }

    setupCardAnimations() {
        // Usar intersection observer para animaciones
        const cards = this.gridElement.querySelectorAll('.testimonio-card');
        
        cards.forEach((card, index) => {
            // Agregar delay escalonado
            card.style.transitionDelay = `${index * 0.1}s`;
            
            // Observar cuando entra en viewport
            if (window.universalObserver) {
                window.universalObserver.observe(card);
            } else {
                // Fallback si no hay observer
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 100);
            }
        });
    }

    showLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'block';
        }
        if (this.errorElement) {
            this.errorElement.style.display = 'none';
        }
        if (this.gridElement) {
            this.gridElement.style.display = 'none';
        }
    }

    hideLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'none';
        }
        if (this.gridElement) {
            this.gridElement.style.display = 'grid';
        }
    }

    showError(message) {
        if (this.errorElement) {
            this.errorElement.style.display = 'block';
            const errorMsg = this.errorElement.querySelector('.error-message p');
            if (errorMsg) {
                errorMsg.textContent = message;
            }
        }
        if (this.loadingElement) {
            this.loadingElement.style.display = 'none';
        }
        if (this.gridElement) {
            this.gridElement.style.display = 'none';
        }
    }

    // Método público para refrescar datos
    async refresh() {
        await this.loadTestimonios();
    }

    // API pública para debugging
    debug() {
        return {
            initialized: this.initialized,
            totalTestimonios: testimoniosData.length,
            filteredTestimonios: filteredTestimonios.length,
            currentFilter: TESTIMONIOS_CONFIG.filters.current,
            sheetURL: TESTIMONIOS_CONFIG.SHEET_URL
        };
    }
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🎓 Página de testimonios cargada');
    
    // Crear instancia del manager
    window.testimoniosManager = new TestimoniosManager();
    
    // Inicializar sistema
    await window.testimoniosManager.init();
});

// Funciones de debugging para consola
window.debugTestimonios = {
    // Verificar estado
    status: () => {
        if (window.testimoniosManager) {
            return window.testimoniosManager.debug();
        }
        return 'Sistema no inicializado';
    },
    
    // Forzar recarga
    reload: () => {
        if (window.testimoniosManager) {
            return window.testimoniosManager.refresh();
        }
        console.log('Sistema no inicializado');
    },
    
    // Ver datos raw
    data: () => {
        return {
            raw: testimoniosData,
            filtered: filteredTestimonios
        };
    },
    
    // Verificar mapeo de datos
    checkDataMapping: () => {
        console.log('� Verificación de mapeo de datos:');
        console.log('📊 Total testimonios cargados:', testimoniosData.length);
        
        if (testimoniosData.length > 0) {
            const sample = testimoniosData[0];
            console.log('📋 Estructura del primer testimonio:');
            console.log(sample);
            
            console.log('🔍 Análisis detallado por testimonio:');
            testimoniosData.forEach((testimonio, index) => {
                const isMaximoM1 = testimonio.puntajeM1 === 1000;
                const isMaximoM2 = testimonio.puntajeM2 === 1000;
                
                console.log(`${index + 1}. ${testimonio.nombre}:`);
                console.log(`   Carrera: "${testimonio.carrera}"`);
                console.log(`   Universidad: "${testimonio.universidad}"`);
                console.log(`   Puntajes: M1=${testimonio.puntajeM1}${isMaximoM1 ? ' ⭐' : ''}, M2=${testimonio.puntajeM2}${isMaximoM2 ? ' ⭐' : ''}, LEN=${testimonio.puntajeLenguaje}`);
                console.log(`   Máximo Nacional: ${testimonio.maximoNacional} ${testimonio.maximoNacional ? '🏆' : ''} (auto-detectado por puntajes)`);
                console.log(`   Categoría: ${testimonio.categoria}`);
                console.log(`   Foto: "${testimonio.foto}"`);
                console.log('---');
            });
            
            // Resumen estadístico
            const maximos = testimoniosData.filter(t => t.maximoNacional).length;
            const regulares = testimoniosData.filter(t => t.categoria === 'regular').length;
            
            console.log('📈 Resumen estadístico:');
            console.log(`   🏆 Máximos Nacionales: ${maximos} (puntaje = 1000)`);
            console.log(`   📝 Regulares: ${regulares}`);
        } else {
            console.log('❌ No hay testimonios cargados');
        }
    },
    
    // Verificar detección automática de máximos nacionales
    checkMaximoDetection: () => {
        console.log('🏆 Verificación de detección automática de Máximos Nacionales:');
        console.log('📊 Criterio: M1 = 1000 y/o M2 = 1000');
        
        testimoniosData.forEach((testimonio, index) => {
            const isMaximoM1 = testimonio.puntajeM1 === 1000;
            const isMaximoM2 = testimonio.puntajeM2 === 1000;
            const shouldBeMaximo = isMaximoM1 || isMaximoM2;
            
            console.log(`${index + 1}. ${testimonio.nombre}:`);
            console.log(`   M1: ${testimonio.puntajeM1} ${isMaximoM1 ? '✅ MÁXIMO' : ''}`);
            console.log(`   M2: ${testimonio.puntajeM2} ${isMaximoM2 ? '✅ MÁXIMO' : ''}`);
            console.log(`   Detectado como Máximo: ${testimonio.maximoNacional} ${shouldBeMaximo === testimonio.maximoNacional ? '✅' : '❌'}`);
            console.log(`   Categoría: ${testimonio.categoria}`);
            console.log('---');
        });
        
        const totalMaximos = testimoniosData.filter(t => t.maximoNacional).length;
        console.log(`🎯 Total Máximos Nacionales detectados: ${totalMaximos}`);
    },
    
    // Verificar estado de fotos
    checkPhotos: () => {
        console.log('📸 Estado de las fotos:');
        testimoniosData.forEach((testimonio, index) => {
            const hasPhoto = testimonio.foto && testimonio.foto.trim() !== '';
            const isValidUrl = hasPhoto && (
                testimonio.foto.startsWith('http') || 
                testimonio.foto.startsWith('/') || 
                testimonio.foto.startsWith('media/')
            );
            
            console.log(`${index + 1}. ${testimonio.nombre}:`);
            console.log(`   Foto: "${testimonio.foto}"`);
            console.log(`   Tiene foto: ${hasPhoto}`);
            console.log(`   URL válida: ${isValidUrl}`);
            console.log(`   Iniciales: ${window.testimoniosManager?.generateInitials(testimonio.nombre)}`);
            console.log(`   Avatar class: ${window.testimoniosManager?.getRandomAvatarClass(testimonio.nombre)}`);
            console.log(`   Es Máximo Nacional: ${testimonio.maximoNacional ? '🏆' : '❌'}`);
            console.log('---');
        });
    },
    
    // Test de conexión
    testConnection: async () => {
        try {
            const response = await fetch(TESTIMONIOS_CONFIG.SHEET_URL);
            console.log('🔗 Test de conexión:', response.ok ? '✅ OK' : '❌ Error');
            console.log('📊 Status:', response.status);
            
            if (response.ok) {
                const preview = await response.text();
                console.log('📄 Preview (primeros 500 caracteres):', preview.substring(0, 500));
            }
            
            return response.ok;
        } catch (error) {
            console.error('❌ Error de conexión:', error);
            return false;
        }
    },
    
    // Verificar ordenamiento por año
    checkYearSorting: () => {
        console.log('📅 Verificación de ordenamiento por año:');
        console.log('📊 Datos actuales filtrados:', filteredTestimonios.length);
        
        filteredTestimonios.forEach((testimonio, index) => {
            const year = testimonio.año && !isNaN(testimonio.año) ? testimonio.año : 'Sin año';
            console.log(`${index + 1}. ${testimonio.nombre} - Año: ${year}`);
        });
        
        // Verificar que el orden es correcto
        let correctOrder = true;
        for (let i = 1; i < filteredTestimonios.length; i++) {
            const prevYear = filteredTestimonios[i-1].año && !isNaN(filteredTestimonios[i-1].año) ? filteredTestimonios[i-1].año : 0;
            const currentYear = filteredTestimonios[i].año && !isNaN(filteredTestimonios[i].año) ? filteredTestimonios[i].año : 0;
            
            // Solo verificar si ambos tienen años válidos
            if (prevYear > 0 && currentYear > 0 && prevYear < currentYear) {
                correctOrder = false;
                console.log(`❌ Error de orden entre posición ${i} y ${i+1}: ${prevYear} debería ser >= ${currentYear}`);
            }
        }
        
        console.log(correctOrder ? '✅ Ordenamiento correcto' : '❌ Hay errores en el ordenamiento');
        return correctOrder;
    }
};

console.log('🔍 Funciones de debugging disponibles:');
console.log('  - debugTestimonios.status() - Ver estado del sistema');
console.log('  - debugTestimonios.reload() - Recargar testimonios');
console.log('  - debugTestimonios.data() - Ver datos cargados');
console.log('  - debugTestimonios.checkDataMapping() - Verificar mapeo de campos');
console.log('  - debugTestimonios.checkMaximoDetection() - Verificar detección automática de máximos');
console.log('  - debugTestimonios.checkPhotos() - Verificar estado de fotos');
console.log('  - debugTestimonios.testConnection() - Probar conexión de datos');
console.log('  - debugTestimonios.checkYearSorting() - Verificar ordenamiento por año');