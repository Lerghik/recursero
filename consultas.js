/**
 * ARCHIVO: consultas.js
 * RESPONSABILIDAD: Realizar operaciones CRUD en la base de datos (SELECT e INSERT).
 */

// Referencias a los elementos del DOM de consultas
const btnLeer = document.getElementById('btn-leer');
const btnEscribir = document.getElementById('btn-escribir');
const nuevoNombreInput = document.getElementById('nuevo-nombre');
const nuevoEmailInput = document.getElementById('nuevo-email');
const resultadoContainer = document.getElementById('resultado-consultas');

// OPERACIÓN LECTURA: Realiza un SELECT * sobre la tabla 'usuarios'
btnLeer.addEventListener('click', async () => {
  if (!verificarCliente()) return;

  resultadoContainer.textContent = 'Cargando datos...';

  // Consulta a Supabase: equivale a "SELECT * FROM usuarios"
  const { data, error } = await supabaseClient
    .from('usuarios')
    .select('*');

  if (error) {
    // Si la política de seguridad RLS bloquea o hay un error de sintaxis
    resultadoContainer.textContent = 'Error al leer: ' + JSON.stringify(error, null, 2);
  } else {
    // Muestra la respuesta formateada como JSON con sangría
    resultadoContainer.textContent = JSON.stringify(data, null, 2);
  }
});

// OPERACIÓN ESCRITURA: Realiza un INSERT sobre la tabla 'usuarios'
btnEscribir.addEventListener('click', async () => {
  if (!verificarCliente()) return;
  
  const nombre = nuevoNombreInput.value.trim();
  const email = nuevoEmailInput.value.trim();

  // Validación básica de entrada de datos
  if (!nombre || !email) {
    alert('Por favor completa el nombre y el correo para agregar un registro.');
    return;
  }

  resultadoContainer.textContent = 'Guardando registro...';

  // Inserción en Supabase: equivale a "INSERT INTO usuarios (nombre, email) VALUES (...)"
  const { data, error } = await supabaseClient
    .from('usuarios')
    .insert([{ nombre, email }])
    .select(); // Devuelve el objeto recién creado

  if (error) {
    // Muestra error de restricción (ej. email duplicado o falta de permisos RLS)
    resultadoContainer.textContent = 'Error al escribir: ' + JSON.stringify(error, null, 2);
  } else {
    // Muestra el registro guardado con éxito
    resultadoContainer.textContent = 'Registro exitoso:\n' + JSON.stringify(data, null, 2);
    // Limpia los campos de entrada
    nuevoNombreInput.value = '';
    nuevoEmailInput.value = '';
  }
});
