import { ImageResponse } from "next/og";
import { wedding } from "@/lib/config/wedding";
import { InvitationCard, OG_SIZE } from "@/components/og/InvitationCard";

export const alt = wedding.seo.title;
export const size = OG_SIZE;
export const contentType = "image/png";

/**
 * Imagen que se ve al compartir la portada por WhatsApp o redes.
 *
 * La versión con el nombre de quien recibe la invitación está en
 * `app/i/[codigo]/opengraph-image.tsx`; el diseño lo comparten.
 */
export default function OpenGraphImage() {
  return new ImageResponse(<InvitationCard />, size);
}
