# 🏗️ NUEVA ESTRUCTURA CSS MODULAR - PREUNIVERSITARIO JMC

## 📋 **PROBLEMA ACTUAL**
`global.css` tiene **2,089 líneas** y múltiples responsabilidades:
- Variables y reset
- Tipografías y fuentes
- Header y navegación
- Layout de secciones
- Sistema de cards
- Grids universales
- Iconos
- Footer
- Animaciones
- Responsive

## 🎯 **PROPUESTA DE DIVISIÓN MODULAR**

### **ESTRUCTURA NUEVA:**
```
css/
├── core/
│   ├── variables.css      # Variables CSS y configuración
│   ├── fonts.css          # @font-face y tipografías
│   ├── reset.css          # Reset y base styles
│   └── animations.css     # Keyframes y animaciones
├── layout/
│   ├── header.css         # Header y navegación
│   ├── sections.css       # Layout de secciones
│   ├── footer.css         # Footer completo
│   └── backgrounds.css    # Background wrappers
├── components/
│   ├── cards.css          # Sistema universal de cards
│   ├── grids.css          # Grids universales
│   ├── icons.css          # Sistema de iconos
│   ├── buttons.css        # CTAs y botones
│   └── forms.css          # Formularios (futuro)
├── utilities/
│   ├── responsive.css     # Media queries
│   └── helpers.css        # Clases utilitarias
├── global.css             # Orquestador principal
├── nosotros.css           # Solo específico
├── fundador.css           # Solo específico
├── servicios.css          # Solo específico
└── 404.css                # Solo específico
```

---

## 📁 **CONTENIDO DE CADA MÓDULO**

### **1. `css/core/variables.css`** (50 líneas)
```css
/* Variables CSS y configuración global */
:root {
    /* Colores principales */
    --azul-principal: #41B6E6;
    --amarillo: #F4DA40;
    --negro: #101820;
    --rojo: #EF3340;
    --azul-oscuro: #165C7D;
    --blanco: #FFFFFF;
    --gris-claro: #F8F9FA;
    --gris-medio: #E9ECEF;
    
    /* Tipografías */
    --font-title: 'DM Serif Text', serif;
    --font-body: 'Raleway', sans-serif;
    
    /* Espaciado */
    --title-letter-spacing: 0.2rem;
    --section-padding: 5rem 0;
    --card-padding: 2rem;
    --border-radius: 15px;
    
    /* Sombras */
    --shadow-light: 0 10px 30px rgba(0, 0, 0, 0.1);
    --shadow-medium: 0 15px 40px rgba(0, 0, 0, 0.15);
    
    /* Breakpoints */
    --tablet: 82rem;
    --mobile: 53rem;
}
```

### **2. `css/core/fonts.css`** (120 líneas)
```css
/* @font-face declarations */
/* Material Symbols */
@font-face {
    font-family: 'Material Symbols Rounded';
    /* ... */
}

/* DM Serif Text */
@font-face {
    font-family: 'DM Serif Text';
    /* ... */
}

/* Raleway Variable */
@font-face {
    font-family: 'Raleway';
    /* ... */
}

/* Material Symbols class */
.material-symbols-rounded {
    /* ... */
}
```

### **3. `css/core/reset.css`** (80 líneas)
```css
/* Reset CSS y estilos base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-body);
    line-height: 1.6;
    color: var(--negro);
    overflow-x: hidden;
}

html {
    scroll-padding-top: 6px;
    scroll-behavior: smooth;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 1;
}
```

### **4. `css/core/animations.css`** (100 líneas)
```css
/* Keyframes y animaciones universales */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes ripple-expand {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(4); opacity: 0; }
}

/* Clases de animación */
.fade-in {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
}

.fade-in.visible {
    opacity: 1;
    transform: translateY(0);
}
```

