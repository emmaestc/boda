"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Iniciales } from "./Monogram";
import { Bow } from "./Ribbon";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Chispas que titilan alrededor del sobre mientras espera. */
const CHISPAS = [
  { left: "6%", top: "14%", size: 7, delay: "0s" },
  { left: "94%", top: "26%", size: 5, delay: "1.4s" },
  { left: "-4%", top: "62%", size: 6, delay: "2.6s" },
  { left: "101%", top: "74%", size: 8, delay: "3.8s" },
  { left: "18%", top: "-6%", size: 5, delay: "5s" },
  { left: "80%", top: "104%", size: 6, delay: "6.2s" },
];

/**
 * Sobre de papel con cinta de raso y lacre.
 *
 * Se construye con capas HTML en lugar de SVG porque la solapa gira en 3D
 * (`rotateX`), y las transformaciones tridimensionales son mucho más fiables
 * sobre elementos HTML —sobre todo en Safari de iOS.
 *
 * Al abrirse pasan cuatro cosas encadenadas, en este orden: el lacre se parte
 * en dos y cae, la cinta se desata y sus mitades se van hacia los lados, la
 * solapa gira, y por último asoma la tarjeta con el nombre de quien recibe la
 * invitación. Cada paso empieza antes de que termine el anterior para que se
 * lea como un solo gesto y no como cuatro animaciones seguidas.
 */
