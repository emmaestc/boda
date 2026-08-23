"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Scene, Eyebrow } from "@/components/invitation/Scene";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { Heart, Divider } from "@/components/art/Icons";
import { EASE_SILK } from "@/lib/motion";
import { wedding } from "@/lib/config/wedding";

type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

/** Sobrecitos cayendo despacio: la "lluvia" literal, en clave delicada. */
function EnvelopeRain() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  const drops = [
    { left: 8, size: 26, dur: 19, delay: 0, drift: 40, spin: 25 },
    { left: 24, size: 18, dur: 26, delay: -6, drift: -60, spin: -40 },
    { left: 44, size: 22, dur: 22, delay: -12, drift: 30, spin: 30 },
    { left: 63, size: 16, dur: 29, delay: -3, drift: -35, spin: -20 },
    { left: 79, size: 24, dur: 24, delay: -16, drift: 55, spin: 35 },
    { left: 92, size: 19, dur: 21, delay: -9, drift: -25, spin: -30 },
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {drops.map((d) => (
        <span
          key={d.left}
          className="petal"
          style={
            {
              left: d.left + "%",
              width: d.size,
              height: d.size * 0.68,
              animationDuration: d.dur + "s",
              animationDelay: d.delay + "s",
              "--petal-drift": d.drift + "px",
              "--petal-spin": d.spin + "deg",
              "--petal-opacity": 0.5,
            } as CSSVars
          }
        >
          <svg viewBox="0 0 34 24" className="h-full w-full text-gold/70">
            <rect
              x="0.6"
              y="0.6"
              width="32.8"
              height="22.8"
              rx="2"
              fill="#fffdf7"
              stroke="currentColor"
              strokeWidth="0.9"
            />
            <path d="M1 2 17 14 33 2" fill="none" stroke="currentColor" strokeWidth="0.9" />
          </svg>
        </span>
      ))}
    </div>
  );
}

/** Sobre que se abre al tocarlo y deja salir un corazón. */
function GiftEnvelope() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      aria-label={open ? "Cerrar el sobre" : "Abrir el sobre"}
      className="group relative mt-2 h-32 w-44 cursor-pointer"
      style={{ perspective: 900 }}
    >
      <div className="absolute inset-0 rounded-[8px] bg-[linear-gradient(160deg,#fffdf7,#f0ead9)] shadow-[0_16px_36px_-24px_rgba(122,95,40,0.8)]" />

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute inset-x-3 top-2 z-10 flex h-24 flex-col items-center justify-center gap-1 rounded-[5px] border border-gold/25 bg-white"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: "-46%", opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE_SILK, delay: reduced ? 0 : 0.35 }}
          >
            <Heart className="w-5 text-gold-deep" />
            <span className="font-script text-lg text-ink-soft">Gracias</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="absolute inset-0 z-20 rounded-[8px] bg-[linear-gradient(200deg,#fdfbf3,#eae2cd)]"
        style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%, 100% 0, 50% 46%)" }}
      />

      <motion.div
        className="absolute inset-x-0 top-0 h-[46%] origin-top rounded-t-[8px] bg-[linear-gradient(180deg,#fffefa,#f2ecdc)]"
        style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", backfaceVisibility: "hidden" }}
        animate={{ rotateX: open ? -168 : 0, zIndex: open ? 5 : 30 }}
        transition={{ duration: reduced ? 0.2 : 0.85, ease: EASE_SILK, zIndex: { delay: 0.3 } }}
      />

      <motion.span
        className="absolute left-1/2 top-[46%] z-40 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_32%_28%,#e9d8b0,#c6a867_50%,#8f6f34)] shadow-[0_4px_12px_-6px_rgba(122,95,40,0.9)]"
        animate={{ opacity: open ? 0 : 1, scale: open ? 1.3 : 1 }}
        transition={{ duration: 0.4 }}
      />

      {!open && (
        <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 font-sans text-[0.55rem] tracking-[0.3em] text-ink-faint uppercase">
          Tócalo
        </span>
      )}
    </button>
  );
}

/**
 * Lluvia de sobres. El encargo era que no se sintiera comercial: por eso la
 * frase va primero, en voz baja, y el título llega después como consecuencia
 * y no como pedido.
 */
export function Gift() {
  return (
    <Scene id="regalo" className="overflow-hidden">
      <EnvelopeRain />

      <div className="relative flex w-full flex-col items-center">
        <Reveal>
          <Eyebrow>Un detalle</Eyebrow>
        </Reveal>

        <RevealText
          text={wedding.copy.gift.intro}
          delay={0.2}
          stagger={0.035}
          className="mt-8 max-w-lg font-serif text-lg leading-relaxed font-light text-ink-soft italic text-balance sm:text-xl"
        />

        <Reveal delay={0.4} className="mt-10">
          <Divider className="w-40 text-gold" />
        </Reveal>

        <Reveal delay={0.5}>
          <h3 className="mt-6 font-script text-4xl text-gilded animate-shimmer sm:text-5xl">
            {wedding.copy.gift.title}
          </h3>
        </Reveal>

        <Reveal delay={0.62}>
          <GiftEnvelope />
        </Reveal>

        <Reveal delay={0.75}>
          <p className="mt-14 max-w-xs font-sans text-xs leading-relaxed text-ink-faint">
            {wedding.copy.gift.note}
          </p>
        </Reveal>
      </div>
    </Scene>
  );
}
