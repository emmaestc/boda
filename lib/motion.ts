import type { Transition, Variants } from "framer-motion";

/**
 * Vocabulario de movimiento común a toda la invitación. Tener las curvas y los
 * tiempos en un solo sitio es lo que hace que la experiencia se sienta como
 * una sola pieza y no como ocho secciones animadas por separado.
 */

/** Salida suave y larga: el gesto por defecto de la boda. */
export const EASE_SILK = [0.16, 1, 0.3, 1] as const;
/** Entrada y salida equilibradas, para elementos que respiran. */
export const EASE_BREATH = [0.45, 0, 0.25, 1] as const;

export const springSoft: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 22,
  mass: 0.9,
};

/** Aparición desde abajo con desenfoque: el "revelado" base. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: EASE_SILK },
  },
};

/** Contenedor que escalona a sus hijos. */
export function stagger(each = 0.09, delay = 0): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: each, delayChildren: delay } },
  };
}

/** Trazado de SVG que se dibuja solo. */
export const drawStroke: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 2.4, ease: EASE_BREATH },
      opacity: { duration: 0.4 },
    },
  },
};

/** Margen de disparo: la escena empieza a animar justo antes de entrar. */
export const inViewOnce = { once: true, amount: 0.35, margin: "0px 0px -12% 0px" } as const;
