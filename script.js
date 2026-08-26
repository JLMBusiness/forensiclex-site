// ==========================================
// 1. MENÚ MÓVIL
// ==========================================
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navbar.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
}

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
    }
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
    });
});

const revealElements = document.querySelectorAll('.scroll-reveal');

const revealOnScroll = () => {
    revealElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            element.classList.add('visible');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

const typewriterItems = document.querySelectorAll('.resumen-item .typewriter');
typewriterItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 1.2}s`;
});

// ==========================================
// 2. API DE SALUDO (/api/saludo)
// ==========================================
const saludoBtn = document.getElementById('saludo-btn');
const saludoResultado = document.getElementById('saludo-resultado');

if (saludoBtn) {
    saludoBtn.addEventListener('click', async () => {
        saludoBtn.disabled = true;
        saludoBtn.textContent = 'Cargando...';

        try {
            // Llamada a nuestra función serverless
            const respuesta = await fetch('/api/saludo');
            const datos = await respuesta.json();

            saludoResultado.className = 'resultado exito';
            saludoResultado.innerHTML = `
                <strong>${datos.saludo}</strong> 👋<br>
                Son las ${datos.hora} | Servidor: ${datos.servidor}
            `;
        } catch (error) {
            saludoResultado.className = 'resultado error';
            saludoResultado.textContent = 'Error al conectar con el servidor.';
        }

        saludoBtn.disabled = false;
        saludoBtn.textContent = 'Recibir saludo';
    });
}


// ==========================================
// 3. FORMULARIO DE CONTACTO (/api/contacto)
// ==========================================
const contactoForm = document.getElementById('contacto-form');
const contactoResultado = document.getElementById('contacto-resultado');

if (contactoForm) {
    contactoForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = contactoForm.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Enviando...';

        // Obtener datos del formulario
        const datos = {
            nombre: document.getElementById('nombre').value.trim(),
            email: document.getElementById('email').value.trim(),
            mensaje: document.getElementById('mensaje').value.trim()
        };

        try {
            // Enviar a nuestra función serverless
            const respuesta = await fetch('/api/contacto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            const resultado = await respuesta.json();

            if (respuesta.ok && resultado.ok) {
                contactoResultado.className = 'resultado exito';
                contactoResultado.textContent = resultado.mensaje;
                contactoForm.reset();
            } else {
                contactoResultado.className = 'resultado error';
                contactoResultado.textContent = resultado.mensaje || 'Error al enviar.';
            }
        } catch (error) {
            contactoResultado.className = 'resultado error';
            contactoResultado.textContent = 'Error de conexión. Inténtalo más tarde.';
        }

        btn.disabled = false;
        btn.textContent = 'Enviar mensaje';
    });
}
