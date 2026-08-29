/**
 * Botánica en acuarela — blanco, tono tarjeta y azul.
 *
 * La versión anterior dibujaba cada pétalo con su contorno, y ahí estaba el
 * problema: una flor pintada no tiene línea, tiene masa de color. Lo que hace
 * que algo se lea como acuarela y no como vector son cuatro cosas, y aquí
 * están las cuatro:
 *
 *  1. **Sin contornos.** Solo relleno. La forma la define el color, no una
 *     raya alrededor.
 *  2. **Estructura de valor.** Debajo de los pétalos va una capa de sombra
 *     difuminada y encima una de luz. Es lo que da volumen; sin ello una flor
 *     parece una pegatina por muchos pétalos que tenga.
 *  3. **Bordes rotos y blandos.** `feTurbulence` + `feDisplacementMap`
 *     deforma el contorno de forma irregular y un desenfoque posterior lo
 *     ablanda, igual que el agua al correrse por el papel.
 *  4. **Pigmento acumulado.** Cada pétalo lleva un degradado que va de claro
 *     en la punta a saturado en la base, que es por donde el agua se seca la
 *     última.
 */

export function BotanicalDefs() {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        {/* Borde roto y blando: el gesto del pincel sobre papel granulado. */}
        <filter id="acuarela" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.016 0.021"
            numOctaves="4"
            seed="9"
            result="grano"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="grano"
            scale="7"
            xChannelSelector="R"
            yChannelSelector="G"
            result="roto"
          />
          <feGaussianBlur in="roto" stdDeviation="0.7" />
        </filter>

        {/* Para las hojas: menos temblor, algo más de nitidez. */}
        <filter id="acuarela-hoja" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.024 0.03"
            numOctaves="3"
            seed="23"
            result="grano2"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="grano2"
            scale="4"
            xChannelSelector="R"
            yChannelSelector="G"
            result="roto2"
          />
          <feGaussianBlur in="roto2" stdDeviation="0.45" />
        </filter>

        {/* --- Blancos: nunca blanco puro, siempre con sombra azulada --- */}
        <linearGradient id="petalo-blanco" x1="0.5" y1="1" x2="0.45" y2="0">
          <stop offset="0%" stopColor="#c3d4e5" />
          <stop offset="32%" stopColor="#e6eef6" />
          <stop offset="70%" stopColor="#fbfcfe" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="petalo-blanco-hondo" x1="0.5" y1="1" x2="0.45" y2="0">
          <stop offset="0%" stopColor="#a8bed3" />
          <stop offset="40%" stopColor="#d7e3ef" />
          <stop offset="100%" stopColor="#f6f9fc" />
        </linearGradient>

        {/* --- Tono de la tarjeta: crema porcelana --- */}
        <linearGradient id="petalo-crema" x1="0.5" y1="1" x2="0.45" y2="0">
          <stop offset="0%" stopColor="#dcc9a8" />
          <stop offset="38%" stopColor="#f2e7d3" />
          <stop offset="100%" stopColor="#fffdf8" />
        </linearGradient>

        {/* --- Azules --- */}
        <linearGradient id="petalo-azul" x1="0.5" y1="1" x2="0.45" y2="0">
          <stop offset="0%" stopColor="#5b86b5" />
          <stop offset="35%" stopColor="#93b7dc" />
          <stop offset="78%" stopColor="#cfe0f2" />
          <stop offset="100%" stopColor="#eaf2fa" />
        </linearGradient>
        <linearGradient id="petalo-azul-claro" x1="0.5" y1="1" x2="0.45" y2="0">
          <stop offset="0%" stopColor="#8fb3d8" />
          <stop offset="45%" stopColor="#c2d8ee" />
          <stop offset="100%" stopColor="#f0f6fc" />
        </linearGradient>

        {/* --- Follaje con matiz azulado, para que case con la paleta --- */}
        <linearGradient id="hoja-verde" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#6f8f86" />
          <stop offset="45%" stopColor="#9db8ab" />
          <stop offset="100%" stopColor="#d2e0d8" />
        </linearGradient>
        <linearGradient id="hoja-eucalipto" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#7f9dac" />
          <stop offset="50%" stopColor="#adc3cd" />
          <stop offset="100%" stopColor="#dce7ec" />
        </linearGradient>

        {/* Sombra que se pinta DEBAJO de la flor para asentarla. */}
        <radialGradient id="asiento" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8ea7bd" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#8ea7bd" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="corazon-claro" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#f7e6b4" />
          <stop offset="100%" stopColor="#d9bd7f" stopOpacity="0.75" />
        </radialGradient>
      </defs>
    </svg>
  );
}

