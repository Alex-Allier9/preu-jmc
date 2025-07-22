# 📄 Página 404 - Preuniversitario JMC

Una página de error 404 elegante y funcional que mantiene la estética del sitio web y proporciona una experiencia de usuario positiva incluso cuando algo sale mal.

## 🎨 Características

### Diseño Visual
- **Imagen de fondo**: Paisaje montañoso inspirador con filtro amarillo semitransparente
- **Tipografía impactante**: Número "404" en DM Serif Text de gran tamaño
- **Mensaje claro**: Texto explicativo en Raleway Medium Italic
- **Botón de acción**: Botón prominent para regresar al inicio
- **Responsive**: Adaptable a todos los dispositivos

### Funcionalidades
- **Animaciones suaves**: Efectos fade-in y animaciones especiales
- **Efecto glitch sutil**: El número 404 tiene micro-animaciones aleatorias
- **Botón interactivo**: Efecto ripple al hacer clic
- **Sugerencias inteligentes**: Detecta URLs similares y sugiere páginas alternativas
- **SEO amigable**: Headers y metadatos optimizados
- **Analytics**: Tracking de errores 404 (si está configurado)

## 📁 Archivos Incluidos

```
├── 404.html              # Página principal de error
├── css/404.css           # Estilos específicos
├── js/404.js             # Funcionalidades JavaScript
├── .htaccess             # Configuración Apache
└── nginx.conf            # Configuración Nginx
```

## 🚀 Implementación

### 1. Archivos Principales

#### HTML (404.html)
- Estructura semántica HTML5
- Integración con estilos globales
- Meta tags optimizados para SEO
- Links a archivos CSS y JS específicos

#### CSS (css/404.css)
- Diseño responsive con breakpoints 82rem y 53rem
- Animaciones CSS personalizadas
- Efectos visuales avanzados
- Optimizaciones para performance

#### JavaScript (js/404.js)
- Efectos interactivos
- Detección inteligente de URLs
- Integración con analytics
- Mejoras de UX

### 2. Configuración del Servidor

#### Apache (.htaccess)
```apache
ErrorDocument 404 /404.html
```

#### Nginx (nginx.conf)
```nginx
error_page 404 /404.html;
location = /404.html {
    internal;
}
```

### 3. Imagen de Fondo
Asegúrate de tener la imagen en la ruta correcta:
```
/media/images/404/daniel-hohe-1VgmgXW3Yuk-unsplash.jpg
```

## 🛠️ Configuración

### Paso 1: Subir Archivos
1. Sube `404.html` a la raíz de tu sitio web
2. Sube `404.css` a la carpeta `css/`
3. Sube `404.js` a la carpeta `js/`
4. Sube la imagen de fondo a `/media/images/404/`

### Paso 2: Configurar Servidor

#### Para Apache:
1. Crea o edita el archivo `.htaccess` en la raíz
2. Añade: `ErrorDocument 404 /404.html`

#### Para Nginx:
1. Edita tu configuración de servidor
2. Añade las líneas de configuración proporcionadas
3. Reinicia Nginx: `sudo systemctl reload nginx`

### Paso 3: Verificar Funcionamiento
1. Visita una URL inexistente: `tu-sitio.com/pagina-inexistente`
2. Deberías ver la página 404 personalizada
3. Verifica que todos los enlaces funcionen
4. Testa en diferentes dispositivos

## 🎯 Características Técnicas

### Responsive Design
- **Desktop**: Diseño completo con todos los efectos
- **Tablet (82rem - 53rem)**: Adaptación de tamaños y espaciado
- **Mobile (< 53rem)**: Optimización para pantallas pequeñas

### Performance
- **Lazy loading**: Carga optimizada de recursos
- **Compresión**: Archivos CSS y JS minificables
- **Cache**: Headers de cache configurados
- **Prefetch**: Precarga de páginas principales

### SEO
- **Meta tags**: Título y descripción optimizados
- **Canonical**: Evita duplicación de contenido
- **Structured data**: Markup para motores de búsqueda

### Accessibility
- **Semantic HTML**: Estructura accesible
- **Alt text**: Descripciones de imágenes
- **Keyboard navigation**: Navegación por teclado
- **Screen readers**: Compatible con lectores de pantalla

## 🔧 Personalización

### Cambiar Imagen de Fondo
Edita en `404.css`:
```css
.error-404 {
    background: linear-gradient(rgba(243, 217, 66, 0.3), rgba(243, 217, 66, 0.3)),
        url('/tu-nueva-imagen.jpg') center/cover;
}
```

### Modificar Colores
Utiliza las variables CSS globales:
```css
--azul-principal: #41B6E6;
--amarillo: #F4DA40;
--negro: #101820;
```

### Añadir Más Sugerencias
En `404.js`, edita el objeto `suggestions`:
```javascript
const suggestions = {
    'nueva-palabra': 'pagina-destino.html',
    'otro-termino': 'otra-pagina.html'
};
```

## 📊 Analytics

### Google Analytics
El código incluye tracking automático de errores 404:
```javascript
gtag('event', 'page_view', {
    page_title: '404 Error',
    page_location: window.location.href,
    custom_parameter: '404_error'
});
```

### Monitoreo
- **Console logs**: Para debugging en desarrollo
- **Error tracking**: Registro de URLs problemáticas
- **User behavior**: Seguimiento de interacciones

## 🐛 Resolución de Problemas

### La página 404 no aparece
1. Verifica la configuración del servidor
2. Comprueba que el archivo esté en la ruta correcta
3. Revisa los permisos de archivo
4. Verifica la sintaxis del archivo de configuración

### Estilos no cargan
1. Comprueba las rutas de CSS en el HTML
2. Verifica que `global.css` esté disponible
3. Revisa la configuración de cache del servidor

### JavaScript no funciona
1. Comprueba la consola del navegador para errores
2. Verifica que `global.js` esté cargado primero
3. Asegúrate de que las rutas sean correctas

## 📈 Mejoras Futuras

### Posibles Funcionalidades
- **Búsqueda inline**: Campo de búsqueda en la página 404
- **Páginas populares**: Lista de contenido más visitado
- **Chatbot**: Asistente automático para ayudar a los usuarios
- **A/B Testing**: Diferentes versiones de la página

### Optimizaciones
- **Service Worker**: Cache offline de la página 404
- **Progressive Web App**: Funcionalidad PWA
- **WebP images**: Formato de imagen más eficiente

## 📞 Soporte

Para problemas técnicos o preguntas sobre la implementación:
- **Documentación**: Revisa este README
- **Logs**: Consulta los logs del servidor
- **Testing**: Usa las herramientas de desarrollo del navegador

---

**© 2025 Preuniversitario JMC - Desarrollado por Alexandre Castillo**