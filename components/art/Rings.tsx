"use client";

import { motion, useReducedMotion } from "framer-motion";

const R = 38;
const CIRC = 2 * Math.PI * R;
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Dos anillos que llegan desde extremos opuestos y se entrelazan. Es el
 * momento visual central de la invitación: el arco superior derecho del anillo
 * izquierdo se vuelve a pintar encima del derecho para crear el enlace real,
 * y un destello recorre el metal cuando quedan unidos.
 */
export function Rings({
  active,
  className = "",
}: {
  active: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const join = reduced ? 0 : 1.5;

  const ring = (cx: number, from: number, delay: number) => (
    <motion.g
      initial={{ x: from, opacity: 0, rotate: from > 0 ? 12 : -12 }}
      animate={active ? { x: 0, opacity: 1, rotate: 0 } : {}}
      transition={{ duration: reduced ? 0.3 : 1.7, ease: EASE, delay }}
      style={{ transformOrigin: cx + "px 60px" }}
    >
      <circle cx={cx} cy="60" r={R} stroke="url(#ring-metal)" strokeWidth="5.5" fill="none" />
      <circle cx={cx} cy="60" r={R - 2.4} stroke="#fff" strokeWidth="0.7" fill="none" opacity="0.55" />
      <circle cx={cx} cy="60" r={R + 2.4} stroke="#9a7c3e" strokeWidth="0.5" fill="none" opacity="0.4" />
      {!reduced && (
        <motion.circle
          cx={cx}
          cy="60"
          r={R}
          stroke="#fffdf5"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={"22 " + (CIRC - 22)}
          initial={{ strokeDashoffset: 0, opacity: 0 }}
          animate={
            active
              ? { strokeDashoffset: [-CIRC, 0], opacity: [0, 0.95, 0.95, 0] }
              : {}
          }
          transition={{
            duration: 2.6,
            ease: "easeInOut",
            delay: join + delay + 0.2,
            repeat: Infinity,
            repeatDelay: 5.5,
          }}
        />
      )}
    </motion.g>
  );

  return (
    <svg
      viewBox="0 0 200 120"
      className={className}
      fill="none"
      role="img"
      aria-label="Dos anillos entrelazados"
    >
      <defs>
        <linearGradient id="ring-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9a7c3e" />
          <stop offset="25%" stopColor="#e9d8b0" />
          <stop offset="50%" stopColor="#c6a867" />
          <stop offset="75%" stopColor="#f4ead1" />
          <stop offset="100%" stopColor="#9a7c3e" />
        </linearGradient>
        <radialGradient id="ring-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e9d8b0" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#e9d8b0" stopOpacity="0" />
        </radialGradient>
      </defs>

      <motion.circle
        cx="100"
        cy="60"
        r="46"
        fill="url(#ring-glow)"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={active ? { opacity: [0, 0.9, 0.45], scale: [0.6, 1.25, 1] } : {}}
        transition={{ duration: 2.2, delay: join, ease: "easeOut" }}
        style={{ transformOrigin: "100px 60px" }}
      />

      {ring(78, -52, 0)}
      {ring(122, 52, 0.12)}

      {/* El enlace: arco del anillo izquierdo pintado por encima del derecho. */}
      <motion.path
        d={"M100 " + (60 - Math.sqrt(R * R - 22 * 22)).toFixed(2) + " A" + R + " " + R + " 0 0 1 " + (78 + R) + " 60"}
        stroke="url(#ring-metal)"
        strokeWidth="5.5"
        strokeLinecap="butt"
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ duration: 0.45, delay: join + 0.15 }}
      />
    </svg>
  );
}
