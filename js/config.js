/**
 * Configuración de Supabase
 * 
 * INSTRUCCIONES PARA CONFIGURAR:
 * 1. Ve a https://supabase.com y crea una cuenta/proyecto
 * 2. En el dashboard, ve a Settings → API
 * 3. Copia tu SUPABASE_URL y SUPABASE_ANON_KEY
 * 4. Reemplaza los valores a continuación
 */

const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

// Inicializa el cliente de Supabase
const { createClient } = window.supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✓ Supabase configurado');