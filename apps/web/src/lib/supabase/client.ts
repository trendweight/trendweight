import { createClient } from "@supabase/supabase-js";

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing required Supabase configuration. Please check environment variables.");
  console.error("URL:", supabaseUrl);
  console.error("Key:", supabaseAnonKey ? "Set" : "Missing");
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce", // Use PKCE flow for better security
  },
});
