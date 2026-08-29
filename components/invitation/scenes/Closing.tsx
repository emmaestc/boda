"use client";

import { Scene } from "@/components/invitation/Scene";
import { Reveal } from "@/components/ui/Reveal";
import { Monogram } from "@/components/art/Monogram";
import { Cross } from "lucide-react";
import { Aliento, Eucalipto, RosaBlanca } from "@/components/art/Botanical";
import { wedding } from "@/lib/config/wedding";

/** Última respiración: el monograma, la bendición y el silencio. */
export function Closing() {
  return (
    <Scene id="cierre" tall={false} className="isolate pb-32 pt-10">
      {/* Dos ramas que se cierran bajo la firma */}
      <svg
        aria-hidden
        viewBox="0 0 240 90"
        className="pointer-events-none absolute bottom-2 left-1/2 -z-10 w-[min(108%,26rem)] -translate-x-1/2 opacity-70"
      >
        <Eucalipto t="translate(6 58) rotate(-10) scale(0.72)" />
        <Eucalipto t="translate(234 58) rotate(190) scale(0.72)" />
        <RosaBlanca t="translate(120 52) scale(0.42)" />
        <Aliento t="translate(74 30) scale(0.6)" opacity={0.85} />
        <Aliento t="translate(166 30) scale(0.6)" opacity={0.85} />
      </svg>

      <Reveal>
        <Cross className="h-8 w-8 text-gold/80" strokeWidth={1.2} />
      </Reveal>

      <Reveal delay={0.15}>
        <p className="mt-6 max-w-xs font-serif text-base leading-relaxed text-ink-soft italic">
          {wedding.copy.blessing}
        </p>
      </Reveal>

      <Reveal delay={0.3}>
        <div className="mt-10">
          <Monogram size={104} />
        </div>
      </Reveal>

      <Reveal delay={0.45}>
        <p className="mt-8 font-script text-3xl text-ink">
          {wedding.couple.first} &amp; {wedding.couple.second}
        </p>
      </Reveal>

      <Reveal delay={0.55}>
        <p className="mt-3 font-sans text-[0.88rem] tracking-[0.42em] text-ink-faint uppercase">
          {wedding.date.day} · {wedding.date.month} · {wedding.date.year}
        </p>
      </Reveal>

      <Reveal delay={0.7}>
        <p className="mt-12 max-w-xs font-sans text-[0.95rem] leading-relaxed text-ink-faint">
          {wedding.copy.closing}
        </p>
      </Reveal>
    </Scene>
  );
}
