import './urlPolyfill';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  '';

const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL veya anon key eksik. .env dosyasını kontrol edin.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
