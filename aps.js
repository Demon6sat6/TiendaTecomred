const productosDB = [
    { id: 1, nombre: "Laptop Gamer ASUS ROG", precio: 4500, categoria: "Laptops", marca: "ASUS", img: "https://img.icons8.com/color/96/000000/laptop--v1.png", desc: "Rendimiento extremo para juegos AAA, ideal para simuladores deportivos como FC 26." },
    { id: 2, nombre: "Smartphone Honor X7b", precio: 850, categoria: "Smartphones", marca: "Honor", img: "https://img.icons8.com/color/96/000000/android.png", desc: "Pantalla fluida y batería de larga duración, perfecto para jugar Free Fire." },
    { id: 3, nombre: "Mouse Logitech G Pro", precio: 350, categoria: "Accesorios", marca: "Logitech", img: "https://img.icons8.com/color/96/000000/mouse.png", desc: "Precisión absoluta para asegurar tus combos y habilidades en MOBAs." },
    { id: 4, nombre: "Monitor Curvo 27'' ASUS", precio: 1100, categoria: "Componentes", marca: "ASUS", img: "https://img.icons8.com/color/96/000000/monitor.png", desc: "165Hz para una ventaja táctica total y una visión fluida del mapa." },
    { id: 5, nombre: "Teclado Logitech G915", precio: 800, categoria: "Accesorios", marca: "Logitech", img: "https://img.icons8.com/color/96/000000/keyboard.png", desc: "Switches mecánicos ultrarrápidos, excelente tanto para jugar como para programar." },
    { id: 6, nombre: "Placa Base ASUS Prime", precio: 600, categoria: "Componentes", marca: "ASUS", img: "https://img.icons8.com/color/96/000000/motherboard.png", desc: "Estabilidad térmica superior para sesiones intensas." }
];


let carrito = [];

