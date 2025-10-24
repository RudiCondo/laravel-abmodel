document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('No hay token, redirigiendo al login...');
    return window.location.href = '/login';
  }

  // 🌸 Elementos clave - ACTUALIZADOS PARA NUEVO DISEÑO
  const saludo = document.getElementById('saludo-emprendedor');
  const nombreUsuario = document.getElementById('nombre-usuario');
  const perfilNombre = document.getElementById('perfil-nombre');
  const perfilNombreMenu = document.getElementById('perfil-nombre-menu');
  const perfilEmail = document.getElementById('perfil-email');
  const perfilRol = document.getElementById('perfil-rol');
  const btnPerfil = document.getElementById('btn-perfil');
  const menuPerfil = document.getElementById('menu-perfil');
  const btnLogout = document.getElementById('btn-logout');
  const formTienda = document.getElementById('form-tienda');
  const panelTiendas = document.querySelector('.grid-tiendas-emprendedor');
  const panelProductos = document.querySelector('.grid-productos-emprendedor');

  // 🎯 Elementos modales - CORREGIDOS LOS IDs
  const modalProducto = document.getElementById('modal-producto');
  const formModal = document.getElementById('form-producto-modal');
  const btnCerrarModal = document.getElementById('cerrar-modal');
  
  // 🏪 Modal editar tienda
  const modalEditarTienda = document.getElementById('modal-editar-tienda');
  const formEditarTienda = document.getElementById('form-editar-tienda');
  const btnCerrarEditarTienda = document.getElementById('cerrar-modal-editar');
  
  // 🗑️ Modal de confirmación
  const modalConfirmacion = document.getElementById('confirmacion-emprendedor');
  const btnConfirmarEliminacion = document.getElementById('confirmar-eliminacion');
  const btnCancelarEliminacion = document.getElementById('cancelar-eliminacion');
  
  // 🎭 Overlay
  const modalOverlay = document.getElementById('modal-overlay');

  let idUsuario = null;
  let miTienda = null;
  let productoPendienteEliminar = null;
  let tiendaPendienteEliminar = null;

  // 🔧 FUNCIONALIDAD DEL PERFIL - CORREGIDA
  if (btnPerfil && menuPerfil) {
    console.log('✅ Configurando funcionalidad del perfil...');
    
    btnPerfil.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('👤 Botón perfil clickeado');
      
      // Alternar visibilidad del menú
      const isVisible = menuPerfil.style.display === 'block';
      menuPerfil.style.display = isVisible ? 'none' : 'block';
      
      console.log('📋 Menú perfil visible:', !isVisible);
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
      if (menuPerfil && !menuPerfil.contains(e.target) && e.target !== btnPerfil) {
        menuPerfil.style.display = 'none';
        console.log('❌ Menú perfil cerrado (click fuera)');
      }
    });

    // Prevenir que el click en el menú lo cierre
    if (menuPerfil) {
      menuPerfil.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  } else {
    console.log('❌ No se encontraron elementos del perfil');
  }

  // 🔓 Cerrar sesión - CORREGIDO
  if (btnLogout) {
    btnLogout.addEventListener('click', async (e) => {
      e.preventDefault();
      console.log('🚪 Intentando cerrar sesión...');
      
      if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        try {
          await fetch('/api/logout', {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
        } finally {
          localStorage.removeItem('token');
          window.location.href = '/';
        }
      }
    });
  }

  // ✨ Alertas visuales mejoradas
  function mostrarAlerta(mensaje, tipo = 'info') {
    console.log(`Alerta: ${mensaje} - Tipo: ${tipo}`);
    
    const alertaAnterior = document.getElementById('alerta-emprendedor');
    if (alertaAnterior) {
      alertaAnterior.remove();
    }
    
    const alerta = document.createElement('div');
    alerta.id = 'alerta-emprendedor';
    alerta.className = `alerta-emprendedor alerta-${tipo}`;
    alerta.textContent = mensaje;
    alerta.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      z-index: 10000;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      max-width: 400px;
      display: block !important;
    `;
    
    // Colores según el tipo
    if (tipo === 'success') {
      alerta.style.background = 'linear-gradient(135deg, #27ae60, #229954)';
    } else if (tipo === 'error') {
      alerta.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
    } else {
      alerta.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
    }
    
    document.body.appendChild(alerta);
    
    setTimeout(() => {
      if (alerta.parentNode) {
        alerta.remove();
      }
    }, 4000);
  }

  // 👤 Cargar perfil del usuario - CORREGIDO PARA NUEVO DISEÑO
  async function cargarPerfil() {
    try {
      console.log('🔍 Cargando perfil del usuario...');
      const res = await fetch('/api/profile', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const user = await res.json();
      console.log('✅ Usuario cargado:', user);
      
      // Estructura de respuesta de tu API
      idUsuario = user.id || user.data?.id;
      const userName = user.name || user.data?.name;
      const userEmail = user.email || user.data?.email;
      const userRol = user.rol || user.data?.rol;
      
      if (!idUsuario) {
        throw new Error('No se pudo obtener el ID del usuario');
      }
      
      // 🎨 ACTUALIZAR INTERFAZ CON NUEVO DISEÑO
      if (saludo && nombreUsuario) {
        saludo.innerHTML = `¡Hola, <span id="nombre-usuario">${userName || 'Emprendedor'}</span>! 👋`;
      }
      if (perfilNombre) {
        perfilNombre.textContent = userName || 'No disponible';
      }
      if (perfilNombreMenu) {
        perfilNombreMenu.textContent = userName || 'No disponible';
      }
      if (perfilEmail) {
        perfilEmail.textContent = userEmail || 'No disponible';
      }
      if (perfilRol) {
        perfilRol.textContent = userRol || 'Emprendedor';
        // Color diferente según el rol
        if (userRol === 'admin') {
          perfilRol.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
        } else if (userRol === 'emprendedor') {
          perfilRol.style.background = 'linear-gradient(135deg, var(--color-acento), var(--color-acento-oscuro))';
        } else {
          perfilRol.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
        }
      }
      
    } catch (error) {
      console.error('❌ Error al cargar perfil:', error);
      mostrarAlerta(`⚠️ Error al cargar el perfil: ${error.message}`, 'error');
    }
  }

  // 🏪 CREAR TIENDA
  if (formTienda) {
    formTienda.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = formTienda.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      try {
        submitBtn.textContent = 'Creando...';
        submitBtn.disabled = true;
        
        const formData = new FormData(formTienda);
        const data = {
          nombre_tienda: formData.get('nombre_tienda'),
          descripcion: formData.get('descripcion'),
          logo_url: formData.get('logo_url') || null,
          estado: 'activo'
        };
        
        console.log('📤 Enviando datos de tienda:', data);
        
        const res = await fetch('/api/tiendas', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        const result = await res.json();
        
        if (!res.ok) {
          const mensaje = result?.error || result?.message || 'No se pudo crear la tienda';
          throw new Error(mensaje);
        }
        
        mostrarAlerta('🏪 Tienda creada exitosamente', 'success');
        formTienda.reset();
        await cargarMiTienda();
        
      } catch (error) {
        console.error('❌ Error al crear tienda:', error);
        mostrarAlerta(`⚠️ ${error.message}`, 'error');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // 🏪 CARGAR MI TIENDA - BOTONES SIMPLIFICADOS (sin clases que no existen)
  async function cargarMiTienda() {
    try {
      console.log('🔍 Cargando mi tienda desde /api/tiendas...');
      const res = await fetch('/api/tiendas', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const response = await res.json();
      const todasLasTiendas = response.data || response || [];
      console.log('✅ Todas las tiendas:', todasLasTiendas);
      
      // Filtrar la tienda del usuario actual
      miTienda = todasLasTiendas.find(tienda => {
        const tiendaUserId = tienda.id_usuario;
        return tiendaUserId == idUsuario;
      });
      
      console.log('🎯 Mi tienda encontrada:', miTienda);
      
      panelTiendas.innerHTML = '';
      
      if (!miTienda) {
        panelTiendas.innerHTML = `
          <div class="sin-contenido">
            <p>No tienes una tienda creada aún.</p>
            <p><small>Usa el formulario de arriba para crear tu tienda.</small></p>
          </div>
        `;
        return;
      }
      
      // Renderizar la tienda - BOTONES SIMPLIFICADOS
      const card = document.createElement('div');
      card.classList.add('tienda-card-emprendedor');
      card.innerHTML = `
        <img src="${miTienda.logo_url || 'https://via.placeholder.com/150?text=Mi+Tienda'}" 
             alt="${miTienda.nombre_tienda}" 
             class="tienda-logo"
             onerror="this.src='https://via.placeholder.com/150?text=Mi+Tienda'">
        <h3>${miTienda.nombre_tienda}</h3>
        <p>${miTienda.descripcion || 'Sin descripción'}</p>
        <p><strong>Estado:</strong> ${miTienda.estado || 'Activa'}</p>
        <div class="acciones-tienda">
          <button class="btn-agregar-producto">
            ➕ Agregar productos
          </button>
          <button class="btn-editar-tienda" data-id="${miTienda.id_tienda}">
            ✏️ Editar tienda
          </button>
          <button class="btn-eliminar-tienda" data-id="${miTienda.id_tienda}">
            🗑️ Eliminar tienda
          </button>
        </div>
      `;
      panelTiendas.appendChild(card);
      
      await cargarMisProductos();

    } catch (error) {
      console.error('❌ Error al cargar tienda:', error);
      panelTiendas.innerHTML = `
        <div class="error-carga">
          <p>Error al cargar la tienda: ${error.message}</p>
          <button onclick="location.reload()" class="btn-reintentar">Reintentar</button>
        </div>
      `;
    }
  }

  // 📦 CARGAR MIS PRODUCTOS - BOTONES SIMPLIFICADOS
  async function cargarMisProductos() {
    try {
      console.log('🔍 Cargando productos desde /api/productos...');
      
      if (!miTienda) {
        panelProductos.innerHTML = `
          <div class="sin-contenido">
            <p>Primero crea una tienda para agregar productos.</p>
          </div>
        `;
        return;
      }
      
      const res = await fetch('/api/productos', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const response = await res.json();
      const todosLosProductos = response.data || response || [];
      
      // Filtrar solo los productos de MI tienda
      const misProductos = todosLosProductos.filter(producto => {
        const productoTiendaId = producto.id_tienda;
        return miTienda && productoTiendaId == miTienda.id_tienda;
      });
      
      console.log('🎯 Mis productos filtrados:', misProductos);
      
      panelProductos.innerHTML = '';
      
      if (misProductos.length === 0) {
        panelProductos.innerHTML = `
          <div class="sin-contenido">
            <p>No has agregado productos a tu tienda aún.</p>
            <p><small>Usa el botón "➕ Agregar productos" para comenzar.</small></p>
          </div>
        `;
        return;
      }
      
      // Renderizar productos - BOTONES SIMPLIFICADOS
      misProductos.forEach(producto => {
        const productoId = producto.id_producto || producto.id;
        const categoriaNombre = producto.categoria?.nombre_categoria || 
                               producto.categoria?.nombre || 
                               'Sin categoría';
        
        const card = document.createElement('div');
        card.classList.add('producto-card-emprendedor');
        card.innerHTML = `
          <img src="${producto.imagen_url || 'https://via.placeholder.com/200?text=Producto'}" 
               alt="${producto.nombre_producto}" 
               class="producto-img-emprendedor"
               onerror="this.src='https://via.placeholder.com/200?text=Producto'">
          <h3>${producto.nombre_producto}</h3>
          <p class="producto-descripcion">${producto.descripcion || 'Sin descripción'}</p>
          <p><strong>Precio:</strong> Bs. ${(producto.precio || 0).toLocaleString()}</p>
          <p><strong>Stock:</strong> ${producto.stock || 0}</p>
          <p><strong>Categoría:</strong> ${categoriaNombre}</p>
          <div class="acciones-producto">
            <button class="btn-eliminar-producto" data-id="${productoId}">
              🗑️ Eliminar
            </button>
          </div>
        `;
        panelProductos.appendChild(card);
      });
      
    } catch (error) {
      console.error('❌ Error al cargar productos:', error);
      panelProductos.innerHTML = `
        <div class="error-carga">
          <p>Error al cargar los productos: ${error.message}</p>
          <button onclick="cargarMisProductos()" class="btn-reintentar">Reintentar</button>
        </div>
      `;
    }
  }

  // 🏷️ CARGAR CATEGORÍAS PARA EL SELECT
  async function cargarCategorias() {
    try {
      console.log('🔍 Cargando categorías desde /api/categorias...');
      const res = await fetch('/api/categorias');
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const response = await res.json();
      const categorias = response.data || response || [];
      
      const selectCategoria = formModal.querySelector('select[name="id_categoria"]');
      if (selectCategoria) {
        selectCategoria.innerHTML = '<option value="">Selecciona una categoría</option>';
        categorias.forEach(cat => {
          const option = document.createElement('option');
          option.value = cat.id_categoria || cat.id;
          option.textContent = cat.nombre_categoria || cat.nombre;
          selectCategoria.appendChild(option);
        });
      }
      
    } catch (error) {
      console.error('❌ Error al cargar categorías:', error);
      mostrarAlerta('⚠️ Error al cargar las categorías', 'error');
    }
  }

  // 🎯 EVENT LISTENERS PARA BOTONES
  document.addEventListener('click', (e) => {
    // ➕ ABRIR MODAL PARA AGREGAR PRODUCTO
    if (e.target.classList.contains('btn-agregar-producto')) {
      if (!miTienda) {
        mostrarAlerta('⚠️ Primero debes crear una tienda', 'error');
        return;
      }
      
      console.log('🛍️ Abriendo modal para agregar producto a tienda:', miTienda.id_tienda);
      modalProducto.style.display = 'flex';
      modalOverlay.style.display = 'block';
      cargarCategorias();
    }
    
    // ✏️ EDITAR TIENDA
    if (e.target.classList.contains('btn-editar-tienda')) {
      const tiendaId = e.target.dataset.id;
      abrirModalEditarTienda(tiendaId);
    }
    
    // 🗑️ ELIMINAR PRODUCTO
    if (e.target.classList.contains('btn-eliminar-producto')) {
      productoPendienteEliminar = e.target.dataset.id;
      console.log('🗑️ Producto a eliminar:', productoPendienteEliminar);
      modalConfirmacion.style.display = 'block';
      modalOverlay.style.display = 'block';
      document.getElementById('confirmacion-mensaje').textContent = 
        '¿Estás segur@ de que deseas eliminar este producto? Esta acción no se puede deshacer.';
    }
    
    // 🗑️ ELIMINAR TIENDA
    if (e.target.classList.contains('btn-eliminar-tienda')) {
      tiendaPendienteEliminar = e.target.dataset.id;
      console.log('🏪 Tienda a eliminar:', tiendaPendienteEliminar);
      modalConfirmacion.style.display = 'block';
      modalOverlay.style.display = 'block';
      document.getElementById('confirmacion-mensaje').textContent = 
        '¿Estás segur@ de que deseas eliminar tu tienda? Se eliminarán todos los productos asociados. Esta acción no se puede deshacer.';
    }
  });

  // 🧴 CREAR PRODUCTO
  if (formModal) {
    formModal.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = formModal.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      try {
        submitBtn.textContent = 'Agregando...';
        submitBtn.disabled = true;
        
        if (!miTienda) {
          throw new Error('No tienes una tienda creada');
        }
        
        const formData = new FormData(formModal);
        const data = {
          nombre_producto: formData.get('nombre_producto'),
          descripcion: formData.get('descripcion'),
          precio: parseFloat(formData.get('precio')),
          stock: parseInt(formData.get('stock')),
          imagen_url: formData.get('imagen_url') || null,
          id_categoria: formData.get('id_categoria')
        };
        
        console.log('📤 Enviando datos de producto:', data);
        
        const res = await fetch('/api/productos', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        const result = await res.json();
        
        if (!res.ok) {
          const mensaje = result?.error || result?.message || result?.errors || 'No se pudo agregar el producto';
          throw new Error(mensaje);
        }
        
        mostrarAlerta('🧴 Producto agregado exitosamente', 'success');
        formModal.reset();
        modalProducto.style.display = 'none';
        modalOverlay.style.display = 'none';
        await cargarMisProductos();
        
      } catch (error) {
        console.error('❌ Error al agregar producto:', error);
        mostrarAlerta(`⚠️ ${error.message}`, 'error');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // ✏️ ABRIR MODAL EDITAR TIENDA
  async function abrirModalEditarTienda(tiendaId) {
    try {
      if (miTienda && miTienda.id_tienda == tiendaId) {
        llenarFormularioEditarTienda(miTienda);
        return;
      }
      
      const res = await fetch(`/api/tiendas/${tiendaId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: No se pudo cargar la tienda`);
      }
      
      const response = await res.json();
      const tienda = response.data || response;
      llenarFormularioEditarTienda(tienda);
      
    } catch (error) {
      console.error('❌ Error al cargar tienda para editar:', error);
      mostrarAlerta(`⚠️ Error al cargar datos de la tienda: ${error.message}`, 'error');
    }
  }

  function llenarFormularioEditarTienda(tienda) {
    formEditarTienda.querySelector('[name="nombre_tienda"]').value = tienda.nombre_tienda || '';
    formEditarTienda.querySelector('[name="descripcion"]').value = tienda.descripcion || '';
    formEditarTienda.querySelector('[name="logo_url"]').value = tienda.logo_url || '';
    
    modalEditarTienda.style.display = 'flex';
    modalOverlay.style.display = 'block';
  }

  // 🏪 ACTUALIZAR TIENDA
  if (formEditarTienda) {
    formEditarTienda.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = formEditarTienda.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      try {
        submitBtn.textContent = 'Actualizando...';
        submitBtn.disabled = true;
        
        const formData = new FormData(formEditarTienda);
        const data = {
          nombre_tienda: formData.get('nombre_tienda'),
          descripcion: formData.get('descripcion'),
          logo_url: formData.get('logo_url') || null
        };
        
        const res = await fetch(`/api/tiendas/${miTienda.id_tienda}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        const result = await res.json();
        
        if (!res.ok) {
          const mensaje = result?.error || result?.message || 'No se pudo actualizar la tienda';
          throw new Error(mensaje);
        }
        
        mostrarAlerta('🏪 Tienda actualizada exitosamente', 'success');
        modalEditarTienda.style.display = 'none';
        modalOverlay.style.display = 'none';
        await cargarMiTienda();
        
      } catch (error) {
        console.error('❌ Error al actualizar tienda:', error);
        mostrarAlerta(`⚠️ ${error.message}`, 'error');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // ❌ CERRAR MODALES - ACTUALIZADOS LOS IDs
  if (btnCerrarModal) {
    btnCerrarModal.addEventListener('click', () => {
      modalProducto.style.display = 'none';
      modalOverlay.style.display = 'none';
      if (formModal) formModal.reset();
    });
  }

  if (btnCerrarEditarTienda) {
    btnCerrarEditarTienda.addEventListener('click', () => {
      modalEditarTienda.style.display = 'none';
      modalOverlay.style.display = 'none';
    });
  }

  // ✅ CONFIRMAR ELIMINACIÓN
  if (btnConfirmarEliminacion) {
    btnConfirmarEliminacion.addEventListener('click', async () => {
      try {
        if (productoPendienteEliminar) {
          const res = await fetch(`/api/productos/${productoPendienteEliminar}`, {
            method: 'DELETE',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          const result = await res.json();
          
          if (!res.ok) {
            mostrarAlerta(result?.message || '⚠️ No se pudo eliminar el producto', 'error');
          } else {
            mostrarAlerta('🗑️ Producto eliminado exitosamente', 'success');
            await cargarMisProductos();
          }
          productoPendienteEliminar = null;
          
        } else if (tiendaPendienteEliminar) {
          const res = await fetch(`/api/tiendas/${tiendaPendienteEliminar}`, {
            method: 'DELETE',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          const result = await res.json();
          
          if (!res.ok) {
            mostrarAlerta(result?.error || '⚠️ No se pudo eliminar la tienda', 'error');
          } else {
            mostrarAlerta('🏪 Tienda eliminada exitosamente', 'success');
            await cargarMiTienda();
          }
          tiendaPendienteEliminar = null;
        }
        
      } catch (error) {
        console.error('❌ Error al eliminar:', error);
        mostrarAlerta('⚠️ Error de conexión', 'error');
      } finally {
        modalConfirmacion.style.display = 'none';
        modalOverlay.style.display = 'none';
      }
    });
  }

  // ❌ CANCELAR ELIMINACIÓN
  if (btnCancelarEliminacion) {
    btnCancelarEliminacion.addEventListener('click', () => {
      productoPendienteEliminar = null;
      tiendaPendienteEliminar = null;
      modalConfirmacion.style.display = 'none';
      modalOverlay.style.display = 'none';
    });
  }

  // 🎭 CERRAR MODALES CON OVERLAY
  if (modalOverlay) {
    modalOverlay.addEventListener('click', () => {
      if (modalProducto) modalProducto.style.display = 'none';
      if (modalEditarTienda) modalEditarTienda.style.display = 'none';
      if (modalConfirmacion) modalConfirmacion.style.display = 'none';
      modalOverlay.style.display = 'none';
    });
  }

  // 🧿 INICIAR FLUJO DE CARGA COMPLETO
  console.log('🚀 Iniciando carga de datos del emprendedor...');
  try {
    await cargarPerfil();
    await cargarMiTienda();
    console.log('✅ Carga de datos completada');
  } catch (error) {
    console.error('❌ Error en carga inicial:', error);
    mostrarAlerta('⚠️ Error al cargar los datos iniciales', 'error');
  }
}); 