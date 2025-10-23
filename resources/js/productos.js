document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const grid = document.getElementById('grid-productos');

  if (!token || !grid) return;

  try {
    const res = await fetch('/api/productos');
    const productos = await res.json();

    productos.forEach(producto => {
      const card = document.createElement('div');
      card.classList.add('producto-card');

      card.innerHTML = `
        <img src="${producto.imagen_url}" alt="${producto.nombre}" class="producto-img">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p><strong>Precio:</strong> Bs ${producto.precio}</p>
        <p><strong>Tienda:</strong> ${producto.tienda?.nombre || 'Sin tienda'}</p>
        <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
      `;

      grid.appendChild(card);
    });

    document.querySelectorAll('.btn-agregar').forEach(btn => {
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
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
});
