# 📄 **GUÍA DE TEMPLATE PARA NUEVAS PÁGINAS**

Este template te permite crear nuevas páginas siguiendo exactamente el mismo patrón y sistema establecido en el sitio de Preuniversitario JMC.

## 🚀 **CÓMO USAR EL TEMPLATE**

### **1. COPIAR ARCHIVOS**
```bash
# Copiar los archivos template con el nombre de tu nueva página
cp template.html nueva-pagina.html
cp css/template.css css/nueva-pagina.css  
cp js/template.js js/nueva-pagina.js
```

### **2. PERSONALIZAR HTML (`nueva-pagina.html`)**

#### **Meta Tags y Title:**
```html
<title>Nombre de Tu Página | Preuniversitario JMC</title>
<meta name="description" content="Descripción SEO de tu página">
<link rel="stylesheet" href="css/nueva-pagina.css">
```

#### **Navigation:**
```html
<!-- Agregar 'active' a tu página en el menú -->
<li><a href="nueva-pagina.html" class="nav-link active">Tu Página</a></li>
```

#### **Scripts:**
```html
<script src="js/nueva-pagina.js"></script>
```

#### **Contenido:**
- Cambiar títulos H1, H2
- Personalizar textos y párrafos  
- Ajustar clases de iconos Material Symbols
- Modificar links de CTAs

### **3. PERSONALIZAR CSS (`css/nueva-pagina.css`)**

#### **🖼️ CAMBIAR IMÁGENES DE FONDO:**
```css
/* OBLIGATORIO: Reemplazar todas estas rutas */
.mountain-background {
    background-image: url('../media/images/tu-pagina/background-primary.jpg');
}

.secondary-background {
    background-image: url('../media/images/tu-pagina/background-secondary.jpg');
}

.hero {
    background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
        url('../media/images/tu-pagina/hero-background.jpg') center/cover;
}

.cta {
    background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
        url('../media/images/tu-pagina/cta-background.jpg') center/cover;
}
```

#### **📁 CREAR CARPETA DE IMÁGENES:**
```
media/images/tu-pagina/
├── background-primary.jpg
├── background-secondary.jpg  
├── hero-background.jpg
└── cta-background.jpg
```

#### **🎨 PERSONALIZAR ESTILOS (OPCIONAL):**
- Cambiar nombres de clases CSS si necesitas
- Ajustar colores específicos
- Modificar espaciados si es necesario
- Agregar estilos específicos de tu página

### **4. PERSONALIZAR JAVASCRIPT (`js/nueva-pagina.js`)**

#### **📝 CAMBIAR NOMBRE DE FUNCIONES:**
```javascript
// Cambiar "Template" por el nombre de tu página
function initTuPaginaCardInteractions() {
    // ...
}

function initTuPaginaAnimations() {
    // ...
}

// En el DOMContentLoaded:
initTuPaginaCardInteractions();
initTuPaginaAnimations();
```

#### **🗑️ ELIMINAR FUNCIONES NO NECESARIAS:**
- Si no necesitas lightbox, elimina `initTemplateLightbox()`
- Si no tienes contadores, elimina `initTemplateCounters()`
- Si no tienes filtros, elimina `initTemplateFilters()`

#### **➕ AGREGAR FUNCIONALIDADES ESPECÍFICAS:**
- Funciones específicas de tu página
- Event listeners particulares
- Interacciones únicas

---

## 📋 **ESTRUCTURA DEL TEMPLATE**

### **🏗️ LAYOUT SYSTEM:**
El template usa el **mismo sistema probado** de nosotros.css y fundador.css:

```html
<!-- Background wrapper primary -->
<div class="background-wrapper-primary">
    <div class="mountain-background"></div>
    
    <section class="hero">...</section>
    <section class="first-section">...</section>
    <section class="second-section">...</section>
</div>

<!-- Sección global azul (opcional) -->
<section class="blue-section">...</section>

<!-- Background wrapper secondary -->
<div class="background-wrapper-secondary">
    <div class="secondary-background"></div>
    
    <section class="third-section">...</section>
</div>

<!-- Sección regular (opcional) -->
<section class="regular-section">...</section>
```

### **🎯 TIPOS DE SECCIONES:**

1. **Secciones con Background** (`.first-section`, `.second-section`, `.third-section`)
   - Fondo semitransparente blanco
   - Dentro de background-wrappers
   - Márgenes 8.33% desktop, 5% mobile

