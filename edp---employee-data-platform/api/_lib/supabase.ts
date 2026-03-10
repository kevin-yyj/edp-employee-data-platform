import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "Missing SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY for API runtime",
  );
}

export const supabaseAdmin = createClient(
  supabaseUrl || "",
  supabaseServiceRoleKey || "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export const supabaseAuth = createClient(supabaseUrl || "", supabaseAnonKey || "", {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
