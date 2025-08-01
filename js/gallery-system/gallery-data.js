// 🏔️ SISTEMA DE GALERÍA DINÁMICO - PREUNIVERSITARIO JMC
// Datos de expediciones montañísticas CORREGIDOS - José Manuel Cartes
// Información verificada con Wikipedia y cartes_notes.md

// Sistema de clasificación UIAA en español
const difficultySystem = {
    'F': 'Fácil',
    'PD': 'Poco Difícil',
    'AD': 'Algo Difícil', 
    'D': 'Difícil',
    'TD': 'Muy Difícil',
    'ED': 'Extremadamente Difícil'
};

// Configuración del sistema
const galleryConfig = {
    basePath: 'media/images/fundador/gallery/',
    newItemDuration: 4, // semanas para mostrar etiqueta "NUEVO"
    maxPhotosToDetect: 50,
    photoFormat: 'jpg'
};

// Datos completos de expediciones CORREGIDOS
const expeditionsData = {
    'aconcagua': {
        id: 'aconcagua',
        name: 'Aconcagua',
        shortDescription: 'La cumbre más alta de América, conocida como el "Coloso de América". Un desafío técnico por altitud extrema y condiciones climáticas impredecibles.',
        longDescription: 'El Aconcagua es la montaña más alta de América y la cumbre más elevada del hemisferio sur. Conocido como el "Coloso de América", presenta un desafío único por su altitud extrema, clima impredecible y condiciones físicas demandantes.\n\nLa ascensión requiere una preparación física excepcional y experiencia en alta montaña. Las condiciones meteorológicas pueden cambiar rápidamente, con vientos que superan los 100 km/h y temperaturas que descienden a -30°C.\n\nEsta expedición representa uno de los mayores desafíos personales, combinando resistencia física, mental y técnica para alcanzar la cumbre más alta del continente americano.',
        altitude: 6962,
        altitudeUnit: 'msnm',
        difficulty: {
            grade: 'AD', // ✅ CORREGIDO: de PD a AD por altitud extrema
            name: 'Algo Difícil',
            system: 'Sistema Alpino Francés'
        },
        type: 'Montaña',
        category: 'cerros',
        location: {
            country: 'Argentina',
            region: 'Mendoza',
            fullLocation: 'Mendoza, Argentina • Cordillera de los Andes',
            coordinates: { lat: -32.6532, lng: -70.0109 }, // ✅ Verificado con Wikipedia
            mapsUrl: 'https://maps.google.com/?q=-32.6532,-70.0109'
        },
        ascents: 2,
        achievements: [
            {
                icon: 'trophy',
                name: 'Cumbre América',
                description: 'Punto más alto de América'
            },
            {
                icon: 'military_tech',
                name: 'Récord Personal',
                description: 'Mayor altitud alcanzada'
            },
            {
                icon: 'flag',
                name: '2 Ascensiones',
                description: 'Múltiples cumbres alcanzadas'
            }
        ],
        technicalInfo: {
            climate: 'Extremo',
            route: 'Normal',
            duration: '18-21 días',
            preparation: 'Avanzada',
            modality: 'Expedición',
            season: 'Diciembre-Febrero'
        },
        coverImage: 'aconcagua_cover.jpg',
        lastUpdate: '2024-12-15T10:30:00Z',
        featured: true,
        status: 'active'
    },

    'el-plomo': {
        id: 'el-plomo',
        name: 'Cerro El Plomo',
        shortDescription: 'Montaña emblemática de Santiago, ideal para iniciación en alta altitud. Ofrece vistas espectaculares de la capital y la cordillera.',
        longDescription: 'El Cerro El Plomo es una de las montañas más emblemáticas y accesibles de la Cordillera de los Andes cercana a Santiago. Con sus 5,424 metros de altitud, representa una excelente opción para montañistas que buscan iniciarse en la alta montaña.\n\nSu ascensión, aunque técnicamente no compleja, requiere una buena preparación física y experiencia básica en montañismo. Desde su cumbre se obtienen vistas panorámicas espectaculares de Santiago, la cordillera y gran parte del valle central.\n\nLa montaña tiene además un valor histórico y arqueológico importante, siendo utilizada por culturas precolombinas para rituales ceremoniales.',
        altitude: 5424,
        altitudeUnit: 'msnm',
        difficulty: {
            grade: 'F',
            name: 'Fácil',
            system: 'Sistema Alpino Francés'
        },
        type: 'Cerro',
        category: 'cerros',
        location: {
            country: 'Chile',
            region: 'Región Metropolitana',
            fullLocation: 'Santiago, Chile • Cordillera de los Andes',
            coordinates: { lat: -33.2167, lng: -70.1833 }, // ✅ Verificado con Wikipedia
            mapsUrl: 'https://maps.google.com/?q=-33.2167,-70.1833'
        },
        ascents: 20, // ✅ CORREGIDO: Múltiples ascensiones según cartes_notes
        achievements: [
            {
                icon: 'timer',
                name: 'Récord Tiempo',
                description: 'Ascensión trotando desde Plaza de Armas en 13h 39min'
            },
            {
                icon: 'visibility',
                name: 'Vistas Santiago',
                description: 'Panorámica excepcional de la capital'
            },
            {
                icon: 'flag',
                name: 'Múltiples Ascensiones',
                description: 'Varias ascensiones invernales'
            }
        ],
        technicalInfo: {
            climate: 'Templado de montaña',
            route: 'Normal por Farellones',
            duration: '2-3 días',
            preparation: 'Intermedia',
            modality: 'Trekking de altura',
            season: 'Noviembre-Marzo'
        },
        coverImage: 'el-plomo_cover.jpg',
        lastUpdate: '2024-11-20T14:15:00Z',
        featured: false,
        status: 'active'
    },

    'marmolejo': {
        id: 'marmolejo',
        name: 'Cerro Marmolejo',
        shortDescription: 'Montaña de 6,108 metros en la frontera chileno-argentina. Uno de los "seis miles" más desafiantes de la cordillera, requiere técnica avanzada.',
        longDescription: 'El Cerro Marmolejo, con sus 6,108 metros de altitud, representa uno de los seis miles más técnicos de la cordillera chileno-argentina. Ubicado en la frontera entre San José de Maipo (Chile) y Tunuyán (Argentina), presenta un desafío considerable por su terreno técnico y condiciones meteorológicas variables.\n\nSu ascensión requiere experiencia en alta montaña, conocimientos de escalada en hielo y roca, y una preparación física excepcional. La montaña forma parte del macizo andino principal y ofrece vistas espectaculares de ambos lados de la cordillera.\n\nLas condiciones meteorológicas son extremadamente variables, con cambios súbitos que pueden poner a prueba incluso a los montañistas más experimentados.',
        altitude: 6108,
        altitudeUnit: 'msnm',
        difficulty: {
            grade: 'AD',
            name: 'Algo Difícil',
            system: 'Sistema Alpino Francés'
        },
        type: 'Montaña',
        category: 'cerros',
        location: {
            country: 'Chile-Argentina',
            region: 'Región Metropolitana-Mendoza', // ✅ CORREGIDO: era Valparaíso
            fullLocation: 'San José de Maipo, Chile • Tunuyán, Argentina',
            coordinates: { lat: -33.7172, lng: -69.8644 }, // ✅ CORREGIDO: coordenadas completamente incorrectas
            mapsUrl: 'https://maps.google.com/?q=-33.7172,-69.8644'
        },
        ascents: 3, // ✅ Verificado con cartes_notes
        achievements: [
            {
                icon: 'trending_up',
                name: 'Seis Mil',
                description: 'Cumbre sobre 6,000 metros'
            },
            {
                icon: 'timer',
                name: 'Récord Ascenso',
                description: 'Tiempo récord de 11h 51min'
            },
            {
                icon: 'flag',
                name: '3 Ascensiones',
                description: 'Múltiples cumbres técnicas'
            }
        ],
        technicalInfo: {
            climate: 'Extremo de alta montaña',
            route: 'Cara Norte',
            duration: '12-15 días',
            preparation: 'Experta',
            modality: 'Expedición técnica',
            season: 'Diciembre-Febrero'
        },
        coverImage: 'marmolejo_cover.jpg',
        lastUpdate: '2024-10-05T09:45:00Z',
        featured: false,
        status: 'active'
    },

    'ojos-salado': {
        id: 'ojos-salado',
        name: 'Ojos del Salado',
        shortDescription: 'El volcán activo más alto del mundo. Un desafío extremo por altitud, condiciones áridas y la dificultad técnica de la cumbre final.',
        longDescription: 'Ojos del Salado, con 6,891 metros de altitud, ostenta el título del volcán activo más alto del mundo y la segunda cumbre más alta de América. Ubicado en la frontera entre Chile y Argentina, en pleno desierto de Atacama, presenta condiciones únicas que combinan altitud extrema con un ambiente árido excepcional.\n\nLa ascensión requiere una aclimatación cuidadosa debido a la altitud y las condiciones secas del desierto más árido del mundo. Los últimos metros hacia la cumbre presentan dificultades técnicas de escalada en roca que requieren experiencia y equipo adecuado.\n\nLa montaña alberga el lago más alto del mundo a 6,390 metros, añadiendo un elemento único a esta expedición extraordinaria.',
        altitude: 6891, // ✅ CORREGIDO: era 6893
        altitudeUnit: 'msnm',
        difficulty: {
            grade: 'AD',
            name: 'Algo Difícil',
            system: 'Sistema Alpino Francés'
        },
        type: 'Volcán',
        category: 'volcanes',
        location: {
            country: 'Chile-Argentina',
            region: 'Atacama-Catamarca',
            fullLocation: 'Desierto de Atacama • Frontera Chile-Argentina',
            coordinates: { lat: -27.1094, lng: -68.5422 }, // ✅ CORREGIDO: más preciso según Wikipedia
            mapsUrl: 'https://maps.google.com/?q=-27.1094,-68.5422'
        },
        ascents: 1,
        achievements: [
            {
                icon: 'public',
                name: 'Volcán Más Alto',
                description: 'Volcán activo más alto del mundo'
            },
            {
                icon: 'water_drop',
                name: 'Lago Más Alto',
                description: 'Acceso al lago más alto del mundo'
            },
            {
                icon: 'flag',
                name: '1 Ascensión',
                description: 'Cumbre extrema conquistada'
            }
        ],
        technicalInfo: {
            climate: 'Desértico de altura',
            route: 'Ruta Normal Argentina',
            duration: '10-14 días',
            preparation: 'Avanzada',
            modality: 'Expedición de altura',
            season: 'Noviembre-Marzo'
        },
        coverImage: 'ojos-salado_cover.jpg',
        lastUpdate: '2024-09-12T16:20:00Z',
        featured: true,
        status: 'active'
    },

    'volcan-san-jose': {
        id: 'volcan-san-jose',
        name: 'Volcán San José',
        shortDescription: 'Estratovolcán activo en la frontera chileno-argentina. Desafío moderado con paisajes volcánicos únicos y vistas panorámicas excepcionales.',
        longDescription: 'El Volcán San José, con 5,856 metros de altitud, es un estratovolcán activo ubicado en la frontera entre Chile y Argentina. Forma parte del complejo volcánico del mismo nombre y ofrece una ascensión técnicamente moderada pero físicamente demandante.\n\nSus características volcánicas proporcionan paisajes únicos, con formaciones rocosas, campos de lava y vistas espectaculares de la cordillera circundante. La ascensión combina trekking de aproximación, escalada en roca volcánica y navegación en terreno de alta montaña.\n\nSu ubicación estratégica ofrece vistas panorámicas excepcionales tanto del lado chileno como argentino de la cordillera, incluyendo vistas de otros importantes volcanes y montañas de la región.',
        altitude: 5856,
        altitudeUnit: 'msnm',
        difficulty: {
            grade: 'PD',
            name: 'Poco Difícil',
            system: 'Sistema Alpino Francés'
        },
        type: 'Volcán',
        category: 'volcanes',
        location: {
            country: 'Chile-Argentina',
            region: 'Región Metropolitana-Mendoza',
            fullLocation: 'Departamento Tunuyán • Frontera Chile-Argentina',
            coordinates: { lat: -33.7817, lng: -69.8972 }, // ✅ CORREGIDO: más preciso según Wikipedia
            mapsUrl: 'https://maps.google.com/?q=-33.7817,-69.8972'
        },
        ascents: 1,
        achievements: [
            {
                icon: 'speed',
                name: 'Récord Ascenso',
                description: 'Récord de ascenso en 5h 48min'
            },
            {
                icon: 'timer',
                name: 'Récord Global',
                description: 'Récord global con 9h 37min'
            },
            {
                icon: 'landscape',
                name: 'Vistas Panorámicas',
                description: 'Panorámicas excepcionales 360°'
            }
        ],
        technicalInfo: {
            climate: 'Continental de montaña',
            route: 'Cara Norte',
            duration: '5-7 días',
            preparation: 'Intermedia-Avanzada',
            modality: 'Montañismo volcánico',
            season: 'Noviembre-Abril'
        },
        coverImage: 'volcan-san-jose_cover.jpg',
        lastUpdate: '2024-08-30T11:10:00Z',
        featured: false,
        status: 'active'
    },

    'sierra-ramon': {
        id: 'sierra-ramon',
        name: 'Sierra de Ramón',
        shortDescription: 'Cordón montañoso emblemático de Santiago con múltiples cumbres. Base de entrenamiento principal y área de práctica constante para actividades de alta montaña.',
        longDescription: 'La Sierra de Ramón es el cordón montañoso más emblemático y accesible de Santiago, formando un telón de fondo natural para la capital chilena. Con una extensión de 25 kilómetros de norte a sur y 11 kilómetros de ancho, representa la zona de entrenamiento principal para montañistas santiaguinos.\n\nSus principales cumbres incluyen el Cerro de Ramón (3,253 msnm), Cerro Provincia y Cerro Punta de Damas. La sierra ofrece una gran diversidad de rutas, desde caminatas familiares hasta ascensiones técnicas que permiten practicar diferentes habilidades montañísticas.\n\nLa proximidad a Santiago (piedmonte a 800 msnm) la convierte en un destino ideal para entrenamiento constante, aclimatación y actividades de fin de semana. Los valles principales incluyen el Valle de los Quillayes y diversos cursos de agua como el estero San Ramón.',
        altitude: 3253,
        altitudeUnit: 'msnm',
        difficulty: {
            grade: 'F',
            name: 'Fácil a Moderado',
            system: 'Sistema Alpino Francés'
        },
        type: 'Sierra',
        category: 'sierras',
        location: {
            country: 'Chile',
            region: 'Región Metropolitana de Santiago',
            fullLocation: 'Santiago, Chile • Cordillera de los Andes',
            coordinates: { lat: -33.4833, lng: -70.4500 }, // ✅ Centro aproximado de la sierra según Wikipedia
            mapsUrl: 'https://maps.google.com/?q=-33.4833,-70.4500'
        },
        ascents: 50, // ✅ Múltiples ascensiones de entrenamiento según cartes_notes
        achievements: [
            {
                icon: 'fitness_center',
                name: 'Zona Entrenamiento',
                description: 'Base principal de preparación física'
            },
            {
                icon: 'nature',
                name: 'Diversidad Rutas',
                description: 'Múltiples opciones y dificultades'
            },
            {
                icon: 'directions_walk',
                name: 'Acceso Directo',
                description: 'Proximidad inmediata a Santiago'
            },
            {
                icon: 'landscape',
                name: 'Cumbres Múltiples',
                description: 'Cerro Ramón, Provincia, Punta de Damas'
            }
        ],
        technicalInfo: {
            climate: 'Mediterráneo semiárido',
            route: 'Múltiples rutas desde Santiago',
            duration: '1 día (salidas regulares)',
            preparation: 'Básica a Intermedia',
            modality: 'Trekking y entrenamiento base',
            season: 'Todo el año'
        },
        coverImage: 'sierra-ramon_cover.jpg',
        lastUpdate: '2024-12-01T08:00:00Z',
        featured: true, // ✅ Es la zona principal de entrenamiento
        status: 'active'
    }
};

