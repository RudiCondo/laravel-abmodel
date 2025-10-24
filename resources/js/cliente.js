// resources/js/cliente.js

// Estado global de la aplicación
const estadoCliente = {
    usuario: null,
    carrito: null,
    pedidos: [],
    productos: [],
    token: localStorage.getItem('token')
};

// Utilidades
const utils = {
    // Mostrar notificación
    mostrarNotificacion(mensaje, tipo = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${tipo}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${tipo === 'success' ? 'check' : tipo === 'error' ? 'exclamation-triangle' : 'info'}"></i>
                <span>${mensaje}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Formatear precio
    formatearPrecio(precio) {
        return `Bs. ${parseFloat(precio).toFixed(2)}`;
    },

    // Manejar errores de API
    manejarError(error) {
        console.error('Error:', error);
        if (error.status === 401) {
            this.mostrarNotificacion('Sesión expirada. Por favor inicia sesión nuevamente.', 'error');
            setTimeout(() => window.location.href = '/login', 2000);
        } else {
            this.mostrarNotificacion('Error al cargar los datos', 'error');
        }
    }
};

// API Client
const apiCliente = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${estadoCliente.token}`
    },

    async get(url) {
        try {
            const response = await fetch(`/api${url}`, {
                headers: this.headers
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            utils.manejarError(error);
            return null;
        }
    },

    async post(url, body) {
        try {
            const response = await fetch(`/api${url}`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(body)
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            return data;
        } catch (error) {
            utils.manejarError(error);
            return null;
        }
    },

    async put(url, body) {
        try {
            const response = await fetch(`/api${url}`, {
                method: 'PUT',
                headers: this.headers,
                body: JSON.stringify(body)
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            return data;
        } catch (error) {
            utils.manejarError(error);
            return null;
        }
    },

    async delete(url) {
        try {
            const response = await fetch(`/api${url}`, {
                method: 'DELETE',
                headers: this.headers
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            return data;
        } catch (error) {
            utils.manejarError(error);
            return null;
        }
    }
};

// Gestión de Datos
const datosCliente = {
    // Cargar perfil del usuario
    async cargarPerfil() {
        const usuario = await apiCliente.get('/profile');
        if (usuario) {
            estadoCliente.usuario = usuario;
            this.actualizarUIUsuario();
        }
    },

    // Cargar carrito
    async cargarCarrito() {
        const carrito = await apiCliente.get('/carrito');
        estadoCliente.carrito = carrito;
        this.actualizarUICarrito();
    },

    // Cargar pedidos
    async cargarPedidos() {
        const pedidos = await apiCliente.get('/pedidos');
        if (pedidos) {
            estadoCliente.pedidos = pedidos;
            this.mostrarPedidosRecientes();
        }
    },

    // Cargar productos
    async cargarProductos() {
        const productos = await apiCliente.get('/productos');
        if (productos) {
            estadoCliente.productos = productos.slice(0, 6); // Mostrar solo 6
            this.mostrarProductos();
        }
    },

    // Agregar producto al carrito
    async agregarAlCarrito(idProducto, cantidad = 1) {
        const resultado = await apiCliente.post('/carrito/detalle', {
            id_producto: idProducto,
            cantidad: cantidad
        });

        if (resultado && resultado.success) {
            utils.mostrarNotificacion('Producto agregado al carrito', 'success');
            await this.cargarCarrito(); // Recargar carrito
        } else {
            utils.mostrarNotificacion('Error al agregar producto', 'error');
        }
    },

    // Actualizar cantidad en carrito
    async actualizarCantidadCarrito(idDetalle, nuevaCantidad) {
        if (nuevaCantidad < 1) {
            await this.eliminarDelCarrito(idDetalle);
            return;
        }

        const resultado = await apiCliente.put(`/carrito/detalle/${idDetalle}`, {
            cantidad: nuevaCantidad
        });

        if (resultado && resultado.success) {
            await this.cargarCarrito();
        }
    },

    // Eliminar producto del carrito
    async eliminarDelCarrito(idDetalle) {
        const resultado = await apiCliente.delete(`/carrito/detalle/${idDetalle}`);
        
        if (resultado && resultado.success) {
            utils.mostrarNotificacion('Producto eliminado del carrito', 'success');
            await this.cargarCarrito();
        }
    },

    // Crear pedido desde carrito
    async crearPedido() {
        if (!estadoCliente.carrito || !estadoCliente.carrito.detalles || estadoCliente.carrito.detalles.length === 0) {
            utils.mostrarNotificacion('El carrito está vacío', 'error');
            return;
        }

        const resultado = await apiCliente.post('/pedidos');
        
        if (resultado && resultado.success) {
            utils.mostrarNotificacion('Pedido creado exitosamente', 'success');
            await this.cargarCarrito();
            await this.cargarPedidos();
            modalManager.cerrarModalCarrito();
        } else {
            utils.mostrarNotificacion('Error al crear pedido', 'error');
        }
    }
};

// Gestión de UI
const uiManager = {
    // Actualizar UI con datos del usuario
    actualizarUIUsuario() {
        if (!estadoCliente.usuario) return;

        const nombreElement = document.getElementById('cliente-nombre');
        const emailElement = document.getElementById('cliente-email');
        
        if (nombreElement) nombreElement.textContent = `¡Hola, ${estadoCliente.usuario.name}!`;
        if (emailElement) emailElement.textContent = estadoCliente.usuario.email;
    },

    // Actualizar UI del carrito
    actualizarUICarrito() {
        this.actualizarContadorCarrito();
        this.actualizarResumenCarrito();
        
        if (modalManager.modalCarritoAbierto) {
            this.mostrarCarritoModal();
        }
    },

    // Actualizar contador del carrito
    actualizarContadorCarrito() {
        const countElement = document.getElementById('carrito-count');
        const itemsCountElement = document.getElementById('carrito-items-count');
        
        const totalItems = estadoCliente.carrito && estadoCliente.carrito.detalles 
            ? estadoCliente.carrito.detalles.reduce((sum, item) => sum + item.cantidad, 0)
            : 0;

        if (countElement) countElement.textContent = totalItems;
        if (itemsCountElement) itemsCountElement.textContent = totalItems;
    },

    // Actualizar resumen numérico
    actualizarResumenCarrito() {
        const pedidosCount = document.getElementById('pedidos-count');
        const productosCount = document.getElementById('productos-count');
        
        if (pedidosCount) {
            const pedidosActivos = estadoCliente.pedidos.filter(p => 
                ['pendiente', 'confirmado', 'en_camino'].includes(p.estado)
            ).length;
            pedidosCount.textContent = pedidosActivos;
        }
        
        if (productosCount && estadoCliente.productos) {
            productosCount.textContent = estadoCliente.productos.length;
        }
    },

    // Mostrar pedidos recientes
    mostrarPedidosRecientes() {
        const container = document.getElementById('pedidos-container');
        if (!container) return;

        const pedidosRecientes = estadoCliente.pedidos.slice(0, 3); // Mostrar 3 más recientes

        if (pedidosRecientes.length === 0) {
            container.innerHTML = `
                <div class="sin-datos">
                    <i class="fas fa-box-open"></i>
                    <h3>No tienes pedidos aún</h3>
                    <p>¡Realiza tu primera compra!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = pedidosRecientes.map(pedido => `
            <div class="pedido-card" onclick="modalManager.mostrarDetallePedido(${pedido.id_pedido})">
                <div class="pedido-header">
                    <span class="pedido-id">Pedido #${pedido.id_pedido}</span>
                    <span class="estado-badge estado-${pedido.estado}">
                        ${this.formatearEstado(pedido.estado)}
                    </span>
                </div>
                <div class="pedido-total">
                    Total: ${utils.formatearPrecio(pedido.total)}
                </div>
                <div class="pedido-fecha">
                    ${new Date(pedido.created_at).toLocaleDateString()}
                </div>
            </div>
        `).join('');
    },

    // Mostrar productos
    mostrarProductos() {
        const container = document.getElementById('productos-grid');
        if (!container || !estadoCliente.productos) return;

        if (estadoCliente.productos.length === 0) {
            container.innerHTML = `
                <div class="sin-datos">
                    <i class="fas fa-store"></i>
                    <h3>No hay productos disponibles</h3>
                    <p>Pronto tendremos novedades</p>
                </div>
            `;
            return;
        }

        container.innerHTML = estadoCliente.productos.map(producto => `
            <div class="producto-card">
                <div class="producto-imagen">
                    <img src="${producto.imagen_url || '/images/placeholder-producto.jpg'}" 
                         alt="${producto.nombre_producto}"
                         onerror="this.src='/images/placeholder-producto.jpg'">
                </div>
                <div class="producto-info">
                    <h3 class="producto-nombre">${producto.nombre_producto}</h3>
                    <div class="producto-precio">${utils.formatearPrecio(producto.precio)}</div>
                    <div class="producto-stock">
                        ${producto.stock > 0 ? `${producto.stock} disponibles` : 'Agotado'}
                    </div>
                    <button class="btn-agregar-carrito" 
                            onclick="datosCliente.agregarAlCarrito(${producto.id_producto}, 1)"
                            ${producto.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i>
                        ${producto.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                    </button>
                </div>
            </div>
        `).join('');
    },

    // Formatear estado del pedido
    formatearEstado(estado) {
        const estados = {
            'pendiente': 'Pendiente',
            'confirmado': 'Confirmado', 
            'pago_acordado': 'Pago Acordado',
            'en_camino': 'En Camino',
            'entregado': 'Entregado',
            'cancelado': 'Cancelado'
        };
        return estados[estado] || estado;
    }
};

