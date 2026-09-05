import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { wedding } from "@/lib/config/wedding";

export const alt = wedding.seo.title;
/**
 * Cuadrada, no apaisada, y por una razón concreta: WhatsApp encaja la vista
 * previa en una miniatura de unos 240 px de lado. Una imagen de 1200x630 se
 * reducía cinco veces ahí dentro y el texto se volvía ilegible. Cuadrada, la
 * miniatura no recorta nada y el monograma llena el hueco entero.
 */
export const size = { width: 1200, height: 1200 };
export const contentType = "image/png";

const { first, second } = wedding.couple.initials;

/*
 * Medida tomada de la tinta real de Great Vibes, la misma que usa el monograma
 * de la web: a cuerpo 40, "J & E" ocupa 115 de ancho. De ahí sale el cuerpo
 * que hace que las iniciales llenen el anillo sin rozarlo.
 */
const ANCHO_TINTA = 115 / 40;

const CENTRO = size.width / 2;
const RADIO = 370;
/** Cuánto del diámetro ocupa la tinta, dejando aire hasta el anillo. */
const LLENADO = 0.72;

const CUERPO = Math.round(((RADIO * 2 * LLENADO) / ANCHO_TINTA) * 10) / 10;

/**
 * La imagen que se ve al compartir el enlace por WhatsApp.
 *
 * Es solo el monograma. Antes llevaba los nombres, la fecha y la ciudad, y a
 * tamaño de miniatura no se leía ni una palabra: a 240 px, una letra de 38
 * quedaba en 7. La información ya viaja en el título y la descripción de la
 * propia tarjeta, así que la imagen puede dedicarse a lo único que funciona a
 * ese tamaño, que es una marca grande y simple.
 *
 * La tipografía se lee del disco, no de la red: esta ruta se genera durante la
 * compilación, así que el archivo se resuelve entonces y en producción no hay
 * ninguna petición que pueda fallar.
 */
export default async function OpenGraphImage() {
  const greatVibes = await readFile(
    join(process.cwd(), "assets", "GreatVibes-Regular.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background:
            "radial-gradient(circle at 50% 42%, #ffffff 0%, #fbf8f2 52%, #f0eae0 100%)",
        }}
      >
        <svg
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          style={{ position: "absolute", top: 0, left: 0 }}
          fill="none"
        >
          <circle cx={CENTRO} cy={CENTRO} r={RADIO} stroke="#c6a867" strokeWidth="7" />
          <circle
            cx={CENTRO}
            cy={CENTRO}
            r={RADIO - 34}
            stroke="#c6a867"
            strokeWidth="3"
            opacity="0.5"
          />
        </svg>

        <div
          style={{
            display: "flex",
            fontFamily: "Great Vibes",
            fontSize: CUERPO,
            color: "#b08f4a",
          }}
        >
          {first} &amp; {second}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Great Vibes", data: greatVibes, weight: 400, style: "normal" }],
    },
  );
}