// Función para obtener el nombre completo de la dificultad
function getDifficultyName(grade) {
    return difficultySystem[grade] || 'No especificado';
}

// Función para verificar si un elemento es "nuevo"
function isNewItem(lastUpdate) {
    const updateDate = new Date(lastUpdate);
    const now = new Date();
    const weeksAgo = galleryConfig.newItemDuration * 7 * 24 * 60 * 60 * 1000;
    return (now - updateDate) < weeksAgo;
}

// Función para obtener categorías únicas
function getCategories() {
    const categories = new Set();
    Object.values(expeditionsData).forEach(expedition => {
        categories.add(expedition.category);
    });
    return Array.from(categories);
}

// Función para filtrar expediciones por categoría
function getExpeditionsByCategory(category = 'all') {
    if (category === 'all') {
        return Object.values(expeditionsData);
    }
    return Object.values(expeditionsData).filter(expedition => 
        expedition.category === category
    );
}

// Función para obtener expedición por ID
function getExpeditionById(id) {
    return expeditionsData[id] || null;
}

// Exportar para uso global
window.expeditionsData = expeditionsData;
window.galleryConfig = galleryConfig;
window.difficultySystem = difficultySystem;
window.getDifficultyName = getDifficultyName;
window.isNewItem = isNewItem;
window.getCategories = getCategories;
window.getExpeditionsByCategory = getExpeditionsByCategory;
window.getExpeditionById = getExpeditionById;