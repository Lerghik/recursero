// ============================================================================
// LÓGICA PRINCIPAL (SRC/MAIN.JS) - MODO LECTURA PÚBLICA / ESCRITURA ADMIN
// ============================================================================

import { supabase } from './supabase.js';

// Selección de elementos del DOM
const btnRead = document.getElementById('btn-read');
const btnWrite = document.getElementById('btn-write');
const btnUpdate = document.getElementById('btn-update');
const btnDelete = document.getElementById('btn-delete');
const btnLogout = document.getElementById('btn-logout');
const linkLogin = document.getElementById('link-login');
const adminSection = document.getElementById('admin-section');
const idInput = document.getElementById('id-input');
const nombreInput = document.getElementById('nombre-input');
const emailInput = document.getElementById('email-input');
const userList = document.getElementById('user-list');
const statusMessage = document.getElementById('status-message');
const userInfo = document.getElementById('user-info');

// Comprobar rol del usuario
async function checkRole() {
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    userInfo.textContent = `Sesión iniciada como Admin: ${session.user.email}`;
    adminSection.style.display = 'block';
    btnLogout.style.display = 'inline-block';
    linkLogin.style.display = 'none';
  } else {
    userInfo.textContent = 'Modo: Lectura Pública (Sin sesión)';
    adminSection.style.display = 'none';
    btnLogout.style.display = 'none';
    linkLogin.style.display = 'inline-block';
  }
}

checkRole();

// ----------------------------------------------------------------------------
// 1. SELECT (PÚBLICO)
// ----------------------------------------------------------------------------
btnRead.addEventListener('click', async () => {
  statusMessage.textContent = 'Consultando registros...';
  userList.innerHTML = '';

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
// 2. INSERT (ADMIN ONLY)
// ----------------------------------------------------------------------------
btnWrite.addEventListener('click', async () => {
  const nombre = nombreInput.value.trim();
  const email = emailInput.value.trim();

  if (!nombre || !email) {
    statusMessage.textContent = 'Por favor, completa nombre y correo para insertar.';
    return;
  }

  statusMessage.textContent = 'Guardando registro...';

  const { error } = await supabase
    .from('usuarios')
    .insert([{ nombre: nombre, email: email }]);

  if (error) {
    statusMessage.textContent = 'Error al guardar: ' + error.message;
  } else {
    statusMessage.textContent = '¡Registro guardado correctamente por el administrador!';
    limpiarFormulario();
    btnRead.click();
  }
});

// ----------------------------------------------------------------------------
// 3. UPDATE (ADMIN ONLY)
// ----------------------------------------------------------------------------
btnUpdate.addEventListener('click', async () => {
  const id = idInput.value.trim();
  const nombre = nombreInput.value.trim();
  const email = emailInput.value.trim();

  if (!id || (!nombre && !email)) {
    statusMessage.textContent = 'Ingresa el ID del usuario y al menos un campo a actualizar.';
    return;
  }

  statusMessage.textContent = 'Actualizando registro...';

  const updates = {};
  if (nombre) updates.nombre = nombre;
  if (email) updates.email = email;

  const { error } = await supabase
    .from('usuarios')
    .update(updates)
    .eq('id', id);

  if (error) {
    statusMessage.textContent = 'Error al actualizar: ' + error.message;
  } else {
    statusMessage.textContent = '¡Registro actualizado correctamente!';
    limpiarFormulario();
    btnRead.click();
  }
});

// ----------------------------------------------------------------------------
// 4. DELETE (ADMIN ONLY)
// ----------------------------------------------------------------------------
btnDelete.addEventListener('click', async () => {
  const id = idInput.value.trim();

  if (!id) {
    statusMessage.textContent = 'Ingresa el ID del usuario que deseas eliminar.';
    return;
  }

  statusMessage.textContent = 'Eliminando registro...';

  const { error } = await supabase
    .from('usuarios')
    .delete()
    .eq('id', id);

  if (error) {
    statusMessage.textContent = 'Error al eliminar: ' + error.message;
  } else {
    statusMessage.textContent = '¡Registro eliminado correctamente!';
    limpiarFormulario();
    btnRead.click();
  }
});

// Auxiliar para limpiar campos
function limpiarFormulario() {
  idInput.value = '';
  nombreInput.value = '';
  emailInput.value = '';
}

// ----------------------------------------------------------------------------
// LOGOUT
// ----------------------------------------------------------------------------
btnLogout.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.reload();
});