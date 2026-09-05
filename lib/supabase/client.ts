import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-opennova.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHED_KEY || "placeholder-anon-key"
  );
}