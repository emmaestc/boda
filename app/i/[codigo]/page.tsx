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
 * El nombre del invitado no aparece en los metadatos: si el enlace se comparte
 * o se previsualiza en una aplicación de mensajería, no debe filtrarse a quién
 * pertenece la invitación.
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
