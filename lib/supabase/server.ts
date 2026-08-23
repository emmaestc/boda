import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/**
 * Cliente de Supabase del lado del servidor.
 *
 * Usa la clave secreta, que salta Row Level Security. Es la única forma en que
 * esta aplicación habla con la base de datos: el navegador no tiene ningún
 * cliente de Supabase, así que la superficie pública se reduce exactamente a
 * las funciones de servidor que escribimos nosotros.
 */
let client: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseSecretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { "X-Client-Info": "invitacion-emmanuel-johana" } },
    });
  }
  return client;
}
