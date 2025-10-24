{{-- resources/views/cliente/dashboard.blade.php --}}
@php $esCliente = true; @endphp
@extends('layouts.app')

@section('title', 'Mi Cuenta - ABMODEL')

@section('content')
<div class="dashboard-cliente">
  
  <!-- 👋 Header Personalizado -->
  <section class="cliente-header">
    <div class="container">
      <div class="header-content">
        <div class="welcome-message">
          <h1 id="cliente-nombre">¡Hola, Cliente!</h1>
          <p id="cliente-email">Bienvenido a tu panel de control</p>
        </div>
        <div class="header-actions">
          <button class="btn-perfil" onclick="abrirModalPerfil()">
            <i class="fas fa-user"></i>
            Mi Perfil
          </button>
          <button class="btn-carrito" onclick="abrirModalCarrito()">
            <i class="fas fa-shopping-cart"></i>
            <span class="carrito-count" id="carrito-count">0</span>
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- 📊 Resumen Rápido -->
  <section class="resumen-section">
    <div class="container">
      <div class="resumen-grid">
        <div class="resumen-card" onclick="cargarPedidos()">
          <div class="resumen-icon pedidos">📦</div>
          <div class="resumen-info">
            <h3 id="pedidos-count">0</h3>
            <p>Pedidos Activos</p>
          </div>
        </div>
        
        <div class="resumen-card" onclick="abrirModalCarrito()">
          <div class="resumen-icon carrito">🛒</div>
          <div class="resumen-info">
            <h3 id="carrito-items-count">0</h3>
            <p>En Carrito</p>
          </div>
        </div>
        
        <div class="resumen-card" onclick="cargarProductos()">
          <div class="resumen-icon productos">⭐</div>
          <div class="resumen-info">
            <h3 id="productos-count">0</h3>
            <p>Productos</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 📦 Pedidos Recientes -->
  <section class="pedidos-section">
    <div class="container">
      <div class="section-header">
        <h2>📦 Tus Pedidos Recientes</h2>
        <button class="btn-ver-todo" onclick="verTodosPedidos()">Ver Todos</button>
      </div>
      <div class="pedidos-container" id="pedidos-container">
        <div class="loading">Cargando pedidos...</div>
      </div>
    </div>
  </section>

  <!-- 🛍️ Productos Destacados -->
  <section class="productos-section">
    <div class="container">
      <div class="section-header">
        <h2>✨ Productos para Ti</h2>
        <button class="btn-ver-todo" onclick="verTodosProductos()">Ver Todos</button>
      </div>
      <div class="productos-grid" id="productos-grid">
        <div class="loading">Cargando productos...</div>
      </div>
    </div>
  </section>

</div>

<!-- 🛒 Modal Carrito -->
@include('cliente.modals.carrito')

<!-- 👤 Modal Perfil -->
@include('cliente.modals.perfil')

<!-- 📦 Modal Detalle Pedido -->
@include('cliente.modals.pedido')

<script>
  // Variables globales
  window.clienteData = {
    usuario: null,
    carrito: null,
    pedidos: [],
    productos: []
  };
</script>
{{-- En resources/views/cliente/dashboard.blade.php --}}
<!-- 🎭 Overlay para Modales -->
<div class="modal-overlay" id="modal-overlay" onclick="cerrarModales()"></div>
@endsection

@vite(['resources/css/cliente.css', 'resources/js/cliente.js'])