try {
    const carritoGuardado = localStorage.getItem('tecomred_carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
} catch (error) {
    console.error("Error al leer el carrito. Se reiniciará.", error);
    carrito = [];
}

let productosFiltrados = [...productosDB];


document.addEventListener('DOMContentLoaded', () => {

    setTimeout(() => {
        renderizarProductos(productosFiltrados);
    }, 800);
    
    actualizarCarritoDOM();
    configurarFiltros();
    configurarCarrito();
    configurarModales();
    configurarChatbot();
    configurarPago();
    configurarMenuMovil();
});


function renderizarProductos(productos) {
    const contenedor = document.getElementById('contenedor-productos');
    const mensajeVacio = document.getElementById('no-productos-mensaje');
    
    if (!contenedor) return;
    contenedor.innerHTML = '';

    if (productos.length === 0) {
        if (mensajeVacio) mensajeVacio.style.display = 'block';
        return;
    }
    
    if (mensajeVacio) mensajeVacio.style.display = 'none';

    productos.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'producto-card';
        tarjeta.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}" class="producto-img" loading="lazy">
            <h3>${producto.nombre}</h3>
            <p class="desc">${producto.desc}</p>
            <p class="producto-precio">S/ ${producto.precio.toFixed(2)}</p>
            <button class="btn-primario btn-agregar" data-id="${producto.id}">
                <i class="fas fa-cart-plus"></i> Agregar
            </button>
        `;
        contenedor.appendChild(tarjeta);
    });


    document.querySelectorAll('.btn-agregar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            agregarAlCarrito(id);
        });
    });
}


function configurarFiltros() {
    const buscador = document.getElementById('buscador');
    const checkboxes = document.querySelectorAll('.custom-checkbox input[type="checkbox"]');
    const inputMin = document.getElementById('precio-min');
    const inputMax = document.getElementById('precio-max');
    const btnAplicarPrecio = document.getElementById('btn-aplicar-precio');
    const btnLimpiar = document.getElementById('btn-limpiar-filtros');
    const contenedorChips = document.getElementById('filtros-activos');
    const ordenar = document.getElementById('ordenar-productos');

    document.querySelectorAll('.acordeon-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.parentElement.classList.toggle('abierto');
        });
    });

    const aplicarFiltros = () => {
        const txt = buscador ? buscador.value.toLowerCase() : "";
        const min = inputMin && inputMin.value ? parseFloat(inputMin.value) : 0;
        const max = inputMax && inputMax.value ? parseFloat(inputMax.value) : Infinity;
        
        const categoriasActivas = Array.from(document.querySelectorAll('input[name="categoria"]:checked')).map(cb => cb.value);
        const marcasActivas = Array.from(document.querySelectorAll('input[name="marca"]:checked')).map(cb => cb.value);

        renderizarChips(categoriasActivas, marcasActivas, min, max);

        productosFiltrados = productosDB.filter(p => {
            const okNombre = p.nombre.toLowerCase().includes(txt);
            const okPrecio = p.precio >= min && p.precio <= max;
            const okCat = categoriasActivas.length === 0 || categoriasActivas.includes(p.categoria);
            const okMarca = marcasActivas.length === 0 || marcasActivas.includes(p.marca);
            return okNombre && okPrecio && okCat && okMarca;
        });

        if (ordenar) {
            if (ordenar.value === 'az') productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
            if (ordenar.value === 'za') productosFiltrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
            if (ordenar.value === 'precio-asc') productosFiltrados.sort((a, b) => a.precio - b.precio);
            if (ordenar.value === 'precio-desc') productosFiltrados.sort((a, b) => b.precio - a.precio);
        }

        renderizarProductos(productosFiltrados);
    };


    const renderizarChips = (cats, marcas, min, max) => {
        if (!contenedorChips) return;
        contenedorChips.innerHTML = '';
        
        const crearChip = (texto, tipo, valor) => {
            const chip = document.createElement('div');
            chip.className = 'filtro-chip';
            chip.innerHTML = `${texto} <i class="fas fa-times" data-tipo="${tipo}" data-valor="${valor}"></i>`;
            contenedorChips.appendChild(chip);
        };

        cats.forEach(c => crearChip(c, 'categoria', c));
        marcas.forEach(m => crearChip(m, 'marca', m));
        
        if (min > 0 || max !== Infinity) {
            crearChip(`S/ ${min} - ${max === Infinity ? 'Más' : max}`, 'precio', '');
        }

        document.querySelectorAll('.filtro-chip i').forEach(icono => {
            icono.addEventListener('click', (e) => {
                const tipo = e.currentTarget.dataset.tipo;
                if (tipo === 'categoria' || tipo === 'marca') {
                    const input = document.querySelector(`input[value="${e.currentTarget.dataset.valor}"]`);
                    if (input) input.checked = false;
                } else if (tipo === 'precio') {
                    if (inputMin) inputMin.value = '';
                    if (inputMax) inputMax.value = '';
                }
                aplicarFiltros();
            });
        });
    };


    if (buscador) buscador.addEventListener('input', aplicarFiltros);
    checkboxes.forEach(cb => cb.addEventListener('change', aplicarFiltros));
    if (btnAplicarPrecio) btnAplicarPrecio.addEventListener('click', aplicarFiltros);
    if (ordenar) ordenar.addEventListener('change', aplicarFiltros);
    
    [inputMin, inputMax].forEach(input => {
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') aplicarFiltros();
            });
        }
    });

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            if (buscador) buscador.value = '';
            if (inputMin) inputMin.value = '';
            if (inputMax) inputMax.value = '';
            checkboxes.forEach(cb => cb.checked = false);
            if (ordenar) ordenar.value = 'default';
            aplicarFiltros();
        });
    }
}


function configurarMenuMovil() {
    const btnMenu = document.getElementById('btn-menu-movil');
    const navLinks = document.querySelector('.nav-links');
    
    if (btnMenu && navLinks) {
        btnMenu.addEventListener('click', () => {
            navLinks.classList.toggle('activo');
        });
    }

    const btnToggleFiltros = document.getElementById('btn-toggle-filtros');
    const filtros = document.getElementById('filtros');
    
    if (btnToggleFiltros && filtros) {
        btnToggleFiltros.addEventListener('click', () => {
            filtros.classList.toggle('activo');
            const icono = btnToggleFiltros.querySelector('i');
            if (icono) {
                if (filtros.classList.contains('activo')) {
                    icono.classList.replace('fa-filter', 'fa-times');
                } else {
                    icono.classList.replace('fa-times', 'fa-filter');
                }
            }
        });
    }
}

function configurarCarrito() {
    const panelCarrito = document.getElementById('carrito');
    
    const toggleCarrito = (e) => { 
        if(e) e.preventDefault(); 
        if(panelCarrito) panelCarrito.classList.toggle('abierto'); 
    };

    const btnMostrar = document.getElementById('mostrar-carrito');
    if (btnMostrar) btnMostrar.addEventListener('click', toggleCarrito);
    
    const btnNavCarrito = document.getElementById('nav-carrito-link');
    if (btnNavCarrito) btnNavCarrito.addEventListener('click', toggleCarrito);
    
    const btnOcultar = document.getElementById('ocultar-carrito');
    if (btnOcultar) btnOcultar.addEventListener('click', toggleCarrito);
    
    const btnVaciar = document.getElementById('btn-vaciar');
    if (btnVaciar) {
        btnVaciar.addEventListener('click', () => { 
            carrito = []; 
            guardarYActualizarCarrito(); 
        });
    }
}

function agregarAlCarrito(idProducto) {
    const producto = productosDB.find(p => p.id === idProducto);
    if (!producto) return;

    const itemEnCarrito = carrito.find(item => item.id === idProducto);
    
    if (itemEnCarrito) {
        itemEnCarrito.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    
    guardarYActualizarCarrito();
    const panelCarrito = document.getElementById('carrito');
    if (panelCarrito) panelCarrito.classList.add('abierto');
}

function eliminarDelCarrito(idProducto) {
    carrito = carrito.filter(item => item.id !== idProducto);
    guardarYActualizarCarrito();
}

function guardarYActualizarCarrito() {
    localStorage.setItem('tecomred_carrito', JSON.stringify(carrito));
    actualizarCarritoDOM();
}

function actualizarCarritoDOM() {
    const lista = document.getElementById('lista-carrito');
    const totalSpan = document.getElementById('carrito-total');
    
    if (!lista || !totalSpan) return;

    lista.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        lista.innerHTML = '<li class="carrito-vacio-mensaje">Tu carrito está vacío.</li>';
    } else {
        carrito.forEach(item => {
            total += item.precio * item.cantidad;
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';
            li.style.marginBottom = '1rem';
            li.style.borderBottom = '1px solid #eee';
            li.style.paddingBottom = '0.5rem';
            
            li.innerHTML = `
                <div>
                    <strong>${item.nombre}</strong><br>
                    <small>S/ ${item.precio.toFixed(2)} x ${item.cantidad}</small>
                </div>
                <button class="btn-eliminar-item" data-id="${item.id}" style="color: red; background: none; font-size: 1.2rem; cursor: pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            lista.appendChild(li);
        });

        document.querySelectorAll('.btn-eliminar-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                eliminarDelCarrito(parseInt(e.currentTarget.dataset.id));
            });
        });
    }
    
    totalSpan.textContent = `S/ ${total.toFixed(2)}`;
}


