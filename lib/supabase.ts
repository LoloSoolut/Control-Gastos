import { createClient } from '@supabase/supabase-js';

// Valores por defecto para evitar errores de sintaxis si no se proporcionan variables
const DEFAULT_URL = 'https://placeholder.supabase.co';
const DEFAULT_KEY = 'placeholder-key';

const supabaseUrl = (window as any)._env_?.SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey = (window as any)._env_?.SUPABASE_ANON_KEY || DEFAULT_KEY;

// Inicialización segura del cliente
export const supabase = createClient(
  supabaseUrl === 'tu-url-de-supabase' ? DEFAULT_URL : supabaseUrl, 
  supabaseAnonKey === 'tu-anon-key-de-supabase' ? DEFAULT_KEY : supabaseAnonKey
);

export const isSupabaseConfigured = () => {
    return supabaseUrl !== DEFAULT_URL && !supabaseUrl.includes('tu-url-de-supabase');
};