# 🏔️ Guía del Sistema de Galería con Google Sheets

## 📋 Configuración de Google Sheets

### Estructura de Columnas Requerida

La Google Sheet debe tener exactamente estas 15 columnas en este orden:

| Columna | Nombre | Tipo | Descripción | Ejemplo |
|---------|--------|------|-------------|---------|
| A | `id` | Texto | ID único para la carpeta/expedición | `aconcagua` |
| B | `nombre` | Texto | Nombre de la expedición | `Aconcagua` |
| C | `categoria` | Texto | Categoría (cerros/volcanes/sierras) | `cerros` |
| D | `altitud` | Número | Altitud en metros | `6962` |
| E | `dificultad` | Texto | Grado de dificultad (F/PD/AD/D/TD/ED) | `AD` |
| F | `pais` | Texto | País de ubicación | `Argentina` |
| G | `ubicacion` | Texto | Ubicación completa | `Mendoza, Argentina • Cordillera de los Andes` |
| H | `descripcionCorta` | Texto | Descripción breve | `La cumbre más alta de América...` |
| I | `descripcionLarga` | Texto | Descripción detallada | `El Aconcagua es la montaña más alta...` |
| J | `badges` | Texto JSON | Badges personalizados (ver formato) | Ver ejemplos abajo |
| K | `ascensiones` | Número | Número de ascensiones | `2` |
| L | `latitud` | Número | Coordenada latitud | `-32.6532` |
| M | `longitud` | Número | Coordenada longitud | `-70.0109` |
| N | `destacado` | Booleano | Si es expedición destacada | `TRUE` |
| O | `fechaActualizacion` | Fecha | Fecha de última actualización | `2024-12-15` |

### 🏆 Formato de Badges Personalizados

Los badges se configuran en la columna `badges` usando formato JSON:

```json
[
    {
        "icon": "trophy",
        "name": "Cumbre América",
        "description": "Punto más alto de América"
    },
    {
        "icon": "military_tech",
        "name": "Récord Personal",
        "description": "Mayor altitud alcanzada"
    }
]
```

**🔄 Badge Automático de Ascensiones:**
- Si el número de `ascensiones` es mayor a 1, se genera automáticamente un badge al final
- Icono: `trending_up`
- Nombre: `[X] Ascensiones` (donde X es el número)
- Descripción: `Montaña ascendida [X] veces`
- Este badge se añade automáticamente, no es necesario incluirlo en la columna `badges`

**Iconos disponibles** (Material Symbols):
- `trophy` - Trofeo | `military_tech` - Medalla militar | `flag` - Bandera
- `timer` - Cronómetro | `speed` - Velocidad | `visibility` - Vista/panorámica
- `trending_up` - Tendencia ascendente | `landscape` - Paisaje | `fitness_center` - Entrenamiento
- `nature` - Naturaleza | `directions_walk` - Caminar | `public` - Mundial | `water_drop` - Gota de agua

### 📂 Estructura de Carpetas de Imágenes

Las imágenes deben estar organizadas de la siguiente manera:

```
/media/images/j-cartes/gallery/
├── aconcagua/
│   ├── aconcagua_cover.jpg    (imagen principal)
│   ├── foto1.jpg
│   ├── foto2.jpg
│   └── ...
├── el-plomo/
│   ├── el-plomo_cover.jpg
│   ├── foto1.jpg
│   └── ...
└── [id-expedicion]/
    ├── [id-expedicion]_cover.jpg
    └── fotos...
```

**Importante:**
- El nombre de la carpeta debe coincidir exactamente con el `id` de la Google Sheet
- La imagen de portada debe llamarse `[id]_cover.jpg`
- Las demás imágenes pueden tener cualquier nombre

## ⚙️ Configuración del Sistema

### 1. Hacer la Google Sheet Pública