function configurarModales() {
    const modales = document.querySelectorAll('.modal');
    
    const cerrarTodasLasModales = () => {
        modales.forEach(m => m.classList.remove('activo'));
    };

    const abrirModal = (id) => { 
        cerrarTodasLasModales(); 
        const modal = document.getElementById(id);
        if (modal) modal.classList.add('activo'); 
    };

    const btnLogin = document.getElementById('btn-login');
    if (btnLogin) btnLogin.addEventListener('click', () => abrirModal('login-modal'));
    
    const btnRegister = document.getElementById('btn-register');
    if (btnRegister) btnRegister.addEventListener('click', () => abrirModal('register-modal'));
    

    const btnGoRegister = document.getElementById('go-to-register');
    if (btnGoRegister) btnGoRegister.addEventListener('click', (e) => { e.preventDefault(); abrirModal('register-modal'); });
    
    const btnGoLogin = document.getElementById('go-to-login');
    if (btnGoLogin) btnGoLogin.addEventListener('click', (e) => { e.preventDefault(); abrirModal('login-modal'); });

    document.querySelectorAll('.cerrar-modal').forEach(btn => {
        btn.addEventListener('click', cerrarTodasLasModales);
    });
    
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) cerrarTodasLasModales();
    });

    const formLogin = document.getElementById('login-form');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            cerrarTodasLasModales(); 
            alert('¡Bienvenido a Tecomred!');
        });
    }
}


