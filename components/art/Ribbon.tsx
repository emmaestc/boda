/**
 * Lazo de raso azul claro.
 *
 * Lo que hace que una cinta parezca raso y no papel de color es el brillo:
 * cada lazada lleva un degradado que va de casi blanco en el lomo a azul
 * hondo en el pliegue, más una veta clara encima siguiendo la curva. Sin eso
 * un lazo vectorial se ve plano por muchos nudos que tenga.
 *
 * Va partido en dos piezas —cinta y lazo— porque al abrir el sobre se desata:
 * las dos mitades de la banda se van hacia los lados y el nudo se afloja.
 */

export function RibbonDefs() {
  return (
    <defs>
      {/* Lomo de la lazada: la luz pega arriba y la sombra se hunde abajo */}
      <linearGradient id="raso-lazada" x1="0.2" y1="0" x2="0.6" y2="1">
        <stop offset="0%" stopColor="#f2f8ff" />
        <stop offset="28%" stopColor="#cfe2f5" />
        <stop offset="62%" stopColor="#a3c4e5" />
        <stop offset="100%" stopColor="#7099c6" />
      </linearGradient>
      {/* Las colas cuelgan, así que la luz les llega al revés */}
      <linearGradient id="raso-cola" x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0%" stopColor="#bfd8f0" />
        <stop offset="45%" stopColor="#9dc0e4" />
        <stop offset="100%" stopColor="#6b93c1" />
      </linearGradient>
      {/* El nudo es lo más apretado: más oscuro y con un toque de luz arriba */}
      <radialGradient id="raso-nudo" cx="38%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#e4eefb" />
        <stop offset="55%" stopColor="#a9c9e6" />
        <stop offset="100%" stopColor="#5f87b6" />
      </radialGradient>
    </defs>
  );
}

/** El lazo propiamente dicho: dos lazadas, dos colas y el nudo. */
export function Bow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 76" className={className} fill="none">
      <RibbonDefs />

      {/* Colas, detrás de todo */}
      <path
        d="M57 36C50 49 39 59 26 66c-4-4-6-8-8-13 13-4 26-9 36-20Z"
        fill="url(#raso-cola)"
      />
      <path
        d="M63 36c7 13 18 23 31 30 4-4 6-8 8-13-13-4-26-9-36-20Z"
        fill="url(#raso-cola)"
      />

      {/* Lazadas */}
      <path
        d="M60 34C45 13 16 8 11 24c-4 14 20 21 49 13Z"
        fill="url(#raso-lazada)"
      />
      <path
        d="M60 34c15-21 44-26 49-10 4 14-20 21-49 13Z"
        fill="url(#raso-lazada)"
      />
      {/* La veta de luz que recorre cada lazada */}
      <path
        d="M52 30C42 20 27 15 19 19"
        stroke="#ffffff"
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M68 30c10-10 25-15 33-11"
        stroke="#ffffff"
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Los pliegues donde la tela entra al nudo */}
      <path
        d="M60 34c-6-4-11-9-14-14M60 34c6-4 11-9 14-14"
        stroke="#6b93c1"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* Nudo */}
      <ellipse cx="60" cy="34" rx="10" ry="8.5" fill="url(#raso-nudo)" />
      <path
        d="M54 29c3-2 9-2 12 0"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
