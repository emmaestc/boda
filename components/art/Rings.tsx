"use client";

import { motion, useReducedMotion } from "framer-motion";

const R = 34;
const BANDA = 7.5;
const CIRC = 2 * Math.PI * R;
const EASE = [0.16, 1, 0.3, 1] as const;

/** Intersección de las dos circunferencias, para pintar el enlace real. */
const DX = 22;
const CRUCE_Y = 66 - Math.sqrt(R * R - DX * DX);

/**
 * Dos alianzas que llegan de lados opuestos y se entrelazan.
 *
 * No son dos circunferencias con borde: cada aro se compone de cuatro capas
 * —cuerpo con degradado metálico, canto exterior, canto interior y un reflejo
 * en el cuarto superior izquierdo— que es lo que da la sensación de volumen de
 * una joya y no de un icono. El aro de la novia lleva su solitario con
 * garras, tabla y facetas.
 *
 * El enlace es real: el arco del aro izquierdo que queda por delante del
 * derecho se vuelve a pintar encima, de modo que uno pasa de verdad sobre el
 * otro en un punto y por debajo en el otro.
 */
function Aro({ cx, gema = false }: { cx: number; gema?: boolean }) {
  return (
    <g>
      {/* Sombra proyectada: separa la joya del fondo */}
      <ellipse cx={cx} cy={66 + R + 9} rx={R * 0.78} ry="3.6" fill="#24384f" opacity="0.1" />

      {/* Cuerpo de la banda */}
      <circle cx={cx} cy="66" r={R} stroke="url(#oro-banda)" strokeWidth={BANDA} fill="none" />
      {/* Cantos: el exterior más marcado que el interior */}
      <circle cx={cx} cy="66" r={R + BANDA / 2} stroke="#8a6d32" strokeWidth="0.7" fill="none" opacity="0.55" />
      <circle cx={cx} cy="66" r={R - BANDA / 2} stroke="#7d6230" strokeWidth="0.7" fill="none" opacity="0.4" />
      {/* Filo pulido justo dentro del canto exterior */}
      <circle cx={cx} cy="66" r={R + BANDA / 2 - 1.4} stroke="#fff6dc" strokeWidth="0.6" fill="none" opacity="0.5" />

      {/* Reflejo principal, en el cuarto superior izquierdo */}
      <path
        d={"M" + (cx - R) + " 66A" + R + " " + R + " 0 0 1 " + (cx - R * 0.44) + " " + (66 - R * 0.9)}
        stroke="#fffaeb"
        strokeWidth={BANDA * 0.42}
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
      {/* Y una sombra suave en el cuarto opuesto */}
      <path
        d={"M" + (cx + R * 0.5) + " " + (66 + R * 0.87) + "A" + R + " " + R + " 0 0 0 " + (cx + R) + " 66"}
        stroke="#6f571f"
        strokeWidth={BANDA * 0.34}
        strokeLinecap="round"
        fill="none"
        opacity="0.28"
      />

      {gema && <Solitario cx={cx} />}
    </g>
  );
}

/** Solitario de talla brillante, con sus cuatro garras. */
function Solitario({ cx }: { cx: number }) {
  const cy = 66 - R - 12;
  return (
    <g transform={"translate(" + cx + " " + cy + ")"}>
      {/* Garras */}
      {[-1, 1].map((s) => (
        <path
          key={s}
          d={"M" + s * 7 + " 6C" + s * 9 + " 10 " + s * 7 + " 13 " + s * 4 + " 14"}
          stroke="#c6a867"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      ))}
      {/* Cesta que une la gema con la banda */}
      <path d="M-4 13h8l-2 4h-4z" fill="url(#oro-banda)" stroke="#8a6d32" strokeWidth="0.5" />

      {/* Corona */}
      <path d="M0 -12 10 -4 6.5 9h-13L-10 -4Z" fill="url(#gema)" stroke="#a9c9e0" strokeWidth="0.7" />
      {/* Tabla */}
      <path d="M0 -12-10 -4 0 -0.5 10 -4Z" fill="#ffffff" opacity="0.72" />
      {/* Facetas laterales */}
      <path d="M-10 -4-6.5 9 0 -0.5Z" fill="#dcebf7" opacity="0.75" />
      <path d="M10 -4 6.5 9 0 -0.5Z" fill="#c9dff0" opacity="0.7" />
      <path d="M0 -0.5-6.5 9h13Z" fill="#f2f9ff" opacity="0.6" />
      {/* Chispa */}
      <path
        d="M0 -9.5 1.1 -6 4.6 -4.9 1.1 -3.8 0 -0.3-1.1 -3.8-4.6 -4.9-1.1 -6Z"
        fill="#ffffff"
        opacity="0.95"
      />
    </g>
  );
}