2. **Sección Azul** (`.blue-section`)
   - Fondo azul degradado
   - Sección global (fuera de wrappers)
   - Incluye quote-card automáticamente

3. **Sección Regular** (`.regular-section`)
   - Fondo blanco sólido
   - Para contenido estándar

### **🃏 TIPOS DE CARDS:**

- **`.content-card`** - Para contenido principal con padding grande
- **`.example-card`** - Cards con borde degradado (estilo program-card)
- **`.feature-card`** - Cards semitransparentes para características
- **`.info-card`** - Cards para información con backdrop-filter

---

## 🎨 **SISTEMA DE COLORES Y ICONOS**

### **Colores Disponibles:**
```css
var(--azul-principal)  /* #41B6E6 */
var(--amarillo)        /* #F4DA40 */
var(--azul-oscuro)     /* #165C7D */
var(--negro)           /* #101820 */
var(--rojo)            /* #EF3340 */
```

### **Iconos Material Symbols:**
```html
<!-- Iconos principales (6rem) -->
<span class="material-symbols-rounded main-icon">school</span>

<!-- Iconos secundarios (4.5rem) -->  
<span class="material-symbols-rounded secondary-icon">target</span>
```

### **Containers de Iconos:**
```html
<!-- Container principal -->
<div class="main-icon-container">
    <span class="material-symbols-rounded main-icon">school</span>
</div>

<!-- Container secundario -->
<div class="secondary-icon-container">
    <span class="material-symbols-rounded secondary-icon">target</span>
</div>
```

---

## 📱 **RESPONSIVE AUTOMÁTICO**

El template incluye **responsive automático** siguiendo el patrón probado:

- **Desktop:** Layout completo con grids
- **Tablet:** Ajustes de grid (4→2, 3→2, etc.)
- **Mobile:** Columna única, márgenes 5%, padding reducido

### **Grid Classes Disponibles:**
- `.card-grid-2` - 2 columnas → 2 → 1
- `.card-grid-3` - 3 columnas → 2 → 1  
- `.card-grid-4` - 4 columnas → 2 → 1

---

## ✅ **CHECKLIST FINAL**

Antes de publicar tu nueva página:

### **📁 Archivos:**
- [ ] HTML personalizado y renombrado
- [ ] CSS personalizado y renombrado
- [ ] JS personalizado y renombrado
- [ ] Carpeta de imágenes creada

### **🖼️ Imágenes:**
- [ ] Hero background agregado
- [ ] Primary background agregado  
- [ ] Secondary background agregado
- [ ] CTA background agregado

### **🔗 Enlaces:**
- [ ] Navigation menu actualizado
- [ ] Active state en página correcta
- [ ] CTAs apuntando a páginas correctas
- [ ] Footer links funcionando

### **🧪 Testing:**
- [ ] Desktop funciona correctamente
- [ ] Tablet responsive funciona
- [ ] Mobile responsive funciona
- [ ] Todas las animaciones funcionan
- [ ] JavaScript sin errores en console

---

## 🎯 **EJEMPLOS DE USO**

### **Para página "Servicios":**
```bash
cp template.html servicios.html
cp css/template.css css/servicios.css
cp js/template.js js/servicios.js
```

Luego personalizar:
- Cambiar `.first-section` por `.servicios-intro` 
- Cambiar `.example-card` por `.servicio-card`
- Agregar funciones específicas como filtros de servicios

### **Para página "Testimonios":**
```bash
cp template.html testimonios.html
cp css/template.css css/testimonios.css  
cp js/template.js js/testimonios.js
```

Luego personalizar:
- Eliminar secciones no necesarias
- Agregar `.testimonio-card` específicas
- Implementar carousel o lightbox para testimonios

---

## 💡 **TIPS AVANZADOS**

1. **Reutilizar Components:** Las cards del template son reutilizables, solo cambia las clases CSS

2. **Consistencia:** Mantén el mismo naming pattern: `página-elemento`

3. **Performance:** Las imágenes de background se cargan lazy automáticamente

4. **SEO:** Recuerda actualizar meta descriptions y titles

5. **Accessibility:** Los iconos Material Symbols ya incluyen aria-labels automáticamente

---

¡Con este template puedes crear páginas profesionales que se integren perfectamente al sitio existente! 🚀