@php $esPublica = false; @endphp
@extends('layouts.app')

@section('title', 'Panel del emprendedor')

@section('content')
<section class="pantalla-emprendedor">

  <!-- 🔝 Encabezado con perfil -->
  <div class="bloque-emprendedor encabezado-emprendedor">
    <h1 id="saludo-emprendedor">Bienvenid@</h1>
    <div class="acciones-emprendedor">
      <button id="btn-perfil" class="btn-perfil-toggle">👤 Perfil</button>
      <div id="menu-perfil" class="menu-perfil">
        <p><strong>Nombre:</strong> <span id="perfil-nombre"></span></p>
        <p><strong>Email:</strong> <span id="perfil-email"></span></p>
        <p><strong>Rol:</strong> <span id="perfil-rol"></span></p>
        <button id="btn-logout">🔓 Cerrar sesión</button>
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
      <input type="number" name="precio" placeholder="Precio" required>
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

  <!-- 🗑️ Modal de confirmación visual -->
  <div id="confirmacion-emprendedor" class="confirmacion-emprendedor modal-emprendedor" style="display: none;">
    <p id="confirmacion-mensaje">¿Estás segur@ de que deseas eliminar este producto?</p>
    <div class="acciones-confirmacion">
      <button id="confirmar-eliminacion">Sí, eliminar</button>
      <button id="cancelar-eliminacion">Cancelar</button>
    </div>
  </div>

</section>
@endsection

@vite(['resources/js/emprendedor.js'])
