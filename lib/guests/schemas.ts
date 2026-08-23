import { z } from "zod";
import { CONFIRMATION_STATUS, DIET } from "./types";

/**
 * Validación de todo lo que entra desde fuera. Nada llega a la base de datos
 * sin pasar por aquí: los tipos de TypeScript no existen en tiempo de
 * ejecución, y una server action es un endpoint público como cualquier otro.
 */

/**
 * Elimina caracteres de control invisibles y recorta espacios. Se filtra por
 * código de carácter en lugar de con una expresión regular para que el propio
 * archivo fuente no contenga bytes no imprimibles.
 */
function sanitize(value: string): string {
  let out = "";
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    if (code > 31 && code !== 127) out += char;
  }
  return out.trim();
}

const cleanText = (max: number) =>
  z.string().transform(sanitize).pipe(z.string().max(max));

export const rsvpInputSchema = z.object({
  codigo: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{6,16}$/, "Código de invitación inválido"),
  asiste: z.boolean(),
  cantidad: z.number().int().min(0).max(20),
  /**
   * Nombres de quienes asisten. Llegan tal cual del formulario, con huecos
   * incluidos: se limpian y se descartan los vacíos antes de guardarlos.
   */
  nombres: z
    .array(cleanText(120))
    .max(20)
    .optional()
    .transform((lista) => (lista ?? []).filter((n) => n.length > 0)),
  restriccion: z.enum(DIET),
  restriccion_detalle: cleanText(120).nullable().optional(),
  comentario: cleanText(500).nullable().optional(),
});

export type RsvpInput = z.infer<typeof rsvpInputSchema>;

export const guestFormSchema = z.object({
  nombre: cleanText(120).pipe(z.string().min(2, "El nombre es obligatorio")),
  cantidad_personas_permitidas: z.coerce.number().int().min(1).max(20),
  grupo: cleanText(60).nullable().optional(),
  estado_confirmacion: z.enum(CONFIRMATION_STATUS).optional(),
  cantidad_asistentes: z.coerce.number().int().min(0).max(20).optional(),
});

export type GuestFormInput = z.infer<typeof guestFormSchema>;

export const loginSchema = z.object({
  usuario: z.string().trim().min(1).max(60),
  clave: z.string().min(1).max(200),
});
