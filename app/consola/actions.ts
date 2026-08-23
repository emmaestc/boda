"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireSession } from "@/lib/auth/session";
import { guestFormSchema } from "@/lib/guests/schemas";
import { CONFIRMATION_STATUS } from "@/lib/guests/types";
import {
  createGuest,
  deleteGuest,
  regenerateCode,
  updateGuest,
} from "@/lib/guests/repository";

export type ActionResult = { ok: true } | { ok: false; error: string };

const idSchema = z.uuid("Identificador inválido");

/**
 * Toda acción del panel vuelve a comprobar la sesión.
 *
 * El layout ya protege la página, pero una server action es una URL a la que
 * se puede llamar directamente: si la comprobación viviera solo en el layout,
 * cualquiera podría invocar estas funciones sin haber entrado nunca al panel.
 */
async function guard(): Promise<void> {
  await requireSession();
}

function refresh(): void {
  revalidatePath("/consola");
}

function fail(error: unknown): ActionResult {
  const message = error instanceof Error ? error.message : "Algo salió mal.";
  return { ok: false, error: message };
}

export async function crearInvitado(input: unknown): Promise<ActionResult> {
  await guard();
  const parsed = guestFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Revisa los datos." };
  }

  try {
    await createGuest({
      nombre: parsed.data.nombre,
      cantidad_personas_permitidas: parsed.data.cantidad_personas_permitidas,
      telefono: parsed.data.telefono ?? null,
      grupo: parsed.data.grupo ?? null,
    });
    refresh();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function actualizarInvitado(id: string, input: unknown): Promise<ActionResult> {
  await guard();
  const idOk = idSchema.safeParse(id);
  if (!idOk.success) return { ok: false, error: "Identificador inválido." };

  const parsed = guestFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Revisa los datos." };
  }

  try {
    await updateGuest(idOk.data, {
      nombre: parsed.data.nombre,
      cantidad_personas_permitidas: parsed.data.cantidad_personas_permitidas,
      telefono: parsed.data.telefono ?? null,
      grupo: parsed.data.grupo ?? null,
    });
    refresh();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

const estadoSchema = z.object({
  estado: z.enum(CONFIRMATION_STATUS),
  cantidad: z.number().int().min(0).max(20),
});

/** Cambio manual de estado, para las confirmaciones que llegan por WhatsApp. */
export async function cambiarEstado(id: string, input: unknown): Promise<ActionResult> {
  await guard();
  const idOk = idSchema.safeParse(id);
  if (!idOk.success) return { ok: false, error: "Identificador inválido." };

  const parsed = estadoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Estado inválido." };

  try {
    await updateGuest(idOk.data, {
      estado_confirmacion: parsed.data.estado,
      cantidad_asistentes: parsed.data.estado === "confirmado" ? Math.max(1, parsed.data.cantidad) : 0,
    });
    refresh();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function eliminarInvitado(id: string): Promise<ActionResult> {
  await guard();
  const idOk = idSchema.safeParse(id);
  if (!idOk.success) return { ok: false, error: "Identificador inválido." };

  try {
    await deleteGuest(idOk.data);
    refresh();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function regenerarCodigo(id: string): Promise<ActionResult> {
  await guard();
  const idOk = idSchema.safeParse(id);
  if (!idOk.success) return { ok: false, error: "Identificador inválido." };

  try {
    await regenerateCode(idOk.data);
    refresh();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}
