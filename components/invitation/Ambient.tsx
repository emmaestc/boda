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

type Particle = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  spin: number;
  opacity: number;
  tone: string;
};

const TONES = ["#f5e7e4", "#ffffff", "#e2ecf7", "#e9d8b0"];

/** Permite pasar variables CSS personalizadas en el atributo `style`. */
type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * Pétalos y destellos en suspensión. Se animan con CSS puro (compositor), la
 * cantidad se adapta al ancho de la pantalla y todo se congela cuando la
 * pestaña deja de estar visible.
 */
export function Ambient({ intensity = 1 }: { intensity?: number }) {
  const reduced = useReducedMotion();
  const isClient = useIsClient();
  const narrow = useMediaQuery("(max-width: 767px)");
  const hidden = useDocumentHidden();

  const count = Math.round((narrow ? 9 : 18) * intensity);

  const petals = useMemo<Particle[]>(() => {
    const rnd = seeded(20261106);
    return Array.from({ length: count }, () => ({
      left: rnd() * 100,
      size: 7 + rnd() * 11,
      duration: 22 + rnd() * 26,
      delay: -rnd() * 40,
      drift: (rnd() - 0.5) * 220,
      spin: 160 + rnd() * 420,
      opacity: 0.35 + rnd() * 0.4,
      tone: TONES[Math.floor(rnd() * TONES.length)],
    }));
  }, [count]);

  const sparks = useMemo<Particle[]>(() => {
    const rnd = seeded(6112026);
    return Array.from({ length: Math.round(count * 0.6) }, () => ({
      left: rnd() * 100,
      size: 2 + rnd() * 3,
      duration: 16 + rnd() * 18,
      delay: -rnd() * 30,
      drift: (rnd() - 0.5) * 120,
      spin: 0,
      opacity: 0.4 + rnd() * 0.5,
      tone: rnd() > 0.5 ? "#e9d8b0" : "#ffffff",
    }));
  }, [count]);

  if (!isClient || reduced) return null;

  return (
    <div
      aria-hidden
      className={
        "pointer-events-none fixed inset-0 -z-[5] overflow-hidden" +
        (hidden ? " ambient-paused" : "")
      }
    >
      {petals.map((p, i) => (
        <span
          key={"p" + i}
          className="petal"
          style={
            {
              left: p.left + "%",
              width: p.size,
              height: p.size * 0.72,
              background: p.tone,
              borderRadius: "60% 10% 60% 10%",
              filter: "blur(0.4px)",
              animationDuration: p.duration + "s",
              animationDelay: p.delay + "s",
              "--petal-drift": p.drift + "px",
              "--petal-spin": p.spin + "deg",
              "--petal-opacity": p.opacity,
            } as CSSVars
          }
        />
      ))}
      {sparks.map((s, i) => (
        <span
          key={"s" + i}
          className="spark"
          style={
            {
              left: s.left + "%",
              width: s.size,
              height: s.size,
              background: s.tone,
              boxShadow: "0 0 8px 2px " + s.tone + "80",
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