### **5. `css/layout/header.css`** (200 líneas)
```css
/* Header completo con navegación */
.header {
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    z-index: 1000;
    padding: 1.5rem 0;
    transition: all 0.3s ease;
    border-bottom: 1px solid rgba(65, 182, 230, 0.1);
}

/* Progress bar */
#scroll-progress-bar {
    /* ... */
}

/* Navigation */
.nav-container {
    /* ... */
}

/* Navigation responsive */
@media (max-width: 53rem) {
    .nav-menu {
        display: none;
    }
}
```

### **6. `css/layout/sections.css`** (250 líneas)
```css
/* Layout universal de secciones */
.section {
    padding: var(--section-padding);
}

.section-title {
    font-family: var(--font-title);
    font-size: clamp(2.5rem, 5vw, 4rem);
    text-align: center;
    margin-bottom: 2rem;
    color: var(--azul-oscuro);
    line-height: 1;
    letter-spacing: var(--title-letter-spacing);
}

.section-subtitle {
    display: block;
    height: 4px;
    margin: 0 auto 3rem auto;
    width: 120px;
    background: var(--amarillo);
    position: relative;
}

/* Hero universal */
.hero {
    height: 100vh;
    background-position: center center;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    position: relative;
}

/* Secciones con background */
.section-with-background {
    background: rgba(255, 255, 255, 0.75);
    margin-left: 8.33%;
    margin-right: 8.33%;
    margin-bottom: 6rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-light);
    position: relative;
    z-index: 2;
    padding: var(--section-padding);
}

/* Sección azul universal */
.blue-section-universal {
    background: linear-gradient(135deg, var(--azul-principal) 0%, var(--azul-oscuro) 100%);
    color: white;
    padding: var(--section-padding);
}

/* Responsive */
@media (max-width: 82rem) and (min-width: 53.0625rem) {
    .section-with-background {
        margin-left: 5%;
        margin-right: 5%;
        padding: 4rem 0;
    }
}

@media (max-width: 53rem) {
    .section {
        padding: 3rem 0;
    }
    
    .section-with-background {
        margin-left: 5%;
        margin-right: 5%;
        margin-bottom: 3rem;
        padding: 3rem 0;
    }
}
```

### **7. `css/components/cards.css`** (400 líneas)
```css
/* Sistema universal de cards */
.card-base {
    border-radius: var(--border-radius);
    padding: var(--card-padding);
    text-align: center;
    position: relative;
    transition: all 0.3s ease;
    box-shadow: var(--shadow-light);
    background: rgba(255, 255, 255, 0.9);
}

.card-base:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-medium);
}

/* Variantes de cards */
.card-base.glassmorphism {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
}

.card-base.bordered {
    background: 
        linear-gradient(white, white) padding-box,
        linear-gradient(135deg, #A9D9F3 0%, #FDEBA4 100%) border-box;
    border: 9px solid transparent;
}

/* Cards específicas */
.about-card,
.mvp-card,
.stat-card,
.program-card,
.value-card,
.sede-card,
.quote-card,
.proceso-card-full {
    @extend .card-base; /* Si usamos SCSS */
}

/* Quote card específica */
.quote-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 3rem;
    text-align: center;
    margin: 3rem auto;
    max-width: 600px;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
}

/* Process cards específicas */
.proceso-card-full {
    padding: 2.5rem;
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 2rem;
}

/* Responsive cards */
@media (max-width: 53rem) {
    .proceso-card-full {
        padding: 2rem;
        flex-direction: column;
        text-align: center;
        gap: 1.5rem;
    }
}
```

