"use client";

import { useMemo } from "react";
import type { CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { useDocumentHidden, useIsClient, useMediaQuery } from "@/hooks/useEnvironment";

/** Generador determinista: mismas partículas en cada render, sin saltos. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** Permite pasar variables CSS personalizadas en el atributo `style`. */
type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

type Forma = "petalo" | "corazon" | "flor" | "hoja" | "anillo";

/**
 * Las siluetas que caen.
 *
 * Antes eran cuadraditos redondeados de siete píxeles con un desenfoque
 * encima: a ese tamaño no se distinguía qué eran, solo se veían motas. Ahora
 * cada una es una figura dibujada, más grande y sin desenfoque —que además
 * era lo que más costaba al compositor en teléfonos modestos.
 */
function Silueta({ forma, size }: { forma: Forma; size: number }) {
  const comun = { width: size, height: size, viewBox: "0 0 24 24" } as const;

  switch (forma) {
    case "corazon":
      return (
        <svg {...comun} fill="none">
          <path
            d="M12 21C6.6 17.2 3.2 14 3.2 10.2 3.2 7.1 5.5 5 8.2 5c1.6 0 3 .8 3.8 2.1C12.8 5.8 14.2 5 15.8 5c2.7 0 5 2.1 5 5.2 0 3.8-3.4 7-8.8 10.8Z"
            fill="#eec9c2"
            stroke="#d9a79e"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "flor":
      return (
        <svg {...comun} fill="none">
          <g transform="translate(12 12)">
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse
                key={a}
                cx="0"
                cy="-6"
                rx="3.6"
                ry="5.6"
                transform={"rotate(" + a + ")"}
                fill="#ffffff"
                stroke="#e4d3b4"
                strokeWidth="1"
              />
            ))}
            <circle cx="0" cy="0" r="2.4" fill="#e9c86e" />
          </g>
        </svg>
      );

    case "hoja":
      return (
        <svg {...comun} fill="none">
          <path
            d="M20 4C11 4 4 9.5 4 16c0 2 .7 3.4 1.6 4.4C7 15 12 10.5 19 8.8 13.4 11.4 9 15.6 7.6 21c1 .6 2.3 1 3.7 1 5.6 0 9.7-6.2 8.7-18Z"
            fill="#bcd0b6"
            stroke="#93ab8d"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "anillo":
      return (
        <svg {...comun} fill="none">
          <circle cx="12" cy="13.5" r="8" stroke="#d5b473" strokeWidth="2.4" />
          <circle cx="12" cy="13.5" r="8" stroke="#fff3d4" strokeWidth="0.8" />
          <path d="M12 5.5 9.6 2.4h4.8L12 5.5Z" fill="#f0dcaa" stroke="#d5b473" strokeWidth="0.8" strokeLinejoin="round" />
        </svg>
      );

    default:
      // Pétalo: una gota redondeada, la forma más reconocible a tamaño pequeño.
      return (
        <svg {...comun} fill="none">
          <path
            d="M12 2.5c5 5.2 7.2 9.4 7.2 12.4A7.2 7.2 0 0 1 4.8 15c0-3 2.2-7.2 7.2-12.5Z"
            fill="#f7e4de"
            stroke="#e3bdb2"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path d="M12 5.5v11" stroke="#e3bdb2" strokeWidth="0.7" opacity="0.7" />
        </svg>
      );
  }
}

type Particula = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  spin: number;
  opacity: number;
  forma: Forma;
};

const FORMAS: Forma[] = ["petalo", "petalo", "flor", "hoja", "corazon", "anillo"];

function generar(cantidad: number, semilla: number, rapido = false): Particula[] {
  const rnd = seeded(semilla);
  return Array.from({ length: cantidad }, () => ({
    left: rnd() * 100,
    size: 17 + rnd() * 13,
    duration: rapido ? 4.5 + rnd() * 3.5 : 20 + rnd() * 22,
    delay: rapido ? rnd() * 1.6 : -rnd() * 40,
    drift: (rnd() - 0.5) * 220,
    spin: 140 + rnd() * 420,
    opacity: 0.55 + rnd() * 0.35,
    forma: FORMAS[Math.floor(rnd() * FORMAS.length)],
  }));
}

function estilo(p: Particula): CSSVars {
  return {
    left: p.left + "%",
    animationDuration: p.duration + "s",
    animationDelay: p.delay + "s",
    "--petal-drift": p.drift + "px",
    "--petal-spin": p.spin + "deg",
    "--petal-opacity": p.opacity,
  } as CSSVars;
}

/**
 * Pétalos, flores y anillos en suspensión. Se animan con CSS puro
 * (compositor), la cantidad se adapta al ancho de la pantalla y todo se
 * congela cuando la pestaña deja de estar visible.
 */
export function Ambient() {
  const reduced = useReducedMotion();
  const isClient = useIsClient();
  const narrow = useMediaQuery("(max-width: 767px)");
  const hidden = useDocumentHidden();

  const cantidad = narrow ? 8 : 14;
  const petalos = useMemo(() => generar(cantidad, 20261106), [cantidad]);
  const destellos = useMemo(() => {
    const rnd = seeded(6112026);
    return Array.from({ length: narrow ? 4 : 7 }, () => ({
      left: rnd() * 100,
      size: 3 + rnd() * 3,
      duration: 16 + rnd() * 18,
      delay: -rnd() * 30,
      drift: (rnd() - 0.5) * 120,
      tono: rnd() > 0.5 ? "#e9d8b0" : "#ffffff",
    }));
  }, [narrow]);

  if (!isClient || reduced) return null;

  return (
    <div
      aria-hidden
      className={
        "pointer-events-none fixed inset-0 -z-[5] overflow-hidden" +
        (hidden ? " ambient-paused" : "")
      }
    >
      {petalos.map((p, i) => (
        <span key={"p" + i} className="petal" style={estilo(p)}>
          <Silueta forma={p.forma} size={p.size} />
        </span>
      ))}
      {destellos.map((s, i) => (
        <span
          key={"s" + i}
          className="spark"
          style={
            {
              left: s.left + "%",
              width: s.size,
              height: s.size,
              background: s.tono,
              boxShadow: "0 0 9px 2px " + s.tono + "90",
              animationDuration: s.duration + "s",
              animationDelay: s.delay + "s",
              "--spark-drift": s.drift + "px",
            } as CSSVars
          }
        />
      ))}
    </div>
  );
}

/**
 * Lluvia breve de celebración al abrir el sobre. Cae rápido, dura unos
 * segundos y desaparece: es el aplauso del momento, no un adorno permanente.
 */
export function PetalBurst() {
  const reduced = useReducedMotion();
  const isClient = useIsClient();
  const narrow = useMediaQuery("(max-width: 767px)");
  const piezas = useMemo(() => generar(narrow ? 14 : 24, 611202, true), [narrow]);

  if (!isClient || reduced) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {piezas.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{ ...estilo(p), animationIterationCount: 1 } as CSSVars}
        >
          <Silueta forma={p.forma} size={p.size} />
        </span>
      ))}
    </div>
  );
}
