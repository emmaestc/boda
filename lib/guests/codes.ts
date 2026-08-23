import { randomInt } from "node:crypto";

/**
 * Alfabeto sin caracteres ambiguos: fuera 0/O, 1/I/L y U (para no formar
 * palabras por accidente). Los códigos se dictan por teléfono y se leen en
 * pantallas pequeñas, así que la legibilidad importa tanto como la entropía.
 */
const ALPHABET = "ABCDEFGHJKMNPQRSTVWXYZ23456789";
const LENGTH = 10;

/**
 * Código de invitación aleatorio.
 *
 * 30^10 ≈ 5.9 × 10^14 combinaciones: adivinar uno por fuerza bruta es
 * inviable, y aun así el endpoint público está limitado por IP.
 */
export function generateInvitationCode(): string {
  let code = "";
  for (let i = 0; i < LENGTH; i += 1) {
    code += ALPHABET[randomInt(ALPHABET.length)];
  }
  return code;
}

/** Normaliza lo que llega por URL antes de consultarlo. */
export function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase().slice(0, 16);
}

export function isValidCodeShape(code: string): boolean {
  return /^[A-Z0-9]{6,16}$/.test(code);
}
