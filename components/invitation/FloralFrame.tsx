"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useEnvironment";
import {
  Aliento,
  Anemona,
  Capullos,
  Delfinio,
  Eucalipto,
  Follaje,
  Hortensia,
  RosaBlanca,
  RosaCrema,
} from "@/components/art/Botanical";

/**
 * Marco floral de la pantalla.
 *
 * Va fijo al viewport, no dentro del documento: enmarca la lectura como el
 * paspartú de un cuadro en lugar de desfilar por encima del texto. Está
 * pensado para el teléfono primero, que es donde se va a ver casi siempre:
 * los ramos se componen para leerse bien a unos 130 píxeles, con una flor
 * protagonista clara en vez de muchas pequeñas que a ese tamaño se
 * convierten en manchas.
 *
 * Tres decisiones lo mantienen fuera del texto, comprobadas midiendo el
 * solape real entre cajas: máscara radial que lo disuelve hacia el centro,
 * tamaño en `vmin` (no `vw`, para que en apaisado no se dispare) y un
 * desbordamiento leve fuera del borde para que el peso quede en la esquina.
 */

/** Ramo con rosa blanca de protagonista. */
function RamoA({ ligero }: { ligero: boolean }) {
  return (
    <g>
      <Follaje t="translate(-4 146) rotate(-44) scale(1)" opacity={0.9} />
      <Eucalipto t="translate(-8 62) rotate(18) scale(0.95)" opacity={0.9} />
      <Eucalipto t="translate(58 0) rotate(44) scale(0.72)" opacity={0.85} />
      <Hortensia t="translate(36 116) scale(0.92)" />
      <RosaBlanca t="translate(76 66) scale(1.02)" />
      <Capullos t="translate(112 26) scale(0.9)" opacity={0.9} />
      {!ligero && <Anemona t="translate(120 124) scale(0.6)" />}
      {!ligero && <Aliento t="translate(132 76) scale(0.9)" opacity={0.85} />}
    </g>
  );
}

/** Ramo con anémona de protagonista y una espiga azul. */
function RamoB({ ligero }: { ligero: boolean }) {
  return (
    <g>
      <Eucalipto t="translate(-6 132) rotate(-36) scale(1.05)" opacity={0.9} />
      <Follaje t="translate(2 54) rotate(14) scale(0.88)" opacity={0.85} />
      <Delfinio t="translate(30 108) rotate(-10) scale(1)" />
      <Anemona t="translate(88 72) scale(0.98)" />
      <RosaCrema t="translate(44 130) scale(0.7)" />
      {!ligero && <Capullos t="translate(112 118) scale(0.85)" opacity={0.9} />}
      {!ligero && <Aliento t="translate(100 22) scale(0.85)" opacity={0.85} />}
    </g>
  );
}

const MASCARA =
  "radial-gradient(circle at 0% 0%, #000 32%, rgba(0,0,0,0.5) 54%, rgba(0,0,0,0.14) 72%, transparent 84%)";

type Esquina = {
  clase: string;
  ramo: "a" | "b";
  transform: string;
  /** Los ramos no miden todos igual: eso es lo que evita el efecto plantilla. */
  escala: number;
  respiro: number;
};

const ESQUINAS: Esquina[] = [
  { clase: "left-0 top-0", ramo: "a", transform: "none", escala: 1, respiro: 0 },
  { clase: "right-0 top-0", ramo: "b", transform: "scaleX(-1)", escala: 0.8, respiro: 2.5 },
  { clase: "right-0 bottom-0", ramo: "a", transform: "scale(-1)", escala: 1.06, respiro: 5 },
  { clase: "left-0 bottom-0", ramo: "b", transform: "scaleY(-1)", escala: 0.86, respiro: 7.5 },
];

export function FloralFrame() {
  const reduced = useReducedMotion();
  // En el teléfono, ramos con menos piezas: a ese tamaño las de relleno no se
  // distinguen y solo cuestan rasterizado.
  const ligero = useMediaQuery("(max-width: 767px)");

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-[2] overflow-hidden">
      {ESQUINAS.map((esquina) => (
        <motion.div
          key={esquina.clase}
          className={"absolute " + esquina.clase}
          style={{
            // El mínimo también se escala: si no, en el teléfono los cuatro
            // ramos acaban del mismo tamaño y se nota la plantilla.
            width:
              "clamp(" + Math.round(128 * esquina.escala) + "px, " +
              32 * esquina.escala + "vmin, " +
              Math.round(320 * esquina.escala) + "px)",
            aspectRatio: "1 / 1",
            // Asomando un poco fuera: el ramo nace del borde y libera la
            // columna de lectura.
            margin: "-4%",
            transform: esquina.transform,
            maskImage: MASCARA,
            WebkitMaskImage: MASCARA,
          }}
          /*
           * Solo respira la opacidad. Animar `scale` o `rotate` sobre un
           * subárbol con filtros SVG obliga al navegador a rasterizar de nuevo
           * todas las formas del ramo en cada fotograma; la opacidad la aplica
           * el compositor sobre el mapa de bits ya calculado.
           */
          animate={reduced ? undefined : { opacity: [0.88, 1, 0.88] }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: esquina.respiro,
          }}
        >
          <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
            {esquina.ramo === "a" ? <RamoA ligero={ligero} /> : <RamoB ligero={ligero} />}
          </svg>
        </motion.div>
      ))}

      {/* Ramitas a media altura para que los laterales no queden vacíos.
          Solo en pantallas anchas: en el teléfono no hay sitio. */}
      <div
        className="absolute left-0 top-1/2 hidden w-[13vmin] max-w-[140px] -translate-y-1/2 opacity-60 sm:block"
        style={{ aspectRatio: "1 / 1" }}
      >
        <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible">
          <Eucalipto t="translate(-34 62) rotate(-6) scale(0.85)" />
          <Capullos t="translate(-4 34) scale(0.75)" opacity={0.85} />
        </svg>
      </div>
      <div
        className="absolute right-0 top-1/2 hidden w-[13vmin] max-w-[140px] opacity-60 sm:block"
        style={{ aspectRatio: "1 / 1", transform: "translateY(-50%) scaleX(-1)" }}
      >
        <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible">
          <Follaje t="translate(-34 64) rotate(-4) scale(0.9)" />
          <Aliento t="translate(2 36) scale(0.7)" opacity={0.85} />
        </svg>
      </div>
    </div>
  );
}
