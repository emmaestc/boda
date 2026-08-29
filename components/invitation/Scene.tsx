import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Contenedor común de todas las escenas. Mantiene el ritmo vertical y el ancho
 * de lectura idénticos en toda la experiencia, que es la mitad de lo que hace
 * que se sienta una sola pieza.
 */
export function Scene({
  id,
  children,
  className,
  tall = true,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tall?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        /*
         * El relleno vertical baja de 96 a 64 px: entre dos escenas se sumaban
         * 192 px de vacío, que en un teléfono es una pantalla entera de nada.
         */
        "relative mx-auto flex w-full max-w-2xl flex-col items-center justify-center px-6 py-16 text-center sm:py-24",
        /*
         * Y la altura mínima baja de 92 a 68 de la pantalla. Servía para dar
         * a cada escena su propio espacio, pero en las que tienen poco texto
         * forzaba 260 px de hueco que no aportaban nada.
         */
        tall && "min-h-[68svh]",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** Antetítulo en versalitas: la voz "práctica" de la invitación. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("eyebrow text-ink-faint", className)}>
      {children}
    </p>
  );
}
