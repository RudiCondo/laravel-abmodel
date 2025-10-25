@php $esPublica = true; @endphp
@extends('layouts.app')

@section('title', 'ABMODEL - Belleza a tu Estilo')

@section('content')
  <!-- 🌸 Hero de bienvenida -->
  <section class="categorias-belleza">
    <div class="saludo">
      <h1>Hola, ¿qué verás hoy?</h1>
    </div>
    <div class="categorias">
      <a href="/categorias/1" class="categoria-icon">
        <img src="{{ asset('img/maquillaje.png') }}" alt="Maquillaje">
      </a>
      <a href="/categorias/2" class="categoria-icon">
        <img src="{{ asset('img/skincare.png') }}" alt="Skincare">
      </a>
      <a href="/categorias/3" class="categoria-icon">
        <img src="{{ asset('img/fragancias.png') }}" alt="Fragancias">
      </a>
      <a href="/categorias/4" class="categoria-icon">
        <img src="{{ asset('img/accesorios.png') }}" alt="Accesorios">
      </a>
    </div>
  </section>

  <!-- 🛍 Tiendas destacadas -->
  <section class="tiendas-destacadas">
    <h2>Tiendas destacadas</h2>
    <div class="grid-tiendas"></div>
  </section>

  <!-- 🧴 Productos destacados -->
  <section class="productos-destacados">
    <h2>Productos destacados</h2>
    <div class="grid-productos"></div>
  </section>

  <!-- 💬 Comentarios recientes -->
  <section class="comentarios-recientes">
    <h2>Reseñas recientes</h2>
    <ul class="lista-comentarios"></ul>
  </section>
@endsection

@vite(['resources/js/home.js'])
