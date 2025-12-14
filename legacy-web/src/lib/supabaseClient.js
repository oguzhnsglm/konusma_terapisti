import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate URL format
const isValidUrl = supabaseUrl && (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'));

// Create supabase client or null if credentials not configured
let supabase = null;

if (!supabaseUrl || !supabaseAnonKey || !isValidUrl) {
  console.warn('⚠️ Supabase credentials not configured. Auth features disabled.');
  console.warn('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

export { supabase };
