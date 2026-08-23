"use client";

import { motion } from "framer-motion";
import { Scene, Eyebrow } from "@/components/invitation/Scene";
import { Reveal } from "@/components/ui/Reveal";
import { Countdown } from "@/components/invitation/Countdown";
import { ActionLink } from "@/components/ui/Button";
import { FloralWreath } from "@/components/art/Floral";
import { EASE_SILK, inViewOnce } from "@/lib/motion";
import { calendarLink } from "@/lib/calendar";
import { wedding } from "@/lib/config/wedding";

/**
 * La fecha. El número entra como una pieza sólida entre dos filetes que se
 * abren hacia los lados, y debajo late la cuenta regresiva.
 */
export function DateScene() {
  return (
    <Scene id="fecha">
      <Reveal>
        <Eyebrow>Nos casamos</Eyebrow>
      </Reveal>

      <div className="relative mt-10 flex w-full flex-col items-center">
        <FloralWreath className="pointer-events-none absolute -top-6 w-[min(100%,26rem)] text-sage/45" />

        <Reveal delay={0.1} y={10}>
          <p className="font-script text-3xl text-ink-soft">{wedding.date.weekday}</p>
        </Reveal>

        <div className="mt-3 flex items-center justify-center gap-4 sm:gap-6">
          <motion.span
            className="h-px w-10 bg-gold/70 sm:w-16"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={inViewOnce}
            transition={{ duration: 1.1, ease: EASE_SILK, delay: 0.35 }}
            style={{ transformOrigin: "right" }}
          />
          <motion.span
            className="font-serif text-[5.5rem] leading-[0.85] font-light text-ink sm:text-[7.5rem]"
            initial={{ opacity: 0, scale: 1.35, filter: "blur(14px)" }}
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
          <motion.span
            className="h-px w-10 bg-gold/70 sm:w-16"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={inViewOnce}
            transition={{ duration: 1.1, ease: EASE_SILK, delay: 0.35 }}
            style={{ transformOrigin: "left" }}
          />
        </div>

        <Reveal delay={0.45} y={12}>
          <p className="mt-4 font-serif text-lg tracking-[0.5em] text-ink uppercase sm:text-xl">
            {wedding.date.month}
          </p>
        </Reveal>

        <Reveal delay={0.55} y={12}>
          <p className="mt-1 font-sans text-base tracking-[0.55em] text-ink-soft">
            {wedding.date.year}
          </p>
        </Reveal>

        <Reveal delay={0.7} y={12}>
          <p className="mt-6 font-sans text-[0.95rem] tracking-[0.32em] text-gold-deep uppercase">
            {wedding.date.time}
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.85} className="mt-12 w-full">
        <Countdown />
      </Reveal>

      <Reveal delay={1} className="mt-10">
        <ActionLink href={calendarLink()} variant="ghost" className="text-[0.86rem]">
          Agendar en mi calendario
        </ActionLink>
      </Reveal>
    </Scene>
  );
}
