import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Consola de invitados",
  robots: { index: false, follow: false, nocache: true },
};

/** La consola nunca se cachea ni se prerenderiza. */
export const dynamic = "force-dynamic";

/**
 * Puerta del panel.
 *
 * Está en un grupo de rutas `(panel)` para que envuelva la consola pero no la
 * pantalla de acceso, que vive fuera del grupo: si el layout cubriera también
 * `/consola/login`, la redirección al login se llamaría a sí misma sin fin.
 */
export default async function PanelLayout({ children }: { children: ReactNode }) {
  await requireSession();
  return <>{children}</>;
}
