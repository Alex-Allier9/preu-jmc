// 🏔️ SISTEMA DE GALERÍA DINÁMICO - PREUNIVERSITARIO JMC
// Datos de expediciones montañísticas - José Manuel Cartes
// Este archivo contiene toda la información de las expediciones

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

// Datos completos de expediciones
const expeditionsData = {
    'aconcagua': {
        id: 'aconcagua',
        name: 'Aconcagua',
        shortDescription: 'La cumbre más alta de América, conocida como el "Coloso de América". Un desafío técnico por altitud extrema y condiciones climáticas impredecibles.',
        longDescription: 'El Aconcagua es la montaña más alta de América y la cumbre más elevada del hemisferio sur. Conocido como el "Coloso de América", presenta un desafío único por su altitud extrema, clima impredecible y condiciones físicas demandantes.\n\nLa ascensión requiere una preparación física excepcional y experiencia en alta montaña. Las condiciones meteorológicas pueden cambiar rápidamente, con vientos que superan los 100 km/h y temperaturas que descienden a -30°C.\n\nEsta expedición representa uno de los mayores desafíos personales, combinando resistencia física, mental y técnica para alcanzar la cumbre más alta del continente americano.',
        altitude: 6962,
        altitudeUnit: 'msnm',
        difficulty: {
            grade: 'PD',
            name: 'Poco Difícil',
            system: 'Sistema Alpino Francés'
        },
        type: 'Cerro',
        category: 'cerros',
        location: {
            country: 'Argentina',
            region: 'Mendoza',
            fullLocation: 'Mendoza, Argentina • Cordillera de los Andes',
            coordinates: { lat: -32.6532, lng: -70.0109 },
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
            coordinates: { lat: -33.2167, lng: -70.1833 },
            mapsUrl: 'https://maps.google.com/?q=-33.2167,-70.1833'
        },
        ascents: 3,
        achievements: [
            {
                icon: 'timer',
                name: 'Récord Tiempo',
                description: 'Ascensión en tiempo récord'
            },
            {
                icon: 'visibility',
                name: 'Vistas Santiago',
                description: 'Panorámica excepcional de la capital'
            },
            {
                icon: 'flag',
                name: '3 Ascensiones',
                description: 'Múltiples cumbres alcanzadas'
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
        shortDescription: 'Cumbre técnicamente desafiante que requiere experiencia en alta montaña. Conocido por sus condiciones meteorológicas variables y terreno exigente.',
        longDescription: 'El Cerro Marmolejo, con sus 6,108 metros de altitud, representa uno de los desafíos más técnicos de la cordillera chilena. Su ascensión requiere experiencia avanzada en alta montaña, conocimientos de escalada en hielo y roca, y una preparación física excepcional.\n\nLas condiciones meteorológicas son extremadamente variables, con cambios súbitos que pueden poner a prueba incluso a los montañistas más experimentados. La montaña se caracteriza por sus paredes escarpadas, glaciares colgantes y un terreno técnico que demanda el uso de equipo especializado.\n\nLa recompensa por alcanzar su cumbre son vistas impresionantes de la cordillera y la satisfacción de haber conquistado uno de los seis miles más desafiantes de Chile.',
        altitude: 6108,
        altitudeUnit: 'msnm',
        difficulty: {
            grade: 'AD',
            name: 'Bastante Difícil',
            system: 'Sistema Alpino Francés'
        },
        type: 'Cerro',
        category: 'cerros',
        location: {
            country: 'Chile',
            region: 'Región de Valparaíso',
            fullLocation: 'Valparaíso, Chile • Cordillera de los Andes',
            coordinates: { lat: -33.1167, lng: -70.3333 },
            mapsUrl: 'https://maps.google.com/?q=-33.1167,-70.3333'
        },
        ascents: 1,
        achievements: [
            {
                icon: 'upgrade',
                name: 'Desafío Técnico',
                description: 'Ruta de alta dificultad técnica'
            },
            {
                icon: 'flag',
                name: '1 Ascensión',
                description: 'Cumbre técnica conquistada'
            }
        ],
        technicalInfo: {
            climate: 'Extremo de alta montaña',
            route: 'Cara Sur',
            duration: '12-15 días',
            preparation: 'Experta',
            modality: 'Expedición técnica',
            season: 'Diciembre-Enero'
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
        longDescription: 'Ojos del Salado, con 6,893 metros de altitud, ostenta el título del volcán activo más alto del mundo y la segunda cumbre más alta de América. Ubicado en la frontera entre Chile y Argentina, en pleno desierto de Atacama, presenta condiciones únicas que combinan altitud extrema con un ambiente árido excepcional.\n\nLa ascensión requiere una aclimatación cuidadosa debido a la altitud y las condiciones secas del desierto más árido del mundo. Los últimos metros hacia la cumbre presentan dificultades técnicas de escalada en roca que requieren experiencia y equipo adecuado.\n\nLa montaña alberga el lago más alto del mundo a 6,390 metros, añadiendo un elemento único a esta expedición extraordinaria.',
        altitude: 6893,
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
            coordinates: { lat: -27.1092, lng: -68.5428 },
            mapsUrl: 'https://maps.google.com/?q=-27.1092,-68.5428'
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
        shortDescription: 'Volcán activo en la frontera chileno-argentina. Desafío moderado con paisajes volcánicos únicos y vistas panorámicas excepcionales.',
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
            fullLocation: 'Frontera Chile-Argentina • Cordillera Principal',
            coordinates: { lat: -33.7833, lng: -69.8958 },
            mapsUrl: 'https://maps.google.com/?q=-33.7833,-69.8958'
        },
        ascents: 2,
        achievements: [
            {
                icon: 'speed',
                name: 'Ascensión Técnica',
                description: 'Escalada en terreno volcánico'
            },
            {
                icon: 'landscape',
                name: 'Vistas Panorámicas',
                description: 'Panorámicas excepcionales 360°'
            },
            {
                icon: 'flag',
                name: '2 Ascensiones',
                description: 'Múltiples cumbres volcánicas'
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

    'sierras-santiago': {
        id: 'sierras-santiago',
        name: 'Sierras de Santiago',
        shortDescription: 'Conjunto montañoso cercano a Santiago, ideal para entrenamiento y aclimatación. Ofrece rutas variadas y acceso relativamente fácil.',
        longDescription: 'Las Sierras de Santiago constituyen un conjunto montañoso de mediana altura ubicado en los alrededores de la capital chilena. Con altitudes que promedian los 2,200 metros, representan el lugar ideal para entrenamiento, acondicionamiento físico y aclimatación antes de expediciones más demandantes.\n\nEstas montañas ofrecen una gran variedad de rutas y dificultades, desde caminatas familiares hasta ascensiones técnicas que permiten practicar diferentes habilidades montañísticas. Su proximidad a Santiago las convierte en un destino accesible para salidas de día o fin de semana, permitiendo mantener una rutina constante de entrenamiento.\n\nLos paisajes incluyen bosque esclerófilo, formaciones rocosas características de la zona central y vistas panorámicas de Santiago y la cordillera.',
        altitude: 2200,
        altitudeUnit: 'msnm',
        difficulty: {
            grade: 'F',
            name: 'Fácil',
            system: 'Sistema Alpino Francés'
        },
        type: 'Sierra',
        category: 'sierras',
        location: {
            country: 'Chile',
            region: 'Región Metropolitana',
            fullLocation: 'Santiago, Chile • Cordillera de la Costa y Precordillera',
            coordinates: { lat: -33.4500, lng: -70.6667 },
            mapsUrl: 'https://maps.google.com/?q=-33.4500,-70.6667'
        },
        ascents: 15,
        achievements: [
            {
                icon: 'fitness_center',
                name: 'Entrenamiento Base',
                description: 'Zona de entrenamiento principal'
            },
            {
                icon: 'nature',
                name: 'Diversidad Rutas',
                description: 'Múltiples opciones y dificultades'
            },
            {
                icon: 'directions_walk',
                name: 'Acceso Fácil',
                description: 'Cercanía a Santiago'
            },
            {
                icon: 'flag',
                name: '15+ Ascensiones',
                description: 'Múltiples rutas completadas'
            }
        ],
        technicalInfo: {
            climate: 'Mediterráneo',
            route: 'Múltiples rutas',
            duration: '1 día',
            preparation: 'Básica',
            modality: 'Trekking y entrenamiento',
            season: 'Todo el año'
        },
        coverImage: 'sierras-santiago_cover.jpg',
        lastUpdate: '2024-12-01T08:00:00Z',
        featured: false,
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