function configurarChatbot() {
    const ventana = document.getElementById('chat-window');
    const btnBot = document.getElementById('chat-bot-btn');
    const btnCerrar = document.getElementById('chat-close-btn');
    const formEnvio = document.getElementById('chat-send-btn');
    const inputTexto = document.getElementById('chat-input');
    const contenedorMensajes = document.getElementById('chat-messages');
    const chipsAyuda = document.querySelectorAll('.chat-chip');

    if (btnBot && ventana) btnBot.addEventListener('click', () => ventana.classList.add('activo'));
    if (btnCerrar && ventana) btnCerrar.addEventListener('click', () => ventana.classList.remove('activo'));

    const normalizarTexto = (texto) => {
        return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const generarRespuestaBot = (mensajeUser) => {
        const txt = normalizarTexto(mensajeUser);
        
        if (txt.includes("hora") || txt.includes("horario") || txt.includes("abierto") || txt.includes("atencion")) {
            return "🕒 *Nuestro horario de atención es:*\nLunes a Sábado de 9:00 AM a 7:00 PM.\nDomingos de 9:00 AM a 1:00 PM.\n¡Te esperamos!";
        } 
        else if (txt.includes("producto") || txt.includes("catalogo") || txt.includes("que venden") || txt.includes("laptop")) {
            return "💻 Tenemos un amplio catálogo de Laptops Gamers, Componentes, y Smartphones como el Honor X7b. También contamos con periféricos de alta precisión para que no falles ninguna habilidad con tu campeón favorito. ¡Explora la página para ver más!";
        } 
        else if (txt.includes("precio") || txt.includes("costo") || txt.includes("cuanto cuesta")) {
            return "💳 Nuestros precios varían según el equipo. Tenemos mouses desde S/ 85 hasta Laptops de S/ 4500. Puedes usar el filtro de precios (a la izquierda) para encontrar algo que se ajuste a tu presupuesto.";
        } 
        else if (txt.includes("pago") || txt.includes("yape") || txt.includes("tarjeta") || txt.includes("pagar")) {
            return "✅ Aceptamos transferencias, Yape, Plin y efectivo en tienda. Solo agrega tus productos al carrito, dale a 'Ir a Pagar' y te redirigiremos a WhatsApp sin cobrarte comisiones extra.";
        } 
        else if (txt.includes("contacto") || txt.includes("ubicacion") || txt.includes("donde estan") || txt.includes("direccion") || txt.includes("telefono")) {
            return "📍 *Nuestra Tienda:* Jr. Sinchi Roca #391, Baños del Inca, Cajamarca.\n📱 *WhatsApp Directo:* +51 997176721.";
        } 
        else if (txt.includes("hola") || txt.includes("buenos dias") || txt.includes("buenas") || txt.includes("saludos")) {
            return "¡Hola! 👋 Qué gusto saludarte. Puedes usar los botones de abajo para ver horarios, pagos o ubicarnos. ¿En qué te ayudo?";
        } 
        else {
            return "Entiendo. Para consultas más detalladas o soporte técnico específico, te sugiero enviarnos un mensaje directamente a nuestro WhatsApp (+51 997176721). También puedes usar los botones de ayuda de aquí abajo. 👇";
        }
    };

    const procesarMensaje = (texto) => {
        if (!texto || !contenedorMensajes || !inputTexto) return;

        const msgUsuario = document.createElement('div');
        msgUsuario.className = 'chat-message message-user';
        msgUsuario.textContent = texto;
        contenedorMensajes.appendChild(msgUsuario);
        
        inputTexto.value = '';
        contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;


        const msgEscribiendo = document.createElement('div');
        msgEscribiendo.className = 'chat-message message-bot';
        msgEscribiendo.innerHTML = '<i class="fas fa-ellipsis-h" style="color: #ccc;"></i>';
        contenedorMensajes.appendChild(msgEscribiendo);
        contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;


        setTimeout(() => {
            contenedorMensajes.removeChild(msgEscribiendo); 
            
            const msgBot = document.createElement('div');
            msgBot.className = 'chat-message message-bot';
            msgBot.innerHTML = generarRespuestaBot(texto).replace(/\n/g, '<br>');
            
            contenedorMensajes.appendChild(msgBot);
            contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
        }, 900); 
    };

    if (formEnvio) {
        formEnvio.addEventListener('click', () => procesarMensaje(inputTexto.value.trim()));
    }
    
    if (inputTexto) {
        inputTexto.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') procesarMensaje(inputTexto.value.trim());
        });
    }

    chipsAyuda.forEach(chip => {
        chip.addEventListener('click', () => {
            procesarMensaje(chip.textContent.split(' ')[1] || chip.textContent);
        });
    });
}


