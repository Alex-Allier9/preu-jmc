/* ======================================
   INDEX-TESTIMONIOS.JS 
   VERSIÓN ULTRA SIMPLE Y ROBUSTA - ENFOQUE COMPLETAMENTE DIFERENTE
   ====================================== */

// ✅ CONFIGURACIÓN SUPER SIMPLE
const CONFIG_SIMPLE = {
    SHEET_URL: 'https://docs.google.com/spreadsheets/d/1Wxd2scUSncOjcP-ONMaK2VsaRxVYYh3uuOavUKsq_5c/export?format=csv&gid=0',
    CANTIDAD: 3,
    CONTAINER_SELECTOR: '.testimonials-preview-grid'
};

// ✅ VARIABLE GLOBAL SIMPLE
let todosLosTestimonios = [];
let ultimaSeleccion = [];

// ✅ FUNCIÓN PRINCIPAL SUPER SIMPLE
async function cargarTestimoniosSimple() {
    console.log('🚀 === INICIANDO CARGA SIMPLE ===');
    
    try {
        // Paso 1: Encontrar contenedor
        const container = document.querySelector(CONFIG_SIMPLE.CONTAINER_SELECTOR);
        if (!container) {
            console.error('❌ No se encontró el contenedor:', CONFIG_SIMPLE.CONTAINER_SELECTOR);
            return;
        }
        console.log('✅ Contenedor encontrado');

        // Paso 2: Mostrar loading
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <div style="width: 40px; height: 40px; border: 4px solid #ddd; border-top: 4px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                <p>Cargando testimonios...</p>
            </div>
            <style>
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
        `;

        // Paso 3: Cargar datos raw
        console.log('📡 Cargando datos desde Google Sheets...');
        const response = await fetch(CONFIG_SIMPLE.SHEET_URL);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const csvText = await response.text();
        console.log('✅ CSV recibido, longitud:', csvText.length);
        console.log('📄 Primeros 300 caracteres:', csvText.substring(0, 300));

        // Paso 4: Parsear de forma súper simple
        const testimonios = parsearCSVSimple(csvText);
        console.log('📊 Testimonios parseados:', testimonios.length);

        if (testimonios.length === 0) {
            throw new Error('No se encontraron testimonios válidos');
        }

        // Paso 5: Guardar globalmente
        todosLosTestimonios = testimonios;

        // Paso 6: Seleccionar y mostrar
        seleccionarYMostrarTestimonios();

        console.log('🎉 ¡Carga simple completada exitosamente!');

    } catch (error) {
        console.error('❌ Error en carga simple:', error);
        mostrarTestimoniosFallback();
    }
}

// ✅ PARSER CSV SUPER SIMPLE
function parsearCSVSimple(csvText) {
    console.log('📝 Parseando CSV de forma simple...');
    
    const lineas = csvText.split('\n').filter(linea => linea.trim() !== '');
    console.log('📋 Líneas totales:', lineas.length);
    
    if (lineas.length < 2) {
        console.log('❌ CSV muy corto');
        return [];
    }

    // Headers de la primera línea
    const headers = lineas[0].split(',').map(h => h.replace(/"/g, '').trim());
    console.log('🏷️ Headers encontrados:', headers);

    const testimonios = [];

    // Procesar cada línea de datos
    for (let i = 1; i < lineas.length; i++) {
        try {
            const valores = parsearLineaCSV(lineas[i]);
            
            // Crear objeto testimonio
            const testimonio = {};
            headers.forEach((header, index) => {
                testimonio[header] = valores[index] || '';
            });

            // Validar que tiene datos mínimos
            if (testimonio.nombre && testimonio.testimonio) {
                // Procesar datos
                testimonio.puntajeM1 = parseInt(testimonio.puntajeM1) || null;
                testimonio.puntajeM2 = parseInt(testimonio.puntajeM2) || null;
                testimonio.maximoNacional = testimonio.puntajeM1 === 1000 || testimonio.puntajeM2 === 1000;
                testimonio.id = i; // ID simple
                
                testimonios.push(testimonio);
                console.log(`✅ Testimonio ${i}: ${testimonio.nombre} ${testimonio.maximoNacional ? '🏆' : '📝'}`);
            } else {
                console.log(`⚠️ Testimonio ${i} incompleto:`, testimonio.nombre || 'Sin nombre');
            }
        } catch (error) {
            console.log(`❌ Error procesando línea ${i}:`, error.message);
        }
    }

    console.log(`📊 Total testimonios válidos: ${testimonios.length}`);
    return testimonios;
}

// ✅ PARSEAR LÍNEA CSV (maneja comillas básicamente)
function parsearLineaCSV(linea) {
    const resultado = [];
    let actual = '';
    let enComillas = false;

    for (let i = 0; i < linea.length; i++) {
        const char = linea[i];
        
        if (char === '"') {
            enComillas = !enComillas;
        } else if (char === ',' && !enComillas) {
            resultado.push(actual.trim().replace(/^"|"$/g, ''));
            actual = '';
        } else {
            actual += char;
        }
    }
    
    resultado.push(actual.trim().replace(/^"|"$/g, ''));
    return resultado;
}

// ✅ SELECCIÓN REALMENTE ALEATORIA SIMPLE - MEJORADA
function seleccionarYMostrarTestimonios() {
    console.log('🎲 === SELECCIONANDO TESTIMONIOS ===');
    console.log('📊 Testimonios disponibles:', todosLosTestimonios.length);
    
    if (todosLosTestimonios.length === 0) {
        mostrarTestimoniosFallback();
        return;
    }

    // Crear lista de índices para barajar
    const indices = [];
    for (let i = 0; i < todosLosTestimonios.length; i++) {
        indices.push(i);
    }

    // Barajar índices usando timestamp como semilla adicional
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    console.log('🔄 Índices barajados:', indices.slice(0, 10)); // Mostrar primeros 10

    // Separar máximos y regulares usando índices barajados
    const indicesMaximos = [];
    const indicesRegulares = [];
    
    indices.forEach(idx => {
        if (todosLosTestimonios[idx].maximoNacional) {
            indicesMaximos.push(idx);
        } else {
            indicesRegulares.push(idx);
        }
    });

    console.log(`🏆 Máximos disponibles: ${indicesMaximos.length}`);
    console.log(`📝 Regulares disponibles: ${indicesRegulares.length}`);

    // 🆕 NUEVA LÓGICA DE SELECCIÓN ALEATORIA
    const seleccionados = [];
    
    // 🎲 Decidir ALEATORIAMENTE cuántos máximos incluir
    let numMaximos = 0;
    if (indicesMaximos.length > 0) {
        // Probabilidades más realistas:
        // 30% = 0 máximos (solo regulares)
        // 50% = 1 máximo  
        // 20% = 2 máximos (si hay suficientes)
        const random = Math.random();
        
        if (random < 0.3) {
            numMaximos = 0;
            console.log('🎯 Decisión aleatoria: 0 máximos nacionales');
        } else if (random < 0.8) {
            numMaximos = 1;
            console.log('🎯 Decisión aleatoria: 1 máximo nacional');
        } else {
            numMaximos = Math.min(indicesMaximos.length, 2);
            console.log('🎯 Decisión aleatoria: 2 máximos nacionales');
        }
    }

    console.log(`🏆 Incluiremos ${numMaximos} máximos de ${indicesMaximos.length} disponibles`);

    // Seleccionar máximos según la decisión aleatoria
    for (let i = 0; i < numMaximos && i < indicesMaximos.length; i++) {
        const testimonio = todosLosTestimonios[indicesMaximos[i]];
        seleccionados.push(testimonio);
        console.log(`🏆 Seleccionado máximo ${i + 1}: ${testimonio.nombre}`);
    }

    // 🆕 COMPLETAR CON SELECCIÓN COMPLETAMENTE ALEATORIA
    // Crear pool de todos los testimonios NO seleccionados
    const indicesDisponibles = indices.filter(idx => 
        !seleccionados.some(sel => sel.id === todosLosTestimonios[idx].id)
    );

    console.log(`👥 Disponibles para completar: ${indicesDisponibles.length}`);
    console.log('👥 Nombres disponibles:', indicesDisponibles.slice(0, 5).map(idx => todosLosTestimonios[idx].nombre));

    // Completar hasta tener 3 testimonios
    let indicePool = 0;
    while (seleccionados.length < CONFIG_SIMPLE.CANTIDAD && indicePool < indicesDisponibles.length) {
        const testimonio = todosLosTestimonios[indicesDisponibles[indicePool]];
        seleccionados.push(testimonio);
        
        const tipo = testimonio.maximoNacional ? '🏆 máximo' : '📝 regular';
        console.log(`✅ Seleccionado ${tipo}: ${testimonio.nombre}`);
        indicePool++;
    }

    console.log('🎯 SELECCIÓN FINAL:');
    seleccionados.forEach((t, i) => {
        console.log(`  ${i + 1}. ${t.nombre} ${t.maximoNacional ? '🏆 (Featured)' : '📝 (Regular)'}`);
    });

    // 🆕 NO reordenar - mantener el orden aleatorio natural
    ultimaSeleccion = seleccionados;
    renderizarTestimonios(seleccionados);
}

// ✅ RENDERIZADO SIMPLE
function renderizarTestimonios(testimonios) {
    console.log('🎨 Renderizando testimonios...');
    
    const container = document.querySelector(CONFIG_SIMPLE.CONTAINER_SELECTOR);
    if (!container) {
        console.error('❌ Contenedor no encontrado para renderizado');
        return;
    }

    const html = testimonios.map((testimonio, index) => {
        const esFeatured = testimonio.maximoNacional;
        const claseCard = esFeatured ? 'testimonial-preview-card featured' : 'testimonial-preview-card';
        
        // Badge para máximos nacionales
        const badge = esFeatured ? `
            <div class="testimonial-badge">
                <span class="material-symbols-rounded">trophy</span>
                <span>Máximo Nacional ${testimonio.año || ''}</span>
            </div>
        ` : '';

        // Truncar testimonio si es muy largo
        let textoTestimonio = testimonio.testimonio || '';
        if (textoTestimonio.length > 150) {
            textoTestimonio = textoTestimonio.substring(0, 147) + '...';
        }

        // Formatear nombre (Solo primer nombre + inicial del apellido)
        let nombreMostrar = testimonio.nombre || 'Estudiante';
        const partes = nombreMostrar.split(' ');
        if (partes.length > 1) {
            nombreMostrar = `${partes[0]} ${partes[partes.length - 1].charAt(0).toUpperCase()}.`;
        }

        // Determinar mejor puntaje para mostrar
        let mejorPuntaje = { tipo: 'PAES', valor: '--' };
        if (testimonio.puntajeM1) {
            mejorPuntaje = { tipo: 'M1', valor: testimonio.puntajeM1 };
        }
        if (testimonio.puntajeM2 && testimonio.puntajeM2 > (testimonio.puntajeM1 || 0)) {
            mejorPuntaje = { tipo: 'M2', valor: testimonio.puntajeM2 };
        }

        return `
            <div class="${claseCard} fade-in">
                ${badge}
                <div class="testimonial-content">
                    <p>"${textoTestimonio}"</p>
                </div>
                <div class="testimonial-author">
                    <div class="author-info">
                        <strong class="author-name">${nombreMostrar}</strong>
                        <span class="author-university">${testimonio.universidad || 'Universidad'}</span>
                    </div>
                    <div class="testimonial-score">
                        <span class="score-label">${mejorPuntaje.tipo}:</span>
                        <span class="score-value">${mejorPuntaje.valor}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
    console.log('✅ Testimonios renderizados exitosamente');

    // Aplicar observer si existe
    if (window.universalObserver) {
        container.querySelectorAll('.testimonial-preview-card').forEach(card => {
            window.universalObserver.observe(card);
        });
    }
}

// ✅ FALLBACK SIMPLE
function mostrarTestimoniosFallback() {
    console.log('🆘 Mostrando testimonios de emergencia...');
    
    const container = document.querySelector(CONFIG_SIMPLE.CONTAINER_SELECTOR);
    if (!container) return;

    container.innerHTML = `
        <div class="testimonial-preview-card featured fade-in">
            <div class="testimonial-badge">
                <span class="material-symbols-rounded">trophy</span>
                <span>Máximo Nacional 2024</span>
            </div>
            <div class="testimonial-content">
                <p>"Gracias al Preuniversitario JMC logré mi objetivo de ingresar a la universidad. La metodología personalizada fue clave para mi éxito."</p>
            </div>
            <div class="testimonial-author">
                <div class="author-info">
                    <strong class="author-name">Estudiante Exitoso</strong>
                    <span class="author-university">Universidad de Chile</span>
                </div>
                <div class="testimonial-score">
                    <span class="score-label">M1:</span>
                    <span class="score-value">1000</span>
                </div>
            </div>
        </div>
        
        <div class="testimonial-preview-card fade-in">
            <div class="testimonial-content">
                <p>"El ambiente familiar y la atención personalizada marcaron la diferencia en mi preparación. Muy recomendado."</p>
            </div>
            <div class="testimonial-author">
                <div class="author-info">
                    <strong class="author-name">Ana M.</strong>
                    <span class="author-university">PUC</span>
                </div>
                <div class="testimonial-score">
                    <span class="score-label">M2:</span>
                    <span class="score-value">950</span>
                </div>
            </div>
        </div>
        
        <div class="testimonial-preview-card fade-in">
            <div class="testimonial-content">
                <p>"Los profesores realmente se preocupan por el progreso individual. La preparación fue integral y efectiva."</p>
            </div>
            <div class="testimonial-author">
                <div class="author-info">
                    <strong class="author-name">Carlos R.</strong>
                    <span class="author-university">USACH</span>
                </div>
                <div class="testimonial-score">
                    <span class="score-label">M1:</span>
                    <span class="score-value">890</span>
                </div>
            </div>
        </div>
    `;
}

// ✅ FUNCIONES DE DEBUG SIMPLES - MEJORADAS
window.debugSimple = {
    ver: () => {
        console.log('📊 === ESTADO SIMPLE ===');
        console.log('Testimonios cargados:', todosLosTestimonios.length);
        console.log('Última selección:', ultimaSeleccion.length);
        
        // 🆕 Mostrar estadísticas de última selección
        if (ultimaSeleccion.length > 0) {
            const numMaximos = ultimaSeleccion.filter(t => t.maximoNacional).length;
            const numRegulares = ultimaSeleccion.length - numMaximos;
            console.log(`  - Máximos nacionales: ${numMaximos}`);
            console.log(`  - Testimonios regulares: ${numRegulares}`);
            console.log('  - Nombres:', ultimaSeleccion.map(t => t.nombre).join(', '));
        }
        
        return {
            testimonios: todosLosTestimonios,
            seleccion: ultimaSeleccion
        };
    },
    
    nueva: () => {
        console.log('🔄 Forzando nueva selección...');
        if (todosLosTestimonios.length > 0) {
            seleccionarYMostrarTestimonios();
        } else {
            console.log('❌ No hay testimonios cargados');
        }
    },
    
    recargar: () => {
        console.log('🔄 Recargando desde servidor...');
        cargarTestimoniosSimple();
    },
    
    test: (veces = 5) => {
        console.log(`🧪 === TEST DE ${veces} SELECCIONES ===`);
        const resultados = [];
        
        for (let i = 0; i < veces; i++) {
            console.log(`\n--- Selección ${i + 1} ---`);
            seleccionarYMostrarTestimonios();
            
            // Guardar resultado para análisis
            const numMaximos = ultimaSeleccion.filter(t => t.maximoNacional).length;
            const nombres = ultimaSeleccion.map(t => t.nombre);
            resultados.push({
                maximos: numMaximos,
                nombres: nombres
            });
        }
        
        // Análisis de variabilidad
        console.log('\n📊 === ANÁLISIS DE VARIABILIDAD ===');
        resultados.forEach((resultado, i) => {
            console.log(`${i + 1}: ${resultado.maximos} máximos - ${resultado.nombres.join(', ')}`);
        });
        
        // Verificar si hay variación
        const primerResultado = JSON.stringify(resultados[0].nombres);
        const hayVariacionNombres = resultados.some(r => JSON.stringify(r.nombres) !== primerResultado);
        const variacionMaximos = new Set(resultados.map(r => r.maximos)).size > 1;
        
        console.log('\n✅ RESULTADOS:');
        console.log(`  Variación en nombres: ${hayVariacionNombres ? 'SÍ ✅' : 'NO ❌'}`);
        console.log(`  Variación en # máximos: ${variacionMaximos ? 'SÍ ✅' : 'NO ❌'}`);
        
        if (hayVariacionNombres && variacionMaximos) {
            console.log('🎉 ¡PERFECTO! Hay aleatoriedad real');
        } else if (hayVariacionNombres) {
            console.log('🔶 PARCIAL: Nombres varían pero # de máximos fijo');
        } else {
            console.log('❌ PROBLEMA: No hay suficiente variación');
        }
        
        return resultados;
    },
    
    // 🆕 Nueva función para probar solo la distribución de máximos
    testMaximos: (veces = 10) => {
        console.log(`🏆 === TEST DISTRIBUCIÓN MÁXIMOS (${veces} veces) ===`);
        const distribucion = { 0: 0, 1: 0, 2: 0 };
        
        for (let i = 0; i < veces; i++) {
            seleccionarYMostrarTestimonios();
            const numMaximos = ultimaSeleccion.filter(t => t.maximoNacional).length;
            distribucion[numMaximos]++;
        }
        
        console.log('📊 DISTRIBUCIÓN:');
        console.log(`  0 máximos: ${distribucion[0]} veces (${(distribucion[0]/veces*100).toFixed(1)}%)`);
        console.log(`  1 máximo:  ${distribucion[1]} veces (${(distribucion[1]/veces*100).toFixed(1)}%)`);
        console.log(`  2 máximos: ${distribucion[2]} veces (${(distribucion[2]/veces*100).toFixed(1)}%)`);
        
        return distribucion;
    }
};

// ✅ INICIALIZACIÓN AUTOMÁTICA
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM listo, iniciando testimonios simples...');
    
    // Verificar que estamos en la página correcta
    const esIndex = window.location.pathname === '/' || 
                   window.location.pathname === '/index.html' ||
                   window.location.pathname.endsWith('index.html');
    
    if (esIndex && document.querySelector(CONFIG_SIMPLE.CONTAINER_SELECTOR)) {
        console.log('✅ Página index detectada, iniciando carga...');
        cargarTestimoniosSimple();
        
        console.log('🛠️ Debug disponible:');
        console.log('  - debugSimple.ver() - Ver estado');
        console.log('  - debugSimple.nueva() - Nueva selección');
        console.log('  - debugSimple.recargar() - Recargar desde servidor');
        console.log('  - debugSimple.test(5) - Test múltiple');
    } else {
        console.log('ℹ️ No es página index o no hay contenedor, saltando...');
    }
});