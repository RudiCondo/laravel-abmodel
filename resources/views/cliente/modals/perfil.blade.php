{{-- resources/views/cliente/modals/perfil.blade.php --}}
<div class="modal-perfil" id="modal-perfil">
  <div class="modal-content">
    <div class="perfil-info">
      <div class="perfil-avatar">
        <i class="fas fa-user"></i>
      </div>
      <div class="perfil-datos">
        <h4 id="perfil-nombre">Usuario</h4>
        <p id="perfil-email">usuario@email.com</p>
        <span class="badge-cliente">Cliente</span>
      </div>
    </div>
    
    <div class="perfil-menu">
      <button class="menu-item" onclick="editarPerfil()">
        <i class="fas fa-edit"></i>
        Editar Perfil
      </button>
      
      <button class="menu-item" onclick="cambiarPassword()">
        <i class="fas fa-lock"></i>
        Cambiar Contraseña
      </button>
      
      <button class="menu-item" onclick="verDirecciones()">
        <i class="fas fa-map-marker-alt"></i>
        Mis Direcciones
      </button>
      
      <div class="menu-divider"></div>
      
      <form class="logout-form" action="/logout" method="POST">
        @csrf
        <button type="submit" class="logout-btn">
          <i class="fas fa-sign-out-alt"></i>
          Cerrar Sesión
        </button>
      </form>
    </div>
  </div>
</div>