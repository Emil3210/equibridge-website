import "server-only";
import { createClient } from "@supabase/supabase-js";

// Server-side client using the publishable key. Row-level security in the database only
// allows INSERTs into the form tables, so this key can never read submissions back.
export function supabaseServer() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY environment variables.");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
