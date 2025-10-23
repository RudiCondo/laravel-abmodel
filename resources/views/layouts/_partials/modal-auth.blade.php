<div id="modal-auth" class="modal-auth hidden">
  <div class="modal-content">
    <!-- 🔄 Pestañas -->
    <div class="modal-tabs">
      <button id="tab-login" class="active">Iniciar sesión</button>
      <button id="tab-register">Registrarse</button>
    </div>

    <!-- 🔐 Formulario de Login -->
    <div id="form-login" class="form-section">
      <input type="email" id="login-email" class="input-ceremonial" placeholder="Correo electrónico">
      <input type="password" id="login-password" class="input-ceremonial" placeholder="Contraseña">
      <button type="button" id="btn-login" class="btn-ceremonial">Entrar</button>
      <div id="loginMessage" class="mensaje-error hidden"></div>
    </div>

    <!-- 📝 Formulario de Registro -->
    <div id="form-register" class="form-section hidden">
      <input type="text" id="register-name" class="input-ceremonial" placeholder="Nombre completo">
      <input type="email" id="register-email" class="input-ceremonial" placeholder="Correo electrónico">
      <input type="password" id="register-password" class="input-ceremonial" placeholder="Contraseña">
      <input type="password" id="register-password-confirm" class="input-ceremonial" placeholder="Confirmar contraseña">
      <select id="register-rol" class="input-ceremonial">
        <option value="cliente">Cliente</option>
        <option value="emprendedor">Emprendedor</option>
      </select>
      <button type="button" id="btn-register" class="btn-ceremonial">Registrarme</button>
      <div id="registerMessage" class="mensaje-error hidden"></div>
    </div>
  </div>
</div>
