// Importamos el cliente oficial de Supabase que cargamos globalmente mediante el CDN en el HTML
const SUPABASE_URL = 'https://ihkixcaweettrmtbkstd.supabase.co'; // URL de tu proyecto en Supabase
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imloa2l4Y2F3ZWV0dHJtdGJrc3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0MDA4NjQsImV4cCI6MjEwNjk3Njg2NH0.iAz1nQCyjzmTRNYqdor5kxtYlP0WGgI1FCTWWBdWB-o'; // Clave pública anónima de tu proyecto

// Inicializamos la conexión con Supabase y la exportamos para reusarla en los otros archivos JS
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true, // Persistir sesión
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});