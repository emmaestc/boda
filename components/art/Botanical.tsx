/**
 * Botánica en acuarela.
 *
 * El encargo era que las flores se vieran realistas, no vectoriales. Tres
 * técnicas lo consiguen sin una sola imagen:
 *
 *  1. `feTurbulence` + `feDisplacementMap` deforma los bordes de cada forma de
 *     manera irregular, que es justo lo que distingue un trazo pintado de uno
 *     dibujado con el ratón.
 *  2. Cada pétalo lleva un degradado radial que va de claro en el centro a
 *     saturado en el borde, imitando el pigmento que se acumula donde el agua
 *     se seca.
 *  3. Las formas se superponen con transparencia, de modo que los solapes
 *     oscurecen igual que dos capas de acuarela húmeda.
 *
 * Los degradados y el filtro viven en un `<defs>` único (`BotanicalDefs`) que
 * se monta una sola vez: los identificadores de SVG son globales al documento,
 * así que cualquier flor de cualquier parte de la página los encuentra.
 */

export function BotanicalDefs() {
  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      className="pointer-events-none absolute"
      style={{ position: "absolute" }}
    >
      <defs>
        {/* El temblor del papel: bordes irregulares, como pintados a mano. */}
        <filter id="acuarela" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.022 0.028"
            numOctaves="4"
            seed="7"
            result="ruido"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="ruido"
            scale="5.5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Una versión más suave, para las hojas pequeñas. */}
        <filter id="acuarela-suave" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03 0.035"
            numOctaves="3"
            seed="21"
            result="ruido2"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="ruido2"
            scale="3"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <radialGradient id="petalo-rosa" cx="42%" cy="70%" r="72%">
          <stop offset="0%" stopColor="#fdeceb" />
          <stop offset="55%" stopColor="#f1c8c4" />
          <stop offset="100%" stopColor="#d99a94" />
        </radialGradient>

        <radialGradient id="petalo-crema" cx="45%" cy="72%" r="72%">
          <stop offset="0%" stopColor="#fffdf8" />
          <stop offset="58%" stopColor="#f5e9d4" />
          <stop offset="100%" stopColor="#dcc7a4" />
        </radialGradient>

        <radialGradient id="petalo-malva" cx="45%" cy="70%" r="72%">
          <stop offset="0%" stopColor="#f6eef5" />
          <stop offset="55%" stopColor="#d8c1d6" />
          <stop offset="100%" stopColor="#b094ad" />
        </radialGradient>

        <linearGradient id="hoja-salvia" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d9e5d4" />
          <stop offset="50%" stopColor="#adc4a7" />
          <stop offset="100%" stopColor="#82a07c" />
        </linearGradient>

        <linearGradient id="hoja-oliva" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#c6d6bd" />
          <stop offset="55%" stopColor="#9bb491" />
          <stop offset="100%" stopColor="#6f8b68" />
        </linearGradient>

        <radialGradient id="baya" cx="35%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#e8d9e6" />
          <stop offset="60%" stopColor="#c4a7c1" />
          <stop offset="100%" stopColor="#9c7f99" />
        </radialGradient>

        <radialGradient id="corazon-flor" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#f6d98a" />
          <stop offset="100%" stopColor="#d3ae5e" />
        </radialGradient>
      </defs>
    </svg>
  );
}

type Colocacion = { t?: string; opacity?: number };

/** Pétalo suelto, la pieza con la que se construyen rosa y peonía. */
function Petalo({ t = "", relleno }: { t?: string; relleno: string }) {
  return (
    <path
      transform={t}
      d="M0 0C-13 -5 -21 -19 -16 -32c4-11 17-16 27-11 11 5 15 19 10 31C18 -4 9 3 0 0Z"
      fill={relleno}
      stroke="#c9a49e"
      strokeOpacity="0.32"
      strokeWidth="0.7"
    />
  );
}

/** Rosa de jardín vista desde arriba: corona de pétalos y espiral central. */
export function Rosa({ t = "", opacity = 1 }: Colocacion) {
  return (
    <g transform={t} opacity={opacity} filter="url(#acuarela)">
      {[0, 51, 103, 154, 206, 257, 309].map((a, i) => (
        <Petalo key={a} t={"rotate(" + a + ") scale(" + (1 - (i % 3) * 0.06) + ")"} relleno="url(#petalo-rosa)" />
      ))}
      {[26, 98, 170, 242, 314].map((a) => (
        <Petalo key={"i" + a} t={"rotate(" + a + ") scale(0.6)"} relleno="url(#petalo-rosa)" />
      ))}
      {/* El cogollo del centro, enrollado */}
      <path
        d="M0 2c-6-2-9-8-6-13 3-4 9-5 12-1 4 4 3 11-2 13-4 2-8 0-9-4"
        fill="none"
        stroke="#c48f89"
        strokeOpacity="0.6"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="0" cy="-2" r="3.4" fill="#e7b4ad" opacity="0.75" />
    </g>
  );
}