function configurarPago() {
    const formPago = document.getElementById('form-pago');
    if (!formPago) return;

    formPago.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        if (carrito.length === 0) {
            alert("Tu carrito está vacío. Agrega productos antes de hacer tu pedido.");
            return; 
        }

        const nombreInput = document.getElementById('nombre-pago');
        const contactoInput = document.getElementById('email-pago');
        const metodoInput = document.getElementById('metodo');

        const nombre = nombreInput ? nombreInput.value : "Cliente";
        const contacto = contactoInput ? contactoInput.value : "No especificado";
        const metodo = metodoInput ? metodoInput.value : "Yape";

        let textoWhatsApp = `¡Hola Tecomred! 👋\nMi nombre es *${nombre}* y quiero hacer el siguiente pedido:\n\n`;

        let total = 0;
        carrito.forEach(item => {
            textoWhatsApp += `▪️ ${item.cantidad}x ${item.nombre} (S/ ${item.precio.toFixed(2)})\n`;
            total += (item.precio * item.cantidad);
        });

        textoWhatsApp += `\n*Total a pagar: S/ ${total.toFixed(2)}*\n`;
        textoWhatsApp += `\n*Detalles:*\n`;
        textoWhatsApp += `💳 Método elegido: ${metodo}\n`;
        textoWhatsApp += `📱 Contacto: ${contacto}\n\n`;
        textoWhatsApp += `¿Me confirmas el stock y los datos para el pago, por favor?`;

        const textoCodificado = encodeURIComponent(textoWhatsApp);
        const numeroWhatsApp = "51997176721"; 
        const url = `https://wa.me/${numeroWhatsApp}?text=${textoCodificado}`;

        const msjExito = document.getElementById('pago-mensaje');
        if (msjExito) {
            msjExito.textContent = "¡Redirigiendo a WhatsApp..."; 
            msjExito.style.display = 'block'; 
            msjExito.style.color = '#25D366';
        }
        
        window.open(url, '_blank');

        setTimeout(() => {
            carrito = []; 
            guardarYActualizarCarrito(); 
            formPago.reset(); 
            if (msjExito) msjExito.style.display = 'none';
        }, 3000);
    });
}
