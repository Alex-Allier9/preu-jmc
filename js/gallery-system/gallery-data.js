// 🏔️ SISTEMA DE GALERÍA DINÁMICO CON GOOGLE SHEETS - PREUNIVERSITARIO JMC
// Sistema completamente nuevo que usa Google Sheets como fuente de datos
// Basado en el sistema exitoso de testimonios

// Sistema de clasificación UIAA en español
const difficultySystem = {
    'F': 'Fácil',
    'PD': 'Poco Difícil',
    'AD': 'Algo Difícil',
    'D': 'Difícil',
    'TD': 'Muy Difícil',
    'ED': 'Extremadamente Difícil'
};

// Configuración del sistema con Google Sheets
const galleryConfig = {
    // URL del Google Sheet público en formato CSV
    SHEET_ID: '1VScYoDebC_kz_NXGObJWjYki5VQvKCnHbAXbO9yEr2M',
    SHEET_URL: 'https://docs.google.com/spreadsheets/d/1VScYoDebC_kz_NXGObJWjYki5VQvKCnHbAXbO9yEr2M/export?format=csv&gid=0',

    // Configuración de sistema
    basePath: 'media/images/fundador/gallery/',
    newItemDuration: 4, // semanas para mostrar etiqueta "NUEVO"
    maxPhotosToDetect: 50,
    photoFormat: 'jpg',

    // Configuración de filtros
    filters: {
        current: 'all',
        available: ['all', 'cerros', 'volcanes', 'sierras']
    }
};

// Estado global de expediciones
let expeditionsData = {};
let filteredExpeditions = [];

// Clase principal para manejar datos de expediciones desde Google Sheets
class GalleryDataManager {
    constructor() {
        this.initialized = false;
        this.loading = false;
        this.error = null;
    }

    async init() {
        try {
            console.log('🏔️ Inicializando sistema de datos de galería desde Google Sheets...');

            // Cargar expediciones desde Google Sheets
            await this.loadExpeditions();

            this.initialized = true;
            console.log('✅ Sistema de datos de galería inicializado correctamente');

        } catch (error) {
            console.error('❌ Error inicializando datos de galería:', error);
            this.error = error.message;
            throw error;
        }
    }

