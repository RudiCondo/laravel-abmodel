@php $esPublica = false; @endphp
@extends('layouts.app')

@section('title', 'Panel del emprendedor')

@section('content')
<section class="pantalla-emprendedor">

  <!-- 🔝 ENCABEZADO REDISEÑADO - SALUDO PERSONALIZADO Y PERFIL -->
  <div class="bloque-emprendedor encabezado-emprendedor">
    <!-- SALUDO PERSONALIZADO A LA IZQUIERDA -->
    <div class="header-left">
      <div class="saludo-container">
        <h1 id="saludo-emprendedor">¡Hola, <span id="nombre-usuario">Emprendedor</span>! 👋</h1>
        <p class="subtitulo-saludo">Gestiona tu tienda y productos</p>
      </div>
    </div>
    
    <!-- PERFIL A LA DERECHA -->
    <div class="header-right">
      <!-- BOTÓN DE PERFIL MEJORADO -->
      <div class="profile-section">
        <button class="btn-perfil-toggle" id="btn-perfil">
          <div class="profile-avatar">
            <i class="fas fa-user"></i>
          </div>
          <span class="profile-name" id="perfil-nombre">Usuario</span>
          <i class="fas fa-chevron-down profile-arrow"></i>
        </button>
        
        <!-- MENÚ DESPLEGABLE DEL PERFIL - REDISEÑADO -->
        <div class="menu-perfil-emprendedor" id="menu-perfil">
          <div class="profile-header">
            <div class="profile-avatar-large">
              <i class="fas fa-user"></i>
            </div>
            <div class="profile-info">
              <strong id="perfil-nombre-menu">Usuario</strong>
              <span id="perfil-email">usuario@ejemplo.com</span>
              <span class="profile-rol" id="perfil-rol">Emprendedor</span>
            </div>
          </div>
          
          <div class="menu-divider"></div>
          
          <div class="menu-items">
            <a href="#" class="menu-item">
              <i class="fas fa-user-edit"></i>
              <span>Editar Perfil</span>
            </a>
            
            <a href="#" class="menu-item">
              <i class="fas fa-cog"></i>
              <span>Configuración</span>
            </a>
            
            <a href="#" class="menu-item">
              <i class="fas fa-store"></i>
              <span>Mi Tienda</span>
            </a>
            
            <a href="#" class="menu-item">
              <i class="fas fa-chart-line"></i>
              <span>Historial de Ventas</span>
            </a>
            
            <div class="menu-divider"></div>
            
            <button id="btn-logout" class="menu-item logout-btn">
              <i class="fas fa-sign-out-alt"></i>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  

  <!-- 🏪 Crear tienda -->
  <section id="crear-tienda" class="bloque-emprendedor">
    <h2>Crear nueva tienda</h2>
    <form id="form-tienda" class="form-emprendedor">
      <input type="text" name="nombre_tienda" placeholder="Nombre de la tienda" required>
      <input type="text" name="descripcion" placeholder="Descripción" required>
      <input type="text" name="logo_url" placeholder="URL del logo">
      <button type="submit">Crear tienda</button>
    </form>
  </section>

  <!-- 🏪 Panel de tiendas -->
  <section id="panel-tiendas" class="bloque-emprendedor">
    <h2>Tu Tienda</h2>
    <div class="grid-tiendas-emprendedor"></div>
  </section>

  <!-- 📦 Panel de productos -->
  <section id="panel-productos" class="bloque-emprendedor">
    <h2>Tus productos</h2>
    <div class="grid-productos-emprendedor"></div>
  </section>

  <!-- 🧴 Modal para agregar producto -->
  <div id="modal-producto" class="modal-emprendedor" style="display: none;">
    <form id="form-producto-modal" class="form-emprendedor">
      <h3>Agregar producto a tu tienda</h3>
      <input type="text" name="nombre_producto" placeholder="Nombre del producto" required>
      <input type="text" name="descripcion" placeholder="Descripción" required>
      <input type="number" name="precio" placeholder="Precio" step="0.01" required>
      <input type="number" name="stock" placeholder="Stock" required>
      <input type="text" name="imagen_url" placeholder="URL de imagen">

      <!-- ✅ Campo dinámico para categoría -->
      <select name="id_categoria" required>
        <option value="">Selecciona una categoría</option>
        <!-- Las opciones se llenan dinámicamente desde JS -->
      </select>

      <div class="acciones-modal">
        <button type="submit">Agregar producto</button>
        <button type="button" id="cerrar-modal">Cancelar</button>
      </div>
    </form>
  </div>

  <!-- ✏️ Modal para editar tienda -->
  <div id="modal-editar-tienda" class="modal-emprendedor" style="display: none;">
    <form id="form-editar-tienda" class="form-emprendedor">
      <h3>Editar tu tienda</h3>
      <input type="text" name="nombre_tienda" placeholder="Nombre de la tienda" required>
      <input type="text" name="descripcion" placeholder="Descripción" required>
      <input type="text" name="logo_url" placeholder="URL del logo">
      
      <div class="acciones-modal">
        <button type="submit">Actualizar tienda</button>
        <button type="button" id="cerrar-modal-editar">Cancelar</button>
      </div>
    </form>
  </div>

  <!-- 🗑️ Modal de confirmación visual -->
  <div id="confirmacion-emprendedor" class="confirmacion-emprendedor" style="display: none;">
    <h3>⚠️ Confirmar Eliminación</h3>
    <p id="confirmacion-mensaje">¿Estás segur@ de que deseas eliminar este producto? Esta acción no se puede deshacer.</p>
    <div class="acciones-confirmacion">
      <button id="confirmar-eliminacion">✅ Sí, Eliminar</button>
      <button id="cancelar-eliminacion">❌ Cancelar</button>
    </div>
  </div>

  <!-- 🎭 Overlay para modales -->
  <div class="modal-overlay" id="modal-overlay" style="display: none;"></div>

</section>
@endsection

@vite(['resources/css/emprendedor.css', 'resources/js/emprendedor.js']) 