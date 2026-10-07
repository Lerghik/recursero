// Importamos el cliente de Supabase
import { supabase } from './supabase.js';

// Capturamos los elementos del DOM en variables para interactuar con la interfaz de index.html
const btnRead = document.getElementById('btn-read');
const btnWrite = document.getElementById('btn-write');
const btnLogout = document.getElementById('btn-logout');
const nombreInput = document.getElementById('nombre-input');
const emailInput = document.getElementById('email-input');
const userList = document.getElementById('user-list');
const statusMessage = document.getElementById('status-message');
const userInfo = document.getElementById('user-info');

// Función de inicialización para proteger el acceso a esta vista
async function init() {
  // Verificamos si existe una sesión de autenticación activa
  const { data: { session } } = await supabase.auth.getSession();
  
  // Si NO hay sesión activa, bloqueamos el acceso y redirigimos al login
  if (!session) {
    window.location.href = 'login.html';
    return;
  }
  
  // Si está autenticado, mostramos su dirección de correo en pantalla
  userInfo.textContent = `Sesión activa: ${session.user.email}`;
}

// Ejecutamos la protección al cargar la página
init();

// ----------------------------------------------------
// BOTÓN 1: CONSULTA DE LECTURA (SELECT)
// ----------------------------------------------------
btnRead.addEventListener('click', async () => {
  statusMessage.textContent = 'Consultando datos...';
  userList.innerHTML = ''; // Limpiamos el listado visible antes de cargar los datos

  // Realizamos la consulta a la tabla 'usuarios'
  // Nota: La política RLS de SELECT permite leer incluso de forma pública
  const { data, error } = await supabase
    .from('usuarios')
    .select('*');

  if (error) {
    statusMessage.textContent = 'Error al leer la base de datos: ' + error.message;
  } else {
    statusMessage.textContent = `Se encontraron ${data.length} registros.`;
    
    // Iteramos sobre los resultados y agregamos un punto de lista (<li>) por cada fila encontrada
    data.forEach((user) => {
      const li = document.createElement('li');
      li.textContent = `ID: ${user.id} | Nombre: ${user.nombre} | Email: ${user.email}`;
      userList.appendChild(li);
    });
  }
});

// ----------------------------------------------------
// BOTÓN 2: CONSULTA DE ESCRITURA (INSERT)
// ----------------------------------------------------
btnWrite.addEventListener('click', async () => {
  // Obtenemos y limpiamos los espacios de los campos de texto
  const nombre = nombreInput.value.trim();
  const email = emailInput.value.trim();

  // Validación básica del cliente
  if (!nombre || !email) {
    statusMessage.textContent = 'Por favor, completa tanto el nombre como el email.';
    return;
  }

  statusMessage.textContent = 'Guardando registro...';

  // Intentamos insertar los datos en la tabla 'usuarios'
  // Nota: Dado que esta operación requiere rol 'authenticated', el token JWT del login activo
  // permite que la política RLS "Permitir inserción a usuarios autenticados" valide la acción.
  const { error } = await supabase
    .from('usuarios')
    .insert([{ nombre: nombre, email: email }]);

  if (error) {
    statusMessage.textContent = 'Error al insertar: ' + error.message;
  } else {
    statusMessage.textContent = '¡Usuario insertado con éxito!';
    
    // Limpiamos los campos del formulario
    nombreInput.value = '';
    emailInput.value = '';
    
    // Disparamos una relectura para actualizar la lista mostrada inmediatamente
    btnRead.click();
  }
});

// ----------------------------------------------------
// BOTÓN DE CERRAR SESIÓN
// ----------------------------------------------------
btnLogout.addEventListener('click', async () => {
  // Cerramos la sesión en Supabase y eliminamos las cookies/tokens locales
  await supabase.auth.signOut();
  
  // Redirigimos al formulario de inicio de sesión
  window.location.href = 'login.html';
});