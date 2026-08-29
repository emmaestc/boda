/**
 * Silueta de los novios abrazados.
 *
 * A tamaño de icono lo que hace reconocible una escena de boda son cuatro
 * cosas, y todo lo demás estorba: dos cabezas juntas arriba, una falda ancha
 * que cae en campana con cola, un traje oscuro y estrecho al lado, y los
 * brazos que se cruzan entre los dos.
 *
 * El vestido va en blanco con perfil de tinta —no en negro— para que no se
 * funda con el traje en una sola mancha, y se dibuja después de él para que
 * pase por delante: es lo que da la sensación de que ella está apoyada en él.
 */
export function Novios({ className = "" }: { className?: string }) {
  const tinta = "#24384f";
  const tela = "#fdfdfb";

  return (
    <svg
      viewBox="0 0 190 250"
      className={className}
      role="img"
      aria-label="Silueta de los novios abrazados"
    >
      {/* ================= Él ================= */}
      <path
        d="M104 88c2-12 10-20 22-22 14-2 26 4 32 16 5 10 7 24 7 42v118h-57V124c0-18-6-24-4-36Z"
        fill={tinta}
      />
      {/* Cuello */}
      <path d="M124 58h13v13h-13z" fill={tinta} />
      {/* Cabeza, ligeramente inclinada hacia ella */}
      <ellipse cx="131" cy="44" rx="16" ry="18" transform="rotate(-7 131 44)" fill={tinta} />
      {/* Pelo */}
      <path
        d="M115 43c-1-15 7-24 17-24 11 0 18 9 17 24-3-9-9-13-17-12-8 1-14 4-17 12Z"
        fill="#1a2a3c"
      />
      {/* Camisa: la cuña clara que separa el traje del cuello */}
      <path d="M124 70l7 22 8-22-7-4-8 4Z" fill={tela} />
      <path d="M127 77l5 4-5 4v-8Zm9 0v8l-5-4 5-4Z" fill={tinta} />

      {/* ================= Ella ================= */}
      {/* Melena cayendo por su espalda */}
      <path
        d="M70 48c-6 18-6 42-1 60 3 12 8 22 13 27l9-5c-7-9-13-24-15-40-2-16-2-30 1-42Z"
        fill={tinta}
      />
      {/* Falda en campana, con la cola hacia su lado */}
      <path
        d="M77 128c-11 24-27 58-45 86-5 8-11 15-10 19 2 4 14 5 32 5h60c4 0 6-3 5-10-3-30-7-60-13-82-3-11-6-17-8-20Z"
        fill={tela}
        stroke={tinta}
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      {/* Cuerpo del vestido */}
      <path
        d="M77 80c-5 10-6 22-3 34 2 10 5 16 8 20h22c2-6 4-16 4-28 0-12-3-21-8-27-7-6-17-6-23 1Z"
        fill={tela}
        stroke={tinta}
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      {/* Cabeza, inclinada hacia él */}
      <ellipse cx="88" cy="47" rx="15" ry="17" transform="rotate(9 88 47)" fill={tinta} />
      {/* Recogido */}
      <path
        d="M73 47c-1-14 7-23 17-23 8 0 14 5 16 13-5-4-11-5-17-3-7 2-13 6-16 13Z"
        fill="#1a2a3c"
      />

      {/* ============ El abrazo ============ */}
      {/* Su brazo sube al hombro de él */}
      <path
        d="M100 88c11-9 22-15 31-17"
        stroke={tela}
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M100 88c11-9 22-15 31-17"
        stroke={tinta}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      {/* El de él la rodea por la cintura, por delante del vestido */}
      <path
        d="M114 100c-10 13-21 22-30 27"
        stroke={tinta}
        strokeWidth="13"
        strokeLinecap="round"
        fill="none"
      />

      {/* El ramo, en su mano libre */}
      <path d="M58 158v20" stroke="#7d9a78" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="58" cy="150" r="11" fill={tela} stroke={tinta} strokeWidth="3.4" />
      <circle cx="58" cy="150" r="3.4" fill="#d9bd7f" />
    </svg>
  );
}
