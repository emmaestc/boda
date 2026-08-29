"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Scene, Eyebrow } from "@/components/invitation/Scene";
import { Reveal } from "@/components/ui/Reveal";
import { ActionButton } from "@/components/ui/Button";
import { RsvpDialog } from "@/components/rsvp/RsvpDialog";
import { Divider } from "@/components/art/Icons";
import { HandHeart } from "lucide-react";
import { Aliento, Eucalipto, Hortensia } from "@/components/art/Botanical";
import { inViewOnce } from "@/lib/motion";
import { wedding } from "@/lib/config/wedding";
import type { PublicGuest } from "@/lib/guests/types";

/** Resumen de lo ya respondido, para que se pueda revisar o cambiar. */
function CurrentAnswer({ guest }: { guest: PublicGuest }) {
  if (guest.estado === "pendiente") return null;
  const text =
    guest.estado === "confirmado"
      ? guest.asistentes === 1
        ? "Confirmaste tu asistencia"
        : "Confirmaste " + guest.asistentes + " asistentes"
      : "Nos avisaste que no podrás acompañarnos";

  return (
    <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-white/70 px-5 py-2.5">
      <HandHeart className="h-[1.05rem] w-[1.05rem] text-gold-text" strokeWidth={1.6} />
      <span className="font-sans text-[0.95rem] tracking-[0.16em] text-ink-soft">{text}</span>
    </div>
  );
}

/**
 * Cierre de la narración y puerta de entrada al RSVP. En la versión pública
 * (sin código personal) el botón no desaparece: se sustituye por una
 * explicación amable, porque una invitación nunca debe dejar a nadie fuera sin
 * decirle por qué.
 */
export function RsvpScene({ guest }: { guest: PublicGuest | null }) {
  const [open, setOpen] = useState(false);

  return (
    <Scene id="confirmar">
      <div className="relative flex w-full flex-col items-center">
        <svg
          aria-hidden
          viewBox="0 0 240 90"
          className="pointer-events-none absolute -top-8 left-1/2 w-[min(104%,26rem)] -translate-x-1/2 opacity-75"
        >
          <Eucalipto t="translate(10 56) rotate(-12) scale(0.7)" />
          <Eucalipto t="translate(230 56) rotate(192) scale(0.7)" />
          <Hortensia t="translate(120 44) scale(0.55)" />
          <Aliento t="translate(70 26) scale(0.58)" opacity={0.85} />
          <Aliento t="translate(164 26) scale(0.58)" opacity={0.85} />
        </svg>

        <Reveal>
          <Eyebrow>Nos hará muy felices</Eyebrow>
        </Reveal>

        <motion.h2
          className="mt-6 font-script text-5xl text-gilded animate-shimmer sm:text-6xl"
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          whileInView={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            transitionEnd: { filter: "none" },
          }}
          viewport={inViewOnce}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {wedding.copy.rsvp.title}
        </motion.h2>

        <Reveal delay={0.25}>
          <p className="mt-4 font-sans text-[0.95rem] tracking-[0.36em] text-ink-soft uppercase">
            {wedding.copy.rsvp.subtitle}
          </p>
        </Reveal>

        <Reveal delay={0.35} className="mt-8">
          <Divider className="w-40 text-gold" />
        </Reveal>

        {guest ? (
          <>
            <Reveal delay={0.45} className="mt-8">
              <ActionButton onClick={() => setOpen(true)}>
                {guest.estado === "pendiente" ? wedding.copy.rsvp.cta : "Modificar mi respuesta"}
              </ActionButton>
            </Reveal>

            <Reveal delay={0.55}>
              <CurrentAnswer guest={guest} />
            </Reveal>

            <Reveal delay={0.65}>
              <p className="mt-8 max-w-xs font-sans text-[0.95rem] leading-relaxed text-ink-faint">
                {wedding.copy.rsvp.deadlineNote}
              </p>
            </Reveal>

            <RsvpDialog guest={guest} open={open} onClose={() => setOpen(false)} />
          </>
        ) : (
          <Reveal delay={0.45} className="mt-8">
            <div className="max-w-sm rounded-2xl border border-powder/70 bg-white/60 px-7 py-6 backdrop-blur-sm">
              <p className="font-serif text-xl leading-relaxed font-light text-ink-soft italic">
                Para confirmar tu asistencia, abre el enlace personal que te enviamos.
              </p>
              <p className="mt-3 font-sans text-[0.95rem] leading-relaxed text-ink-faint">
                Cada invitación tiene su propio enlace con los lugares reservados a tu nombre.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </Scene>
  );
}