1. Abrir la Google Sheet
2. Hacer clic en "Compartir" (botón azul)
3. Cambiar "Restringido" a "Cualquier persona con el enlace"
4. Asegurarse de que el permiso sea "Visualizador"
5. Copiar el ID de la sheet desde la URL

### 2. Actualizar el ID en el Sistema

En el archivo `js/gallery-system/gallery-data.js`, línea 18:
```javascript
SHEET_ID: 'AQUI_VA_TU_SHEET_ID',
```

## 📊 Datos de Ejemplo para Copiar

```csv
id,nombre,categoria,altitud,dificultad,pais,ubicacion,descripcionCorta,descripcionLarga,badges,ascensiones,latitud,longitud,destacado,fechaActualizacion
aconcagua,Aconcagua,cerros,6962,AD,Argentina,"Mendoza, Argentina • Cordillera de los Andes","La cumbre más alta de América, conocida como el Coloso de América.","El Aconcagua es la montaña más alta de América y la cumbre más elevada del hemisferio sur. Presenta un desafío único por su altitud extrema y condiciones físicas demandantes.","[{""icon"":""trophy"",""name"":""Cumbre América"",""description"":""Punto más alto de América""},{""icon"":""military_tech"",""name"":""Récord Personal"",""description"":""Mayor altitud alcanzada""}]",2,-32.6532,-70.0109,TRUE,2024-12-15
el-plomo,Cerro El Plomo,cerros,5424,F,Chile,"Santiago, Chile • Cordillera de los Andes","Montaña emblemática de Santiago, ideal para iniciación en alta altitud.","El Cerro El Plomo es una de las montañas más emblemáticas y accesibles de la Cordillera de los Andes cercana a Santiago.","[{""icon"":""timer"",""name"":""Récord Tiempo"",""description"":""Ascensión en tiempo récord""},{""icon"":""visibility"",""name"":""Vistas Santiago"",""description"":""Panorámica excepcional de la capital""}]",1,-33.2167,-70.1833,FALSE,2024-11-20
```

## 🔧 Debugging y Resolución de Problemas

### Comandos de Debugging en la Consola del Navegador

```javascript
// Ver estado completo del sistema
debugGallerySystem.status()

// Probar conexión con Google Sheets
debugGallerySystem.testGoogleSheets()

// Verificar estructura de datos
debugGallerySystem.checkDataStructure()

// Probar apertura de una expedición específica
debugGallerySystem.testOpen('aconcagua')

// Reinicializar sistema completo
debugGallerySystem.forceRestart()
```

### Problemas Comunes

**❌ No se cargan las expediciones:**
- Verificar que la Google Sheet sea pública
- Comprobar que el ID de la sheet sea correcto
- Revisar que las columnas tengan los nombres exactos

**❌ Las imágenes no aparecen:**
- Verificar que las carpetas tengan el mismo nombre que el `id`
- Comprobar que las imágenes estén en la ruta correcta
- Verificar que existe el archivo `[id]_cover.jpg`

**❌ Los badges no se muestran:**
- Verificar que el JSON de badges esté correctamente formateado
- Usar comillas dobles escapadas: `""`
- Revisar que los iconos existan en Material Symbols

## 🚀 Cómo Usar el Sistema

### Para Añadir una Nueva Expedición:

1. **Crear carpeta de imágenes** en `/media/images/j-cartes/gallery/[id]/`
2. **Subir fotos** incluyendo `[id]_cover.jpg`
3. **Añadir fila** en Google Sheet con todos los datos
4. **Usar formato JSON** para badges personalizados
5. **Guardar la sheet** - El sistema se actualiza automáticamente

### Para Modificar una Expedición:

1. **Editar datos** directamente en Google Sheet
2. **Cambiar imágenes** en la carpeta correspondiente
3. **Actualizar badges** modificando el JSON
4. **Guardar** - Los cambios aparecen inmediatamente

El sistema detecta automáticamente las fotos en las carpetas y las sincroniza con los datos de Google Sheets para crear una galería completamente funcional.
