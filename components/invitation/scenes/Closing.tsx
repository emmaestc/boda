"use client";

import { Scene } from "@/components/invitation/Scene";
import { Reveal } from "@/components/ui/Reveal";
import { Monogram } from "@/components/art/Monogram";
import { Cross } from "@/components/art/Icons";
import { FloralCorner } from "@/components/art/Floral";
import { wedding } from "@/lib/config/wedding";

/** Última respiración: el monograma, la bendición y el silencio. */
export function Closing() {
  return (
    <Scene id="cierre" tall={false} className="pb-32 pt-10">
      <FloralCorner className="pointer-events-none absolute -left-6 bottom-0 w-40 -rotate-90 text-gold/20 sm:w-56" />
      <FloralCorner className="pointer-events-none absolute -right-6 bottom-0 w-40 rotate-180 text-gold/20 sm:w-56" />

      <Reveal>
        <Cross className="w-7 text-gold/70" />
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
        <p className="mt-3 font-sans text-[0.58rem] tracking-[0.42em] text-ink-faint uppercase">
          {wedding.date.day} · {wedding.date.month} · {wedding.date.year}
        </p>
      </Reveal>

      <Reveal delay={0.7}>
        <p className="mt-12 max-w-xs font-sans text-xs leading-relaxed text-ink-faint">
          {wedding.copy.closing}
        </p>
      </Reveal>
    </Scene>
  );
}
