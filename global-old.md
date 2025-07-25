/* Variables CSS */
:root {
    --primary: #41B6E6;
    --accent: #F4DA40;
    --dark: #101820;
    --danger: #EF3340;
    --primary-dark: #165C7D;
    --light: #FFFFFF;
    --gray-100: #F8F9FA;
    --gray-200: #E9ECEF;
    --title-letter-spacing: 0.2rem;
}

@font-face {
    font-family: 'Material Symbols Rounded';
    font-style: normal;
    font-weight: 100 700;
    font-display: block;
    src: url('../media/fonts/material-symbols/MaterialSymbolsRounded.woff2') format('woff2');
}

.material-symbols-rounded {
    font-family: 'Material Symbols Rounded', sans-serif;
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    /* ... resto del CSS existente ... */
}

/* DM Serif Text */
@font-face {
    font-family: 'DM Serif Text';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('../media/fonts/dm-serif-text/DMSerifText-Regular.ttf') format('truetype');
}

@font-face {
    font-family: 'DM Serif Text';
    font-style: italic;
    font-weight: 400;
    font-display: swap;
    src: url('../media/fonts/dm-serif-text/DMSerifText-Italic.ttf') format('truetype');
}

/* Raleway Variable - Solo 2 archivos */
@font-face {
    font-family: 'Raleway';
    font-style: normal;
    font-weight: 100 900;  /* Rango completo */
    font-display: swap;
    src: url('../media/fonts/raleway/variable/Raleway-Variable.ttf') format('truetype');
}

@font-face {
    font-family: 'Raleway';
    font-style: italic;
    font-weight: 100 900;  /* Rango completo */
    font-display: swap;
    src: url('../media/fonts/raleway/variable/Raleway-VariableItalic.ttf') format('truetype');
}

/* Reset y Base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Raleway', sans-serif;
    line-height: 1.6;
    color: var(--dark);
    overflow-x: hidden;
}

/* Main content container */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 1;
}

/* Header */
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

.header.scrolled {
    padding: 1rem 0;
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

html {
    scroll-padding-top: 6px;
    scroll-behavior: smooth;
}

#scroll-progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    z-index: 9999;
    pointer-events: none;
}

#scroll-progress-bar > div {
    height: 100%;
    transform-origin: left center;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-family: 'DM Serif Text', serif;
    font-size: 1.8rem;
    font-weight: 800;
    color: var(--primary);
    text-decoration: none;
    transition: transform 0.3s ease;
    display: flex;
    align-items: center;
}

.logo img {
    height: 1.8rem;
    width: auto;
}

.logo:hover {
    transform: scale(1.05);
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-link {
    text-decoration: none;
    color: var(--dark);
    font-weight: 500;
    position: relative;
    transition: color 0.3s ease;
}

.nav-link:hover, .nav-link.active {
    color: var(--primary);
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--accent);
    transform: scaleX(0);
    transition: transform 0.3s ease;
}

.nav-link:hover::after {
    transform: scaleX(1);
}

.nav-link.active::after {
    transform: scaleX(1);
    transition: none;
}

.nav-link.active {
    color: var(--primary);
}

/* Hero Section - GLOBAL */
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

.hero-content h1 {
    font-family: 'DM Serif Text', serif;
    font-size: clamp(3rem, 8vw, 6rem);
    margin-bottom: 1rem;
    letter-spacing: var(--title-letter-spacing);
    animation: fadeInUp 1s ease;
}

.hero-content p {
    font-size: clamp(1.1rem, 3vw, 1.5rem);
    font-style: italic;
    max-width: 800px;
    animation: fadeInUp 1s ease 0.3s both;
}

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

/* Sections - UNIVERSAL */
.section {
    padding: 5rem 0;
}

.section-title {
    font-family: 'DM Serif Text', serif;
    font-size: clamp(2.5rem, 5vw, 4rem);
    text-align: center;
    margin-bottom: 2rem; /* Espacio consistente con la línea amarilla */
    color: var(--primary-dark);
    line-height: 1;
    letter-spacing: var(--title-letter-spacing);
}

/* CORREGIDO - Línea amarilla universal */
.section-subtitle {
    display: block;
    height: 4px;
    margin: 0 auto 3rem auto; /* Centrado y espacio inferior consistente */
    width: 120px;
    background: var(--accent);
    position: relative;
}

/* Background wrappers - GLOBAL */
.background-wrapper-primary,
.background-wrapper-secondary {
    position: relative;
    overflow: hidden;
}

