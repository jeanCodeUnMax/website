// src/routes/+layout.ts
import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import { createSupabaseLoadClient } from "@supabase/auth-helpers-sveltekit";
import type { LayoutLoad } from "./$types";
import type { DatabaseDefinitions } from "$lib/database/database.types";

export const load: LayoutLoad = async({ fetch, data, depends }) => {
  depends("supabase:auth");

  const supabase = createSupabaseLoadClient<DatabaseDefinitions>({
    supabaseKey: PUBLIC_SUPABASE_KEY,
    supabaseUrl: PUBLIC_SUPABASE_URL,
    event: { fetch },
    serverSession: data.session
  });

  const {
    data: { session }
  } = await supabase.auth.getSession();

  return { supabase, session };
};