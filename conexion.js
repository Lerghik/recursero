/**
 * ARCHIVO: conexion.js
 * RESPONSABILIDAD: Gestionar e inicialización del cliente global de Supabase.
 */

// Variable global que contendrá la instancia activa del cliente Supabase
let supabaseClient = null;

// Obtención de referencias a elementos del DOM
const urlInput = document.getElementById('supabase-url');
const keyInput = document.getElementById('supabase-key');
const btnConectar = document.getElementById('btn-conectar');

// Evento que se ejecuta al hacer clic en "Conectar a Supabase"
btnConectar.addEventListener('click', () => {
  const url = urlInput.value.trim();
  const key = keyInput.value.trim();

  // Validar que ambos campos contengan texto
  if (!url || !key) {
    alert('Por favor ingresa la URL y la Key de Supabase.');
    return;
  }

  try {
    // Inicializar el cliente utilizando la CDN global 'window.supabase'
    supabaseClient = window.supabase.createClient(url, key);
    alert('Conexión inicializada con éxito.');

    // Si la función comprobarSesion existe (declarada en auth.js), se ejecuta para validar el estado actual
    if (typeof comprobarSesion === 'function') {
      comprobarSesion();
    }
  } catch (error) {
    alert('Error al conectar con Supabase: ' + error.message);
  }
});

/**
 * Función auxiliar (helper) para verificar si el cliente fue inicializado.
 * Se reutiliza en los otros archivos JS antes de hacer cualquier llamada a la API.
 * @returns {boolean}
 */
function verificarCliente() {
  if (!supabaseClient) {
    alert('Primero debes conectar con Supabase ingresando la URL y la Anon Key.');
    return false;
  }
  return true;
}
