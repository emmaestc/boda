/**
 * Vocabulario de movimiento común a toda la invitación. Tener las curvas y los
 * tiempos en un solo sitio es lo que hace que la experiencia se sienta como
 * una sola pieza y no como ocho secciones animadas por separado.
 */

/** Salida suave y larga: el gesto por defecto de la boda. */
export const EASE_SILK = [0.16, 1, 0.3, 1] as const;
/** Entrada y salida equilibradas, para elementos que respiran. */
export const EASE_BREATH = [0.45, 0, 0.25, 1] as const;

/** Margen de disparo: la escena empieza a animar justo antes de entrar. */
export const inViewOnce = { once: true, amount: 0.35, margin: "0px 0px -12% 0px" } as const;
