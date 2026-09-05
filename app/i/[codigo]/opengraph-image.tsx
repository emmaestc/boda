import { ImageResponse } from "next/og";
import { wedding } from "@/lib/config/wedding";
import { InvitationCard, OG_SIZE } from "@/components/og/InvitationCard";
import { findPublicGuest } from "@/lib/guests/repository";
import { isValidCodeShape, normalizeCode } from "@/lib/guests/codes";
import { requesterKey, withinRateLimit } from "@/lib/auth/rate-limit";

export const alt = wedding.seo.title;
export const size = OG_SIZE;
export const contentType = "image/png";

/**
 * La tarjeta que dibuja WhatsApp al compartir una invitación personal, con el
 * nombre de quien la recibe.
 *
 * Tres cosas que esta ruta hace a propósito:
 *
 * 1. No registra la apertura. La página sí lo hace, pero aquí quien pide la
 *    imagen es un rastreador: contarlo inflaría el número de veces que un
 *    invitado ha abierto su invitación con visitas que nunca ocurrieron.
 *
 * 2. Gasta el mismo freno a la enumeración de códigos que la página, en su
 *    propio cubo. Devuelve el nombre asociado a un código, igual que la
 *    página, así que sería una puerta trasera a lo que aquella protege. Con
 *    cubo aparte, un rastreador no consume el margen del invitado.
 *
 * 3. Ante cualquier fallo —código inválido, límite alcanzado, base de datos
 *    caída— cae en la tarjeta genérica en lugar de dar error. Una vista previa
 *    sin nombre sigue siendo una vista previa; una que revienta deja el enlace
 *    como texto pelado, que es justo lo que veníamos a arreglar.
 */
export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  let nombre: string | null = null;

  try {
    const { codigo } = await params;
    const code = normalizeCode(codigo);

    if (isValidCodeShape(code)) {
      const permitido = await withinRateLimit(await requesterKey("og"), 30, 300);
      if (permitido) {
        const guest = await findPublicGuest(code);
        nombre = guest?.nombre ?? null;
      }
    }
  } catch {
    // Se queda sin nombre y sigue: más vale genérica que rota.
  }

  return new ImageResponse(<InvitationCard guestName={nombre} />, size);
}
