
const productosDB = [
    { id: 1, nombre: "Laptop Gamer ASUS ROG", precio: 4500, categoria: "Laptops", marca: "ASUS", img: "https://img.icons8.com/color/96/000000/laptop--v1.png", desc: "Rendimiento extremo para juegos AAA sin delay." },
    { id: 2, nombre: "Smartphone Honor X7b", precio: 850, categoria: "Smartphones", marca: "Honor", img: "https://img.icons8.com/color/96/000000/android.png", desc: "Pantalla fluida y batería de larga duración." },
    { id: 3, nombre: "Mouse Logitech G Pro", precio: 350, categoria: "Accesorios", marca: "Logitech", img: "https://img.icons8.com/color/96/000000/mouse.png", desc: "Precisión absoluta para asegurar tus combos." },
    { id: 4, nombre: "Monitor Curvo 27'' ASUS", precio: 1100, categoria: "Componentes", marca: "ASUS", img: "https://img.icons8.com/color/96/000000/monitor.png", desc: "165Hz para una ventaja táctica total." },
    { id: 5, nombre: "Teclado Logitech G915", precio: 800, categoria: "Accesorios", marca: "Logitech", img: "https://img.icons8.com/color/96/000000/keyboard.png", desc: "Switches mecánicos ultrarrápidos e inalámbricos." },
    { id: 6, nombre: "Placa Base ASUS Prime", precio: 600, categoria: "Componentes", marca: "ASUS", img: "https://img.icons8.com/color/96/000000/motherboard.png", desc: "Estabilidad térmica superior para PC Gamers." }
];


let carrito = JSON.parse(localStorage.getItem('tecomred_carrito')) || [];
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


    document.getElementById('btn-menu-movil').addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('activo');
    });


    document.getElementById('btn-toggle-filtros').addEventListener('click', () => {
        const filtros = document.getElementById('filtros');
        filtros.classList.toggle('activo');
        const icono = document.querySelector('#btn-toggle-filtros i');
        if(filtros.classList.contains('activo')){
            icono.classList.replace('fa-filter', 'fa-times');
        } else {
            icono.classList.replace('fa-times', 'fa-filter');
        }
    });
});


