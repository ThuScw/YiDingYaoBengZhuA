import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client = null;
let warned = false;

export function getSupabase() {
  if (!client) {
    if (!supabaseUrl || !supabaseAnonKey) {
      if (!warned) {
        console.warn('Supabase 未配置（缺少环境变量 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY），排行榜功能不可用');
        warned = true;
      }
      return null;
    }
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}
