/**
 * Iconografía propia de la boda. El resto de iconos vienen de lucide-react;
 * aquí solo queda lo que no existe como icono de librería.
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
