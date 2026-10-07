/**
 * ARCHIVO: auth.js
 * RESPONSABILIDAD: Manejar las operaciones de autenticación de usuarios
 * (comprobación de sesión, inicio de sesión, registro y cierre de sesión).
 */

// Referencias a los elementos de autenticación del DOM
const emailInput = document.getElementById('auth-email');
const passwordInput = document.getElementById('auth-password');
const btnLogin = document.getElementById('btn-login');
const btnSignup = document.getElementById('btn-signup');
const btnLogout = document.getElementById('btn-logout');
const authStatus = document.getElementById('auth-status');

/**
 * Consulta el estado actual de la sesión del usuario y actualiza la UI
 */
async function comprobarSesion() {
  if (!supabaseClient) return;

  // Consulta la sesión actual registrada en el almacenamiento local
  const { data: { session } } = await supabaseClient.auth.getSession();
  
  if (session) {
    // Usuario autenticado: mostrar correo y botón de cerrar sesión
    authStatus.textContent = `Sesión: ${session.user.email}`;
    btnLogin.classList.add('hidden');
    btnSignup.classList.add('hidden');
    btnLogout.classList.remove('hidden');
  } else {
    // Usuario no autenticado: mostrar botones de login y registro
    authStatus.textContent = 'No autenticado';
    btnLogin.classList.remove('hidden');
    btnSignup.classList.remove('hidden');
    btnLogout.classList.add('hidden');
  }
}

// EV: Evento para iniciar sesión (signInWithPassword)
btnLogin.addEventListener('click', async () => {
  if (!verificarCliente()) return;

  const email = emailInput.value;
  const password = passwordInput.value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if (error) {
    alert('Error en login: ' + error.message);
  } else {
    alert('¡Inicio de sesión exitoso!');
    comprobarSesion(); // Actualiza la UI
  }
});

// EV: Evento para registrar un nuevo usuario (signUp)
btnSignup.addEventListener('click', async () => {
  if (!verificarCliente()) return;

  const email = emailInput.value;
  const password = passwordInput.value;

  const { data, error } = await supabaseClient.auth.signUp({ email, password });

  if (error) {
    alert('Error en el registro: ' + error.message);
  } else {
    alert('Registro enviado. Si la confirmación por correo está activa, revisa tu bandeja.');
  }
});

// EV: Evento para cerrar la sesión actual (signOut)
btnLogout.addEventListener('click', async () => {
  if (!verificarCliente()) return;

  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert('Error al cerrar sesión: ' + error.message);
  } else {
    alert('Sesión cerrada.');
    comprobarSesion(); // Actualiza la UI
  }
});