export function Envelope({
  opened,
  onOpen,
  guestName,
}: {
  opened: boolean;
  onOpen: () => void;
  guestName?: string | null;
}) {
  const reduced = useReducedMotion();
  const [hover, setHover] = useState(false);

  /** La solapa se entreabre al pasar por encima: invita a tocar. */
  const giroSolapa = opened ? (reduced ? -170 : -172) : hover && !reduced ? -15 : 0;

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      disabled={opened}
      aria-label="Abrir la invitación"
      className="group relative block w-[min(84vw,360px)] cursor-pointer rounded-[10px] disabled:cursor-default"
      style={{ perspective: 1400, aspectRatio: "1.42 / 1" }}
      animate={reduced || opened ? {} : { y: [0, -10, 0], rotate: [0, -0.7, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      whileTap={opened ? undefined : { scale: 0.985 }}
    >
      {/* Chispas alrededor */}
      {!reduced &&
        !opened &&
        CHISPAS.map((c) => (
          <span
            key={c.left + c.top}
            aria-hidden
            className="animate-breathe pointer-events-none absolute rounded-full bg-[radial-gradient(circle,#fffdf2,#e9d8b0_45%,transparent_72%)]"
            style={{
              left: c.left,
              top: c.top,
              width: c.size,
              height: c.size,
              marginLeft: -c.size / 2,
              marginTop: -c.size / 2,
              animationDelay: c.delay,
            }}
          />
        ))}

      {/* Sombra proyectada sobre el papel del fondo */}
      <div
        aria-hidden
        className="absolute -bottom-6 left-1/2 h-8 w-[78%] -translate-x-1/2 rounded-[50%] bg-ink/15 blur-xl"
      />

      {/* Cuerpo trasero del sobre */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[10px] border border-white/70 bg-[linear-gradient(160deg,#fffdf7,#e8eff8)] shadow-[var(--shadow-lift)]"
      />

      {/*
        La tarjeta que asoma. El contenido va arriba del todo a propósito:
        al subir, lo único que llega a verse es su borde superior.
      */}
      <motion.div
        aria-hidden
        className="absolute inset-x-[7%] top-[6%] z-10 flex h-[88%] flex-col items-center justify-start gap-1 rounded-[6px] border border-gold/25 bg-linear-to-b from-white to-mist pt-[7%] shadow-[0_10px_30px_-18px_rgba(36,56,79,0.5)]"
        initial={false}
        animate={opened ? { y: "-44%", scale: 1.03 } : { y: "0%", scale: 1 }}
        transition={{
          duration: reduced ? 0.2 : 0.95,
          ease: EASE,
          delay: opened && !reduced ? 0.75 : 0,
        }}
      >
        <span className="flex items-center gap-2">
          <span className="block h-px w-7 bg-gold/60" />
          <span className="block h-1.5 w-1.5 rotate-45 border border-gold/80" />
          <span className="block h-px w-7 bg-gold/60" />
        </span>
        <span className="mt-1 font-serif text-[1.05rem] leading-none text-ink-faint italic">
          Para
        </span>
        <span className="px-3 font-serif text-[1.55rem] leading-tight font-light text-ink text-balance">
          {guestName || "ti"}
        </span>
      </motion.div>

      {/* Bolsillo frontal: rectángulo con una V recortada en la parte superior */}
      <div
        aria-hidden
        className="absolute inset-0 z-20 rounded-[10px] bg-[linear-gradient(200deg,#fdfcf8,#f4f8fc_55%,#dfe9f5)]"
        style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%, 100% 0, 50% 45%)" }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-full w-full text-gold/35"
        >
          <path
            d="M0 100 50 45 100 100"
            stroke="currentColor"
            strokeWidth="0.35"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M0 0 50 45 100 0"
            stroke="currentColor"
            strokeWidth="0.25"
            fill="none"
            vectorEffect="non-scaling-stroke"
            opacity="0.6"
          />
        </svg>
      </div>

      {/*
        Cinta de raso: dos mitades que se separan al desatarse. Terminan
        exactamente en el canto del sobre —ni un pelo fuera—, porque una
        cinta que asoma por los lados hace que el lazo parezca más grande
        que la carta que envuelve.
      */}
      {[-1, 1].map((lado) => (
        <motion.div
          key={lado}
          aria-hidden
          className="absolute top-[67%] z-[25] h-[8.5%] bg-[linear-gradient(180deg,#f0f7ff,#c2daf1_38%,#9dc0e4_62%,#6f9ac9)] shadow-[0_3px_8px_-4px_rgba(59,92,130,0.55)]"
          style={lado < 0 ? { left: 0, right: "50%" } : { left: "50%", right: 0 }}
          initial={false}
          animate={opened ? { x: lado * 190, opacity: 0 } : { x: 0, opacity: 1 }}
          transition={{
            duration: reduced ? 0.2 : 0.85,
            ease: EASE,
            delay: opened && !reduced ? 0.18 : 0,
          }}
        />
      ))}

      {/* El lazo, sobre la cinta */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-[71%] z-[26] w-[33%] -translate-x-1/2 -translate-y-[45%]"
        initial={false}
        animate={
          opened
            ? { scale: 0.55, rotate: -14, y: 30, opacity: 0 }
            : { scale: 1, rotate: 0, y: 0, opacity: 1 }
        }
        transition={{
          duration: reduced ? 0.2 : 0.75,
          ease: EASE,
          delay: opened && !reduced ? 0.12 : 0,
        }}
      >
        <Bow className="w-full drop-shadow-[0_4px_8px_rgba(59,92,130,0.28)]" />
      </motion.div>

      {/* Solapa superior: gira sobre su borde de arriba */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[45%] origin-top rounded-t-[10px] bg-linear-to-b from-[#fbfaf5] to-[#eaf1f9]"
        style={{
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
        initial={false}
        animate={{ rotateX: giroSolapa, zIndex: opened ? 5 : 30 }}
        transition={{
          duration: reduced ? 0.2 : opened ? 1 : 0.5,
          ease: EASE,
          delay: opened && !reduced ? 0.32 : 0,
          zIndex: { delay: opened ? 0.6 : 0 },
        }}
      >
        <div className="absolute inset-0 border-t border-white/80" />
      </motion.div>

      {/*
        El lacre, con las dos iniciales. Al abrirse no se desvanece: se parte
        por la mitad y las dos piezas caen girando, que es lo que hace de
        verdad un sello de cera.
      */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[45%] z-40 h-[4.4rem] w-[4.4rem] -translate-x-1/2 -translate-y-1/2"
      >
        {!reduced && !opened && (
          <span className="animate-breathe absolute -inset-2 rounded-full bg-gold/25 blur-md" />
        )}

        {[-1, 1].map((mitad) => (
          <motion.span
            key={mitad}
            className="absolute inset-0"
            style={{
              clipPath: mitad < 0 ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)",
              transformOrigin: mitad < 0 ? "right center" : "left center",
            }}
            initial={false}
            animate={
              opened
                ? { x: mitad * 30, y: 40, rotate: mitad * 42, opacity: 0 }
                : { x: 0, y: 0, rotate: 0, opacity: 1 }
            }
            transition={{
              duration: reduced ? 0.15 : 0.75,
              ease: [0.4, 0, 0.7, 1],
              delay: 0,
            }}
          >
            <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_26%,#f0dfb6,#c6a867_46%,#8a6a30)] shadow-[0_6px_18px_-8px_rgba(122,95,40,0.9)]" />
            <span className="absolute inset-[3.5px] rounded-full border border-white/35" />
            <span className="absolute inset-[7px] rounded-full border border-white/20" />
            <Iniciales
              size={70}
              proporcion={0.62}
              fill="#fff6df"
              className="absolute inset-0 h-full w-full"
            />
          </motion.span>
        ))}

      </div>
    </motion.button>
  );
}