/** Peonía color crema: más pétalos, más abiertos y más revueltos. */
export function Peonia({ t = "", opacity = 1 }: Colocacion) {
  return (
    <g transform={t} opacity={opacity} filter="url(#acuarela)">
      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a, i) => (
        <Petalo
          key={a}
          t={"rotate(" + a + ") scale(" + (1.08 - (i % 4) * 0.07) + ")"}
          relleno="url(#petalo-crema)"
        />
      ))}
      {[20, 92, 164, 236, 308].map((a) => (
        <Petalo key={"i" + a} t={"rotate(" + a + ") scale(0.5)"} relleno="url(#petalo-crema)" />
      ))}
      <circle cx="0" cy="-1" r="5" fill="url(#corazon-flor)" opacity="0.85" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <line
          key={a}
          x1="0"
          y1="0"
          x2="0"
          y2="-7"
          transform={"rotate(" + a + ")"}
          stroke="#c9a45c"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.7"
        />
      ))}
    </g>
  );
}

/** Flor pequeña de relleno, en malva. */
export function FlorMalva({ t = "", opacity = 1 }: Colocacion) {
  return (
    <g transform={t} opacity={opacity} filter="url(#acuarela-suave)">
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx="0"
          cy="-11"
          rx="7"
          ry="11"
          transform={"rotate(" + a + ")"}
          fill="url(#petalo-malva)"
          stroke="#a98ba6"
          strokeOpacity="0.3"
          strokeWidth="0.6"
        />
      ))}
      <circle cx="0" cy="0" r="3.6" fill="url(#corazon-flor)" />
    </g>
  );
}

/** Rama de eucalipto: hojas redondas y opuestas a lo largo del tallo. */
export function Eucalipto({ t = "", opacity = 1 }: Colocacion) {
  const hojas = [12, 24, 36, 48, 60, 72, 84];
  return (
    <g transform={t} opacity={opacity} filter="url(#acuarela-suave)">
      <path
        d="M0 0C14 -6 32 -12 52 -14c16-2 30-1 40 2"
        fill="none"
        stroke="#8ba585"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {hojas.map((d, i) => {
        const x = d * 1.05;
        const y = -d * 0.2 - 2;
        const r = 10 - i * 0.5;
        return (
          <g key={d}>
            <ellipse
              cx={x}
              cy={y - 8}
              rx={r * 0.8}
              ry={r}
              transform={"rotate(" + (-24 + i * 4) + " " + x + " " + (y - 8) + ")"}
              fill="url(#hoja-salvia)"
              stroke="#7d9a78"
              strokeOpacity="0.35"
              strokeWidth="0.6"
            />
            <ellipse
              cx={x}
              cy={y + 8}
              rx={r * 0.8}
              ry={r}
              transform={"rotate(" + (24 - i * 4) + " " + x + " " + (y + 8) + ")"}
              fill="url(#hoja-salvia)"
              stroke="#7d9a78"
              strokeOpacity="0.35"
              strokeWidth="0.6"
            />
          </g>
        );
      })}
    </g>
  );
}

/** Rama de olivo: hoja lanceolada, más estrecha y más oscura. */
export function Olivo({ t = "", opacity = 1 }: Colocacion) {
  const hojas = [10, 22, 34, 46, 58, 70, 82, 94];
  return (
    <g transform={t} opacity={opacity} filter="url(#acuarela-suave)">
      <path
        d="M0 0C20 -4 46 -10 70 -18c14-5 24-9 32-13"
        fill="none"
        stroke="#78916f"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {hojas.map((d, i) => {
        const x = d;
        const y = -d * 0.28;
        const giro = i % 2 === 0 ? -52 : 44;
        return (
          <path
            key={d}
            transform={"translate(" + x + " " + y + ") rotate(" + giro + ")"}
            d="M0 0c3-9 9-15 15-16-1 7-6 14-15 16Z"
            fill="url(#hoja-oliva)"
            stroke="#6f8b68"
            strokeOpacity="0.35"
            strokeWidth="0.5"
          />
        );
      })}
    </g>
  );
}

/** Racimo de bayas. Aporta los puntos oscuros que dan profundidad. */
export function Bayas({ t = "", opacity = 1 }: Colocacion) {
  const puntos = [
    [0, 0, 5.2],
    [11, -6, 4.4],
    [8, 8, 4],
    [20, 2, 3.6],
    [-8, 7, 3.4],
    [17, -13, 3],
  ] as const;
  return (
    <g transform={t} opacity={opacity} filter="url(#acuarela-suave)">
      {puntos.map(([x, y, r], i) => (
        <g key={i}>
          <path
            d={"M" + x + " " + y + "L" + (x - 12) + " " + (y + 10)}
            stroke="#94ab8d"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.7"
          />
          <circle cx={x} cy={y} r={r} fill="url(#baya)" />
          <circle cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.28} fill="#fbf3fa" opacity="0.55" />
        </g>
      ))}
    </g>
  );
}

/** Paniculata: los puntitos blancos que llenan los huecos de un ramo. */
export function Aliento({ t = "", opacity = 1 }: Colocacion) {
  const nubes = [
    [0, 0],
    [14, -9],
    [26, 3],
    [10, 12],
    [34, -8],
    [22, -18],
    [40, 8],
    [-6, -11],
  ] as const;
  return (
    <g transform={t} opacity={opacity}>
      <path
        d="M-4 14C6 6 18 -2 34 -6"
        fill="none"
        stroke="#a8bda2"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.65"
      />
      {nubes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="2.6" fill="#fffdf9" stroke="#e2dcc9" strokeWidth="0.5" />
          <circle cx={x} cy={y} r="0.9" fill="#e6cf94" opacity="0.8" />
        </g>
      ))}
    </g>
  );
}
