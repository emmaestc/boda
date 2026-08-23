"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Envelope } from "@/components/art/Envelope";
import { FloralCorner } from "@/components/art/Floral";
import { EASE_SILK } from "@/lib/motion";
import { wedding } from "@/lib/config/wedding";

/**
 * Preludio. Ocupa la pantalla completa y bloquea el relato hasta que la
 * persona decide abrir el sobre: la invitación no se lee, se abre.
 *
 * Ese clic cumple además una función técnica: es el gesto de usuario que los
 * navegadores exigen antes de permitir cualquier reproducción de audio.
 */
export function Prelude({
  guestName,
  onBegin,
  onOpen,
}: {
  guestName?: string | null;
  /** Se dispara en el instante del toque, dentro del gesto del usuario. */
  onBegin: () => void;
  /** Se dispara cuando el sobre ya se abrió y el relato puede aparecer. */
  onOpen: () => void;
}) {
  const reduced = useReducedMotion();
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);

    // Antes que nada y sin aplazarlo: la música necesita ejecutarse dentro
    // del propio gesto para que Safari en iOS la deje sonar.
    onBegin();

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate?.(18);
    }
    window.setTimeout(onOpen, reduced ? 320 : 1750);
  };

  return (
    <motion.div
      className={
        "fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden " +
        "bg-[radial-gradient(120%_90%_at_50%_0%,#ffffff,#f4f8fc_45%,#e8eff8)] px-6 " +
        (opening ? "pointer-events-none" : "")
      }
      initial={{ opacity: 1 }}
      // La salida la controla el propio preludio: cuando el destello blanco
      // llega a su punto máximo, el velo se disuelve y detrás ya está la
      // historia. Se hace aquí y no con AnimatePresence para no depender de
      // cómo se propaga la desmontada a través de un componente propio.
      animate={
        opening
          ? {
              opacity: 0,
              scale: 1.04,
              transition: { delay: reduced ? 0.3 : 1.75, duration: reduced ? 0.2 : 0.9, ease: EASE_SILK },
            }
          : { opacity: 1, scale: 1 }
      }
    >
      {/* Marco botánico, apenas insinuado */}
      <FloralCorner className="pointer-events-none absolute -left-8 -top-8 w-48 text-gold/25 sm:w-64" />
      <FloralCorner className="pointer-events-none absolute -bottom-8 -right-8 w-48 rotate-180 text-gold/25 sm:w-64" />

      <motion.div
        className="flex flex-col items-center gap-8"
        animate={opening ? { opacity: 0, transition: { delay: 1.1, duration: 0.6 } } : {}}
      >
        <motion.div
          className="flex flex-col items-center gap-1.5"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE_SILK, delay: 0.25 }}
        >
          <p className="font-script text-2xl text-ink-soft sm:text-3xl">
            {wedding.copy.envelope.eyebrow}
          </p>
          {guestName && (
            <p className="mt-2 font-sans text-[0.88rem] tracking-[0.36em] text-ink-faint uppercase">
              Para {guestName}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.4, ease: EASE_SILK, delay: 0.45 }}
        >
          <Envelope opened={opening} onOpen={handleOpen} />
        </motion.div>

        <motion.button
          type="button"
          onClick={handleOpen}
          disabled={opening}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_SILK, delay: 1 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="group relative mt-2 inline-flex min-h-12 items-center justify-center overflow-hidden rounded-full bg-ink px-9 py-3.5 font-sans text-[0.92rem] font-medium tracking-[0.3em] text-porcelain uppercase shadow-[0_18px_44px_-24px_rgba(36,56,79,0.9)] transition-colors hover:bg-[#1b2c3f] disabled:opacity-40"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(100deg,transparent,rgba(233,216,176,0.5),transparent)] transition-transform duration-[900ms] group-hover:translate-x-full" />
          <span className="relative">{wedding.copy.envelope.cta}</span>
        </motion.button>
      </motion.div>

      {/* Destello final: la luz que da paso a la historia */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={opening ? { opacity: [0, 0, 0.92] } : { opacity: 0 }}
        transition={{ duration: 1.7, times: [0, 0.55, 1], ease: "easeIn" }}
      />
    </motion.div>
  );
}
