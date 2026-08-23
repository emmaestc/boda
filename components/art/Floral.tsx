/**
 * Botánica de línea. Todo se dibuja con `currentColor` y trazos abiertos, de
 * modo que las escenas puedan animar el trazado con `stroke-dashoffset`.
 */

function Leaf({ t, s = 1 }: { t: string; s?: number }) {
  return (
    <path
      transform={t + " scale(" + s + ")"}
      d="M0 0c4.5-6.5 13-8.5 18.5-5.5C15 1.5 6.5 4 0 0Z"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeLinejoin="round"
      fill="none"
    />
  );
}

function Blossom({ t, s = 1 }: { t: string; s?: number }) {
  return (
    <g transform={t + " scale(" + s + ")"}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx="0"
          cy="-4.6"
          rx="2.5"
          ry="4.4"
          transform={"rotate(" + a + ")"}
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
        />
      ))}
      <circle cx="0" cy="0" r="1.5" fill="currentColor" opacity="0.65" />
    </g>
  );
}

/** Ramita horizontal. Acompaña títulos y separadores. */
export function FloralSprig({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 130 56"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d="M2 52C26 49 50 40 70 25 82 16 98 9 126 6"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <Leaf t="translate(18 47) rotate(-18)" s={1.05} />
      <Leaf t="translate(30 42) rotate(160)" s={0.9} />
      <Leaf t="translate(48 35) rotate(-28)" s={1.15} />
      <Leaf t="translate(62 28) rotate(150)" s={0.95} />
      <Leaf t="translate(84 17) rotate(-20)" s={1} />
      <Leaf t="translate(102 11) rotate(165)" s={0.85} />
      <Blossom t="translate(40 33)" s={1.1} />
      <Blossom t="translate(74 15)" s={0.85} />
      <Blossom t="translate(116 5)" s={1} />
    </svg>
  );
}

/** Esquina floral para enmarcar escenas completas. */
export function FloralCorner({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M-4 6C34 10 68 26 94 54c22 24 34 54 38 88"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M6 40C36 52 62 74 80 104c14 24 22 50 24 78"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity="0.7"
      />
      <Leaf t="translate(26 12) rotate(35)" s={1.2} />
      <Leaf t="translate(52 22) rotate(-140)" s={1} />
      <Leaf t="translate(74 40) rotate(52)" s={1.3} />
      <Leaf t="translate(96 68) rotate(-125)" s={1.1} />
      <Leaf t="translate(112 100) rotate(70)" s={1.25} />
      <Leaf t="translate(124 140) rotate(-110)" s={1} />
      <Leaf t="translate(30 52) rotate(60)" s={0.9} />
      <Leaf t="translate(62 92) rotate(75)" s={0.95} />
      <Blossom t="translate(14 20)" s={1.5} />
      <Blossom t="translate(66 30)" s={1.1} />
      <Blossom t="translate(92 78)" s={1.35} />
      <Blossom t="translate(122 122)" s={1} />
      <Blossom t="translate(130 178)" s={1.2} />
    </svg>
  );
}

/** Guirnalda simétrica: dos ramas que abrazan un contenido. */
export function FloralWreath({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 120"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M120 112C74 112 34 90 20 58 14 44 16 28 26 20"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <path
        d="M120 112c46 0 86-22 100-54 6-14 4-30-6-38"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <Leaf t="translate(28 30) rotate(70)" s={1.2} />
      <Leaf t="translate(24 52) rotate(105)" s={1} />
      <Leaf t="translate(36 74) rotate(60)" s={1.15} />
      <Leaf t="translate(60 92) rotate(30)" s={1.25} />
      <Leaf t="translate(88 106) rotate(10)" s={1} />
      <Leaf t="translate(212 30) rotate(110)" s={1.2} />
      <Leaf t="translate(216 52) rotate(75)" s={1} />
      <Leaf t="translate(204 74) rotate(120)" s={1.15} />
      <Leaf t="translate(180 92) rotate(150)" s={1.25} />
      <Leaf t="translate(152 106) rotate(170)" s={1} />
      <Blossom t="translate(22 40)" s={1.3} />
      <Blossom t="translate(48 84)" s={1.1} />
      <Blossom t="translate(218 40)" s={1.3} />
      <Blossom t="translate(192 84)" s={1.1} />
    </svg>
  );
}
