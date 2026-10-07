// Importamos la instancia configurada de Supabase
import { supabase } from './supabase.js';

// Obtenemos las referencias del DOM para manipular los elementos del formulario de login
const form = document.getElementById('auth-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const btnSignup = document.getElementById('btn-signup');
const message = document.getElementById('message');

// Función asíncrona para comprobar si ya existe una sesión activa al cargar la página
async function checkAuth() {
  // Solicitamos a Supabase la información de la sesión actual
  const { data: { session } } = await supabase.auth.getSession();
  
  // Si hay un usuario logueado, lo redirigimos automáticamente a la página principal
  if (session) {
    window.location.href = 'index.html';
  }
}

// Ejecutamos la verificación al abrir login.html
checkAuth();

// Evento al enviar el formulario (Click en "Iniciar Sesión" o presionar Enter)
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Evitamos que la página se recargue al enviar el formulario
  message.textContent = 'Cargando...';

  // Intentamos autenticar al usuario usando su correo y contraseña
  const { error } = await supabase.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value,
  });

  // Si hubo un error en las credenciales, mostramos el mensaje explicativo
  if (error) {
    message.textContent = 'Error: ' + error.message;
  } else {
    // Si la autenticación es correcta, lo enviamos al panel principal
    window.location.href = 'index.html';
  }
});

// Evento al hacer clic en el botón "Registrarse"
btnSignup.addEventListener('click', async () => {
  message.textContent = 'Registrando usuario...';

  // Creamos un nuevo usuario en la base de autenticación de Supabase (auth.users)
  const { error } = await supabase.auth.signUp({
    email: emailInput.value,
    password: passwordInput.value,
  });

  if (error) {
    message.textContent = 'Error al registrar: ' + error.message;
  } else {
    message.textContent = 'Registro exitoso. Si el correo de confirmación está activo en tu Supabase, revisa tu bandeja de entrada.';
  }
});