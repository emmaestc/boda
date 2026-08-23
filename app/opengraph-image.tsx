import { ImageResponse } from "next/og";
import { wedding } from "@/lib/config/wedding";

export const alt = wedding.seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Imagen que se ve al compartir el enlace por WhatsApp o redes.
 *
 * Se dibuja con primitivas —no carga tipografías externas ni imágenes— para
 * que nunca dependa de una petición de red que pueda fallar al generarla. Si
 * más adelante quieres una imagen propia, basta con borrar este archivo y
 * dejar un `opengraph-image.png` en la misma carpeta.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
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
        {/* Anillos entrelazados */}
        <svg width="150" height="92" viewBox="0 0 200 120" fill="none">
          <circle cx="78" cy="60" r="38" stroke="#c6a867" strokeWidth="6" />
          <circle cx="122" cy="60" r="38" stroke="#c6a867" strokeWidth="6" />
          <path d="M100 29A38 38 0 0 1 116 60" stroke="#e9d8b0" strokeWidth="6" />
        </svg>

        <div
          style={{
            display: "flex",
            fontSize: 78,
            letterSpacing: 14,
            marginTop: 34,
            fontWeight: 300,
          }}
        >
          {wedding.couple.first.toUpperCase()}
        </div>

        <div style={{ display: "flex", fontSize: 44, color: "#c6a867", margin: "6px 0" }}>
          &amp;
        </div>

        <div style={{ display: "flex", fontSize: 78, letterSpacing: 14, fontWeight: 300 }}>
          {wedding.couple.second.toUpperCase()}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            marginTop: 46,
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
            marginTop: 22,
          }}
        >
          {wedding.city.toUpperCase()}
        </div>
      </div>
    ),
    size,
  );
}
