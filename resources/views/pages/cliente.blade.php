@php $esPublica = false; @endphp
@extends('layouts.app')

@section('title', 'ABMODEL — Mi cuenta')

@section('content')
<!-- Ocultamos header global en esta vista -->
<style>
  header.site-header, .header-completo, .main-header, .app-header { display: none !important; }
</style>

<section class="pantalla-cliente">
  <!-- HEADER CLIENTE -->
  <header class="header-cliente card-base">
    <div class="hc-left">
      <h1 class="hc-title">Hola, <span id="cli-nombre">Cliente</span> 👋</h1>
      <p class="hc-sub">Explora productos y coordina la compra con la tienda.</p>
    </div>

    <div class="hc-center">
      <input id="hc-buscador" class="input-ceremonial" placeholder="Buscar productos o tiendas…" autocomplete="off">
    </div>

    <div class="hc-right">
      <!-- Carrito -->
      <button id="btn-cart" class="hc-icon-btn" title="Carrito">
        <i class="fas fa-shopping-bag"></i>
        <span id="cart-badge" class="hc-badge">0</span>
      </button>

      <!-- Perfil -->
      <div class="hc-profile">
        <button class="hc-icon-btn" id="btn-perfil" title="Perfil">
          <i class="fas fa-user-circle"></i>
        </button>

        <div class="menu-perfil-emprendedor" id="menu-perfil">
          <div class="profile-header">
            <div class="profile-avatar-large"><i class="fas fa-user"></i></div>
            <div class="profile-info">
              <strong id="perfil-nombre-menu">Usuario</strong>
              <span id="perfil-email">usuario@ejemplo.com</span>
              <span class="profile-rol" id="perfil-rol">Cliente</span>
            </div>
          </div>
          <div class="menu-divider"></div>
          <div class="menu-items">
            <a href="#" class="menu-item" id="pf-open"><i class="fas fa-id-card"></i><span>Mi perfil</span></a>
            <a href="#" class="menu-item" id="pf-pedidos"><i class="fas fa-box"></i><span>Mis pedidos</span></a>
            <div class="menu-divider"></div>
            <button id="btn-logout" class="menu-item logout-btn">
              <i class="fas fa-sign-out-alt"></i><span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- CATEGORÍAS (igual estética a la pública) -->
  <section class="categorias-belleza card-base">
    <div class="saludo"><h2>Explora por categoría</h2></div>
    <div class="categorias" id="categorias-container">
      <div class="categoria-skeleton"><div class="skeleton-img"></div><div class="skeleton-text short"></div></div>
      <div class="categoria-skeleton"><div class="skeleton-img"></div><div class="skeleton-text short"></div></div>
      <div class="categoria-skeleton"><div class="skeleton-img"></div><div class="skeleton-text short"></div></div>
      <div class="categoria-skeleton"><div class="skeleton-img"></div><div class="skeleton-text short"></div></div>
    </div>
  </section>

  <!-- TIENDAS -->
  <section class="tiendas-destacadas">
    <h2>Tiendas</h2>
    <div class="grid-tiendas" id="grid-tiendas"></div>
  </section>

  <!-- PRODUCTOS -->
  <section class="productos-destacados">
    <div class="pd-header">
      <h2>Productos</h2>
      <div class="pd-actions">
        <select id="filtro-tienda" class="input-ceremonial" style="max-width:280px;">
          <option value="">Todas las tiendas</option>
        </select>
        <button id="btn-limpiar-filtro" class="btn-ceremonial" style="width:auto;display:none;">Ver todo</button>
      </div>
    </div>
    <div id="grid-productos" class="grid-productos"></div>
  </section>

  <!-- RESEÑAS -->
  <section class="comentarios-recientes">
    <h2>Reseñas recientes</h2>
    <ul class="lista-comentarios" id="lista-comentarios"></ul>
  </section>
</section>

<!-- DRAWER CARRITO -->
<aside id="cart-drawer" class="cart-drawer">
  <div class="cd-header">
    <h3>Tu carrito</h3>
    <button id="cd-close" class="hc-icon-btn"><i class="fas fa-times"></i></button>
  </div>
  <div id="cd-lista" class="cd-lista"></div>
  <div class="cd-resumen card-base">
    <p class="cd-row"><span>Subtotal</span><strong id="cd-subtotal">0 Bs</strong></p>
    <!-- Oculto por ahora -->
    <p class="cd-row cd-row-delivery" id="cd-delivery-row" style="display:none;"><span>Delivery</span><strong id="cd-delivery">—</strong></p>
    <p class="cd-row cd-total"><span>Total</span><strong id="cd-total">0 Bs</strong></p>
    <button id="cd-comprar" class="btn-ceremonial">Confirmar pedido</button>
    <p id="cd-msg" class="mensaje-error error" style="display:none;margin-top:.75rem;">Error</p>
  </div>
</aside>
<div id="drawer-overlay" class="drawer-overlay"></div>

