"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Pequeños enganches a estados del navegador.
 *
 * Todos usan `useSyncExternalStore` porque eso es literalmente lo que son:
 * suscripciones a sistemas externos a React. Resuelto así, el render del
 * servidor y el primero del cliente coinciden sin necesidad de estado ni
 * efectos que provoquen renders en cascada.
 */

const noop = () => () => {};

/** `false` en el servidor, `true` una vez montado en el navegador. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

/** Sigue una media query en vivo. En el servidor devuelve `false`. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** `true` cuando la pestaña deja de estar visible. */
export function useDocumentHidden(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      document.addEventListener("visibilitychange", onChange);
      return () => document.removeEventListener("visibilitychange", onChange);
    },
    () => document.hidden,
    () => false,
  );
}
