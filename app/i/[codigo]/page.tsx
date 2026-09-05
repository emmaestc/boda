import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Invitation } from "@/components/invitation/Invitation";
import { findPublicGuest, recordOpening } from "@/lib/guests/repository";
import { isValidCodeShape, normalizeCode } from "@/lib/guests/codes";
import { requesterKey, withinRateLimit } from "@/lib/auth/rate-limit";
import { wedding } from "@/lib/config/wedding";

/** Nunca se cachea: cada invitado tiene que ver su propio estado al día. */
export const dynamic = "force-dynamic";

/**
 * El título y la descripción son los mismos para todo el mundo. El nombre de
 * quien recibe la invitación sí aparece, pero solo dentro de la imagen que
 * dibuja `opengraph-image.tsx`, que es la que ve WhatsApp.
 *
 * Es una decisión tomada sabiendo lo que cuesta: al viajar en la tarjeta, el
 * nombre acompaña al enlace si alguien lo reenvía. Se aceptó porque estas
 * invitaciones se envían de una en una y la página ya muestra el nombre en
 * grande; a cambio, la vista previa deja de ser genérica.
 *
 * `noindex` se queda: que sea personal no significa que deba indexarse.
 */
export const metadata: Metadata = {
  title: wedding.seo.title,
  description: wedding.seo.description,
  robots: { index: false, follow: false },
};

export default async function InvitacionPersonal({
  params,
}: PageProps<"/i/[codigo]">) {
  const { codigo } = await params;
  const code = normalizeCode(codigo);

  if (!isValidCodeShape(code)) notFound();

  // Freno a la enumeración de códigos: 30 consultas por IP cada cinco minutos.
  const allowed = await withinRateLimit(await requesterKey("invitacion"), 30, 300);
  if (!allowed) notFound();

  const guest = await findPublicGuest(code);
  if (!guest) notFound();

  await recordOpening(code);

  return <Invitation guest={guest} />;
}
