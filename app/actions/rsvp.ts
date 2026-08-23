"use server";

import { revalidatePath } from "next/cache";
import { rsvpInputSchema } from "@/lib/guests/schemas";
import { saveRsvp } from "@/lib/guests/repository";
import { requesterKey, withinRateLimit } from "@/lib/auth/rate-limit";

export type RsvpResult = { ok: true } | { ok: false; error: string };

/**
 * Registra la respuesta de una invitación.
 *
 * Una server action es un endpoint público: cualquiera puede llamarla con lo
 * que quiera. Por eso aquí no se confía en nada de lo que llega —se valida con
 * Zod, se limita por IP y el cupo se recorta contra la base de datos— y la
 * única llave que identifica al invitado es el código de su propio enlace.
 */
export async function submitRsvp(raw: unknown): Promise<RsvpResult> {
  const parsed = rsvpInputSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Revisa los datos e inténtalo de nuevo." };
  }

  const key = await requesterKey("rsvp");
  const allowed = await withinRateLimit(key, 15, 300);
  if (!allowed) {
    return { ok: false, error: "Demasiados intentos seguidos. Espera unos minutos." };
  }

  const input = parsed.data;
  const result = await saveRsvp({
    codigo: input.codigo,
    asiste: input.asiste,
    cantidad: input.cantidad,
    nombres: input.nombres,
    restriccion: input.restriccion,
    restriccion_detalle: input.restriccion_detalle ?? null,
    comentario: input.comentario ?? null,
  });

  if (!result.ok) return { ok: false, error: result.error };

  revalidatePath("/i/" + input.codigo);
  return { ok: true };
}