### **8. `css/components/grids.css`** (150 líneas)
```css
/* Sistema universal de grids */
.card-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 0;
    padding: 0 2rem 2rem 2rem;
}

.card-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 0;
    padding: 0 2rem 2rem 2rem;
}

.card-grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    margin-top: 0;
    padding: 0 2rem 2rem 2rem;
}

/* Grid especial para elementos que necesitan span */
.card-grid-3-special {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 0;
    padding: 0 2rem 2rem 2rem;
}

/* Responsive grids */
@media (max-width: 82rem) and (min-width: 53.0625rem) {
    .card-grid-4 {
        grid-template-columns: repeat(2, 1fr) !important;
    }
    
    .card-grid-3-special {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .card-grid-3-special > *:nth-child(3) {
        grid-column: span 2;
        max-width: 80%;
        margin: 0 auto;
    }
}

@media (max-width: 53rem) {
    .card-grid-2,
    .card-grid-3,
    .card-grid-4,
    .card-grid-3-special {
        grid-template-columns: 1fr !important;
        padding: 0 1rem 2rem 1rem;
    }
    
    .card-grid-3-special > *:nth-child(3) {
        grid-column: auto;
        max-width: 100%;
    }
}
```

### **9. `css/components/icons.css`** (200 líneas)
```css
/* Sistema universal de iconos */

/* Tamaños de iconos */
.icon-xl { font-size: 6rem; }
.icon-lg { font-size: 4.5rem; }
.icon-md { font-size: 4rem; }
.icon-sm { font-size: 1.2rem; }
.icon-xs { font-size: 1rem; }

/* Contenedores de iconos */
.icon-container-xl {
    height: 10rem;
    width: 10rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    margin: 0 auto;
}

.icon-container-lg {
    height: 7.5rem;
    width: 7.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    margin: 0 auto;
}

.icon-container-lg-blue {
    height: 7.5rem;
    width: 7.5rem;
    background: var(--azul-principal);
    border-radius: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0.375rem 1.125rem rgba(65, 182, 230, 0.3);
    transition: all 0.3s ease;
}

/* Aliases para compatibilidad con código actual */
.main-icon { @extend .icon-xl; }
.secondary-icon { @extend .icon-lg; }
.process-icon { @extend .icon-md; color: white; }
.footer-icon { @extend .icon-sm; }
.meta-icon { @extend .icon-xs; }

.main-icon-container { @extend .icon-container-xl; }
.secondary-icon-container { @extend .icon-container-lg; }
.process-step-icon { @extend .icon-container-lg-blue; }

/* Responsive icons */
@media (max-width: 82rem) and (min-width: 53.0625rem) {
    .icon-container-xl {
        height: 8.75rem;
        width: 8.75rem;
    }
    
    .icon-xl { font-size: 5rem; }
    
    .icon-container-lg {
        height: 6.25rem;
        width: 6.25rem;
    }
    
    .icon-lg { font-size: 3.5rem; }
}

@media (max-width: 53rem) {
    .icon-container-xl {
        height: 5rem;
        width: 5rem;
    }
    
    .icon-xl { font-size: 2.5rem; }
    
    .icon-container-lg {
        height: 3.75rem;
        width: 3.75rem;
    }
    
    .icon-lg { font-size: 2rem; }
}
```

### **10. `css/utilities/responsive.css`** (300 líneas)
```css
/* Media queries centralizadas */

/* Tablet (768px - 1024px) */
@media (max-width: 82rem) and (min-width: 53.0625rem) {
    /* Container */
    .container {
        padding: 0 1.5rem;
    }
    
    /* Typography */
    .section-title {
        font-size: clamp(2rem, 4vw, 3rem);
    }
    
    /* Cards tablet */
    .card-base {
        padding: 1.5rem;
    }
}

/* Mobile (hasta 767px) */
@media (max-width: 53rem) {
    /* Container */
    .container {
        padding: 0 1rem;
    }
    
    /* Typography */
    .section-title {
        font-size: clamp(1.8rem, 6vw, 2.5rem);
    }
    
    /* Hero mobile */
    .hero-content h1 {
        font-size: 3rem;
    }
    
    /* Cards mobile */
    .card-base {
        padding: 1.5rem;
    }
}

/* Utilities responsive */
.hide-mobile {
    @media (max-width: 53rem) {
        display: none !important;
    }
}

.hide-tablet {
    @media (max-width: 82rem) and (min-width: 53.0625rem) {
        display: none !important;
    }
}

.hide-desktop {
    @media (min-width: 82rem) {
        display: none !important;
    }
}
```

