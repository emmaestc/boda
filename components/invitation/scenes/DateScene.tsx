"use client";

import { motion } from "framer-motion";
import { CalendarHeart, Clock } from "lucide-react";
import { Scene, Eyebrow } from "@/components/invitation/Scene";
import { Reveal } from "@/components/ui/Reveal";
import { Countdown } from "@/components/invitation/Countdown";
import { ActionLink } from "@/components/ui/Button";
import { Aliento, Eucalipto, RosaBlanca } from "@/components/art/Botanical";
import { EASE_SILK, inViewOnce } from "@/lib/motion";
import { calendarLink } from "@/lib/calendar";
import { wedding } from "@/lib/config/wedding";

/** Filete con rombo en la punta: el remate que flanquea el número. */
function Filete({ lado }: { lado: "izq" | "der" }) {
  const origen = lado === "izq" ? "right" : "left";
  return (
    <motion.span
      className="flex items-center gap-2"
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={inViewOnce}
      transition={{ duration: 1.1, ease: EASE_SILK, delay: 0.35 }}
      style={{ transformOrigin: origen }}
    >
      {lado === "der" && <span className="h-px w-9 bg-gold/70 sm:w-14" />}
      <span className="block h-1.5 w-1.5 rotate-45 border border-gold" />
      {lado === "izq" && <span className="h-px w-9 bg-gold/70 sm:w-14" />}
    </motion.span>
  );
}

/**
 * La fecha, presentada como una placa conmemorativa.
 *
 * El arco superior no es un capricho: repite la forma del arco de la capilla,
 * de modo que la fecha y el lugar comparten lenguaje. Dentro, el número va
 * flanqueado por filetes con rombo y coronado por una pequeña composición
 * botánica, y el conjunto se cierra con un doble filete dorado.
 */
export function DateScene() {
  return (
    <Scene id="fecha">
      <Reveal>
        <Eyebrow>Nos casamos</Eyebrow>
      </Reveal>

      {/* ---------------- La placa ---------------- */}
      <motion.div
        className="relative mt-8 w-[min(100%,25rem)]"
        initial={{ opacity: 0, y: 34, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={inViewOnce}
        transition={{ duration: 1.3, ease: EASE_SILK }}
      >
        {/* Doble filete con arco: el de fuera marca, el de dentro afina. */}
        <div className="glass-card absolute inset-0 rounded-t-[14rem] rounded-b-[2rem] border-gold/35" />
        <div className="pointer-events-none absolute inset-[7px] rounded-t-[13rem] rounded-b-[1.6rem] border border-gold/25" />

        {/* Remate botánico sobre el arco */}
        <svg
          aria-hidden
          viewBox="0 0 200 70"
          className="pointer-events-none absolute -top-9 left-1/2 w-44 -translate-x-1/2"
        >
          <Eucalipto t="translate(96 46) rotate(-152) scale(0.6)" opacity={0.9} />
          <Eucalipto t="translate(104 46) rotate(-28) scale(0.6)" opacity={0.9} />
          <RosaBlanca t="translate(100 44) scale(0.46)" />
          <Aliento t="translate(64 30) scale(0.55)" opacity={0.85} />
          <Aliento t="translate(120 30) scale(0.55)" opacity={0.85} />
        </svg>

        <div className="relative flex flex-col items-center px-7 pb-9 pt-14 sm:px-10">
          <Reveal delay={0.1} y={12}>
            <p className="font-serif text-[1.6rem] tracking-[0.3em] text-ink-soft uppercase">
              {wedding.date.weekday}
            </p>
          </Reveal>

          <div className="mt-4 flex items-center justify-center gap-3 sm:gap-5">
            <Filete lado="izq" />
            <motion.span
              className="font-serif text-[6.5rem] leading-[0.82] font-light text-ink sm:text-[8rem]"
              initial={{ opacity: 0, scale: 1.3, filter: "blur(16px)" }}
              whileInView={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                transitionEnd: { filter: "none" },
              }}
              viewport={inViewOnce}
              transition={{ duration: 1.5, ease: EASE_SILK }}
            >
              {wedding.date.day}
            </motion.span>
            <Filete lado="der" />
          </div>

          <Reveal delay={0.42} y={12}>
            <p className="mt-3 font-serif text-[1.6rem] tracking-[0.42em] text-ink uppercase sm:text-[1.6rem]">
              {wedding.date.month}
            </p>
          </Reveal>

          <Reveal delay={0.5} y={12}>
            <p className="mt-1.5 font-sans text-xl tracking-[0.6em] text-ink-soft">
              {wedding.date.year}
            </p>
          </Reveal>

          {/* La hora, en su propia cápsula */}
          <Reveal delay={0.62} y={12}>
            <span className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-gold/45 bg-white/60 px-5 py-2.5">
              <Clock className="h-[1.15rem] w-[1.15rem] text-gold-text" strokeWidth={1.6} />
              <span className="font-sans text-base tracking-[0.3em] text-gold-text uppercase">
                {wedding.date.time}
              </span>
            </span>
          </Reveal>
        </div>
      </motion.div>

      {/* ---------------- La cuenta regresiva ---------------- */}
      <Reveal delay={0.2} className="mt-12">
        <Eyebrow className="text-ink-faint">Faltan</Eyebrow>
      </Reveal>

      <Reveal delay={0.3} className="mt-5 w-full">
        <Countdown />
      </Reveal>

      <Reveal delay={0.45} className="mt-10">
        <ActionLink href={calendarLink()} variant="outline">
          <CalendarHeart className="h-[1.1rem] w-[1.1rem] text-gold-text" strokeWidth={1.6} />
          Agendar en mi calendario
        </ActionLink>
      </Reveal>
    </Scene>
  );
}
