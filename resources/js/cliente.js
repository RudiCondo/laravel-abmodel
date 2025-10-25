document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) return window.location.href = '/';

  // 🌸 Elementos globales
  const saludo = document.getElementById('saludo-cliente');
  const correo = document.getElementById('correo-usuario');
  const telefono = document.getElementById('telefono-usuario');
  const direccion = document.getElementById('direccion-usuario');
  const perfilDropdown = document.getElementById('perfil-dropdown');
  const btnPerfil = document.getElementById('btn-perfil');
  const btnLogout = document.getElementById('btn-logout');
  const productosGrid = document.getElementById('grid-productos');
  const tiendasGrid = document.getElementById('grid-tiendas');
  const btnCarrito = document.getElementById('btn-carrito');
  const seccionCarrito = document.getElementById('seccion-carrito');
  const inputBusqueda = document.getElementById('input-busqueda-header');

  let todosLosProductos = [];

  // 🌸 Cargar perfil y saludo
  try {
    const res = await fetch('/api/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });

    if (res.ok) {
      const user = await res.json();
      saludo.textContent = `Bienvenid@, ${user.name}`;
      correo.textContent = user.email;
      telefono.textContent = user.telefono ?? 'No registrado';
      direccion.textContent = user.direccion ?? 'No registrada';
    }
  } catch (error) {
    console.error('Error al cargar perfil:', error);
  }

  // 🔽 Mostrar/ocultar menú de perfil
  btnPerfil?.addEventListener('click', () => {
    perfilDropdown?.classList.toggle('hidden');
  });

  // 🔐 Cerrar sesión
  btnLogout?.addEventListener('click', async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
  });

  // 🔽 Cerrar perfil al hacer clic fuera
  document.addEventListener('click', (event) => {
    const isClickInside = perfilDropdown?.contains(event.target) || btnPerfil?.contains(event.target);
    if (!isClickInside) {
      perfilDropdown?.classList.add('hidden');
    }
  });

  // 🏪 Mostrar tiendas
  function mostrarTiendas(lista) {
    tiendasGrid.innerHTML = `<h2>🏪 Tiendas disponibles</h2>`;
    if (!lista || lista.length === 0) {
      tiendasGrid.innerHTML += `<p>No hay tiendas disponibles.</p>`;
      return;
    }

    lista.forEach(tienda => {
      const card = document.createElement('div');
      card.classList.add('card-tienda');
      card.innerHTML = `
        <img src="${tienda.logo_url}" alt="${tienda.nombre_tienda}">
        <h3>${tienda.nombre_tienda}</h3>
        <p>${tienda.descripcion}</p>
      `;
      tiendasGrid.appendChild(card);
    });
  }

  // 🏪 Cargar tiendas
  async function cargarTiendas() {
    try {
      const res = await fetch('/api/tiendas');
      const tiendas = await res.json();
      mostrarTiendas(tiendas);
    } catch (error) {
      console.error('Error al cargar tiendas:', error);
    }
  }

  // 🎨 Cargar productos por categoría
  document.querySelectorAll('.categoria-icon').forEach(icon => {
    icon.addEventListener('click', async (e) => {
      e.preventDefault();
      const categoriaId = icon.dataset.id;

      try {
        const res = await fetch(`/api/categorias/${categoriaId}`);
        const data = await res.json();
        productosGrid.innerHTML = `<h2>Productos de la categoría</h2>`;
        mostrarProductos(data.productos ?? []);
      } catch (error) {
        console.error('Error al cargar productos por categoría:', error);
      }
    });
  });

  // 🧴 Cargar productos destacados al iniciar
  async function cargarProductosDestacados() {
    try {
      const res = await fetch('/api/productos');
      const productos = await res.json();
      todosLosProductos = productos;
      productosGrid.innerHTML = `<h2>🧴 Productos destacados</h2>`;
      mostrarProductos(productos);
    } catch (error) {
      console.error('Error al cargar productos destacados:', error);
    }
  }

  // 🔍 Filtrar productos por nombre desde el header
  inputBusqueda?.addEventListener('input', () => {
    const texto = inputBusqueda.value.toLowerCase();
    const filtrados = todosLosProductos.filter(p =>
      p.nombre.toLowerCase().includes(texto)
    );
    productosGrid.innerHTML = `<h2>Resultados de búsqueda</h2>`;
    mostrarProductos(filtrados);
  });

  // 🧩 Mostrar productos
  function mostrarProductos(productos) {
    productosGrid.innerHTML += '<div class="productos-lista"></div>';
    const contenedor = productosGrid.querySelector('.productos-lista');

    if (!productos || productos.length === 0) {
      contenedor.innerHTML = `<p>No hay productos disponibles.</p>`;
      return;
    }

    productos.forEach(producto => {
      const card = document.createElement('div');
      card.classList.add('producto-card');
      card.innerHTML = `
        <img src="${producto.imagen_url}" alt="${producto.nombre}" class="producto-img">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p><strong>Precio:</strong> Bs ${producto.precio}</p>
        <p><strong>Tienda:</strong> ${producto.tienda?.nombre ?? 'Sin tienda'}</p>
        <button class="btn-agregar" data-id="${producto.id}">Comprar ahora</button>
      `;
      contenedor.appendChild(card);
    });

    contenedor.querySelectorAll('.btn-agregar').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const res = await fetch('/api/carrito/detalle', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({ producto_id: id, cantidad: 1 })
        });

        if (res.ok) {
          btn.textContent = 'Agregado 🎉';
          btn.disabled = true;
        } else {
          alert('No se pudo agregar. Intenta nuevamente.');
        }
      });
    });
  }

  // 🛒 Mostrar carrito
  btnCarrito?.addEventListener('click', async () => {
    seccionCarrito.classList.remove('hidden');
    productosGrid.innerHTML = '';

    try {
      const res = await fetch('/api/carrito', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });

      const carrito = await res.json();
      seccionCarrito.innerHTML = `<h2>🛒 Tu carrito</h2>`;

      if (!carrito.detalles || carrito.detalles.length === 0) {
        seccionCarrito.innerHTML += `<p>Tu carrito está vacío.</p>`;
        return;
      }

      carrito.detalles.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('carrito-item');
        card.innerHTML = `
          <h3>${item.producto.nombre}</h3>
          <p><strong>Precio:</strong> Bs ${item.producto.precio}</p>
          <p><strong>Cantidad:</strong> 
            <input type="number" min="1" value="${item.cantidad}" data-id="${item.id}" class="input-cantidad">
          </p>
          <button class="btn-eliminar" data-id="${item.id}">Eliminar</button>
        `;
        seccionCarrito.appendChild(card);
      });

      // 🎯 Modificar cantidad
      seccionCarrito.querySelectorAll('.input-cantidad').forEach(input => {
        input.addEventListener('change', async () => {
          const id = input.dataset.id;
          const nuevaCantidad = input.value;

          await fetch(`/api/carrito/detalle/${id}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({ cantidad: nuevaCantidad })
          });
        });
      });

      // 🗑 Eliminar producto
      seccionCarrito.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id;

                    await fetch(`/api/carrito/detalle/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            }
          });

          btn.parentElement.remove();
        });
      });

      // ✅ Confirmar pedido
      const confirmar = document.createElement('button');
      confirmar.textContent = 'Confirmar pedido';
      confirmar.classList.add('btn-confirmar');
      confirmar.addEventListener('click', async () => {
        try {
          const res = await fetch('/api/pedidos', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            }
          });

          if (res.ok) {
            seccionCarrito.innerHTML = `<p>🎉 Pedido confirmado. Gracias por tu compra.</p>`;
          } else {
            alert('No se pudo confirmar el pedido.');
          }
        } catch (error) {
          console.error('Error al confirmar el pedido:', error);
        }
      });

      seccionCarrito.appendChild(confirmar);

    } catch (error) {
      console.error('Error al cargar el carrito:', error);
    }
  });

  // 🧭 Ejecutar funciones iniciales
  await cargarTiendas();
  await cargarProductosDestacados();
});
