// ============================================================================
// LÓGICA PRINCIPAL (SRC/MAIN.JS) - MODO LECTURA PÚBLICA / ESCRITURA ADMIN
// ============================================================================

import { supabase } from './supabase.js';

// Selección de elementos del DOM
const btnRead = document.getElementById('btn-read');
const btnWrite = document.getElementById('btn-write');
const btnLogout = document.getElementById('btn-logout');
const linkLogin = document.getElementById('link-login');
const adminSection = document.getElementById('admin-section');
const nombreInput = document.getElementById('nombre-input');
const emailInput = document.getElementById('email-input');
const userList = document.getElementById('user-list');
const statusMessage = document.getElementById('status-message');
const userInfo = document.getElementById('user-info');

// Función que evalúa la sesión del usuario para condicionar la interfaz
async function checkRole() {
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    // Si hay sesión (Administrador autenticado):
    userInfo.textContent = `Sesión iniciada como Admin: ${session.user.email}`;
    adminSection.style.display = 'block'; // Mostramos el formulario de inserción
    btnLogout.style.display = 'inline-block'; // Mostramos botón de salir
    linkLogin.style.display = 'none'; // Ocultamos el enlace al login
  } else {
    // Si no hay sesión (Visitante público):
    userInfo.textContent = 'Modo: Lectura Pública (Sin sesión)';
    adminSection.style.display = 'none'; // Ocultamos el formulario de escritura
    btnLogout.style.display = 'none';
    linkLogin.style.display = 'inline-block';
  }
}

// Ejecutamos la comprobación de rol al cargar la pantalla
checkRole();

// ----------------------------------------------------------------------------
// CONSULTA DE LECTURA (PÚBLICA - FUNCIONA CON O SIN LOGIN)
// ----------------------------------------------------------------------------
btnRead.addEventListener('click', async () => {
  statusMessage.textContent = 'Consultando registros...';
  userList.innerHTML = '';

  // La consulta SELECT ejecuta sin problemas gracias a la política "Permitir lectura pública"
  const { data, error } = await supabase
    .from('usuarios')
    .select('*');

  if (error) {
    statusMessage.textContent = 'Error al leer la base de datos: ' + error.message;
  } else {
    statusMessage.textContent = `Consulta realizada con éxito. Se encontraron ${data.length} registros.`;
    
    data.forEach((user) => {
      const li = document.createElement('li');
      li.textContent = `ID: ${user.id} | Nombre: ${user.nombre} | Email: ${user.email}`;
      userList.appendChild(li);
    });
  }
});

// ----------------------------------------------------------------------------
// CONSULTA DE ESCRITURA (RESTRINGIDA AL ADMINISTRADOR)
// ----------------------------------------------------------------------------
btnWrite.addEventListener('click', async () => {
  const nombre = nombreInput.value.trim();
  const email = emailInput.value.trim();

  if (!nombre || !email) {
    statusMessage.textContent = 'Por favor, completa los campos de nombre y correo.';
    return;
  }

  statusMessage.textContent = 'Guardando registro...';

  // Intentamos realizar el INSERT. Supabase validará con la regla RLS si la sesión pertenece al Admin
  const { error } = await supabase
    .from('usuarios')
    .insert([{ nombre: nombre, email: email }]);

  if (error) {
    statusMessage.textContent = 'Error al guardar: ' + error.message;
  } else {
    statusMessage.textContent = '¡Registro guardado correctamente por el administrador!';
    nombreInput.value = '';
    emailInput.value = '';
    btnRead.click(); // Recargamos el listado visible
  }
});

// ----------------------------------------------------------------------------
// CERRAR SESIÓN DEL ADMINISTRADOR
// ----------------------------------------------------------------------------
btnLogout.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.reload(); // Recargamos la página para volver al modo lectura pública
});