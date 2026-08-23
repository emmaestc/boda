import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";
import { generateInvitationCode } from "./codes";
import type { Diet, Guest, GuestStats, PublicGuest } from "./types";

/**
 * Único punto de acceso a la tabla de invitados.
 *
 * Las funciones `public*` devuelven solo lo que puede viajar al navegador; las
 * demás son de uso exclusivo de la consola y nunca se importan desde un
 * componente de cliente.
 */

const PUBLIC_COLUMNS =
  "nombre, codigo_invitacion, cantidad_personas_permitidas, estado_confirmacion, " +
  "cantidad_asistentes, restriccion_alimentaria, restriccion_detalle, comentario";

type PublicRow = {
  nombre: string;
  codigo_invitacion: string;
  cantidad_personas_permitidas: number;
  estado_confirmacion: PublicGuest["estado"];
  cantidad_asistentes: number;
  restriccion_alimentaria: Diet;
  restriccion_detalle: string | null;
  comentario: string | null;
};

function toPublicGuest(row: PublicRow): PublicGuest {
  return {
    nombre: row.nombre,
    codigo: row.codigo_invitacion,
    cupo: row.cantidad_personas_permitidas,
    estado: row.estado_confirmacion,
    asistentes: row.cantidad_asistentes,
    restriccion: row.restriccion_alimentaria,
    restriccionDetalle: row.restriccion_detalle,
    comentario: row.comentario,
  };
}

/** Busca una invitación por su código. Devuelve `null` si no existe. */
export async function findPublicGuest(code: string): Promise<PublicGuest | null> {
  const { data, error } = await supabaseAdmin()
    .from("guests")
    .select(PUBLIC_COLUMNS)
    .eq("codigo_invitacion", code)
    .maybeSingle<PublicRow>();

  if (error || !data) return null;
  return toPublicGuest(data);
}

/** Deja constancia de que la invitación se abrió. Nunca interrumpe la página. */
export async function recordOpening(code: string): Promise<void> {
  try {
    await supabaseAdmin().rpc("registrar_apertura", { p_codigo: code });
  } catch {
    // Es telemetría amable: si falla, la invitación se muestra igual.
  }
}

export type RsvpPayload = {
  codigo: string;
  asiste: boolean;
  cantidad: number;
  restriccion: Diet;
  restriccion_detalle: string | null;
  comentario: string | null;
};

/**
 * Guarda la respuesta de una invitación.
 *
 * El cupo se vuelve a leer del servidor y se recorta aquí: lo que diga el
 * navegador sobre cuántas personas puede traer no es de fiar. Además la base
 * de datos tiene su propia restricción, de modo que ni un error de código
 * podría guardar más asistentes de los permitidos.
 */
export async function saveRsvp(
  payload: RsvpPayload,
): Promise<{ ok: true; guest: PublicGuest } | { ok: false; error: string }> {
  const db = supabaseAdmin();

  const { data: existing, error: findError } = await db
    .from("guests")
    .select("id, cantidad_personas_permitidas")
    .eq("codigo_invitacion", payload.codigo)
    .maybeSingle<{ id: string; cantidad_personas_permitidas: number }>();

  if (findError) return { ok: false, error: "No pudimos guardar tu respuesta. Inténtalo de nuevo." };
  if (!existing) return { ok: false, error: "Esta invitación no existe." };

  const cantidad = payload.asiste
    ? Math.min(Math.max(payload.cantidad, 1), existing.cantidad_personas_permitidas)
    : 0;

  const { data: updated, error: updateError } = await db
    .from("guests")
    .update({
      estado_confirmacion: payload.asiste ? "confirmado" : "no_asiste",
      cantidad_asistentes: cantidad,
      restriccion_alimentaria: payload.asiste ? payload.restriccion : "ninguna",
      restriccion_detalle:
        payload.asiste && payload.restriccion === "otra" ? payload.restriccion_detalle : null,
      comentario: payload.comentario,
      fecha_confirmacion: new Date().toISOString(),
    })
    .eq("id", existing.id)
    .select(PUBLIC_COLUMNS)
    .single<PublicRow>();

  if (updateError || !updated) {
    return { ok: false, error: "No pudimos guardar tu respuesta. Inténtalo de nuevo." };
  }

  // Historial: si más adelante cambia de opinión, la respuesta previa queda.
  await db.from("rsvp_eventos").insert({
    guest_id: existing.id,
    estado: payload.asiste ? "confirmado" : "no_asiste",
    cantidad_asistentes: cantidad,
    restriccion: payload.asiste ? payload.restriccion : "ninguna",
    comentario: payload.comentario,
  });

  return { ok: true, guest: toPublicGuest(updated) };
}