type Puesta = { t?: string; opacity?: number };

/** Un pétalo. Sin contorno: solo masa de color con su degradado. */
function Petalo({ t, relleno, o = 1 }: { t: string; relleno: string; o?: number }) {
  return (
    <path
      transform={t}
      d="M0 0C-17 -7-25 -23-14 -35-6 -44 8 -44 16 -35 27 -23 17 -7 0 0Z"
      fill={relleno}
      opacity={o}
    />
  );
}

/**
 * Rosa de jardín blanca. Tres coronas de pétalos que van reduciendo,
 * asentada sobre su propia sombra y con el cogollo en crema.
 */
export function RosaBlanca({ t = "", opacity = 1 }: Puesta) {
  return (
    <g transform={t} opacity={opacity}>
      {/* La sombra va fuera del filtro para que quede realmente difusa */}
      <ellipse cx="2" cy="4" rx="40" ry="36" fill="url(#asiento)" />
      <g filter="url(#acuarela)">
        {/* Corona exterior */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <Petalo key={a} t={"rotate(" + a + ") scale(1.12)"} relleno="url(#petalo-blanco-hondo)" />
        ))}
        {/* Corona intermedia, girada para tapar las juntas */}
        {[22, 67, 112, 157, 202, 247, 292, 337].map((a) => (
          <Petalo key={"m" + a} t={"rotate(" + a + ") scale(0.82)"} relleno="url(#petalo-blanco)" />
        ))}
        {/* Corona interior */}
        {[10, 82, 154, 226, 298].map((a) => (
          <Petalo key={"i" + a} t={"rotate(" + a + ") scale(0.5)"} relleno="url(#petalo-blanco)" />
        ))}
        {/* Cogollo enrollado */}
        <ellipse cx="0" cy="-3" rx="8" ry="7" fill="url(#petalo-crema)" />
        <path d="M-5 -2C-7 -8-2 -12 3 -10 7 -8 7 -2 3 0" fill="none" stroke="#d8c49c" strokeWidth="2" opacity="0.55" />
      </g>
    </g>
  );
}

/** La misma rosa en tono tarjeta, para variar sin romper la paleta. */
export function RosaCrema({ t = "", opacity = 1 }: Puesta) {
  return (
    <g transform={t} opacity={opacity}>
      <ellipse cx="2" cy="4" rx="38" ry="34" fill="url(#asiento)" />
      <g filter="url(#acuarela)">
        {[0, 51, 102, 153, 204, 255, 306].map((a) => (
          <Petalo key={a} t={"rotate(" + a + ") scale(1.05)"} relleno="url(#petalo-crema)" o={0.95} />
        ))}
        {[26, 77, 128, 179, 230, 281, 332].map((a) => (
          <Petalo key={"m" + a} t={"rotate(" + a + ") scale(0.74)"} relleno="url(#petalo-crema)" />
        ))}
        {[40, 130, 220, 310].map((a) => (
          <Petalo key={"i" + a} t={"rotate(" + a + ") scale(0.46)"} relleno="url(#petalo-blanco)" />
        ))}
        <circle cx="0" cy="-2" r="6" fill="url(#corazon-claro)" />
      </g>
    </g>
  );
}

