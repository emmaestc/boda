/**
 * Iconografía de la boda, dibujada a línea para que comparta el mismo pulso
 * gráfico que la botánica. Todos heredan `currentColor`.
 */

/** Separador ornamental: dos filetes que nacen de una hoja central. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 24"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 12h84" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.55" />
      <path d="M152 12h84" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.55" />
      <path
        d="M120 3c7 4.5 10.5 7.5 10.5 9S127 19.5 120 21c-7-1.5-10.5-7.5-10.5-9S113 7.5 120 3Z"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <path d="M120 4.5v15" stroke="currentColor" strokeWidth="0.6" opacity="0.7" />
      <circle cx="98" cy="12" r="1.6" fill="currentColor" opacity="0.7" />
      <circle cx="142" cy="12" r="1.6" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

/** Cruz de trazo fino con un halo de luz muy tenue. Discreta por diseño. */
export function Cross({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 72" className={className} fill="none" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="cross-halo" cx="50%" cy="30%" r="55%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="22" r="23" fill="url(#cross-halo)" />
      <path d="M24 4v64M9 22h30" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="24" cy="22" r="2.4" fill="none" stroke="currentColor" strokeWidth="0.7" />
    </svg>
  );
}

/** Silueta de parroquia: nave, torre, aguja y rosetón. */
export function Church({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 108"
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" strokeWidth="1.1">
        <path d="M6 100h108" />
        <path d="M18 100V58h84v42" />
        <path d="M12 58 60 32l48 26" />
        <path d="M46 100V26h28v74" />
        <path d="M42 26 60 8l18 18" />
        <path d="M60 8V0M53 3.5h14" />
        <path d="M54 100V78a6 6 0 0 1 12 0v22" />
        <path d="M56.5 54v-6a3.5 3.5 0 0 1 7 0v6z" />
        <path d="M28 84V70a5 5 0 0 1 10 0v14zM82 84V70a5 5 0 0 1 10 0v14z" />
        <circle cx="60" cy="42" r="4.6" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

/** Paloma en vuelo, con el ala levantada. */
export function Dove({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 64" className={className} fill="none" aria-hidden="true" focusable="false">
      <path
        d="M14 40c6-14 22-22 38-20l10-6-2 8c12 4 20 12 24 22-14-4-28 0-40 8-10 6-22 2-30-12Z"
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M42 32c6-14 20-24 36-26-6 14-18 24-30 30"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d="M20 44c8 4 18 4 26 0" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
      <circle cx="56" cy="21" r="1.1" fill="currentColor" />
    </svg>
  );
}

/** Dos copas brindando, con burbujas que suben. */
export function Glasses({ className = "" }: { className?: string }) {
  const coupe = (
    <>
      <path
        d="M-16 0c0 13 7 21 16 21S16 13 16 0Z"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path d="M-16 0h32" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M0 21v16" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M-9 38h18" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </>
  );
  return (
    <svg viewBox="0 0 120 100" className={className} fill="none" aria-hidden="true" focusable="false">
      <g transform="translate(40 30) rotate(15)">{coupe}</g>
      <g transform="translate(80 30) rotate(-15)">{coupe}</g>
      <g fill="currentColor" opacity="0.55">
        <circle cx="60" cy="14" r="1.6" />
        <circle cx="49" cy="8" r="1.1" />
        <circle cx="71" cy="9" r="1.3" />
        <circle cx="60" cy="3" r="0.9" />
      </g>
    </svg>
  );
}

/** Corazón de línea, para acentos pequeños. */
export function Heart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true" focusable="false">
      <path
        d="M12 21C6.5 17 3 13.8 3 9.8 3 6.6 5.4 4.4 8.2 4.4c1.7 0 3 .8 3.8 2.1.8-1.3 2.1-2.1 3.8-2.1C18.6 4.4 21 6.6 21 9.8c0 4-3.5 7.2-9 11.2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Alfiler de ubicación, para los botones de mapa. */
export function Pin({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true" focusable="false">
      <path
        d="M12 22s7-6.3 7-11.4A7 7 0 0 0 5 10.6C5 15.7 12 22 12 22Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10.4" r="2.6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
