import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { listGuests } from "@/lib/guests/repository";
import { DIET_LABEL, STATUS_LABEL } from "@/lib/guests/types";

export const dynamic = "force-dynamic";

/** Excel espera fin de línea CRLF y una marca de orden de bytes al inicio. */
const CRLF = "\r\n";
const BOM = String.fromCharCode(0xfeff);

/**
 * Escapa un valor para CSV.
 *
 * El prefijo con comilla simple ante `= + - @` evita la inyección de fórmulas:
 * sin él, un nombre que empiece por "=" se ejecutaría como fórmula al abrir el
 * archivo en Excel.
 */
function csvCell(value: string | number | null): string {
  const text = value === null || value === undefined ? "" : String(value);
  const safe = /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
  return '"' + safe.replace(/"/g, '""') + '"';
}

const COLUMNS = [
  "Nombre",
  "Codigo",
  "Grupo",
  "Estado",
  "Lugares reservados",
  "Cupo fijo",
  "Asistentes confirmados",
  "Quienes vienen",
  "Restriccion",
  "Detalle restriccion",
  "Comentario",
  "Fecha de respuesta",
  "Aperturas",
];

export async function GET() {
  // La descarga es una ruta más: también tiene que exigir sesión.
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const guests = await listGuests();

  const rows = guests.map((g) =>
    [
      g.nombre,
      g.codigo_invitacion,
      g.grupo,
      STATUS_LABEL[g.estado_confirmacion],
      g.cantidad_personas_permitidas,
      g.cupo_fijo ? "Si" : "No",
      g.cantidad_asistentes,
      g.nombres_asistentes.join(" | "),
      DIET_LABEL[g.restriccion_alimentaria],
      g.restriccion_detalle,
      g.comentario,
      g.fecha_confirmacion,
      g.aperturas,
    ]
      .map(csvCell)
      .join(";"),
  );

  const csv = BOM + [COLUMNS.map(csvCell).join(";"), ...rows].join(CRLF);
  const today = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="invitados-' + today + '.csv"',
      "Cache-Control": "no-store",
    },
  });
}
