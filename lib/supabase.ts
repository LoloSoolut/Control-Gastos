import { createClient } from '@supabase/supabase-js';

// NOTA: Estas son credenciales de ejemplo. Para producción, cámbialas por las tuyas en Supabase.
const FALLBACK_URL = 'https://esyzhzplfyoodjzmxvfd.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzeXpoenBsZnlvb2Rqem14dmZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDMzOTksImV4cCI6MjA4NTYxOTM5OX0.SG70OEQT-6_DVp-eP_dPXM1lj8GBax2AQ7DL9Kro8Kc';

const supabaseUrl = process.env.SUPABASE_URL || (window as any)._env_?.SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || (window as any)._env_?.SUPABASE_ANON_KEY || FALLBACK_KEY;

// Inicialización del cliente con prioridad a variables de entorno, luego fallback
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
    // Si la URL es la de fallback o una real, está "configurado" para la UI
    return !!supabaseUrl && supabaseUrl.startsWith('https://') && !supabaseUrl.includes('placeholder');
};