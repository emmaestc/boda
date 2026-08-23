/**
 * Construye enlaces de Google Maps sin coordenadas inventadas: se usa la
 * búsqueda oficial por dirección, que resuelve el punto en el momento y
 * funciona igual en la app nativa de Android/iOS y en el navegador.
 */

type Place = {
  readonly mapsQuery: string;
  readonly mapsUrl: string | null;
};

/** Enlace para abrir la ubicación en Google Maps (app o web). */
export function mapsLink(place: Place): string {
  if (place.mapsUrl) return place.mapsUrl;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    place.mapsQuery,
  )}`;
}

/** Fuente del mapa embebido. No requiere API key ni facturación. */
export function mapsEmbed(place: Place): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(
    place.mapsQuery,
  )}&z=16&output=embed`;
}
