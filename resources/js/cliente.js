// =========================
// Helpers globales
// =========================
function authHeaders() {
  const t = localStorage.getItem('token');
  return t ? { Authorization: `Bearer ${t}`, Accept: 'application/json', 'Content-Type': 'application/json' } : {};
}
function toast(msg, tipo = 'ok') {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.toggle('error', tipo === 'error');
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 1800);
}
function abrirModal(id) {
  const m = document.getElementById(id); if (!m) return;
  m.style.display = 'flex'; m.classList.add('activo');
}
function cerrarModal(id) {
  const m = document.getElementById(id); if (!m) return;
  m.classList.remove('activo'); m.style.display = 'none';
}
function formatDate(dt) {
  if (!dt) return '';
  const d = new Date(dt); return d.toLocaleDateString();
}

// =========================
// App
// =========================
document.addEventListener('DOMContentLoaded', initCliente);

async function initCliente() {
  const token = localStorage.getItem('token');
  if (!token) { window.location.href = '/login'; return; }

  // Refs UI
  const elNombre = document.getElementById('cli-nombre');
  const buscador = document.getElementById('hc-buscador');
  const gridTiendas = document.getElementById('grid-tiendas');
  const gridProductos = document.getElementById('grid-productos');
  const categoriasContainer = document.getElementById('categorias-container');
  const filtroTienda = document.getElementById('filtro-tienda');
  const btnLimpiarFiltro = document.getElementById('btn-limpiar-filtro');
  const listaComentarios = document.getElementById('lista-comentarios');
  const btnLogout = document.getElementById('btn-logout');

  // Menú perfil + acciones
  const btnPerfil = document.getElementById('btn-perfil');
  const menuPerfil = document.getElementById('menu-perfil');
  const pfOpen = document.getElementById('pf-open');
  const pfPedidos = document.getElementById('pf-pedidos');

  // Drawer carrito
  const btnCart = document.getElementById('btn-cart');
  const cartDrawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const cdClose = document.getElementById('cd-close');
  const cdLista = document.getElementById('cd-lista');
  const cdSubtotal = document.getElementById('cd-subtotal');
  const cdTotal = document.getElementById('cd-total');
  const cdComprar = document.getElementById('cd-comprar');
  const cartBadge = document.getElementById('cart-badge');

  // Modales tienda/producto
  const modalTienda = document.getElementById('modal-tienda');
  const mtLogo = document.getElementById('mt-logo');
  const mtNombre = document.getElementById('mt-nombre');
  const mtDesc = document.getElementById('mt-desc');
  const mtProductos = document.getElementById('mt-productos');
  document.querySelector('[data-close-tienda]')?.addEventListener('click', () => modalTienda.classList.remove('mostrar'));

  const modalProducto = document.getElementById('modal-producto');
  const mpImg = document.getElementById('mp-img');
  const mpNombre = document.getElementById('mp-nombre');
  const mpDesc = document.getElementById('mp-desc');
  const mpPrecio = document.getElementById('mp-precio');
  const mpMenos = document.getElementById('mp-menos');
  const mpMas = document.getElementById('mp-mas');
  const mpCant = document.getElementById('mp-cant');
  const mpAdd = document.getElementById('mp-add');
  const mpMsg = document.getElementById('mp-msg');
  document.querySelector('[data-close-producto]')?.addEventListener('click', () => modalProducto.classList.remove('mostrar'));

  // Modales perfil/pedidos/resena
  document.querySelector('[data-close-perfil]')?.addEventListener('click', () => cerrarModal('modal-perfil'));
  document.querySelector('[data-close-pedidos]')?.addEventListener('click', () => cerrarModal('modal-pedidos'));
  document.querySelectorAll('[data-close-resena]')?.forEach(btn => btn.addEventListener('click', () => cerrarModal('modal-resena')));

  let productos = [];
  let tiendas = [];
  let carrito = null;
  let prodActual = null;
  let categoriaFiltroActual = null;

  // ========== Perfil UI ==========
  btnPerfil?.addEventListener('click', (e) => {
    e.stopPropagation();
    menuPerfil?.classList.toggle('mostrar');
  });
  document.addEventListener('click', (e) => {
    if (menuPerfil && !menuPerfil.contains(e.target) && e.target !== btnPerfil) {
      menuPerfil.classList.remove('mostrar');
    }
  });
  pfOpen?.addEventListener('click', async (e) => {
    e.preventDefault();
    await cargarPerfilUI(); // pre-fill
    abrirModal('modal-perfil');
    menuPerfil.classList.remove('mostrar');
  });
  pfPedidos?.addEventListener('click', async (e) => {
    e.preventDefault();
    await cargarPedidos();
    abrirModal('modal-pedidos');
    menuPerfil.classList.remove('mostrar');
  });
  btnLogout?.addEventListener('click', async () => {
    try { await fetch('/api/logout', { method: 'POST', headers: authHeaders() }); } catch (_) {}
    localStorage.removeItem('token'); window.location.href = '/';
  });

  // Guardar perfil
  document.getElementById('form-perfil')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      name: document.getElementById('pf-nombre').value.trim(),
      email: document.getElementById('pf-email').value.trim(),
      telefono: document.getElementById('pf-telefono').value.trim(),
      direccion: document.getElementById('pf-direccion').value.trim(),
    };
    try {
      // tu backend usa updateProfile: ajústalo así
      const res = await fetch('/api/profile/update', { method: 'PUT', headers: authHeaders(), body: JSON.stringify(body) });
      if (!res.ok) throw new Error('No se pudo guardar');
      document.getElementById('pf-msg').style.display = 'block';
      setTimeout(() => document.getElementById('pf-msg').style.display = 'none', 1800);
      await cargarPerfilHeader(); // refresca nombre/email en header
    } catch (e2) {
      toast('Error al guardar perfil', 'error');
    }
  });
  // Cambiar contraseña
  document.getElementById('pf-change-pass')?.addEventListener('click', () => {
    toast('Para cambiar tu contraseña, usa la opción de perfil.', 'ok');
  });

  async function cargarPerfilHeader() {
    try {
      const r = await fetch('/api/profile', { headers: authHeaders() });
      const u = await r.json();
      elNombre.textContent = u.name || 'Cliente';
      document.getElementById('perfil-nombre-menu').textContent = u.name || 'Usuario';
      document.getElementById('perfil-email').textContent = u.email || '—';
    } catch (_) { /* no-op */ }
  }
  async function cargarPerfilUI() {
    try {
      const r = await fetch('/api/profile', { headers: authHeaders() });
      const u = await r.json();
      document.getElementById('pf-nombre').value = u.name || '';
      document.getElementById('pf-email').value = u.email || '';
      document.getElementById('pf-telefono').value = u.telefono || '';
      document.getElementById('pf-direccion').value = u.direccion || '';
    } catch (_) { toast('No pude cargar tu perfil'); }
  }

  // ========== Categorías ==========
  async function cargarCategorias() {
    try {
      const res = await fetch('/api/categorias');
      const data = await res.json();
      renderCategorias(data.data || data || []);
    } catch {
      renderCategorias([
        { id_categoria: 1, nombre_categoria: 'Maquillaje' },
        { id_categoria: 2, nombre_categoria: 'Skincare' },
        { id_categoria: 3, nombre_categoria: 'Fragancias' },
        { id_categoria: 4, nombre_categoria: 'Accesorios' }
      ]);
    }
  }
  function imgCategoria(nombre) {
    const k = (nombre || '').toLowerCase();
    if (k.includes('maqu')) return window.rutasImagenes.maquillaje;
    if (k.includes('skin') || k.includes('piel')) return window.rutasImagenes.skincare;
    if (k.includes('frag') || k.includes('perf')) return window.rutasImagenes.fragancias;
    return window.rutasImagenes.accesorios;
  }
  function renderCategorias(cats) {
    categoriasContainer.innerHTML = cats.map(c => `
      <div class="categoria-icon" data-id="${c.id_categoria}" data-name="${c.nombre_categoria}">
        <img src="${imgCategoria(c.nombre_categoria)}" alt="${c.nombre_categoria}">
        <span class="categoria-nombre">${c.nombre_categoria}</span>
      </div>
    `).join('');
    categoriasContainer.querySelectorAll('.categoria-icon').forEach(el => {
      el.addEventListener('click', () => {
        categoriaFiltroActual = parseInt(el.dataset.id, 10);
        filtrar();
        btnLimpiarFiltro.style.display = 'inline-flex';
        document.querySelector('.productos-destacados').scrollIntoView({ behavior: 'smooth' });
        toast(`Filtrado por ${el.dataset.name}`);
      });
    });
  }

  // ========== Tiendas ==========
  async function cargarTiendas() {
    const res = await fetch('/api/tiendas');
    const data = await res.json();
    tiendas = data.data || data || [];
    renderTiendas(tiendas);
    filtroTienda.innerHTML = `<option value="">Todas las tiendas</option>` +
      tiendas.map(t => `<option value="${t.id_tienda || t.id}">${t.nombre_tienda}</option>`).join('');
  }
  function renderTiendas(lista) {
    gridTiendas.innerHTML = lista.map(t => `
      <div class="card-tienda">
        <img src="${t.logo_url || 'https://via.placeholder.com/400x300?text=Tienda'}" alt="${t.nombre_tienda}" onerror="this.src='https://via.placeholder.com/400x300?text=Tienda'">
        <h3>${t.nombre_tienda}</h3>
        <p>${t.descripcion || ''}</p>
        <button class="btn-ver" data-ver-tienda data-id="${t.id_tienda || t.id}"><i class="fas fa-store"></i> Ver tienda</button>
      </div>
    `).join('');
    gridTiendas.querySelectorAll('[data-ver-tienda]').forEach(b => {
      b.addEventListener('click', () => abrirTienda(b.dataset.id));
    });
  }

  // ========== Productos ==========
  async function cargarProductos() {
    const res = await fetch('/api/productos');
    const data = await res.json();
    productos = data.data || data || [];
    renderProductos(productos);
  }
  function renderProductos(lista) {
    if (!lista.length) {
      gridProductos.innerHTML = `<div class="estado-vacio" style="grid-column:1/-1; text-align:center; padding:2rem;">No hay productos</div>`;
      return;
    }
    gridProductos.innerHTML = lista.map(p => {
      const pid = p.id_producto || p.id;
      return `
        <div class="card-producto">
          <img src="${p.imagen_url || 'https://via.placeholder.com/400x300?text=Producto'}" alt="${p.nombre_producto}" onerror="this.src='https://via.placeholder.com/400x300?text=Producto'">
          <h3>${p.nombre_producto}</h3>
          <p>${p.descripcion || ''}</p>
          <span class="precio">${(p.precio || 0)} Bs</span>
          <div style="display:flex; gap:.5rem; flex-wrap:wrap;">
            <button class="btn-ver" data-ver-producto data-id="${pid}"><i class="fas fa-eye"></i> Ver</button>
            <button class="btn-add" data-add data-id="${pid}"><i class="fas fa-cart-plus"></i> Añadir</button>
          </div>
        </div>
      `;
    }).join('');
    gridProductos.querySelectorAll('[data-ver-producto]').forEach(b => {
      b.addEventListener('click', () => abrirProducto(b.dataset.id));
    });
    gridProductos.querySelectorAll('[data-add]').forEach(b => {
      b.addEventListener('click', () => addCarrito(parseInt(b.dataset.id, 10), 1));
    });
  }

  // ========== Comentarios ==========
  async function cargarComentarios() {
    try {
      const res = await fetch('/api/comentarios');
      const data = await res.json();
      const arr = (data.data || data || []).slice(0, 6);
      listaComentarios.innerHTML = arr.map(c => {
        const usuario = c.usuario?.name || 'Cliente';
        return `<li><strong>${usuario}</strong>: “${c.comentario}”</li>`;
      }).join('');
    } catch (_) { /* no-op */ }
  }

  // ========== Carrito ==========
  btnCart.addEventListener('click', toggleCart);
  cdClose.addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  function toggleCart() { cartDrawer.classList.toggle('abierto'); overlay.classList.toggle('mostrar'); }
  function closeCart() { cartDrawer.classList.remove('abierto'); overlay.classList.remove('mostrar'); }

  async function cargarCarrito() {
    const res = await fetch('/api/carrito', { headers: authHeaders() });
    const data = await res.json();
    carrito = data.data || null;
    renderCarrito();
  }
  async function ensureCarrito() {
    if (carrito) return carrito;
    await fetch('/api/carrito', { method: 'POST', headers: authHeaders() }); // crea si no existe
    await cargarCarrito();
    return carrito;
  }
  async function addCarrito(id_producto, cantidad) {
    try {
      await ensureCarrito();
      const res = await fetch('/api/carrito/detalle', {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ id_producto, cantidad })
      });
      if (!res.ok) {
        const r = await res.json().catch(() => ({}));
        throw new Error(r.message || 'No se pudo agregar');
      }
      toast('Producto agregado al carrito');
      await cargarCarrito();
    } catch (e) {
      toast(e.message || 'Error al agregar', 'error');
    }
  }
  function renderCarrito() {
    const detalles = carrito?.detalles || [];
    cartBadge.textContent = detalles.reduce((a, d) => a + (d.cantidad || 0), 0);
    if (!detalles.length) {
      cdLista.innerHTML = `<div class="estado-vacio">Tu carrito está vacío</div>`;
      cdSubtotal.textContent = '0 Bs'; cdTotal.textContent = '0 Bs';
      return;
    }
    cdLista.innerHTML = detalles.map(d => {
      const p = d.producto || {};
      const img = p.imagen_url || 'https://via.placeholder.com/200?text=Producto';
      const nombre = p.nombre_producto || 'Producto';
      const precio = p.precio || 0;
      const idDetalle = d.id_detalle;
      return `
        <div class="cd-item">
          <img src="${img}" alt="${nombre}">
          <div>
            <div class="cd-name">${nombre}</div>
            <div class="cd-meta">${precio} Bs c/u</div>
            <div class="cd-qty">
              <button data-qty-minus data-id="${idDetalle}">−</button>
              <span>${d.cantidad}</span>
              <button data-qty-plus data-id="${idDetalle}">+</button>
              <button class="cd-del" data-qty-del data-id="${idDetalle}"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        </div>
      `;
    }).join('');
    const subtotal = detalles.reduce((a, d) => a + (d.cantidad * (d.producto?.precio || 0)), 0);
    cdSubtotal.textContent = `${subtotal} Bs`;
    cdTotal.textContent = `${subtotal} Bs`;

    cdLista.querySelectorAll('[data-qty-plus]').forEach(b => b.addEventListener('click', () => updateDetalle(parseInt(b.dataset.id, 10), +1)));
    cdLista.querySelectorAll('[data-qty-minus]').forEach(b => b.addEventListener('click', () => updateDetalle(parseInt(b.dataset.id, 10), -1)));
    cdLista.querySelectorAll('[data-qty-del]').forEach(b => b.addEventListener('click', () => deleteDetalle(parseInt(b.dataset.id, 10))));
  }
  async function updateDetalle(id_detalle, delta) {
    try {
      const det = carrito.detalles.find(x => x.id_detalle === id_detalle);
      if (!det) return;
      const nueva = Math.max(1, (det.cantidad || 1) + delta);
      const res = await fetch(`/api/carrito/detalle/${id_detalle}`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify({ cantidad: nueva })
      });
      if (!res.ok) throw new Error('No se pudo actualizar cantidad');
      await cargarCarrito();
    } catch (e) { toast(e.message, 'error'); }
  }
  async function deleteDetalle(id_detalle) {
    try {
      const res = await fetch(`/api/carrito/detalle/${id_detalle}`, { method: 'DELETE', headers: authHeaders() });
      if (!res.ok) throw new Error('No se pudo eliminar');
      await cargarCarrito();
    } catch (e) { toast(e.message, 'error'); }
  }

  // Crear pedido
  cdComprar.addEventListener('click', async () => {
    try {
      const res = await fetch('/api/pedidos', { method: 'POST', headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'No se pudo crear el pedido');
      toast('Pedido creado. La tienda te contactará para coordinar el pago.');
      await cargarCarrito();
      closeCart();
    } catch (e) {
      toast(e.message || 'Error', 'error');
    }
  });

  // ========== Filtros & Buscador ==========
  filtroTienda.addEventListener('change', filtrar);
  btnLimpiarFiltro.addEventListener('click', () => {
    categoriaFiltroActual = null; filtroTienda.value = ''; buscador.value = '';
    btnLimpiarFiltro.style.display = 'none'; filtrar();
  });
  buscador.addEventListener('input', filtrar);

  function filtrar() {
    const q = (buscador.value || '').toLowerCase().trim();
    const tiendaSel = filtroTienda.value;

    // tiendas
    const tiendasFiltradas = tiendas.filter(t => !q || (t.nombre_tienda || '').toLowerCase().includes(q));
    renderTiendas(tiendasFiltradas);

    // productos
    let lista = productos.slice();
    if (q) {
      lista = lista.filter(p => {
        const inNombre = (p.nombre_producto || '').toLowerCase().includes(q);
        const inTienda = tiendas.some(t => (t.id_tienda || t.id) === (p.id_tienda) && (t.nombre_tienda || '').toLowerCase().includes(q));
        return inNombre || inTienda;
      });
    }
    if (categoriaFiltroActual != null) {
      lista = lista.filter(p => (p.id_categoria || p.categoria_id || p.id_categoria_producto) == categoriaFiltroActual);
      btnLimpiarFiltro.style.display = 'inline-flex';
    }
    if (tiendaSel) {
      lista = lista.filter(p => String(p.id_tienda) === String(tiendaSel));
    }
    renderProductos(lista);
  }

  // ========== Modal Tienda ==========
  function abrirTienda(id) {
    const t = tiendas.find(x => String(x.id_tienda || x.id) === String(id));
    if (!t) return;
    mtLogo.src = t.logo_url || 'https://via.placeholder.com/150?text=Tienda';
    mtNombre.textContent = t.nombre_tienda;
    mtDesc.textContent = t.descripcion || '';
    const prods = productos.filter(p => String(p.id_tienda) === String(t.id_tienda || t.id));
    mtProductos.innerHTML = prods.map(p => {
      const pid = p.id_producto || p.id;
      return `
        <div class="mt-item">
          <img src="${p.imagen_url || 'https://via.placeholder.com/400x300?text=Producto'}" alt="${p.nombre_producto}">
          <div><strong>${p.nombre_producto}</strong></div>
          <div class="precio">${p.precio || 0} Bs</div>
          <button class="btn-add" data-add data-id="${pid}"><i class="fas fa-cart-plus"></i> Añadir</button>
        </div>`;
    }).join('') || `<div class="estado-vacio" style="grid-column:1/-1; text-align:center;">Sin productos</div>`;
    mtProductos.querySelectorAll('[data-add]').forEach(b => {
      b.addEventListener('click', () => addCarrito(parseInt(b.dataset.id, 10), 1));
    });
    modalTienda.classList.add('mostrar');
  }

  // ========== Modal Producto ==========
  function abrirProducto(id) {
    const p = productos.find(x => String(x.id_producto || x.id) === String(id));
    if (!p) return;
    prodActual = p;
    mpImg.src = p.imagen_url || 'https://via.placeholder.com/400x300?text=Producto';
    mpNombre.textContent = p.nombre_producto;
    mpDesc.textContent = p.descripcion || '';
    mpPrecio.textContent = `${p.precio || 0} Bs`;
    mpCant.value = 1; mpMsg.style.display = 'none';
    modalProducto.classList.add('mostrar');
  }
  mpMas.addEventListener('click', () => mpCant.value = Math.max(1, parseInt(mpCant.value || 1, 10) + 1));
  mpMenos.addEventListener('click', () => mpCant.value = Math.max(1, parseInt(mpCant.value || 1, 10) - 1));
  mpAdd.addEventListener('click', async () => {
    if (!prodActual) return;
    await addCarrito(parseInt(prodActual.id_producto || prodActual.id, 10), Math.max(1, parseInt(mpCant.value || 1, 10)));
    mpMsg.style.display = 'block'; setTimeout(() => mpMsg.style.display = 'none', 1500);
  });

  // ========== Carga inicial ==========
  await cargarPerfilHeader();
  await cargarCategorias();
  await cargarTiendas();
  await cargarProductos();
  await cargarCarrito();
  await cargarComentarios();
  filtrar();

  // ESC cierra cosas
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      menuPerfil?.classList.remove('mostrar');
      modalTienda?.classList.remove('mostrar');
      modalProducto?.classList.remove('mostrar');
      cartDrawer?.classList.remove('abierto');
      overlay?.classList.remove('mostrar');
    }
  });
}

