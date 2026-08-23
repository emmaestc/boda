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
        "relative mx-auto flex w-full max-w-2xl flex-col items-center justify-center px-6 py-24 text-center sm:py-32",
        tall && "min-h-[92svh]",
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
    <p
      className={cn(
        "font-sans text-[0.6rem] font-medium tracking-[0.42em] text-ink-faint uppercase",
        className,
      )}
    >
      {children}
    </p>
  );
}
