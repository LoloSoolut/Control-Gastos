
import { createClient } from '@supabase/supabase-js';

// Intentar obtener de process.env (Vercel/Build time) o window._env_ (Runtime)
const supabaseUrl = process.env.SUPABASE_URL || (window as any)._env_?.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || (window as any)._env_?.SUPABASE_ANON_KEY || '';

// Solo inicializamos si tenemos valores que no parecen ser los marcadores de posición
const isValidConfig = supabaseUrl && 
                     supabaseAnonKey && 
                     !supabaseUrl.includes('placeholder') && 
                     !supabaseUrl.includes('tu-url-de-supabase');

// Cliente de fallback para evitar que la app explote, pero que fallará controladamente
export const supabase = createClient(
  isValidConfig ? supabaseUrl : 'https://esyzhzplfyoodjzmxvfd.supabase.co',
  isValidConfig ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzeXpoenBsZnlvb2Rqem14dmZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDMzOTksImV4cCI6MjA4NTYxOTM5OX0.SG70OEQT-6_DVp-eP_dPXM1lj8GBax2AQ7DL9Kro8Kc'
);

export const isSupabaseConfigured = () => isValidConfig;
