/**
 * Silueta de los novios.
 *
 * Lo que hace reconocible una silueta de boda a tamaño pequeño no es el
 * detalle sino tres contrastes: la falda blanca y ancha frente al traje
 * oscuro y estrecho, las dos cabezas juntas arriba, y la melena de ella
 * cayendo por fuera del vestido. Todo lo demás sobra, y a 90 píxeles solo
 * ensucia.
 *
 * El vestido va en blanco con perfil de tinta —igual que en el papel— para
 * que no se convierta en una mancha negra junto al traje.
 */
export function Novios({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 250"
      className={className}
      role="img"
      aria-label="Silueta de los novios"
    >
      {/* ---------------- Él ---------------- */}
      {/* Traje: hombros anchos que caen rectos */}
      <path
        d="M120 74c-9 3-15 9-18 18-3 8-4 19-4 32v114h72V124c0-13-1-24-4-32-3-9-9-15-18-18l-14 12-14-12Z"
        fill="#24384f"
      />
      {/* Cabeza y pelo */}
      <circle cx="134" cy="48" r="17" fill="#24384f" />
      <path
        d="M117 46c0-11 8-19 17-19s17 8 17 19c-2-6-7-9-13-9-5 0-9 2-14 2-4 0-6 2-7 7Z"
        fill="#1a2a3c"
      />
      <path d="M128 62h12v13h-12z" fill="#24384f" />
      {/* Camisa y pajarita: el punto claro que separa el traje del cuello */}
      <path d="M126 74h16l-8 16-8-16Z" fill="#fdfdfb" />
      <path d="M129 79l5 4-5 4v-8Zm10 0v8l-5-4 5-4Z" fill="#24384f" />
      {/* Su brazo rodeándola por la cintura */}
      <path
        d="M118 104c-9 6-19 11-28 14"
        stroke="#24384f"
        strokeWidth="13"
        strokeLinecap="round"
        fill="none"
      />

      {/* ---------------- Ella ---------------- */}
      {/* Melena por detrás, cayendo hacia su espalda */}
      <path
        d="M64 54c-4 16-4 34-1 50 2 12 6 21 10 26l9-4c-5-9-9-22-10-36-1-13-1-25 1-34Z"
        fill="#24384f"
      />
      {/* Falda: la forma que manda en toda la silueta */}
      <path
        d="M76 116c-5 16-14 38-25 61-9 19-17 34-22 41-2 3-1 5 3 5h96c1-27 0-58-5-84-3-13-6-22-9-27l-38 4Z"
        fill="#fdfdfb"
        stroke="#24384f"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Cuerpo del vestido */}
      <path
        d="M78 76c-4 6-6 13-6 21 0 9 2 16 4 21h30c2-6 3-13 3-22 0-8-2-14-6-20-7-5-18-5-25 0Z"
        fill="#fdfdfb"
        stroke="#24384f"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Cabeza y pelo recogido hacia él */}
      <circle cx="88" cy="50" r="15" fill="#24384f" />
      <path
        d="M73 50c0-12 7-21 16-21 8 0 14 5 16 13-4-3-9-4-14-3-6 1-11 4-14 8-2 3-3 5-4 3Z"
        fill="#1a2a3c"
      />
      {/* Su brazo subiendo al hombro de él */}
      <path
        d="M100 88c9-5 18-8 25-8"
        stroke="#fdfdfb"
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M100 88c9-5 18-8 25-8"
        stroke="#24384f"
        strokeWidth="3.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />

      {/* El ramo, que remata la composición abajo a la izquierda */}
      <circle cx="62" cy="132" r="9" fill="#fdfdfb" stroke="#24384f" strokeWidth="3" />
      <path d="M62 141v14" stroke="#7d9a78" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
