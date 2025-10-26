document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) return window.location.href = '/';

  // 🌸 Elementos clave
  const saludo = document.getElementById('saludo-emprendedor');
  const perfilNombre = document.getElementById('perfil-nombre');
  const perfilEmail = document.getElementById('perfil-email');
  const perfilRol = document.getElementById('perfil-rol');
  const btnPerfil = document.getElementById('btn-perfil');
  const menuPerfil = document.getElementById('menu-perfil');
  const btnLogout = document.getElementById('btn-logout');
  const formTienda = document.getElementById('form-tienda');
  const formProducto = document.getElementById('form-producto');
  const panelTiendas = document.querySelector('.grid-tiendas-emprendedor');
  const panelProductos = document.querySelector('.grid-productos-emprendedor');
  const selectTienda = formProducto?.querySelector('select[name="id_tienda"]');

  // 🎯 Elementos modales
  const modalProducto = document.getElementById('modal-producto');
  const formModal = document.getElementById('form-producto-modal');
  const btnCerrarModal = document.getElementById('cerrar-modal');
  
  // 🗑️ Modal de confirmación para eliminar productos
  const modalConfirmacion = document.getElementById('confirmacion-emprendedor');
  const btnConfirmarEliminacion = document.getElementById('confirmar-eliminacion');
  const btnCancelarEliminacion = document.getElementById('cancelar-eliminacion');

  let idUsuario = null;
  let misTiendas = [];
  let productoPendienteEliminar = null; // 📌 Variable para guardar el producto a eliminar

  // ✨ Alertas visuales mejoradas
  function mostrarAlerta(mensaje, tipo = 'info') {
    let alerta = document.getElementById('alerta-emprendedor');
    if (!alerta) {
      alerta = document.createElement('div');
      alerta.id = 'alerta-emprendedor';
      alerta.className = 'alerta-emprendedor';
      document.body.appendChild(alerta);
    }
    
    alerta.textContent = mensaje;
    alerta.className = 'alerta-emprendedor'; // Reset clases
    
    // 🎨 Aplicar estilo según el tipo
    if (tipo === 'error') {
      alerta.classList.add('alerta-error');
    } else if (tipo === 'success') {
      alerta.classList.add('alerta-success');
    }
    
    alerta.style.display = 'block';
    
    // ⏰ Ocultar automáticamente después de 4 segundos
    setTimeout(() => {
      alerta.style.display = 'none';
    }, 4000);
  }

  // 👤 Cargar perfil del usuario
  async function cargarPerfil() {
    try {
      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return mostrarAlerta('⚠️ No se pudo cargar el perfil', 'error');
      const user = await res.json();
      idUsuario = user.id;
      saludo.textContent = `Bienvenid@, ${user.name}`;
      perfilNombre.textContent = user.name;
      perfilEmail.textContent = user.email;
      perfilRol.textContent = user.rol;
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      mostrarAlerta('⚠️ Error al conectar con el perfil', 'error');
    }
  }

  // 🔽 Mostrar/ocultar menú de perfil
  if (btnPerfil && menuPerfil) {
    btnPerfil.addEventListener('click', (e) => {
      e.stopPropagation();
      menuPerfil.classList.toggle('visible');
    });

    document.addEventListener('click', (e) => {
      if (!menuPerfil.contains(e.target) && !btnPerfil.contains(e.target)) {
        menuPerfil.classList.remove('visible');
      }
    });
  }

  // 🔓 Cerrar sesión
  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      try {
        await fetch('/api/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      } finally {
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    });
  }

  // 🏪 Crear tienda
  if (formTienda) {
    formTienda.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(formTienda));
      try {
        const res = await fetch('/api/tiendas', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        if (!res.ok) {
          const mensaje = result?.error || '⚠️ No se pudo crear la tienda';
          mostrarAlerta(mensaje, 'error');
          return;
        }
        mostrarAlerta('🏪 Tienda creada exitosamente', 'success');
        formTienda.reset();
        await cargarTiendas();
        await cargarProductos();
      } catch (error) {
        console.error('Error al crear tienda:', error);
        mostrarAlerta('⚠️ Error de conexión al crear tienda', 'error');
      }
    });
  }

  // 🧴 Crear producto desde formulario fijo
  if (formProducto) {
    formProducto.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(formProducto));
      try {
        const res = await fetch('/api/productos', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        if (!res.ok) {
          const mensaje = result?.message || '⚠️ No se pudo agregar el producto';
          mostrarAlerta(mensaje, 'error');
          return;
        }
        mostrarAlerta('🧴 Producto agregado exitosamente', 'success');
        formProducto.reset();
        await cargarProductos();
      } catch (error) {
        console.error('Error al agregar producto:', error);
        mostrarAlerta('⚠️ Error de conexión al agregar producto', 'error');
      }
    });
  }

  // 🧴 Crear producto desde modal
  if (formModal) {
    formModal.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(formModal));
      try {
        const res = await fetch('/api/productos', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        if (!res.ok) {
          mostrarAlerta(result?.message || '⚠️ No se pudo agregar el producto', 'error');
          return;
        }
        mostrarAlerta('🧴 Producto agregado exitosamente', 'success');
        formModal.reset();
        modalProducto.style.display = 'none';
        await cargarProductos();
      } catch (error) {
        console.error('Error al agregar producto:', error);
        mostrarAlerta('⚠️ Error de conexión al agregar producto', 'error');
      }
    });
  }

  // ❌ Cerrar modal de producto
  if (btnCerrarModal) {
    btnCerrarModal.addEventListener('click', () => {
      modalProducto.style.display = 'none';
      formModal.reset();
    });
  }

  // ➕ Abrir modal desde cada tienda
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-agregar-producto')) {
      modalProducto.style.display = 'flex';
    }
    if (modalProducto.style.display === 'flex' && !formModal.contains(e.target) && !e.target.classList.contains('btn-agregar-producto')) {
      modalProducto.style.display = 'none';
      formModal.reset();
    }
  });

  // 🏪 Cargar tiendas del usuario
  async function cargarTiendas() {
    try {
      const res = await fetch('/api/tiendas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const tiendas = await res.json();
      misTiendas = tiendas.filter(t => t.id_usuario === idUsuario);
      panelTiendas.innerHTML = '';
      
      if (misTiendas.length === 0) {
        panelTiendas.innerHTML = `<p class="sin-contenido">No has creado ninguna tienda aún.</p>`;
        return;
      }
      
      misTiendas.forEach(tienda => {
        const card = document.createElement('div');
        card.classList.add('tienda-card-emprendedor');
        card.innerHTML = `
          <img src="${tienda.logo_url ?? 'https://via.placeholder.com/150'}" alt="${tienda.nombre_tienda}" class="tienda-logo">
          <h3>${tienda.nombre_tienda}</h3>
          <p>${tienda.descripcion ?? 'Sin descripción'}</p>
          <p><strong>Estado:</strong> ${tienda.estado}</p>
          <div class="acciones-tienda">
            <button class="btn-agregar-producto">➕ Agregar productos</button>
          </div>
        `;
        panelTiendas.appendChild(card);
      });

      // Actualizar select de tiendas en formularios
      if (selectTienda) {
        selectTienda.innerHTML = '';
        misTiendas.forEach(tienda => {
          const option = document.createElement('option');
          option.value = tienda.id_tienda;
          option.textContent = tienda.nombre_tienda;
          selectTienda.appendChild(option);
        });
      }
    } catch (error) {
      console.error('Error al cargar tiendas:', error);
      mostrarAlerta('⚠️ No se pudieron cargar las tiendas', 'error');
    }
  }

  // 📦 Cargar productos del usuario
  async function cargarProductos() {
    try {
      const res = await fetch('/api/productos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const productos = await res.json();
      const misTiendasIds = misTiendas.map(t => t.id_tienda);
      const propios = productos.data.filter(p => misTiendasIds.includes(p.id_tienda));
      panelProductos.innerHTML = '';
      
      if (propios.length === 0) {
        panelProductos.innerHTML = `<p class="sin-contenido">No has agregado productos aún.</p>`;
        return;
      }
      
      propios.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('producto-card-emprendedor');
        card.innerHTML = `
          <img src="${producto.imagen_url}" alt="${producto.nombre_producto}" class="producto-img-emprendedor">
          <h3>${producto.nombre_producto}</h3>
          <p>${producto.descripcion}</p>
          <p><strong>Precio:</strong> Bs ${producto.precio}</p>
          <p><strong>Stock:</strong> ${producto.stock}</p>
          <p><strong>Tienda:</strong> ${producto.tienda?.nombre_tienda ?? 'Sin tienda'}</p>
          <div class="acciones-producto">
            <button class="btn-eliminar-producto" data-id="${producto.id_producto}">🗑️ Eliminar</button>
          </div>
        `;
        panelProductos.appendChild(card);
      });
    } catch (error) {
      console.error('Error al cargar productos:', error);
      mostrarAlerta('⚠️ No se pudieron cargar los productos', 'error');
    }
  }

  // 🏷️ Cargar categorías desde el backend
  async function cargarCategorias() {
    try {
      const res = await fetch('/api/categorias');
      const data = await res.json();

      if (data.success) {
        const selects = document.querySelectorAll('select[name="id_categoria"]');
        selects.forEach(select => {
          select.innerHTML = ''; // Limpiar opciones previas
          data.data.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id_categoria;
            option.textContent = cat.nombre_categoria;
            select.appendChild(option);
          });
        });
      } else {
        mostrarAlerta('⚠️ No se pudieron cargar las categorías', 'error');
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      mostrarAlerta('⚠️ Error de conexión al cargar categorías', 'error');
    }
  }

  // 🗑️ Sistema de confirmación para eliminar productos
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-eliminar-producto')) {
      productoPendienteEliminar = e.target.dataset.id;
      // Mostrar modal de confirmación
      if (modalConfirmacion) {
        modalConfirmacion.style.display = 'block';
      }
    }
  });

  // ✅ Confirmar eliminación de producto
  if (btnConfirmarEliminacion) {
    btnConfirmarEliminacion.addEventListener('click', async () => {
      if (!productoPendienteEliminar) return;

      try {
        const res = await fetch(`/api/productos/${productoPendienteEliminar}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        if (!res.ok) {
          mostrarAlerta(result?.message || '⚠️ No se pudo eliminar el producto', 'error');
        } else {
          mostrarAlerta('🗑️ Producto eliminado exitosamente', 'success');
          await cargarProductos();
        }
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        mostrarAlerta('⚠️ Error de conexión al eliminar producto', 'error');
      } finally {
        productoPendienteEliminar = null;
        if (modalConfirmacion) {
          modalConfirmacion.style.display = 'none';
        }
      }
    });
  }

  // ❌ Cancelar eliminación de producto
  if (btnCancelarEliminacion) {
    btnCancelarEliminacion.addEventListener('click', () => {
      productoPendienteEliminar = null;
      if (modalConfirmacion) {
        modalConfirmacion.style.display = 'none';
      }
    });
  }

  // 🧿 Iniciar flujo de carga
  await cargarPerfil();
  await cargarTiendas();
  await cargarProductos();
  await cargarCategorias();
});