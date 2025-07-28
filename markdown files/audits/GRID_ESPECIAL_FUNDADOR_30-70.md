# NUEVO GRID ESPECIAL FUNDADOR 30/70

## 📝 Sistema Implementado

### **Grid Profile 30/70 - Diseño Personalizado**

#### **Estructura HTML:**
```html
<div class="grid-profile-30-70 fade-in">
    <!-- Imagen del perfil (30%) -->
    <div class="profile-image-container">
        <img src="..." alt="..." style="...">
    </div>
    
    <!-- Contenido completo (70%) -->
    <div class="profile-content-container">
        <!-- Información del perfil -->
        <div class="profile-info">
            <h1>...</h1>
            <h2>...</h2>
            <p>...</p>
        </div>
        
        <!-- Botones de contacto usando grid global 3-1-1 -->
        <div class="grid-3-1-1">
            <!-- Botones de contacto -->
        </div>
    </div>
</div>
```

#### **CSS Implementado en `css/components/grids.css`:**

##### **Desktop (por defecto):**
```css
.grid-profile-30-70 {
    display: grid;
    grid-template-columns: 30% 70%;
    gap: var(--gap-large);
    align-items: start;
}

.profile-image-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
}

.profile-content-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.profile-info {
    margin-bottom: 0;
}
```

##### **Tablet (max-width: 82rem - 1312px):**
```css
.grid-profile-30-70 {
    grid-template-columns: 1fr 1fr !important; /* 50/50 */
    gap: var(--gap-medium);
}
```

##### **Mobile (max-width: 53rem - 848px):**
```css
.grid-profile-30-70 {
    grid-template-columns: 1fr !important; /* 1 columna */
    gap: var(--gap-standard);
    text-align: center;
}

.profile-image-container {
    order: -1; /* Imagen primero en mobile */
    margin-bottom: 1rem;
}

.profile-content-container {
    gap: 1.5rem;
}
```

## 🎯 Comportamiento Responsive

### **✅ Desktop (>1312px):**
- **Layout**: 30% imagen | 70% contenido
- **Imagen**: Centrada verticalmente en su columna
- **Contenido**: Texto + botones en grid 3-1-1
- **Gap**: `var(--gap-large)` entre columnas

### **✅ Tablet (848px - 1312px):**
- **Layout**: 50% imagen | 50% contenido
- **Mantiene**: Estructura de 2 columnas
- **Gap**: `var(--gap-medium)` entre columnas
- **Botones**: Se convierten a 1 columna (grid 3-1-1 → 1-1-1)

### **✅ Mobile (<848px):**
- **Layout**: 1 columna vertical
- **Orden**: Imagen arriba, contenido abajo
- **Alineación**: Centrada
- **Gap**: `var(--gap-standard)` entre elementos
- **Botones**: 1 columna vertical

## 📱 Ventajas del Sistema

### **🎨 Visual:**
- **Proporción óptima**: 30/70 aprovecha mejor el espacio del contenido
- **Balance visual**: La imagen no compite con el contenido importante
- **Jerarquía clara**: El texto y botones tienen protagonismo

### **📱 Responsive:**
- **Adaptabilidad**: Funciona perfectamente en todos los dispositivos
- **Usabilidad móvil**: Imagen primero, luego contenido (orden lógico)
- **Consistencia**: Mantiene la filosofía 2-1-1 del sistema global

### **🔧 Técnico:**
- **Modular**: Separado en componente reutilizable
- **Flexible**: Utiliza variables CSS para gaps consistentes
- **Mantenible**: CSS organizado en grids.css

## 🗂️ Archivos Modificados

### **✅ HTML:**
- `fundador.html` - Implementación del nuevo grid

### **✅ CSS:**
- `css/components/grids.css` - Definición del grid profile 30-70
- Responsive breakpoints añadidos para tablet y mobile

## 💡 Uso Futuro

Este grid puede reutilizarse para:
- **Perfiles de equipo**: Donde se necesite destacar más el contenido que la imagen
- **Secciones de autor**: En blogs o páginas de contenido
- **Cards de presentación**: Donde el texto sea más importante que la imagen

## ✅ Resultado Final

El nuevo sistema cumple perfectamente con los requisitos:
- ✅ **30% imagen / 70% contenido** en desktop
- ✅ **Responsive 2-1-1** (2 columnas → 1 columna → 1 columna)
- ✅ **Integración perfecta** con el sistema de grids existente
- ✅ **Botones de contacto** en grid 3-1-1 dentro del contenido
