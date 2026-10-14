// ============================================================================
// LÓGICA DE INICIO DE SESIÓN DEL ADMINISTRADOR (SRC/AUTH.JS)
// ============================================================================

import { supabase } from './supabase.js';

const form = document.getElementById('auth-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const message = document.getElementById('message');

// Si ya hay una sesión de administrador activa, redirigimos directamente a index.html
async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    window.location.href = 'index.html';
  }
}
checkAuth();

// Evento de inicio de sesión
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  message.textContent = 'Verificando credenciales...';

  const { error } = await supabase.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value,
  });

  if (error) {
    message.textContent = 'Error de autenticación: ' + error.message;
  } else {
    // Redirigimos a la vista principal en modo administrador
    window.location.href = 'index.html';
  }
});