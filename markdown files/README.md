# Preuniversitario JMC - Sitio Web Oficial

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/your-site-name/deploys)

Sitio web oficial del Preuniversitario José Manuel Cartes, especializado en preparación para la PAES (Prueba de Acceso a la Educación Superior) en Chile.

## 🚀 Características

- **Diseño Responsivo**: Optimizado para desktop, tablet y móvil
- **SEO Optimizado**: Meta tags, Open Graph y Schema.org
- **Performance**: Imágenes optimizadas y código minificado
- **Accesibilidad**: Cumple estándares WCAG 2.1
- **PWA Ready**: Manifiesto web y service worker

## 🛠️ Tecnologías

- HTML5 semántico
- CSS3 con variables personalizadas
- JavaScript vanilla ES6+
- Material Symbols para iconografía
- Google Fonts (Raleway, DM Serif Text)

## 📁 Estructura del Proyecto

```
preu-jmc/
├── css/
│   ├── components/     # Componentes reutilizables
│   ├── core/          # Reset, variables, fuentes
│   ├── layout/        # Header, footer, backgrounds
│   └── utilities/     # Helpers y responsive
├── js/
│   ├── gallery-system/ # Sistema de galerías
│   └── *.js           # Scripts por página
├── media/
│   ├── images/        # Imágenes por página
│   ├── logos/         # Logotipos
│   ├── icons/         # Iconos personalizados
│   └── fonts/         # Fuentes locales
└── *.html             # Páginas principales
```

## 🌐 Hosting y Deployment

### Hosting Principal: Cloudflare Pages
- **URL**: https://preujmc.pages.dev
- **Build Command**: `npm run build` (si aplica)
- **Deploy Branch**: `main`

### Hosting Backup: Netlify
- **URL**: https://preujmc.netlify.app
- **Build Command**: `npm run build` (si aplica)
- **Deploy Branch**: `main`

## 📊 SEO y Analytics

- Meta tags optimizados por página
- Open Graph para redes sociales
- Schema.org para rich snippets
- Sitemap XML automático
- Google Analytics integrado

## 🔧 Configuración Local

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/preu-jmc.git
cd preu-jmc
```

2. Inicia un servidor local:
```bash
# Python
python -m http.server 8000

# Node.js (con serve)
npx serve .

# Live Server (VS Code)
# Usa la extensión Live Server
```

3. Abre http://localhost:8000

## 📈 Performance

- **Lighthouse Score**: 95+ en todas las métricas
- **Core Web Vitals**: Optimizado
- **Compresión**: GZIP/Brotli habilitado
- **Caché**: Headers optimizados

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Alexandre Castillo** - [ACastillo DG](https://www.behance.net/acastillo_dg)

## 📞 Contacto

- **Email**: jcartes@preujmc.cl
- **Instagram**: [@josemanuelcartes](https://instagram.com/josemanuelcartes)
- **Ubicación**: Mateo de Toro y Zambrano 1491, Of. 303, La Reina, Santiago