/**
 * Anémona blanca de corazón oscuro. Es la flor que más "lee" de lejos:
 * el contraste del centro la hace reconocible al instante.
 */
export function Anemona({ t = "", opacity = 1 }: Puesta) {
  return (
    <g transform={t} opacity={opacity}>
      <ellipse cx="1" cy="3" rx="30" ry="27" fill="url(#asiento)" />
      <g filter="url(#acuarela)">
        {[0, 51, 103, 154, 206, 257, 309].map((a) => (
          <path
            key={a}
            transform={"rotate(" + a + ")"}
            d="M0 0C-13 -6-19 -19-11 -28-4 -35 6 -35 12 -28 20 -19 13 -6 0 0Z"
            fill="url(#petalo-blanco)"
          />
        ))}
        {/* Corazón: azul muy oscuro, no negro, para no ensuciar la paleta */}
        <circle cx="0" cy="-1" r="7.5" fill="#2f4257" opacity="0.9" />
        <circle cx="0" cy="-1" r="4" fill="#1e2f40" />
        {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a) => (
          <line
            key={a}
            x1="0"
            y1="-1"
            x2="0"
            y2="-11"
            transform={"rotate(" + a + ")"}
            stroke="#48607a"
            strokeWidth="1.3"
            strokeLinecap="round"
            opacity="0.75"
          />
        ))}
      </g>
    </g>
  );
}

/**
 * Hortensia azul: un domo de floretes de cuatro pétalos. La gracia está en
 * que cada florete tenga su propio tono, como en la flor real.
 */
export function Hortensia({ t = "", opacity = 1 }: Puesta) {
  const floretes = [
    [0, 0, 1, 0],
    [-16, -6, 0.92, 18],
    [15, -8, 0.95, -22],
    [-9, 11, 0.88, 40],
    [12, 12, 0.9, -12],
    [-24, 6, 0.8, 8],
    [25, 4, 0.82, 30],
    [2, -18, 0.86, -8],
    [-14, -19, 0.74, 24],
    [17, -20, 0.76, -30],
    [-2, 22, 0.78, 16],
  ] as const;

  return (
    <g transform={t} opacity={opacity}>
      <ellipse cx="0" cy="2" rx="34" ry="28" fill="url(#asiento)" />
      <g filter="url(#acuarela)">
        {floretes.map(([x, y, s, r], i) => (
          <g key={i} transform={"translate(" + x + " " + y + ") rotate(" + r + ") scale(" + s + ")"}>
            {[0, 90, 180, 270].map((a) => (
              <ellipse
                key={a}
                cx="0"
                cy="-6.5"
                rx="5.2"
                ry="6.8"
                transform={"rotate(" + a + ")"}
                fill={i % 3 === 0 ? "url(#petalo-azul)" : "url(#petalo-azul-claro)"}
              />
            ))}
            <circle cx="0" cy="0" r="1.9" fill="#f4e9c6" opacity="0.9" />
          </g>
        ))}
      </g>
    </g>
  );
}

/** Espiga de delfinio: los azules en vertical que rompen la horizontal. */
export function Delfinio({ t = "", opacity = 1 }: Puesta) {
  const flores = [
    [0, 0, 1],
    [-7, -14, 0.9],
    [6, -25, 0.84],
    [-5, -36, 0.74],
    [4, -46, 0.62],
    [-2, -55, 0.5],
  ] as const;
  return (
    <g transform={t} opacity={opacity}>
      <g filter="url(#acuarela)">
        <path d="M0 6C-1 -10 1 -30 -1 -56" stroke="#8aa79b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {flores.map(([x, y, s], i) => (
          <g key={i} transform={"translate(" + x + " " + y + ") scale(" + s + ")"}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse
                key={a}
                cx="0"
                cy="-6"
                rx="4.4"
                ry="6.2"
                transform={"rotate(" + a + ")"}
                fill={i % 2 ? "url(#petalo-azul-claro)" : "url(#petalo-azul)"}
              />
            ))}
            <circle cx="0" cy="0" r="1.8" fill="#fdf6e0" opacity="0.85" />
          </g>
        ))}
      </g>
    </g>
  );
}

