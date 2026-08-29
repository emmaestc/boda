"use client";

import { motion } from "framer-motion";
import { Shirt, Sparkles, Footprints } from "lucide-react";
import { Scene, Eyebrow } from "@/components/invitation/Scene";
import { Reveal } from "@/components/ui/Reveal";
import { Divider } from "@/components/art/Icons";
import { Eucalipto, Aliento } from "@/components/art/Botanical";
import { EASE_SILK, inViewOnce } from "@/lib/motion";
import { wedding } from "@/lib/config/wedding";

const copy = wedding.copy.dressCode;

/**
 * La regla del blanco, dibujada.
 *
 * Un círculo de tela blanca tachado se entiende antes que cualquier frase, y
 * deja el texto para explicar el porqué en tono amable. El aro que lo rodea se
 * traza al entrar en pantalla, como si alguien lo marcara a mano.
 */
function SoloParaLaNovia() {
  return (
    <div className="relative grid h-28 w-28 shrink-0 place-items-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" fill="none">
        <motion.circle
          cx="50"
          cy="50"
          r="43"
          stroke="#c6a867"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="4 6"
          initial={{ pathLength: 0, rotate: -90 }}
          whileInView={{ pathLength: 1 }}
          viewport={inViewOnce}
          transition={{ duration: 1.8, ease: EASE_SILK, delay: 0.3 }}
          style={{ transformOrigin: "50% 50%" }}
        />
      </svg>

      {/* La muestra de tela blanca */}
      <div className="relative grid h-[4.6rem] w-[4.6rem] place-items-center rounded-full border border-gold/35 bg-[radial-gradient(circle_at_34%_30%,#ffffff,#f3f1ea)] shadow-[inset_0_-6px_14px_-8px_rgba(36,56,79,0.35)]">
        <span className="font-serif text-[0.95rem] tracking-[0.2em] text-ink-faint uppercase">
          blanco
        </span>
        {/* La barra que lo reserva */}
        <motion.span
          className="absolute h-[1.6px] w-[5.4rem] origin-center rounded-full bg-gold-deep"
          style={{ rotate: -32 }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={inViewOnce}
          transition={{ duration: 0.8, ease: EASE_SILK, delay: 1.4 }}
        />
      </div>
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

/** Código de vestimenta. Va justo después de la iglesia, que es cuando la
 *  pregunta aparece sola en la cabeza de quien lee. */
export function DressCode() {
  return (
    <Scene id="vestimenta">
      <div className="relative flex w-full flex-col items-center">
        {/* Botánica propia de la escena, muy tenue y fuera del texto */}
        <svg
          aria-hidden
          viewBox="0 0 200 120"
          className="pointer-events-none absolute -top-6 left-1/2 w-[min(110%,30rem)] -translate-x-1/2 opacity-45"
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
          <p className="mt-2 font-script text-5xl text-gilded animate-shimmer">
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
          <SoloParaLaNovia />
          <p className="font-serif text-xl leading-relaxed font-light text-ink text-balance italic sm:text-left">
            {copy.note}
          </p>
        </motion.div>

        <ul className="mt-9 flex w-full max-w-md flex-col gap-5">
          <Pauta
            icono={<Shirt className="h-5 w-5" strokeWidth={1.5} />}
            titulo="Qué llevar"
            texto={copy.hint}
            delay={0.1}
          />
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
