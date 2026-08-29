"use client";

import { motion } from "framer-motion";
import { Sparkles, Footprints } from "lucide-react";
import { Scene, Eyebrow } from "@/components/invitation/Scene";
import { Reveal } from "@/components/ui/Reveal";
import { Divider } from "@/components/art/Icons";
import { Novios } from "@/components/art/Novios";
import { Eucalipto, Aliento } from "@/components/art/Botanical";
import { EASE_SILK, inViewOnce } from "@/lib/motion";
import { wedding } from "@/lib/config/wedding";

const copy = wedding.copy.dressCode;

/**
 * Los novios, dentro de un medallón.
 *
 * La silueta explica de un vistazo de qué va la sección, y el aro dorado que
 * se traza al entrar en pantalla la enmarca sin robarle protagonismo al texto,
 * que es donde está la regla de verdad.
 */
function Medallon() {
  return (
    <div className="relative grid h-32 w-32 shrink-0 place-items-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" fill="none">
        <circle cx="50" cy="50" r="47" fill="#ffffff" opacity="0.55" />
        <motion.circle
          cx="50"
          cy="50"
          r="47"
          stroke="#c6a867"
          strokeWidth="1.3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={inViewOnce}
          transition={{ duration: 1.8, ease: EASE_SILK, delay: 0.3 }}
          style={{ transformOrigin: "50% 50%", rotate: -90 }}
        />
        <circle cx="50" cy="50" r="43" stroke="#c6a867" strokeWidth="0.5" opacity="0.55" />
      </svg>

      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.86 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={inViewOnce}
        transition={{ duration: 1, ease: EASE_SILK, delay: 0.5 }}
      >
        <Novios className="h-[6rem] w-[6rem]" />
      </motion.div>
    </div>
  );
}

function Pauta({
  icono,
  titulo,
  texto,
  delay,
}: {
  icono: React.ReactNode;
  titulo: string;
  texto: string;
  delay: number;
}) {
  return (
    <motion.li
      className="flex items-start gap-4 text-left"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inViewOnce}
      transition={{ duration: 0.9, ease: EASE_SILK, delay }}
    >
      <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/30 bg-white/70 text-gold-deep">
        {icono}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="eyebrow text-ink-faint">{titulo}</span>
        <span className="font-sans text-base leading-relaxed text-ink-soft">{texto}</span>
      </span>
    </motion.li>
  );
}

/** Código de vestimenta. Va después de la recepción: primero el dónde y el
 *  cuándo, y ya con el plan claro, el cómo vestirse. */
export function DressCode() {
  return (
    <Scene id="vestimenta">
      <div className="relative isolate flex w-full flex-col items-center">
        {/* Botánica propia de la escena, muy tenue y fuera del texto */}
        <svg
          aria-hidden
          viewBox="0 0 200 120"
          className="pointer-events-none absolute -top-6 left-1/2 -z-10 w-[min(110%,30rem)] -translate-x-1/2 opacity-45"
        >
          <Eucalipto t="translate(4 74) rotate(-14) scale(0.72)" />
          <Eucalipto t="translate(196 74) rotate(194) scale(0.72)" />
          <Aliento t="translate(52 30) scale(0.7)" opacity={0.8} />
          <Aliento t="translate(148 30) scale(0.7)" opacity={0.8} />
        </svg>

        <Reveal>
          <Eyebrow>{copy.eyebrow}</Eyebrow>
        </Reveal>

        <Reveal delay={0.12}>
          <h3 className="mt-5 font-serif text-3xl leading-tight font-light text-ink sm:text-4xl">
            {copy.title}
          </h3>
        </Reveal>

        <Reveal delay={0.22}>
          <p className="text-gilded animate-shimmer mt-3 font-serif text-3xl tracking-[0.34em] uppercase sm:text-4xl">
            {copy.level}
          </p>
        </Reveal>

        <Reveal delay={0.32}>
          <Divider className="mt-6 w-44 text-gold" />
        </Reveal>

        {/* La regla del blanco, con su marca visual */}
        <motion.div
          className="glass-card mt-9 flex w-full max-w-md flex-col items-center gap-5 rounded-[1.75rem] px-7 py-8 sm:flex-row sm:gap-7 sm:px-9"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={inViewOnce}
          transition={{ duration: 1.2, ease: EASE_SILK }}
        >
          <Medallon />
          <p className="font-serif text-xl leading-relaxed font-light text-ink text-balance italic sm:text-left">
            {copy.note}
          </p>
        </motion.div>

        <ul className="mt-9 flex w-full max-w-md flex-col gap-5">
          <Pauta
            icono={<Footprints className="h-5 w-5" strokeWidth={1.5} />}
            titulo="Un consejo"
            texto={copy.warm}
            delay={0.2}
          />
          <Pauta
            icono={<Sparkles className="h-5 w-5" strokeWidth={1.5} />}
            titulo="Sobre todo"
            texto="Ven como te sientas más tú. Lo que queremos es verte."
            delay={0.3}
          />
        </ul>
      </div>
    </Scene>
  );
}
