@php $esPublica = true; @endphp
@extends('layouts.app')

@section('title', 'ABMODEL - Belleza a tu Estilo')

@section('content')
  <!-- 🌸 Hero de bienvenida -->
  <section class="categorias-belleza">
    <div class="saludo">
      <h1>Hola, ¿qué verás hoy?</h1>
    </div>
    <div class="categorias" id="categorias-container">
      <!-- Las categorías se cargarán dinámicamente -->
      <div class="categoria-skeleton">
        <div class="skeleton-img"></div>
        <div class="skeleton-text short"></div>
      </div>
    </div>
  </section>

  <!-- 🛍 Tiendas destacadas -->
  <section class="tiendas-destacadas">
    <h2>Tiendas destacadas</h2>
    <div class="grid-tiendas"></div>
  </section>

  <!-- 🧴 Productos destacadas -->
  <section class="productos-destacados">
    <h2>Productos destacados</h2>
    <div class="filtro-categoria">
      <span id="categoria-actual"></span>
      <button id="btn-limpiar-filtro" class="btn-ceremonial" style="display: none;">
        Ver todos los productos
      </button>
    </div>
    <div class="grid-productos"></div>
  </section>

  <!-- 💬 Comentarios recientes -->
  <section class="comentarios-recientes">
    <h2>Reseñas recientes</h2>
    <ul class="lista-comentarios"></ul>
  </section>

  <!-- 🖼️ Pasar las rutas de Vite a JavaScript -->
  <script>
    window.rutasImagenes = {
        maquillaje: "{{ Vite::asset('resources/img/maquillaje.png') }}",
        skincare: "{{ Vite::asset('resources/img/skincare.png') }}", 
        fragancias: "{{ Vite::asset('resources/img/fragancias.png') }}",
        accesorios: "{{ Vite::asset('resources/img/accesorios.png') }}"
    };
  </script>
@endsection

@vite(['resources/css/style.css', 'resources/js/home.js'])