"use client";

import { motion } from "framer-motion";
import { Scene, Eyebrow } from "@/components/invitation/Scene";
import { RevealText } from "@/components/ui/RevealText";
import { Reveal } from "@/components/ui/Reveal";
import { FloralSprig } from "@/components/art/Floral";
import { EASE_BREATH, inViewOnce } from "@/lib/motion";
import { wedding } from "@/lib/config/wedding";

/**
 * Ramita que se "dibuja" al entrar en pantalla: en lugar de aparecer, crece
 * desde la base del tallo hacia la punta mediante un recorte animado.
 */
function DrawnSprig({ className, flip }: { className: string; flip?: boolean }) {
  return (
    <motion.div
      className={className}
      initial={{ clipPath: flip ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)", opacity: 0 }}
      whileInView={{ clipPath: "inset(0 0% 0 0%)", opacity: 1 }}
      viewport={inViewOnce}
      transition={{ duration: 1.8, ease: EASE_BREATH, delay: 0.2, opacity: { duration: 0.4 } }}
    >
      <FloralSprig className="w-full text-gold/60" flip={flip} />
    </motion.div>
  );
}

/**
 * Primera escena del relato. El texto se escribe palabra a palabra mientras la
 * botánica se dibuja a los lados: nada aparece de golpe.
 */
export function Story() {
  return (
    <Scene id="historia">
      <Reveal>
        <Eyebrow>Nuestra historia</Eyebrow>
      </Reveal>

      <div className="mt-10 flex w-full items-center justify-center gap-4 sm:gap-6">
        <DrawnSprig className="hidden w-20 shrink-0 sm:block" flip />
        <motion.span
          className="block h-1.5 w-1.5 shrink-0 rotate-45 bg-gold/70"
          initial={{ scale: 0, rotate: 0 }}
          whileInView={{ scale: 1, rotate: 45 }}
          viewport={inViewOnce}
          transition={{ duration: 0.9, delay: 0.5 }}
        />
        <DrawnSprig className="hidden w-20 shrink-0 sm:block" />
      </div>

      <RevealText
        as="blockquote"
        text={wedding.copy.story}
        delay={0.35}
        stagger={0.06}
        className="mt-8 max-w-xl font-serif text-[1.6rem] leading-[1.5] font-light text-ink italic text-balance sm:text-[2.05rem] sm:leading-[1.45]"
      />

      <Reveal delay={0.9} y={14}>
        <div className="mt-12 flex flex-col items-center gap-3">
          <span className="block h-14 w-px bg-[linear-gradient(180deg,#c6a867,transparent)]" />
          <p className="font-script text-2xl text-gold-deep">y así nos encontramos</p>
        </div>
      </Reveal>
    </Scene>
  );
}
