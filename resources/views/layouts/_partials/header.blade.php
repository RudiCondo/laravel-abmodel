<header class="header-completo">
  <div class="header-izquierda">
    <img src="{{ Vite::asset('resources/img/Logo.jpg') }}" alt="ABMODEL" class="logo">
  </div>

  <div class="header-centro">
    <input type="text" id="input-busqueda-header" placeholder="Buscar locales..." class="buscador">

  </div>

  <div class="header-derecha">
    @if($esPublica ?? false)
      <button type="button" class="btn-identificate">
        <span class="icono-usuario">👤</span>
        ¡Bienvenido! Identifícate
      </button>
    @endif

  </div>
</header>