### **11. `css/global.css` - ORQUESTADOR** (50 líneas)
```css
/* ======================================
   GLOBAL.CSS - ORQUESTADOR PRINCIPAL
   ====================================== */

/* Core - Fundamentales */
@import url('./core/variables.css');
@import url('./core/fonts.css');
@import url('./core/reset.css');
@import url('./core/animations.css');

/* Layout - Estructura */
@import url('./layout/header.css');
@import url('./layout/sections.css');
@import url('./layout/footer.css');
@import url('./layout/backgrounds.css');

/* Components - Componentes */
@import url('./components/cards.css');
@import url('./components/grids.css');
@import url('./components/icons.css');
@import url('./components/buttons.css');

/* Utilities - Utilidades */
@import url('./utilities/responsive.css');
@import url('./utilities/helpers.css');

/* Global utilities */
.text-center { text-align: center; }
.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: 1rem; }
.mb-2 { margin-bottom: 2rem; }
.mb-3 { margin-bottom: 3rem; }

/* Debug (solo en desarrollo) */
.debug * {
    outline: 1px solid red;
}
```

---

## 🚀 **VENTAJAS DE LA NUEVA ESTRUCTURA**

### **📊 TAMAÑOS DE ARCHIVOS:**
```
global.css:        50 líneas (orquestador)
variables.css:     50 líneas
fonts.css:        120 líneas
reset.css:         80 líneas
animations.css:   100 líneas
header.css:       200 líneas
sections.css:     250 líneas
footer.css:       150 líneas
backgrounds.css:   80 líneas
cards.css:        400 líneas
grids.css:        150 líneas
icons.css:        200 líneas
buttons.css:      100 líneas
responsive.css:   300 líneas
helpers.css:       50 líneas
-------------------------
TOTAL:          2,280 líneas (vs 2,089 actual)
```

### **⚡ BENEFICIOS:**

1. **📁 Organización Clara**
   - Cada archivo tiene una responsabilidad específica
   - Fácil localizar y editar componentes

2. **🔄 Mantenimiento Simplificado**
   - Cambios en cards solo afectan `cards.css`
   - Nuevos breakpoints solo en `responsive.css`

3. **👥 Trabajo en Equipo**
   - Diferentes personas pueden trabajar módulos diferentes
   - Menos conflictos en Git

4. **🎯 Debugging Mejorado**
   - Problemas fáciles de localizar por módulo
   - DevTools muestran archivo específico

5. **📦 Carga Optimizada** (futuro)
   - Posibilidad de cargar solo módulos necesarios
   - Critical CSS más eficiente

6. **🔧 Escalabilidad**
   - Fácil agregar nuevos componentes
   - Sistema preparado para más páginas

---

## 🎯 **PLAN DE IMPLEMENTACIÓN**

### **FASE 1: Crear Estructura (1 hora)**
1. ✅ Crear carpetas `/core`, `/layout`, `/components`, `/utilities`
2. ✅ Dividir `global.css` actual en módulos específicos
3. ✅ Crear `global.css` orquestador con @imports

### **FASE 2: Actualizar Referencias (30 min)**
1. ✅ Verificar que todos los HTMLs siguen cargando `global.css`
2. ✅ Testing que @imports funcionan correctamente
3. ✅ Validar que no se rompe nada

### **FASE 3: Optimización (30 min)**
1. ✅ Limpiar duplicados entre módulos
2. ✅ Optimizar orden de @imports para performance
3. ✅ Documentar cada módulo

---

**¿Te parece buena esta estructura modular? ¿Quieres que empecemos implementándola paso a paso?**

La ventaja es que mantenemos el **mismo funcionamiento actual** pero con **organización mucho mejor** y **mantenimiento más fácil**.