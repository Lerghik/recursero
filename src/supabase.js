// ============================================================================
// CONFIGURACIÓN DE CONEXIÓN A SUPABASE
// ============================================================================

// URL base de tu proyecto Supabase (sin barra '/' al final)
const SUPABASE_URL = 'https://ihkixcaweettrmtbkstd.supabase.co'; 

// Clave pública anónima de la API (Anon Key)
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imloa2l4Y2F3ZWV0dHJtdGJrc3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0MDA4NjQsImV4cCI6MjEwNjk3Njg2NH0.iAz1nQCyjzmTRNYqdor5kxtYlP0WGgI1FCTWWBdWB-o';
// Inicialización del cliente oficial exportado como módulo
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true, // Persiste la sesión del administrador en el navegador
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});