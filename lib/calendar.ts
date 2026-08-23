import { wedding } from "@/lib/config/wedding";

/** 2026-11-06T18:00:00-05:00 → 20261106T230000Z */
function stamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/**
 * Enlace para agendar la ceremonia en Google Calendar. Se abre en una pestaña
 * nueva y no descarga ningún archivo, así que funciona igual en móvil que en
 * escritorio.
 */
export function calendarLink(): string {
  const start = new Date(wedding.date.iso);
  const end = new Date(start.getTime() + 5 * 60 * 60 * 1000);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Matrimonio de " + wedding.couple.first + " y " + wedding.couple.second,
    dates: stamp(start) + "/" + stamp(end),
    details:
      "Ceremonia en " +
      wedding.ceremony.place +
      " (" +
      wedding.ceremony.address +
      ") a las " +
      wedding.ceremony.time +
      ". Recepción en " +
      wedding.reception.place +
      ", " +
      wedding.reception.address +
      ".",
    location: wedding.ceremony.mapsQuery,
    ctz: "America/Bogota",
  });

  return "https://calendar.google.com/calendar/render?" + params.toString();
}
