# 🏔️ SISTEMA DE GALERÍA DINÁMICO - GUÍA DE INTEGRACIÓN
**Preuniversitario JMC - Sistema de Expediciones Montañísticas**
*Desarrollado por Alexandre Castillo - ACastillo DG*

## 📦 **ARCHIVOS CREADOS**

### **1. Datos y Configuración:**
- ✅ `data/expeditions.json` - Base de datos de expediciones
- ✅ `data/gallery-config.json` - Configuración del sistema

### **2. JavaScript (Sistema Modular):**
- ✅ `js/gallery-system/gallery-main.js` - Coordinador principal
- ✅ `js/gallery-system/gallery-cards.js` - Generador dinámico de cards
- ✅ `js/gallery-system/gallery-overlay.js` - Sistema de lightbox

### **3. CSS:**
- ✅ `css/components/gallery-overlay.css` - Estilos del lightbox

### **4. Mockups (Referencia Visual):**
- ✅ Gallery Base - Vista de cards con filtros
- ✅ Gallery Overlay Template - Lightbox 1/3-2/3

---

## 🚀 **PASOS DE INTEGRACIÓN**

### **Paso 1: Crear Estructura de Carpetas**
```
preu-jmc/
├── data/                           # 📁 NUEVA
│   ├── expeditions.json            # 📄 NUEVO
│   └── gallery-config.json         # 📄 NUEVO
│
├── js/gallery-system/              # 📁 NUEVA
│   ├── gallery-main.js             # 📄 NUEVO
│   ├── gallery-cards.js            # 📄 NUEVO
│   └── gallery-overlay.js          # 📄 NUEVO
│
├── css/components/                 # ✅ Ya existe
│   └── gallery-overlay.css         # 📄 NUEVO
│
└── media/images/fundador/gallery/  # ✅ Ya existe
    ├── aconcagua/
    ├── el-plomo/
    ├── volcan-san-jose/
    ├── marmolejo/
    ├── ojos-salado/
    └── sierras-santiago/
```

### **Paso 2: Actualizar CSS Principal**
En `css/main.css`, agregar la importación del overlay:

```css
/* ===== COMPONENTS - COMPONENTES ===== */
@import url('./components/cards.css');
@import url('./components/grids.css');
@import url('./components/icons.css');
@import url('./components/buttons.css');
@import url('./components/progress-bar.css');
@import url('./components/gallery-overlay.css');  /* 📄 NUEVA LÍNEA */
```

### **Paso 3: Actualizar fundador.html**
Reemplazar la sección de galería actual con:

```html
<!-- Galería de Expediciones -->
<section class="section mountaineering-section" id="mountaineering-gallery">
    <!-- El contenido se genera dinámicamente por el sistema -->
    <div class="container">
        <div class="loading-message" style="text-align: center; padding: 3rem;">
            <h3>Cargando expediciones...</h3>
            <p>El sistema está detectando automáticamente las fotos.</p>
        </div>
    </div>
</section>
```

Y al final del `<body>`, después de los scripts existentes:

```html
<!-- Scripts existentes -->
<script src="js/global.js"></script>
<script src="js/gallery.js"></script>

<!-- Sistema de Galería Dinámico -->
<script src="js/gallery-system/gallery-main.js"></script>
<script src="js/gallery-system/gallery-cards.js"></script>
<script src="js/gallery-system/gallery-overlay.js"></script>
```

---

## 🎯 **CARACTERÍSTICAS IMPLEMENTADAS**

### **✅ Sistema Completamente Dinámico:**
- **Detección automática** de fotos en carpetas
- **Carga desde JSON** - Sin hardcodear información
- **Filtros dinámicos** por categoría (Cerros, Volcanes, Sierras)
- **Sistema de "NUEVO"** basado en fechas de actualización
- **Responsive completo** (desktop, tablet, mobile)

### **✅ Lightbox Avanzado:**
- **Layout 1/3-2/3** (información - fotos)
- **Navegación completa** (teclado, mouse, touch)
- **Gestos móviles** (swipe, tap, double-tap)
- **Información detallada** con logros y datos técnicos
- **Google Maps integrado**

### **✅ UX/UI Premium:**
- **Animaciones suaves** con Intersection Observer
- **Hover effects** avanzados en cards
- **Loading states** y manejo de errores
- **Accesibilidad** (ARIA labels, navegación por teclado)
- **Performance optimizada** (lazy loading, preload)

---

## 📸 **AGREGAR NUEVAS EXPEDICIONES**

### **Paso 1: Crear Carpeta de Fotos**
```
media/images/fundador/gallery/nueva-expedicion/
├── nueva-expedicion_cover.jpg    # Imagen para la card
├── nueva-expedicion_0001.jpg     # Fotos del carrusel
├── nueva-expedicion_0002.jpg
├── nueva-expedicion_0003.jpg
└── ... (hasta _0050.jpg máximo)
```

