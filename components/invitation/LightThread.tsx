"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import type { RefObject } from "react";

/**
 * El hilo de luz: el motivo que cose la invitación de principio a fin.
 *
 * Nacen dos hilos separados —un camino y otro— que descienden buscándose, se
 * cruzan tres veces sin llegar a tocarse y acaban fundiéndose en uno solo a la
 * altura de la escena de los nombres. A partir de ahí ya hay un único trazo.
 *
 * Sobre la forma: el lienzo se estira sobre toda la altura de la página, que
 * son unas veinticinco veces su anchura. Con esa deformación una curva suave
 * se aplana hasta parecer una raya recta —que es justo lo que hacía que el
 * gesto no se entendiera—, mientras que un cruce se sigue leyendo como un
 * cruce por mucho que se estire. De ahí el trenzado, y de ahí también que los
 * puntos que marcan el arranque y el encuentro vayan fuera del SVG: así
 * siguen siendo redondos.
 */

/** Camino de la izquierda: nace a un lado y va tejiendo hacia el centro. */
const HEBRA_A =
  "M22 10C22 44 72 52 72 84c0 32-50 40-50 72 0 30 50 36 50 62 0 22-22 26-22 44";
/** Camino de la derecha: el mismo viaje, en espejo. */
const HEBRA_B =
  "M78 10C78 44 28 52 28 84c0 32 50 40 50 72 0 30-50 36-50 62 0 22 22 26 22 44";
/** Y a partir del encuentro, un solo trazo hasta el final. */
const HEBRA_UNICA =
  "M50 272C50 320 74 352 62 404 50 456 30 478 38 540c8 62 32 82 22 144-10 62-26 84-16 154 8 56 6 100 6 152";

/** Altura, en porcentaje de la página, donde arranca y donde se unen. */
const INICIO_PCT = 1;
const ENCUENTRO_PCT = 27.2;

export function LightThread({ target }: { target: RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end end"],
  });

  const dobleHebra = useTransform(scrollYProgress, [0, 0.26], [0, 1]);
  const hebraUnica = useTransform(scrollYProgress, [0.24, 0.97], [0, 1]);
  const fade = useTransform(scrollYProgress, [0, 0.04], [0, 1]);

  // La cabeza luminosa: un tramo corto y brillante que viaja por el trazo
  // según se dibuja, para que se vea que el hilo está recorriendo un camino.
  const cabezaDoble = useTransform(dobleHebra, (v) => -v);
  const cabezaUnica = useTransform(hebraUnica, (v) => -v);
  const brilloDoble = useTransform(dobleHebra, [0, 0.04, 0.96, 1], [0, 1, 1, 0]);
  const brilloUnico = useTransform(hebraUnica, [0, 0.04, 0.96, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-[1]"
      style={{ opacity: fade }}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="thread-light" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9dbcda" stopOpacity="0.15" />
            <stop offset="10%" stopColor="#7ea8cd" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#c6a867" stopOpacity="0.95" />
            <stop offset="80%" stopColor="#e9d8b0" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#c6a867" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <g
          stroke="url(#thread-light)"
          strokeWidth="2.2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ filter: "drop-shadow(0 0 6px rgba(198,168,103,0.45))" }}
        >
          <motion.path d={HEBRA_A} style={{ pathLength: dobleHebra }} />
          <motion.path d={HEBRA_B} style={{ pathLength: dobleHebra }} />
          <motion.path d={HEBRA_UNICA} style={{ pathLength: hebraUnica }} />
        </g>

        {/* Cabezas luminosas */}
        <g
          stroke="#fffdf4"
          strokeWidth="3.4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ filter: "drop-shadow(0 0 7px rgba(255,246,214,0.95))" }}
        >
          <motion.path
            d={HEBRA_A}
            pathLength={1}
            strokeDasharray="0.028 1"
            style={{ strokeDashoffset: cabezaDoble, opacity: brilloDoble }}
          />
          <motion.path
            d={HEBRA_B}
            pathLength={1}
            strokeDasharray="0.028 1"
            style={{ strokeDashoffset: cabezaDoble, opacity: brilloDoble }}
          />
          <motion.path
            d={HEBRA_UNICA}
            pathLength={1}
            strokeDasharray="0.02 1"
            style={{ strokeDashoffset: cabezaUnica, opacity: brilloUnico }}
          />
        </g>
      </svg>

      {/* Los nudos van fuera del SVG estirado para seguir siendo redondos. */}
      <Nudo left="22%" top={INICIO_PCT} progreso={dobleHebra} />
      <Nudo left="78%" top={INICIO_PCT} progreso={dobleHebra} />
      <Nudo left="50%" top={ENCUENTRO_PCT} progreso={hebraUnica} grande />
    </motion.div>
  );
}

function Nudo({
  left,
  top,
  progreso,
  grande = false,
}: {
  left: string;
  top: number;
  progreso: ReturnType<typeof useTransform<number, number>>;
  grande?: boolean;
}) {
  const escala = useTransform(progreso, [0, 0.06], [0, 1]);
  const size = grande ? 14 : 9;

  return (
    <motion.span
      className="absolute rounded-full bg-[radial-gradient(circle,#fffdf4_0%,#e9d8b0_45%,rgba(198,168,103,0)_75%)]"
      style={{
        left,
        top: top + "%",
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        scale: escala,
        opacity: escala,
      }}
    />
  );
}
