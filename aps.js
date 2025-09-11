document.addEventListener('DOMContentLoaded', () => {

    /* --- Referencias a elementos del DOM --- */
    const loginBtn = document.getElementById('btn-login');
    const registerBtn = document.getElementById('btn-register');
    const logoutBtn = document.getElementById('btn-logout');
    const userDisplay = document.getElementById('user-display');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    const goToRegisterLink = document.getElementById('go-to-register');
    const goToLoginLink = document.getElementById('go-to-login');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const backToLoginLink = document.getElementById('go-to-login-from-forgot');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const loginMessage = document.getElementById('login-message');
    const registerMessage = document.getElementById('register-message');
    const forgotPasswordMessage = document.getElementById('forgot-password-message');

    const chatBotBtn = document.getElementById('chat-bot-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatMessages = document.getElementById('chat-messages');

    const mostrarCarritoBtn = document.getElementById('mostrar-carrito');
    const ocultarCarritoBtn = document.getElementById('ocultar-carrito');
    const carrito = document.getElementById('carrito');
    const contenedorProductos = document.getElementById('contenedor-productos');
    const listaCarrito = document.getElementById('lista-carrito');
    const carritoTotal = document.getElementById('carrito-total');
    const vaciarCarritoBtn = document.getElementById('btn-vaciar');
    const carritoVacioMensaje = document.getElementById('carrito-vacio-mensaje');
    
    const filtroCategoria = document.getElementById('filtro-categoria');
    const filtroPrecio = document.getElementById('filtro-precio');
    const precioMostrar = document.getElementById('precio-mostrar');
    const buscador = document.getElementById('buscador');
    const btnLimpiarFiltros = document.getElementById('btn-limpiar-filtros');
    const noProductosMensaje = document.getElementById('no-productos-mensaje');
    
    let productos = [];
    let carritoItems = [];

    // Lista de productos de ejemplo
    async function cargarProductos() {
        productos = [
            { id: 1, nombre: 'Laptop Gamer', categoria: 'Laptops', precio: 3500, imagen: 'https://cdn.pixabay.com/photo/2020/05/26/09/32/laptop-5223842_1280.jpg' },
            { id: 2, nombre: 'Mouse Inalámbrico', categoria: 'Accesorios', precio: 85, imagen: 'https://cdn.pixabay.com/photo/2016/09/16/08/42/mouse-1673641_1280.jpg' },
            { id: 3, nombre: 'Router Wi-Fi 6', categoria: 'Redes', precio: 300, imagen: 'https://cdn.pixabay.com/photo/2019/07/04/10/37/router-4315805_1280.jpg' },
            { id: 4, nombre: 'Teclado Mecánico', categoria: 'Accesorios', precio: 250, imagen: 'https://cdn.pixabay.com/photo/2018/11/04/11/09/keyboard-3793406_1280.jpg' },
            { id: 5, nombre: 'SSD 1TB', categoria: 'Componentes', precio: 450, imagen: 'https://cdn.pixabay.com/photo/2019/07/19/20/43/ssd-4349377_1280.jpg' },
            { id: 6, nombre: 'Laptop Ultrabook', categoria: 'Laptops', precio: 4500, imagen: 'https://cdn.pixabay.com/photo/2014/05/02/21/49/laptop-336378_1280.jpg' },
        ];
        mostrarProductos(productos);
    }
    
    // Función para mostrar los productos en el DOM
    function mostrarProductos(productosAMostrar) {
        contenedorProductos.innerHTML = '';
        if (productosAMostrar.length === 0) {
            noProductosMensaje.style.display = 'block';
        } else {
            noProductosMensaje.style.display = 'none';
            productosAMostrar.forEach(producto => {
                const card = document.createElement('div');
                card.className = 'producto-card';
                card.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen" />
                    <div class="producto-info">
                        <span class="producto-categoria">${producto.categoria}</span>
                        <h3>${producto.nombre}</h3>
                        <p class="producto-precio">S/ ${producto.precio.toFixed(2)}</p>
                        <button class="btn-primario agregar-carrito" data-id="${producto.id}">Agregar al carrito</button>
                    </div>
                `;
                contenedorProductos.appendChild(card);
            });
        }
    }

    // --- Funcionalidad del carrito ---
    contenedorProductos.addEventListener('click', (e) => {
        if (e.target.classList.contains('agregar-carrito')) {
            const id = parseInt(e.target.dataset.id);
            const productoAgregado = productos.find(p => p.id === id);
            const itemExistente = carritoItems.find(item => item.id === id);

            if (itemExistente) {
                itemExistente.cantidad++;
            } else {
                carritoItems.push({ ...productoAgregado, cantidad: 1 });
            }
            actualizarCarrito();
        }
    });

    vaciarCarritoBtn.addEventListener('click', () => {
        carritoItems = [];
        actualizarCarrito();
    });

    function actualizarCarrito() {
        listaCarrito.innerHTML = '';
        let total = 0;
        if (carritoItems.length === 0) {
            carritoVacioMensaje.style.display = 'block';
        } else {
            carritoVacioMensaje.style.display = 'none';
            carritoItems.forEach(item => {
                const li = document.createElement('li');
                li.className = 'item-carrito';
                li.innerHTML = `
                    ${item.nombre} x${item.cantidad} - S/ ${(item.precio * item.cantidad).toFixed(2)}
                `;
                listaCarrito.appendChild(li);
                total += item.precio * item.cantidad;
            });
        }
        carritoTotal.textContent = `S/ ${total.toFixed(2)}`;
    }

    // --- Funcionalidad de filtros y búsqueda ---
    function filtrarProductos() {
        const categoriaSeleccionada = filtroCategoria.value;
        const precioMaximo = parseInt(filtroPrecio.value);
        const textoBuscado = buscador.value.toLowerCase();

        const productosFiltrados = productos.filter(producto => {
            const categoriaCoincide = categoriaSeleccionada === 'todos' || producto.categoria === categoriaSeleccionada;
            const precioCoincide = producto.precio <= precioMaximo;
            const nombreCoincide = producto.nombre.toLowerCase().includes(textoBuscado);
            return categoriaCoincide && precioCoincide && nombreCoincide;
        });

        mostrarProductos(productosFiltrados);
    }

    filtroCategoria.addEventListener('change', filtrarProductos);
    filtroPrecio.addEventListener('input', () => {
        precioMostrar.textContent = `S/ ${filtroPrecio.value}`;
        filtrarProductos();
    });
    buscador.addEventListener('input', filtrarProductos);
    btnLimpiarFiltros.addEventListener('click', () => {
        filtroCategoria.value = 'todos';
        filtroPrecio.value = 5000;
        precioMostrar.textContent = 'S/ 5000';
        buscador.value = '';
        filtrarProductos();
    });

    // --- Toggler de carrito ---
    mostrarCarritoBtn.addEventListener('click', () => {
        carrito.classList.add('visible');
    });

    ocultarCarritoBtn.addEventListener('click', () => {
        carrito.classList.remove('visible');
    });
    
    // --- Lógica de modales y autenticación ---
    const modals = [loginModal, registerModal, forgotPasswordModal];
    
    function openModal(modal) {
        modals.forEach(m => m.classList.remove('visible'));
        modal.classList.add('visible');
    }
    
    function closeModal(modal) {
        modal.classList.remove('visible');
    }
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.cerrar-modal');
        closeBtn.addEventListener('click', () => closeModal(modal));
    });

    // Abrir modales
    loginBtn.addEventListener('click', () => openModal(loginModal));
    registerBtn.addEventListener('click', () => openModal(registerModal));
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(forgotPasswordModal);
    });

    // Navegar entre modales
    goToRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(registerModal);
    });

    goToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(loginModal);
    });

    backToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(loginModal);
    });

    // Simulación de autenticación
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Simular login exitoso
        loginMessage.textContent = '¡Inicio de sesión exitoso!';
        loginMessage.style.color = 'green';
        setTimeout(() => {
            closeModal(loginModal);
            userDisplay.textContent = `Hola, ${email.split('@')[0]}`;
            userDisplay.style.display = 'inline';
            logoutBtn.style.display = 'inline';
            loginBtn.style.display = 'none';
            registerBtn.style.display = 'none';
        }, 1500);
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('register-email').value;
        registerMessage.textContent = `Usuario ${email} registrado con éxito.`;
        registerMessage.style.color = 'green';
        setTimeout(() => {
            closeModal(registerModal);
            openModal(loginModal);
        }, 2000);
    });

    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('forgot-email').value;
        forgotPasswordMessage.textContent = `Enlace de recuperación enviado a ${email}.`;
        forgotPasswordMessage.style.color = 'green';
        setTimeout(() => {
            closeModal(forgotPasswordModal);
            openModal(loginModal);
        }, 2000);
    });

    logoutBtn.addEventListener('click', () => {
        userDisplay.style.display = 'none';
        logoutBtn.style.display = 'none';
        loginBtn.style.display = 'inline';
        registerBtn.style.display = 'inline';
        userDisplay.textContent = '';
        alert('Has cerrado sesión.');
    });

    // --- Funcionalidad del Chat Bot ---
    chatBotBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('visible');
    });

    chatCloseBtn.addEventListener('click', () => {
        chatWindow.classList.remove('visible');
    });

    chatSendBtn.addEventListener('click', enviarMensaje);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            enviarMensaje();
        }
    });

    function enviarMensaje() {
        const mensaje = chatInput.value.trim();
        if (mensaje !== '') {
            mostrarMensaje('user', mensaje);
            chatInput.value = '';
            setTimeout(() => {
                const respuesta = obtenerRespuestaBot(mensaje);
                mostrarMensaje('bot', respuesta);
            }, 1000);
        }
    }

    function mostrarMensaje(remitente, texto) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('chat-message', `message-${remitente}`);
        divMensaje.textContent = texto;
        chatMessages.appendChild(divMensaje);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll automático
    }

    function obtenerRespuestaBot(mensaje) {
        const mensajeNormalizado = mensaje.toLowerCase();
        if (mensajeNormalizado.includes('hola') || mensajeNormalizado.includes('saludos')) {
            return '¡Hola! ¿En qué puedo ayudarte hoy?';
        } else if (mensajeNormalizado.includes('carrito')) {
            return 'Puedes agregar productos al carrito y ver el resumen haciendo clic en el icono del carrito.';
        } else if (mensajeNormalizado.includes('pago')) {
            return 'Aceptamos tarjeta de crédito/débito, transferencia bancaria y Yape/Plin.';
        } else if (mensajeNormalizado.includes('producto')) {
            return 'Usa los filtros o el buscador para encontrar lo que necesitas. ¡Tenemos laptops, accesorios, redes y componentes!';
        } else if (mensajeNormalizado.includes('gracias')) {
            return '¡De nada! Si necesitas algo más, aquí estoy.';
        } else {
            return 'Lo siento, no entendí tu pregunta. ¿Podrías ser más específico?';
        }
    }

    // Inicializar la página
    cargarProductos();
});