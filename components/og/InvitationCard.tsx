import { wedding } from "@/lib/config/wedding";

/**
 * La tarjeta que dibuja la vista previa de los enlaces.
 *
 * Vive aparte de las rutas que la usan porque hay dos: la genérica de la
 * portada y la personalizada de cada invitación, y son el mismo diseño con una
 * línea de más. Duplicarlo era garantizar que con el tiempo dejaran de
 * parecerse.
 *
 * Se dibuja con primitivas —sin tipografías externas ni imágenes— para que
 * nunca dependa de una petición de red que pueda fallar al generarla. La
 * pintan `satori` e `ImageResponse`, que solo entienden un subconjunto de CSS:
 * de ahí que cada contenedor lleve su `display: flex` explícito.
 */

export const OG_SIZE = { width: 1200, height: 630 };

/** Lo más largo que cabe con holgura en una sola línea. */
const LARGO_MAXIMO = 26;

/**
 * El nombre tal y como debe saludarse en la tarjeta.
 *
 * Cuando no cabe entero se quitan apellidos, no letras: "María Fernanda
 * Restrepo Villegas de la Cuesta" se convierte en "María Fernanda", que sigue
 * siendo un saludo. Cortar por la mitad dejaba cosas como "…Villegas de L…",
 * que en una invitación de boda queda entre descuidado y desafortunado.
 */
function nombreParaTarjeta(nombre: string): string {
  const partes = nombre.replace(/\s+/g, " ").trim().split(" ");

  while (partes.join(" ").length > LARGO_MAXIMO && partes.length > 1) partes.pop();

  const corto = partes.join(" ");
  // Un único nombre imposiblemente largo: aquí ya no queda otra que cortar.
  return corto.length > LARGO_MAXIMO
    ? corto.slice(0, LARGO_MAXIMO - 1).trimEnd() + "…"
    : corto;
}

/** "Ana" y "Diana Gomez Restrepo" no pueden ir al mismo cuerpo. */
function cuerpoDelNombre(largo: number): number {
  return largo <= 16 ? 38 : 32;
}

export function InvitationCard({ guestName }: { guestName?: string | null }) {
  const nombre = guestName ? nombreParaTarjeta(guestName) : null;

  /*
   * Con nombre entra un renglón más en una altura que no crece, así que el
   * resto de la composición se aprieta. Sin este ajuste el saludo tocaba el
   * borde de arriba y la ciudad el de abajo.
   */
  const aire = nombre
    ? { nombre: 24, anillos: 24, fecha: 30, ciudad: 16, pareja: 70, amp: 40 }
    : { nombre: 0, anillos: 34, fecha: 46, ciudad: 22, pareja: 78, amp: 44 };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(120% 90% at 50% 0%, #ffffff 0%, #f4f8fc 45%, #e6eef7 100%)",
        color: "#24384f",
        position: "relative",
      }}
    >
      {nombre && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: aire.nombre,
          }}
        >
          <div style={{ width: 54, height: 1, background: "#c6a867" }} />
          <div
            style={{
              display: "flex",
              fontSize: cuerpoDelNombre(nombre.length),
              letterSpacing: 7,
              color: "#7d6330",
            }}
          >
            PARA {nombre.toUpperCase()}
          </div>
          <div style={{ width: 54, height: 1, background: "#c6a867" }} />
        </div>
      )}

      {/* Anillos entrelazados */}
      <svg width="150" height="92" viewBox="0 0 200 120" fill="none">
        <circle cx="78" cy="60" r="38" stroke="#c6a867" strokeWidth="6" />
        <circle cx="122" cy="60" r="38" stroke="#c6a867" strokeWidth="6" />
        <path d="M100 29A38 38 0 0 1 116 60" stroke="#e9d8b0" strokeWidth="6" />
      </svg>

      <div
        style={{
          display: "flex",
          fontSize: aire.pareja,
          letterSpacing: 14,
          marginTop: aire.anillos,
          fontWeight: 300,
        }}
      >
        {wedding.couple.first.toUpperCase()}
      </div>

      <div style={{ display: "flex", fontSize: aire.amp, color: "#c6a867", margin: "6px 0" }}>
        &amp;
      </div>

      <div style={{ display: "flex", fontSize: aire.pareja, letterSpacing: 14, fontWeight: 300 }}>
        {wedding.couple.second.toUpperCase()}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          marginTop: aire.fecha,
        }}
      >
        <div style={{ width: 90, height: 1, background: "#c6a867" }} />
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 9, color: "#4d6478" }}>
          {wedding.date.day} · {wedding.date.month.toUpperCase()} · {wedding.date.year}
        </div>
        <div style={{ width: 90, height: 1, background: "#c6a867" }} />
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 20,
          letterSpacing: 6,
          color: "#8fa2b3",
          marginTop: aire.ciudad,
        }}
      >
        {wedding.city.toUpperCase()}
      </div>
    </div>
  );
}
