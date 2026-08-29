"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useEnvironment";
import {
  Aliento,
  Bayas,
  Eucalipto,
  FlorMalva,
  Olivo,
  Peonia,
  Rosa,
} from "@/components/art/Botanical";

/**
 * Marco floral de la pantalla.
 *
 * Va fijo al viewport, no dentro del documento: así las flores enmarcan la
 * lectura como el paspartú de un cuadro en lugar de pasar por encima del
 * texto al desplazarse. Tres decisiones lo hacen seguro para el contenido:
 *
 *  - Cada ramo se ancla a su esquina y lleva una máscara radial que lo
 *    disuelve hacia el centro, de modo que nunca hay un borde duro sobre una
 *    palabra.
 *  - El tamaño se calcula con `vmin`, no con `vw`: en un móvil apaisado o en
 *    una pantalla muy ancha el ramo no se dispara.
 *  - Los ramos grandes van arriba a la izquierda y abajo a la derecha, que es
 *    por donde el contenido —centrado y con ancho máximo— no pasa.
 */

/** Un ramo. Dos composiciones distintas para que las esquinas no se repitan. */
function Ramo({ variante, ligero }: { variante: "a" | "b"; ligero: boolean }) {
  if (variante === "a") {
    return (
      <g>
        <Eucalipto t="translate(2 128) rotate(-38) scale(1.05)" opacity={0.92} />
        <Olivo t="translate(-6 58) rotate(24) scale(0.95)" opacity={0.85} />
        <Eucalipto t="translate(44 6) rotate(34) scale(0.8)" opacity={0.8} />
        <Bayas t="translate(96 96) rotate(18) scale(1.05)" opacity={0.9} />
        <Aliento t="translate(104 34) scale(1.1)" opacity={0.9} />
        <Peonia t="translate(34 106) scale(0.9)" />
        <Rosa t="translate(78 58) scale(1.02)" />
        {!ligero && <FlorMalva t="translate(26 46) scale(0.78)" />}
        {!ligero && <Rosa t="translate(112 118) scale(0.62)" opacity={0.95} />}
      </g>
    );
  }
  return (
    <g>
      <Olivo t="translate(0 120) rotate(-30) scale(1.1)" opacity={0.88} />
      <Eucalipto t="translate(6 48) rotate(18) scale(0.9)" opacity={0.82} />
      <Aliento t="translate(78 18) scale(1)" opacity={0.85} />
      <Bayas t="translate(30 40) rotate(-12) scale(0.9)" opacity={0.85} />
      <Peonia t="translate(88 74) scale(1.02)" />
      <Rosa t="translate(38 92) scale(0.86)" />
      {!ligero && <FlorMalva t="translate(104 122) scale(0.9)" />}
      {!ligero && <Aliento t="translate(6 88) scale(0.85)" opacity={0.8} />}
    </g>
  );
}

type Esquina = {
  clase: string;
  variante: "a" | "b";
  /** Giro y espejo para que cada ramo nazca de su propia esquina. */
  transform: string;
  /** Los ramos no miden todos igual: eso es lo que evita el efecto plantilla. */
  escala: number;
  mascara: string;
  respiro: number;
};

const ESQUINAS: Esquina[] = [
  {
    clase: "left-0 top-0",
    variante: "a",
    transform: "none",
    escala: 1,
    mascara:
      "radial-gradient(circle at 0% 0%, #000 30%, rgba(0,0,0,0.45) 52%, rgba(0,0,0,0.12) 70%, transparent 82%)",
    respiro: 0,
  },
  {
    clase: "right-0 top-0",
    variante: "b",
    transform: "scaleX(-1)",
    escala: 0.82,
    mascara:
      "radial-gradient(circle at 0% 0%, #000 30%, rgba(0,0,0,0.45) 52%, rgba(0,0,0,0.12) 70%, transparent 82%)",
    respiro: 2.5,
  },
  {
    clase: "right-0 bottom-0",
    variante: "a",
    transform: "scale(-1)",
    escala: 1.08,
    mascara:
      "radial-gradient(circle at 0% 0%, #000 30%, rgba(0,0,0,0.45) 52%, rgba(0,0,0,0.12) 70%, transparent 82%)",
    respiro: 5,
  },
  {
    clase: "left-0 bottom-0",
    variante: "b",
    transform: "scaleY(-1)",
    escala: 0.88,
    mascara:
      "radial-gradient(circle at 0% 0%, #000 30%, rgba(0,0,0,0.45) 52%, rgba(0,0,0,0.12) 70%, transparent 82%)",
    respiro: 7.5,
  },
];

export function FloralFrame() {
  const reduced = useReducedMotion();
  // En un teléfono, menos piezas por ramo: el efecto es el mismo y el
  // navegador tiene bastante menos que rasterizar.
  const ligero = useMediaQuery("(max-width: 767px)");

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-[2] overflow-hidden">
      {ESQUINAS.map((esquina) => (
        <motion.div
          key={esquina.clase}
          className={"absolute " + esquina.clase}
          style={{
            width: "clamp(112px, " + 30 * esquina.escala + "vmin, " + 320 * esquina.escala + "px)",
            aspectRatio: "1 / 1",
            // Un pelín fuera de pantalla: el ramo nace del borde, no flota
            // dentro de él, y libera espacio para el texto.
            margin: "-3.5%",
            transform: esquina.transform,
            maskImage: esquina.mascara,
            WebkitMaskImage: esquina.mascara,
          }}
          /*
           * Solo respira la opacidad. Animar `scale` o `rotate` sobre un
           * subárbol con filtros SVG obliga al navegador a volver a
           * rasterizar las 180 formas del ramo en cada fotograma; la
           * opacidad la aplica el compositor por encima del filtro ya
           * calculado y no cuesta nada.
           */
          animate={reduced ? undefined : { opacity: [0.9, 1, 0.9] }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: esquina.respiro,
          }}
        >
          <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
            <Ramo variante={esquina.variante} ligero={ligero} />
          </svg>
        </motion.div>
      ))}

      {/* Ramitas sueltas a media altura, para que los laterales no queden
          vacíos entre esquina y esquina. Muy tenues: solo insinúan. */}
      <div
        className="absolute left-0 top-1/2 hidden w-[12vmin] max-w-[130px] -translate-y-1/2 opacity-55 sm:block"
        style={{ aspectRatio: "1 / 1" }}
      >
        <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible">
          <Eucalipto t="translate(-30 60) rotate(-8) scale(0.85)" />
          <Aliento t="translate(-6 34) scale(0.7)" opacity={0.8} />
        </svg>
      </div>
      <div
        className="absolute right-0 top-1/2 hidden w-[12vmin] max-w-[130px] -translate-y-1/2 opacity-55 sm:block"
        style={{ aspectRatio: "1 / 1", transform: "translateY(-50%) scaleX(-1)" }}
      >
        <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible">
          <Olivo t="translate(-30 62) rotate(-6) scale(0.9)" />
          <Bayas t="translate(10 36) scale(0.7)" opacity={0.85} />
        </svg>
      </div>
    </div>
  );
}
