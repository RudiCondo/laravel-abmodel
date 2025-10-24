document.addEventListener('DOMContentLoaded', async () => {
  await cargarCategorias(); // PRIMERO cargar categorías
  await cargarTiendas();
  await cargarProductos();
  await cargarComentarios();
  configurarBotonesDescubrir(); // Configurar redirección a login
});

// 🔍 Elementos globales
const inputBusqueda = document.getElementById('input-busqueda-header');
const gridTiendas = document.querySelector('.grid-tiendas');
const gridProductos = document.querySelector('.grid-productos');
const categoriasContainer = document.getElementById('categorias-container');
const categoriaActual = document.getElementById('categoria-actual');
const btnLimpiarFiltro = document.getElementById('btn-limpiar-filtro');

let todasLasTiendas = [];
let todosLosProductos = [];
let categoriaFiltroActual = null;

// 🌸 CARGAR CATEGORÍAS DESDE LA BD - CORREGIDO
async function cargarCategorias() {
  try {
    const res = await fetch('/api/categorias');
    const data = await res.json();
    const categorias = data.data || data;
    
    console.log('Categorías cargadas:', categorias); // Para debug
    
    mostrarCategorias(categorias);
  } catch (error) {
    console.error('Error cargando categorías:', error);
    mostrarCategoriasPorDefecto();
  }
}

function mostrarCategorias(categorias) {
  if (!categoriasContainer) return;
  
  console.log('Rutas de imágenes disponibles:', window.rutasImagenes); // Debug
  
  categoriasContainer.innerHTML = categorias.map(cat => `
    <div class="categoria-icon" data-id="${cat.id_categoria}" data-name="${cat.nombre_categoria}">
      <img src="${obtenerImagenCategoria(cat.nombre_categoria)}" 
           alt="${cat.nombre_categoria}"
           onerror="this.src='${obtenerImagenPorDefecto()}'">
      <span class="categoria-nombre">${cat.nombre_categoria}</span>
    </div>
  `).join('');
  
  // Activar event listeners para las categorías
  activarFiltroCategorias();
}

// 🖼️ ASIGNAR IMÁGENES DESDE RESOURCES/IMG - CORREGIDO CON VITE
function obtenerImagenCategoria(nombreCategoria) {
  // Usar las rutas de Vite que pasamos desde Blade
  if (window.rutasImagenes) {
    const nombreLower = nombreCategoria.toLowerCase();
    
    if (nombreLower.includes('maquillaje') || nombreLower.includes('cosmético') || nombreLower.includes('makeup')) {
      return window.rutasImagenes.maquillaje;
    }
    else if (nombreLower.includes('skincare') || nombreLower.includes('facial') || nombreLower.includes('piel')) {
      return window.rutasImagenes.skincare;
    }
    else if (nombreLower.includes('fragancia') || nombreLower.includes('perfume') || nombreLower.includes('aroma')) {
      return window.rutasImagenes.fragancias;
    }
    else if (nombreLower.includes('accesorio') || nombreLower.includes('belleza') || nombreLower.includes('complemento')) {
      return window.rutasImagenes.accesorios;
    }
    else {
      return window.rutasImagenes.accesorios; // Default
    }
  }
  
  // Fallback si no hay window.rutasImagenes
  return "/images/placeholder-categoria.png";
}

function obtenerImagenPorDefecto() {
  if (window.rutasImagenes) {
    return window.rutasImagenes.accesorios;
  }
  return "/images/placeholder-categoria.png";
}

function mostrarCategoriasPorDefecto() {
  const categoriasDefault = [
    { id_categoria: 1, nombre_categoria: 'Maquillaje' },
    { id_categoria: 2, nombre_categoria: 'Skincare' },
    { id_categoria: 3, nombre_categoria: 'Fragancias' },
    { id_categoria: 4, nombre_categoria: 'Accesorios' }
  ];
  
  mostrarCategorias(categoriasDefault);
}

// 🎯 FILTRAR PRODUCTOS POR CATEGORÍA - CORREGIDO
function activarFiltroCategorias() {
  document.querySelectorAll('.categoria-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      const idCategoria = parseInt(icon.dataset.id);
      const nombreCategoria = icon.dataset.name;
      
      console.log(`Filtrando por categoría: ${nombreCategoria} (ID: ${idCategoria})`);
      
      // Aplicar filtro
      categoriaFiltroActual = idCategoria;
      aplicarFiltroCategoria(idCategoria, nombreCategoria);
    });
  });
}

function aplicarFiltroCategoria(idCategoria, nombreCategoria) {
  // Mostrar categoría actual
  if (categoriaActual) {
    categoriaActual.textContent = `Filtrado por: ${nombreCategoria}`;
  }
  if (btnLimpiarFiltro) {
    btnLimpiarFiltro.style.display = 'block';
  }
  
  // Filtrar productos - probar diferentes nombres de campo
  const productosFiltrados = todosLosProductos.filter(prod => {
    // Intentar diferentes nombres de campo que pueda tener tu producto
    return prod.id_categoria == idCategoria || 
           prod.categoria_id == idCategoria ||
           prod.id_categoria_producto == idCategoria;
  });
  
  console.log(`Productos filtrados: ${productosFiltrados.length} de ${todosLosProductos.length}`);
  
  mostrarProductos(productosFiltrados);
  
  // Scroll suave a productos
  const seccionProductos = document.querySelector('.productos-destacados');
  if (seccionProductos) {
    seccionProductos.scrollIntoView({ 
      behavior: 'smooth' 
    });
  }
}

