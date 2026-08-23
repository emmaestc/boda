"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { wedding } from "@/lib/config/wedding";

const TARGET = new Date(wedding.date.iso).getTime();

/** Segundos que faltan, o 0 si la fecha ya llegó. */
function secondsLeft(): number {
  return Math.max(0, Math.floor((TARGET - Date.now()) / 1000));
}

/**
 * El tiempo es un sistema externo a React, así que se lee con
 * `useSyncExternalStore` en lugar de con estado y efectos. Además de ser el
 * patrón correcto, resuelve solo el problema de la hidratación: en el servidor
 * devuelve `null` y el primer render del cliente coincide exactamente.
 */
function subscribe(onChange: () => void): () => void {
  const id = window.setInterval(() => {
    // Con la pestaña en segundo plano nadie mira el reloj.
    if (!document.hidden) onChange();
  }, 1000);

  const resync = () => {
    if (!document.hidden) onChange();
  };
  document.addEventListener("visibilitychange", resync);

  return () => {
    window.clearInterval(id);
    document.removeEventListener("visibilitychange", resync);
  };
}

const LABELS = [
  { key: "días", divisor: 86400 },
  { key: "horas", divisor: 3600, modulo: 24 },
  { key: "min", divisor: 60, modulo: 60 },
  { key: "seg", divisor: 1, modulo: 60 },
] as const;

/** Un dígito que rueda al cambiar, en lugar de parpadear. */
function Unit({ value, label }: { value: number; label: string }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className="flex min-w-[3.6rem] flex-col items-center gap-1.5">
      <div className="relative h-11 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            className="block font-serif text-4xl font-light tabular-nums text-ink"
            initial={{ y: "-70%", opacity: 0, filter: "blur(4px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
            exit={{ y: "70%", opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="font-sans text-[0.88rem] tracking-[0.28em] text-ink-faint uppercase">
        {label}
      </span>
    </div>
  );
}

/**
 * Cuenta regresiva hasta la ceremonia. Se detiene sola al llegar la fecha y
 * cede el sitio a un mensaje.
 */
export function Countdown() {
  const remaining = useSyncExternalStore(subscribe, secondsLeft, () => null);

  // Render del servidor y primer render del cliente: un hueco de la misma
  // altura, para que nada salte al hidratar.
  if (remaining === null) {
    return <div aria-hidden className="h-[4.4rem]" />;
  }

  if (remaining === 0) {
    return <p className="font-script text-3xl text-gold-deep">Hoy es el día</p>;
  }

  const days = Math.floor(remaining / 86400);

  return (
    <div
      className="flex items-start justify-center gap-1 sm:gap-3"
      role="timer"
      aria-live="off"
      aria-label={"Faltan " + days + " días para la ceremonia"}
    >
      {LABELS.map((unit, i) => {
        const raw = Math.floor(remaining / unit.divisor);
        const value = "modulo" in unit ? raw % unit.modulo : raw;
        return (
          <div key={unit.key} className="flex items-start">
            {i > 0 && (
              <span className="mt-1 px-0.5 font-serif text-3xl font-light text-gold/60 sm:px-1.5">
                ·
              </span>
            )}
            <Unit value={value} label={unit.key} />
          </div>
        );
      })}
    </div>
  );
}