/* ------------------------------------------------------------------ *
 * Consola de administración
 * ------------------------------------------------------------------ */

export async function listGuests(): Promise<Guest[]> {
  const { data, error } = await supabaseAdmin()
    .from("guests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error("No se pudo leer la lista de invitados: " + error.message);
  return (data ?? []) as Guest[];
}

export async function getStats(): Promise<GuestStats> {
  const { data, error } = await supabaseAdmin()
    .from("guest_stats")
    .select("*")
    .single<GuestStats>();

  if (error || !data) {
    return {
      total: 0,
      confirmados: 0,
      no_asisten: 0,
      pendientes: 0,
      personas_confirmadas: 0,
      cupos_totales: 0,
      abiertas_sin_responder: 0,
    };
  }
  return data;
}

export type GuestDraft = {
  nombre: string;
  cantidad_personas_permitidas: number;
  telefono?: string | null;
  grupo?: string | null;
};

/** Crea un invitado con un código único, reintentando si hubiera colisión. */
export async function createGuest(draft: GuestDraft): Promise<Guest> {
  const db = supabaseAdmin();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data, error } = await db
      .from("guests")
      .insert({
        nombre: draft.nombre,
        codigo_invitacion: generateInvitationCode(),
        cantidad_personas_permitidas: draft.cantidad_personas_permitidas,
        telefono: draft.telefono || null,
        grupo: draft.grupo || null,
      })
      .select("*")
      .single<Guest>();

    if (!error && data) return data;
    // 23505 = violación de unicidad: el código ya existía, se prueba otro.
    if (error && error.code !== "23505") {
      throw new Error("No se pudo crear el invitado: " + error.message);
    }
  }
  throw new Error("No se pudo generar un código único. Inténtalo otra vez.");
}

export type GuestPatch = Partial<{
  nombre: string;
  cantidad_personas_permitidas: number;
  telefono: string | null;
  grupo: string | null;
  estado_confirmacion: Guest["estado_confirmacion"];
  cantidad_asistentes: number;
}>;

export async function updateGuest(id: string, patch: GuestPatch): Promise<Guest> {
  const { data, error } = await supabaseAdmin()
    .from("guests")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single<Guest>();

  if (error || !data) {
    throw new Error("No se pudo actualizar el invitado: " + (error?.message ?? "no encontrado"));
  }
  return data;
}

export async function deleteGuest(id: string): Promise<void> {
  const { error } = await supabaseAdmin().from("guests").delete().eq("id", id);
  if (error) throw new Error("No se pudo eliminar el invitado: " + error.message);
}

/** Renueva el código de una invitación (invalida el enlace anterior). */
export async function regenerateCode(id: string): Promise<Guest> {
  const db = supabaseAdmin();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data, error } = await db
      .from("guests")
      .update({ codigo_invitacion: generateInvitationCode() })
      .eq("id", id)
      .select("*")
      .single<Guest>();

    if (!error && data) return data;
    if (error && error.code !== "23505") {
      throw new Error("No se pudo regenerar el código: " + error.message);
    }
  }
  throw new Error("No se pudo generar un código único. Inténtalo otra vez.");
}
