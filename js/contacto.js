// ======================================
// CONTACTO.JS - FUNCIONALIDAD DE LA PÁGINA DE CONTACTO
// ======================================

class ContactManager {
    constructor() {
        this.form = null;
        this.submitButton = null;
        this.isSubmitting = false;
        this.originalButtonText = '';
    }

    init() {
        console.log('📞 Inicializando página de contacto...');
        
        // Configurar formulario
        this.setupContactForm();
        
        // Configurar animaciones con Intersection Observer (heredado del sistema global)
        this.setupAnimations();
        
        console.log('✅ Página de contacto inicializada');
    }

    setupContactForm() {
        this.form = document.getElementById('contactForm');
        if (!this.form) {
            console.warn('⚠️ Formulario de contacto no encontrado');
            return;
        }

        this.submitButton = this.form.querySelector('button[type="submit"]');
        if (this.submitButton) {
            this.originalButtonText = this.submitButton.innerHTML;
        }

        // Event listener para el envío del formulario
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Validación en tiempo real
        this.setupRealTimeValidation();

        console.log('📝 Formulario de contacto configurado');
    }

    setupRealTimeValidation() {
        const requiredFields = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });

        // Validación específica para email
        const emailField = this.form.querySelector('input[type="email"]');
        if (emailField) {
            emailField.addEventListener('blur', () => this.validateEmail(emailField));
        }
    }

    validateField(field) {
        const value = field.value.trim();
        
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'Este campo es obligatorio');
            return false;
        }
        
        return true;
    }

    validateEmail(emailField) {
        const email = emailField.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            this.showFieldError(emailField, 'Por favor ingresa un email válido');
            return false;
        }
        
        return true;
    }

    showFieldError(field, message) {
        // Remover error anterior si existe
        this.clearFieldError(field);
        
        // Crear elemento de error
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: var(--accent-red);
            font-size: 0.875rem;
            margin-top: 0.25rem;
            font-weight: 500;
        `;
        
        // Agregar estilo de error al campo
        field.style.borderColor = 'var(--accent-red)';
        
        // Insertar después del campo
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        // Remover mensaje de error
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        
        // Restaurar estilo del campo
        field.style.borderColor = '';
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        console.log('📤 Procesando envío de formulario...');
        
        // Validar todos los campos
        if (!this.validateForm()) {
            console.warn('⚠️ Formulario contiene errores');
            return;
        }
        
        // Obtener datos del formulario
        const formData = this.getFormData();
        
        // Cambiar estado del botón
        this.setSubmitButtonState(true);
        
        try {
            // Simular envío (en el futuro se puede integrar con un backend real)
            await this.submitForm(formData);
            
            // Mostrar mensaje de éxito
            this.showSuccessMessage();
            
            // Limpiar formulario
            this.form.reset();
            
        } catch (error) {
            console.error('❌ Error al enviar formulario:', error);
            this.showErrorMessage();
        } finally {
            this.setSubmitButtonState(false);
        }
    }

    validateForm() {
        const requiredFields = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        // Validar email específicamente
        const emailField = this.form.querySelector('input[type="email"]');
        if (emailField && !this.validateEmail(emailField)) {
            isValid = false;
        }
        
        return isValid;
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    async submitForm(data) {
        // Simular delay de envío
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // En el futuro, aquí se haría la llamada real al backend
        console.log('📧 Datos del formulario a enviar:', data);
        
        // Opción temporal: abrir cliente de email
        const subject = encodeURIComponent(`Consulta desde web - ${data.tipo || 'General'}`);
        const body = encodeURIComponent(
            `Nombre: ${data.nombre}\n` +
            `Email: ${data.email}\n` +
            `Teléfono: ${data.telefono || 'No proporcionado'}\n` +
            `Tipo de consulta: ${data.tipo}\n\n` +
            `Mensaje:\n${data.mensaje}`
        );
        
        // Para testing, solo loggear. En producción se puede descomentar la línea siguiente:
        // window.open(`mailto:jcartes@preujmc.cl?subject=${subject}&body=${body}`);
        
        return true;
    }

    setSubmitButtonState(isSubmitting) {
        this.isSubmitting = isSubmitting;
        
        if (!this.submitButton) return;
        
        if (isSubmitting) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = `
                <span class="material-symbols-rounded" style="animation: spin 1s linear infinite;">sync</span>
                Enviando...
            `;
        } else {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = this.originalButtonText;
        }
    }

    showSuccessMessage() {
        this.showNotification(
            '✅ ¡Mensaje enviado exitosamente!',
            'Nos pondremos en contacto contigo pronto.',
            'success'
        );
    }

    showErrorMessage() {
        this.showNotification(
            '❌ Error al enviar mensaje',
            'Por favor intenta nuevamente o contáctanos directamente.',
            'error'
        );
    }

    showNotification(title, message, type) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="notification-close" onclick="this.parentNode.remove()">
                <span class="material-symbols-rounded">close</span>
            </button>
        `;
        
        // Estilos para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: ${type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius-medium);
            box-shadow: var(--shadow-heavy);
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        // Agregar estilos para elementos internos
        const content = notification.querySelector('.notification-content');
        content.style.cssText = 'flex: 1;';
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
        `;
        
        // Agregar al DOM
        document.body.appendChild(notification);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    setupAnimations() {
        // Las animaciones ya están configuradas globalmente
        // Esta función está disponible para animaciones específicas de contacto si se necesitan
        console.log('🎬 Animaciones configuradas (heredadas del sistema global)');
    }
}

// ======================================
// INICIALIZACIÓN
// ======================================

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar manager de contacto
    const contactManager = new ContactManager();
    contactManager.init();
});

// Agregar keyframes para animaciones de notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);