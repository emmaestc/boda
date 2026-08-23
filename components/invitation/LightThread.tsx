"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import type { RefObject } from "react";

/**
 * El hilo de luz: el motivo que cose la invitación de principio a fin.
 *
 * Nacen dos hilos separados —un camino y otro— que descienden, se buscan y se
 * funden en uno solo justo a la altura de la escena de los nombres. A partir
 * de ahí ya hay un único trazo que recorre la fecha, la ceremonia, la
 * recepción y el cierre. Se dibuja con el scroll, no con el tiempo.
 */
export function LightThread({ target }: { target: RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end end"],
  });

  const twin = useTransform(scrollYProgress, [0, 0.24], [0, 1]);
  const single = useTransform(scrollYProgress, [0.22, 0.97], [0, 1]);
  const fade = useTransform(scrollYProgress, [0, 0.04], [0, 1]);

  return (
    <motion.svg
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-[1] h-full w-full"
      viewBox="0 0 100 1000"
      preserveAspectRatio="none"
      fill="none"
      style={{ opacity: fade }}
    >
      <defs>
        <linearGradient id="thread-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c7dbee" stopOpacity="0" />
          <stop offset="12%" stopColor="#9dbcda" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#e9d8b0" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#c6a867" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      <g
        stroke="url(#thread-light)"
        strokeWidth="1.4"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ filter: "drop-shadow(0 0 5px rgba(233,216,176,0.55))" }}
      >
        {/* Los dos caminos que aún no se conocen */}
        <motion.path d="M30 6C30 70 34 148 50 232" style={{ pathLength: twin }} />
        <motion.path d="M70 6C70 70 66 148 50 232" style={{ pathLength: twin }} />
        {/* Y el camino que ya es uno solo */}
        <motion.path
          d="M50 232C62 340 38 430 50 528c12 96-10 178 0 268 6 54 0 108 0 156"
          style={{ pathLength: single }}
        />
      </g>
    </motion.svg>
  );
}