/* Background images - BASE (sin imágenes específicas) */
.mountain-background {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 3264px;
    height: 4896px;
    background-size: cover;
    background-position: center top;
    background-repeat: no-repeat;
    z-index: -1;
    will-change: transform;
}

.secondary-background {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 3264px;
    height: 4896px;
    background-size: cover;
    background-position: center top;
    background-repeat: no-repeat;
    z-index: -1;
    will-change: transform;
}

/* Common card styles - UNIVERSAL */
.about-card,
.mvp-card,
.stat-card,
.program-card,
.value-card,
.sede-card,
.quote-card,
.proceso-card-full {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

/* Textos generales - UNIVERSAL */
.section p {
    font-size: 1.15rem;
    line-height: 1.7;
}

.about-card p {
    font-size: 1.15rem;
    line-height: 1.7;
    text-align: justify;
}

/* Card Grids - UNIVERSAL */
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

.card-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 0;
    padding: 0 2rem 2rem 2rem;
}

/* Program Section - UNIVERSAL */
.program {
    background: white;
    color: var(--dark);
}

.program .section-title {
    color: var(--primary-dark);
}

.program-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 0;
    padding: 0 2rem 2rem 2rem;
}

.program-card {
    background: 
        linear-gradient(white, white) padding-box,
        linear-gradient(135deg, #A9D9F3 0%, #FDEBA4 100%) border-box;
    border: 9px solid transparent;
    padding: 2rem;
    text-align: center;
    position: relative;
}

.program-card h3 {
    color: var(--primary-dark);
    font-weight: 700;
    margin-bottom: 1rem;
    position: relative;
    z-index: 1;
}

.program-card p {
    position: relative;
    z-index: 1;
    font-size: 1.05rem;
    line-height: 1.6;
}

/* MATERIAL SYMBOLS - UNIVERSAL */
.material-symbols-rounded {
    font-family: 'Material Symbols Rounded';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    font-variation-settings: 
        'FILL' 0, 
        'wght' 400, 
        'GRAD' 0, 
        'opsz' 48;
    -webkit-font-feature-settings: 'liga';
    -moz-font-feature-settings: 'liga';
    font-feature-settings: 'liga';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: all 0.3s ease;
}

/* Icon sizes - UNIVERSAL */
.main-icon {
    font-size: 6rem;
}

.secondary-icon {
    font-size: 4.5rem;
}

.process-icon {
    font-size: 4rem;
    color: white;
}

.footer-icon {
    font-size: 1.2rem;
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.meta-icon {
    font-size: 1rem;
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Icon containers - UNIVERSAL */
.main-icon-container {
    height: 10rem;
    width: 10rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    margin: 0 auto;
}

.secondary-icon-container {
    height: 7.5rem;
    width: 7.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    margin: 0 auto;
}

.process-icon-container,
.process-step-icon {
    flex: 0 0 auto;
    width: 7.5rem;
    height: 7.5rem;
    background: var(--primary);
    border-radius: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0.375rem 1.125rem rgba(65, 182, 230, 0.3);
    transition: all 0.3s ease;
}

/* Icon positioning in cards - UNIVERSAL */
.program-icon {
    margin-bottom: 1.5rem;
    position: relative;
    z-index: 1;
}

.program-icon .material-symbols-rounded {
    color: var(--primary-dark);
}

.value-icon {
    margin-bottom: 2rem;
}

.value-icon .secondary-icon {
    color: var(--primary);
}

.sede-icon {
    margin-bottom: 2rem;
}

.sede-icon .material-symbols-rounded {
    color: var(--accent);
}

.process-step-icon .material-symbols-rounded {
    font-size: 4rem;
    color: white;
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
}

/* Methodology Section - UNIVERSAL */
.methodology {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
}

.methodology .section-title {
    color: white;
}

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

.quote-text {
    font-style: italic;
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 1rem;
    line-height: 1.6;
    position: relative;
    z-index: 2;
}

.quote-text::before,
.quote-text::after {
    content: '"';
    font-family: 'DM Serif Text', serif;
    font-size: 5rem;
    color: var(--accent);
    position: absolute;
    opacity: 0.9;
    font-weight: 400;
    line-height: 1;
    z-index: 1;
    font-style: normal;
}

.quote-text::before {
    content: '"';
    top: -1rem;
    left: -1.5rem;
    transform: rotate(-10deg);
}

.quote-text::after {
    content: '"';
    bottom: -2rem;
    right: -1.5rem;
    transform: rotate(10deg);
}

.quote-author {
    color: var(--accent);
    font-weight: 600;
    font-size: 1.1rem;
    position: relative;
    z-index: 2;
}

/* Values Section - UNIVERSAL */
.values-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 0;
    padding: 0 2rem 2rem 2rem;
}

.value-card {
    padding: 1.5rem;
    text-align: center;
    min-height: 180px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.value-card h3 {
    color: var(--primary-dark);
    font-weight: 600;
    margin-bottom: 1rem;
    text-align: center;
    line-height: 1.3;
    font-size: 1rem;
    hyphens: auto;
    word-wrap: break-word;
}

/* Process Section - UNIVERSAL */
.process-cards-horizontal {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 0;
    padding: 0 2rem 2rem 2rem;
}

.proceso-card-full {
    padding: 2.5rem;
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 2rem;
}

.card-content {
    flex: 1;
    text-align: left;
}

.card-content h3 {
    font-family: 'Raleway', sans-serif;
    font-size: 1.6rem;
    color: var(--primary-dark);
    margin-bottom: 1.5rem;
    font-weight: 600;
}

.card-content p {
    color: var(--dark);
    line-height: 1.7;
    margin-bottom: 1.5rem;
    text-align: justify;
    font-size: 1.1rem;
}

.card-meta {
    display: flex;
    gap: 2rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 0.0625rem solid var(--gray-100);
    font-size: 0.95rem;
    color: var(--primary);
    font-weight: 600;
    flex-wrap: wrap;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.meta-item .meta-icon {
    color: var(--primary);
}

.testimonios-link {
    color: var(--primary);
    text-decoration: none;
    position: relative;
    transition: color 0.3s ease;
}

.testimonios-link::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--accent);
    transform: scaleX(0);
    transition: transform 0.3s ease;
}

.testimonios-link:hover::after {
    transform: scaleX(1);
}

/* Sede Section - UNIVERSAL */
.sede {
    background: linear-gradient(135deg, var(--primary-dark) 0%, #326A8B 100%);
    color: white;
}

.sede .section-title {
    color: white;
}

.sede-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 0;
    padding: 0 2rem 2rem 2rem;
}

.sede-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 2rem;
    text-align: center;
    transition: all 0.3s ease;
}

.sede-card h3 {
    color: var(--accent);
    font-weight: 700;
    margin-bottom: 1rem;
}

.sede-card p {
    font-size: 1.05rem;
    line-height: 1.6;
}

/* CTA Section - UNIVERSAL */
.cta {
    background-position: center center;
    color: white;
    text-align: center;
    padding: 5rem 0;
}

.cta h2 {
    font-family: 'DM Serif Text', serif;
    font-size: clamp(2.5rem, 5vw, 4rem);
    margin-bottom: 1rem;
    letter-spacing: var(--title-letter-spacing);
}

.cta-button {
    background: var(--dark);
    color: var(--accent);
    padding: 1rem 2rem;
    border: none;
    border-radius: 3.125rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 2rem;
    text-decoration: none;
    display: inline-block;
}

.cta-button:hover {
    background: var(--accent);
    color: var(--dark);
    transform: translateY(-0.125rem);
    box-shadow: 0 0.625rem 1.25rem rgba(0, 0, 0, 0.2);
}

/* Footer - UNIVERSAL */
.footer {
    background: var(--dark);
    color: white;
    padding: 3rem 0 1rem;
}

.footer-grid {
    display: grid;
    grid-template-columns: 2fr 2fr 1.2fr;
    gap: 2rem;
    margin-bottom: 2rem;
}

.footer-section h3 {
    color: var(--accent);
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

.contact-item {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
    padding: 0.3rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    text-decoration: none;
}

.contact-item .material-symbols-rounded {
    font-size: 1.2rem;
    color: var(--accent);
    margin-top: 0.2rem;
    flex-shrink: 0;
    transition: all 0.3s ease;
}

.contact-item .instagram-icon {
    width: 1.2rem;
    height: 1.2rem;
    margin-top: 0.2rem;
    flex-shrink: 0;
    transition: all 0.3s ease;
}

.contact-item:hover {
    background: rgba(244, 218, 64, 0.1);
    transform: translateX(5px);
}

.contact-item:hover .material-symbols-rounded {
    color: var(--primary);
    transform: scale(1.1);
}

.contact-item:hover .instagram-icon {
    filter: brightness(0) saturate(100%) invert(45%) sepia(93%) saturate(2206%) hue-rotate(180deg) brightness(96%) contrast(95%);
    transform: scale(1.1);
}

.contact-item span {
    color: white;
    transition: color 0.3s ease;
}

.contact-item:hover span {
    color: var(--accent);
}

.footer-nav-link {
    color: white;
    text-decoration: none;
    transition: all 0.3s ease;
    display: inline-block;
    position: relative;
    padding: 0.3rem;
    border-radius: 0.5rem;
    margin-bottom: 0.25rem;
    width: 100%;
    text-align: left;
}

.footer-nav-link:hover {
    color: var(--accent);
    background: rgba(244, 218, 64, 0.1);
    transform: translateX(0.3125rem);
    padding-left: 0.5rem;
}

.footer-bottom {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid #333;
    color: #888;
}

.footer-author {
    color: var(--accent);
    margin-top: 0.5rem;
    text-decoration: none;
    transition: color 0.3s ease;
}

.footer-author:hover {
    color: var(--primary);
}

/* Intersection Observer animations - UNIVERSAL */
.fade-in {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
}

.fade-in.visible {
    opacity: 1;
    transform: translateY(0);
}

/* Responsive styles - UNIVERSAL */
@media (max-width: 82rem) and (min-width: 53.0625rem) {
    .card-grid-4 {
        grid-template-columns: repeat(2, 1fr) !important;
    }
    
    .card-grid-2 {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .card-grid-3 {
        grid-template-columns: repeat(3, 1fr);
    }
    
    .value-card {
        min-height: 10rem;
        padding: 1.2rem;
    }
    
    .value-card h3 {
        font-size: 0.95rem;
    }
    
    .main-icon-container {
        height: 8.75rem;
        width: 8.75rem;
    }
    
    .main-icon {
        font-size: 5rem;
    }
    
    .secondary-icon-container {
        height: 6.25rem;
        width: 6.25rem;
    }
    
    .secondary-icon {
        font-size: 3.5rem;
    }
    
    .process-step-icon {
        width: 6.25rem;
        height: 6.25rem;
    }
    
    .process-step-icon .material-symbols-rounded {
        font-size: 3.5rem;
    }
}

@media (max-width: 53rem) {
    .nav-menu {
        display: none;
    }
    
    .hero-content h1 {
        font-size: 3rem;
    }
    
    .section {
        padding: 3rem 0;
    }
    
    .container {
        padding: 0 1rem;
    }
    
    .card-grid-4,
    .card-grid-2,
    .card-grid-3,
    .values-grid {
        grid-template-columns: 1fr !important;
        padding: 0 1rem 2rem 1rem;
    }
    
    .value-card {
        min-height: 8.75rem;
        padding: 1.2rem;
    }
    
    .value-card h3 {
        font-size: 0.95rem;
        margin-bottom: 0.5rem;
    }
    
    .main-icon-container {
        height: 5rem;
        width: 5rem;
    }
    
    .main-icon {
        font-size: 2.5rem;
    }
    
    .secondary-icon-container {
        height: 3.75rem;
        width: 3.75rem;
    }
    
    .secondary-icon {
        font-size: 2rem;
    }
    
    .proceso-card-full {
        padding: 2rem;
        flex-direction: column;
        text-align: center;
        gap: 1.5rem;
    }
    
    .process-step-icon {
        width: 3.75rem;
        height: 3.75rem;
        margin: 0 auto;
    }
    
    .process-step-icon .material-symbols-rounded {
        font-size: 1.8rem;
    }
    
    .card-content {
        text-align: center;
    }
    
    .card-content h3 {
        text-align: center;
        font-size: 1.4rem;
    }
    
    .card-content p {
        text-align: center;
    }
    
    .card-meta {
        justify-content: center;
        flex-direction: column;
        text-align: center;
    }
    
    .process-cards-horizontal {
        padding: 0 1rem 2rem 1rem;
    }
    
    .footer-grid {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 3rem;
    }
    
    .footer-section {
        text-align: center;
    }
    
    /* CORREGIDO - Contact items centrados en mobile */
    .contact-item {
        justify-content: center;
    }
    
    .footer-nav-link {
        text-align: center;
        justify-content: center;
    }
    
    .footer-nav-link:hover {
        transform: translateX(0);
        padding-left: 0.3rem;
    }
    
    .mountain-background,
    .secondary-background {
        width: 100vw;
        height: 150vh;
        background-size: cover;
        background-position: center top;
    }
}