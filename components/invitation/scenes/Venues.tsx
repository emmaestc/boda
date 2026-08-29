"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { Scene, Eyebrow } from "@/components/invitation/Scene";
import { Reveal } from "@/components/ui/Reveal";
import { MapPanel } from "@/components/invitation/MapPanel";
import { Church, Cross, Bird, Martini, MapPin, Clock } from "lucide-react";
import { EASE_SILK, inViewOnce } from "@/lib/motion";
import { wedding } from "@/lib/config/wedding";
import { cn } from "@/lib/utils";

/**
 * Tarjeta común a ceremonia y recepción: misma arquitectura, misma retícula,
 * misma tipografía. Lo único que cambia entre las dos es la temperatura de la
 * luz y la ilustración, que es exactamente la diferencia que hay entre una
 * iglesia y una fiesta.
 */
function PlaceCard({
  icon,
  eyebrow,
  title,
  datos,
  accent,
  children,
  ambience,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  datos: Array<{ icono?: ReactNode; texto: string }>;
  accent: "cool" | "warm";
  children: ReactNode;
  ambience?: ReactNode;
}) {
  return (
    <motion.div
      className={cn(
        "glass-card relative w-full max-w-md overflow-hidden rounded-[1.75rem] px-7 py-12 sm:px-10",
        accent === "warm" && "bg-[linear-gradient(150deg,rgba(255,253,247,0.86),rgba(250,242,228,0.66))]",
      )}
      initial={{ opacity: 0, y: 42, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={inViewOnce}
      transition={{ duration: 1.3, ease: EASE_SILK }}
    >
      {ambience}

      <div className="relative flex flex-col items-center gap-5">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={inViewOnce}
          transition={{ duration: 1.2, ease: EASE_SILK, delay: 0.25 }}
        >
          {icon}
        </motion.div>

        <Eyebrow className={accent === "warm" ? "text-gold-text" : undefined}>{eyebrow}</Eyebrow>

        <h3 className="font-serif text-3xl leading-tight font-light text-ink text-balance sm:text-4xl">
          {title}
        </h3>

        <div className="flex flex-col items-center gap-2">
          {datos.map((dato, i) => (
            <p
              key={dato.texto}
              className={cn(
                "flex items-center justify-center gap-2 leading-relaxed",
                // La primera línea se lee desde lejos; las demás la acompañan.
                i === 0 ? "font-sans text-xl text-ink" : "font-sans text-xl text-ink-soft",
              )}
            >
              {dato.icono}
              {dato.texto}
            </p>
          ))}
        </div>

        <div className="mt-3 w-full">{children}</div>
      </div>
    </motion.div>
  );
}

/** Ceremonia: luz de vitral, una cruz discreta y una paloma que cruza una vez. */
export function Ceremony() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <Scene id="ceremonia">
      <div ref={ref} className="flex w-full flex-col items-center">
        <PlaceCard
          accent="cool"
          eyebrow="Ceremonia"
          title={wedding.ceremony.place}
          datos={[
            { texto: wedding.ceremony.neighborhood },
            {
              icono: <MapPin className="h-[1.05rem] w-[1.05rem] shrink-0 text-gold-text" strokeWidth={1.7} />,
              texto: wedding.ceremony.address,
            },
            {
              icono: <Clock className="h-[1.05rem] w-[1.05rem] shrink-0 text-gold-text" strokeWidth={1.7} />,
              texto: wedding.ceremony.time,
            },
          ]}
          icon={
            <div className="relative">
              <Church className="h-20 w-20 text-ink-soft" strokeWidth={0.9} />
              <Cross className="absolute -right-5 -top-2 h-6 w-6 text-gold" strokeWidth={1.4} />
            </div>
          }
          ambience={
            <>
              {/* Haz de luz que entra por el vitral */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -top-10 left-1/2 h-64 w-40 -translate-x-1/2 rotate-12 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(199,219,238,0.25),transparent)] blur-xl"
                animate={{ opacity: [0.5, 0.85, 0.5] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* La paloma cruza una sola vez, sin repetirse */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute top-10 w-12 text-white"
                initial={{ x: "-30%", y: 0, opacity: 0 }}
                animate={inView ? { x: "420%", y: [-6, -22, -4], opacity: [0, 0.9, 0.9, 0] } : {}}
                transition={{ duration: 9, ease: "easeInOut", delay: 1.6 }}
              >
                <Bird
                  className="h-full w-full text-white drop-shadow-[0_2px_10px_rgba(157,188,218,0.9)]"
                  strokeWidth={1.1}
                />
              </motion.div>
            </>
          }
        >
          <MapPanel place={wedding.ceremony} label="la ceremonia" />
        </PlaceCard>

        <Reveal delay={0.3}>
          <p className="mt-9 max-w-sm font-serif text-xl leading-relaxed font-light text-ink-soft italic">
            Nos uniremos en matrimonio ante Dios
          </p>
        </Reveal>
      </div>
    </Scene>
  );
}

/** Recepción: la luz se vuelve dorada y aparecen las copas. */
export function Reception() {
  return (
    <Scene id="recepcion">
      <PlaceCard
        accent="warm"
        eyebrow="Y después, a celebrar"
        title={wedding.reception.title}
        datos={[
          { texto: wedding.reception.place },
          {
            icono: <MapPin className="h-[1.05rem] w-[1.05rem] shrink-0 text-gold-text" strokeWidth={1.7} />,
            texto: wedding.reception.address,
          },
          { texto: wedding.city },
        ]}
        icon={<Martini className="h-20 w-20 text-gold-deep" strokeWidth={0.9} />}
        ambience={
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {[
              { l: "12%", t: "16%", s: 46, d: "0s" },
              { l: "78%", t: "10%", s: 30, d: "1.8s" },
              { l: "88%", t: "62%", s: 54, d: "3.2s" },
              { l: "6%", t: "72%", s: 36, d: "4.6s" },
              { l: "46%", t: "4%", s: 24, d: "2.4s" },
            ].map((b) => (
              <span
                key={b.l + b.t}
                className="absolute rounded-full bg-gold-light/45 blur-lg animate-breathe"
                style={{
                  left: b.l,
                  top: b.t,
                  width: b.s,
                  height: b.s,
                  animationDelay: b.d,
                }}
              />
            ))}
          </div>
        }
      >
        <MapPanel place={wedding.reception} label="la recepción" />
      </PlaceCard>

      <Reveal delay={0.3}>
        <p className="mt-9 max-w-sm font-serif text-xl leading-relaxed font-light text-gold-text italic">
          Brindemos juntos por lo que empieza
        </p>
      </Reveal>
    </Scene>
  );
}
