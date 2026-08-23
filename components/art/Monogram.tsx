import { wedding } from "@/lib/config/wedding";

/**
 * Monograma J & E dentro de un anillo de trazo fino.
 *
 * Las tres glifos van en un único `<text>` con espacios reales, no en `tspan`
 * de tamaños distintos. La razón es que en Great Vibes la "J" ocupa 55 puntos
 * de tinta pero solo avanza 39: su rasgo vuela sobre la letra siguiente, así
 * que cualquier composición manual que no lo tenga en cuenta acaba con las
 * letras montadas. Dejando que la fuente calcule el avance y separando con
 * espacios, el conjunto respira.
 *
 * Las medidas de abajo salen de la tinta real de la fuente, no de estimaciones:
 * a cuerpo 40, "J & E" mide 115 de ancho, sube 33 sobre la línea base y baja 16.
 */

/** Ancho de la tinta dividido por el cuerpo de la fuente. */
const INK_WIDTH_RATIO = 115 / 40;
/** Cuánto sube la tinta sobre la línea base, en cuerpos de fuente. */
const ASCENT_RATIO = 33 / 40;
/** Cuánto baja bajo la línea base. */
const DESCENT_RATIO = 16 / 40;

// El lienzo es de 120 unidades con el anillo exterior en r = 54.
const CENTER = 60;
const RING_RADIUS = 54;
/** Proporción del diámetro que ocupa el texto, dejando aire hasta el anillo. */
const FILL = 0.72;

const FONT_SIZE = Math.round(((RING_RADIUS * 2 * FILL) / INK_WIDTH_RATIO) * 10) / 10;
/** Línea base tal que el centro óptico de la tinta caiga en el centro del círculo. */
const BASELINE = CENTER + ((ASCENT_RATIO - DESCENT_RATIO) * FONT_SIZE) / 2;

export function Monogram({
  className = "",
  size = 96,
}: {
  className?: string;
  size?: number;
}) {
  const { first, second } = wedding.couple.initials;

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={"Monograma de " + wedding.couple.first + " y " + wedding.couple.second}
    >
      <defs>
        <linearGradient id="mono-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9a7c3e" />
          <stop offset="45%" stopColor="#e9d8b0" />
          <stop offset="100%" stopColor="#c6a867" />
        </linearGradient>
      </defs>

      <circle
        cx={CENTER}
        cy={CENTER}
        r={RING_RADIUS}
        fill="none"
        stroke="url(#mono-gold)"
        strokeWidth="0.9"
        opacity="0.85"
      />
      <circle
        cx={CENTER}
        cy={CENTER}
        r={RING_RADIUS - 5}
        fill="none"
        stroke="url(#mono-gold)"
        strokeWidth="0.4"
        opacity="0.5"
      />

      <text
        x={CENTER}
        y={BASELINE}
        textAnchor="middle"
        fill="url(#mono-gold)"
        fontSize={FONT_SIZE}
        className="font-script"
      >
        {first} &amp; {second}
      </text>
    </svg>
  );
}