/** Destello de cuatro puntas que aparece al quedar unidos. */
function Chispa({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  return (
    <motion.path
      d={
        "M" + x + " " + (y - size) +
        "Q" + x + " " + y + " " + (x + size) + " " + y +
        "Q" + x + " " + y + " " + x + " " + (y + size) +
        "Q" + x + " " + y + " " + (x - size) + " " + y +
        "Q" + x + " " + y + " " + x + " " + (y - size)
      }
      fill="#fffdf2"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0.3, 1, 0.6] }}
      transition={{ duration: 2, delay, repeat: Infinity, repeatDelay: 4.5 }}
      style={{ transformOrigin: x + "px " + y + "px" }}
    />
  );
}

export function Rings({ active, className = "" }: { active: boolean; className?: string }) {
  const reduced = useReducedMotion();
  const union = reduced ? 0 : 1.5;

  const llegada = (from: number, delay: number, contenido: React.ReactNode, cx: number) => (
    <motion.g
      initial={{ x: from, opacity: 0, rotate: from > 0 ? 14 : -14 }}
      animate={active ? { x: 0, opacity: 1, rotate: 0 } : {}}
      transition={{ duration: reduced ? 0.3 : 1.7, ease: EASE, delay }}
      style={{ transformOrigin: cx + "px 66px" }}
    >
      {contenido}
    </motion.g>
  );

  return (
    <svg
      viewBox="0 0 200 130"
      className={className}
      fill="none"
      role="img"
      aria-label="Dos alianzas entrelazadas"
    >
      <defs>
        <linearGradient id="oro-banda" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8a6d32" />
          <stop offset="18%" stopColor="#e8d29a" />
          <stop offset="34%" stopColor="#fff6dc" />
          <stop offset="52%" stopColor="#d4b271" />
          <stop offset="70%" stopColor="#a8863f" />
          <stop offset="86%" stopColor="#f0dcae" />
          <stop offset="100%" stopColor="#8a6d32" />
        </linearGradient>
        <linearGradient id="gema" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#f4fbff" />
          <stop offset="50%" stopColor="#cfe4f4" />
          <stop offset="100%" stopColor="#9dc0da" />
        </linearGradient>
        <radialGradient id="aura-union" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff3d0" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#e9d8b0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Aura que nace cuando por fin se tocan */}
      <motion.circle
        cx="100"
        cy="66"
        r="52"
        fill="url(#aura-union)"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={active ? { opacity: [0, 0.95, 0.4], scale: [0.5, 1.3, 1] } : {}}
        transition={{ duration: 2.2, delay: union, ease: "easeOut" }}
        style={{ transformOrigin: "100px 66px" }}
      />

      {llegada(-56, 0, <Aro cx={78} />, 78)}
      {llegada(56, 0.12, <Aro cx={122} gema />, 122)}

      {/*
        El enlace: el tramo del aro izquierdo que pasa por delante del derecho.
        Se pinta después para quedar por encima, y solo aparece cuando los dos
        ya están en su sitio.
      */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ duration: 0.45, delay: union + 0.15 }}
      >
        <path
          d={"M100 " + CRUCE_Y.toFixed(2) + "A" + R + " " + R + " 0 0 1 " + (78 + R) + " 66"}
          stroke="url(#oro-banda)"
          strokeWidth={BANDA}
          fill="none"
        />
        <path
          d={"M100 " + CRUCE_Y.toFixed(2) + "A" + R + " " + R + " 0 0 1 " + (78 + R) + " 66"}
          stroke="#8a6d32"
          strokeWidth="0.7"
          fill="none"
          opacity="0.45"
          transform="scale(1.004)"
          style={{ transformOrigin: "78px 66px" }}
        />
      </motion.g>

      {/* Brillos que recorren el metal, ya unidos */}
      {!reduced &&
        [78, 122].map((cx, i) => (
          <motion.circle
            key={cx}
            cx={cx}
            cy="66"
            r={R}
            stroke="#fffdf5"
            strokeWidth={BANDA * 0.7}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={"18 " + (CIRC - 18)}
            initial={{ strokeDashoffset: 0, opacity: 0 }}
            animate={active ? { strokeDashoffset: [-CIRC, 0], opacity: [0, 0.9, 0.9, 0] } : {}}
            transition={{
              duration: 2.8,
              ease: "easeInOut",
              delay: union + 0.3 + i * 0.25,
              repeat: Infinity,
              repeatDelay: 5,
            }}
          />
        ))}

      {!reduced && active && (
        <>
          <Chispa x={122} y={20} size={7} delay={union + 0.9} />
          <Chispa x={100} y={CRUCE_Y} size={5} delay={union + 1.4} />
          <Chispa x={64} y={44} size={4} delay={union + 2.1} />
        </>
      )}
    </svg>
  );
}