// 🔄 LIMPIAR FILTRO
if (btnLimpiarFiltro) {
  btnLimpiarFiltro.addEventListener('click', () => {
    limpiarFiltro();
  });
}

function limpiarFiltro() {
  categoriaFiltroActual = null;
  if (categoriaActual) categoriaActual.textContent = '';
  if (btnLimpiarFiltro) btnLimpiarFiltro.style.display = 'none';
  mostrarProductos(todosLosProductos.slice(0, 6));
}

// 🧴 CARGAR PRODUCTOS (ACTUALIZADO PARA DEBUG)
async function cargarProductos() {
  try {
    const res = await fetch('/api/productos');
    const data = await res.json();
    todosLosProductos = data.data || data;
    
    console.log('Productos cargados:', todosLosProductos); // Para debug
    
    // Ver estructura de un producto
    if (todosLosProductos.length > 0) {
      console.log('Estructura del primer producto:', todosLosProductos[0]);
    }
    
    mostrarProductos(todosLosProductos.slice(0, 6));
  } catch (error) {
    console.error('Error cargando productos:', error);
  }
}

function mostrarProductos(lista) {
  if (!gridProductos) return;
  
  if (lista.length === 0) {
    gridProductos.innerHTML = `
      <div class="estado-vacio" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <p>No hay productos en esta categoría</p>
      </div>
    `;
    return;
  }
  
  gridProductos.innerHTML = lista.map(prod => `
    <div class="card-producto">
      <div class="producto-imagen">
        <img src="${prod.imagen_url || '/placeholder-producto.jpg'}" 
             alt="${prod.nombre_producto || 'Producto'}"
             onerror="this.src='/placeholder-producto.jpg'">
      </div>
      <div class="producto-info">
        <h3>${prod.nombre_producto || 'Producto'}</h3>
        <p class="precio">${prod.precio || '0'} Bs</p>
        <button class="btn-ver" data-auth-trigger data-tipo="producto" data-id="${prod.id}">
          Descubrir
        </button>
      </div>
    </div>
  `).join('');
  
  // Re-configurar botones después de renderizar
  configurarBotonesDescubrir();
}

// 🔐 CONFIGURAR BOTONES "DESCUBRIR" PARA REDIRIGIR AL LOGIN
function configurarBotonesDescubrir() {
  document.querySelectorAll('.btn-ver[data-auth-trigger]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      abrirModalLogin();
    });
  });
}

function abrirModalLogin() {
  const modal = document.getElementById('modal-auth');
  if (modal) {
    modal.style.display = 'block';
    modal.classList.add('activo');
    
    // Opcional: Mostrar tab de login por defecto
    const tabLogin = document.querySelector('[data-tab="login"]');
    if (tabLogin) {
      tabLogin.click();
    }
  } else {
    // Fallback: Redirigir a página de login
    window.location.href = '/login';
  }
}

// 🏪 CARGAR TIENDAS (MANTENER TU CÓDIGO ACTUAL)
async function cargarTiendas() {
  try {
    const res = await fetch('/api/tiendas');
    const data = await res.json();
    todasLasTiendas = data.data || data;
    mostrarTiendas(todasLasTiendas);
  } catch (error) {
    console.error('Error cargando tiendas:', error);
  }
}

function mostrarTiendas(lista) {
  if (!gridTiendas) return;
  
  gridTiendas.innerHTML = lista.map(tienda => `
    <div class="card-tienda">
      <div class="tienda-imagen">
        <img src="${tienda.logo_url || '/placeholder-tienda.jpg'}" 
             alt="${tienda.nombre_tienda}"
             onerror="this.src='/placeholder-tienda.jpg'">
      </div>
      <div class="tienda-info">
        <h3>${tienda.nombre_tienda}</h3>
        <p>${tienda.descripcion}</p>
        <button class="btn-ver" data-auth-trigger data-tipo="tienda" data-id="${tienda.id}">
          Descubrir tienda
        </button>
      </div>
    </div>
  `).join('');
  
  // Re-configurar botones después de renderizar
  configurarBotonesDescubrir();
}

// 🔍 BUSCADOR (MANTENER TU CÓDIGO)
if (inputBusqueda) {
  inputBusqueda.addEventListener('input', () => {
    const texto = inputBusqueda.value.toLowerCase();
    const filtradas = todasLasTiendas.filter(tienda =>
      tienda.nombre_tienda.toLowerCase().includes(texto)
    );
    mostrarTiendas(filtradas);
  });
}

// 💬 COMENTARIOS (MANTENER TU CÓDIGO)
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