<!-- MODAL TIENDA -->
<div id="modal-tienda" class="modal-emprendedor">
  <div class="modal-card">
    <button class="modal-x" data-close-tienda><i class="fas fa-times"></i></button>
    <div class="tienda-top">
      <img id="mt-logo" src="" alt="logo">
      <div>
        <h3 id="mt-nombre">Tienda</h3>
        <p id="mt-desc">—</p>
      </div>
    </div>
    <div id="mt-productos" class="mt-grid">
      <!-- Cada ítem renderizado por JS debe incluir .btn-add data-producto="ID" -->
      <!-- Ejemplo:
      <div class="card-producto">
        <div class="producto-imagen"><img src="..." /></div>
        <div class="producto-info">
          <h3>Nombre</h3>
          <p class="precio">100 Bs</p>
          <button class="btn-ceremonial btn-add" data-producto="123">Añadir</button>
        </div>
      </div>
      -->
    </div>
  </div>
</div>

<!-- MODAL PRODUCTO (detalle + cantidad) -->
<div id="modal-producto" class="modal-emprendedor">
  <div class="modal-card">
    <button class="modal-x" data-close-producto><i class="fas fa-times"></i></button>
    <div class="mp-top">
      <img id="mp-img" src="" alt="producto">
      <div class="mp-info">
        <h3 id="mp-nombre">Producto</h3>
        <p id="mp-desc">—</p>
        <p class="mp-precio" id="mp-precio">0 Bs</p>
        <div class="qty-picker">
          <button id="mp-menos">−</button>
          <input id="mp-cant" type="number" min="1" value="1">
          <button id="mp-mas">+</button>
        </div>
        <button id="mp-add" class="btn-ceremonial" data-from="modal"><i class="fas fa-cart-plus"></i> Añadir al carrito</button>
        <p id="mp-msg" class="mensaje-error success" style="display:none;">Agregado</p>
      </div>
    </div>
  </div>
</div>

<!-- MODAL PERFIL -->
<div id="modal-perfil" class="modal-auth" style="display:none;">
  <div class="modal-content perfil-modal">
    <div class="modal-close" data-close-perfil>&times;</div>
    <h3 style="margin-bottom:1rem;color:var(--color-acento-oscuro);">Mi perfil</h3>
    <form id="form-perfil" class="form-emprendedor" style="max-width:520px;">
      <input class="input-ceremonial" id="pf-nombre" placeholder="Nombre completo" />
      <input class="input-ceremonial" id="pf-email" placeholder="Correo" type="email" />
      <input class="input-ceremonial" id="pf-telefono" placeholder="Celular" />
      <input class="input-ceremonial" id="pf-direccion" placeholder="Dirección" />
      <div style="display:flex;gap:.75rem;margin-top:.5rem;justify-content:flex-end">
        <button class="btn-ceremonial" type="submit" style="width:auto;">Guardar cambios</button>
        <button class="btn-ceremonial" type="button" id="pf-change-pass" style="width:auto;background:#6c757d;">Cambiar contraseña</button>
      </div>
      <p id="pf-msg" class="mensaje-error success" style="display:none;margin-top:.75rem;">Guardado</p>
    </form>
  </div>
</div>

<!-- MODAL PEDIDOS -->
<div id="modal-pedidos" class="modal-auth" style="display:none;">
  <div class="modal-content pedidos-modal">
    <div class="modal-close" data-close-pedidos>&times;</div>
    <h3 style="margin-bottom:1rem;color:var(--color-acento-oscuro);">Mis pedidos</h3>
    <div id="pedidos-lista" class="pedidos-lista">
      <!-- Se inyecta por JS -->
    </div>
  </div>
</div>

<!-- MODAL RESEÑA -->
<div id="modal-resena" class="modal-auth" style="display:none;">
  <div class="modal-content resena-modal">
    <div class="modal-close" data-close-resena>&times;</div>
    <h3 style="margin-bottom:1rem;color:var(--color-acento-oscuro);">Tu reseña</h3>
    <form id="form-resena" class="form-emprendedor" style="max-width:520px;">
      <input type="hidden" id="resena-id-producto" />
      <div class="rating-row" style="display:flex;gap:.5rem;align-items:center;">
        <label style="font-weight:600;">Calificación:</label>
        <select id="resena-calificacion" class="input-ceremonial" style="max-width:160px;">
          <option value="5">5 ⭐</option>
          <option value="4">4 ⭐</option>
          <option value="3">3 ⭐</option>
          <option value="2">2 ⭐</option>
          <option value="1">1 ⭐</option>
        </select>
      </div>
      <textarea id="resena-comentario" class="input-ceremonial" rows="4" placeholder="Escribe tu comentario…"></textarea>
      <div style="display:flex;gap:.75rem;justify-content:flex-end;margin-top:.5rem;">
        <button type="submit" class="btn-ceremonial" style="width:auto;">Publicar reseña</button>
        <button type="button" class="btn-ceremonial" data-close-resena style="width:auto;opacity:.85;">Cerrar</button>
      </div>
      <p id="resena-msg" class="mensaje-error success" style="display:none;margin-top:.75rem;">Gracias por tu reseña</p>
    </form>
  </div>
</div>

<!-- Rutas de imágenes (igual que pública) -->
<script>
  window.rutasImagenes = {
    maquillaje: "{{ Vite::asset('resources/img/maquillaje.png') }}",
    skincare: "{{ Vite::asset('resources/img/skincare.png') }}",
    fragancias: "{{ Vite::asset('resources/img/fragancias.png') }}",
    accesorios: "{{ Vite::asset('resources/img/accesorios.png') }}"
  };
</script>

<!-- Font Awesome por si tu <head> no lo trae -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>

<meta name="csrf-token" content="{{ csrf_token() }}">
@endsection

@vite(['resources/css/cliente.css','resources/js/cliente.js'])