### **Paso 2: Agregar a expeditions.json**
```json
{
  "expeditions": {
    "nueva-expedicion": {
      "id": "nueva-expedicion",
      "name": "Nueva Expedición",
      "shortDescription": "Descripción breve para la card...",
      "longDescription": "Descripción completa para el lightbox...",
      "altitude": 5000,
      "altitudeUnit": "msnm",
      "difficulty": {
        "grade": "PD",
        "name": "Poco Difícil",
        "system": "Sistema Alpino Francés"
      },
      "type": "Cerro",
      "category": "cerros",
      "location": {
        "country": "Chile",
        "region": "Región",
        "coordinates": { "lat": -33.0, "lng": -70.0 },
        "mapsUrl": "https://maps.google.com/?q=-33.0,-70.0"
      },
      "ascents": 1,
      "achievements": [
        {
          "icon": "emoji_events",
          "name": "Logro Especial",
          "description": "Descripción del logro"
        }
      ],
      "technicalInfo": {
        "climate": "Templado",
        "route": "Normal",
        "duration": "2 días",
        "preparation": "Intermedia",
        "modality": "Trekking",
        "season": "Todo el año"
      },
      "coverImage": "nueva-expedicion_cover.jpg",
      "lastUpdate": "2025-01-15T10:00:00Z",
      "featured": false,
      "status": "active"
    }
  }
}
```

### **Paso 3: Actualizar Metadatos**
```json
{
  "metadata": {
    "totalExpeditions": 7,    // Incrementar
    "lastGlobalUpdate": "2025-01-15T10:00:00Z"  // Actualizar
  }
}
```

¡**EL SISTEMA DETECTA LAS FOTOS AUTOMÁTICAMENTE!** 🎉

---

## 🔧 **CONFIGURACIÓN AVANZADA**

### **Personalizar Duración de "NUEVO":**
En `gallery-config.json`:
```json
{
  "ui": {
    "newBadgeDuration": 30  // Días que aparece "NUEVO"
  }
}
```

### **Agregar Nuevas Categorías:**
```json
{
  "categories": {
    "nueva-categoria": {
      "name": "Nueva Categoría",
      "description": "Descripción",
      "icon": "terrain"
    }
  },
  "filters": {
    "buttons": [
      {
        "id": "nueva-categoria",
        "label": "Nueva Categoría",
        "category": "nueva-categoria"
      }
    ]
  }
}
```

---

## 🎨 **SISTEMA DE CLASIFICACIÓN**

### **Dificultades Disponibles (UIAA en Español):**
- **F** = Fácil
- **PD** = Poco Difícil
- **AD** = Bastante Difícil
- **D** = Difícil
- **TD** = Muy Difícil
- **ED** = Extremadamente Difícil

### **Iconos de Logros (Material Symbols):**
- `emoji_events` - Trofeos y récords
- `military_tech` - Medallas y honores
- `timer` - Récords de tiempo
- `speed` - Velocidad
- `public` - Logros mundiales
- `ac_unit` - Condiciones extremas
- `fitness_center` - Resistencia física
- `explore` - Exploración

---

## 📱 **CONTROLES MÓVILES**

### **Gestos Táctiles:**
- **1 tap en foto:** Ocultar/mostrar controles UI
- **2 taps en foto:** Zoom (futuro)
- **Swipe izquierda:** Foto siguiente
- **Swipe derecha:** Foto anterior
- **Swipe arriba:** Cerrar galería
- **Swipe abajo:** Ver información completa

### **Navegación por Teclado:**
- **Escape:** Cerrar galería
- **← →:** Navegar fotos
- **Espacio:** Siguiente foto
- **Tab:** Navegar elementos

---

## 🚀 **VENTAJAS DEL SISTEMA**

### **✅ Para el Cliente (José Manuel Cartes):**
- **Agregar expediciones:** Solo subir fotos + editar JSON
- **Actualización automática:** Sin tocar código
- **Gestión de contenido:** Fácil y visual
- **Nuevas fotos:** Solo subirlas a la carpeta correspondiente

### **✅ Para el Desarrollador:**
- **Código escalable:** Arquitectura modular
- **Mantenimiento mínimo:** Sistema se autoregulan
- **Performance optimizada:** Carga bajo demanda
- **Documentación completa:** Fácil de entender

### **✅ Para los Usuarios:**
- **Experiencia premium:** Lightbox profesional
- **Navegación intuitiva:** Gestos naturales
- **Información completa:** Todo en un lugar
- **Performance rápida:** Carga optimizada

---

## 🎯 **ESTADO FINAL**

**SISTEMA COMPLETAMENTE IMPLEMENTADO Y LISTO PARA PRODUCCIÓN**

Con estos archivos, el Preuniversitario JMC tendrá:
- ✅ **Galería dinámica** 100% automática
- ✅ **Sistema escalable** para futuras expediciones
- ✅ **UX profesional** con todas las funcionalidades modernas
- ✅ **Gestión de contenido** simple para el cliente
- ✅ **Performance optimizada** para todos los dispositivos

**🏔️ ¡El sistema está listo para mostrar las expediciones de José Manuel Cartes de manera espectacular!**