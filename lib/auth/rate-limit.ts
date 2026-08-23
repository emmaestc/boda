import "server-only";
import { headers } from "next/headers";
import { createHash } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Contador de intentos compartido, guardado en PostgreSQL.
 *
 * En un entorno serverless cada petición puede caer en una instancia nueva, así
 * que un contador en memoria no limita nada: el estado tiene que vivir en la
 * base de datos. La cuenta se hace en una sola sentencia atómica.
 */
export async function withinRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
  { failOpen = true }: { failOpen?: boolean } = {},
): Promise<boolean> {
  const { data, error } = await supabaseAdmin().rpc("check_rate_limit", {
    p_key: key,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });

  if (error) {
    // Un fallo de infraestructura no debería impedir que alguien confirme su
    // asistencia; en el acceso al panel, en cambio, preferimos cerrar.
    return failOpen;
  }
  return data === true;
}

/**
 * Identificador aproximado de quien hace la petición. Se guarda como hash:
 * sirve para contar intentos sin llegar a almacenar direcciones IP.
 */
export async function requesterKey(prefix: string): Promise<string> {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "desconocida";
  const digest = createHash("sha256").update(ip).digest("hex").slice(0, 24);
  return prefix + ":" + digest;
}
