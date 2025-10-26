document.addEventListener('DOMContentLoaded', async () => {
  await cargarTiendas();
  await cargarProductos();
  await cargarComentarios();
  activarFiltroCategorias();
});

// 🔍 Elementos globales
const inputBusqueda = document.getElementById('input-busqueda-header');
const gridTiendas = document.querySelector('.grid-tiendas');
const gridProductos = document.querySelector('.grid-productos');
let todasLasTiendas = [];
let todosLosProductos = [];

// 🏪 Cargar y mostrar tiendas
async function cargarTiendas() {
  const res = await fetch('/api/tiendas');
  const data = await res.json();
  todasLasTiendas = data.data || data;
  mostrarTiendas(todasLasTiendas);
}

function mostrarTiendas(lista) {
  if (!gridTiendas) return;
  gridTiendas.innerHTML = '';
  lista.forEach(tienda => {
    const card = document.createElement('div');
    card.classList.add('card-tienda');
    card.innerHTML = `
      <div class="tienda-imagen">
        <img src="${tienda.logo_url}" alt="${tienda.nombre_tienda}">
      </div>
      <div class="tienda-info">
        <h3>${tienda.nombre_tienda}</h3>
        <p>${tienda.descripcion}</p>
        <button class="btn-ver" data-auth-trigger>Descubrir tienda</button>
      </div>
    `;
    gridTiendas.appendChild(card);
  });
}

// 🔍 Filtrar tiendas por nombre desde el header
if (inputBusqueda) {
  inputBusqueda.addEventListener('input', () => {
    const texto = inputBusqueda.value.toLowerCase();
    const filtradas = todasLasTiendas.filter(tienda =>
      tienda.nombre_tienda.toLowerCase().includes(texto)
    );
    mostrarTiendas(filtradas);
  });
}

// 🧴 Cargar productos destacados
async function cargarProductos(idCategoria = null) {
  const res = await fetch('/api/productos');
  const data = await res.json();
  todosLosProductos = data.data || data;

  const filtrados = idCategoria
    ? todosLosProductos.filter(p => p.id_categoria == idCategoria)
    : todosLosProductos;

  mostrarProductos(filtrados.slice(0, 6));
}

function mostrarProductos(lista) {
  if (!gridProductos) return;
  gridProductos.innerHTML = '';
  lista.forEach(prod => {
    const card = document.createElement('div');
    card.classList.add('card-producto');
    card.innerHTML = `
      <div class="producto-imagen">
        <img src="${prod.imagen_url}" alt="${prod.nombre_producto}">
      </div>
      <div class="producto-info">
        <h3>${prod.nombre_producto}</h3>
        <p class="precio">${prod.precio} Bs</p>
        <button class="btn-ver" data-auth-trigger>Descubrir</button>
      </div>
    `;
    gridProductos.appendChild(card);
  });
}

// 🧿 Activar filtrado por categoría
function activarFiltroCategorias() {
  document.querySelectorAll('.categoria-icon').forEach(icon => {
    icon.addEventListener('click', e => {
      e.preventDefault();
      const id = icon.dataset.id;
      cargarProductos(id);
    });
  });
}

// 🔐 Activar modal de login al presionar botones
document.addEventListener('click', e => {
  if (e.target.matches('[data-auth-trigger]')) {
    e.preventDefault();
    const modal = document.getElementById('modal-auth');
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('activo');
    }
  }
});

// 💬 Cargar comentarios recientes
async function cargarComentarios() {
  const res = await fetch('/api/comentarios');
  const data = await res.json();
  const lista = document.querySelector('.lista-comentarios');
  if (!lista) return;

  (data.data || data).slice(0, 5).forEach(com => {
    const item = document.createElement('li');
    item.innerHTML = `<strong>${com.usuario_nombre}</strong>: "${com.comentario}"`;
    lista.appendChild(item);
  });
}