// Gestión de Modales
const modalManager = {
    modalCarritoAbierto: false,

    // Modal Carrito
    abrirModalCarrito() {
        this.modalCarritoAbierto = true;
        const modal = document.getElementById('modal-carrito');
        const overlay = document.getElementById('modal-overlay');
        
        if (modal) modal.classList.add('active');
        if (overlay) overlay.classList.add('active');
        
        uiManager.mostrarCarritoModal();
    },

    cerrarModalCarrito() {
        this.modalCarritoAbierto = false;
        const modal = document.getElementById('modal-carrito');
        const overlay = document.getElementById('modal-overlay');
        
        if (modal) modal.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    },

    mostrarCarritoModal() {
        const modalBody = document.querySelector('.modal-carrito .modal-body');
        if (!modalBody) return;

        if (!estadoCliente.carrito || !estadoCliente.carrito.detalles || estadoCliente.carrito.detalles.length === 0) {
            modalBody.innerHTML = `
                <div class="carrito-vacio">
                    <i class="fas fa-shopping-cart"></i>
                    <h4>Tu carrito está vacío</h4>
                    <p>Agrega algunos productos para continuar</p>
                </div>
            `;
            return;
        }

        let total = 0;
        
        modalBody.innerHTML = estadoCliente.carrito.detalles.map(detalle => {
            const subtotal = detalle.cantidad * detalle.producto.precio;
            total += subtotal;
            
            return `
                <div class="carrito-item">
                    <img src="${detalle.producto.imagen_url || '/images/placeholder-producto.jpg'}" 
                         alt="${detalle.producto.nombre_producto}">
                    <div class="item-info">
                        <h4>${detalle.producto.nombre_producto}</h4>
                        <div class="item-precio">${utils.formatearPrecio(detalle.producto.precio)}</div>
                        <div class="item-controls">
                            <button onclick="datosCliente.actualizarCantidadCarrito(${detalle.id_detalle}, ${detalle.cantidad - 1})">-</button>
                            <span>${detalle.cantidad}</span>
                            <button onclick="datosCliente.actualizarCantidadCarrito(${detalle.id_detalle}, ${detalle.cantidad + 1})">+</button>
                        </div>
                    </div>
                    <button class="btn-eliminar" onclick="datosCliente.eliminarDelCarrito(${detalle.id_detalle})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }).join('') + `
            <div class="carrito-total">
                <span>Total:</span>
                <span>${utils.formatearPrecio(total)}</span>
            </div>
        `;
    },

    // Modal Perfil
    abrirModalPerfil() {
        const modal = document.getElementById('modal-perfil');
        const overlay = document.getElementById('modal-overlay');
        
        if (modal) modal.classList.add('active');
        if (overlay) overlay.classList.add('active');
        
        this.mostrarPerfilModal();
    },

    cerrarModalPerfil() {
        const modal = document.getElementById('modal-perfil');
        const overlay = document.getElementById('modal-overlay');
        
        if (modal) modal.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    },

    mostrarPerfilModal() {
        // Implementar lógica del modal de perfil
        console.log('Mostrar modal de perfil');
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    if (!estadoCliente.token) {
        window.location.href = '/login';
        return;
    }

    try {
        // Cargar datos iniciales
        await Promise.all([
            datosCliente.cargarPerfil(),
            datosCliente.cargarCarrito(),
            datosCliente.cargarPedidos(),
            datosCliente.cargarProductos()
        ]);

        utils.mostrarNotificacion('¡Bienvenido de nuevo!', 'success');
    } catch (error) {
        utils.manejarError(error);
    }
});

// Event Listeners globales
document.addEventListener('click', (e) => {
    // Cerrar modales al hacer clic fuera
    if (e.target.id === 'modal-overlay') {
        modalManager.cerrarModalCarrito();
        modalManager.cerrarModalPerfil();
    }
});

// Funciones globales para HTML
window.abrirModalCarrito = () => modalManager.abrirModalCarrito();
window.abrirModalPerfil = () => modalManager.abrirModalPerfil();
window.cerrarModalCarrito = () => modalManager.cerrarModalCarrito();
window.cerrarModalPerfil = () => modalManager.cerrarModalPerfil();
window.crearPedido = () => datosCliente.crearPedido();