document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal-auth');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');

  document.querySelectorAll('.btn-identificate').forEach(el => {
    el.addEventListener('click', () => {
      modal.classList.remove('hidden');
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      formLogin.classList.remove('hidden');
      formRegister.classList.add('hidden');
    });
  });

  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    formLogin.classList.remove('hidden');
    formRegister.classList.add('hidden');
  });

  tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    formRegister.classList.remove('hidden');
    formLogin.classList.add('hidden');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  // 🔐 Login
  document.getElementById('btn-login').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
      mostrarMensaje('Por favor completa todos los campos ✨', 'error', 'login');
      if (!email) resaltarCampo('login-email');
      if (!password) resaltarCampo('login-password');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        mostrarMensaje(data.message || 'Inicio de sesión exitoso ✨', 'success', 'login');
        localStorage.setItem('token', data.token);

        const perfil = await obtenerPerfil();
        if (perfil?.rol === 'cliente') {
          window.location.href = '/cliente/dashboard';
        } else if (perfil?.rol === 'emprendedor') {
          window.location.href = '/emprendedor/dashboard';
        } else {
          location.reload();
        }
      } else {
        mostrarMensaje(data.error || 'Correo o contraseña incorrectos.', 'error', 'login');
      }
    } catch (error) {
      mostrarMensaje('Error de conexión con el servidor.', 'error', 'login');
    }
  });

  // 📝 Registro
  document.getElementById('btn-register').addEventListener('click', async () => {
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    const passwordConfirm = document.getElementById('register-password-confirm').value.trim();
    const telefono = document.getElementById('register-telefono')?.value.trim() || '';
    const direccion = document.getElementById('register-direccion')?.value.trim() || '';
    const rol = document.getElementById('register-rol')?.value || 'cliente';

    const camposObligatorios = [
      { id: 'register-name', valor: name },
      { id: 'register-email', valor: email },
      { id: 'register-password', valor: password },
      { id: 'register-password-confirm', valor: passwordConfirm }
    ];

    const vacíos = camposObligatorios.filter(c => !c.valor);
    if (vacíos.length > 0) {
      mostrarMensaje('Por favor completa todos los campos obligatorios ✨', 'error', 'register');
      vacíos.forEach(c => resaltarCampo(c.id));
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirm,
          telefono,
          direccion,
          rol
        })
      });

      const data = await response.json();

      if (response.ok) {
        mostrarMensaje(data.message || 'Registro exitoso 🎉', 'success', 'register');
        localStorage.setItem('token', data.token);
        setTimeout(() => location.reload(), 1500);
      } else {
        mostrarMensaje(parseErrores(data), 'error', 'register');
      }
    } catch (error) {
      mostrarMensaje('Error de conexión con el servidor.', 'error', 'register');
    }
  });
});

// 🎨 Mostrar mensajes
function mostrarMensaje(texto, tipo = 'info', destino = 'login') {
  const contenedor = destino === 'login'
    ? document.getElementById('loginMessage')
    : document.getElementById('registerMessage');

  contenedor.textContent = texto;
  contenedor.classList.remove('hidden', 'error', 'success', 'info');
  contenedor.classList.add(tipo);

  setTimeout(() => {
    contenedor.classList.add('hidden');
  }, 5000);
}

// ✨ Resaltar campos vacíos
function resaltarCampo(id) {
  const campo = document.getElementById(id);
  campo.classList.add('campo-incompleto');
  setTimeout(() => campo.classList.remove('campo-incompleto'), 3000);
}

// 👤 Obtener perfil
async function obtenerPerfil() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const response = await fetch('/api/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error al obtener perfil:', error);
  }

  return null;
}

// 🧠 Parsear errores
function parseErrores(data) {
  if (typeof data === 'object') {
    return Object.values(data).flat().join(' | ');
  }
  return 'Error desconocido';
}