// =========================
// Pedidos (modal)
// =========================
async function cargarPedidos() {
  try {
    const res = await fetch('/api/pedidos', { headers: authHeaders() });
    const json = await res.json();
    const pedidos = json.data || [];
    renderPedidos(pedidos);
  } catch (e) {
    renderPedidos([]); toast('No pude cargar tus pedidos');
  }
}
function renderPedidos(pedidos) {
  const cont = document.getElementById('pedidos-lista');
  if (!cont) return;
  if (!pedidos.length) {
    cont.innerHTML = `<div class="estado-vacio"><p>No tienes pedidos aún</p></div>`;
    return;
  }
  cont.innerHTML = pedidos.map(p => `
    <div class="pedido-card">
      <div class="pedido-head">
        <div>
          <span class="pedido-id">Pedido #${p.id_pedido}</span>
          <div class="pedido-sub">Total: <strong>${(p.total || 0)} Bs</strong> • ${formatDate(p.created_at)}</div>
        </div>
        <span class="pedido-estado ${p.estado}">${p.estado.replace('_',' ')}</span>
      </div>
      <div class="pedido-items">
        ${(p.detalles || []).map(d => `
          <div class="pedido-item">
            <img src="${(d.producto?.imagen_url) || '/placeholder-producto.jpg'}" alt="">
            <div>
              <div class="pi-name">${d.producto?.nombre_producto || 'Producto'} (x${d.cantidad})</div>
              <div class="pedido-sub">Tienda: ${d.tienda?.nombre_tienda || '-'} • ${d.precio_unitario} Bs c/u</div>
            </div>
            ${p.estado === 'entregado' ? `<button class="btn-pill secondary" onclick="abrirResena(${d.producto?.id_producto})">Reseñar</button>` : ''}
          </div>
        `).join('')}
      </div>
      <div class="pedido-actions">
        ${p.estado !== 'entregado' && p.estado !== 'cancelado' ? `<button class="btn-pill warn" onclick="cancelarPedido(${p.id_pedido})">Cancelar</button>` : ''}
      </div>
    </div>
  `).join('');
}
// cancelar -> usa tu endpoint del controlador: cancelarPedido($id)
window.cancelarPedido = async function (id) {
  if (!confirm('¿Seguro que deseas cancelar este pedido?')) return;
  try {
    const res = await fetch(`/api/pedidos/${id}/cancelar`, { method: 'POST', headers: authHeaders() });
    const j = await res.json();
    if (!j.success) throw new Error();
    toast('Pedido cancelado'); await cargarPedidos();
  } catch (e) { toast('No pude cancelar el pedido'); }
};

// =========================
// Reseñas (modal)
// =========================
window.abrirResena = function (idProducto) {
  document.getElementById('resena-id-producto').value = idProducto;
  document.getElementById('resena-calificacion').value = '5';
  document.getElementById('resena-comentario').value = '';
  abrirModal('modal-resena');
};
document.getElementById('form-resena')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id_producto = document.getElementById('resena-id-producto').value;
  const calificacion = parseInt(document.getElementById('resena-calificacion').value, 10);
  const comentario = document.getElementById('resena-comentario').value.trim();
  try {
    const res = await fetch('/api/comentarios', {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ id_producto, calificacion, comentario })
    });
    const j = await res.json();
    if (!j.success) throw new Error();
    document.getElementById('resena-msg').style.display = 'block';
    setTimeout(() => {
      document.getElementById('resena-msg').style.display = 'none';
      cerrarModal('modal-resena');
    }, 1200);
  } catch (e2) { toast('No pude publicar tu reseña'); }
});