    async loadExpeditions() {
        try {
            console.log('📊 Cargando expediciones desde Google Sheets...');

            // Cargar datos desde Google Sheets
            const response = await fetch(galleryConfig.SHEET_URL);

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const csvText = await response.text();
            console.log('✅ Datos CSV recibidos:', csvText.substring(0, 200) + '...');

            // Parsear CSV usando Papa Parse (si está disponible) o método manual
            const parsedData = this.parseCSV(csvText);
            console.log('📋 Datos parseados:', parsedData.length, 'expediciones');

            // Procesar y validar datos
            expeditionsData = this.processExpeditionsData(parsedData);

            console.log('✅ Expediciones cargadas exitosamente:', Object.keys(expeditionsData).length);

        } catch (error) {
            console.error('❌ Error cargando expediciones:', error);
            throw new Error('No se pudieron cargar las expediciones. Verifica la conexión de Internet.');
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

    processExpeditionsData(rawData) {
        console.log('🔍 Datos raw recibidos:', rawData);
        console.log('📋 Headers encontrados:', Object.keys(rawData[0] || {}));

        const processedData = {};

        rawData.forEach(row => {
            console.log('📝 Procesando fila:', row);

            // Procesar y validar cada expedición
            const expedition = {
                // Datos básicos
                id: this.cleanString(row.id || row.ID || ''),
                name: this.cleanString(row.nombre || row.name || ''),
                category: this.normalizeCategory(row.categoria || row.category || ''),

                // Descripción
                shortDescription: this.cleanString(row.descripcionCorta || row.shortDescription || ''),
                longDescription: this.cleanString(row.descripcionLarga || row.longDescription || ''),

                // Datos técnicos
                altitude: parseInt(row.altitud || row.altitude) || 0,
                altitudeUnit: row.unidadAltitud || row.altitudeUnit || 'msnm',
                difficulty: this.processDifficulty(row.dificultad || row.difficulty),

                // Ubicación
                location: this.processLocation(row),

                // Datos adicionales
                ascents: this.processAscents(row.ascensiones || row.ascents),
                type: this.cleanString(row.tipo || row.type || this.getTypeFromCategory(this.normalizeCategory(row.categoria || row.category || ''))),

                // Badges personalizados (ahora procesados después de las ascensiones)
                achievements: this.processBadges(row.badges || row.logros || '', this.processAscents(row.ascensiones || row.ascents)),

                // Metadatos
                coverImage: this.generateCoverImageName(row.id || row.ID || ''),
                lastUpdate: row.fechaActualizacion || row.lastUpdate || new Date().toISOString(),
                featured: this.parseBoolean(row.destacado || row.featured || false),
                status: row.estado || row.status || 'active'
            };

            // Solo agregar si tiene datos mínimos válidos
            if (expedition.id && expedition.name) {
                processedData[expedition.id] = expedition;
                console.log('✅ Expedición procesada:', expedition);
            } else {
                console.log('❌ Expedición inválida filtrada:', expedition);
            }
        });

        return processedData;
    }

    cleanString(str) {
        return String(str || '').trim();
    }

    normalizeCategory(category) {
        const normalized = category.toLowerCase().trim();
        const categoryMap = {
            'cerro': 'cerros',
            'cerros': 'cerros',
            'volcan': 'volcanes',
            'volcán': 'volcanes',
            'volcanes': 'volcanes',
            'sierra': 'sierras',
            'sierras': 'sierras'
        };
        return categoryMap[normalized] || 'cerros';
    }

    getTypeFromCategory(category) {
        const typeMap = {
            'cerros': 'Cerro',
            'volcanes': 'Volcán',
            'sierras': 'Sierra'
        };
        return typeMap[category] || 'Montaña';
    }

    processDifficulty(difficultyStr) {
        // Si está vacío, null o undefined, retornar estructura vacía
        if (!difficultyStr || String(difficultyStr).trim() === '') {
            return {
                grade: '',
                name: '',
                system: ''
            };
        }

        const grade = String(difficultyStr).trim().toUpperCase();
        return {
            grade: grade,
            name: difficultySystem[grade] || 'No especificado',
            system: 'Sistema Alpino Francés'
        };
    }

    processLocation(row) {
        return {
            country: this.cleanString(row.pais || row.country || ''),
            region: this.cleanString(row.region || ''),
            fullLocation: this.cleanString(row.ubicacion || row.location || ''),
            coordinates: this.formatCoordinatesForDisplay(row),
            coordinatesData: this.processCoordinatesData(row),
            mapsUrl: this.generateMapsUrl(row)
        };
    }

    processCoordinatesData(row) {
        const lat = parseFloat(row.latitud || row.lat || 0);
        const lng = parseFloat(row.longitud || row.lng || 0);

        if (lat && lng) {
            return { lat, lng };
        }
        return { lat: 0, lng: 0 };
    }

    formatCoordinatesForDisplay(row) {
        const lat = parseFloat(row.latitud || row.lat || 0);
        const lng = parseFloat(row.longitud || row.lng || 0);

        if (lat && lng) {
            // Formatear con dirección cardinal
            const latDir = lat >= 0 ? 'N' : 'S';
            const lngDir = lng >= 0 ? 'E' : 'O';
            return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
        }
        return 'Coordenadas no disponibles';
    }

    generateMapsUrl(row) {
        const lat = parseFloat(row.latitud || row.lat || 0);
        const lng = parseFloat(row.longitud || row.lng || 0);

        if (lat && lng) {
            return `https://maps.google.com/?q=${lat},${lng}`;
        }
        return '';
    }

    processBadges(badgesStr, ascents = 1) {
        let badges = [];

        // Procesar badges desde Google Sheets
        if (badgesStr && badgesStr.trim() !== '') {
            try {
                // Formato: "trophy:Cumbre:Descripción;star:Logro:Otra descripción"
                badges = badgesStr.split(';').map(badgeStr => {
                    const parts = badgeStr.split(':');
                    return {
                        icon: parts[0]?.trim() || 'star',
                        name: parts[1]?.trim() || 'Logro',
                        description: parts[2]?.trim() || ''
                    };
                });
            } catch (error) {
                console.log('⚠️ Error parseando badges para expedición, usando formato simple:', badgesStr);

                // Fallback: badges separados por semicolon
                // Formato: "trophy:Cumbre:Descripción;star:Logro:Otra descripción"
                badges = badgesStr.split(';').map(badgeStr => {
                    const parts = badgeStr.split(':');
                    return {
                        icon: parts[0]?.trim() || 'star',
                        name: parts[1]?.trim() || 'Logro',
                        description: parts[2]?.trim() || ''
                    };
                });
            }
        }

        if (ascents !== null && ascents !== undefined &&
            ((typeof ascents === 'number' && ascents > 1) ||
                (typeof ascents === 'string' && ascents.trim() !== ''))) {

            // Determinar el texto del badge
            let badgeText;
            if (typeof ascents === 'number') {
                badgeText = `${ascents} Ascensiones`;
            } else {
                // Para strings, mantener el formato original
                const isPlural = ascents.includes('+') ||
                    ascents.toLowerCase().includes('varios') ||
                    ascents.toLowerCase().includes('múltiples') ||
                    (!isNaN(ascents) && parseInt(ascents) > 1);
                badgeText = isPlural ? `${ascents} Ascensiones` : `${ascents} Ascensión`;
            }

            badges.push({
                icon: 'trending_up',
                name: badgeText,
                description: `Montaña ascendida ${ascents} ${typeof ascents === 'string' && ascents.includes('+') ? '' : 'veces'}`
            });
        }

        return badges.slice(0, 4); // Máximo 4 badges (3 personalizados + 1 de ascensiones)
    }

    parseBoolean(value) {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') {
            const lower = value.toLowerCase().trim();
            return lower === 'true' || lower === '1' || lower === 'sí' || lower === 'si';
        }
        return Boolean(value);
    }

    generateCoverImageName(id) {
        return `${id}_cover.jpg`;
    }

    // Método público para refrescar datos
    async refresh() {
        await this.loadExpeditions();
    }

    // API pública para debugging
    debug() {
        return {
            initialized: this.initialized,
            totalExpeditions: Object.keys(expeditionsData).length,
            categories: this.getUniqueCategories(),
            sheetURL: galleryConfig.SHEET_URL,
            error: this.error
        };
    }

    getUniqueCategories() {
        const categories = new Set();
        Object.values(expeditionsData).forEach(expedition => {
            categories.add(expedition.category);
        });
        return Array.from(categories);
    }

    processAscents(ascentsValue) {
        // Si está completamente vacío, null, undefined, retornar null
        if (ascentsValue === undefined || ascentsValue === null || ascentsValue === '') {
            return null;
        }

        // Convertir a string y limpiar espacios
        const ascentsString = String(ascentsValue).trim();

        // Si después de limpiar está vacío o es "0", retornar null
        if (ascentsString === '' || ascentsString === '0') {
            return null;
        }

        // Si contiene solo números, convertir a número
        if (/^\d+$/.test(ascentsString)) {
            const num = parseInt(ascentsString);
            return num > 0 ? num : null;
        }

        // Si contiene caracteres especiales como "+", "varios", etc., mantener como string
        return ascentsString;
    }
}
// Funciones utilitarias globales
function getDifficultyName(grade) {
    return difficultySystem[grade] || 'No especificado';
}

function isNewItem(lastUpdate) {
    const updateDate = new Date(lastUpdate);
    const now = new Date();
    const weeksAgo = galleryConfig.newItemDuration * 7 * 24 * 60 * 60 * 1000;
    return (now - updateDate) < weeksAgo;
}

function getCategories() {
    const categories = new Set();
    Object.values(expeditionsData).forEach(expedition => {
        categories.add(expedition.category);
    });
    return Array.from(categories);
}

function getExpeditionsByCategory(category = 'all') {
    if (category === 'all') {
        return Object.values(expeditionsData);
    }
    return Object.values(expeditionsData).filter(expedition =>
        expedition.category === category
    );
}

function getExpeditionById(id) {
    return expeditionsData[id] || null;
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', async function () {
    console.log('🏔️ Inicializando sistema de galería con Google Sheets...');

    // Crear instancia del manager
    window.galleryDataManager = new GalleryDataManager();

    try {
        // Inicializar sistema
        await window.galleryDataManager.init();

        // Exportar para uso global después de cargar los datos
        window.expeditionsData = expeditionsData;
        window.galleryConfig = galleryConfig;
        window.difficultySystem = difficultySystem;
        window.getDifficultyName = getDifficultyName;
        window.isNewItem = isNewItem;
        window.getCategories = getCategories;
        window.getExpeditionsByCategory = getExpeditionsByCategory;
        window.getExpeditionById = getExpeditionById;

        console.log('✅ Sistema de galería con Google Sheets listo');

        // Disparar evento personalizado para notificar que los datos están listos
        document.dispatchEvent(new CustomEvent('galleryDataReady', {
            detail: {
                totalExpeditions: Object.keys(expeditionsData).length,
                categories: getCategories()
            }
        }));

    } catch (error) {
        console.error('❌ Error inicializando sistema de galería:', error);

        // Disparar evento de error
        document.dispatchEvent(new CustomEvent('galleryDataError', {
            detail: { error: error.message }
        }));
    }
});