/** Rama de eucalipto: hojas redondas opuestas, en verde azulado. */
export function Eucalipto({ t = "", opacity = 1 }: Puesta) {
  const pasos = [10, 22, 34, 46, 58, 70, 82, 94];
  return (
    <g transform={t} opacity={opacity} filter="url(#acuarela-hoja)">
      <path
        d="M0 0C16 -6 36 -12 58 -15c18 -2 34 -1 46 2"
        fill="none"
        stroke="#8aa4ad"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      {pasos.map((d, i) => {
        const x = d * 1.06;
        const y = -d * 0.19 - 2;
        const r = 10.5 - i * 0.55;
        return (
          <g key={d}>
            <ellipse
              cx={x}
              cy={y - 9}
              rx={r * 0.82}
              ry={r}
              transform={"rotate(" + (-26 + i * 4) + " " + x + " " + (y - 9) + ")"}
              fill="url(#hoja-eucalipto)"
            />
            <ellipse
              cx={x}
              cy={y + 9}
              rx={r * 0.82}
              ry={r}
              transform={"rotate(" + (26 - i * 4) + " " + x + " " + (y + 9) + ")"}
              fill="url(#hoja-eucalipto)"
            />
          </g>
        );
      })}
    </g>
  );
}

/** Rama de hoja lanceolada, más verde y más oscura: da profundidad. */
export function Follaje({ t = "", opacity = 1 }: Puesta) {
  const pasos = [8, 20, 32, 44, 56, 68, 80, 92, 104];
  return (
    <g transform={t} opacity={opacity} filter="url(#acuarela-hoja)">
      <path
        d="M0 0C22 -5 50 -12 76 -21c15 -5 26 -10 34 -14"
        fill="none"
        stroke="#7b9384"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {pasos.map((d, i) => (
        <path
          key={d}
          transform={
            "translate(" + d * 1.05 + " " + -d * 0.27 + ") rotate(" + (i % 2 === 0 ? -56 : 40) + ")"
          }
          d="M0 0C4 -11 11 -18 19 -20 17 -11 11 -3 0 0Z"
          fill="url(#hoja-verde)"
        />
      ))}
    </g>
  );
}

/** Capullos y bayas pequeñas para rellenar huecos sin peso. */
export function Capullos({ t = "", opacity = 1 }: Puesta) {
  const puntos = [
    [0, 0, 4.6],
    [12, -8, 4],
    [9, 9, 3.6],
    [22, 1, 3.2],
    [-9, 8, 3],
    [19, -15, 2.6],
  ] as const;
  return (
    <g transform={t} opacity={opacity} filter="url(#acuarela-hoja)">
      {puntos.map(([x, y, r], i) => (
        <g key={i}>
          <path
            d={"M" + x + " " + y + "L" + (x - 13) + " " + (y + 11)}
            stroke="#8fa89a"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.75"
          />
          <circle cx={x} cy={y} r={r} fill={i % 2 ? "url(#petalo-azul-claro)" : "url(#petalo-blanco)"} />
        </g>
      ))}
    </g>
  );
}

/** Paniculata: los puntitos blancos que airean un ramo. */
export function Aliento({ t = "", opacity = 1 }: Puesta) {
  const nubes = [
    [0, 0],
    [15, -10],
    [28, 3],
    [11, 13],
    [37, -9],
    [24, -20],
    [43, 9],
    [-7, -12],
  ] as const;
  return (
    <g transform={t} opacity={opacity}>
      <path
        d="M-5 15C7 6 20 -3 37 -7"
        fill="none"
        stroke="#9db3a7"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.7"
      />
      {nubes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.9" fill="#ffffff" opacity="0.95" />
      ))}
    </g>
  );
}
