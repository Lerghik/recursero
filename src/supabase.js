// ============================================================================
// CONFIGURACIÓN DE CONEXIÓN A SUPABASE
// ============================================================================

// URL base de tu proyecto Supabase (sin barra '/' al final)
const SUPABASE_URL = 'https://ihkixcaweettrmbkstd.supabase.co'; 

// Clave pública anónima de la API (Anon Key)
const SUPABASE_ANON_KEY = 'TU_ANON_KEY_AQUI'; 

// Inicialización del cliente oficial exportado como módulo
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true, // Persiste la sesión del administrador en el navegador
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});