"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Monogram } from "./Monogram";
import { wedding } from "@/lib/config/wedding";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Sobre de papel con lacre. Se construye con capas HTML en lugar de SVG porque
 * la solapa gira en 3D (`rotateX`) y las transformaciones tridimensionales son
 * mucho más fiables sobre elementos HTML, sobre todo en Safari iOS.
 */
export function Envelope({
  opened,
  onOpen,
}: {
  opened: boolean;
  onOpen: () => void;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      disabled={opened}
      aria-label="Abrir la invitación"
      className="group relative block w-[min(84vw,360px)] cursor-pointer rounded-[10px] disabled:cursor-default"
      style={{ perspective: 1400, aspectRatio: "1.42 / 1" }}
      animate={reduced || opened ? {} : { y: [0, -9, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Sombra proyectada sobre el papel del fondo */}
      <div
        aria-hidden
        className="absolute -bottom-6 left-1/2 h-8 w-[78%] -translate-x-1/2 rounded-[50%] bg-ink/15 blur-xl"
      />

      {/* Cuerpo trasero del sobre */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[10px] border border-white/70 bg-[linear-gradient(160deg,#fffdf7,#e8eff8)] shadow-[var(--shadow-lift)]"
      />

      {/* Tarjeta que asoma al abrirse */}
      <motion.div
        aria-hidden
        className="absolute inset-x-[7%] top-[6%] z-10 flex h-[88%] flex-col items-center justify-center gap-1 rounded-[6px] border border-gold/25 bg-linear-to-b from-white to-mist shadow-[0_10px_30px_-18px_rgba(36,56,79,0.5)]"
        initial={false}
        animate={opened ? { y: "-42%", scale: 1.03 } : { y: "0%", scale: 1 }}
        transition={{ duration: reduced ? 0.2 : 1.15, ease: EASE, delay: opened && !reduced ? 0.62 : 0 }}
      >
        <Monogram size={56} />
        <p className="font-serif text-[0.62rem] tracking-[0.42em] text-ink-soft uppercase">
          {wedding.date.day} · {wedding.date.month} · {wedding.date.year}
        </p>
      </motion.div>

      {/* Bolsillo frontal: rectángulo con una V recortada en la parte superior */}
      <div
        aria-hidden
        className="absolute inset-0 z-20 rounded-[10px] bg-[linear-gradient(200deg,#fdfcf8,#f4f8fc_55%,#dfe9f5)]"
        style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%, 100% 0, 50% 45%)" }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-full w-full text-gold/35"
        >
          <path d="M0 100 50 45 100 100" stroke="currentColor" strokeWidth="0.35" fill="none" vectorEffect="non-scaling-stroke" />
          <path d="M0 0 50 45 100 0" stroke="currentColor" strokeWidth="0.25" fill="none" vectorEffect="non-scaling-stroke" opacity="0.6" />
        </svg>
      </div>

      {/* Solapa superior: gira sobre su borde de arriba */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[45%] origin-top rounded-t-[10px] bg-linear-to-b from-[#fbfaf5] to-[#eaf1f9]"
        style={{
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
        initial={false}
        animate={
          opened
            ? { rotateX: reduced ? -170 : -172, zIndex: 5 }
            : { rotateX: 0, zIndex: 30 }
        }
        transition={{
          duration: reduced ? 0.2 : 1.1,
          ease: EASE,
          delay: opened && !reduced ? 0.2 : 0,
          zIndex: { delay: opened ? 0.45 : 0 },
        }}
      >
        <div className="absolute inset-0 border-t border-white/80" />
      </motion.div>

      {/* Lacre dorado */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-[45%] z-40 h-14 w-14 -translate-x-1/2 -translate-y-1/2"
        initial={false}
        animate={
          opened
            ? { scale: 1.4, opacity: 0, rotate: 14, filter: "blur(3px)" }
            : { scale: 1, opacity: 1, rotate: 0, filter: "blur(0px)" }
        }
        transition={{ duration: reduced ? 0.15 : 0.5, ease: "easeOut" }}
      >
        <div className="relative h-full w-full">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,#e9d8b0,#c6a867_45%,#8f6f34)] shadow-[0_6px_18px_-8px_rgba(122,95,40,0.9)]" />
          <div className="absolute inset-[3px] rounded-full border border-white/35" />
          {/* En un lacre de 56 px dos iniciales cursivas quedan ilegibles;
              el ampersand solo se lee perfecto y es el motivo de toda la
              invitación. */}
          <span className="absolute inset-0 grid place-items-center pb-[3px] font-script text-[1.9rem] leading-none text-white/90">
            &amp;
          </span>
          {!reduced && !opened && (
            <span className="absolute -inset-2 rounded-full bg-gold/25 blur-md animate-breathe" />
          )}
        </div>
      </motion.div>
    </motion.button>
  );
}