function renderizarProductos(productos) {
    const contenedor = document.getElementById('contenedor-productos');
    const mensajeVacio = document.getElementById('no-productos-mensaje');
    
    contenedor.innerHTML = '';

    if (productos.length === 0) {
        mensajeVacio.style.display = 'block';
        return;
    }
    mensajeVacio.style.display = 'none';

    productos.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'producto-card';
        tarjeta.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}" class="producto-img" loading="lazy">
            <h3>${producto.nombre}</h3>
            <p style="font-size: 0.85rem; color: #666; margin-top: 0.5rem; flex-grow: 1;">${producto.desc}</p>
            <p class="producto-precio">S/ ${producto.precio.toFixed(2)}</p>
            <button class="btn-primario btn-agregar" data-id="${producto.id}"><i class="fas fa-cart-plus"></i> Agregar</button>
        `;
        contenedor.appendChild(tarjeta);
    });


    document.querySelectorAll('.btn-agregar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            agregarAlCarrito(parseInt(e.target.closest('button').dataset.id));
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

    // Acordeones colapsables
    document.querySelectorAll('.acordeon-btn').forEach(btn => {
        btn.addEventListener('click', () => btn.parentElement.classList.toggle('abierto'));
    });

    const aplicarFiltros = () => {
        const txt = buscador.value.toLowerCase();
        let min = parseFloat(inputMin.value) || 0;
        let max = parseFloat(inputMax.value) || Infinity;
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

        if (ordenar.value === 'az') productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        if (ordenar.value === 'za') productosFiltrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
        if (ordenar.value === 'precio-asc') productosFiltrados.sort((a, b) => a.precio - b.precio);
        if (ordenar.value === 'precio-desc') productosFiltrados.sort((a, b) => b.precio - a.precio);

        renderizarProductos(productosFiltrados);
    };

    const renderizarChips = (cats, marcas, min, max) => {
        contenedorChips.innerHTML = '';
        const crearChip = (texto, tipo, valor) => {
            const chip = document.createElement('div');
            chip.className = 'filtro-chip';
            chip.innerHTML = `${texto} <i class="fas fa-times" data-tipo="${tipo}" data-valor="${valor}"></i>`;
            contenedorChips.appendChild(chip);
        };
        cats.forEach(c => crearChip(c, 'categoria', c));
        marcas.forEach(m => crearChip(m, 'marca', m));
        if (min > 0 || max !== Infinity) crearChip(`S/ ${min} - ${max === Infinity ? 'Más' : max}`, 'precio', '');

        document.querySelectorAll('.filtro-chip i').forEach(icono => {
            icono.addEventListener('click', (e) => {
                const tipo = e.target.dataset.tipo;
                if(tipo === 'categoria' || tipo === 'marca') document.querySelector(`input[value="${e.target.dataset.valor}"]`).checked = false;
                else if (tipo === 'precio') { inputMin.value = ''; inputMax.value = ''; }
                aplicarFiltros();
            });
        });
    };

    buscador.addEventListener('input', aplicarFiltros);
    checkboxes.forEach(cb => cb.addEventListener('change', aplicarFiltros));
    btnAplicarPrecio.addEventListener('click', aplicarFiltros);
    ordenar.addEventListener('change', aplicarFiltros);
    [inputMin, inputMax].forEach(i => i.addEventListener('keypress', (e) => { if(e.key === 'Enter') aplicarFiltros(); }));

    btnLimpiar.addEventListener('click', () => {
        buscador.value = ''; inputMin.value = ''; inputMax.value = '';
        checkboxes.forEach(cb => cb.checked = false);
        ordenar.value = 'default';
        aplicarFiltros();
    });
}


function configurarCarrito() {
    const toggleCarrito = (e) => { if(e) e.preventDefault(); document.getElementById('carrito').classList.toggle('abierto'); };
    document.getElementById('mostrar-carrito').addEventListener('click', toggleCarrito);
    document.getElementById('nav-carrito-link').addEventListener('click', toggleCarrito);
    document.getElementById('ocultar-carrito').addEventListener('click', toggleCarrito);
    document.getElementById('btn-vaciar').addEventListener('click', () => { carrito = []; guardarYActualizarCarrito(); });
}

function agregarAlCarrito(idProducto) {
    const producto = productosDB.find(p => p.id === idProducto);
    const item = carrito.find(i => i.id === idProducto);
    if (item) item.cantidad++; else carrito.push({ ...producto, cantidad: 1 });
    guardarYActualizarCarrito();
    document.getElementById('carrito').classList.add('abierto');
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
    lista.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        lista.innerHTML = '<li class="carrito-vacio-mensaje">Tu carrito está vacío.</li>';
    } else {
        carrito.forEach(item => {
            total += item.precio * item.cantidad;
            const li = document.createElement('li');
            li.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid #eee; padding-bottom:0.5rem;';
            li.innerHTML = `<div><strong>${item.nombre}</strong><br><small>S/ ${item.precio.toFixed(2)} x ${item.cantidad}</small></div>
                <button class="btn-eliminar-item" data-id="${item.id}" style="color:red; background:none; font-size:1.2rem; cursor:pointer;"><i class="fas fa-trash"></i></button>`;
            lista.appendChild(li);
        });
        document.querySelectorAll('.btn-eliminar-item').forEach(btn => btn.addEventListener('click', (e) => eliminarDelCarrito(parseInt(e.currentTarget.dataset.id))));
    }
    totalSpan.textContent = `S/ ${total.toFixed(2)}`;
}


function configurarModales() {
    const cerrarModal = () => document.querySelectorAll('.modal').forEach(m => m.classList.remove('activo'));
    const abrirModal = (id) => { cerrarModal(); document.getElementById(id).classList.add('activo'); };

    document.getElementById('btn-login').addEventListener('click', () => abrirModal('login-modal'));
    document.getElementById('btn-register').addEventListener('click', () => abrirModal('register-modal'));
    document.querySelectorAll('.cerrar-modal').forEach(btn => btn.addEventListener('click', cerrarModal));
    
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) cerrarModal();
    });

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        cerrarModal(); 
        alert('¡Bienvenido a Tecomred!');
    });
}


function configurarChatbot() {
    const ventana = document.getElementById('chat-window');
    const btnBot = document.getElementById('chat-bot-btn');
    const btnCerrar = document.getElementById('chat-close-btn');
    const formEnvio = document.getElementById('chat-send-btn');
    const inputTexto = document.getElementById('chat-input');
    const contenedorMensajes = document.getElementById('chat-messages');


    btnBot.addEventListener('click', () => ventana.classList.add('activo'));
    btnCerrar.addEventListener('click', () => ventana.classList.remove('activo'));


    const enviarMensaje = () => {
        const texto = inputTexto.value.trim();
        if (!texto) return; 


        const msgUsuario = document.createElement('div');
        msgUsuario.className = 'chat-message message-user';
        msgUsuario.textContent = texto;
        contenedorMensajes.appendChild(msgUsuario);
        

        inputTexto.value = '';
        contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;


        setTimeout(() => {
            const msgBot = document.createElement('div');
            msgBot.className = 'chat-message message-bot';
            msgBot.textContent = "Gracias por escribirnos. Un asesor de Tecomred leerá tu mensaje en breve. ¿Hay algo más en lo que podamos ayudarte?";
            contenedorMensajes.appendChild(msgBot);
            contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
        }, 1000); 
    };


    formEnvio.addEventListener('click', enviarMensaje);
    inputTexto.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') enviarMensaje();
    });
}


function configurarPago() {
    const formPago = document.getElementById('form-pago');
    const detallesTarjeta = document.getElementById('detalles-pago-tarjeta');
    const inputsTarjeta = detallesTarjeta.querySelectorAll('input');

    document.getElementById('metodo').addEventListener('change', (e) => {
        if (e.target.value === 'tarjeta') { 
            detallesTarjeta.style.display = 'block'; 
            inputsTarjeta.forEach(i => i.required = true); 
        } else { 
            detallesTarjeta.style.display = 'none'; 
            inputsTarjeta.forEach(i => i.required = false); 
        }
    });

    formPago.addEventListener('submit', (e) => {
        e.preventDefault();
        if(carrito.length === 0) return alert("Tu carrito está vacío.");
        const msjExito = document.getElementById('pago-mensaje');
        msjExito.textContent = "Procesando pago..."; 
        msjExito.style.display = 'block'; 
        msjExito.style.color = 'var(--color-primario)';
        
        setTimeout(() => {
            msjExito.textContent = "¡Pago exitoso!"; 
            msjExito.style.color = 'green';
            carrito = []; 
            guardarYActualizarCarrito(); 
            formPago.reset(); 
            detallesTarjeta.style.display = 'none';
        }, 1500);
    });
}