// Funciones de debugging para consola
window.debugGallery = {
    // Verificar estado
    status: () => {
        if (window.galleryDataManager) {
            return window.galleryDataManager.debug();
        }
        return 'Sistema no inicializado';
    },

    // Forzar recarga
    reload: () => {
        if (window.galleryDataManager) {
            return window.galleryDataManager.refresh();
        }
        console.log('Sistema no inicializado');
    },

    // Ver datos raw
    data: () => {
        return {
            expeditions: expeditionsData,
            config: galleryConfig
        };
    },

    // Verificar estructura de datos
    checkDataStructure: () => {
        console.log('🔍 Verificación de estructura de datos:');
        console.log('📊 Total expediciones cargadas:', Object.keys(expeditionsData).length);

        if (Object.keys(expeditionsData).length > 0) {
            const sample = Object.values(expeditionsData)[0];
            console.log('📋 Estructura de la primera expedición:');
            console.log(sample);

            console.log('🔍 Análisis detallado por expedición:');
            Object.values(expeditionsData).forEach((expedition, index) => {
                console.log(`${index + 1}. ${expedition.name}:`);
                console.log(`   ID: "${expedition.id}"`);
                console.log(`   Categoría: "${expedition.category}"`);
                console.log(`   Altitud: ${expedition.altitude} ${expedition.altitudeUnit}`);
                console.log(`   Dificultad: ${expedition.difficulty.grade} (${expedition.difficulty.name})`);
                console.log(`   Ubicación: "${expedition.location.fullLocation}"`);
                console.log(`   Ascensiones: ${expedition.ascents}`);
                console.log(`   Badges: ${expedition.achievements.length}`);
                console.log(`   Destacado: ${expedition.featured}`);
                console.log('---');
            });

            // Resumen estadístico
            const categories = {};
            Object.values(expeditionsData).forEach(exp => {
                categories[exp.category] = (categories[exp.category] || 0) + 1;
            });

            console.log('📈 Resumen por categorías:');
            Object.entries(categories).forEach(([category, count]) => {
                console.log(`   ${category}: ${count} expediciones`);
            });
        } else {
            console.log('❌ No hay expediciones cargadas');
        }
    },

    // Test de conexión
    testConnection: async () => {
        try {
            const response = await fetch(galleryConfig.SHEET_URL);
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

    // Verificar badges
    checkBadges: () => {
        console.log('🏆 Verificación de badges:');
        Object.values(expeditionsData).forEach((expedition, index) => {
            console.log(`${index + 1}. ${expedition.name}:`);
            console.log(`   Total badges: ${expedition.achievements.length}`);
            expedition.achievements.forEach((achievement, badgeIndex) => {
                console.log(`     ${badgeIndex + 1}. ${achievement.icon} - ${achievement.name}: ${achievement.description}`);
            });
            console.log('---');
        });
    }
};

console.log('🔍 Funciones de debugging de galería disponibles:');
console.log('  - debugGallery.status() - Ver estado del sistema');
console.log('  - debugGallery.reload() - Recargar expediciones');
console.log('  - debugGallery.data() - Ver datos cargados');
console.log('  - debugGallery.checkDataStructure() - Verificar estructura de datos');
console.log('  - debugGallery.testConnection() - Probar conexión de datos');
console.log('  - debugGallery.checkBadges() - Verificar badges configurados');