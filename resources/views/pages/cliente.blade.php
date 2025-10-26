@php $esPublica = false; @endphp
@extends('layouts.app')

@section('title', 'Tu espacio ceremonial')

@section('content')
<section class="pantalla-cliente">

  <!-- 🔝 Barra superior -->
  <div class="barra-cliente">
    <div class="saludo-cliente">
      <h1 id="saludo-cliente"></h1>
    </div>

    <div class="acciones-barra">
      <div class="perfil-menu">
        <button id="btn-perfil" class="btn-barra icono">👤 Perfil</button>
        <div id="perfil-dropdown" class="dropdown hidden">
          <p><strong>Correo:</strong> <span id="correo-usuario"></span></p>
          <p><strong>Teléfono:</strong> <span id="telefono-usuario"></span></p>
          <p><strong>Dirección:</strong> <span id="direccion-usuario"></span></p>
          <button id="btn-logout" class="btn-logout">Cerrar sesión</button>
        </div>
      </div>

      <button id="btn-carrito" class="btn-barra icono">🛒 Carrito</button>
      <button id="btn-pedidos" class="btn-barra icono">📦 Pedidos</button>
    </div>
  </div>

  <!-- 🎨 Categorías -->
  <section class="categorias-belleza">
    <h2>Explora por categoría</h2>
    <div class="categorias">
      <a href="/categorias/1" class="categoria-icon">
        <img src="{{ Vite::asset('img/maquillaje.png') }}" alt="Maquillaje">
      </a>
      <a href="/categorias/2" class="categoria-icon">
        <img src="{{ Vite::asset('img/skincare.png') }}" alt="Skincare">
      </a>
      <a href="/categorias/3" class="categoria-icon">
        <img src="{{ Vite::asset('img/fragancias.png') }}" alt="Fragancias">
      </a>
      <a href="/categorias/4" class="categoria-icon">
        <img src="{{ Vite::asset('img/accesorios.png') }}" alt="Accesorios">
      </a>
    </div>
  </section>

  <!-- 🧴 Productos -->
  <section id="grid-productos" class="grid-productos"></section>

  <!-- 👤 Perfil -->
  <section id="perfil-cliente" class="bloque-cliente hidden"></section>

  <!-- 🛒 Carrito -->
  <section id="seccion-carrito" class="bloque-cliente hidden"></section>

  <!-- 📦 Pedidos -->
  <section id="seccion-pedidos" class="bloque-cliente hidden"></section>

</section>
@endsection

@vite(['resources/js/cliente.js'])
