import { createClient } from "@supabase/supabase-js";

const env =
  (typeof import.meta !== "undefined" && (import.meta as any).env) ||
  (typeof globalThis !== "undefined" && (globalThis as any).process?.env) ||
  {};
const supabaseUrl = env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const toSyntheticEmail = (username: string) =>
  `${username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "")}@ozingyoz.app`;
