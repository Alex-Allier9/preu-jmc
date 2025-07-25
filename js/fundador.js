/* ======================================
   FUNDADOR.JS - FUNCIONALIDADES ESPECÍFICAS DE LA PÁGINA
   ====================================== */

// Gallery Lightbox functionality
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length === 0) return;
    
    // Create lightbox element
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="close-lightbox">&times;</span>
            <img src="" alt="" class="lightbox-img">
            <div class="lightbox-caption">
                <h4 class="lightbox-title"></h4>
                <p class="lightbox-description"></p>
            </div>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    // Lightbox styles
    const lightboxStyles = `
        <style>
        .lightbox {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(5px);
            justify-content: center;
            align-items: center;
        }
        
        .lightbox-content {
            position: relative;
            margin: auto;
            padding: 20px;
            width: 90%;
            max-width: 800px;
            text-align: center;
        }
        
        .lightbox-img {
            max-width: 100%;
            max-height: 70vh;
            object-fit: contain;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        
        .close-lightbox {
            position: absolute;
            top: -10px;
            right: 10px;
            color: white;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
            z-index: 10001;
            transition: color 0.3s ease;
        }
        
        .close-lightbox:hover {
            color: var(--amarillo);
        }
        
        .lightbox-caption {
            text-align: center;
            color: white;
            margin-top: 20px;
        }
        
        .lightbox-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 10px;
            color: var(--amarillo);
        }
        
        .lightbox-description {
            font-size: 1rem;
            opacity: 0.9;
            line-height: 1.6;
        }
        
        @media (max-width: 768px) {
            .lightbox-content {
                padding: 10px;
            }
            
            .close-lightbox {
                font-size: 30px;
            }
            
            .lightbox-img {
                max-height: 60vh;
            }
        }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', lightboxStyles);
    
    // Function to open lightbox
    function openLightbox(item) {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.gallery-overlay');
        
        lightbox.querySelector('.lightbox-img').src = img.src;
        lightbox.querySelector('.lightbox-img').alt = img.alt;
        
        if (overlay) {
            lightbox.querySelector('.lightbox-title').textContent = overlay.querySelector('h4').textContent;
            lightbox.querySelector('.lightbox-description').textContent = overlay.querySelector('p').textContent;
        }
        
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Function to close lightbox
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Add click listeners to gallery items
    galleryItems.forEach((item) => {
        item.addEventListener('click', () => openLightbox(item));
    });
    
    // Lightbox controls
    lightbox.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
    
    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });
}

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Fundador page initialized');
    
    // Initialize gallery lightbox
    initGalleryLightbox();
    
    // Log success
    console.log('Fundador page: All functionality loaded successfully');
});