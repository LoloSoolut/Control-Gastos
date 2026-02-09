
import { createClient } from '@supabase/supabase-js';

// Note: These would normally be in process.env
// For this generation, we provide the logic to connect.
// Users need to set their actual credentials in their Supabase dashboard.
const supabaseUrl = (window as any)._env_?.SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = (window as any)._env_?.SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper for initial schema check or mock data logic
export const isSupabaseConfigured = () => {
    return supabaseUrl !== 'https://your-project-url.supabase.co';
};
