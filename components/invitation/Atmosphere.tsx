"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Fondo maestro. En lugar de un fondo distinto por sección, hay un solo lienzo
 * cuya temperatura viaja con el scroll: porcelana al principio, azul en el
 * encuentro, luz de vitral en la ceremonia, dorado cálido en la recepción y
 * de nuevo luz al cerrar. Es lo que hace que la página se lea como una sola
 * escena continua.
 */
export function Atmosphere() {
  const { scrollYProgress } = useScroll();

  const base = useTransform(
    scrollYProgress,
    [0, 0.18, 0.42, 0.62, 0.82, 1],
    ["#fdfcf9", "#eef5fd", "#dfecf9", "#f4f2f2", "#fdf3e2", "#fdf6ec"],
  );

  // Velo azul: manda en la historia y la ceremonia.
  const blueVeil = useTransform(scrollYProgress, [0, 0.2, 0.55, 0.75], [0.2, 0.75, 1, 0.15]);
  // Velo dorado: entra con la recepción y se queda hasta el cierre.
  const goldVeil = useTransform(scrollYProgress, [0.5, 0.72, 1], [0, 0.9, 0.6]);
  // Y un rubor cálido en el tramo del encuentro y la fecha, que es donde la
  // paleta se quedaba más fría y la página se sentía apagada.
  const roseVeil = useTransform(scrollYProgress, [0.12, 0.3, 0.5], [0, 0.55, 0]);

  return (
    <div aria-hidden className="paper-grain pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div className="absolute inset-0" style={{ backgroundColor: base }} />

      <motion.div
        className="absolute inset-0"
        style={{
          opacity: blueVeil,
          background:
            "radial-gradient(120% 80% at 12% -10%, rgba(157,188,218,0.42), transparent 60%)," +
            "radial-gradient(90% 60% at 100% 30%, rgba(199,219,238,0.5), transparent 62%)",
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          opacity: goldVeil,
          background:
            "radial-gradient(100% 70% at 85% 110%, rgba(233,216,176,0.55), transparent 58%)," +
            "radial-gradient(70% 50% at 5% 80%, rgba(245,231,228,0.6), transparent 60%)",
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          opacity: roseVeil,
          background:
            "radial-gradient(80% 55% at 20% 40%, rgba(231,200,194,0.5), transparent 62%)," +
            "radial-gradient(70% 50% at 92% 62%, rgba(244,227,223,0.65), transparent 60%)",
        }}
      />

      {/* Halos que respiran, muy lentos, para que el fondo nunca esté muerto. */}
      <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-powder/45 blur-3xl animate-breathe" />
      <div
        className="absolute -right-20 top-2/3 h-80 w-80 rounded-full bg-gold-light/40 blur-3xl animate-breathe"
        style={{ animationDelay: "3.5s" }}
      />
      <div
        className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-rose/35 blur-3xl animate-breathe"
        style={{ animationDelay: "6s" }}
      />
    </div>
  );
}
